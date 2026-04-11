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
      title: 'AI, Cloud, Web and DevOps Company in Hyderabad | KKREATIVE Technology',
      description:
        'KKREATIVE provides web engineering, cloud delivery, AI integration, automation, QA, security, and DevOps support for businesses looking for practical technology execution in Hyderabad.',
      path: '/technology',
      keywords:
        'AI company in Hyderabad, cloud company Hyderabad, DevOps company Hyderabad, web engineering Hyderabad, automation company Hyderabad'
    });
  }

  readonly tracks: TechnologyTrack[] = [
    {
      title: 'Web and Product Engineering',
      summary: 'Customer-facing websites, internal tools, and APIs that teams can rely on every day.',
      stack: ['React', 'Angular', 'Node.js', 'Express', 'Django', 'FastAPI']
    },
    {
      title: 'Cloud and Platform Delivery',
      summary: 'Cloud infrastructure, release flow, and monitoring that help systems stay stable.',
      stack: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD']
    },
    {
      title: 'AI, GenAI, and Automation',
      summary: 'AI features and automation added where they save time or improve service.',
      stack: ['LLM integration', 'RAG workflows', 'AI agents', 'Automation pipelines', 'Analytics']
    },
    {
      title: 'Quality, Security, and Governance',
      summary: 'Testing, security checks, and release discipline that help avoid avoidable issues.',
      stack: ['Manual + automation QA', 'Security checks', 'Monitoring', 'Compliance workflows']
    }
  ];
}
