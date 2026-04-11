import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})
export class MobileMenuComponent {
  @Input() mode: 'home' | 'route' | 'blogs' | 'sip' | 'target' = 'home';

  readonly ui = inject(UiStateService);

  closeMM(): void {
    this.ui.closeMobileMenu();
  }

  openModalFromMenu(modal: 'contactModal'): void {
    this.closeMM();
    this.ui.openModal(modal);
  }
}
