import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BlogAuthorSignatureComponent } from '../../../../components/blog-author-signature/blog-author-signature.component';
import { ChapterContent } from '../../chapter-types';

@Component({
  selector: 'app-chapter-reader',
  standalone: true,
  imports: [CommonModule, BlogAuthorSignatureComponent],
  templateUrl: './chapter-reader.component.html',
  styleUrl: './chapter-reader.component.css'
})
export class ChapterReaderComponent implements OnChanges {
  @Input({ required: true }) content!: ChapterContent;

  activePageIndex = 0;

  get activePage(): ChapterContent['pages'][number] | null {
    if (!this.content?.pages?.length) {
      return null;
    }
    return this.content.pages[this.activePageIndex] ?? null;
  }

  get hasMultiplePages(): boolean {
    return (this.content?.pages?.length ?? 0) > 1;
  }

  get hasPreviousPage(): boolean {
    return this.activePageIndex > 0;
  }

  get hasNextPage(): boolean {
    return this.content?.pages ? this.activePageIndex < this.content.pages.length - 1 : false;
  }

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }
    this.activePageIndex += 1;
  }

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }
    this.activePageIndex -= 1;
  }

  goToPage(index: number): void {
    if (!this.content?.pages || index < 0 || index >= this.content.pages.length) {
      return;
    }
    this.activePageIndex = index;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.activePageIndex = 0;
    }
  }
}
