import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, HostListener, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailFloatComponent } from './components/email-float/email-float.component';
import { UiStateService } from './shared/services/ui-state.service';

interface OledParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  hue: 'teal' | 'mint' | 'gold';
}

interface CursorPulse {
  id: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, EmailFloatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly ui = inject(UiStateService);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private pointerQuery: MediaQueryList | null = null;
  private cursorAnimationId = 0;
  private pulseCounter = 0;

  readonly pointerFine = signal(false);
  readonly cursorVisible = signal(false);
  readonly cursorX = signal(0);
  readonly cursorY = signal(0);
  readonly ringX = signal(0);
  readonly ringY = signal(0);
  readonly particles = signal<OledParticle[]>([]);
  readonly cursorPulses = signal<CursorPulse[]>([]);

  readonly showOledEffects = computed(() => this.ui.isDarkMode() && this.pointerFine() && this.isBrowser);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    this.pointerQuery = window.matchMedia('(pointer: fine)');
    this.pointerFine.set(this.pointerQuery.matches);
    this.pointerQuery.addEventListener('change', this.onPointerChange);
    this.particles.set(this.generateParticles());
    this.startCursorLoop();

    this.destroyRef.onDestroy(() => {
      this.pointerQuery?.removeEventListener('change', this.onPointerChange);
      if (this.cursorAnimationId) {
        cancelAnimationFrame(this.cursorAnimationId);
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.showOledEffects()) {
      return;
    }

    this.cursorX.set(event.clientX);
    this.cursorY.set(event.clientY);
    this.cursorVisible.set(true);
  }

  @HostListener('document:mouseleave')
  onMouseLeave(): void {
    this.cursorVisible.set(false);
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.showOledEffects()) {
      return;
    }

    const pulseId = ++this.pulseCounter;
    this.cursorPulses.update((pulses) => [
      ...pulses,
      {
        id: pulseId,
        x: event.clientX,
        y: event.clientY
      }
    ]);

    window.setTimeout(() => {
      this.cursorPulses.update((pulses) => pulses.filter((pulse) => pulse.id !== pulseId));
    }, 520);
  }

  trackParticle(_index: number, particle: OledParticle): number {
    return particle.id;
  }

  trackPulse(_index: number, pulse: CursorPulse): number {
    return pulse.id;
  }

  private onPointerChange = (event: MediaQueryListEvent): void => {
    this.pointerFine.set(event.matches);
    if (!event.matches) {
      this.cursorVisible.set(false);
    }
  };

  private startCursorLoop(): void {
    let x = 0;
    let y = 0;

    const animate = () => {
      const targetX = this.cursorX();
      const targetY = this.cursorY();

      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;

      this.ringX.set(x);
      this.ringY.set(y);

      this.cursorAnimationId = requestAnimationFrame(animate);
    };

    animate();
  }

  private generateParticles(): OledParticle[] {
    const hues: Array<OledParticle['hue']> = ['teal', 'mint', 'gold'];

    return Array.from({ length: 22 }, (_unused, index) => {
      const seed = index + 1;
      const rand = this.seeded(seed);
      return {
        id: seed,
        x: 2 + this.seeded(seed * 7) * 96,
        y: 2 + this.seeded(seed * 13) * 96,
        size: 2 + rand * 4,
        duration: 9 + this.seeded(seed * 23) * 10,
        delay: this.seeded(seed * 31) * -8,
        hue: hues[index % hues.length]
      };
    });
  }

  private seeded(seed: number): number {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }
}
