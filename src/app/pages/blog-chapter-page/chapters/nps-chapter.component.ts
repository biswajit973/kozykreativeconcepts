import { Component } from '@angular/core';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

@Component({
  selector: 'app-nps-chapter',
  standalone: true,
  imports: [ChapterReaderComponent],
  template: `
    <app-chapter-reader [content]="content"></app-chapter-reader>
  `
})
export class NpsChapterComponent {
  readonly content: ChapterContent = {
    id: 'nps',
    title: 'NPS: A Practical Retirement Plan',
    subtitle:
      'NPS helps you build retirement money step by step with long-term discipline and tax support.',
    highlight:
      'NPS is for retirement years. Start early, stay regular, and let long time do the work.',
    majorPros: [
      'Creates dedicated retirement corpus.',
      'Supports disciplined long-term investing.',
      'Offers useful tax benefits under applicable rules.',
      'Mix of equity and debt can balance growth and stability.'
    ],
    pages: [
      {
        heading: 'What Is NPS In Simple Words?',
        paragraphs: [
          'NPS means National Pension System. It is a retirement-focused account where you invest regularly for your future income years.',
          'Your money is invested in a mix of assets. Over long term, this can help build a retirement corpus.',
          'At retirement, part money can be withdrawn and part is usually used for pension income as per rules.'
        ],
        bulletTitle: 'Why People Choose NPS',
        bullets: [
          'Long-term structure for retirement planning.',
          'Tax benefit support for eligible investors.',
          'Transparent and regulated framework.'
        ]
      },
      {
        heading: 'When Should You Start NPS?',
        paragraphs: [
          'Earlier start usually means smaller monthly amount needed for same retirement goal.',
          'If you delay retirement planning, future contribution needed can become much higher.',
          'NPS can work best as part of a full retirement plan, not as your only investment.'
        ],
        bulletTitle: 'Simple NPS Discipline',
        bullets: [
          'Start with monthly amount you can continue.',
          'Increase contribution with salary growth.',
          'Review asset mix once a year.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Calculate your retirement age and monthly expense need, then start a practical NPS contribution amount.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Late retirement planning can create pressure in your 40s and 50s with much higher required monthly investment.'
  };
}
