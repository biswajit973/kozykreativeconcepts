import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FOUNDATION_YEAR, getYearsOfExperience } from '../../shared/constants/brand.constants';
import { SeoService } from '../../shared/services/seo.service';
import { UiStateService } from '../../shared/services/ui-state.service';

interface EvolutionTrack {
  period: string;
  title: string;
  focus: string;
  delivery: string;
}

@Component({
  selector: 'app-who-we-are-page',
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
  templateUrl: './who-we-are-page.component.html',
  styleUrl: './who-we-are-page.component.css'
})
export class WhoWeArePageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);
  readonly foundingYear = FOUNDATION_YEAR;
  readonly yearsOfExperience = getYearsOfExperience();

  ngOnInit(): void {
    this.seo.update({
      title: 'About Kkreative | Kozy Kreative Concepts',
      description:
        'Kozy Kreative is a young innovative company developing cutting-edge technology for customers across telecom, ecommerce, healthcare, media, web, and mobile development.',
      path: '/who-we-are',
      keywords:
        'Kozy Kreative Concepts, Kkreative about us, web development Hyderabad, mobile development Hyderabad, innovative technology company Hyderabad'
    });
  }

  readonly legalIdentity = 'KOZY KREATIVE CONCEPTS PRIVATE LIMITED';

  readonly tracks: EvolutionTrack[] = [
    {
      period: 'Company Intro',
      title: 'Young, Innovative, And Practical',
      focus: 'Kozy Kreative is a young innovative company with the idea of developing cutting-edge technology for its customers.',
      delivery: 'We keep technology useful by making business problems easier to understand and easier to solve.'
    },
    {
      period: 'Experience',
      title: '10+ Years Across Business Verticals',
      focus: 'Our experience spans telecom, ecommerce, healthcare, media, and other operating environments.',
      delivery: 'That exposure helps us understand different workflows, customer journeys, and delivery pressures.'
    },
    {
      period: 'Team',
      title: 'A Growing Dynamic Team',
      focus: 'We are a growing team of dynamic members with multifaceted capabilities.',
      delivery: 'Our strengths include Web Development, Mobile Development, and service-oriented technology delivery.'
    },
    {
      period: 'Model',
      title: 'Innovative, Simple, And Service-Oriented',
      focus: 'Our process is easy: Build Relation -> Serve Customer -> Happy Customer.',
      delivery: 'We focus on relationships first, service throughout, and outcomes clients can feel in daily work.'
    }
  ];

  readonly promisePoints: string[] = [
    'Innovative thinking applied to real business needs.',
    'Simple execution that keeps the customer comfortable.',
    'Service-oriented delivery from first conversation to support.',
    'Web and mobile capability shaped around the client workflow.'
  ];
}
