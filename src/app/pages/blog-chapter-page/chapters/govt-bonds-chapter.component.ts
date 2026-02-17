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
    id: 'cloud-devops',
    title: 'Cloud and DevOps: Build Fast, Deploy Safe',
    subtitle:
      'Cloud and DevOps help you release features quickly while keeping systems stable and observable.',
    highlight:
      'Reliable deployment process reduces launch risk and downtime stress.',
    majorPros: [
      'AWS, Azure, and GCP setup based on workload needs.',
      'CI/CD pipelines improve release consistency.',
      'Monitoring and alerts improve issue response time.',
      'Teams collaborate better with clean DevOps workflow.'
    ],
    pages: [
      {
        heading: 'Why DevOps Matters In Real Projects',
        paragraphs: [
          'Many teams can code features but struggle during deployment.',
          'Without release automation, manual errors and downtime risk increase.',
          'DevOps creates a repeatable process so every release is safer and faster.'
        ],
        bulletTitle: 'Cloud-DevOps must-haves',
        bullets: [
          'Environment strategy (dev, staging, production).',
          'Pipeline checks before deploy.',
          'Rollback and monitoring plan ready.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Check your current release process and list manual steps that can be automated with CI/CD.',
    cautionTitle: 'If You Delay',
    cautionText:
      'As product grows, manual deployment risk increases and can cause costly service interruptions.'
  };
}
