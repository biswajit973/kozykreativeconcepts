import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css'
})
export class MobileMenuComponent {
  @Input() mode: 'home' | 'sip' | 'target' | 'blogs' = 'home';

  readonly ui = inject(UiStateService);
  private readonly router = inject(Router);

  closeMM(): void {
    this.ui.closeMobileMenu();
  }

  openModalFromMenu(modal: 'contactModal'): void {
    this.closeMM();
    this.ui.openModal(modal);
  }

  openSipPageFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/sip-calculator']);
  }

  openTargetPageFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/target-achiever']);
  }

  openHomeFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/']);
  }

  openBlogsFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/blogs']);
  }
}
