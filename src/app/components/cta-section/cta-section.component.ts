import { Component, inject } from '@angular/core';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.css'
})
export class CtaSectionComponent {
  readonly ui = inject(UiStateService);
}
