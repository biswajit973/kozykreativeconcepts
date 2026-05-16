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

interface ServiceDetail {
  title: string;
  summary: string;
  impact: string;
  points: string[];
}

@Component({
  selector: 'app-services-page',
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
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Services | Software Development, Consulting, Training and Digital Marketing | Kkreative',
      description:
        'Explore Kozy Kreative Concepts services including custom software development, research and business consulting, training, resource consulting, digital marketing, and startup advisory.',
      path: '/services',
      keywords:
        'software development Hyderabad, business consulting Hyderabad, PMP training, ethical hacking training, resource consulting, digital marketing Hyderabad, startup advisory Hyderabad'
    });
  }

  readonly services: ServiceDetail[] = [
    {
      title: 'Software Development',
      summary: 'Custom web and mobile application development.',
      impact: 'We build practical software that makes customer and internal workflows easier.',
      points: ['Custom web applications', 'Mobile application development', 'Simple service-oriented delivery']
    },
    {
      title: 'Research and Business Consulting',
      summary: 'Feasibility Study, SWOT Analysis, and Market Mindset support.',
      impact: 'We help teams understand the opportunity, risk, and customer direction before they move.',
      points: ['Feasibility Study', 'SWOT Analysis', 'Market Mindset']
    },
    {
      title: 'Training and Skill Development',
      summary: 'Training support for PMP, Ethical Hacking, Testing, and Team Building.',
      impact: 'We help people and teams become more capable for real project work.',
      points: ['PMP Project Management Certification support', 'Ethical Hacking and Testing', 'Team Building programs']
    },
    {
      title: 'Resource Consulting',
      summary: 'Consulting support for identifying and aligning the right delivery resources.',
      impact: 'We help clients close capability gaps and plan delivery with more confidence.',
      points: ['Resource planning', 'Capability matching', 'Delivery readiness support']
    },
    {
      title: 'Digital Marketing',
      summary: 'Digital marketing support for visibility, reach, and customer communication.',
      impact: 'We help the business become easier to discover and easier to contact.',
      points: ['Online visibility', 'Campaign support', 'Lead and enquiry support']
    },
    {
      title: 'Startup Advisory and Incubator Setup Help',
      summary: 'Guidance for startups and incubator setup planning.',
      impact: 'We help early ideas become clearer, more practical, and easier to act on.',
      points: ['Startup planning', 'Incubator setup help', 'Business and technology direction']
    }
  ];
}
