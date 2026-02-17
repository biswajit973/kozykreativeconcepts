import { Component } from '@angular/core';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

@Component({
  selector: 'app-govt-bonds-chapter',
  standalone: true,
  imports: [ChapterReaderComponent],
  template: `
    <app-chapter-reader [content]="content"></app-chapter-reader>
  `
})
export class GovtBondsChapterComponent {
  readonly content: ChapterContent = {
    id: 'govt-bonds',
    title: 'Government Bonds: Stability For Your Portfolio',
    subtitle:
      'Government bonds can reduce portfolio shock when equity market moves sharply.',
    highlight:
      'If equity is accelerator, bonds are brakes. A safe drive needs both.',
    majorPros: [
      'Helps reduce total portfolio volatility.',
      'Supports disciplined asset allocation.',
      'Can reduce panic decisions during market correction.'
    ],
    pages: [
      {
        heading: 'How Bonds Help In Real Investing',
        paragraphs: [
          'Bonds generally play a stabilizer role. They are not always highest return products.',
          'When market fear is high, debt allocation gives emotional and financial balance.',
          'With proper mix, you can hold growth assets longer without panic exits.'
        ],
        bulletTitle: 'Simple Discipline',
        bullets: [
          'Fix debt percentage based on your risk comfort.',
          'Rebalance once or twice a year.',
          'Do not change allocation from daily market news.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Write your current asset mix and decide one stable debt allocation target for the next year.',
    cautionTitle: 'If You Ignore This',
    cautionText:
      'Without a stabilizer, many people sell equity in fear and lock losses at wrong time.'
  };
}
