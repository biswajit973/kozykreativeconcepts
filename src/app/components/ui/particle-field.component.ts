import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { ParticleFxService } from '../../shared/services/particle-fx.service';
import { ParticleFieldConfig, ParticlePresetId } from './particle-field.types';

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  tone: 0 | 1 | 2;
  twinkle: number;
}

const PRESET_CONFIGS: Record<ParticlePresetId, ParticleFieldConfig> = {
  services: {
    count: 62,
    speedMin: 0.06,
    speedMax: 0.18,
    drift: 0.22,
    blur: 8,
    glow: 0.7,
    opacityLight: 0.28,
    opacityDark: 0.55,
    radiusMin: 1,
    radiusMax: 2.6,
    palette: {
      light: ['17,75,95', '26,122,138', '198,151,63'],
      dark: ['0,209,247', '138,255,210', '242,193,109']
    }
  },
  industries: {
    count: 56,
    speedMin: 0.05,
    speedMax: 0.16,
    drift: 0.2,
    blur: 7,
    glow: 0.64,
    opacityLight: 0.24,
    opacityDark: 0.5,
    radiusMin: 1,
    radiusMax: 2.4,
    palette: {
      light: ['11,32,39', '17,75,95', '136,212,171'],
      dark: ['0,209,247', '125,231,255', '138,255,210']
    }
  },
  testimonials: {
    count: 44,
    speedMin: 0.04,
    speedMax: 0.14,
    drift: 0.18,
    blur: 6,
    glow: 0.55,
    opacityLight: 0.2,
    opacityDark: 0.42,
    radiusMin: 0.9,
    radiusMax: 2.1,
    palette: {
      light: ['17,75,95', '136,212,171', '198,151,63'],
      dark: ['0,209,247', '138,255,210', '242,193,109']
    }
  },
  works: {
    count: 38,
    speedMin: 0.04,
    speedMax: 0.12,
    drift: 0.16,
    blur: 6,
    glow: 0.5,
    opacityLight: 0.17,
    opacityDark: 0.4,
    radiusMin: 0.8,
    radiusMax: 1.9,
    palette: {
      light: ['11,32,39', '17,75,95', '198,151,63'],
      dark: ['125,231,255', '138,255,210', '242,193,109']
    }
  },
  cta: {
    count: 74,
    speedMin: 0.08,
    speedMax: 0.22,
    drift: 0.26,
    blur: 10,
    glow: 0.78,
    opacityLight: 0.26,
    opacityDark: 0.62,
    radiusMin: 1.1,
    radiusMax: 2.8,
    palette: {
      light: ['26,122,138', '136,212,171', '198,151,63'],
      dark: ['0,209,247', '138,255,210', '242,193,109']
    }
  }
};

@Component({
  selector: 'app-particle-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './particle-field.component.html',
  styleUrl: './particle-field.component.css'
})
export class ParticleFieldComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() preset: ParticlePresetId = 'services';
  @Input() interactive = false;
  @Input() lite = false;

  @ViewChild('canvas') private canvasRef?: ElementRef<HTMLCanvasElement>;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly fx = inject(ParticleFxService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private ctx: CanvasRenderingContext2D | null = null;
  private particles: AmbientParticle[] = [];
  private frameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private visibilityObserver: IntersectionObserver | null = null;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private inView = true;
  private initialized = false;

  private pointerX = 0;
  private pointerY = 0;
  private pointerActive = false;

  private lastTime = 0;

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.initialized = true;
    this.initCanvas();
    this.initObservers();
    this.rebuildParticles();
    this.restartLoop();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.initialized) {
      return;
    }

    this.rebuildParticles();
    this.restartLoop();
  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.canUseInteractivePointer()) {
      return;
    }

    this.pointerX = event.offsetX;
    this.pointerY = event.offsetY;
    this.pointerActive = true;
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    this.pointerActive = false;
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (!this.isBrowser) {
      return;
    }

    if (document.hidden) {
      this.stopLoop();
      return;
    }

    this.restartLoop();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.ctx = ctx;
    this.measureCanvas();
  }

  private initObservers(): void {
    const el = this.host.nativeElement;

    this.resizeObserver = new ResizeObserver(() => {
      this.measureCanvas();
      this.rebuildParticles();
      this.drawStatic();
    });
    this.resizeObserver.observe(el);

    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        this.inView = entries.some((entry) => entry.isIntersecting);
        if (!this.inView) {
          this.stopLoop();
          return;
        }
        this.restartLoop();
      },
      { threshold: 0.05 }
    );
    this.visibilityObserver.observe(el);
  }

  private measureCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = this.ctx;
    if (!canvas || !ctx) {
      return;
    }

    const rect = this.host.nativeElement.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(this.width * this.dpr);
    canvas.height = Math.round(this.height * this.dpr);
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private rebuildParticles(): void {
    if (!this.width || !this.height) {
      return;
    }

    const config = PRESET_CONFIGS[this.preset];
    const count = this.fx.cappedCount(config.count, this.lite);

    const seedBase = this.seedFromPreset(this.preset);
    this.particles = Array.from({ length: count }, (_unused, index) =>
      this.createParticle(seedBase + index * 17, config)
    );
  }

  private createParticle(seed: number, config: ParticleFieldConfig): AmbientParticle {
    const rand = this.seeded(seed);
    const rand2 = this.seeded(seed * 1.91);
    const rand3 = this.seeded(seed * 2.77);
    const rand4 = this.seeded(seed * 3.63);

    const speed = config.speedMin + rand3 * (config.speedMax - config.speedMin);
    const angle = rand2 * Math.PI * 2;

    return {
      x: rand * this.width,
      y: rand2 * this.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: config.radiusMin + rand4 * (config.radiusMax - config.radiusMin),
      alpha: 0.3 + rand3 * 0.7,
      tone: (Math.floor(rand4 * 3) % 3) as 0 | 1 | 2,
      twinkle: rand * Math.PI * 2
    };
  }

  private restartLoop(): void {
    if (!this.isBrowser || !this.inView) {
      return;
    }

    this.stopLoop();
    this.lastTime = 0;

    if (this.fx.reducedMotion()) {
      this.drawStatic();
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.animateFrame);
    });
  }

  private stopLoop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private readonly animateFrame = (time: number): void => {
    if (!this.ctx) {
      return;
    }

    if (this.lastTime === 0) {
      this.lastTime = time;
    }
    const dt = Math.min((time - this.lastTime) / 16.67, 2);
    this.lastTime = time;

    this.stepParticles(dt, time);
    this.renderParticles(time);

    this.frameId = requestAnimationFrame(this.animateFrame);
  };

  private stepParticles(dt: number, time: number): void {
    const config = PRESET_CONFIGS[this.preset];
    const interactionRange = 120;

    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.twinkle += 0.01 * dt;

      if (particle.x < -12) particle.x = this.width + 12;
      if (particle.x > this.width + 12) particle.x = -12;
      if (particle.y < -12) particle.y = this.height + 12;
      if (particle.y > this.height + 12) particle.y = -12;

      if (this.pointerActive && this.canUseInteractivePointer()) {
        const dx = particle.x - this.pointerX;
        const dy = particle.y - this.pointerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < interactionRange && dist > 0.001) {
          const push = (interactionRange - dist) / interactionRange;
          const force = push * config.drift * 0.9;
          particle.x += (dx / dist) * force;
          particle.y += (dy / dist) * force;
        }
      }

      const driftX = Math.sin((time * 0.00022) + particle.twinkle) * config.drift;
      const driftY = Math.cos((time * 0.00018) + particle.twinkle) * config.drift;
      particle.x += driftX * 0.035;
      particle.y += driftY * 0.035;
    }
  }

  private renderParticles(time: number): void {
    const ctx = this.ctx;
    if (!ctx) {
      return;
    }

    const config = PRESET_CONFIGS[this.preset];
    const dark = this.fx.darkTheme();
    const baseOpacity = dark ? config.opacityDark : config.opacityLight;
    const palette = dark ? config.palette.dark : config.palette.light;

    ctx.clearRect(0, 0, this.width, this.height);

    for (const particle of this.particles) {
      const shimmer = 0.65 + Math.sin((time * 0.0012) + particle.twinkle) * 0.35;
      const alpha = Math.max(0.04, Math.min(1, particle.alpha * baseOpacity * shimmer));
      const color = palette[particle.tone];

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${alpha.toFixed(3)})`;
      ctx.shadowBlur = config.blur;
      ctx.shadowColor = `rgba(${color}, ${(alpha * config.glow).toFixed(3)})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  private drawStatic(): void {
    if (!this.ctx) {
      return;
    }

    this.renderParticles(0);
  }

  private canUseInteractivePointer(): boolean {
    return this.interactive && !this.fx.coarsePointer() && !this.fx.reducedMotion();
  }

  private seedFromPreset(preset: ParticlePresetId): number {
    return preset.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  private seeded(seed: number): number {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }
}
