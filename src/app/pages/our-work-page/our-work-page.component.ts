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
      title: 'Our Work | Software, Cloud and AI Delivery Support in Hyderabad',
      description:
        'See the kinds of software, cloud, automation, website, and delivery support work KKREATIVE has handled for businesses and teams from Hyderabad and beyond.',
      path: '/our-work',
      keywords:
        'software company portfolio Hyderabad, web and app work Hyderabad, cloud delivery Hyderabad, automation projects Hyderabad'
    });
  }

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
      title: 'Customer Support and Service Flows',
      brief: 'We help businesses simplify how customer questions, escalations, and follow-ups are handled across channels.',
      outcome: 'Better response consistency and less manual operational pressure.'
    },
    {
      title: 'Cloud, Release, and Stability Improvements',
      brief: 'We support teams in making deployments smoother, monitoring clearer, and infrastructure easier to manage.',
      outcome: 'Stronger uptime visibility and more reliable release cycles.'
    },
    {
      title: 'Website and Lead Generation Journeys',
      brief: 'From messaging to forms and user flow, we improve how digital visitors understand, trust, and contact a business.',
      outcome: 'A clearer path from visitor interest to real enquiry.'
    },
    {
      title: 'Internal Automation and Reporting',
      brief: 'We streamline repetitive approvals, updates, and reporting so teams spend less time on manual follow-up.',
      outcome: 'Faster internal turnaround and fewer avoidable process errors.'
    }
  ];

  trackLogo(index: number, item: WorkLogo): string {
    return `${item.id}-${index}`;
  }
}
