import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
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
export class TechnologyPageComponent {
  readonly ui = inject(UiStateService);

  readonly tracks: TechnologyTrack[] = [
    {
      title: 'Web and Product Engineering',
      summary: 'Fast user interfaces and reliable backend APIs for customer-facing and internal platforms.',
      stack: ['React', 'Angular', 'Node.js', 'Express', 'Django', 'FastAPI']
    },
    {
      title: 'Cloud and Platform Delivery',
      summary: 'Cloud-first infrastructure and DevOps pipelines built for release speed and operational stability.',
      stack: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD']
    },
    {
      title: 'AI, GenAI, and Automation',
      summary: 'Practical AI integrations that improve support, productivity, and business decision workflows.',
      stack: ['LLM integration', 'RAG workflows', 'AI agents', 'Automation pipelines', 'Analytics']
    },
    {
      title: 'Quality, Security, and Governance',
      summary: 'Testing, security hygiene, and policy-led release practices for long-term trust.',
      stack: ['Manual + automation QA', 'Security checks', 'Monitoring', 'Compliance workflows']
    }
  ];
}
