import { Component } from '@angular/core';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

@Component({
  selector: 'app-mutual-funds-chapter',
  standalone: true,
  imports: [ChapterReaderComponent],
  template: `
    <app-chapter-reader [content]="content"></app-chapter-reader>
  `
})
export class MutualFundsChapterComponent {
  readonly content: ChapterContent = {
    id: 'web-development',
    title: 'Web Development: Your 24x7 Digital Front Desk',
    subtitle:
      'Your website should not only look modern. It should explain value clearly and convert visitors into enquiries.',
    highlight:
      'A high-performing website improves trust, conversion, and business speed.',
    majorPros: [
      'Landing pages improve ad and campaign performance.',
      'Web apps help teams run operations from one system.',
      'Gen AI integrations can improve support and lead capture.',
      'Clear tracking helps you know what is working.'
    ],
    pages: [
      {
        heading: 'Why Most Websites Underperform',
        paragraphs: [
          'Many websites are built like brochure pages. They look okay but do not guide users to next action.',
          'Without clear call-to-action and funnel logic, traffic comes but enquiries remain low.',
          'We design pages with intent mapping, so users know what to do next.'
        ],
        bulletTitle: 'Core web essentials',
        bullets: [
          'Fast loading and mobile-first layout.',
          'Clear CTA buttons and enquiry flow.',
          'Analytics and event tracking from day one.'
        ]
      },
      {
        heading: 'From Website to Business Engine',
        paragraphs: [
          'A strong web setup can connect leads, CRM, support, and marketing in one chain.',
          'This makes follow-up faster and improves conversion quality.',
          'Over time, your website becomes a business system, not just an online poster.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Audit your website homepage and ask one question: can a new visitor understand what you do in 10 seconds?',
    cautionTitle: 'If You Delay',
    cautionText:
      'Weak digital presence can push high-intent leads to competitors with clearer web experience.'
  };
}
