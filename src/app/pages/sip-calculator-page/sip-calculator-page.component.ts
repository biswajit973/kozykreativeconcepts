import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EffectRef,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  effect,
  inject
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, Plugin, registerables } from 'chart.js';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CalculatorService } from '../../shared/services/calculator.service';
import { UiStateService } from '../../shared/services/ui-state.service';

Chart.register(...registerables);

interface SipChartState {
  lossValue: number;
  traditionalValue: number;
  mfValue: number;
  investedValue: number;
}

interface ChartBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface LabelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ValueLabelPoint {
  x: number;
  y: number;
  idx: number;
  text: string;
  font: string;
}

interface DualBadgeLayout {
  extraCircleX: number;
  extraCircleY: number;
  extraCircleRadius: number;
  extraCircleRenderRadius: number;
  extraCircleBox: LabelBox;
  lossBadgeBox: LabelBox;
}

@Component({
  selector: 'app-sip-calculator-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    MobileMenuComponent,
    ContactModalComponent
  ],
  templateUrl: './sip-calculator-page.component.html',
  styleUrl: './sip-calculator-page.component.css'
})
export class SipCalculatorPageComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly calc = inject(CalculatorService);
  readonly ui = inject(UiStateService);
  private readonly doc = inject(DOCUMENT);

  @ViewChild('coreChartCanvas') private coreChartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChartCanvas') private trendChartCanvas?: ElementRef<HTMLCanvasElement>;

  activeChartView: 'core' | 'trend' = 'core';

  private coreChart: Chart<'bar'> | null = null;
  private trendChart: Chart<'line'> | null = null;
  private pulseFrame: number | null = null;

  private readonly chartState: SipChartState = {
    lossValue: 0,
    traditionalValue: 0,
    mfValue: 0,
    investedValue: 0
  };

  private prevBodyOverflow = '';
  private prevHtmlOverflow = '';

  private readonly chartEffect: EffectRef;

  private readonly coreOverlayPlugin: Plugin<'bar'> = {
    id: 'mfExtraGainCallout',
    afterDatasetsDraw: (chart) => {
      const datasetMeta = chart.getDatasetMeta(0);
      const bars = datasetMeta.data;
      if (bars.length < 3) {
        return;
      }

      const chartArea = chart.chartArea;
      const bounds: ChartBounds = {
        top: chartArea.top,
        right: chartArea.right,
        bottom: chartArea.bottom,
        left: chartArea.left
      };
      const compact = chart.width < 560;
      const calloutBounds: ChartBounds = {
        top: chartArea.top + (compact ? 8 : 10),
        right: chartArea.right - (compact ? 12 : 16),
        bottom: chartArea.bottom - 10,
        left: chartArea.left + (compact ? 4 : 8)
      };

      const ctx = chart.ctx;
      const dataset = chart.data.datasets[0];
      const values = dataset.data as number[];
      const colorMap = ['#334155', '#B45309', '#0F766E'];
      const barValueLabelPoints: ValueLabelPoint[] = [];

      const tradBar = bars[1] as unknown as { x: number; y: number };
      const mfBar = bars[2] as unknown as { x: number; y: number; width: number; base: number };

      ctx.save();

      bars.forEach((bar, idx) => {
        const barEl = bar as unknown as { x: number; y: number; base: number };
        const x = barEl.x;
        const y = barEl.y;
        const base = barEl.base;
        const height = Math.abs(base - y);
        const value = Number(values[idx] ?? 0);
        const label = this.calc.fmt(Math.round(value));
        const drawInside = height > (compact ? 46 : 56);

        ctx.font = `${compact ? 700 : 800} ${compact ? 11 : 12}px Outfit, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (drawInside) {
          let insideY = Math.min(base - 10, y + (compact ? 15 : 17));
          if (idx === 2) {
            const mfPreferred = y + Math.max(compact ? 20 : 24, height * 0.7);
            insideY = Math.min(base - 14, mfPreferred);
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(label, x, insideY);
          barValueLabelPoints.push({
            x,
            y: insideY,
            idx,
            text: label,
            font: ctx.font
          });
        } else {
          const topY = Math.max(bounds.top + 11, y - (compact ? 14 : 16));
          ctx.beginPath();
          ctx.moveTo(x, y - 1);
          ctx.lineTo(x, topY + 3);
          ctx.strokeStyle = colorMap[idx] ?? '#64748B';
          ctx.lineWidth = 1.7;
          ctx.stroke();
          ctx.fillStyle = '#0F172A';
          ctx.fillText(label, x, topY);
          barValueLabelPoints.push({
            x,
            y: topY,
            idx,
            text: label,
            font: ctx.font
          });
        }
      });
      const valueLabelObstacles = this.buildValueLabelObstacles(ctx, barValueLabelPoints, compact);

      const mfPillBox = this.drawMfTopCapPill(
        ctx,
        bounds,
        compact,
        mfBar.x,
        mfBar.y,
        Math.round(this.chartState.mfValue)
      );

      const tradY = tradBar.y;
      const mfExtra = Math.max(0, this.chartState.mfValue - this.chartState.traditionalValue);
      const hasExtraGain = mfExtra > 0 && tradY > mfBar.y;

      if (!hasExtraGain) {
        ctx.restore();
        return;
      }

      const extraZone = this.drawCleanExtraZone(
        ctx,
        bounds,
        compact,
        mfBar,
        tradY,
        mfExtra,
        this.chartState.mfValue,
        valueLabelObstacles,
        mfPillBox
      );

      const badgeLayout = this.layoutDualBadges(
        calloutBounds,
        compact,
        tradBar,
        mfBar,
        mfPillBox,
        extraZone.labelBox,
        Math.round(this.chartState.lossValue),
        valueLabelObstacles
      );

      this.drawExtraGainCircleBadge(
        ctx,
        badgeLayout,
        Math.round(this.chartState.lossValue),
        compact,
        true
      );
      this.drawTraditionalLossBadge(ctx, badgeLayout, Math.round(this.chartState.lossValue), compact);

      ctx.restore();
    }
  };

  constructor() {
    this.chartEffect = effect(() => {
      const invested = Math.round(this.calc.sipInvestedNum());
      const traditional = Math.round(this.calc.sipTraditionalNum());
      const mutualFund = Math.round(this.calc.sipMutualFundNum());
      const extraGain = Math.round(this.calc.sipExtraGainNum());

      this.chartState.investedValue = invested;
      this.chartState.traditionalValue = traditional;
      this.chartState.mfValue = mutualFund;
      this.chartState.lossValue = extraGain;

      if (this.coreChart) {
        this.coreChart.data.datasets[0].data = [invested, traditional, mutualFund];
        this.coreChart.update();
      }

      if (this.trendChart) {
        this.updateTrendChartData();
      }

      this.syncPulse();
    });
  }

  get sipUpliftPct(): string {
    const traditional = this.calc.sipTraditionalNum();
    if (traditional <= 0) {
      return '0.0%';
    }
    const uplift = ((this.calc.sipMutualFundNum() - traditional) / traditional) * 100;
    return `${Math.max(0, uplift).toFixed(1)}%`;
  }

  get showExtraGain(): boolean {
    return this.calc.sipHasExtraGain();
  }

  onSipAmountInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(
      rawValue,
      this.calc.sipAmtMin(),
      this.calc.sipAmtMax(),
      this.calc.sipAmtStep(),
      this.calc.sipAmt()
    );
    this.calc.updateSipAmt(nextValue);
  }

  onSipYearsInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(rawValue, 1, 30, 1, this.calc.sipYr());
    this.calc.updateSipYr(nextValue);
  }

  onSipMfRoiInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(rawValue, 5, 15, 1, this.calc.sipRt());
    this.calc.updateSipRt(nextValue);
  }

  onSipTradRoiInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(rawValue, 5, 8, 1, this.calc.sipTradRt());
    this.calc.updateSipTradRt(nextValue);
  }

  ngAfterViewInit(): void {
    const canvas = this.coreChartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.coreChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Invested', 'Traditional Return', 'MF Return'],
        datasets: [
          {
            data: [
              Math.round(this.calc.sipInvestedNum()),
              Math.round(this.calc.sipTraditionalNum()),
              Math.round(this.calc.sipMutualFundNum())
            ],
            backgroundColor: ['#475569', '#D97706', '#0F766E'],
            borderColor: ['#334155', '#B45309', '#0A5D57'],
            borderWidth: 1.6,
            borderRadius: 12,
            maxBarThickness: 98
          }
        ]
      },
      plugins: [this.coreOverlayPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: this.getCoreTopPadding(),
            right: 78,
            left: 12,
            bottom: 10
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
              color: '#1F2937',
              font: {
                size: 13,
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
              color: '#475569',
              font: {
                size: 12,
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

  ngOnInit(): void {
    const html = this.doc.documentElement;
    this.prevBodyOverflow = this.doc.body.style.overflow;
    this.prevHtmlOverflow = html.style.overflow;
    this.doc.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    this.ui.setNavbarScrolled(true);
  }

  toggleTrend(): void {
    this.activeChartView = this.activeChartView === 'core' ? 'trend' : 'core';
    this.syncViewCharts();
  }

  ngOnDestroy(): void {
    this.chartEffect.destroy();
    this.stopPulse();
    this.coreChart?.destroy();
    this.trendChart?.destroy();
    this.doc.body.style.overflow = this.prevBodyOverflow;
    this.doc.documentElement.style.overflow = this.prevHtmlOverflow;
    this.ui.closeAllDrops();
    this.ui.closeMobileMenu();
  }

  private initTrendChart(): void {
    if (this.trendChart) {
      return;
    }
    const canvas = this.trendChartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Invested',
            data: [],
            borderColor: '#475569',
            backgroundColor: '#475569',
            borderWidth: 2.3,
            pointRadius: 2.2,
            pointHoverRadius: 3.6,
            tension: 0.28
          },
          {
            label: 'Traditional Return',
            data: [],
            borderColor: '#B45309',
            backgroundColor: '#B45309',
            borderWidth: 2.3,
            pointRadius: 2.2,
            pointHoverRadius: 3.6,
            tension: 0.28
          },
          {
            label: 'MF Return',
            data: [],
            borderColor: '#0F766E',
            backgroundColor: '#0F766E',
            borderWidth: 3,
            pointRadius: 2.4,
            pointHoverRadius: 4,
            tension: 0.28
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 14,
              boxHeight: 8,
              color: '#334155',
              font: {
                size: 11,
                weight: 700
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctxTooltip) => {
                const value = Number(ctxTooltip.parsed.y ?? 0);
                return `${ctxTooltip.dataset.label}: ${this.calc.fmt(value)}`;
              },
              footer: (items) => {
                const invested = Number(items.find((it) => it.datasetIndex === 0)?.parsed.y ?? 0);
                const traditional = Number(items.find((it) => it.datasetIndex === 1)?.parsed.y ?? 0);
                const mf = Number(items.find((it) => it.datasetIndex === 2)?.parsed.y ?? 0);
                const gain = Math.max(0, mf - traditional);
                const wealth = Math.max(0, mf - invested);
                const lines = [`MF Wealth Gain: ${this.calc.fmt(wealth)}`];
                if (gain > 0) {
                  lines.unshift(`Extra Gain over Traditional investment: ${this.calc.fmt(gain)}`);
                }
                return lines;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(107,130,137,.12)'
            },
            ticks: {
              color: '#475569',
              font: {
                size: 12,
                weight: 600
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(107,130,137,.18)'
            },
            ticks: {
              color: '#64748B',
              font: {
                size: 12,
                weight: 600
              },
              callback: (tickValue) => this.calc.fmt(Number(tickValue))
            }
          }
        }
      }
    });
  }

  private updateTrendChartData(): void {
    if (!this.trendChart) {
      return;
    }

    const series = this.calc.buildSipSeries();
    this.trendChart.data.labels = series.map((point) => `Year ${point.year}`);
    this.trendChart.data.datasets[0].data = series.map((point) => Math.round(point.invested));
    this.trendChart.data.datasets[1].data = series.map((point) => Math.round(point.traditional));
    this.trendChart.data.datasets[2].data = series.map((point) => Math.round(point.mutualFund));
    this.trendChart.update();
  }

  private syncViewCharts(): void {
    if (this.activeChartView === 'trend') {
      setTimeout(() => {
        this.initTrendChart();
        this.updateTrendChartData();
      }, 0);
    } else {
      this.trendChart?.destroy();
      this.trendChart = null;
      setTimeout(() => {
        this.coreChart?.resize();
        this.coreChart?.update('none');
      }, 0);
    }
    this.syncPulse();
  }

  private drawMfTopCapPill(
    ctx: CanvasRenderingContext2D,
    bounds: ChartBounds,
    compact: boolean,
    mfX: number,
    mfY: number,
    mfValue: number
  ): LabelBox {
    const valueText = this.calc.fmt(mfValue);
    let label = `MF Total ${valueText}`;
    const baseFontSize = compact ? 10 : 11;
    let fontSize = baseFontSize;
    ctx.font = `${compact ? 700 : 760} ${fontSize}px Outfit, sans-serif`;
    const horizontalPadding = compact ? 8 : 10;
    const maxPillWidth = Math.max(
      compact ? 96 : 108,
      Math.min(compact ? 156 : 184, (bounds.right - bounds.left) * (compact ? 0.62 : 0.5))
    );
    let pillWidth = Math.ceil(ctx.measureText(label).width + horizontalPadding * 2);
    if (pillWidth > maxPillWidth) {
      label = `MF ${valueText}`;
      pillWidth = Math.ceil(ctx.measureText(label).width + horizontalPadding * 2);
      if (pillWidth > maxPillWidth) {
        fontSize = Math.max(9, baseFontSize - 1);
        ctx.font = `${compact ? 700 : 760} ${fontSize}px Outfit, sans-serif`;
        pillWidth = Math.ceil(ctx.measureText(label).width + horizontalPadding * 2);
      }
    }
    pillWidth = Math.min(pillWidth, maxPillWidth);
    const pillHeight = compact ? 20 : 22;
    const pillX = this.clamp(mfX - pillWidth / 2, bounds.left + 4, bounds.right - pillWidth - 4);
    const railGap = compact ? 6 : 8;
    const railTopMin = 6;
    const railTopMax = Math.max(railTopMin, bounds.top - pillHeight - 2);
    const pillY = this.clamp(bounds.top - pillHeight - railGap, railTopMin, railTopMax);

    const pillBox: LabelBox = {
      x: pillX,
      y: pillY,
      width: pillWidth,
      height: pillHeight
    };

    const stemStartY = pillY + pillHeight;
    const stemEndY = mfY - 3;
    if (stemEndY > stemStartY + 1) {
      ctx.beginPath();
      ctx.moveTo(mfX, stemStartY);
      ctx.lineTo(mfX, stemEndY);
      ctx.strokeStyle = 'rgba(15, 118, 110, .55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    this.drawRoundedRectPath(ctx, pillX, pillY, pillWidth, pillHeight, 9);
    ctx.fillStyle = 'rgba(255, 255, 255, .98)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(15, 118, 110, .72)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0B5E57';
    ctx.fillText(label, pillX + pillWidth / 2, pillY + pillHeight / 2 + 0.2);

    return pillBox;
  }

  private getCoreTopPadding(): number {
    const viewportWidth = this.doc.defaultView?.innerWidth ?? 1280;
    if (viewportWidth <= 520) {
      return 52;
    }
    if (viewportWidth <= 992) {
      return 58;
    }
    return 64;
  }

  private drawCleanExtraZone(
    ctx: CanvasRenderingContext2D,
    bounds: ChartBounds,
    compact: boolean,
    mfBar: { x: number; y: number; width: number },
    tradY: number,
    mfExtra: number,
    mfTotal: number,
    valueLabelObstacles: Array<LabelBox & { idx: number }>,
    mfPillBox: LabelBox
  ): { isSmallExtra: boolean; labelBox: LabelBox | null } {
    const mfBarWidth = Math.max(14, Number(mfBar.width ?? 36));
    const extraTop = mfBar.y + 1;
    const extraBottom = tradY - 1;
    const extraHeight = Math.max(0, extraBottom - extraTop);
    const extraRatio = mfTotal > 0 ? mfExtra / mfTotal : 0;
    const isSmallExtra = extraHeight < 14 || extraRatio < 0.06;
    const minOverlayHeight = 8;
    const leftX = mfBar.x - mfBarWidth / 2 + 1.5;
    const drawWidth = mfBarWidth - 3;
    let overlayTop = extraTop;

    if (isSmallExtra && extraHeight < minOverlayHeight) {
      overlayTop = Math.max(bounds.top + 2, extraBottom - minOverlayHeight);
    }

    const overlayBottom = extraBottom;
    const overlayHeight = Math.max(0, overlayBottom - overlayTop);
    let labelBox: LabelBox | null = null;

    if (overlayHeight > 1 && drawWidth > 2) {
      ctx.fillStyle = 'rgba(204, 251, 241, .98)';
      ctx.fillRect(leftX, overlayTop, drawWidth, overlayHeight);

      const glow = ctx.createLinearGradient(leftX, overlayTop, leftX, overlayBottom);
      glow.addColorStop(0, 'rgba(236, 253, 245, .88)');
      glow.addColorStop(1, 'rgba(20, 184, 166, .14)');
      ctx.fillStyle = glow;
      ctx.fillRect(leftX, overlayTop, drawWidth, overlayHeight);

      ctx.strokeStyle = 'rgba(13, 93, 84, .95)';
      ctx.lineWidth = compact ? 1.35 : 1.7;
      ctx.strokeRect(leftX, overlayTop, drawWidth, overlayHeight);
    }

    const titleText = 'Extra Gain';
    const valueText = this.calc.fmt(Math.round(mfExtra));
    const safePadX = compact ? 4 : 6;
    const safePadY = compact ? 3 : 4;
    const safeRect: LabelBox = {
      x: leftX + safePadX,
      y: overlayTop + safePadY,
      width: Math.max(0, drawWidth - safePadX * 2),
      height: Math.max(0, overlayHeight - safePadY * 2)
    };

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${compact ? 700 : 760} ${compact ? 8 : 9}px Outfit, sans-serif`;
    const titleWidth = ctx.measureText(titleText).width;
    ctx.font = `${compact ? 700 : 760} ${compact ? 9 : 10}px Outfit, sans-serif`;
    const valueWidth = ctx.measureText(valueText).width;
    const needsWidth = Math.max(titleWidth, valueWidth) + 2;
    const canRenderInside = safeRect.height >= (compact ? 24 : 28) && needsWidth <= safeRect.width;

    if (canRenderInside) {
      const midX = safeRect.x + safeRect.width / 2;
      const midY = safeRect.y + safeRect.height / 2;

      ctx.font = `${compact ? 700 : 760} ${compact ? 8 : 9}px Outfit, sans-serif`;
      ctx.fillStyle = '#0F3F3A';
      ctx.fillText(titleText, midX, midY - (compact ? 5 : 6));

      ctx.font = `${compact ? 700 : 800} ${compact ? 9 : 10}px Outfit, sans-serif`;
      ctx.fillStyle = '#0B5E57';
      ctx.fillText(valueText, midX, midY + (compact ? 6 : 7));

      labelBox = {
        x: midX - needsWidth / 2,
        y: midY - (compact ? 11 : 12),
        width: needsWidth,
        height: compact ? 22 : 24
      };
      return { isSmallExtra, labelBox };
    }

    const chipPaddingX = compact ? 8 : 10;
    const chipPaddingY = compact ? 5 : 6;
    ctx.font = `${compact ? 700 : 760} ${compact ? 8 : 9}px Outfit, sans-serif`;
    const chipTitleWidth = ctx.measureText(titleText).width;
    ctx.font = `${compact ? 700 : 780} ${compact ? 9 : 10}px Outfit, sans-serif`;
    const chipValueWidth = ctx.measureText(valueText).width;
    const chipWidth = Math.ceil(Math.max(chipTitleWidth, chipValueWidth) + chipPaddingX * 2);
    const chipHeight = compact ? 24 : 28;
    const initialChip: LabelBox = {
      x: this.clamp(mfBar.x - chipWidth / 2, bounds.left + 6, bounds.right - chipWidth - 6),
      y: Math.max(bounds.top + 6, overlayTop - (compact ? 30 : 34)),
      width: chipWidth,
      height: chipHeight
    };

    const resolvedChip = this.avoidLabelCollision(
      initialChip,
      bounds,
      [mfPillBox, ...valueLabelObstacles],
      compact ? 16 : 20
    );

    ctx.beginPath();
    ctx.moveTo(mfBar.x, overlayTop);
    ctx.lineTo(resolvedChip.x + resolvedChip.width / 2, resolvedChip.y + resolvedChip.height);
    ctx.strokeStyle = 'rgba(13, 93, 84, .78)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    this.drawRoundedRectPath(
      ctx,
      resolvedChip.x,
      resolvedChip.y,
      resolvedChip.width,
      resolvedChip.height,
      compact ? 7 : 8
    );
    ctx.fillStyle = 'rgba(255, 255, 255, .97)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(13, 93, 84, .58)';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    const chipCenterX = resolvedChip.x + resolvedChip.width / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${compact ? 700 : 760} ${compact ? 8 : 9}px Outfit, sans-serif`;
    ctx.fillStyle = '#0F3F3A';
    ctx.fillText(titleText, chipCenterX, resolvedChip.y + (compact ? 8 : 9));
    ctx.font = `${compact ? 700 : 800} ${compact ? 9 : 10}px Outfit, sans-serif`;
    ctx.fillStyle = '#0B5E57';
    ctx.fillText(valueText, chipCenterX, resolvedChip.y + resolvedChip.height - (compact ? 7 : 8));

    labelBox = resolvedChip;
    return { isSmallExtra, labelBox };
  }

  private layoutDualBadges(
    bounds: ChartBounds,
    compact: boolean,
    tradBar: { x: number; y: number },
    mfBar: { x: number; y: number },
    mfPillBox: LabelBox,
    extraLabelBox: LabelBox | null,
    gainValue: number,
    valueLabelObstacles: Array<LabelBox & { idx: number }>
  ): DualBadgeLayout {
    const circleRadius = compact ? 22 : 28;
    const pulseHalo = compact ? 4 : 6;
    const circleStroke = compact ? 2.3 : 2.9;
    const circleRenderRadius = circleRadius + pulseHalo + circleStroke * 0.7 + 2;
    const circleBaseX = this.clamp(
      bounds.right - circleRenderRadius - (compact ? 8 : 12),
      bounds.left + circleRenderRadius + 8,
      bounds.right - circleRenderRadius - 4
    );
    const circleBaseY = this.clamp(
      (tradBar.y + mfBar.y) / 2,
      bounds.top + circleRenderRadius + 4,
      bounds.bottom - circleRenderRadius - 4
    );
    const circleBox: LabelBox = {
      x: circleBaseX - circleRenderRadius,
      y: circleBaseY - circleRenderRadius,
      width: circleRenderRadius * 2,
      height: circleRenderRadius * 2
    };
    const circleObstacles: LabelBox[] = [
      mfPillBox,
      ...valueLabelObstacles,
      ...(extraLabelBox ? [extraLabelBox] : [])
    ];
    const resolvedCircle = this.avoidLabelCollision2D(
      circleBox,
      bounds,
      circleObstacles,
      compact ? 14 : 18,
      compact ? 16 : 20
    );

    const lossText = `Loss -${this.calc.fmt(Math.round(gainValue))} vs MF`;
    const fontSize = compact ? 9 : 10;
    const hPad = compact ? 8 : 10;
    const vPad = compact ? 5 : 6;
    const tempCtx = this.coreChart?.ctx;
    let lossWidth = compact ? 96 : 118;
    if (tempCtx) {
      tempCtx.save();
      tempCtx.font = `700 ${fontSize}px Outfit, sans-serif`;
      lossWidth = Math.ceil(tempCtx.measureText(lossText).width + hPad * 2);
      tempCtx.restore();
    }
    const lossHeight = compact ? 22 : 26;
    const lossBase: LabelBox = {
      x: this.clamp(tradBar.x - lossWidth - (compact ? 8 : 12), bounds.left + 6, bounds.right - lossWidth - 6),
      y: this.clamp(tradBar.y - (compact ? 44 : 50), bounds.top + 6, bounds.bottom - lossHeight - 6),
      width: lossWidth,
      height: lossHeight
    };
    const resolvedLoss = this.avoidLabelCollision2D(
      lossBase,
      bounds,
      [
        resolvedCircle,
        mfPillBox,
        ...valueLabelObstacles,
        ...(extraLabelBox ? [extraLabelBox] : [])
      ],
      compact ? 12 : 14,
      compact ? 14 : 16,
      [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: -2, y: 0 },
        { x: 0, y: -2 },
        { x: 2, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 2 }
      ]
    );

    return {
      extraCircleX: resolvedCircle.x + resolvedCircle.width / 2,
      extraCircleY: resolvedCircle.y + resolvedCircle.height / 2,
      extraCircleRadius: circleRadius,
      extraCircleRenderRadius: circleRenderRadius,
      extraCircleBox: resolvedCircle,
      lossBadgeBox: resolvedLoss
    };
  }

  private drawExtraGainCircleBadge(
    ctx: CanvasRenderingContext2D,
    layout: DualBadgeLayout,
    gainValue: number,
    compact: boolean,
    blinking: boolean
  ): void {
    const pulse = blinking ? 1 + Math.sin(Date.now() / 240) * 0.08 : 1;
    const radius = layout.extraCircleRadius * pulse;

    if (blinking) {
      ctx.beginPath();
      ctx.arc(layout.extraCircleX, layout.extraCircleY, radius + (compact ? 4 : 6), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 118, 110, .14)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(layout.extraCircleX, layout.extraCircleY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.99)';
    ctx.fill();
    ctx.strokeStyle = '#0F766E';
    ctx.lineWidth = compact ? 2.3 : 2.9;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${compact ? 700 : 800} ${compact ? 9 : 10}px Outfit, sans-serif`;
    ctx.fillStyle = '#0B5E57';
    ctx.fillText('Extra Gain', layout.extraCircleX, layout.extraCircleY - (compact ? 8 : 9));
    ctx.font = `${compact ? 700 : 800} ${compact ? 10 : 12}px Outfit, sans-serif`;
    ctx.fillStyle = '#065F46';
    ctx.fillText(this.calc.fmt(Math.round(gainValue)), layout.extraCircleX, layout.extraCircleY + (compact ? 7 : 8));
  }

  private drawTraditionalLossBadge(
    ctx: CanvasRenderingContext2D,
    layout: DualBadgeLayout,
    gainValue: number,
    compact: boolean
  ): void {
    const { lossBadgeBox } = layout;
    this.drawRoundedRectPath(
      ctx,
      lossBadgeBox.x,
      lossBadgeBox.y,
      lossBadgeBox.width,
      lossBadgeBox.height,
      compact ? 8 : 9
    );
    ctx.fillStyle = 'rgba(255,255,255,.99)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(220, 38, 38, .84)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${compact ? 700 : 760} ${compact ? 9 : 10}px Outfit, sans-serif`;
    ctx.fillStyle = '#991B1B';
    const label = `Loss -${this.calc.fmt(Math.round(gainValue))} vs MF`;
    ctx.fillText(label, lossBadgeBox.x + lossBadgeBox.width / 2, lossBadgeBox.y + lossBadgeBox.height / 2);
  }

  private buildValueLabelObstacles(
    ctx: CanvasRenderingContext2D,
    points: ValueLabelPoint[],
    compact: boolean
  ): Array<LabelBox & { idx: number }> {
    return points.map((point) => {
      ctx.save();
      ctx.font = point.font;
      const measuredWidth = Math.ceil(ctx.measureText(point.text).width);
      ctx.restore();

      const basePadX = compact ? 8 : 10;
      const basePadY = compact ? 4 : 5;
      const primaryPadBoost = point.idx === 1 ? (compact ? 8 : 10) : 0;
      const width = measuredWidth + basePadX * 2 + primaryPadBoost;
      const height = (compact ? 14 : 16) + basePadY;

      return {
        idx: point.idx,
        x: point.x - width / 2,
        y: point.y - height / 2,
        width,
        height
      };
    });
  }

  private avoidLabelCollision2D(
    preferredBox: LabelBox,
    bounds: ChartBounds,
    obstacles: LabelBox[],
    stepX: number,
    stepY: number,
    priority?: Array<{ x: number; y: number }>
  ): LabelBox {
    const maxX = bounds.right - preferredBox.width - 4;
    const minX = bounds.left + 4;
    const maxY = bounds.bottom - preferredBox.height - 4;
    const minY = bounds.top + 4;

    const offsets =
      priority ?? [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: 1 },
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: -2 },
        { x: 0, y: 2 }
      ];

    for (const offset of offsets) {
      const candidate: LabelBox = {
        x: this.clamp(preferredBox.x + offset.x * stepX, minX, maxX),
        y: this.clamp(preferredBox.y + offset.y * stepY, minY, maxY),
        width: preferredBox.width,
        height: preferredBox.height
      };
      const hasOverlap = obstacles.some((obstacle) => this.boxesIntersect(candidate, obstacle, 4));
      if (!hasOverlap) {
        return candidate;
      }
    }

    return {
      x: this.clamp(preferredBox.x, minX, maxX),
      y: this.clamp(preferredBox.y, minY, maxY),
      width: preferredBox.width,
      height: preferredBox.height
    };
  }

  private avoidLabelCollision(
    preferredBox: LabelBox,
    bounds: ChartBounds,
    obstacles: LabelBox[],
    step: number
  ): LabelBox {
    const maxX = bounds.right - preferredBox.width - 4;
    const minX = bounds.left + 4;
    const baseX = this.clamp(preferredBox.x, minX, maxX);
    const maxY = bounds.bottom - preferredBox.height - 4;
    const minY = bounds.top + 4;
    const offsets = [0, -step, step, -step * 2, step * 2, -step * 3, step * 3];

    for (const offset of offsets) {
      const candidate: LabelBox = {
        x: baseX,
        y: this.clamp(preferredBox.y + offset, minY, maxY),
        width: preferredBox.width,
        height: preferredBox.height
      };
      const hasOverlap = obstacles.some((obstacle) => this.boxesIntersect(candidate, obstacle, 4));
      if (!hasOverlap) {
        return candidate;
      }
    }

    return {
      x: baseX,
      y: this.clamp(preferredBox.y, minY, maxY),
      width: preferredBox.width,
      height: preferredBox.height
    };
  }

  private boxesIntersect(a: LabelBox, b: LabelBox, padding: number = 0): boolean {
    return !(
      a.x + a.width + padding < b.x ||
      b.x + b.width + padding < a.x ||
      a.y + a.height + padding < b.y ||
      b.y + b.height + padding < a.y
    );
  }

  private drawRoundedRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private sanitizeNumericInput(rawValue: string | number, min: number, max: number, step: number, fallback: number): number {
    let parsedValue: number;
    if (typeof rawValue === 'string') {
      const normalized = rawValue.trim();
      if (!normalized) {
        return fallback;
      }
      parsedValue = Number(normalized);
    } else {
      parsedValue = rawValue;
    }

    if (!Number.isFinite(parsedValue)) {
      return fallback;
    }

    const clamped = Math.min(max, Math.max(min, parsedValue));
    const snapped = min + Math.round((clamped - min) / step) * step;
    const precision = this.getStepPrecision(step);
    const rounded = Number(snapped.toFixed(precision));
    return Math.min(max, Math.max(min, rounded));
  }

  private getStepPrecision(step: number): number {
    const text = String(step);
    const decimalIndex = text.indexOf('.');
    if (decimalIndex < 0) {
      return 0;
    }
    return text.length - decimalIndex - 1;
  }

  private shouldAnimateExtraPulse(): boolean {
    return this.activeChartView === 'core' && this.chartState.lossValue > 0;
  }

  private readonly pulseTick = (): void => {
    if (!this.coreChart || !this.shouldAnimateExtraPulse()) {
      this.stopPulse();
      return;
    }
    this.coreChart.draw();
    this.pulseFrame = window.requestAnimationFrame(this.pulseTick);
  };

  private syncPulse(): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (this.shouldAnimateExtraPulse()) {
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
