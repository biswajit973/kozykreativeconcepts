import { CommonModule, DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParticleFieldComponent } from '../ui/particle-field.component';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';

type ServiceCategoryId = 'development' | 'automation' | 'cloud-quality' | 'growth-training';
type ServiceFilterId = 'all' | ServiceCategoryId;

interface ServiceSubItem {
  id: string;
  name: string;
  hook: string;
}

interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  emoji: string;
  intro: string;
  cue: string;
  items: ServiceSubItem[];
}

interface StoryPanelBlock {
  title: string;
  lines: string[];
}

interface StoryPersonPath {
  name: string;
  emoji: string;
  tone: 'safe' | 'risk';
  points: string[];
}

interface ServiceStory {
  id: string;
  categoryId: ServiceCategoryId;
  title: string;
  subtitle: string;
  iconKey: string;
  emoji: string;
  factChips: string[];
  keyLine: string;
  highlightWords?: string[];
  blocks: StoryPanelBlock[];
  comparison?: {
    left: StoryPersonPath;
    right: StoryPersonPath;
  };
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticleFieldComponent, HoverSparkDirective],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css',
  animations: [
    trigger('storyOverlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('220ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('storyModal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(18px) scale(0.97)' }),
        animate('280ms cubic-bezier(.16,1,.3,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(10px) scale(0.985)' }))
      ])
    ]),
    trigger('storyBlock', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('220ms 70ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ServicesSectionComponent implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private bodyOverflowBeforeStory = '';
  private readonly highlightCache = new Map<string, string>();
  selectedFilter: ServiceFilterId = 'all';
  activeStoryId: string | null = null;

  readonly iconByKey: Record<string, string> = {
    'app-development': '📱',
    'web-development': '🌐',
    'chatbot-automation': '🤖',
    'cloud-devops': '☁️',
    'qa-cybersecurity': '🛡️',
    'digital-marketing': '📣',
    'business-digitalisation': '🏢',
    'software-trainings': '🎓'
  };

  readonly iconTileClassByKey: Record<string, string> = {
    'app-development': 'icon-app-development',
    'web-development': 'icon-web-development',
    'chatbot-automation': 'icon-chatbot-automation',
    'cloud-devops': 'icon-cloud-devops',
    'qa-cybersecurity': 'icon-qa-cybersecurity',
    'digital-marketing': 'icon-digital-marketing',
    'business-digitalisation': 'icon-business-digitalisation',
    'software-trainings': 'icon-software-trainings'
  };

  readonly categories: ServiceCategory[] = [
    {
      id: 'development',
      title: 'App and Web Development',
      emoji: '💻',
      intro: 'Build fast, clean, and scalable digital products.',
      cue: 'Open each card to see simple real business use-cases.',
      items: [
        { id: 'app-development', name: 'App Development', hook: 'Android, iOS, Windows, and Mac app builds.' },
        { id: 'web-development', name: 'Web Development', hook: 'Landing pages, websites, and web applications.' }
      ]
    },
    {
      id: 'automation',
      title: 'Automation and AI',
      emoji: '🤖',
      intro: 'Reduce manual work and increase team speed.',
      cue: 'See how chatbot and business automation save daily effort.',
      items: [
        { id: 'chatbot-automation', name: 'Chatbots and Automation', hook: 'Support bots and smart workflow automation.' }
      ]
    },
    {
      id: 'cloud-quality',
      title: 'Cloud, DevOps and Quality',
      emoji: '☁️',
      intro: 'Deploy with confidence and keep systems stable.',
      cue: 'Cloud setup, testing, and security from one team.',
      items: [
        { id: 'cloud-devops', name: 'Cloud and DevOps', hook: 'AWS, Azure, GCP with deployment and monitoring.' },
        { id: 'qa-cybersecurity', name: 'QA and Cybersecurity', hook: 'Manual + automation testing and security checks.' }
      ]
    },
    {
      id: 'growth-training',
      title: 'Growth and Digitalisation',
      emoji: '📈',
      intro: 'Bring offline business online and train teams for growth.',
      cue: 'From digital marketing to software trainings, we support execution.',
      items: [
        { id: 'digital-marketing', name: 'Digital Marketing', hook: 'SEO, social media, ads, and lead generation.' },
        { id: 'business-digitalisation', name: 'Business Consulting and Digitalisation', hook: 'Step-by-step guidance to go digital.' },
        { id: 'software-trainings', name: 'Software Trainings', hook: 'B2B and B2C trainings in modern tech stacks.' }
      ]
    }
  ];

  readonly stories: ServiceStory[] = [
    {
      id: 'app-development',
      categoryId: 'development',
      title: 'App Development',
      subtitle: 'Android, iOS, Windows, and Mac apps built for real business workflows.',
      iconKey: 'app-development',
      emoji: '📱',
      factChips: ['Android + iOS', 'Desktop support', 'Product-first delivery'],
      keyLine: 'We build apps that are simple to use, fast to load, and easy to scale.',
      highlightWords: ['fast', 'simple', 'scale', 'delivery', 'users'],
      blocks: [
        {
          title: 'Situation',
          lines: ['A business had sales teams working on calls, spreadsheets, and manual follow-up.', 'Daily updates were slow and data was scattered.']
        },
        {
          title: 'What we build',
          lines: ['We designed a mobile app and admin panel for daily updates.', 'Role-based access and simple dashboards were added.']
        },
        {
          title: 'How we deliver',
          lines: ['Sprint-based development with weekly demos.', 'Clear testing checkpoints before each release.']
        },
        {
          title: 'Business benefit',
          lines: ['Team updates became real-time.', 'Decision makers got cleaner and faster visibility.']
        }
      ]
    },
    {
      id: 'web-development',
      categoryId: 'development',
      title: 'Web Development',
      subtitle: 'Landing pages, websites, web apps, and Gen AI integrations for business growth.',
      iconKey: 'web-development',
      emoji: '🌐',
      factChips: ['Landing pages', 'Web apps', 'AI/ML integration'],
      keyLine: 'Your website should not just look good. It should convert and support operations.',
      highlightWords: ['convert', 'website', 'web app', 'performance', 'business'],
      blocks: [
        {
          title: 'Situation',
          lines: ['A company had traffic but low enquiry conversion.', 'Website pages were slow and forms were not tracked properly.']
        },
        {
          title: 'What we build',
          lines: ['We redesigned high-intent pages and lead funnels.', 'Tracking, CRM sync, and analytics events were implemented.']
        },
        {
          title: 'Technical layer',
          lines: ['Modern frontend stack, secure backend APIs, and scalable hosting.', 'Optional AI assistant integration for FAQs and lead capture.']
        },
        {
          title: 'Business benefit',
          lines: ['Better lead quality and higher conversion intent.', 'Teams spend less time chasing incomplete enquiries.']
        }
      ]
    },
    {
      id: 'chatbot-automation',
      categoryId: 'automation',
      title: 'Chatbots and Automation',
      subtitle: 'Customer support bots and business automations that reduce repetitive work.',
      iconKey: 'chatbot-automation',
      emoji: '🤖',
      factChips: ['24x7 chatbot support', 'Workflow rules', 'Agent integration'],
      keyLine: 'Automate repetitive tasks so your team can focus on high-value work.',
      highlightWords: ['automate', 'support', 'save time', 'team', 'workflow'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Support team answered the same questions every day.', 'Manual ticket sorting consumed too much time.']
        },
        {
          title: 'What we build',
          lines: ['A chatbot handled common queries and captured user intent.', 'Tickets were auto-routed to the right team using workflows.']
        },
        {
          title: 'Integration layer',
          lines: ['Connected bot with CRM, email, and internal tools.', 'Added handover flow for human agent when needed.']
        },
        {
          title: 'Business benefit',
          lines: ['Faster response time and lower manual load.', 'Support quality improved with consistent answers.']
        }
      ]
    },
    {
      id: 'cloud-devops',
      categoryId: 'cloud-quality',
      title: 'Cloud and DevOps',
      subtitle: 'AWS, Azure, and Google Cloud setup with deployment, monitoring, and support.',
      iconKey: 'cloud-devops',
      emoji: '☁️',
      factChips: ['AWS • Azure • GCP', 'CI/CD pipelines', 'Monitoring and alerts'],
      keyLine: 'Reliable infrastructure and clean DevOps reduce release stress.',
      highlightWords: ['cloud', 'deployment', 'monitoring', 'reliable', 'support'],
      blocks: [
        {
          title: 'Situation',
          lines: ['A team had frequent downtime during new release.', 'Rollback and monitoring process was weak.']
        },
        {
          title: 'What we build',
          lines: ['Set up CI/CD pipeline with environment checks.', 'Added logs, uptime tracking, and alerting.']
        },
        {
          title: 'Operational model',
          lines: ['Release playbook with backup and rollback plan.', 'Infra changes documented for team continuity.']
        },
        {
          title: 'Business benefit',
          lines: ['More stable releases and faster issue detection.', 'Product teams can ship with confidence.']
        }
      ]
    },
    {
      id: 'qa-cybersecurity',
      categoryId: 'cloud-quality',
      title: 'QA Testing and Cybersecurity',
      subtitle: 'Manual testing, automation testing, and basic security checks before go-live.',
      iconKey: 'qa-cybersecurity',
      emoji: '🧪',
      factChips: ['Manual + automation QA', 'Security test support', 'Release readiness'],
      keyLine: 'Quality and security should be part of delivery, not an afterthought.',
      highlightWords: ['quality', 'security', 'testing', 'bugs', 'release'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Production issues were rising after each release.', 'Critical bugs were found late.']
        },
        {
          title: 'What we build',
          lines: ['Test cases, regression suite, and automation where useful.', 'Basic vulnerability checks and secure coding review support.']
        },
        {
          title: 'Process',
          lines: ['Pre-release QA gate with severity-based reporting.', 'Clear defect closure and retest cycle.']
        },
        {
          title: 'Business benefit',
          lines: ['Fewer post-release incidents.', 'Better customer trust and smoother product usage.']
        }
      ]
    },
    {
      id: 'digital-marketing',
      categoryId: 'growth-training',
      title: 'Digital Marketing',
      subtitle: 'SEO, social media, ads, lead generation, and online branding support.',
      iconKey: 'digital-marketing',
      emoji: '📣',
      factChips: ['SEO + Ads', 'Lead generation', 'Brand visibility'],
      keyLine: 'Digital presence should bring business results, not just likes.',
      highlightWords: ['SEO', 'leads', 'ads', 'branding', 'results'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Brand visibility was low and leads were inconsistent.', 'Campaign spend was not tracked properly.']
        },
        {
          title: 'What we do',
          lines: ['Set up channel strategy for search, social, and paid campaigns.', 'Built landing funnels and conversion tracking.']
        },
        {
          title: 'Execution style',
          lines: ['Weekly reporting with clear KPI dashboard.', 'Campaigns optimized using performance insights.']
        },
        {
          title: 'Business benefit',
          lines: ['Better lead quality and stronger online visibility.', 'Marketing budget gets more accountable outcomes.']
        }
      ]
    },
    {
      id: 'business-digitalisation',
      categoryId: 'growth-training',
      title: 'Business Consulting and Digitalisation',
      subtitle: 'We help offline businesses come online with practical tech and marketing roadmap.',
      iconKey: 'business-digitalisation',
      emoji: '🏭',
      factChips: ['Offline to online', 'Step-by-step roadmap', 'Practical execution'],
      keyLine: 'Digital transformation works best when done in clear and simple phases.',
      highlightWords: ['digital', 'roadmap', 'online', 'process', 'growth'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Business was running fully offline with manual records.', 'Owners wanted growth but did not know where to start.']
        },
        {
          title: 'What we plan',
          lines: ['We mapped digital priorities: website, lead flow, operations, and reports.', 'Phased rollout was created based on budget and team readiness.']
        },
        {
          title: 'How we support',
          lines: ['Team onboarding and process training with simple SOPs.', 'Regular checkpoints to ensure adoption.']
        },
        {
          title: 'Business benefit',
          lines: ['Business became more visible, measurable, and process-driven.', 'Owners got better control over growth decisions.']
        }
      ]
    },
    {
      id: 'software-trainings',
      categoryId: 'growth-training',
      title: 'Software Trainings (B2B and B2C)',
      subtitle: 'Practical training programs for Python Full Stack, MERN, AWS, Azure DevOps, and AI/ML.',
      iconKey: 'software-trainings',
      emoji: '🎓',
      factChips: ['Python Full Stack', 'MERN + Cloud', 'AI/ML training'],
      keyLine: 'Skill upgrade creates long-term team strength and delivery confidence.',
      highlightWords: ['training', 'skills', 'team', 'cloud', 'AI/ML'],
      blocks: [
        {
          title: 'Who it helps',
          lines: ['Companies that need job-ready internal teams.', 'Students and professionals who want practical upskilling.']
        },
        {
          title: 'Training format',
          lines: ['Project-based sessions with clear module structure.', 'Beginner-friendly explanation in simple language.']
        },
        {
          title: 'Tracks we offer',
          lines: ['Python Full Stack, MERN Stack, AWS, Azure DevOps, AI and ML.', 'Corporate custom tracks based on team role.']
        },
        {
          title: 'Outcome',
          lines: ['Learners become more confident in real projects.', 'Organizations reduce dependency on external hiring.']
        }
      ]
    }
  ];

  private readonly storyMap = new Map<string, ServiceStory>(this.stories.map((story) => [story.id, story] as const));
  private readonly subItemMap = new Map<string, ServiceSubItem>(
    this.categories.flatMap((category) => category.items.map((item) => [item.id, item] as const))
  );

  get visibleStories(): ServiceStory[] {
    if (this.selectedFilter === 'all') {
      return this.stories;
    }
    return this.stories.filter((story) => story.categoryId === this.selectedFilter);
  }

  get activeStory(): ServiceStory | null {
    if (!this.activeStoryId) {
      return null;
    }
    return this.storyMap.get(this.activeStoryId) ?? null;
  }

  selectFilter(filterId: ServiceFilterId): void {
    if (this.selectedFilter === filterId) {
      return;
    }
    this.selectedFilter = filterId;
  }

  storyHook(storyId: string): string {
    return this.subItemMap.get(storyId)?.hook ?? 'Simple story that explains practical business value.';
  }

  iconTileClass(iconKey: string): string {
    return this.iconTileClassByKey[iconKey] ?? 'icon-default';
  }

  openStory(storyId: string): void {
    const story = this.storyMap.get(storyId);
    if (!story) {
      return;
    }
    this.activeStoryId = story.id;
    this.lockBodyScroll();
  }

  closeStory(): void {
    this.activeStoryId = null;
    this.unlockBodyScroll();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeStory();
    }
  }

  categoryTitle(categoryId: ServiceCategoryId): string {
    return this.categories.find((category) => category.id === categoryId)?.title ?? 'Service';
  }

  highlightLine(line: string, words?: string[]): string {
    if (!words || words.length === 0) {
      return line;
    }
    const cacheKey = `${line}__${words.join('|')}`;
    const cached = this.highlightCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    let rendered = line;
    words.forEach((word) => {
      const cleanWord = word.trim();
      if (!cleanWord) {
        return;
      }
      const regex = new RegExp(`(${this.escapeRegExp(cleanWord)})`, 'gi');
      rendered = rendered.replace(regex, '<span class="story-marker">$1</span>');
    });
    this.highlightCache.set(cacheKey, rendered);
    return rendered;
  }

  trackByCategory(_index: number, category: ServiceCategory): ServiceCategoryId {
    return category.id;
  }

  trackByStoryId(_index: number, story: ServiceStory): string {
    return story.id;
  }

  trackByFilter(_index: number, category: ServiceCategory): ServiceCategoryId {
    return category.id;
  }

  trackByStoryBlock(_index: number, block: StoryPanelBlock): string {
    return block.title;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeStoryId) {
      this.closeStory();
    }
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

  private lockBodyScroll(): void {
    if (this.doc.body.style.overflow === 'hidden') {
      return;
    }
    this.bodyOverflowBeforeStory = this.doc.body.style.overflow;
    this.doc.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    this.doc.body.style.overflow = this.bodyOverflowBeforeStory;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
