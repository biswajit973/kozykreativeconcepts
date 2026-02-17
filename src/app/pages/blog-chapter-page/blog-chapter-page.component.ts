import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BLOG_CHAPTERS, type BlogChapterId, type BlogChapterMeta } from './chapter-types';
import { FixedDepositsChapterComponent } from './chapters/fixed-deposits-chapter.component';
import { GovtBondsChapterComponent } from './chapters/govt-bonds-chapter.component';
import { HealthCoverChapterComponent } from './chapters/health-cover-chapter.component';
import { MutualFundsChapterComponent } from './chapters/mutual-funds-chapter.component';
import { NpsChapterComponent } from './chapters/nps-chapter.component';
import { TermInsuranceChapterComponent } from './chapters/term-insurance-chapter.component';
import { VehicleInsuranceChapterComponent } from './chapters/vehicle-insurance-chapter.component';

@Component({
  selector: 'app-blog-chapter-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TermInsuranceChapterComponent,
    MutualFundsChapterComponent,
    FixedDepositsChapterComponent,
    GovtBondsChapterComponent,
    HealthCoverChapterComponent,
    VehicleInsuranceChapterComponent,
    NpsChapterComponent
  ],
  templateUrl: './blog-chapter-page.component.html',
  styleUrl: './blog-chapter-page.component.css'
})
export class BlogChapterPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private routeSub: Subscription | null = null;

  readonly chapters = BLOG_CHAPTERS;
  activeChapterId: BlogChapterId = 'term-insurance';

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const chapterId = params.get('chapterId');
      if (!chapterId || !this.hasChapterId(chapterId)) {
        this.router.navigate(['/blogs'], { replaceUrl: true });
        return;
      }
      this.activeChapterId = chapterId;
      this.scrollToTop();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  get activeChapter(): BlogChapterMeta | undefined {
    return this.chapters.find((chapter) => chapter.id === this.activeChapterId);
  }

  get activeChapterIndex(): number {
    return this.chapters.findIndex((chapter) => chapter.id === this.activeChapterId);
  }

  get previousChapter(): BlogChapterMeta | undefined {
    const index = this.activeChapterIndex;
    if (index <= 0) {
      return undefined;
    }
    return this.chapters[index - 1];
  }

  get nextChapter(): BlogChapterMeta | undefined {
    const index = this.activeChapterIndex;
    if (index < 0 || index >= this.chapters.length - 1) {
      return undefined;
    }
    return this.chapters[index + 1];
  }

  openChapter(chapterId: BlogChapterId): void {
    this.router.navigate(['/blogs', chapterId]);
  }

  openPreviousChapter(): void {
    const previous = this.previousChapter;
    if (!previous) {
      return;
    }
    this.openChapter(previous.id);
  }

  openNextChapter(): void {
    const next = this.nextChapter;
    if (!next) {
      return;
    }
    this.openChapter(next.id);
  }

  private hasChapterId(chapterId: string): chapterId is BlogChapterId {
    return this.chapters.some((chapter) => chapter.id === chapterId);
  }

  private scrollToTop(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }
}
