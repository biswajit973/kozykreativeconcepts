import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
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
export class WhoWeArePageComponent {
  readonly ui = inject(UiStateService);

  readonly legalIdentity = 'KOZY KREATIVE CONCEPTS PRIVATE LIMITED (CIN: U74140TG2014PTC095318)';

  readonly tracks: EvolutionTrack[] = [
    {
      period: '2014–2016',
      title: 'Strong Foundation Years',
      focus: 'Started in the static and dynamic web era with PHP and WordPress delivery.',
      delivery: 'Helped businesses launch reliable digital presence and first online workflows.'
    },
    {
      period: '2017–2020',
      title: 'Cloud and API Expansion',
      focus: 'Moved to modern backend stacks, containers, and microservice-friendly design.',
      delivery: 'Built scalable APIs and cloud-ready systems for growing teams.'
    },
    {
      period: '2021–2023',
      title: 'Full-Stack Maturity',
      focus: 'Worked deeply with React, Angular, Node.js, Django, FastAPI, and DevSecOps practices.',
      delivery: 'Delivered stable products with better release speed, quality, and governance.'
    },
    {
      period: '2024–2026',
      title: 'AI and GenAI Execution',
      focus: 'Integrated AI/ML, GenAI, and automation into customer-facing and internal business systems.',
      delivery: 'Enabled faster operations, smarter support, and practical AI adoption at scale.'
    }
  ];

  readonly promisePoints: string[] = [
    'We stay updated with technology shifts, not just trends.',
    'We focus on customer outcomes, not only code delivery.',
    'We design for scale, speed, and long-term maintainability.',
    'From startup teams to large industries, our goal stays the same: deliver real business impact.'
  ];
}
