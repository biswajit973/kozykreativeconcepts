import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-blog-author-signature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-author-signature.component.html',
  styleUrl: './blog-author-signature.component.css'
})
export class BlogAuthorSignatureComponent {
  @Input() authorName = 'Explained by KKREATIVE Editorial Team';
  @Input() authorTagline = 'Kozy Ideas. Kreative Solutions.';
  @Input() brandText = 'KKREATIVE';

  get ariaLabel(): string {
    return `${this.authorName}. ${this.authorTagline}. ${this.brandText} brand signature`;
  }
}
