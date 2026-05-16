import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  COMPANY_ADDRESS,
  COMPANY_DIRECT_EMAIL,
  COMPANY_EMAIL,
  COMPANY_HR_EMAIL,
  COMPANY_PHONE,
  COMPANY_SALES_ADDRESS,
  COMPANY_SECONDARY_PHONE,
  FOUNDATION_YEAR,
  LINKEDIN_URL,
  getCurrentYear,
  getYearsOfExperience
} from '../../shared/constants/brand.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly foundingYear = FOUNDATION_YEAR;
  readonly currentYear = getCurrentYear();
  readonly yearsOfExperience = getYearsOfExperience();
  readonly linkedinUrl = LINKEDIN_URL;
  readonly headOffice = COMPANY_ADDRESS;
  readonly salesOffice = COMPANY_SALES_ADDRESS;
  readonly phonePrimaryDisplay = '+91 9000500600';
  readonly phonePrimaryHref = `tel:${COMPANY_PHONE}`;
  readonly phoneSecondaryDisplay = '+91 9642424545';
  readonly phoneSecondaryHref = `tel:${COMPANY_SECONDARY_PHONE}`;
  readonly companyEmail = COMPANY_EMAIL;
  readonly companyHrEmail = COMPANY_HR_EMAIL;
  readonly companyDirectEmail = COMPANY_DIRECT_EMAIL;

  readonly quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Our Services', to: '/services' },
    { label: 'Products', to: '/products' },
    { label: 'Who We Are', to: '/who-we-are' },
    { label: 'Industries', to: '/industries' },
    { label: 'Technologies', to: '/technology' },
    { label: 'Our Work', to: '/our-work' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/', fragment: 'contact-section' }
  ];
}
