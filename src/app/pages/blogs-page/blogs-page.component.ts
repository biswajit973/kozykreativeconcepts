import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ConnectSectionComponent } from '../../components/connect-section/connect-section.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { UiStateService } from '../../shared/services/ui-state.service';
import { BlogTopic, BlogTopicDataset, TechNewsItem } from './blog-topics.models';
import { BlogTopicsService } from './blog-topics.service';
import { TechNewsService } from './tech-news.service';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [
    CommonModule,
    RevealOnScrollDirective,
    NavbarComponent,
    MobileMenuComponent,
    ConnectSectionComponent,
    FooterComponent,
    ContactModalComponent,
    ChatbotWidgetComponent
  ],
  templateUrl: './blogs-page.component.html',
  styleUrl: './blogs-page.component.css'
})
export class BlogsPageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly topicsService = inject(BlogTopicsService);
  private readonly techNewsService = inject(TechNewsService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly dataset = signal<BlogTopicDataset | null>(null);
  readonly latestNews = signal<TechNewsItem[]>([]);
  readonly loadingTopics = signal(true);

  readonly advisorPhone = '+919000500600';
  readonly advisorWhatsappNumber = '919000500600';

  readonly companyName = computed(() => this.dataset()?.company || 'Kozy Kreative Concepts');
  readonly topics = computed(() => this.dataset()?.topics ?? []);

  readonly featuredTopic = computed<BlogTopic | null>(() => {
    const ds = this.dataset();
    if (!ds || ds.topics.length === 0) {
      return null;
    }
    return ds.topics.find((topic) => topic.slug === ds.featuredSlug) ?? ds.topics[0] ?? null;
  });

  readonly topicCards = computed(() => {
    const featured = this.featuredTopic();
    if (!featured) {
      return this.topics();
    }
    return this.topics().filter((topic) => topic.slug !== featured.slug);
  });

  readonly tickerItems = computed(() => this.latestNews().slice(0, 10));
  readonly tickerLoopItems = computed(() => {
    const items = this.tickerItems();
    return items.length > 0 ? [...items, ...items] : [];
  });
  readonly railItems = computed(() => this.latestNews().slice(0, 6));

  ngOnInit(): void {
    this.topicsService
      .getTopicsDataset()
      .pipe(take(1))
      .subscribe((dataset) => {
        this.dataset.set(dataset);
        this.loadingTopics.set(false);
      });

    this.techNewsService
      .getLatestNews()
      .pipe(take(1))
      .subscribe((news) => {
        this.latestNews.set(news);
      });

    if (this.isBrowser) {
      this.ui.setNavbarScrolled(window.scrollY > 40);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    this.ui.setNavbarScrolled(window.scrollY > 40);
  }

  trackTopic(_index: number, topic: BlogTopic): string {
    return topic.slug;
  }

  trackNews(_index: number, item: TechNewsItem): string {
    return item.id;
  }

  openTopic(slug: string): void {
    this.router.navigate(['/blogs', slug]);
  }

  openFeaturedTopic(): void {
    const featured = this.featuredTopic();
    if (!featured) {
      return;
    }
    this.openTopic(featured.slug);
  }

  scrollToTopics(): void {
    if (!this.isBrowser) {
      return;
    }
    const section = document.getElementById('topicsDirectory');
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

  openWhatsApp(topic = 'digital strategy and automation'): void {
    if (!this.isBrowser) {
      return;
    }
    const text = encodeURIComponent(`Hi KKREATIVE team, I need help with ${topic}. Please guide me.`);
    const url = `https://api.whatsapp.com/send/?phone=${this.advisorWhatsappNumber}&text=${text}&type=phone_number&app_absent=0`;
    window.open(url, '_blank', 'noopener');
  }

  callAdvisor(): void {
    if (!this.isBrowser) {
      return;
    }
    window.location.href = `tel:${this.advisorPhone}`;
  }

  formatNewsDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  }
}
