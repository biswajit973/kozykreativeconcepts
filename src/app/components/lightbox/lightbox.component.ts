import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.css'
})
export class LightboxComponent {
  readonly ui = inject(UiStateService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly safeScreenHtml = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.ui.lightboxScreenHtml()));

  close(): void {
    this.ui.closeLightbox();
  }

  onOverlayClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.id === 'lightbox') {
      this.close();
    }
  }
}
