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
    id: 'software-trainings',
    title: 'Software Trainings: Build Real Skills For Real Work',
    subtitle:
      'Training should make teams job-ready and project-ready, not just certificate-ready.',
    highlight:
      'Skill upgrade is one of the fastest ways to improve delivery quality.',
    majorPros: [
      'Practical tracks: Python Full Stack, MERN, AWS, Azure DevOps, AI/ML.',
      'Useful for both companies (B2B) and individuals (B2C).',
      'Project-based learning improves confidence quickly.',
      'Teams reduce dependency and execute more internally.'
    ],
    pages: [
      {
        heading: 'Why Training Is Strategic',
        paragraphs: [
          'Technology keeps changing, so teams need regular upskilling.',
          'When teams understand modern stacks, delivery speed and quality improve.',
          'Training also helps businesses adopt cloud and AI faster with less confusion.'
        ],
        bulletTitle: 'Training model that works',
        bullets: [
          'Simple explanation with practical examples.',
          'Hands-on assignments and mini projects.',
          'Role-based learning tracks for teams.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Pick one team skill gap and start a focused training plan with measurable outcome.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Without regular upskilling, delivery quality and competitiveness can drop over time.'
  };
}
