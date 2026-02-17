import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { BlogTopicDataset } from './blog-topics.models';

const FALLBACK_TOPICS: BlogTopicDataset = {
  company: 'Kozy Kreative Concepts',
  featuredSlug: 'ai-bubble-vs-dotcom',
  topics: [
    {
      slug: 'ai-bubble-vs-dotcom',
      title: 'Dotcom Burst vs AI Hype: Are We Repeating History?',
      subtitle: 'What hype gets wrong and what strong businesses should do right now.',
      summary: 'A practical founder-view on AI excitement, risks, and long-term value creation.',
      readTime: '7 min',
      opinionHook: 'Hype comes in waves. Real business value comes from execution, not noise.',
      sections: [
        {
          heading: 'What changed and what did not',
          paragraphs: [
            'In every technology boom, too many companies promise too much too early. That part has not changed.',
            'What has changed is adoption speed. AI tools are already in daily business workflows.'
          ]
        }
      ],
      keyTakeaways: [
        'Do not build for buzzwords.',
        'Build for cost, quality, and speed improvements.'
      ],
      ctaText: 'Talk to Kozy about practical AI adoption'
    }
  ]
};

@Injectable({ providedIn: 'root' })
export class BlogTopicsService {
  private readonly http = inject(HttpClient);

  private readonly dataset$: Observable<BlogTopicDataset> = this.http
    .get<BlogTopicDataset>('/jsons/blog-topics.json')
    .pipe(
      map((dataset) => this.normalizeDataset(dataset)),
      catchError(() =>
        this.http
          .get<BlogTopicDataset>('/assets/jsons/blog-topics.json')
          .pipe(map((dataset) => this.normalizeDataset(dataset)))
      ),
      catchError(() => of(FALLBACK_TOPICS)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  getTopicsDataset(): Observable<BlogTopicDataset> {
    return this.dataset$;
  }

  private normalizeDataset(dataset: BlogTopicDataset): BlogTopicDataset {
    if (!dataset || !Array.isArray(dataset.topics) || dataset.topics.length === 0) {
      return FALLBACK_TOPICS;
    }

    const topics = dataset.topics.filter((topic) => Boolean(topic?.slug && topic?.title));
    if (topics.length === 0) {
      return FALLBACK_TOPICS;
    }

    const featuredSlug = topics.some((topic) => topic.slug === dataset.featuredSlug)
      ? dataset.featuredSlug
      : topics[0].slug;

    return {
      company: dataset.company?.trim() || FALLBACK_TOPICS.company,
      featuredSlug,
      topics
    };
  }
}
