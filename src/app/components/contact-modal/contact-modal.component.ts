import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-modal.component.html',
  styleUrl: './contact-modal.component.css'
})
export class ContactModalComponent {
  readonly ui = inject(UiStateService);

  close(): void {
    this.ui.closeModal('contactModal');
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    window.alert('Thank you! Our advisor will contact you within 24 hours.');
    this.close();
  }
}
