import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';
import { ParticleFieldComponent } from '../ui/particle-field.component';

interface IndustryItem {
  id: string;
  title: string;
  focusLine: string;
  businessWin: string;
  accent: 'teal' | 'gold' | 'mint';
}

@Component({
  selector: 'app-industries-section',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticleFieldComponent, HoverSparkDirective],
  templateUrl: './industries-section.component.html',
  styleUrl: './industries-section.component.css'
})
export class IndustriesSectionComponent {
  readonly industryHighlights: IndustryItem[] = [
    {
      id: 'finance',
      title: 'Finance and Banking',
      focusLine: 'Secure workflows, reporting, and AI-assisted operations.',
      businessWin: 'Faster approvals and cleaner compliance visibility.',
      accent: 'teal'
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      focusLine: 'Privacy-aware systems and reliability-focused release cycles.',
      businessWin: 'Safer process execution with less operational friction.',
      accent: 'mint'
    },
    {
      id: 'edtech',
      title: 'EdTech',
      focusLine: 'Learning platforms with analytics and automation support.',
      businessWin: 'Better learner engagement and reduced manual admin work.',
      accent: 'gold'
    },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      focusLine: 'Conversion-led web journeys, chatbot support, and campaign insight.',
      businessWin: 'Stronger lead quality and better checkout confidence.',
      accent: 'teal'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      focusLine: 'Production workflows, dashboarding, and process automation.',
      businessWin: 'Improved team coordination with real-time decision data.',
      accent: 'mint'
    },
    {
      id: 'trading',
      title: 'Trading and Risk Ops',
      focusLine: 'Alert-driven monitoring and structured operational controls.',
      businessWin: 'Faster action on high-speed risk-sensitive events.',
      accent: 'gold'
    }
  ];

  trackIndustry(_: number, item: IndustryItem): string {
    return item.id;
  }
}
