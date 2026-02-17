import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';
import { ParticleFieldComponent } from '../ui/particle-field.component';

interface WorkCompany {
  id: string;
  name: string;
  focus: string;
}

@Component({
  selector: 'app-companies-section',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticleFieldComponent, HoverSparkDirective],
  templateUrl: './companies-section.component.html',
  styleUrl: './companies-section.component.css'
})
export class CompaniesSectionComponent {
  readonly companies: WorkCompany[] = [
    { id: 'virtusa', name: 'Virtusa', focus: 'Digital engineering and enterprise delivery workflows' },
    { id: 'dubai-euro-group', name: 'Dubai Euro Group', focus: 'Business platform modernization and automation support' },
    { id: 'datatec', name: 'Datatec South Africa', focus: 'Cloud-first operations and secure digital process control' },
    { id: 'general-pharma', name: 'General Pharma', focus: 'Quality-driven healthcare technology and workflow systems' },
    { id: 'divis-labs', name: 'Divis Labs', focus: 'Process visibility and operations-led application support' },
    { id: 'boeing', name: 'Boeing', focus: 'Large-scale systems thinking and disciplined engineering standards' },
    { id: 'jpmorgan', name: 'JPMorgan', focus: 'High-trust finance workflows and risk-aware digital execution' },
    { id: 'accenture', name: 'Accenture', focus: 'Enterprise-grade delivery patterns and scalable transformation' }
  ];

  trackCompany(_index: number, item: WorkCompany): string {
    return item.id;
  }

  companyInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
