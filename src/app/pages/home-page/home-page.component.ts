import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { CompaniesSectionComponent } from '../../components/companies-section/companies-section.component';
import { ComplianceStripComponent } from '../../components/compliance-strip/compliance-strip.component';
import { ConnectSectionComponent } from '../../components/connect-section/connect-section.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { IndustriesSectionComponent } from '../../components/industries-section/industries-section.component';
import { LightboxComponent } from '../../components/lightbox/lightbox.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProductsSectionComponent } from '../../components/products-section/products-section.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { TickerComponent } from '../../components/ticker/ticker.component';
import { CalculatorService } from '../../shared/services/calculator.service';
import { SeoService } from '../../shared/services/seo.service';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NavbarComponent,
    MobileMenuComponent,
    HeroComponent,
    TickerComponent,
    ComplianceStripComponent,
    ServicesSectionComponent,
    IndustriesSectionComponent,
    TestimonialsSectionComponent,
    CompaniesSectionComponent,
    ProductsSectionComponent,
    ConnectSectionComponent,
    FooterComponent,
    ContactModalComponent,
    LightboxComponent,
    ChatbotWidgetComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly ui = inject(UiStateService);
  private readonly calc = inject(CalculatorService);
  private readonly seo = inject(SeoService);

  private revealObs: IntersectionObserver | null = null;
  private resizeTimeout: number | null = null;

  ngOnInit(): void {
    this.seo.update({
      title: 'Kkreative | Bigger Problems, Simple Solutions | Kozy Kreative Concepts',
      description:
        'Kozy Kreative Concepts does it in its own unique style and makes problems easier. Kkreative builds innovative technology with simple, service-oriented solutions.',
      path: '/',
      keywords:
        'Kkreative, Kozy Kreative Concepts, Inspiring Innovations, bigger problems simple solutions, Kozy Kreative Hyderabad, software development company Hyderabad, web development company Hyderabad, app development company Hyderabad, technology consulting Hyderabad'
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            this.revealObs?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    this.doc.querySelectorAll('.reveal').forEach((el) => this.revealObs?.observe(el));
    this.ui.setNavbarScrolled(window.scrollY > 40);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    this.ui.setNavbarScrolled(window.scrollY > 40);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.resizeTimeout !== null) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(() => {
      this.calc.calcSIP();
      this.calc.calcTarget();
    }, 150);
  }

  ngOnDestroy(): void {
    this.revealObs?.disconnect();
    if (this.resizeTimeout !== null) {
      clearTimeout(this.resizeTimeout);
    }
  }
}
