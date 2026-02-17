import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() mode: 'home' | 'sip' | 'target' | 'blogs' = 'home';

  readonly ui = inject(UiStateService);
  private readonly router = inject(Router);

  onToolsToggle(event: Event): void {
    this.ui.toggleToolsDrop(event);
  }

  onDropAction(event: Event, action: 'sipRoute' | 'targetRoute' | 'contactModal'): void {
    event.preventDefault();
    this.ui.closeAllDrops();
    if (action === 'sipRoute') {
      this.router.navigate(['/sip-calculator']);
      return;
    }
    if (action === 'targetRoute') {
      this.router.navigate(['/target-achiever']);
      return;
    }
    this.ui.openModal('contactModal');
  }

  onLogoClick(event: Event): void {
    if (this.mode === 'home') {
      return;
    }
    event.preventDefault();
    this.router.navigate(['/']);
  }

  onRouteNav(): void {
    this.ui.closeAllDrops();
  }

  onOpenMobileMenu(): void {
    this.ui.openMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.nav-links > li')) {
      this.ui.closeAllDrops();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.ui.closeAllDrops();
  }
}
