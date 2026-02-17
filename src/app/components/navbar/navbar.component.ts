import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Input, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiStateService } from '../../shared/services/ui-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Input() mode: 'home' | 'route' | 'blogs' | 'sip' | 'target' = 'home';

  readonly ui = inject(UiStateService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  whatWeDoOpen = false;

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.ui.setNavbarScrolled(window.scrollY > 40);
  }

  onToolsToggle(event: Event): void {
    this.ui.toggleToolsDrop(event);
  }

  onDropAction(event: Event, action: 'contactModal'): void {
    event.preventDefault();
    this.ui.closeAllDrops();
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
    this.whatWeDoOpen = false;
    this.ui.closeAllDrops();
  }

  toggleWhatWeDo(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.whatWeDoOpen = !this.whatWeDoOpen;
  }

  onOpenMobileMenu(): void {
    this.ui.openMobileMenu();
  }

  onThemeToggle(): void {
    this.ui.toggleThemeMode();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('#whatWeDoMenu')) {
      this.whatWeDoOpen = false;
    }
    if (!target?.closest('.nav-links > li')) {
      this.ui.closeAllDrops();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.whatWeDoOpen = false;
    this.ui.closeAllDrops();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) {
      return;
    }
    this.ui.setNavbarScrolled(window.scrollY > 40);
  }
}
