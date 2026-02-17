import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { WhatsappFloatComponent } from '../../components/whatsapp-float/whatsapp-float.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { UiStateService } from '../../shared/services/ui-state.service';
import { BLOG_CHAPTERS, type BlogChapterMeta, type BlogChapterId } from '../blog-chapter-page/chapter-types';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [
    CommonModule,
    RevealOnScrollDirective,
    NavbarComponent,
    MobileMenuComponent,
    CtaSectionComponent,
    FooterComponent,
    ContactModalComponent,
    WhatsappFloatComponent,
    ChatbotWidgetComponent
  ],
  templateUrl: './blogs-page.component.html',
  styleUrl: './blogs-page.component.css'
})
export class BlogsPageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly chapters = BLOG_CHAPTERS;
  readonly featuredChapterId: BlogChapterId = 'term-insurance';

  readonly advisorPhone = '+918072871049';
  readonly advisorWhatsappNumber = '918249402832';

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.ui.setNavbarScrolled(window.scrollY > 40);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    this.ui.setNavbarScrolled(window.scrollY > 40);
  }

  trackChapter(_index: number, chapter: BlogChapterMeta): string {
    return chapter.id;
  }

  openChapter(chapterId: BlogChapterId): void {
    this.router.navigate(['/blogs', chapterId]);
  }

  openFeaturedChapter(): void {
    this.openChapter(this.featuredChapterId);
  }

  scrollToChapterList(): void {
    if (!this.isBrowser) {
      return;
    }
    const section = document.getElementById('chapterDirectory');
    if (!section) {
      return;
    }
    const y = Math.max(0, window.scrollY + section.getBoundingClientRect().top - 86);
    window.scrollTo({
      top: y,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  openConsultation(): void {
    this.ui.openModal('contactModal');
  }

  openWhatsApp(topic = 'financial planning'): void {
    if (!this.isBrowser) {
      return;
    }
    const text = encodeURIComponent(`Hi Single Point, I need help with ${topic}. Please guide me.`);
    const url = `https://api.whatsapp.com/send/?phone=${this.advisorWhatsappNumber}&text=${text}&type=phone_number&app_absent=0`;
    window.open(url, '_blank', 'noopener');
  }

  callAdvisor(): void {
    if (!this.isBrowser) {
      return;
    }
    window.location.href = `tel:${this.advisorPhone}`;
  }
}
