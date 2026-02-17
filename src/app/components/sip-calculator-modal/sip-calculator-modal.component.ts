import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EffectRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject
} from '@angular/core';
import { Chart, Plugin, registerables } from 'chart.js';
import { CalculatorService } from '../../shared/services/calculator.service';
import { UiStateService } from '../../shared/services/ui-state.service';

Chart.register(...registerables);

interface SipChartState {
  lossValue: number;
  traditionalValue: number;
  mfValue: number;
}

@Component({
  selector: 'app-sip-calculator-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sip-calculator-modal.component.html',
  styleUrl: './sip-calculator-modal.component.css'
})
export class SipCalculatorModalComponent implements AfterViewInit, OnDestroy {
  readonly calc = inject(CalculatorService);
  readonly ui = inject(UiStateService);

  @ViewChild('sipChartCanvas') private sipChartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart: Chart<'bar'> | null = null;
  private readonly chartState: SipChartState = {
    lossValue: 0,
    traditionalValue: 0,
    mfValue: 0
  };
  private readonly chartEffect: EffectRef;
  private readonly modalEffect: EffectRef;
  private pulseFrame: number | null = null;

  private readonly mfLossCalloutPlugin: Plugin<'bar'> = {
    id: 'mfLossCallout',
    afterDatasetsDraw: (chart) => {
      const datasetMeta = chart.getDatasetMeta(0);
      const traditionalBar = datasetMeta.data[1];
      const mutualFundBar = datasetMeta.data[2];
      if (!traditionalBar || !mutualFundBar) {
        return;
      }

      const tradY = Number((traditionalBar as unknown as { y: number }).y);
      const tradX = Number((traditionalBar as unknown as { x: number }).x);
      const mfY = Number((mutualFundBar as unknown as { y: number }).y);
      const mfX = Number((mutualFundBar as unknown as { x: number }).x);
      const lossValue = this.chartState.lossValue;
      const { top, right, bottom, left } = chart.chartArea;

      const compact = chart.width < 420;
      const baseRadius = compact ? 24 : 30;
      const ringPulse = lossValue > 0 ? 1 + Math.sin(Date.now() / 300) * 0.05 : 1;
      const radius = baseRadius * ringPulse;
      const gap = Math.abs(tradY - mfY);
      const centerX = (tradX + mfX) / 2;
      let ringX = centerX;
      if (gap < baseRadius * 2 + 12) {
        ringX = Math.min(right - baseRadius - 12, centerX + (compact ? 26 : 36));
      }
      const ringY = Math.max(
        top + baseRadius + 16,
        Math.min(bottom - (compact ? 52 : 60), (tradY + mfY) / 2)
      );
      const safeRingX = Math.max(left + baseRadius + 10, Math.min(right - baseRadius - 10, ringX));
      const arrowX = Math.max(left + 8, Math.min(right - 8, centerX));
      const arrowStartY = Math.min(tradY, mfY) + 8;
      const arrowEndY = Math.max(tradY, mfY) - 8;

      const ctx = chart.ctx;
      ctx.save();

      if (arrowEndY - arrowStartY > 12) {
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowStartY);
        ctx.lineTo(arrowX, arrowEndY);
        ctx.strokeStyle = lossValue > 0 ? '#D92D20' : '#94A3B8';
        ctx.lineWidth = compact ? 2 : 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowEndY);
        ctx.lineTo(arrowX - 6, arrowEndY - 8);
        ctx.lineTo(arrowX + 6, arrowEndY - 8);
        ctx.closePath();
        ctx.fillStyle = lossValue > 0 ? '#D92D20' : '#94A3B8';
        ctx.fill();

        if (Math.abs(safeRingX - arrowX) > 14) {
          ctx.beginPath();
          ctx.setLineDash([4, 3]);
          ctx.moveTo(arrowX, ringY);
          ctx.lineTo(safeRingX - (safeRingX > arrowX ? baseRadius : -baseRadius), ringY);
          ctx.strokeStyle = lossValue > 0 ? 'rgba(217,45,32,.75)' : 'rgba(148,163,184,.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      ctx.beginPath();
      ctx.arc(safeRingX, ringY, radius, 0, Math.PI * 2);
      ctx.fillStyle = lossValue > 0 ? 'rgba(255,241,242,.98)' : 'rgba(248,250,252,.97)';
      ctx.fill();
      ctx.lineWidth = compact ? 2.5 : 3;
      ctx.strokeStyle = lossValue > 0 ? '#D92D20' : '#94A3B8';
      ctx.stroke();

      if (lossValue > 0) {
        ctx.font = `700 ${compact ? 9 : 10}px Outfit, sans-serif`;
        ctx.fillStyle = '#9F1239';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Missed', safeRingX, ringY - (compact ? 7 : 8));

        ctx.font = `800 ${compact ? 10 : 12}px Outfit, sans-serif`;
        ctx.fillStyle = '#7F1D1D';
        ctx.fillText(this.calc.fmt(Math.round(lossValue)), safeRingX, ringY + (compact ? 7 : 8));
      } else {
        ctx.font = `700 ${compact ? 9 : 10}px Outfit, sans-serif`;
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No loss gap', safeRingX, ringY);
      }

      ctx.restore();
    }
  };

  constructor() {
    this.chartEffect = effect(() => {
      const invested = Math.round(this.calc.sipInvestedNum());
      const traditional = Math.round(this.calc.sipTraditionalNum());
      const mutualFund = Math.round(this.calc.sipMutualFundNum());
      const loss = Math.round(this.calc.sipLossNum());

      this.chartState.lossValue = loss;
      this.chartState.traditionalValue = traditional;
      this.chartState.mfValue = mutualFund;

      if (!this.chart) {
        return;
      }
      this.chart.data.datasets[0].data = [invested, traditional, mutualFund];
      this.chart.update();
      this.syncPulse();
    });

    this.modalEffect = effect(() => {
      const open = this.ui.isModalOpen('sipModal');
      if (!this.chart) {
        return;
      }
      if (open) {
        setTimeout(() => {
          if (!this.chart || !this.ui.isModalOpen('sipModal')) {
            return;
          }
          this.chart.resize();
          this.chart.update('none');
          this.syncPulse();
        }, 60);
      } else {
        this.stopPulse();
      }
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.sipChartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Invested Amount', 'Traditional Return', 'Mutual Fund Return'],
        datasets: [
          {
            data: [
              Math.round(this.calc.sipInvestedNum()),
              Math.round(this.calc.sipTraditionalNum()),
              Math.round(this.calc.sipMutualFundNum())
            ],
            backgroundColor: ['#9EAAB5', '#D97706', '#028090'],
            borderColor: ['#7C8794', '#B45309', '#0E7490'],
            borderWidth: 1.6,
            borderRadius: 10,
            maxBarThickness: 92
          }
        ]
      },
      plugins: [this.mfLossCalloutPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 24,
            right: 28,
            left: 12,
            bottom: 12
          }
        },
        animation: {
          duration: 950,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (ctxTooltip) => {
                const value = Number(ctxTooltip.parsed.y ?? 0);
                return `${ctxTooltip.label}: ${this.calc.fmt(value)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#2D3E44',
              font: {
                size: 12,
                weight: 700
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(107,130,137,.2)'
            },
            ticks: {
              color: '#6B8289',
              font: {
                size: 11,
                weight: 600
              },
              callback: (tickValue) => this.calc.fmt(Number(tickValue))
            }
          }
        }
      }
    });
    this.syncPulse();
  }

  ngOnDestroy(): void {
    this.chartEffect.destroy();
    this.modalEffect.destroy();
    this.stopPulse();
    this.chart?.destroy();
  }

  close(): void {
    this.ui.closeModal('sipModal');
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private readonly pulseTick = (): void => {
    if (!this.chart || !this.ui.isModalOpen('sipModal') || this.chartState.lossValue <= 0) {
      this.stopPulse();
      return;
    }
    this.chart.draw();
    this.pulseFrame = window.requestAnimationFrame(this.pulseTick);
  };

  private syncPulse(): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (this.ui.isModalOpen('sipModal') && this.chartState.lossValue > 0) {
      if (this.pulseFrame === null) {
        this.pulseFrame = window.requestAnimationFrame(this.pulseTick);
      }
      return;
    }
    this.stopPulse();
  }

  private stopPulse(): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (this.pulseFrame !== null) {
      window.cancelAnimationFrame(this.pulseFrame);
      this.pulseFrame = null;
    }
  }
}
