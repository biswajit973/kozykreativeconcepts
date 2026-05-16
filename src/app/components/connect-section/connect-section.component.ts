import { Component, inject } from '@angular/core';
import { UiStateService } from '../../shared/services/ui-state.service';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';
import { ParticleFieldComponent } from '../ui/particle-field.component';
import {
  COMPANY_ADDRESS,
  COMPANY_DIRECT_EMAIL,
  COMPANY_EMAIL,
  COMPANY_HR_EMAIL,
  COMPANY_PHONE,
  COMPANY_SALES_ADDRESS,
  COMPANY_SECONDARY_PHONE
} from '../../shared/constants/brand.constants';

@Component({
  selector: 'app-connect-section',
  standalone: true,
  imports: [ParticleFieldComponent, HoverSparkDirective],
  templateUrl: './connect-section.component.html',
  styleUrl: './connect-section.component.css'
})
export class ConnectSectionComponent {
  readonly ui = inject(UiStateService);
  readonly headOffice = COMPANY_ADDRESS;
  readonly salesOffice = COMPANY_SALES_ADDRESS;
  readonly companyEmail = COMPANY_EMAIL;
  readonly companyHrEmail = COMPANY_HR_EMAIL;
  readonly companyDirectEmail = COMPANY_DIRECT_EMAIL;
  readonly phonePrimaryDisplay = '+91 9000500600';
  readonly phonePrimaryHref = `tel:${COMPANY_PHONE}`;
  readonly phoneSecondaryDisplay = '+91 9642424545';
  readonly phoneSecondaryHref = `tel:${COMPANY_SECONDARY_PHONE}`;
}
