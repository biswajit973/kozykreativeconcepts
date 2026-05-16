import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PRODUCTS } from '../../shared/content/client-content';
import { SeoService } from '../../shared/services/seo.service';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-products-page',
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
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit {
  readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);
  readonly products = PRODUCTS;

  ngOnInit(): void {
    this.seo.update({
      title: 'Products | Quickorder, Safehome and Telecom Product Suite | Kkreative',
      description:
        'Explore Kozy Kreative Concepts products including Quickorder restaurant POS, Safehome society management software, and telecom product suite solutions.',
      path: '/products',
      keywords:
        'Quickorder restaurant POS, Safehome apartment management software, telecom product suite, Kozy Kreative products, Kkreative products'
    });
  }

  trackProduct(_index: number, item: (typeof PRODUCTS)[number]): string {
    return item.title;
  }
}
