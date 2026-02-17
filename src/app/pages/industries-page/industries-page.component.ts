import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UiStateService } from '../../shared/services/ui-state.service';

interface IndustryUseCase {
  title: string;
  challenge: string;
  delivered: string;
  result: string;
}

@Component({
  selector: 'app-industries-page',
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
  templateUrl: './industries-page.component.html',
  styleUrl: './industries-page.component.css'
})
export class IndustriesPageComponent {
  readonly ui = inject(UiStateService);

  readonly useCases: IndustryUseCase[] = [
    {
      title: 'Finance and Banking',
      challenge: 'Manual approval flows and fragmented customer operations.',
      delivered: 'Secure workflow automation, reporting dashboards, and AI-assisted support journeys.',
      result: 'Faster processing and cleaner visibility for business leadership.'
    },
    {
      title: 'Healthcare',
      challenge: 'Need for reliable systems with privacy and compliance sensitivity.',
      delivered: 'Role-based platforms, operational dashboards, and quality-first release pipelines.',
      result: 'Stronger process control with better day-to-day reliability.'
    },
    {
      title: 'EdTech',
      challenge: 'Low engagement and disconnected student/institute workflows.',
      delivered: 'Learning platforms, automation layers, and analytics-driven user journeys.',
      result: 'Improved learner experience and measurable operational efficiency.'
    },
    {
      title: 'E-commerce',
      challenge: 'High traffic but weak conversion and support bottlenecks.',
      delivered: 'Conversion-focused web builds, chatbot integration, and campaign tracking.',
      result: 'Better lead-to-order flow and reduced support pressure.'
    },
    {
      title: 'Manufacturing',
      challenge: 'Production tracking and approvals handled in siloed manual systems.',
      delivered: 'Digital workflow mapping, cloud-connected dashboards, and process automation.',
      result: 'More predictable execution and faster internal coordination.'
    },
    {
      title: 'Trading and Risk Ops',
      challenge: 'Time-sensitive monitoring and fragmented operational alerts.',
      delivered: 'Real-time dashboards, event notifications, and structured risk workflow support.',
      result: 'Quicker decisions and better control in high-speed environments.'
    }
  ];
}
