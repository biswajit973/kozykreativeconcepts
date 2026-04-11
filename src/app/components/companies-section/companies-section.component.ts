import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParticleFieldComponent } from '../ui/particle-field.component';

interface WorkLogo {
  id: string;
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
  readonly logos: WorkLogo[] = [
    { id: 'logo-1', src: '/work-logos/1.png' },
    { id: 'logo-2', src: '/work-logos/2.png' },
    { id: 'logo-3', src: '/work-logos/3.png' },
    { id: 'logo-4', src: '/work-logos/4.png' },
    { id: 'logo-5', src: '/work-logos/5.png' },
    { id: 'logo-6', src: '/work-logos/6.png' },
    { id: 'logo-7', src: '/work-logos/7.png' },
    { id: 'logo-8', src: '/work-logos/8.jpg' },
    { id: 'logo-9', src: '/work-logos/9.jpeg' }
  ];

  private readonly splitIndex = Math.ceil(this.logos.length / 2);
  readonly rowOne = this.logos.slice(0, this.splitIndex);
  readonly rowTwo = this.logos.slice(this.splitIndex);
  readonly rowOneLoop = [...this.rowOne, ...this.rowOne];
  readonly rowTwoLoop = [...this.rowTwo, ...this.rowTwo];

  trackLogo(index: number, item: WorkLogo): string {
    return `${item.id}-${index}`;
  }
}
