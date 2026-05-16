import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRODUCTS } from '../../shared/content/client-content';

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-section.component.html',
  styleUrl: './products-section.component.css'
})
export class ProductsSectionComponent {
  readonly products = PRODUCTS;

  trackProduct(_index: number, item: (typeof PRODUCTS)[number]): string {
    return item.title;
  }
}
