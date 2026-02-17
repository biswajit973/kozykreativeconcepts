import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TickerService } from '../../shared/services/ticker.service';

@Component({
  selector: 'app-ticker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticker.component.html',
  styleUrl: './ticker.component.css'
})
export class TickerComponent {
  private readonly ticker = inject(TickerService);

  readonly items = computed(() => {
    const out: typeof this.ticker.items = [];
    for (let i = 0; i < 3; i += 1) {
      out.push(...this.ticker.items);
    }
    return out;
  });

  trackByIndex(index: number): number {
    return index;
  }
}
