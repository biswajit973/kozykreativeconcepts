import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('vis');
              this.observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );

      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
