import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InfiniteSliderComponent } from './infinite-slider.component';
import { LogoItem } from './logo-item.model';

@Component({
  selector: 'app-logo-cloud-3',
  standalone: true,
  imports: [CommonModule, InfiniteSliderComponent],
  templateUrl: './logo-cloud-3.component.html',
  styleUrl: './logo-cloud-3.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoCloud3Component {
  @Input() logos: LogoItem[] = [];
}
