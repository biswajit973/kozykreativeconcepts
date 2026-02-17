import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import { animate, type JSAnimation } from 'animejs';
import { UiStateService } from '../../shared/services/ui-state.service';

type HeroVisualVariant = 'legacy' | 'scanner';
type HeroTextEffectMode = 'typing' | 'static';
type HeroScannerBadgeTone = 'teal' | 'mint' | 'gold' | 'slate';
type HeroScannerCardKind = 'bars' | 'shield' | 'progress' | 'tax' | 'ring' | 'alert';

interface HeroScannerCard {
  id: string;
  title: string;
  badge: string;
  badgeTone: HeroScannerBadgeTone;
  kind: HeroScannerCardKind;
  metric: string;
  subline: string;
  progress?: number;
  bars?: number[];
}

interface HeroScannerRenderCard extends HeroScannerCard {
  instanceId: string;
  insightTitle: string;
  insightPoints: string[];
}

interface ScannerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinkle: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly ui = inject(UiStateService);
  private readonly zone = inject(NgZone);

  readonly heroVisualVariant: HeroVisualVariant = 'scanner';
  readonly heroTextEffectMode: HeroTextEffectMode = 'typing';
  readonly heroTypingPrefix = 'We help you:';
  readonly heroTypingPhrases = ['Plan today.', 'Protect always.', 'Prosper tomorrow.'];
  heroTypingDisplay = this.heroTypingPhrases[0];

  readonly scannerCards: HeroScannerCard[] = [
    {
      id: 'portfolio-growth',
      title: 'Complete Financial Planning',
      badge: 'One-stop',
      badgeTone: 'mint',
      kind: 'bars',
      metric: 'Mutual Funds, FD, Bonds',
      subline: 'Growth and stability in one clear plan.',
      bars: [36, 52, 44, 66, 58, 82, 74, 92]
    },
    {
      id: 'capital-protected',
      title: 'Always Protected',
      badge: 'Cover',
      badgeTone: 'gold',
      kind: 'shield',
      metric: 'Term, Health, Vehicle',
      subline: 'Protect income, health, and lifestyle together.'
    },
    {
      id: 'retirement',
      title: 'Goal Mapping',
      badge: 'On Track',
      badgeTone: 'teal',
      kind: 'progress',
      metric: 'Retirement and life goals',
      subline: 'Clear targets, clear monthly action.',
      progress: 78
    },
    {
      id: 'goal-health',
      title: 'Fund Research Desk',
      badge: 'Screened',
      badgeTone: 'mint',
      kind: 'ring',
      metric: 'Quality and risk filters',
      subline: 'Only goal-fit funds enter your portfolio.',
      progress: 84
    },
    {
      id: 'tax-efficiency',
      title: 'Tax-smart Wealth',
      badge: 'Optimized',
      badgeTone: 'gold',
      kind: 'tax',
      metric: 'Tax saving with long-term purpose',
      subline: 'Save tax while staying aligned to goals.',
      progress: 91
    },
    {
      id: 'rebalance-alert',
      title: 'Review Discipline',
      badge: 'Monthly',
      badgeTone: 'slate',
      kind: 'alert',
      metric: 'Review and rebalance',
      subline: 'Regular reviews keep your plan on course.'
    }
  ];

  readonly scannerRenderCards: HeroScannerRenderCard[] = this.buildRenderCards();

  @ViewChild('scannerRoot') private scannerRootRef?: ElementRef<HTMLDivElement>;
  @ViewChild('cardLine') private cardLineRef?: ElementRef<HTMLDivElement>;
  @ViewChild('particleCanvas') private particleCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroTypingText') private heroTypingTextRef?: ElementRef<HTMLSpanElement>;
  @ViewChildren('scanCard') private scanCardRefs?: QueryList<ElementRef<HTMLElement>>;

  private frameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null;
  private typingAnimation: JSAnimation | null = null;
  private typingTimeoutId: number | null = null;
  private currentTypingPhraseIndex = 0;
  private readonly typingProgress = { chars: 0 };

  private lastFrameTime = 0;
  private lineX = 0;
  private loopWidth = 0;

  private readonly scrollSpeed = 16;
  private readonly scannerCenterRatio = 0.52;
  private readonly scannerWidth = 10;
  private prefersReducedMotion = false;

  private particleCtx: CanvasRenderingContext2D | null = null;
  private particles: ScannerParticle[] = [];
  private canvasWidth = 0;
  private canvasHeight = 0;
  private readonly particleCount = 120;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.initMotionPreference();
    this.initHeroTyping();

    if (this.heroVisualVariant !== 'scanner') {
      return;
    }

    this.initResizeObserver();
    this.measureLoopWidth();
    this.setupParticles();
    this.updateCardScanProgress();
    this.restartFrameLoop();
  }

  ngOnDestroy(): void {
    this.stopFrameLoop();
    this.stopTypingLoop();
    this.resizeObserver?.disconnect();
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }

  trackScannerCard(_index: number, card: HeroScannerRenderCard): string {
    return card.instanceId;
  }

  badgeClass(tone: HeroScannerBadgeTone): string {
    return `hero-scan-badge--${tone}`;
  }

  get isHeroTypingStatic(): boolean {
    return this.heroTextEffectMode === 'static' || this.prefersReducedMotion;
  }

  private buildRenderCards(): HeroScannerRenderCard[] {
    const copies = 2;
    const cards: HeroScannerRenderCard[] = [];
    for (let copy = 0; copy < copies; copy += 1) {
      for (const card of this.scannerCards) {
        cards.push({
          ...card,
          instanceId: `${card.id}-${copy}`,
          insightTitle: this.buildInsightTitle(card),
          insightPoints: this.buildInsightPoints(card)
        });
      }
    }
    return cards;
  }

  private buildInsightTitle(card: HeroScannerCard): string {
    if (card.id === 'portfolio-growth') {
      return 'One-stop financial solution';
    }
    if (card.id === 'capital-protected') {
      return 'Plan today. Protect always.';
    }
    if (card.id === 'retirement') {
      return 'Goal-based planning';
    }
    if (card.id === 'goal-health') {
      return 'How we shortlist funds';
    }
    if (card.id === 'tax-efficiency') {
      return 'Tax planning with purpose';
    }
    if (card.id === 'rebalance-alert') {
      return 'Prosper tomorrow';
    }
    return 'How we help you';
  }

  private buildInsightPoints(card: HeroScannerCard): string[] {
    switch (card.id) {
      case 'portfolio-growth':
        return [
          'One plan for investment, protection, and goals.',
          'Mutual Funds, FD, and Bonds matched to your profile.',
          'Simple advice you can understand and follow.'
        ];
      case 'capital-protected':
        return [
          'Term, Health, and Vehicle cover under one strategy.',
          'Right cover amount based on real family needs.',
          'Your family stays financially safer in hard times.'
        ];
      case 'retirement':
        return [
          'Clear targets for retirement and life milestones.',
          'Monthly action plan built around your cash flow.',
          'Regular tracking so goals stay on schedule.'
        ];
      case 'goal-health':
        return [
          'Funds are screened for quality, cost, and consistency.',
          'No random trending picks or noise-based decisions.',
          'Only funds aligned to your goal enter the plan.'
        ];
      case 'tax-efficiency':
        return [
          'Tax saving is linked to long-term wealth outcomes.',
          'ELSS and NPS are aligned with your larger goals.',
          'No last-minute panic decisions at year-end.'
        ];
      case 'rebalance-alert':
        return [
          'Portfolio review happens on a regular discipline.',
          'Rebalancing controls risk before it drifts too far.',
          'You get clear updates with practical next steps.'
        ];
      default:
        return [
          'We study your profile before suggesting any move.',
          'We explain the plan in simple words.',
          'We review regularly and adjust when needed.'
        ];
    }
  }

  private initMotionPreference(): void {
    this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = this.mediaQuery.matches;
    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      this.prefersReducedMotion = event.matches;
      if (this.heroVisualVariant === 'scanner') {
        this.restartFrameLoop();
      }
      this.initHeroTyping();
    };
    this.mediaQuery.addEventListener('change', this.mediaQueryListener);
  }

  private initHeroTyping(): void {
    const textEl = this.heroTypingTextRef?.nativeElement;
    if (!textEl) {
      return;
    }

    this.stopTypingLoop();
    this.currentTypingPhraseIndex = 0;

    const firstPhrase = this.heroTypingPhrases[0] ?? '';
    if (this.heroTextEffectMode === 'static' || this.prefersReducedMotion || this.heroTypingPhrases.length === 0) {
      this.heroTypingDisplay = firstPhrase;
      textEl.textContent = firstPhrase;
      return;
    }

    this.heroTypingDisplay = '';
    textEl.textContent = '';
    this.zone.runOutsideAngular(() => this.startTypingLoop());
  }

  private startTypingLoop(): void {
    const phraseCount = this.heroTypingPhrases.length;
    if (phraseCount === 0) {
      return;
    }

    const textEl = this.heroTypingTextRef?.nativeElement;
    if (!textEl) {
      return;
    }

    const phrase = this.heroTypingPhrases[this.currentTypingPhraseIndex % phraseCount] ?? '';
    this.typingProgress.chars = 0;

    this.typingAnimation = animate(this.typingProgress, {
      chars: phrase.length,
      duration: 860,
      ease: 'outQuad',
      round: 1,
      onUpdate: () => {
        const count = Math.max(0, Math.min(phrase.length, Math.round(this.typingProgress.chars)));
        const nextValue = phrase.slice(0, count);
        this.heroTypingDisplay = nextValue;
        textEl.textContent = nextValue;
      },
      onComplete: () => {
        this.queueTypingTimeout(1300, () => this.startEraseLoop(phrase));
      }
    });
  }

  private startEraseLoop(phrase: string): void {
    const textEl = this.heroTypingTextRef?.nativeElement;
    if (!textEl) {
      return;
    }

    this.typingProgress.chars = phrase.length;
    this.typingAnimation = animate(this.typingProgress, {
      chars: 0,
      duration: 560,
      ease: 'inOutQuad',
      round: 1,
      onUpdate: () => {
        const count = Math.max(0, Math.min(phrase.length, Math.round(this.typingProgress.chars)));
        const nextValue = phrase.slice(0, count);
        this.heroTypingDisplay = nextValue;
        textEl.textContent = nextValue;
      },
      onComplete: () => {
        this.currentTypingPhraseIndex = (this.currentTypingPhraseIndex + 1) % this.heroTypingPhrases.length;
        this.queueTypingTimeout(220, () => this.startTypingLoop());
      }
    });
  }

  private queueTypingTimeout(delayMs: number, callback: () => void): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (this.typingTimeoutId !== null) {
      window.clearTimeout(this.typingTimeoutId);
    }
    this.typingTimeoutId = window.setTimeout(() => {
      this.typingTimeoutId = null;
      callback();
    }, delayMs);
  }

  private stopTypingLoop(): void {
    this.typingAnimation?.cancel();
    this.typingAnimation = null;

    if (typeof window !== 'undefined' && this.typingTimeoutId !== null) {
      window.clearTimeout(this.typingTimeoutId);
      this.typingTimeoutId = null;
    }
  }

  private initResizeObserver(): void {
    const root = this.scannerRootRef?.nativeElement;
    if (!root) {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => {
      this.measureLoopWidth();
      this.setupParticles();
      this.updateCardScanProgress();
    });
    this.resizeObserver.observe(root);
  }

  private restartFrameLoop(): void {
    this.stopFrameLoop();
    this.lastFrameTime = 0;
    if (this.prefersReducedMotion) {
      this.updateCardScanProgress();
      this.drawParticles(0);
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.onFrame);
    });
  }

  private readonly onFrame = (time: number): void => {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = time;
    }
    const dt = Math.min((time - this.lastFrameTime) / 1000, 0.05);
    this.lastFrameTime = time;

    this.advanceLine(dt);
    this.updateCardScanProgress();
    this.drawParticles(time);

    this.frameId = requestAnimationFrame(this.onFrame);
  };

  private stopFrameLoop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private measureLoopWidth(): void {
    const line = this.cardLineRef?.nativeElement;
    if (!line || !this.scanCardRefs || this.scannerCards.length === 0) {
      return;
    }
    const cards = this.scanCardRefs.toArray();
    const firstLoopCards = cards.slice(0, this.scannerCards.length);
    const gap = this.readGap(line);
    let width = 0;
    firstLoopCards.forEach((cardRef, index) => {
      width += cardRef.nativeElement.offsetWidth;
      if (index < firstLoopCards.length - 1) {
        width += gap;
      }
    });
    this.loopWidth = width;
    if (this.loopWidth > 0 && Math.abs(this.lineX) > this.loopWidth) {
      this.lineX %= this.loopWidth;
    }
    line.style.transform = `translate3d(${this.lineX}px, 0, 0)`;
  }

  private readGap(line: HTMLElement): number {
    const styles = getComputedStyle(line);
    const rawGap = styles.columnGap || styles.gap || '0';
    const gap = parseFloat(rawGap);
    return Number.isFinite(gap) ? gap : 0;
  }

  private advanceLine(dt: number): void {
    const line = this.cardLineRef?.nativeElement;
    if (!line || this.loopWidth <= 0) {
      return;
    }
    this.lineX -= this.scrollSpeed * dt;
    if (this.lineX <= -this.loopWidth) {
      this.lineX += this.loopWidth;
    }
    line.style.transform = `translate3d(${this.lineX}px, 0, 0)`;
  }

  private updateCardScanProgress(): void {
    const root = this.scannerRootRef?.nativeElement;
    const cardRefs = this.scanCardRefs?.toArray() ?? [];
    if (!root || cardRefs.length === 0) {
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const scannerX = rootRect.left + rootRect.width * this.scannerCenterRatio;
    for (const cardRef of cardRefs) {
      const cardEl = cardRef.nativeElement;
      const rect = cardEl.getBoundingClientRect();
      const raw = ((scannerX - rect.left) / rect.width) * 100;
      const progress = Math.max(0, Math.min(100, raw));
      cardEl.style.setProperty('--scan-progress', `${progress.toFixed(2)}%`);
    }
  }

  private setupParticles(): void {
    const canvas = this.particleCanvasRef?.nativeElement;
    const root = this.scannerRootRef?.nativeElement;
    if (!canvas || !root) {
      return;
    }
    const rect = root.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvasWidth = Math.max(1, rect.width);
    this.canvasHeight = Math.max(1, rect.height);
    canvas.width = Math.round(this.canvasWidth * dpr);
    canvas.height = Math.round(this.canvasHeight * dpr);
    canvas.style.width = `${this.canvasWidth}px`;
    canvas.style.height = `${this.canvasHeight}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.particleCtx = ctx;
    this.particles = Array.from({ length: this.particleCount }, () => this.createParticle());
  }

  private createParticle(): ScannerParticle {
    const beamX = this.canvasWidth * this.scannerCenterRatio;
    return {
      x: beamX + (Math.random() * this.scannerWidth - this.scannerWidth / 2),
      y: Math.random() * this.canvasHeight,
      vx: 0.4 + Math.random() * 1.8,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 0.8 + Math.random() * 1.8,
      alpha: 0.18 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2
    };
  }

  private drawParticles(time: number): void {
    const ctx = this.particleCtx;
    if (!ctx) {
      return;
    }
    const beamX = this.canvasWidth * this.scannerCenterRatio;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    const glow = ctx.createLinearGradient(beamX - 34, 0, beamX + 34, 0);
    glow.addColorStop(0, 'rgba(136,212,171,0)');
    glow.addColorStop(0.5, 'rgba(136,212,171,0.28)');
    glow.addColorStop(1, 'rgba(136,212,171,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(beamX - 34, 0, 68, this.canvasHeight);

    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.twinkle += 0.03;

      if (
        particle.x > this.canvasWidth + 16 ||
        particle.y < -16 ||
        particle.y > this.canvasHeight + 16
      ) {
        particle.x = beamX + (Math.random() * this.scannerWidth - this.scannerWidth / 2);
        particle.y = Math.random() * this.canvasHeight;
        particle.vx = 0.4 + Math.random() * 1.8;
        particle.vy = (Math.random() - 0.5) * 0.5;
      }

      const opacity = Math.max(
        0.05,
        Math.min(0.85, particle.alpha + Math.sin(particle.twinkle + time * 0.0012) * 0.18)
      );
      ctx.fillStyle = `rgba(136, 212, 171, ${opacity.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
