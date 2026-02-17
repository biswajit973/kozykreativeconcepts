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
    id: 'qa-cybersecurity',
    title: 'QA Testing and Cybersecurity: Launch With Confidence',
    subtitle:
      'Quality and security checks reduce post-release fire-fighting and protect customer trust.',
    highlight:
      'Testing is cheaper before launch and costly after production bugs appear.',
    majorPros: [
      'Manual and automation testing catch defects early.',
      'Regression checks reduce repeated bug leakage.',
      'Security checks improve baseline protection.',
      'Teams release with better confidence and fewer incidents.'
    ],
    pages: [
      {
        heading: 'Why QA Is Business-Critical',
        paragraphs: [
          'A bug in production affects user trust, support load, and brand image.',
          'With proper QA cycle, many failures are caught before users see them.',
          'Security checks should run alongside QA, not as last-minute step.'
        ],
        bulletTitle: 'Release readiness checklist',
        bullets: [
          'Critical user flow test completed.',
          'Regression suite executed and reviewed.',
          'Security test observations resolved.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Create a release checklist with QA and security gates for every production deployment.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Late-stage bugs and security issues can cost more than prevention by a large margin.'
  };
}
