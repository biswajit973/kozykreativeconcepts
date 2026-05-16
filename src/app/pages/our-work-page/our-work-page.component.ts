import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GLOBAL_CLIENTS } from '../../shared/content/client-content';
import { SeoService } from '../../shared/services/seo.service';
import { UiStateService } from '../../shared/services/ui-state.service';

interface WorkLogo {
  id: string;
  src: string;
}

interface DeliverySnapshot {
  title: string;
  brief: string;
  outcome: string;
}

@Component({
  selector: 'app-our-work-page',
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
  templateUrl: './our-work-page.component.html',
  styleUrl: './our-work-page.component.css'
})
export class OurWorkPageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Featured Projects and Global Clients | Kkreative',
      description:
        'Explore Kozy Kreative Concepts featured projects including Loanyantra, Shopwhich, Rushforme, South African regional systems, and global clients across India, USA, Singapore, and South Africa.',
      path: '/our-work',
      keywords:
        'Loanyantra, Shopwhich, Rushforme, Multichoice Africa, Tabsquare, MD Manage, Kozy Kreative clients, Kkreative projects'
    });
  }

  readonly clientGroups = GLOBAL_CLIENTS;

  readonly logos: WorkLogo[] = [
    { id: 'logo-1', src: '/work-logos/1.png' },
    { id: 'logo-2', src: '/work-logos/2.png' },
    { id: 'logo-3', src: '/work-logos/3.png' },
    { id: 'logo-4', src: '/work-logos/4.png' },
    { id: 'logo-5', src: '/work-logos/5.png' },
    { id: 'logo-6', src: '/work-logos/6.png' },
    { id: 'logo-7', src: '/work-logos/7.png' },
    { id: 'logo-8', src: '/work-logos/8.jpg' },
    { id: 'logo-9', src: '/work-logos/9.jpeg' }
  ];
  private readonly splitIndex = Math.ceil(this.logos.length / 2);
  readonly rowOne = this.logos.slice(0, this.splitIndex);
  readonly rowTwo = this.logos.slice(this.splitIndex);
  readonly rowOneLoop = [...this.rowOne, ...this.rowOne];
  readonly rowTwoLoop = [...this.rowTwo, ...this.rowTwo];

  readonly snapshots: DeliverySnapshot[] = [
    {
      title: 'Loanyantra',
      brief: 'Bank Loan Integration System.',
      outcome: 'A focused platform for connecting and managing loan-related banking workflows.'
    },
    {
      title: 'Shopwhich',
      brief: 'Marketplace for the Textile Industry.',
      outcome: 'A digital marketplace model shaped around textile industry discovery and transactions.'
    },
    {
      title: 'Rushforme',
      brief: 'Pickup and Delivery Services with agent and customer apps.',
      outcome: 'Mobile-led service flows for customers, delivery agents, and operational tracking.'
    },
    {
      title: 'South African Regional Projects',
      brief: 'Budget Management System, Vendor Management System, Integrated Payment Platform, and Feedback Management System.',
      outcome: 'Business systems for regional operations, vendor workflows, payments, and feedback.'
    },
    {
      title: 'Other Integrations',
      brief: 'Bioenable, Payme, Stellar, and NTPL customer, CMS, and loyalty integrations.',
      outcome: 'Integration support across customer management, CMS workflows, and loyalty needs.'
    }
  ];

  trackLogo(index: number, item: WorkLogo): string {
    return `${item.id}-${index}`;
  }
}
