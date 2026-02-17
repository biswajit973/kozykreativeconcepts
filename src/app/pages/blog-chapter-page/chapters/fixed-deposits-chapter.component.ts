import { Component } from '@angular/core';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

@Component({
  selector: 'app-fixed-deposits-chapter',
  standalone: true,
  imports: [ChapterReaderComponent],
  template: `
    <app-chapter-reader [content]="content"></app-chapter-reader>
  `
})
export class FixedDepositsChapterComponent {
  readonly content: ChapterContent = {
    id: 'fixed-deposits',
    title: 'Fixed Deposits: Keep Important Money Safe',
    subtitle:
      'Fixed deposit is useful when money is needed in short term and safety matters more than high growth.',
    highlight:
      'Not every rupee should chase high return. Some money should stay safe and ready.',
    majorPros: [
      'Return is predictable and easy to plan.',
      'Capital risk is low compared to market-linked products.',
      'Useful for near goals like school fees or planned expenses.'
    ],
    pages: [
      {
        heading: 'Where FD Fits In Real Life',
        paragraphs: [
          'FD is a simple tool when you already know when you need money. Example: fee payment after 12 months.',
          'You lock money for a period and get known return. This helps in calm planning.',
          'For long-term growth, FD alone may not be enough after inflation. But for short-term goals, it is practical.'
        ],
        bulletTitle: 'Good Practice',
        bullets: [
          'Use FD ladder: split amount in multiple dates.',
          'Check post-tax return, not only headline interest rate.',
          'Do not put emergency money in one long lock-in FD.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'List your next 2-year expenses and park that amount in short FDs with staggered maturities.',
    cautionTitle: 'If You Ignore This',
    cautionText:
      'Keeping short-term goal money idle in savings account can reduce value after inflation.'
  };
}
