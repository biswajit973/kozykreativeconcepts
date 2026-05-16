import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UiStateService } from '../../shared/services/ui-state.service';
import {
  COMPANY_DIRECT_EMAIL,
  COMPANY_EMAIL,
  COMPANY_HR_EMAIL,
  COMPANY_PHONE,
  COMPANY_SECONDARY_PHONE
} from '../../shared/constants/brand.constants';

interface ContactRequestForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css']
})
export class ContactModalComponent implements OnDestroy {
  readonly ui = inject(UiStateService);

  readonly companyEmail = COMPANY_EMAIL;
  readonly companyHrEmail = COMPANY_HR_EMAIL;
  readonly companyDirectEmail = COMPANY_DIRECT_EMAIL;
  readonly companyPhoneDisplay = '+91 9000500600';
  readonly companyPhoneHref = `tel:${COMPANY_PHONE}`;
  readonly companySecondaryPhoneDisplay = '+91 9642424545';
  readonly companySecondaryPhoneHref = `tel:${COMPANY_SECONDARY_PHONE}`;
  readonly serviceOptions = [
    'Software Development',
    'Research and Business Consulting',
    'Training and Skill Development',
    'Resource Consulting',
    'Digital Marketing',
    'Startup Advisory and Incubator Setup Help',
    'Quickorder',
    'Safehome',
    'Telecom Product Suite',
    'Other'
  ];

  submitAttempted = false;
  isSubmitting = false;
  submitSuccess = false;
  formData: ContactRequestForm = this.createEmptyForm();
  private submitTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    this.clearSubmitTimer();
  }

  close(): void {
    this.resetState();
    this.ui.closeModal('contactModal');
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onSubmit(form: NgForm, event: Event): void {
    event.preventDefault();
    this.submitAttempted = true;

    if (this.isSubmitting || !form.valid || this.phoneInvalid() || this.messageInvalid()) {
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.clearSubmitTimer();
    this.submitTimer = setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.submitTimer = null;
    }, 1600);
  }

  showFieldError(control: NgModel | null, extraInvalid = false): boolean {
    return !!control && (control.touched || this.submitAttempted) && (control.invalid || extraInvalid);
  }

  phoneInvalid(): boolean {
    return !this.isPhoneValid(this.formData.phone);
  }

  messageInvalid(): boolean {
    return this.formData.message.trim().length < 20;
  }

  openFastReplyEmail(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.location.href = this.buildMailtoHref();
  }

  openFastReplyCall(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.location.href = this.companyPhoneHref;
  }

  private buildMailtoHref(): string {
    const subject = encodeURIComponent(`New enquiry from ${this.formData.name} - ${this.formData.service}`);
    const body = encodeURIComponent(
      [
        `Name: ${this.formData.name}`,
        `Email: ${this.formData.email}`,
        `Phone: ${this.formData.phone}`,
        `Service: ${this.formData.service}`,
        '',
        'Requirement:',
        this.formData.message.trim()
      ].join('\n')
    );

    return `mailto:${this.companyEmail}?cc=${this.companyHrEmail},${this.companyDirectEmail}&subject=${subject}&body=${body}`;
  }

  private isPhoneValid(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 14;
  }

  private resetState(): void {
    this.clearSubmitTimer();
    this.submitAttempted = false;
    this.isSubmitting = false;
    this.submitSuccess = false;
    this.formData = this.createEmptyForm();
  }

  private clearSubmitTimer(): void {
    if (this.submitTimer) {
      clearTimeout(this.submitTimer);
      this.submitTimer = null;
    }
  }

  private createEmptyForm(): ContactRequestForm {
    return {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    };
  }
}
