import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';
import { TechNewsItem } from './blog-topics.models';

interface HnHit {
  objectID?: string;
  title?: string;
  story_title?: string;
  url?: string;
  story_url?: string;
  author?: string;
  created_at?: string;
}

interface HnResponse {
  hits?: HnHit[];
}

interface StoredNewsPayload {
  expiresAt: number;
  items: TechNewsItem[];
}

const HN_URL = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=20';
const STORAGE_KEY = 'kk_latest_tech_news_v1';
const TTL_MS = 30 * 60 * 1000;

const FALLBACK_NEWS: TechNewsItem[] = [
  {
    id: 'fallback-1',
    title: 'Why practical AI deployment matters more than AI demos',
    url: 'https://news.ycombinator.com/',
    author: 'Kozy Desk',
    createdAt: new Date().toISOString(),
    source: 'fallback'
  },
  {
    id: 'fallback-2',
    title: 'Cloud costs, DevOps culture, and what founders miss early',
    url: 'https://news.ycombinator.com/',
    author: 'Kozy Desk',
    createdAt: new Date().toISOString(),
    source: 'fallback'
  },
  {
    id: 'fallback-3',
    title: 'Agentic automation: where it helps and where it can fail',
    url: 'https://news.ycombinator.com/',
    author: 'Kozy Desk',
    createdAt: new Date().toISOString(),
    source: 'fallback'
  },
  {
    id: 'fallback-4',
    title: 'On-prem to cloud migration checklist for growing teams',
    url: 'https://news.ycombinator.com/',
    author: 'Kozy Desk',
    createdAt: new Date().toISOString(),
    source: 'fallback'
  },
  {
    id: 'fallback-5',
    title: 'Security by design in fast product teams',
    url: 'https://news.ycombinator.com/',
    author: 'Kozy Desk',
    createdAt: new Date().toISOString(),
    source: 'fallback'
  },
  {
    id: 'fallback-6',
    title: 'Is the AI market overheated or just entering maturity?',
    url: 'https://news.ycombinator.com/',
    author: 'Kozy Desk',
    createdAt: new Date().toISOString(),
    source: 'fallback'
  }
];

@Injectable({ providedIn: 'root' })
export class TechNewsService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private memoryItems: TechNewsItem[] | null = null;
  private memoryExpiresAt = 0;
  private inflight$: Observable<TechNewsItem[]> | null = null;

  getLatestNews(): Observable<TechNewsItem[]> {
    const now = Date.now();

    if (this.memoryItems && this.memoryExpiresAt > now) {
      return of(this.memoryItems);
    }

    const stored = this.readFromSession(now);
    if (stored.length > 0) {
      this.memoryItems = stored;
      this.memoryExpiresAt = now + TTL_MS;
      return of(stored);
    }

    if (this.inflight$) {
      return this.inflight$;
    }

    this.inflight$ = this.http.get<HnResponse>(HN_URL).pipe(
      map((response) => this.normalizeNews(response?.hits ?? [])),
      map((items) => (items.length > 0 ? items : FALLBACK_NEWS)),
      catchError(() => of(FALLBACK_NEWS)),
      tap((items) => {
        this.memoryItems = items;
        this.memoryExpiresAt = Date.now() + TTL_MS;
        this.saveToSession(items, this.memoryExpiresAt);
      }),
      finalize(() => {
        this.inflight$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.inflight$;
  }

  private normalizeNews(hits: HnHit[]): TechNewsItem[] {
    const items: TechNewsItem[] = [];
    const seenUrls = new Set<string>();

    for (const hit of hits) {
      const title = (hit.title || hit.story_title || '').trim();
      const url = (hit.url || hit.story_url || '').trim();
      if (!title || !url || !this.isHttpUrl(url) || seenUrls.has(url)) {
        continue;
      }

      seenUrls.add(url);
      items.push({
        id: hit.objectID || `hn-${items.length}`,
        title,
        url,
        author: (hit.author || 'HN').trim() || 'HN',
        createdAt: hit.created_at || new Date().toISOString(),
        source: 'hackernews'
      });
    }

    return items;
  }

  private readFromSession(now: number): TechNewsItem[] {
    if (!this.isBrowser) {
      return [];
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const payload = JSON.parse(raw) as StoredNewsPayload;
      if (!payload || !Array.isArray(payload.items) || typeof payload.expiresAt !== 'number') {
        return [];
      }

      if (payload.expiresAt <= now) {
        sessionStorage.removeItem(STORAGE_KEY);
        return [];
      }

      return payload.items.filter(
        (item) => typeof item?.title === 'string' && typeof item?.url === 'string' && this.isHttpUrl(item.url)
      );
    } catch {
      return [];
    }
  }

  private saveToSession(items: TechNewsItem[], expiresAt: number): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const payload: StoredNewsPayload = { items, expiresAt };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // noop
    }
  }

  private isHttpUrl(value: string): boolean {
    return value.startsWith('http://') || value.startsWith('https://');
  }
}
