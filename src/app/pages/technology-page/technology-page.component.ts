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

interface TechnologyTrack {
  title: string;
  summary: string;
  stack: string[];
}

@Component({
  selector: 'app-technology-page',
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
  templateUrl: './technology-page.component.html',
  styleUrl: './technology-page.component.css'
})
export class TechnologyPageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Technologies and Capabilities | Kkreative',
      description:
        'Kozy Kreative Concepts capabilities include SOA, scalable architecture, .Net MVC, Java, PHP CodeIgniter, Joomla, Magento, AWS, Azure, Android, and iOS.',
      path: '/technology',
      keywords:
        'SOA architecture Hyderabad, .Net MVC Java PHP CodeIgniter, Joomla Magento, AWS Azure cloud management, Android iOS development'
    });
  }

  readonly tracks: TechnologyTrack[] = [
    {
      title: 'Architecture',
      summary: 'Service-Oriented Architecture and scalable, robust architecture development with industry best practices.',
      stack: ['SOA', 'Scalable Architecture', 'Robust Architecture', 'Industry Best Practices']
    },
    {
      title: 'Enterprise Technologies',
      summary: 'Enterprise application delivery using established frameworks and business-ready platforms.',
      stack: ['.Net MVC', 'Java', 'PHP', 'CodeIgniter']
    },
    {
      title: 'Web Platforms',
      summary: 'Web platform capability for content, commerce, and managed digital experiences.',
      stack: ['Joomla', 'Magento']
    },
    {
      title: 'Cloud Management and Monitoring',
      summary: 'Cloud management setup using latest technologies such as Amazon Web Services and Azure.',
      stack: ['AWS', 'Azure', 'Cloud Management', 'Monitoring']
    },
    {
      title: 'Mobile Platforms',
      summary: 'Mobile capability for customer and business applications.',
      stack: ['Android', 'iOS']
    }
  ];
}
