export interface BlogTopicSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogTopic {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  readTime: string;
  opinionHook: string;
  sections: BlogTopicSection[];
  keyTakeaways: string[];
  ctaText: string;
  riskDisclaimer?: string;
}

export interface BlogTopicDataset {
  company: string;
  featuredSlug: string;
  topics: BlogTopic[];
}

export interface TechNewsItem {
  id: string;
  title: string;
  url: string;
  author: string;
  createdAt: string;
  source: 'hackernews' | 'fallback';
}
