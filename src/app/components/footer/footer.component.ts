import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly mapsUrl = 'https://maps.app.goo.gl/xQ4zWzpsBVgedtWC9';

  private readonly mapsEmbedUrl =
    'https://maps.google.com/maps?q=White%20House%2C%20Khairatabad%2C%20Hyderabad&z=15&output=embed';

  readonly mapsEmbedSafeUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(this.mapsEmbedUrl);

  readonly quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Our Services', to: '/services' },
    { label: 'Who We Are', to: '/who-we-are' },
    { label: 'Industries', to: '/industries' },
    { label: 'Technologies', to: '/technology' },
    { label: 'Our Work', to: '/our-work' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'Careers', to: '/careers' }
  ];
}
