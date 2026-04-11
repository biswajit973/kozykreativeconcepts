import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FOUNDATION_YEAR, LINKEDIN_URL, getYearsOfExperience } from '../../shared/constants/brand.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly foundingYear = FOUNDATION_YEAR;
  readonly yearsOfExperience = getYearsOfExperience();
  readonly linkedinUrl = LINKEDIN_URL;

  readonly quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Our Services', to: '/services' },
    { label: 'Who We Are', to: '/who-we-are' },
    { label: 'Industries', to: '/industries' },
    { label: 'Technologies', to: '/technology' },
    { label: 'Our Work', to: '/our-work' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/', fragment: 'contact-section' }
  ];
}
