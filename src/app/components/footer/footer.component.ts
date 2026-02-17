import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly mapsUrl = 'https://maps.app.goo.gl/xQ4zWzpsBVgedtWC9';

  private readonly mapsEmbedUrl =
    'https://maps.google.com/maps?q=31%20Kharavela%20Nagar%20Unit%203%20Backside%20of%20Ram%20Mandir%20Bhubaneswar%20Odisha%20751001&z=15&output=embed';

  readonly mapsEmbedSafeUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(this.mapsEmbedUrl);
}
