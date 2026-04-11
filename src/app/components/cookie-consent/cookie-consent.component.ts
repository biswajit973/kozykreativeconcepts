import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.css'
})
export class CookieConsentComponent implements OnInit {
  private readonly STORAGE_KEY = 'kozy_cookie_consent_accepted';
  readonly isVisible = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Delay slightly so it floats up smoothly after initial paint
      setTimeout(() => {
        const hasConsented = localStorage.getItem(this.STORAGE_KEY);
        if (!hasConsented) {
          this.isVisible.set(true);
        }
      }, 1500);
    }
  }

  accept(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      this.isVisible.set(false);
    }
  }
}
