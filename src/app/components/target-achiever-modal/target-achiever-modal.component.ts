import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CalculatorService } from '../../shared/services/calculator.service';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-target-achiever-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './target-achiever-modal.component.html',
  styleUrl: './target-achiever-modal.component.css'
})
export class TargetAchieverModalComponent {
  readonly calc = inject(CalculatorService);
  readonly ui = inject(UiStateService);

  close(): void {
    this.ui.closeModal('targetModal');
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
