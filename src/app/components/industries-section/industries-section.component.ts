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
      id: 'ecommerce',
      title: 'E-Commerce',
      focusLine: 'Digital buying journeys, catalog flows, and customer-facing operations.',
      businessWin: 'Simpler shopping experiences and stronger order visibility.',
      accent: 'teal'
    },
    {
      id: 'telecom',
      title: 'Telecom',
      focusLine: 'Activation, messaging, IVRS, support tools, and customer engagement systems.',
      businessWin: 'Better service control and easier telecom process management.',
      accent: 'mint'
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      focusLine: 'Reliable systems for healthcare operations, access, and service coordination.',
      businessWin: 'More dependable workflows and better day-to-day management.',
      accent: 'gold'
    },
    {
      id: 'banking-finance',
      title: 'Banking and Finance',
      focusLine: 'Loan, payment, reporting, and approval workflows that need accuracy.',
      businessWin: 'Clearer processing and stronger financial workflow visibility.',
      accent: 'teal'
    },
    {
      id: 'retail',
      title: 'Retail',
      focusLine: 'Store, order, customer, and operational processes across retail teams.',
      businessWin: 'Cleaner customer journeys and easier business control.',
      accent: 'mint'
    },
    {
      id: 'insurance',
      title: 'Insurance',
      focusLine: 'Policy, customer, claims, and support workflows that need clarity.',
      businessWin: 'Better tracking and simpler service experiences.',
      accent: 'gold'
    },
    {
      id: 'automation',
      title: 'Automation',
      focusLine: 'Repeated business processes that can be simplified through software.',
      businessWin: 'Less manual effort and faster operational turnaround.',
      accent: 'teal'
    }
  ];

  trackIndustry(_: number, item: IndustryItem): string {
    return item.id;
  }
}
