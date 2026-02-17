import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { GalleryType, ModalId, ThemeMode } from '../models/types';

const THEME_STORAGE_KEY = 'kk_theme_mode';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly activeModal = signal<ModalId>(null);
  readonly mobileMenuOpen = signal(false);
  readonly toolsDropOpen = signal(false);
  readonly activeGallery = signal<GalleryType>('web');
  readonly navbarScrolled = signal(false);
  readonly themeMode = signal<ThemeMode>('light');
  readonly themeTransitioning = signal(false);
  readonly isDarkMode = computed(() => this.themeMode() === 'dark');

  readonly lightboxOpen = signal(false);
  readonly lightboxScreenHtml = signal('');
  readonly lightboxScreenBg = signal('');
  readonly lightboxTitle = signal('');
  readonly lightboxDesc = signal('');

  readonly shouldLockBody = computed(() => this.activeModal() !== null || this.lightboxOpen());
  private themeTransitionTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (this.isBrowser) {
      this.themeMode.set(this.resolveInitialTheme());
    }

    effect(() => {
      if (!this.isBrowser) {
        return;
      }
      this.doc.body.style.overflow = this.shouldLockBody() ? 'hidden' : '';
    });

    effect(() => {
      if (!this.isBrowser) {
        return;
      }

      const mode = this.themeMode();
      const root = this.doc.documentElement;
      root.setAttribute('data-theme', mode);
      root.style.colorScheme = mode;

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, mode);
      } catch {
        // noop
      }
    });
  }

  setNavbarScrolled(scrolled: boolean): void {
    this.navbarScrolled.set(scrolled);
  }

  openModal(id: Exclude<ModalId, null>): void {
    this.activeModal.set(id);
  }

  closeModal(id?: Exclude<ModalId, null>): void {
    const current = this.activeModal();
    if (!id || current === id) {
      this.activeModal.set(null);
    }
  }

  isModalOpen(id: Exclude<ModalId, null>): boolean {
    return this.activeModal() === id;
  }

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  setThemeMode(mode: ThemeMode): void {
    this.themeMode.set(mode);
  }

  toggleThemeMode(): void {
    this.triggerThemeTransition();
    this.themeMode.set(this.isDarkMode() ? 'light' : 'dark');
  }

  toggleToolsDrop(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.toolsDropOpen.set(!this.toolsDropOpen());
  }

  closeAllDrops(): void {
    this.toolsDropOpen.set(false);
  }

  switchGallery(type: GalleryType): void {
    this.activeGallery.set(type);
  }

  openLightboxFromCard(card: HTMLElement): void {
    const screen = card.querySelector('.g-screen') as HTMLElement | null;
    const titleNode = card.querySelector('.g-info h4');
    const descNode = card.querySelector('.g-info p');
    if (!screen || !titleNode || !descNode) {
      return;
    }

    this.lightboxScreenHtml.set(screen.innerHTML);
    this.lightboxScreenBg.set(screen.style.background);
    this.lightboxTitle.set(titleNode.textContent ?? '');
    this.lightboxDesc.set(descNode.textContent ?? '');
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  private resolveInitialTheme(): ThemeMode {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch {
      // noop
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private triggerThemeTransition(): void {
    if (!this.isBrowser) {
      return;
    }

    this.themeTransitioning.set(true);
    if (this.themeTransitionTimer) {
      clearTimeout(this.themeTransitionTimer);
    }
    this.themeTransitionTimer = setTimeout(() => {
      this.themeTransitioning.set(false);
      this.themeTransitionTimer = null;
    }, 520);
  }
}
