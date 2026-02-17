import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UiStateService } from '../../shared/services/ui-state.service';

interface CompanyItem {
  name: string;
  sector: string;
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
export class OurWorkPageComponent {
  readonly ui = inject(UiStateService);

  readonly companies: CompanyItem[] = [
    { name: 'Virtusa', sector: 'Enterprise Digital Engineering' },
    { name: 'Dubai Euro Group', sector: 'Business Platform Operations' },
    { name: 'Datatec South Africa', sector: 'Cloud and IT Delivery' },
    { name: 'General Pharma', sector: 'Healthcare Systems' },
    { name: 'Divis Labs', sector: 'Manufacturing and Process Ops' },
    { name: 'Boeing', sector: 'Large-Scale Engineering Culture' },
    { name: 'JPMorgan', sector: 'Financial Systems and Risk Workflows' },
    { name: 'Accenture', sector: 'Enterprise Transformation Programs' }
  ];

  readonly snapshots: DeliverySnapshot[] = [
    {
      title: 'AI-Ready Customer Support Stack',
      brief: 'Unified support workflows with bot + human handover for faster query resolution.',
      outcome: 'Lower manual workload and improved response consistency.'
    },
    {
      title: 'Cloud Migration with Release Discipline',
      brief: 'Migrated workloads to cloud and introduced CI/CD and observability guardrails.',
      outcome: 'Stable deployments with better uptime visibility.'
    },
    {
      title: 'Conversion-Focused Digital Funnel',
      brief: 'Reworked web journeys, forms, and tracking for measurable demand generation.',
      outcome: 'Improved lead quality and stronger conversion intent.'
    },
    {
      title: 'Workflow Automation for Operations Teams',
      brief: 'Mapped repetitive business steps and automated approvals, escalations, and reporting.',
      outcome: 'Faster internal cycle times and fewer process errors.'
    }
  ];

  companyInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
