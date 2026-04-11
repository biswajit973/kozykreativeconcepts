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
      title: 'Software Development Services in Hyderabad | Apps, Websites, AI and Cloud',
      description:
        'Explore KKREATIVE software development services in Hyderabad including app development, websites, AI features, automation, cloud, DevOps, testing, and digital marketing support.',
      path: '/services',
      keywords:
        'software services Hyderabad, app development Hyderabad, web development Hyderabad, AI automation Hyderabad, DevOps company Hyderabad'
    });
  }

  readonly services: ServiceDetail[] = [
    {
      title: 'App Development',
      summary: 'Android, iOS, Windows, and Mac applications designed for daily business use.',
      impact: 'We help teams move faster with stable, user-friendly apps.',
      points: ['Product-first UX', 'Secure API integration', 'Scalable release planning']
    },
    {
      title: 'Web Development and AI Features',
      summary: 'Landing pages, websites, and web apps, with AI features added only where they are useful.',
      impact: 'We build web systems that help businesses explain their work, capture leads, and run daily operations.',
      points: ['Fast frontend', 'Reliable backend work', 'AI features where they genuinely help']
    },
    {
      title: 'Chatbots and Automation',
      summary: 'Intelligent support bots and process automation for repetitive workflows.',
      impact: 'Less manual work, faster response, and consistent customer support.',
      points: ['Business workflow mapping', 'Tool and CRM integration', 'Human handover safeguards']
    },
    {
      title: 'Cloud and DevOps',
      summary: 'AWS, Azure, and Google Cloud setup with deployment and monitoring support.',
      impact: 'More stable operations and less release-day stress.',
      points: ['CI/CD pipelines', 'Cloud infrastructure hardening', 'Monitoring and incident response']
    },
    {
      title: 'QA Testing and Cybersecurity',
      summary: 'Manual + automation testing and baseline security validation.',
      impact: 'Fewer production issues and stronger release confidence.',
      points: ['Regression and automation suites', 'Critical path test strategy', 'Security hygiene checks']
    },
    {
      title: 'Digital Marketing',
      summary: 'SEO, paid media, social media, and lead funnel improvements.',
      impact: 'Better visibility, better lead quality, and clearer campaign tracking.',
      points: ['Campaign analytics', 'Landing page support', 'Lead-focused improvement']
    },
    {
      title: 'Business Consulting and Training',
      summary: 'We help offline businesses go digital and train teams on the tools they need to use.',
      impact: 'Smoother adoption, stronger internal capability, and better long-term use of the systems we build.',
      points: ['Step-by-step rollout plan', 'B2B and B2C training programs', 'Cloud and AI learning support']
    }
  ];
}
