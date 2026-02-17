import { CommonModule, DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';

type ServiceCategoryId = 'savings' | 'protection' | 'others';
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
  imports: [CommonModule],
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
    'mutual-funds': '📈',
    'fixed-deposits': '🏦',
    bonds: '📜',
    'term-insurance': '🛡️',
    'health-insurance': '🩺',
    'vehicle-insurance': '🚗',
    nps: '🧓'
  };

  readonly iconTileClassByKey: Record<string, string> = {
    'mutual-funds': 'icon-mutual-funds',
    'term-insurance': 'icon-term-insurance',
    'fixed-deposits': 'icon-fixed-deposits',
    'health-insurance': 'icon-health-insurance',
    bonds: 'icon-bonds',
    'vehicle-insurance': 'icon-vehicle-insurance',
    nps: 'icon-nps'
  };

  readonly categories: ServiceCategory[] = [
    {
      id: 'savings',
      title: 'Savings and Investment',
      emoji: '💰',
      intro: 'Build your money in a steady and smart way.',
      cue: 'Use arrows to slide cards. Click Know More for a simple story.',
      items: [
        { id: 'mutual-funds', name: 'Mutual Funds', hook: 'Start small, grow big over time.' },
        { id: 'fixed-deposits', name: 'Fixed Deposits', hook: 'Stable returns for peace of mind.' },
        { id: 'bonds', name: 'Bonds', hook: 'Balance your portfolio with stability.' }
      ]
    },
    {
      id: 'protection',
      title: 'Protection',
      emoji: '🛡️',
      intro: 'Protect your family from sudden financial shocks.',
      cue: 'Pick a protection card and open the full real-life story.',
      items: [
        { id: 'term-insurance', name: 'Term Insurance', hook: 'Family backup when income stops.' },
        { id: 'health-insurance', name: 'Health Insurance', hook: 'Save your savings during hospital bills.' },
        { id: 'vehicle-insurance', name: 'Vehicle Insurance', hook: 'Avoid big accident-related money hits.' }
      ]
    },
    {
      id: 'others',
      title: 'Others',
      emoji: '🌱',
      intro: 'Build long-term retirement confidence.',
      cue: 'One focused option for retirement planning.',
      items: [{ id: 'nps', name: 'NPS', hook: 'Retirement planning with yearly discipline.' }]
    }
  ];

  readonly stories: ServiceStory[] = [
    {
      id: 'mutual-funds',
      categoryId: 'savings',
      title: 'Mutual Funds',
      subtitle: 'Small monthly SIP can build a big future corpus.',
      iconKey: 'mutual-funds',
      emoji: '📊',
      factChips: ['Start from ₹5,000', 'Monthly SIP habit', 'Long-term compounding'],
      keyLine: 'Start small and stay regular. Time helps your money grow.',
      highlightWords: ['small', 'regular', 'grow', 'time', 'goal'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Maya wanted money for her daughter college goal.', 'She could save only a small amount each month.']
        },
        {
          title: 'What happened',
          lines: ['She kept money in a normal account for years.', 'Her goal started looking far and difficult.']
        },
        {
          title: 'What changed',
          lines: ['She started SIP in mutual funds.', 'She stayed regular and did yearly review.']
        },
        {
          title: 'Simple benefit',
          lines: ['Compounding started helping her.', 'The same monthly habit began building real wealth.']
        }
      ]
    },
    {
      id: 'fixed-deposits',
      categoryId: 'savings',
      title: 'Fixed Deposits',
      subtitle: 'A clear FD plan can give steady returns and less stress.',
      iconKey: 'fixed-deposits',
      emoji: '🏦',
      factChips: ['Stable return', 'Known maturity date', 'Low stress option'],
      keyLine: 'If you want steady and predictable growth, FD can be useful.',
      highlightWords: ['steady', 'predictable', 'safe', 'stress'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Prakash wanted safe parking for emergency and short goals.', 'He did not want market ups and downs.']
        },
        {
          title: 'What happened',
          lines: ['He opened random deposits without a plan.', 'He broke them often and lost the structure.']
        },
        {
          title: 'What changed',
          lines: ['He moved to a planned FD ladder.', 'Each FD was linked to one clear family need.']
        },
        {
          title: 'Simple benefit',
          lines: ['Cash flow became easy to track.', 'He got peace, clarity, and better money discipline.']
        }
      ]
    },
    {
      id: 'bonds',
      categoryId: 'savings',
      title: 'Bonds',
      subtitle: 'Bonds can calm a portfolio when markets move too fast.',
      iconKey: 'bonds',
      emoji: '📘',
      factChips: ['Fixed income layer', 'Lower volatility', 'Better balance'],
      keyLine: 'Bonds add stability when your portfolio feels too aggressive.',
      highlightWords: ['calm', 'stability', 'balance', 'confidence'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Neha had most money in equity.', 'One sharp market fall made her worried.']
        },
        {
          title: 'What happened',
          lines: ['She delayed decisions due to fear.', 'Her allocation became unbalanced.']
        },
        {
          title: 'What changed',
          lines: ['She added bonds as fixed income support.', 'Portfolio risk became closer to her comfort level.']
        },
        {
          title: 'Simple benefit',
          lines: ['Portfolio swings reduced.', 'She could stay invested with more confidence.']
        }
      ]
    },
    {
      id: 'term-insurance',
      categoryId: 'protection',
      title: 'Term Insurance',
      subtitle: 'One low-cost plan can protect your family life if you are not there.',
      iconKey: 'term-insurance',
      emoji: '🛡️',
      factChips: ['₹10,000/year', 'Age 30 to 60', '₹2 crore cover'],
      keyLine: 'Term insurance is not for return. It is for family survival.',
      highlightWords: ['₹10,000', '30 years', '₹2 crore', 'family', 'income', 'survival'],
      comparison: {
        left: {
          name: 'Rakesh',
          emoji: '✅',
          tone: 'safe',
          points: [
            'Rakesh started term insurance at age 30.',
            'He paid ₹10,000 per year.',
            'He paid till age 60, so total 30 years.',
            'His coverage is ₹2 crore.',
            'He has a wife and two children.',
            'If he dies, family gets money support and can continue life.'
          ]
        },
        right: {
          name: 'Johnny',
          emoji: '⚠️',
          tone: 'risk',
          points: [
            'Johnny did not take term insurance.',
            'He also has family responsibilities.',
            'If he dies, income stops immediately.',
            'Family may struggle with rent, school fees, and loan EMI.',
            'They may cut basic needs and sell assets under pressure.'
          ]
        }
      },
      blocks: [
        {
          title: 'Situation',
          lines: ['Both are family earners.', 'Both have regular monthly responsibilities.']
        },
        {
          title: 'What happened',
          lines: ['Rakesh planned early.', 'Johnny postponed the decision every year.']
        },
        {
          title: 'What changed',
          lines: ['Rakesh family has a backup plan.', 'Johnny family faces sudden financial shock.']
        },
        {
          title: 'Simple benefit',
          lines: ['Small premium can protect a full family future.', 'This is pure protection, not an investment product.']
        }
      ]
    },
    {
      id: 'health-insurance',
      categoryId: 'protection',
      title: 'Health Insurance',
      subtitle: 'One hospital bill can eat many years of savings.',
      iconKey: 'health-insurance',
      emoji: '🏥',
      factChips: ['Medical cost shield', 'Family floater option', 'Protect savings'],
      keyLine: 'Health policy helps you focus on treatment, not money panic.',
      highlightWords: ['hospital', 'savings', 'treatment', 'panic', 'family'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Sonia had some savings but no strong health cover.', 'She thought serious bills would not come.']
        },
        {
          title: 'What happened',
          lines: ['A sudden hospitalization came.', 'Family paid a large amount from savings.']
        },
        {
          title: 'What changed',
          lines: ['She bought a proper family health policy.', 'Future treatment costs became more manageable.']
        },
        {
          title: 'Simple benefit',
          lines: ['Savings stayed safer during emergencies.', 'Family could focus on recovery with less stress.']
        }
      ]
    },
    {
      id: 'vehicle-insurance',
      categoryId: 'protection',
      title: 'Vehicle Insurance',
      subtitle: 'Accidents can bring repair cost, legal cost, and third-party cost together.',
      iconKey: 'vehicle-insurance',
      emoji: '🚘',
      factChips: ['Repair cover', 'Third-party cover', 'Lower out-of-pocket shock'],
      keyLine: 'A good motor policy can save you from sudden big bills.',
      highlightWords: ['accident', 'repair', 'third-party', 'cost', 'shock'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Arun uses car daily for office and family work.', 'He delayed proper cover to save premium.']
        },
        {
          title: 'What happened',
          lines: ['After an accident, repair bill was high.', 'Third-party expense added more pressure.']
        },
        {
          title: 'What changed',
          lines: ['He moved to a better policy with useful add-ons.', 'Claim support reduced cash stress.']
        },
        {
          title: 'Simple benefit',
          lines: ['He avoided a heavy one-time money hit.', 'Now he drives with more confidence.']
        }
      ]
    },
    {
      id: 'nps',
      categoryId: 'others',
      title: 'NPS',
      subtitle: 'Retirement planning works best when you start early and stay steady.',
      iconKey: 'nps',
      emoji: '🌿',
      factChips: ['Retirement discipline', 'Long-term corpus', 'Pension-focused path'],
      keyLine: 'Small yearly discipline today can create a better retired life.',
      highlightWords: ['retirement', 'early', 'discipline', 'corpus', 'future'],
      blocks: [
        {
          title: 'Situation',
          lines: ['Dev wanted future pension support.', 'He had no fixed retirement habit.']
        },
        {
          title: 'What happened',
          lines: ['He kept postponing retirement planning.', 'Years passed but corpus stayed low.']
        },
        {
          title: 'What changed',
          lines: ['He started regular NPS contribution.', 'He added yearly top-up with discipline.']
        },
        {
          title: 'Simple benefit',
          lines: ['Retirement path became clear.', 'He now has better confidence for later life.']
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
    return this.subItemMap.get(storyId)?.hook ?? 'Simple story that explains the real benefit.';
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
