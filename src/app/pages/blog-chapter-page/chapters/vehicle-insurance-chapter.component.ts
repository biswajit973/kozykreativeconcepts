import { Component } from '@angular/core';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

@Component({
  selector: 'app-vehicle-insurance-chapter',
  standalone: true,
  imports: [ChapterReaderComponent],
  template: `
    <app-chapter-reader [content]="content"></app-chapter-reader>
  `
})
export class VehicleInsuranceChapterComponent {
  readonly content: ChapterContent = {
    id: 'digital-marketing',
    title: 'Digital Marketing: Visibility That Converts',
    subtitle:
      'Marketing should not be random posting. It should bring qualified traffic and measurable lead flow.',
    highlight:
      'Digital marketing works best when content, ads, and landing pages run as one system.',
    majorPros: [
      'SEO improves organic discovery over time.',
      'Ads help capture high-intent traffic faster.',
      'Social media builds trust and recall.',
      'Tracking gives clear ROI visibility.'
    ],
    pages: [
      {
        heading: 'How Marketing Becomes Predictable',
        paragraphs: [
          'When campaign goals are clear, channel strategy becomes practical.',
          'Landing pages, creatives, and tracking must work together to convert traffic.',
          'Weekly review helps optimize spend and improve lead quality.'
        ],
        bulletTitle: 'Core growth loop',
        bullets: [
          'Attract: SEO + ads + social reach.',
          'Convert: clear landing and form flow.',
          'Optimize: review data and improve weekly.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Choose one campaign goal (leads, signups, demo requests) and align one landing page specifically for it.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Without digital visibility, competitors with stronger online presence will capture market attention first.'
  };
}
