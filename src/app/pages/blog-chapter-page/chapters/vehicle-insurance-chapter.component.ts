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
    id: 'vehicle-insurance',
    title: 'Vehicle Insurance: Small Premium, Big Support',
    subtitle:
      'Right motor policy can save a lot of out-of-pocket cost during accident or repair.',
    highlight:
      'Lowest premium is not always best. Correct cover is best.',
    majorPros: [
      'Protects from sudden repair and liability cost.',
      'Reduces claim-time confusion with proper add-ons.',
      'Helps preserve monthly cash flow after accident.'
    ],
    pages: [
      {
        heading: 'What To Review At Renewal Time',
        paragraphs: [
          'Many people renew same policy without reading details. This can cause problems at claim time.',
          'Check IDV, deductible, and add-ons based on your car usage.',
          'A slightly higher premium with better terms can save bigger money later.'
        ],
        bulletTitle: 'Renewal Checklist',
        bullets: [
          'Third-party cover is mandatory.',
          'Choose own-damage and useful add-ons smartly.',
          'Compare claim support quality, not only premium.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'If renewal is due in next 60 days, compare at least three plans and note claim differences.',
    cautionTitle: 'If You Ignore This',
    cautionText:
      'Wrong policy structure can force high personal spending when an accident happens.'
  };
}
