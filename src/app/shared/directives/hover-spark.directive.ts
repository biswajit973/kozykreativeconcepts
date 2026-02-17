import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  inject
} from '@angular/core';
import { ParticleFxService } from '../services/particle-fx.service';
import { SparkIntensity, SparkIntensityConfig } from './hover-spark.types';

const INTENSITY: Record<SparkIntensity, SparkIntensityConfig> = {
  soft: {
    baseAlpha: 0.28,
    burstScale: 1.06
  },
  medium: {
    baseAlpha: 0.34,
    burstScale: 1.12
  },
  high: {
    baseAlpha: 0.4,
    burstScale: 1.18
  }
};

@Directive({
  selector: '[appHoverSpark]',
  standalone: true
})
export class HoverSparkDirective implements OnInit, OnDestroy {
  @Input() sparkIntensity: SparkIntensity = 'soft';

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fx = inject(ParticleFxService);

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private layer: HTMLElement | null = null;
  private burstTimer: number | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    const host = this.host.nativeElement;
    this.renderer.addClass(host, 'hover-spark-host');

    const layer = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(layer, 'hover-spark-layer');
    this.renderer.addClass(layer, `spark-intensity-${this.sparkIntensity}`);
    this.renderer.setAttribute(layer, 'aria-hidden', 'true');
    this.renderer.appendChild(host, layer);

    this.layer = layer;
    this.setAlpha(0);
    this.setPositionPercent(50, 50);
    this.setBurstScale(INTENSITY[this.sparkIntensity].burstScale);
  }

  ngOnDestroy(): void {
    if (this.burstTimer !== null) {
      window.clearTimeout(this.burstTimer);
      this.burstTimer = null;
    }

    if (this.layer) {
      this.layer.remove();
      this.layer = null;
    }
  }

  @HostListener('pointerenter', ['$event'])
  onPointerEnter(event: PointerEvent): void {
    if (!this.shouldTrackPointer()) {
      return;
    }

    const point = this.toLocalPoint(event.clientX, event.clientY);
    this.setPosition(point.x, point.y);
    this.setAlpha(INTENSITY[this.sparkIntensity].baseAlpha * 0.85);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.shouldTrackPointer()) {
      return;
    }

    const point = this.toLocalPoint(event.clientX, event.clientY);
    this.setPosition(point.x, point.y);
    this.setAlpha(INTENSITY[this.sparkIntensity].baseAlpha);
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    this.setAlpha(0);
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (this.fx.coarsePointer()) {
      return;
    }

    const point = this.toLocalPoint(event.clientX, event.clientY);
    this.setPosition(point.x, point.y);
    this.triggerBurst();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!this.layer || this.fx.reducedMotion()) {
      return;
    }

    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }

    const point = this.toLocalPoint(touch.clientX, touch.clientY);
    this.setPosition(point.x, point.y);
    this.triggerBurst();
  }

  private triggerBurst(): void {
    if (!this.layer) {
      return;
    }

    this.setAlpha(Math.min(0.72, INTENSITY[this.sparkIntensity].baseAlpha + 0.24));
    this.renderer.addClass(this.layer, 'is-bursting');

    if (this.burstTimer !== null) {
      window.clearTimeout(this.burstTimer);
    }

    this.burstTimer = window.setTimeout(() => {
      if (!this.layer) {
        return;
      }

      this.renderer.removeClass(this.layer, 'is-bursting');
      if (this.fx.coarsePointer() || this.fx.reducedMotion()) {
        this.setAlpha(0);
      } else {
        this.setAlpha(INTENSITY[this.sparkIntensity].baseAlpha);
      }
    }, 340);
  }

  private shouldTrackPointer(): boolean {
    return !this.fx.coarsePointer() && !this.fx.reducedMotion();
  }

  private toLocalPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const x = this.clamp(clientX - rect.left, 0, rect.width || 1);
    const y = this.clamp(clientY - rect.top, 0, rect.height || 1);
    return { x, y };
  }

  private setPosition(x: number, y: number): void {
    if (!this.layer) {
      return;
    }

    this.layer.style.setProperty('--spark-x', `${x.toFixed(1)}px`);
    this.layer.style.setProperty('--spark-y', `${y.toFixed(1)}px`);
  }

  private setPositionPercent(xPercent: number, yPercent: number): void {
    if (!this.layer) {
      return;
    }

    this.layer.style.setProperty('--spark-x', `${xPercent}%`);
    this.layer.style.setProperty('--spark-y', `${yPercent}%`);
  }

  private setAlpha(alpha: number): void {
    if (!this.layer) {
      return;
    }

    this.layer.style.setProperty('--spark-alpha', alpha.toFixed(3));
  }

  private setBurstScale(scale: number): void {
    if (!this.layer) {
      return;
    }

    this.layer.style.setProperty('--spark-burst-scale', scale.toFixed(3));
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
