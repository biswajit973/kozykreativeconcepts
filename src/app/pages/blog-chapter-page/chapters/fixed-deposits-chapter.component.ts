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
    id: 'chatbots-automation',
    title: 'Chatbots and Automation: Save Time Every Day',
    subtitle:
      'Automation is not about replacing people. It is about removing repetitive work so teams can do meaningful tasks.',
    highlight:
      'Small workflow automation can create big productivity improvement.',
    majorPros: [
      'Support bots handle repeat questions quickly.',
      'Automatic routing reduces manual follow-up.',
      'Teams spend less time on repetitive tasks.',
      'Business gets faster response and cleaner operations.'
    ],
    pages: [
      {
        heading: 'Where Automation Gives Fast Results',
        paragraphs: [
          'Start from recurring tasks like lead assignment, reminder emails, ticket categorization, and report generation.',
          'These tasks are rule-based and are perfect for automation.',
          'Once automated, teams can focus on customer handling, strategy, and growth.'
        ],
        bulletTitle: 'Start small and expand',
        bullets: [
          'Pick one process with daily repetition.',
          'Define trigger, action, and owner clearly.',
          'Measure time saved after automation rollout.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Identify one repetitive process in sales, support, or operations and document how it currently flows manually.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Manual task overload scales with team size and quietly reduces productivity and speed.'
  };
}
