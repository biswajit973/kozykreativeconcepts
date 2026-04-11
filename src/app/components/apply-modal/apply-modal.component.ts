import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiStateService } from '../../shared/services/ui-state.service';

type ModalState = 'form' | 'loading' | 'success';

@Component({
  selector: 'app-apply-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-modal.component.html',
  styleUrl: './apply-modal.component.css'
})
export class ApplyModalComponent implements OnDestroy {
  readonly ui = inject(UiStateService);
  private readonly fb = inject(FormBuilder);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  applyForm: FormGroup;
  fileName: string = '';
  
  state: ModalState = 'form';
  loadingMessage = 'Applying...';
  progressDots = 0;
  
  private progressInterval: any;

  constructor() {
    this.applyForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
      currentOrg: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      currentCtc: ['', [Validators.required, Validators.min(0)]],
      expectedCtc: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    } else {
      this.fileName = '';
    }
  }

  onSubmit(): void {
    if (this.applyForm.invalid || !this.fileName) {
      this.applyForm.markAllAsTouched();
      return;
    }

    if (!this.isBrowser) return;

    // Start simulation
    this.state = 'loading';
    this.loadingMessage = 'Uploading resume...';
    this.progressDots = 15;

    // Simulate upload progress
    const steps = [
      { progress: 35, msg: 'Encrypting details...', delay: 800 },
      { progress: 65, msg: 'Submitting application...', delay: 1800 },
      { progress: 90, msg: 'Finalizing...', delay: 2800 },
      { progress: 100, msg: 'Done!', delay: 3500 }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        if (this.state === 'loading') {
          this.progressDots = step.progress;
          this.loadingMessage = step.msg;
        }
      }, step.delay);
    });

    // End simulation
    setTimeout(() => {
      if (this.state === 'loading') {
        this.state = 'success';
      }
    }, 4000);
  }

  closeModal(): void {
    this.ui.closeModal('applyModal');
    // Reset form after closing animation
    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  private resetForm(): void {
    this.state = 'form';
    this.applyForm.reset({
      noticePeriod: ''
    });
    this.fileName = '';
    this.progressDots = 0;
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}
