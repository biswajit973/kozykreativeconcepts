import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FOUNDATION_YEAR, getYearsOfExperience } from '../../shared/constants/brand.constants';
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
  readonly foundingYear = FOUNDATION_YEAR;
  readonly yearsOfExperience = getYearsOfExperience();

  readonly industryHighlights: IndustryItem[] = [
    {
      id: 'finance',
      title: 'Finance and Banking',
      focusLine: 'Approval flows, reporting, and support processes that need accuracy.',
      businessWin: 'Faster internal processing and clearer visibility for leadership.',
      accent: 'teal'
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      focusLine: 'Systems that need privacy, reliability, and role-based access.',
      businessWin: 'Less operational friction and better day-to-day control.',
      accent: 'mint'
    },
    {
      id: 'edtech',
      title: 'EdTech',
      focusLine: 'Learning products, admin workflows, and student communication.',
      businessWin: 'Better learner experience and less manual admin effort.',
      accent: 'gold'
    },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      focusLine: 'Website flow, support load, and campaign tracking.',
      businessWin: 'Better enquiry quality and smoother buying journeys.',
      accent: 'teal'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      focusLine: 'Production updates, approvals, dashboards, and internal tracking.',
      businessWin: 'Better team coordination and faster decisions.',
      accent: 'mint'
    },
    {
      id: 'trading',
      title: 'Trading and Risk Ops',
      focusLine: 'Fast-moving operations that depend on alerts and control points.',
      businessWin: 'Quicker response when timing and accuracy matter.',
      accent: 'gold'
    }
  ];

  trackIndustry(_: number, item: IndustryItem): string {
    return item.id;
  }
}
