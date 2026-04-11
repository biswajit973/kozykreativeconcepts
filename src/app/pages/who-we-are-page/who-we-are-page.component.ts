import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FOUNDATION_YEAR, getYearsOfExperience } from '../../shared/constants/brand.constants';
import { SeoService } from '../../shared/services/seo.service';
import { UiStateService } from '../../shared/services/ui-state.service';

interface EvolutionTrack {
  period: string;
  title: string;
  focus: string;
  delivery: string;
}

@Component({
  selector: 'app-who-we-are-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    MobileMenuComponent,
    FooterComponent,
    ContactModalComponent,
    ChatbotWidgetComponent
  ],
  templateUrl: './who-we-are-page.component.html',
  styleUrl: './who-we-are-page.component.css'
})
export class WhoWeArePageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);
  readonly foundingYear = FOUNDATION_YEAR;
  readonly yearsOfExperience = getYearsOfExperience();

  ngOnInit(): void {
    this.seo.update({
      title: 'About KKREATIVE | Hyderabad Software Development Company Since 2014',
      description:
        'Learn about KKREATIVE CONCEPTS PRIVATE LIMITED, a Hyderabad software development company working since 2014 across websites, cloud, AI, automation, testing, and business systems.',
      path: '/who-we-are',
      keywords:
        'about software company Hyderabad, KKREATIVE Hyderabad, software company since 2014 Hyderabad, technology consulting Hyderabad'
    });
  }

  readonly legalIdentity = 'KOZY KREATIVE CONCEPTS PRIVATE LIMITED (CIN: U74140TG2014PTC095318)';

  readonly tracks: EvolutionTrack[] = [
    {
      period: '2014–2016',
      title: 'Strong Foundation Years',
      focus: 'We started when many businesses were first moving from offline work to websites and basic digital systems.',
      delivery: 'We helped clients launch their first dependable online presence and simple web workflows.'
    },
    {
      period: '2017–2020',
      title: 'Cloud and Product Expansion',
      focus: 'As backend stacks, APIs, and cloud tools became more common, our work moved with them.',
      delivery: 'We built stronger web systems and better backend foundations for growing teams.'
    },
    {
      period: '2021–2023',
      title: 'Full-Stack Maturity',
      focus: 'We spent these years doing more full-stack work across web, cloud, testing, and release processes.',
      delivery: 'Clients got more stable products, clearer workflows, and fewer release issues.'
    },
    {
      period: '2024–2026',
      title: 'AI and GenAI Execution',
      focus: 'Now we also help clients use AI, automation, and newer tools in ways that actually fit their work.',
      delivery: 'That means faster support, less repeated manual work, and more confident technology decisions.'
    }
  ];

  readonly promisePoints: string[] = [
    'We keep learning, but we do not chase every fad.',
    'We speak clearly and build things people can actually use.',
    'We care about reliability after launch, not only launch day.',
    'We work with the same seriousness whether the client is small or large.'
  ];
}
