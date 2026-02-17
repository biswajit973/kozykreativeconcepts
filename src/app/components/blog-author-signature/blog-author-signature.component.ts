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
  @Input() authorName = 'Explained by Shri Piyush K. Mishra';
  @Input() authorTagline = 'Single Point For You';
  @Input() brandText = 'Single Point';

  get ariaLabel(): string {
    return `${this.authorName}. ${this.authorTagline}. ${this.brandText} brand signature`;
  }
}
