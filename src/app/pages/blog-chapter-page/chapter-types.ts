export type BlogChapterId =
  | 'term-insurance'
  | 'mutual-funds'
  | 'fixed-deposits'
  | 'govt-bonds'
  | 'health-cover'
  | 'vehicle-insurance'
  | 'nps';

export interface BlogChapterMeta {
  id: BlogChapterId;
  title: string;
  shortTitle: string;
  description: string;
  readTime: string;
  accent: 'teal' | 'gold' | 'mint';
}

export interface ChapterPageContent {
  heading: string;
  paragraphs: string[];
  bulletTitle?: string;
  bullets?: string[];
}

export interface ChapterContent {
  id: BlogChapterId;
  title: string;
  subtitle: string;
  storyTitle?: string;
  storyText?: string;
  highlight: string;
  majorPros: string[];
  pages: ChapterPageContent[];
  actionTitle: string;
  actionText: string;
  cautionTitle: string;
  cautionText: string;
}

export const BLOG_CHAPTERS: BlogChapterMeta[] = [
  {
    id: 'term-insurance',
    title: 'Term Insurance',
    shortTitle: 'Term Insurance',
    description: 'Protect your family income if life takes an unexpected turn.',
    readTime: '6 min',
    accent: 'gold'
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    shortTitle: 'Mutual Funds',
    description: 'Build long-term wealth with simple monthly discipline.',
    readTime: '6 min',
    accent: 'teal'
  },
  {
    id: 'fixed-deposits',
    title: 'Fixed Deposits',
    shortTitle: 'Fixed Deposits',
    description: 'Keep short-term money safe and predictable.',
    readTime: '4 min',
    accent: 'mint'
  },
  {
    id: 'govt-bonds',
    title: 'Bonds',
    shortTitle: 'Bonds',
    description: 'Add stability and reduce panic during market swings.',
    readTime: '4 min',
    accent: 'teal'
  },
  {
    id: 'health-cover',
    title: 'Health Insurance',
    shortTitle: 'Health Insurance',
    description: 'Stop hospital bills from damaging your life savings.',
    readTime: '4 min',
    accent: 'gold'
  },
  {
    id: 'vehicle-insurance',
    title: 'Vehicle Insurance',
    shortTitle: 'Vehicle Insurance',
    description: 'Avoid big repair shocks with the right coverage.',
    readTime: '4 min',
    accent: 'mint'
  },
  {
    id: 'nps',
    title: 'NPS (National Pension System)',
    shortTitle: 'NPS',
    description: 'Build retirement corpus with long-term discipline and tax support.',
    readTime: '5 min',
    accent: 'teal'
  }
];
