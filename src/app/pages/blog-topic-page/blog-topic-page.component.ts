import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogTopic, BlogTopicSection } from './blog-topic.models';
import { BlogTopicsService } from '../blogs-page/blog-topics.service';

@Component({
  selector: 'app-blog-topic-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-topic-page.component.html',
  styleUrl: './blog-topic-page.component.css'
})
export class BlogTopicPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly topicsService = inject(BlogTopicsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly loading = signal(true);
  readonly topicSlug = signal('');
  readonly dataset = signal<readonly BlogTopic[]>([]);

  readonly activeIndex = computed(() => {
    const slug = this.topicSlug();
    if (!slug) {
      return -1;
    }

    return this.dataset().findIndex((topic) => topic.slug === slug);
  });

  readonly activeTopic = computed<BlogTopic | null>(() => {
    const index = this.activeIndex();
    if (index < 0) {
      return null;
    }
    return this.dataset()[index] ?? null;
  });

  readonly previousTopic = computed<BlogTopic | null>(() => {
    const index = this.activeIndex();
    if (index <= 0) {
      return null;
    }
    return this.dataset()[index - 1] ?? null;
  });

  readonly nextTopic = computed<BlogTopic | null>(() => {
    const index = this.activeIndex();
    if (index < 0 || index >= this.dataset().length - 1) {
      return null;
    }
    return this.dataset()[index + 1] ?? null;
  });

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.topicsService.getTopicsDataset()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, dataset]) => {
        const slug = (params.get('slug') || '').trim();
        this.topicSlug.set(slug);
        this.dataset.set(dataset.topics);
        this.loading.set(false);

        const hasTopic = dataset.topics.some((topic) => topic.slug === slug);
        if (!hasTopic) {
          this.router.navigate(['/blogs'], { replaceUrl: true });
          return;
        }

        this.scrollToTop();
      });
  }

  openPreviousTopic(): void {
    const previous = this.previousTopic();
    if (!previous) {
      return;
    }
    this.openTopic(previous.slug);
  }

  openNextTopic(): void {
    const next = this.nextTopic();
    if (!next) {
      return;
    }
    this.openTopic(next.slug);
  }

  openTopic(slug: string): void {
    this.router.navigate(['/blogs', slug]);
  }

  trackSection(index: number, section: BlogTopicSection): string {
    return `${index}-${section.heading}`;
  }

  shortTitle(title: string): string {
    const value = title.trim();
    if (value.length <= 30) {
      return value;
    }
    return `${value.slice(0, 30)}...`;
  }

  private scrollToTop(): void {
    if (!this.isBrowser) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }
}
