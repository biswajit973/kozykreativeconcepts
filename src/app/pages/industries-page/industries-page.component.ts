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
  mediaUrl?: string;
  mediaLabel?: string;
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
      title: 'Industries We Serve | Kkreative',
      description:
        'Kozy Kreative Concepts serves E-Commerce, Telecom, Healthcare, Banking and Finance, Retail, Insurance, and Automation industries.',
      path: '/industries',
      keywords:
        'ecommerce software Hyderabad, telecom software Hyderabad, healthcare software Hyderabad, banking finance software, retail insurance automation software'
    });
  }

  readonly useCases: IndustryUseCase[] = [
    {
      title: 'E-Commerce',
      challenge: 'Digital buying journeys need clear catalog, order, and customer flows.',
      delivered: 'Web and mobile systems that simplify customer interaction and business control.',
      result: 'Better shopping experiences and smoother order visibility.',
      mediaUrl: '/transportation-1440x810.mp4',
      mediaLabel: 'Commerce and movement'
    },
    {
      title: 'Telecom',
      challenge: 'Telecom teams need activation, messaging, IVRS, and support systems that are dependable.',
      delivered: 'USSD, Number Management, Bulk SMS, IVRS, Support Management, GPRS Activation, and Missed Call solutions.',
      result: 'Better control over telecom workflows and customer communication.',
      mediaUrl: '/telecommunications-1440x810.mp4',
      mediaLabel: 'Telecom networks'
    },
    {
      title: 'Healthcare',
      challenge: 'Healthcare teams need reliable systems for service coordination and day-to-day control.',
      delivered: 'Role-aware software workflows and practical management systems.',
      result: 'More dependable operations and simpler management.',
      mediaUrl: '/healthcare-1440x810.mp4',
      mediaLabel: 'Healthcare systems'
    },
    {
      title: 'Banking and Finance',
      challenge: 'Financial workflows need accuracy, traceability, and clear process handling.',
      delivered: 'Bank loan integration, payment platform support, and business workflow systems.',
      result: 'Clearer processing and stronger visibility.',
      mediaUrl: '/financialservices_1440x810.mp4',
      mediaLabel: 'Finance operations'
    },
    {
      title: 'Retail',
      challenge: 'Retail operations need smoother customer, billing, order, and stock-related experiences.',
      delivered: 'Digital systems that support customer journeys and business operations.',
      result: 'Cleaner service experiences and easier operational review.',
      mediaUrl: '/automotive-1440x810.mp4',
      mediaLabel: 'Retail automation'
    },
    {
      title: 'Insurance',
      challenge: 'Insurance workflows need clarity around customers, policies, claims, and support.',
      delivered: 'Structured digital workflows and customer service support systems.',
      result: 'Better tracking and simpler customer handling.'
    },
    {
      title: 'Automation',
      challenge: 'Repeated manual processes slow teams down and create avoidable errors.',
      delivered: 'Software-led automation for business workflows and reporting.',
      result: 'Less manual effort and faster operational turnaround.'
    }
  ];
}
