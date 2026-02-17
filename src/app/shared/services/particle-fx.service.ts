import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ParticleFxService {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly reducedMotion = signal(false);
  readonly coarsePointer = signal(false);
  readonly darkTheme = signal(false);

  readonly mobileLite = computed(() => this.reducedMotion() || this.coarsePointer());

  private reduceQuery: MediaQueryList | null = null;
  private coarseQuery: MediaQueryList | null = null;
  private themeObserver: MutationObserver | null = null;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    this.reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.coarseQuery = window.matchMedia('(pointer: coarse)');

    this.reducedMotion.set(this.reduceQuery.matches);
    this.coarsePointer.set(this.coarseQuery.matches);
    this.darkTheme.set(this.doc.documentElement.getAttribute('data-theme') === 'dark');

    const onReduceChange = (event: MediaQueryListEvent): void => this.reducedMotion.set(event.matches);
    const onCoarseChange = (event: MediaQueryListEvent): void => this.coarsePointer.set(event.matches);

    this.reduceQuery.addEventListener('change', onReduceChange);
    this.coarseQuery.addEventListener('change', onCoarseChange);

    this.themeObserver = new MutationObserver(() => {
      this.darkTheme.set(this.doc.documentElement.getAttribute('data-theme') === 'dark');
    });
    this.themeObserver.observe(this.doc.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    this.destroyRef.onDestroy(() => {
      this.reduceQuery?.removeEventListener('change', onReduceChange);
      this.coarseQuery?.removeEventListener('change', onCoarseChange);
      this.themeObserver?.disconnect();
    });
  }

  shouldUseLite(explicitLite: boolean): boolean {
    return explicitLite || this.mobileLite();
  }

  cappedCount(baseCount: number, explicitLite: boolean): number {
    if (!this.isBrowser) {
      return baseCount;
    }

    const lite = this.shouldUseLite(explicitLite);
    const viewportWidth = window.innerWidth;

    if (lite || viewportWidth < 768) {
      return Math.max(12, Math.round(baseCount * 0.45));
    }

    if (viewportWidth < 1024) {
      return Math.max(16, Math.round(baseCount * 0.72));
    }

    return baseCount;
  }
}
