import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GalleryType } from '../../shared/models/types';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-app-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-showcase.component.html',
  styleUrl: './app-showcase.component.css'
})
export class AppShowcaseComponent {
  readonly ui = inject(UiStateService);

  switchGallery(type: GalleryType): void {
    this.ui.switchGallery(type);
  }

  openLightbox(card: HTMLElement): void {
    this.ui.openLightboxFromCard(card);
  }
}
