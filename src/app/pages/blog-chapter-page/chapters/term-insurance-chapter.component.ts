import { Component } from '@angular/core';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

@Component({
  selector: 'app-term-insurance-chapter',
  standalone: true,
  imports: [ChapterReaderComponent],
  template: `
    <app-chapter-reader [content]="content"></app-chapter-reader>
  `
})
export class TermInsuranceChapterComponent {
  readonly content: ChapterContent = {
    id: 'app-development',
    title: 'App Development: Build What Teams Actually Use',
    subtitle:
      'A good app is not just design. It should solve a real daily business problem and stay easy for users.',
    storyTitle: 'From Manual Updates to One App Flow',
    storyText:
      'A distribution business was using calls, WhatsApp, and spreadsheets for daily field updates. Managers got delayed reports and teams repeated the same data entry many times. We built one business app with role-wise access for field teams, managers, and admin. Daily reporting became real-time and cleaner. Teams stopped chasing files and started focusing on execution.',
    highlight:
      'App development works best when it starts from real workflow pain points.',
    majorPros: [
      'One app can replace many disconnected manual tools.',
      'Teams save time and avoid repeated data entry.',
      'Managers get better visibility for faster decisions.',
      'Android, iOS, Windows, and Mac support can be planned together.'
    ],
    pages: [
      {
        heading: 'What Makes an App Useful?',
        paragraphs: [
          'Useful app means simple screens, fast response, and clear actions for users.',
          'If users get confused, they stop using it and the project fails even with good technology.',
          'That is why we focus on user flow, role permissions, and clean performance from day one.'
        ],
        bulletTitle: 'Practical checklist',
        bullets: [
          'Define user roles clearly before development.',
          'Keep first version focused on core workflow.',
          'Collect feedback quickly and improve in sprints.'
        ]
      },
      {
        heading: 'How We Deliver',
        paragraphs: [
          'We follow step-by-step execution: requirement workshop, wireframe, sprint builds, QA, and release.',
          'You get regular demos, so there is no surprise at launch time.',
          'Our team also helps with deployment and post-release support.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'List top 3 manual tasks your team repeats daily. These are your first app automation opportunities.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Manual process load keeps growing with team size and creates hidden inefficiency costs.'
  };
}
