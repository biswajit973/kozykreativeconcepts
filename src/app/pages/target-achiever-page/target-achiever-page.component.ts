import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EffectRef,
  ElementRef,
  OnDestroy,
  OnInit,
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

interface TargetChartState {
  mfSip: number;
  fdSip: number;
  extraMonthly: number;
}

interface TargetBadgeLayout {
  mfCircleX: number;
  mfCircleY: number;
  mfCircleRadius: number;
  fdBadgeBox: LabelBox;
}

@Component({
  selector: 'app-target-achiever-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, MobileMenuComponent, ContactModalComponent],
  templateUrl: './target-achiever-page.component.html',
  styleUrl: './target-achiever-page.component.css'
})
export class TargetAchieverPageComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly calc = inject(CalculatorService);
  readonly ui = inject(UiStateService);
  private readonly doc = inject(DOCUMENT);

  @ViewChild('targetCoreChartCanvas') private targetCoreChartCanvas?: ElementRef<HTMLCanvasElement>;

  private targetChart: Chart<'bar'> | null = null;
  private pulseFrame: number | null = null;
  private prevBodyOverflow = '';
  private prevHtmlOverflow = '';

  private readonly chartState: TargetChartState = {
    mfSip: 0,
    fdSip: 0,
    extraMonthly: 0
  };

  private readonly chartEffect: EffectRef;

  private readonly coreOverlayPlugin: Plugin<'bar'> = {
    id: 'targetFdMfBurdenOverlay',
    afterDatasetsDraw: (chart) => {
      const datasetMeta = chart.getDatasetMeta(0);
      const bars = datasetMeta.data;
      if (bars.length < 3) {
        return;
      }

      const chartArea = chart.chartArea;
      const compact = chart.width < 560;
      const bounds: ChartBounds = {
        top: chartArea.top,
        right: chartArea.right,
        bottom: chartArea.bottom,
        left: chartArea.left
      };
      const calloutBounds: ChartBounds = {
        top: chartArea.top + (compact ? 8 : 10),
        right: chartArea.right - (compact ? 12 : 16),
        bottom: chartArea.bottom - 10,
        left: chartArea.left + (compact ? 4 : 8)
      };

      const ctx = chart.ctx;
      const dataset = chart.data.datasets[0];
      const values = dataset.data as number[];
      const colorMap = ['#0F766E', '#B45309', this.chartState.extraMonthly > 0 ? '#DC2626' : '#64748B'];
      const barValueLabelPoints: ValueLabelPoint[] = [];

      const fdBar = bars[1] as unknown as { x: number; y: number };

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
          const insideY = Math.min(base - 10, y + (compact ? 16 : 18));
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
          const topY = Math.max(bounds.top + 12, y - (compact ? 15 : 17));
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
      const hasFdBurden = this.chartState.extraMonthly > 0;

      if (!hasFdBurden) {
        this.drawNeutralGapBadge(ctx, calloutBounds, compact, valueLabelObstacles);
        ctx.restore();
        return;
      }

      const badgeLayout = this.layoutTargetBadges(
        calloutBounds,
        compact,
        fdBar,
        Math.round(this.chartState.extraMonthly),
        valueLabelObstacles
      );

      this.drawMfSavingsCircle(ctx, badgeLayout, Math.round(this.chartState.extraMonthly), compact, true);
      this.drawFdBurdenBadge(ctx, badgeLayout, Math.round(this.chartState.extraMonthly), compact);

      ctx.restore();
    }
  };

  constructor() {
    this.chartEffect = effect(() => {
      const mfSip = Math.round(this.calc.tgtMfSipNum());
      const fdSip = Math.round(this.calc.tgtFdSipNum());
      const extraMonthly = Math.round(this.calc.tgtExtraMonthlyNum());
      const hasFdBurden = this.calc.tgtHasFdBurden();

      this.chartState.mfSip = mfSip;
      this.chartState.fdSip = fdSip;
      this.chartState.extraMonthly = extraMonthly;

      if (this.targetChart) {
        const dataset = this.targetChart.data.datasets[0];
        dataset.data = [mfSip, fdSip, Math.max(0, extraMonthly)];
        dataset.backgroundColor = hasFdBurden
          ? ['#0F766E', '#D97706', '#DC2626']
          : ['#0F766E', '#D97706', '#94A3B8'];
        dataset.borderColor = hasFdBurden
          ? ['#0A5D57', '#B45309', '#B91C1C']
          : ['#0A5D57', '#B45309', '#64748B'];
        this.targetChart.update();
      }

      this.syncPulse();
    });
  }

  get hasFdBurden(): boolean {
    return this.calc.tgtHasFdBurden();
  }

  onTargetAmtInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(rawValue, 50000, 50000000, 50000, this.calc.tgtAmt());
    this.calc.updateTgtAmt(nextValue);
  }

  onTargetYearsInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(rawValue, 1, 30, 1, this.calc.tgtYr());
    this.calc.updateTgtYr(nextValue);
  }

  onTargetMfRoiInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(rawValue, 8, 15, 1, this.calc.tgtRt());
    this.calc.updateTgtRt(nextValue);
  }

  onTargetFdRoiInput(rawValue: string | number): void {
    const nextValue = this.sanitizeNumericInput(rawValue, 5, 8, 1, this.calc.tgtFdRt());
    this.calc.updateTgtFdRt(nextValue);
  }

  ngOnInit(): void {
    const html = this.doc.documentElement;
    this.prevBodyOverflow = this.doc.body.style.overflow;
    this.prevHtmlOverflow = html.style.overflow;
    this.doc.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    this.ui.setNavbarScrolled(true);
  }

  ngAfterViewInit(): void {
    const canvas = this.targetCoreChartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.targetChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['MF Monthly SIP Needed', 'FD Monthly SIP Needed', 'Extra FD Monthly Needed'],
        datasets: [
          {
            data: [
              Math.round(this.calc.tgtMfSipNum()),
              Math.round(this.calc.tgtFdSipNum()),
              Math.round(this.calc.tgtExtraMonthlyNum())
            ],
            backgroundColor: this.calc.tgtHasFdBurden()
              ? ['#0F766E', '#D97706', '#DC2626']
              : ['#0F766E', '#D97706', '#94A3B8'],
            borderColor: this.calc.tgtHasFdBurden()
              ? ['#0A5D57', '#B45309', '#B91C1C']
              : ['#0A5D57', '#B45309', '#64748B'],
            borderWidth: 1.6,
            borderRadius: 12,
            maxBarThickness: 96
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
            right: 88,
            left: 12,
            bottom: 10
          }
        },
        animation: {
          duration: 920,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (ctxTooltip) => `${ctxTooltip.label}: ${this.calc.fmt(Number(ctxTooltip.parsed.y ?? 0))}`
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

  ngOnDestroy(): void {
    this.chartEffect.destroy();
    this.stopPulse();
    this.targetChart?.destroy();
    this.doc.body.style.overflow = this.prevBodyOverflow;
    this.doc.documentElement.style.overflow = this.prevHtmlOverflow;
    this.ui.closeAllDrops();
    this.ui.closeMobileMenu();
  }

  private syncPulse(): void {
    if (!this.calc.tgtHasFdBurden()) {
      this.stopPulse();
      return;
    }
    if (this.pulseFrame !== null || !this.targetChart) {
      return;
    }
    const animate = (): void => {
      if (!this.targetChart || !this.calc.tgtHasFdBurden()) {
        this.stopPulse();
        return;
      }
      this.targetChart.update('none');
      this.pulseFrame = requestAnimationFrame(animate);
    };
    this.pulseFrame = requestAnimationFrame(animate);
  }

  private stopPulse(): void {
    if (this.pulseFrame !== null) {
      cancelAnimationFrame(this.pulseFrame);
      this.pulseFrame = null;
    }
  }

  private getCoreTopPadding(): number {
    const viewportWidth = this.doc.defaultView?.innerWidth ?? 1280;
    if (viewportWidth <= 520) {
      return 48;
    }
    if (viewportWidth <= 992) {
      return 54;
    }
    return 60;
  }

  private drawNeutralGapBadge(
    ctx: CanvasRenderingContext2D,
    bounds: ChartBounds,
    compact: boolean,
    obstacles: LabelBox[]
  ): void {
    const text = 'No monthly burden gap';
    ctx.font = `${compact ? 700 : 760} ${compact ? 9 : 10}px Outfit, sans-serif`;
    const padX = compact ? 9 : 11;
    const badgeW = Math.ceil(ctx.measureText(text).width + padX * 2);
    const badgeH = compact ? 23 : 27;
    const baseBox: LabelBox = {
      x: bounds.right - badgeW - 6,
      y: bounds.top + 8,
      width: badgeW,
      height: badgeH
    };
    const resolved = this.avoidLabelCollision2D(
      baseBox,
      bounds,
      obstacles,
      compact ? 12 : 14,
      compact ? 12 : 14
    );

    this.drawRoundedRectPath(ctx, resolved.x, resolved.y, resolved.width, resolved.height, compact ? 8 : 9);
    ctx.fillStyle = 'rgba(248, 250, 252, .98)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(100, 116, 139, .7)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#475569';
    ctx.fillText(text, resolved.x + resolved.width / 2, resolved.y + resolved.height / 2 + 0.2);
  }

  private layoutTargetBadges(
    bounds: ChartBounds,
    compact: boolean,
    fdBar: { x: number; y: number },
    extraValue: number,
    obstacles: LabelBox[]
  ): TargetBadgeLayout {
    const circleRadius = compact ? 22 : 28;
    const pulseHalo = compact ? 4 : 6;
    const stroke = compact ? 2.3 : 2.9;
    const renderRadius = circleRadius + pulseHalo + stroke * 0.7 + 2;
    const circleBox: LabelBox = {
      x: bounds.right - renderRadius * 2 - (compact ? 8 : 10),
      y: this.clamp(fdBar.y + (compact ? 30 : 38), bounds.top + 10, bounds.bottom - renderRadius * 2 - 8),
      width: renderRadius * 2,
      height: renderRadius * 2
    };
    const resolvedCircle = this.avoidLabelCollision2D(
      circleBox,
      bounds,
      obstacles,
      compact ? 14 : 18,
      compact ? 14 : 18
    );

    const text = `FD +${this.calc.fmt(Math.round(extraValue))}/mo`;
    const fontSize = compact ? 9 : 10;
    const hPad = compact ? 8 : 10;
    const vPad = compact ? 5 : 6;
    const tempCtx = this.targetChart?.ctx;
    let badgeWidth = compact ? 96 : 122;
    if (tempCtx) {
      tempCtx.save();
      tempCtx.font = `700 ${fontSize}px Outfit, sans-serif`;
      badgeWidth = Math.ceil(tempCtx.measureText(text).width + hPad * 2);
      tempCtx.restore();
    }
    const badgeHeight = compact ? 22 : 26;
    const preferredLossBox: LabelBox = {
      x: fdBar.x - badgeWidth - (compact ? 10 : 14),
      y: fdBar.y - (compact ? 46 : 52),
      width: badgeWidth,
      height: badgeHeight
    };
    const resolvedLoss = this.avoidLabelCollision2D(
      preferredLossBox,
      bounds,
      [resolvedCircle, ...obstacles],
      compact ? 12 : 14,
      compact ? 12 : 14,
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
      mfCircleX: resolvedCircle.x + resolvedCircle.width / 2,
      mfCircleY: resolvedCircle.y + resolvedCircle.height / 2,
      mfCircleRadius: circleRadius,
      fdBadgeBox: resolvedLoss
    };
  }

  private drawMfSavingsCircle(
    ctx: CanvasRenderingContext2D,
    layout: TargetBadgeLayout,
    extraValue: number,
    compact: boolean,
    blinking: boolean
  ): void {
    const pulse = blinking ? 1 + Math.sin(Date.now() / 230) * 0.08 : 1;
    const radius = layout.mfCircleRadius * pulse;

    if (blinking) {
      ctx.beginPath();
      ctx.arc(layout.mfCircleX, layout.mfCircleY, radius + (compact ? 4 : 6), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 118, 110, .14)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(layout.mfCircleX, layout.mfCircleY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.99)';
    ctx.fill();
    ctx.strokeStyle = '#0F766E';
    ctx.lineWidth = compact ? 2.3 : 2.9;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${compact ? 700 : 800} ${compact ? 9 : 10}px Outfit, sans-serif`;
    ctx.fillStyle = '#0B5E57';
    ctx.fillText('MF Saves', layout.mfCircleX, layout.mfCircleY - (compact ? 8 : 9));
    ctx.font = `${compact ? 700 : 800} ${compact ? 9 : 11}px Outfit, sans-serif`;
    ctx.fillStyle = '#065F46';
    ctx.fillText(`${this.calc.fmt(Math.round(extraValue))}/mo`, layout.mfCircleX, layout.mfCircleY + (compact ? 7 : 8));
  }

  private drawFdBurdenBadge(
    ctx: CanvasRenderingContext2D,
    layout: TargetBadgeLayout,
    extraValue: number,
    compact: boolean
  ): void {
    const { fdBadgeBox } = layout;
    this.drawRoundedRectPath(
      ctx,
      fdBadgeBox.x,
      fdBadgeBox.y,
      fdBadgeBox.width,
      fdBadgeBox.height,
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
    ctx.fillText(
      `FD +${this.calc.fmt(Math.round(extraValue))}/mo`,
      fdBadgeBox.x + fdBadgeBox.width / 2,
      fdBadgeBox.y + fdBadgeBox.height / 2
    );
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
}
