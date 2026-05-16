import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GLOBAL_CLIENTS } from '../../shared/content/client-content';
import { ParticleFieldComponent } from '../ui/particle-field.component';

interface WorkLogo {
  id: string;
  name: string;
  src: string;
}

@Component({
  selector: 'app-companies-section',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticleFieldComponent],
  templateUrl: './companies-section.component.html',
  styleUrl: './companies-section.component.css'
})
export class CompaniesSectionComponent {
  readonly clientGroups = GLOBAL_CLIENTS;

  readonly logos: WorkLogo[] = [
    { id: 'logo-1', name: 'Work 1', src: '/work-logos/1.png' },
    { id: 'logo-2', name: 'Work 2', src: '/work-logos/2.png' },
    { id: 'logo-3', name: 'Work 3', src: '/work-logos/3.png' },
    { id: 'logo-4', name: 'Work 4', src: '/work-logos/4.png' },
    { id: 'logo-5', name: 'Work 5', src: '/work-logos/5.png' },
    { id: 'logo-6', name: 'Work 6', src: '/work-logos/6.png' },
    { id: 'logo-7', name: 'Work 7', src: '/work-logos/7.png' },
    { id: 'logo-8', name: 'Work 8', src: '/work-logos/8.jpg' },
    { id: 'logo-9', name: 'Work 9', src: '/work-logos/9.jpeg' }
  ];

  private readonly splitIndex = Math.ceil(this.logos.length / 2);
  readonly rowOne = this.logos.slice(0, this.splitIndex);
  readonly rowTwo = this.logos.slice(this.splitIndex);
  readonly rowOneLoop = [...this.rowOne, ...this.rowOne];
  readonly rowTwoLoop = [...this.rowTwo, ...this.rowTwo];

  trackLogo(index: number, item: WorkLogo): string {
    return `${item.id}-${index}`;
  }

  trackClientGroup(_index: number, item: (typeof GLOBAL_CLIENTS)[number]): string {
    return item.country;
  }
}
