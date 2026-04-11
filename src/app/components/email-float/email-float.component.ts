import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';

interface SupportEmail {
  label: string;
  href: string;
}

@Component({
  selector: 'app-email-float',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-float.component.html',
  styleUrl: './email-float.component.css'
})
export class EmailFloatComponent {
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  readonly isOpen = signal(false);
  readonly emails: SupportEmail[] = [
    { label: 'info@kkreative.in', href: 'mailto:info@kkreative.in' },
    { label: 'hr@kkreative.in', href: 'mailto:hr@kkreative.in' }
  ];

  toggleMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!target) {
      this.isOpen.set(false);
      return;
    }

    if (!this.hostRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
