import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailFloatComponent } from './components/email-float/email-float.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { UiStateService } from './shared/services/ui-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, EmailFloatComponent, CookieConsentComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly ui = inject(UiStateService);
}
