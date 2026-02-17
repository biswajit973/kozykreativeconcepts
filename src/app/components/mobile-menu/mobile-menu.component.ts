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
  @Input() mode: 'home' | 'route' | 'blogs' | 'sip' | 'target' = 'home';

  readonly ui = inject(UiStateService);
  private readonly router = inject(Router);

  closeMM(): void {
    this.ui.closeMobileMenu();
  }

  openModalFromMenu(modal: 'contactModal'): void {
    this.closeMM();
    this.ui.openModal(modal);
  }

  openHomeFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/']);
  }

  openBlogsFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/blogs']);
  }

  openServicesFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/services']);
  }

  openWhoWeAreFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/who-we-are']);
  }

  openIndustriesFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/industries']);
  }

  openTechnologyFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/technology']);
  }

  openOurWorkFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/our-work']);
  }

  openCareersFromMenu(): void {
    this.closeMM();
    this.router.navigate(['/careers']);
  }

  toggleThemeMode(): void {
    this.ui.toggleThemeMode();
  }
}
