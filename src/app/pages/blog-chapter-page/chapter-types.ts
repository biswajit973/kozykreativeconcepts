export type BlogChapterId =
  | 'app-development'
  | 'web-development'
  | 'chatbots-automation'
  | 'cloud-devops'
  | 'qa-cybersecurity'
  | 'digital-marketing'
  | 'software-trainings';

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
    id: 'app-development',
    title: 'App Development',
    shortTitle: 'App Development',
    description: 'How mobile and desktop apps solve real business workflows.',
    readTime: '6 min',
    accent: 'gold'
  },
  {
    id: 'web-development',
    title: 'Web Development',
    shortTitle: 'Web Development',
    description: 'Landing pages, websites, and web apps that convert better.',
    readTime: '6 min',
    accent: 'teal'
  },
  {
    id: 'chatbots-automation',
    title: 'Chatbots and Automation',
    shortTitle: 'Automation',
    description: 'Reduce repetitive work and improve support speed.',
    readTime: '4 min',
    accent: 'mint'
  },
  {
    id: 'cloud-devops',
    title: 'Cloud and DevOps',
    shortTitle: 'Cloud and DevOps',
    description: 'Deploy reliably with AWS, Azure, and Google Cloud support.',
    readTime: '4 min',
    accent: 'teal'
  },
  {
    id: 'qa-cybersecurity',
    title: 'QA Testing and Cybersecurity',
    shortTitle: 'QA and Security',
    description: 'Ship quality software with better security confidence.',
    readTime: '4 min',
    accent: 'gold'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    shortTitle: 'Marketing',
    description: 'SEO, ads, social media, and lead generation that brings results.',
    readTime: '4 min',
    accent: 'mint'
  },
  {
    id: 'software-trainings',
    title: 'Software Trainings',
    shortTitle: 'Trainings',
    description: 'Practical B2B and B2C training in full stack, cloud, and AI/ML.',
    readTime: '5 min',
    accent: 'teal'
  }
];
