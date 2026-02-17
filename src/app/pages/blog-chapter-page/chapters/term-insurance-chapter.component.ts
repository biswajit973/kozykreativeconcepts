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
    id: 'term-insurance',
    title: 'Term Insurance: A Real Family Safety Plan',
    subtitle:
      'Simple story, simple maths, simple decision. This chapter shows why term insurance protects your loved ones.',
    storyTitle: 'Ajay and Rahul: Same Flight, Different Family Future',
    storyText:
      'Ajay and Rahul were two friends. Both were 35. Both were working and both were earning for their families. Ajay had wife, two children, and old parents. He was the only earner at home. Ajay thought: life is unpredictable. We insure bike, car, and scooter. Why not insure our life for our loved ones? So he bought a term insurance plan. He paid about Rs 15,000 per year and kept coverage till age 60. Rahul did not buy term insurance. He kept delaying it. One day, both were travelling from Ahmedabad to London. Sadly, the flight crashed. Ajay family got term claim money. Home loan and monthly expenses were managed, and children education could continue. Rahul family had no such support. Daily expenses, school fees, and future planning became very hard. This is the real difference term insurance creates.',
    highlight:
      'Term insurance is not for you. It is for your family when you are not there.',
    majorPros: [
      'Immediate financial support comes to family in a life emergency.',
      'Home loan and major debt can be handled without panic selling assets.',
      'Children education and basic household life can continue with dignity.',
      'Parents and spouse get time to recover emotionally without money shock.'
    ],
    pages: [
      {
        heading: 'What Actually Happens In This Story?',
        paragraphs: [
          'In Ajay family, claim money became a financial cushion. The family was in grief, but at least monthly expenses and future plans had support.',
          'In Rahul family, there was no life cover amount. Family had to depend on savings, relatives, and sudden compromises.',
          'Both families faced emotional pain. But only one family had financial protection. This is why term insurance matters.'
        ],
        bulletTitle: 'Story Learning',
        bullets: [
          'Tragedy is same, financial damage is different.',
          'Insurance cannot remove pain, but it can reduce money pressure.',
          'Buy cover before risk comes, not after.'
        ]
      },
      {
        heading: 'Common Question: If Nothing Happens, Is Money Wasted?',
        paragraphs: [
          'Many people say: if I survive, I will not get money back. Then why buy term plan?',
          'Simple answer: term plan is protection, not return product. Just like seat belt in car. You do not ask seat belt for profit. You use it for safety.',
          'Do you really want a tragedy just to "recover" premium? No. We buy term insurance hoping we never use it. But if life gives a shock, family should not become financially helpless.'
        ],
        bulletTitle: 'Emotional + Practical Truth',
        bullets: [
          'Premium is small compared to family risk.',
          'Peace of mind has real value.',
          'No return is okay when purpose is protection.'
        ]
      },
      {
        heading: 'Technical Basics In Very Simple Words',
        paragraphs: [
          'Term insurance gives a fixed sum assured if death happens during policy term. That amount goes to nominee.',
          'For earning members, cover should be enough for loan + children education + family living expenses for many years.',
          'Buy early because age and health can increase premium. Keep nominee details clear and tell family where policy document is stored.'
        ],
        bulletTitle: 'Before You Buy',
        bullets: [
          'Choose a claim-friendly insurer with clear process.',
          'Choose annual premium you can continue every year.',
          'Review cover every 2 to 3 years as responsibilities increase.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Sit with family for 30 minutes. List total loan, yearly family expenses, and children future costs. Then finalize one practical term cover amount and start the policy.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Delay can increase premium, and health changes can reduce options. Better to start now and improve cover later.'
  };
}
