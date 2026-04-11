import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SeoService } from '../../shared/services/seo.service';
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
export class IndustriesPageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Industry Software Solutions in Hyderabad | Finance, Healthcare, EdTech and More',
      description:
        'KKREATIVE helps businesses in Hyderabad and beyond with industry-focused software, cloud, automation, and digital systems for finance, healthcare, EdTech, e-commerce, manufacturing, and operations.',
      path: '/industries',
      keywords:
        'industry software solutions Hyderabad, finance software company Hyderabad, healthcare software Hyderabad, edtech technology company Hyderabad'
    });
  }

  readonly useCases: IndustryUseCase[] = [
    {
      title: 'Finance and Banking',
      challenge: 'Manual approval flows and fragmented customer operations.',
      delivered: 'Workflow automation, reporting dashboards, and better support handling.',
      result: 'Faster processing and clearer visibility for leadership.'
    },
    {
      title: 'Healthcare',
      challenge: 'Need for reliable systems with privacy and compliance sensitivity.',
      delivered: 'Role-based platforms, operational dashboards, and careful release handling.',
      result: 'Better day-to-day reliability and stronger process control.'
    },
    {
      title: 'EdTech',
      challenge: 'Low engagement and disconnected student/institute workflows.',
      delivered: 'Learning platforms, admin workflow support, and reporting.',
      result: 'Better learner experience and less manual admin work.'
    },
    {
      title: 'E-commerce',
      challenge: 'High traffic but weak conversion and support bottlenecks.',
      delivered: 'Stronger web flow, chatbot support, and campaign tracking.',
      result: 'Smoother lead-to-order flow and less support pressure.'
    },
    {
      title: 'Manufacturing',
      challenge: 'Production tracking and approvals handled in siloed manual systems.',
      delivered: 'Digital workflow mapping, dashboards, and process automation.',
      result: 'Better internal coordination and more predictable execution.'
    },
    {
      title: 'Trading and Risk Ops',
      challenge: 'Time-sensitive monitoring and fragmented operational alerts.',
      delivered: 'Real-time dashboards, alerts, and clearer operational control points.',
      result: 'Quicker decisions in fast-moving situations.'
    }
  ];
}
