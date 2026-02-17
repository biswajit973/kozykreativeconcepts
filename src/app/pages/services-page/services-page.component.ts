import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
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
export class ServicesPageComponent {
  readonly ui = inject(UiStateService);

  readonly services: ServiceDetail[] = [
    {
      title: 'App Development',
      summary: 'Android, iOS, Windows, and Mac applications designed for daily business use.',
      impact: 'We help teams move faster with stable, user-friendly apps.',
      points: ['Product-first UX', 'Secure API integration', 'Scalable release planning']
    },
    {
      title: 'Web Development + GenAI',
      summary: 'Landing pages, websites, and web apps with AI-ready architecture.',
      impact: 'We build conversion-focused web systems that support growth.',
      points: ['High-performance frontend', 'Modern backend delivery', 'GenAI integration where it adds value']
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
      impact: 'Reliable operations with controlled release cycles.',
      points: ['CI/CD pipelines', 'Cloud infrastructure hardening', 'Monitoring and incident response']
    },
    {
      title: 'QA Testing and Cybersecurity',
      summary: 'Manual + automation testing and baseline security validation.',
      impact: 'Fewer production issues and stronger release confidence.',
      points: ['Regression and automation suites', 'Critical path test strategy', 'Security hygiene checks']
    },
    {
      title: 'Digital Marketing and Growth',
      summary: 'SEO, paid media, social, and lead funnel optimization.',
      impact: 'Better visibility, better lead quality, and clearer ROI tracking.',
      points: ['Campaign analytics', 'Performance landing pages', 'Conversion-first optimization']
    },
    {
      title: 'Business Digitalisation + Trainings',
      summary: 'We help offline businesses go digital and train teams on modern stacks.',
      impact: 'Smooth adoption, stronger internal capability, and sustainable growth.',
      points: ['Step-by-step transformation roadmap', 'B2B/B2C training programs', 'AI and cloud readiness']
    }
  ];
}
