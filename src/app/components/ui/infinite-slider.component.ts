import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { LogoItem } from './logo-item.model';

@Component({
  selector: 'app-infinite-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinite-slider.component.html',
  styleUrl: './infinite-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteSliderComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() items: LogoItem[] = [];
  @Input() gap = 42;
  @Input() speed = 80;
  @Input() reverse = true;
  @Input() pauseOnHover = true;
  @Input() pauseOnTouch = true;

  @ViewChild('segmentRef') private segmentRef?: ElementRef<HTMLDivElement>;

  shiftDistancePx = 1;
  animationDurationSec = 22;
  isPaused = false;
  prefersReducedMotion = false;

  private readonly brokenLogoAltSet = new Set<string>();
  private resizeObserver: ResizeObserver | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null;
  private resizeFrameId: number | null = null;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.initReducedMotionPreference();
    this.initResizeObserver();
    this.scheduleRecalculation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['items'] ||
      changes['gap'] ||
      changes['speed'] ||
      changes['reverse']
    ) {
      this.scheduleRecalculation();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
    if (this.resizeFrameId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.resizeFrameId);
      this.resizeFrameId = null;
    }
  }

  get shouldAnimate(): boolean {
    return !this.prefersReducedMotion && this.items.length > 1;
  }

  get isAltBroken(): (alt: string) => boolean {
    return (alt: string): boolean => this.brokenLogoAltSet.has(alt);
  }

  onImageError(alt: string): void {
    if (!this.brokenLogoAltSet.has(alt)) {
      this.brokenLogoAltSet.add(alt);
    }
  }

  onHoverStart(): void {
    if (!this.pauseOnHover || !this.shouldAnimate) {
      return;
    }
    this.isPaused = true;
  }

  onHoverEnd(): void {
    if (!this.pauseOnHover || !this.shouldAnimate) {
      return;
    }
    this.isPaused = false;
  }

  onTouchStart(): void {
    if (!this.pauseOnTouch || !this.shouldAnimate) {
      return;
    }
    this.isPaused = true;
  }

  onTouchEnd(): void {
    if (!this.pauseOnTouch || !this.shouldAnimate) {
      return;
    }
    this.isPaused = false;
  }

  trackLogo(index: number, item: LogoItem): string {
    return `${item.alt}-${index}`;
  }

  private initResizeObserver(): void {
    if (!this.segmentRef || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.scheduleRecalculation());
    this.resizeObserver.observe(this.segmentRef.nativeElement);
  }

  private initReducedMotionPreference(): void {
    this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = this.mediaQuery.matches;
    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      this.prefersReducedMotion = event.matches;
    };
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  private scheduleRecalculation(): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (this.resizeFrameId !== null) {
      window.cancelAnimationFrame(this.resizeFrameId);
    }
    this.resizeFrameId = window.requestAnimationFrame(() => {
      this.resizeFrameId = null;
      this.recalculateAnimationMetrics();
    });
  }

  private recalculateAnimationMetrics(): void {
    const segmentEl = this.segmentRef?.nativeElement;
    if (!segmentEl) {
      return;
    }

    const segmentWidth = segmentEl.getBoundingClientRect().width;
    if (!Number.isFinite(segmentWidth) || segmentWidth <= 0) {
      return;
    }

    this.shiftDistancePx = Math.max(1, segmentWidth + this.gap);
    const safeSpeed = Math.max(12, this.speed);
    this.animationDurationSec = Math.max(8, this.shiftDistancePx / safeSpeed);
  }
}
