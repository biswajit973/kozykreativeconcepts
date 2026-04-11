import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';
import { ParticleFieldComponent } from '../ui/particle-field.component';

interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  service: string;
  review: string;
  tone: 'teal' | 'mint' | 'gold';
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, ParticleFieldComponent, HoverSparkDirective],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent {
  readonly testimonials: TestimonialItem[] = [
    this.createItem(
      'govardhan-mdmanage',
      'Govardhan Reddy',
      'CEO',
      'MDMANAGE',
      'Web Design',
      'The team at kkreative was extremely knowledgeable and helpful in guiding me through the entire process. I am very pleased with the end result and have received many compliments on my new website. I highly recommend kkreative for their excellent web design services.',
      'gold'
    ),
    this.createItem(
      'shakti-mohan',
      'Shakti mohan',
      'Manager',
      'Website Redesign Client',
      'Website Redesign',
      'I had a fantastic experience working with kkreative on a website redesign project. As someone who has limited technical knowledge, I appreciated how the team explained every step of the process in simple terms and made sure I was comfortable with each decision before moving forward.',
      'teal'
    )
  ];

  trackByTestimonial(_index: number, item: TestimonialItem): string {
    return item.id;
  }

  private createItem(
    id: string,
    name: string,
    role: string,
    company: string,
    service: string,
    review: string,
    tone: TestimonialItem['tone']
  ): TestimonialItem {
    return {
      id,
      name,
      initials: this.buildInitials(name),
      role,
      company,
      service,
      review,
      tone
    };
  }

  private buildInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
}
