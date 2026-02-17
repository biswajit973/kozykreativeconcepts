import { Component, inject } from '@angular/core';
import { UiStateService } from '../../shared/services/ui-state.service';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';
import { ParticleFieldComponent } from '../ui/particle-field.component';

@Component({
  selector: 'app-connect-section',
  standalone: true,
  imports: [ParticleFieldComponent, HoverSparkDirective],
  templateUrl: './connect-section.component.html',
  styleUrl: './connect-section.component.css'
})
export class ConnectSectionComponent {
  readonly ui = inject(UiStateService);
}
