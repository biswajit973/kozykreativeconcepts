import { Component } from '@angular/core';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

@Component({
  selector: 'app-health-cover-chapter',
  standalone: true,
  imports: [ChapterReaderComponent],
  template: `
    <app-chapter-reader [content]="content"></app-chapter-reader>
  `
})
export class HealthCoverChapterComponent {
  readonly content: ChapterContent = {
    id: 'health-cover',
    title: 'Health Insurance: Protect Savings From Hospital Bills',
    subtitle:
      'Medical costs are rising. One serious treatment can disturb family budget and long-term goals.',
    highlight:
      'Health insurance protects your savings during a medical emergency.',
    majorPros: [
      'Large hospital bills do not break your emergency fund.',
      'Family can focus on treatment, not money panic.',
      'Long-term investments stay untouched during health shock.'
    ],
    pages: [
      {
        heading: 'Why Health Cover Is Needed Early',
        paragraphs: [
          'When you buy health insurance early, waiting periods start early too. This helps future protection.',
          'If you wait too long, premium can become higher and some conditions may have restrictions.',
          'A base policy plus super top-up can give stronger cover at better cost.'
        ],
        bulletTitle: 'Before Buying',
        bullets: [
          'Check waiting period and exclusions.',
          'Check room-rent limits and claim process.',
          'Keep family floater sum assured practical for city medical costs.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Review current health cover amount and compare it with one major hospital event cost in your city.',
    cautionTitle: 'If You Delay',
    cautionText:
      'A sudden hospitalization can force you to break investments or take high-interest debt.'
  };
}
