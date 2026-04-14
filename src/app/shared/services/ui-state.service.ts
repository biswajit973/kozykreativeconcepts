import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { GalleryType, ModalId } from '../models/types';

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
  readonly chatbotOpen = signal(false);

  /** Always light mode — dark mode has been removed */
  readonly isDarkMode = computed(() => false);
  readonly themeTransitioning = signal(false);

  readonly lightboxOpen = signal(false);
  readonly lightboxScreenHtml = signal('');
  readonly lightboxScreenBg = signal('');
  readonly lightboxTitle = signal('');
  readonly lightboxDesc = signal('');

  readonly shouldLockBody = computed(() => this.activeModal() !== null || this.lightboxOpen());

  constructor() {
    effect(() => {
      if (!this.isBrowser) {
        return;
      }
      this.doc.body.style.overflow = this.shouldLockBody() ? 'hidden' : '';
    });
  }

  setNavbarScrolled(scrolled: boolean): void {
    this.navbarScrolled.set(scrolled);
  }

  setChatbotOpen(open: boolean): void {
    this.chatbotOpen.set(open);
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
}
