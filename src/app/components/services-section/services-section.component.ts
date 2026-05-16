import { CommonModule, DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParticleFieldComponent } from '../ui/particle-field.component';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';

type ServiceCategoryId = 'development' | 'consulting' | 'training' | 'growth';
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
      title: 'Development',
      emoji: '💻',
      intro: 'Custom web and mobile application development.',
      cue: 'Open a card to see how we simplify software delivery.',
      items: [
        { id: 'software-development', name: 'Software Development', hook: 'Custom web and mobile application development.' }
      ]
    },
    {
      id: 'consulting',
      title: 'Consulting',
      emoji: '🧭',
      intro: 'Research, business consulting, resource consulting, and startup advisory.',
      cue: 'See how we help teams choose the right next move.',
      items: [
        { id: 'research-business-consulting', name: 'Research and Business Consulting', hook: 'Feasibility Study, SWOT Analysis, and Market Mindset.' },
        { id: 'resource-consulting', name: 'Resource Consulting', hook: 'Support for finding and shaping the right delivery resources.' },
        { id: 'startup-advisory', name: 'Startup Advisory and Incubator Setup Help', hook: 'Guidance for startup planning and incubator setup.' }
      ]
    },
    {
      id: 'training',
      title: 'Training',
      emoji: '🎓',
      intro: 'Skill development programs for teams and professionals.',
      cue: 'Training options that strengthen practical capability.',
      items: [
        { id: 'training-skill-development', name: 'Training and Skill Development', hook: 'PMP, Ethical Hacking, Testing, and Team Building.' }
      ]
    },
    {
      id: 'growth',
      title: 'Digital Growth',
      emoji: '📈',
      intro: 'Digital marketing support for visibility and growth.',
      cue: 'Marketing support focused on business outcomes.',
      items: [
        { id: 'digital-marketing', name: 'Digital Marketing', hook: 'Online visibility, campaigns, and lead-focused marketing.' }
      ]
    }
  ];

  readonly stories: ServiceStory[] = [
    {
      id: 'software-development',
      categoryId: 'development',
      title: 'Software Development',
      subtitle: 'Custom web and mobile application development for customers and internal teams.',
      iconKey: 'web-development',
      emoji: '📱',
      factChips: ['Web applications', 'Mobile applications', 'Custom development'],
      keyLine: 'Software should make business work easier, clearer, and more dependable.',
      highlightWords: ['web', 'mobile', 'custom', 'simple', 'business'],
      blocks: [
        {
          title: 'What we build',
          lines: ['Custom web applications for business operations and customer journeys.', 'Mobile applications that support staff, customers, and daily service flows.']
        },
        {
          title: 'How we deliver',
          lines: ['We keep the workflow simple and service-oriented.', 'The solution is planned around the real business problem, not extra complexity.']
        },
        {
          title: 'Business benefit',
          lines: ['Customers get software that fits how they work.', 'Teams get clearer systems for everyday use.']
        }
      ]
    },
    {
      id: 'research-business-consulting',
      categoryId: 'consulting',
      title: 'Research and Business Consulting',
      subtitle: 'Feasibility Study, SWOT Analysis, and Market Mindset support.',
      iconKey: 'business-digitalisation',
      emoji: '🧭',
      factChips: ['Feasibility Study', 'SWOT Analysis', 'Market Mindset'],
      keyLine: 'Good consulting helps a team see the opportunity and the risk before building.',
      highlightWords: ['feasibility', 'SWOT', 'market', 'business'],
      blocks: [
        {
          title: 'Research layer',
          lines: ['We study feasibility before major product or business decisions.', 'We use SWOT Analysis to clarify strengths, risks, and gaps.']
        },
        {
          title: 'Business view',
          lines: ['Market Mindset support helps the team understand customers and positioning.', 'The output is practical guidance for the next business step.']
        },
        {
          title: 'Business benefit',
          lines: ['Teams make decisions with more clarity.', 'Projects begin with stronger direction and fewer avoidable assumptions.']
        }
      ]
    },
    {
      id: 'training-skill-development',
      categoryId: 'training',
      title: 'Training and Skill Development',
      subtitle: 'PMP, Ethical Hacking, Testing, and Team Building programs.',
      iconKey: 'software-trainings',
      emoji: '🎓',
      factChips: ['PMP', 'Ethical Hacking', 'Testing', 'Team Building'],
      keyLine: 'Skill development should make teams more capable in real work.',
      highlightWords: ['training', 'skills', 'PMP', 'testing', 'team'],
      blocks: [
        {
          title: 'Training areas',
          lines: ['Project Management Certification support through PMP-oriented training.', 'Ethical Hacking and Testing programs for technology teams.']
        },
        {
          title: 'Team capability',
          lines: ['Team Building programs support collaboration and delivery confidence.', 'Programs can be shaped for business teams or technical teams.']
        },
        {
          title: 'Business benefit',
          lines: ['Teams become more confident and prepared.', 'Organizations strengthen internal capability instead of depending only on outside support.']
        }
      ]
    },
    {
      id: 'resource-consulting',
      categoryId: 'consulting',
      title: 'Resource Consulting',
      subtitle: 'Support for identifying, planning, and aligning the resources needed for delivery.',
      iconKey: 'cloud-devops',
      emoji: '☁️',
      factChips: ['Resource planning', 'Capability matching', 'Delivery support'],
      keyLine: 'The right resources help a project move with less friction.',
      highlightWords: ['resource', 'planning', 'delivery', 'support'],
      blocks: [
        {
          title: 'Planning',
          lines: ['We help identify what kind of resource support the work needs.', 'The focus is on capability, fit, and delivery readiness.']
        },
        {
          title: 'Execution support',
          lines: ['Resource consulting can support project teams, product teams, and operational teams.', 'The aim is to reduce gaps between business need and delivery capacity.']
        },
        {
          title: 'Business benefit',
          lines: ['Clients get a clearer view of the people and skills needed.', 'Project execution becomes easier to plan and manage.']
        }
      ]
    },
    {
      id: 'digital-marketing',
      categoryId: 'growth',
      title: 'Digital Marketing',
      subtitle: 'Digital marketing support for online visibility, campaigns, and customer reach.',
      iconKey: 'digital-marketing',
      emoji: '📣',
      factChips: ['Online visibility', 'Campaign support', 'Customer reach'],
      keyLine: 'Marketing should help the business become easier to discover and easier to contact.',
      highlightWords: ['digital', 'marketing', 'visibility', 'customers'],
      blocks: [
        {
          title: 'What we support',
          lines: ['Digital presence and campaign support for business growth.', 'Messaging and online channels shaped around the customer mindset.']
        },
        {
          title: 'How we think',
          lines: ['Marketing activity should connect visibility with enquiries.', 'The digital story should be simple for customers to understand.']
        },
        {
          title: 'Business benefit',
          lines: ['Improved reach and clearer customer communication.', 'Better support for sales and brand awareness.']
        }
      ]
    },
    {
      id: 'startup-advisory',
      categoryId: 'consulting',
      title: 'Startup Advisory and Incubator Setup Help',
      subtitle: 'Guidance for startup planning, business direction, and incubator setup help.',
      iconKey: 'chatbot-automation',
      emoji: '🚀',
      factChips: ['Startup advisory', 'Incubator setup', 'Business direction'],
      keyLine: 'Startups need simple, grounded support before scaling the idea.',
      highlightWords: ['startup', 'incubator', 'business', 'simple'],
      blocks: [
        {
          title: 'Startup support',
          lines: ['We help founders think through early business and technology choices.', 'The goal is to make the starting path clearer and easier to act on.']
        },
        {
          title: 'Incubator setup',
          lines: ['We support the planning mindset needed for incubator setup help.', 'The guidance stays practical, simple, and service-oriented.']
        },
        {
          title: 'Business benefit',
          lines: ['Founders get clearer direction before investing too much time or money.', 'The idea becomes easier to explain, validate, and build.']
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
    return this.subItemMap.get(storyId)?.hook ?? 'Simple explanation of how this service helps the business.';
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
