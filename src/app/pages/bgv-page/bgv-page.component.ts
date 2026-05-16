import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
import {
  COMPANY_HR_EMAIL,
  COMPANY_EMAIL
} from '../../shared/constants/brand.constants';

interface BgvRecord {
  empCode: string;
  candidateName: string;
  aadhaar: string;
  startDate: string;
  endDate: string;
  location: string;
  workMode: string;
  positionTitle: string;
  department: string;
  reportingManager: string;
  duties: string;
  domain: string;
  reasonForLeaving: string;
  leftVoluntarily: boolean;
  eligibleForRehire: boolean;
  overallReview: string;
  pfDeduction: boolean;
  pfExemptionReason: string;
  form16Issued: boolean;
  form16ExemptionReason: string;
  employmentType: string;
}

type PageState = 'consent' | 'camera' | 'idle' | 'searching' | 'found' | 'not-found';

interface ScanStep {
  label: string;
  done: boolean;
  active: boolean;
}

@Component({
  selector: 'app-bgv-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bgv-page.component.html',
  styleUrl: './bgv-page.component.css'
})
export class BgvPageComponent implements OnInit, OnDestroy {
  private records: BgvRecord[] = [];

  searchQuery = '';
  searchType: 'empCode' | 'aadhaar' = 'empCode';
  state: PageState = 'consent';
  result: BgvRecord | null = null;
  verificationCode = '';
  verificationTimestamp = '';
  watermarkText = '';
  digitalSignature = '';
  scanProgress = 0;
  currentYear = new Date().getFullYear();
  isDownloading = false;
  readonly hrAdminManager = 'Deepak T';

  consentAgreed = false;
  verifierName = '';
  verifierOrg = '';

  cameraStream: MediaStream | null = null;
  capturedPhoto: string | null = null;
  private photoTimerId: ReturnType<typeof setTimeout> | null = null;
  cameraError = false;

  readonly hrEmail = COMPANY_HR_EMAIL;
  readonly companyEmail = COMPANY_EMAIL;

  scanSteps: ScanStep[] = [
    { label: 'Authenticating verifier session…', done: false, active: false },
    { label: 'Connecting to HR records…', done: false, active: false },
    { label: 'Cross-referencing employee data…', done: false, active: false },
    { label: 'Preparing verification report…', done: false, active: false }
  ];

  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl?: ElementRef<HTMLCanvasElement>;

  constructor(
    private http: HttpClient,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Employee Verification | KKREATIVE BGV Portal');
    this.meta.updateTag({ name: 'description', content: 'Verify employment records of current and former employees of Kozy Kreative Concepts Private Limited.' });
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.http.get<BgvRecord[]>('/jsons/bgv-records.json').subscribe({
      next: (data) => this.records = data,
      error: () => this.records = []
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
    if (this.photoTimerId) clearTimeout(this.photoTimerId);
  }

  proceedToCamera(): void {
    this.state = 'camera';
    setTimeout(() => this.startCamera(), 300);
  }

  async startCamera(): Promise<void> {
    try {
      this.cameraError = false;
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 480, height: 640 } });
      const vid = this.videoEl?.nativeElement;
      if (vid) { vid.srcObject = this.cameraStream; vid.play(); }
    } catch { this.cameraError = true; }
  }

  capturePhoto(): void {
    const vid = this.videoEl?.nativeElement;
    const canvas = this.canvasEl?.nativeElement;
    if (!vid || !canvas) return;
    canvas.width = vid.videoWidth || 480;
    canvas.height = vid.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    this.capturedPhoto = canvas.toDataURL('image/jpeg', 0.8);
    this.stopCamera();
    // Silent auto-destroy after 5 min
    this.photoTimerId = setTimeout(() => { this.capturedPhoto = null; }, 5 * 60 * 1000);
  }

  skipCamera(): void { this.stopCamera(); this.state = 'idle'; }
  proceedToSearch(): void { this.stopCamera(); this.state = 'idle'; }
  private stopCamera(): void { this.cameraStream?.getTracks().forEach(t => t.stop()); this.cameraStream = null; }

  get maskedAadhaar(): string {
    if (!this.result) return '';
    const raw = this.result.aadhaar;
    return 'XXXX XX' + raw.slice(6, 8) + ' ' + raw.slice(8);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  get tenure(): string {
    if (!this.result) return '';
    const start = new Date(this.result.startDate);
    const end = new Date(this.result.endDate);
    const totalMonths = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return years > 0 ? `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}` : `${months} month${months !== 1 ? 's' : ''}`;
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) return;
    this.state = 'searching';
    this.result = null;
    this.scanProgress = 0;
    this.scanSteps = this.scanSteps.map(s => ({ ...s, done: false, active: false }));
    const stepDelay = 1500;
    this.scanSteps[0].active = true;
    for (let i = 0; i < this.scanSteps.length; i++) {
      setTimeout(() => {
        if (i > 0) { this.scanSteps[i - 1].done = true; this.scanSteps[i - 1].active = false; }
        this.scanSteps[i].active = true;
        this.scanProgress = ((i + 1) / this.scanSteps.length) * 100;
      }, i * stepDelay);
    }
    setTimeout(() => {
      this.scanSteps[this.scanSteps.length - 1].done = true;
      this.scanSteps[this.scanSteps.length - 1].active = false;
      let found: BgvRecord | undefined;
      if (this.searchType === 'empCode') {
        found = this.records.find(r => r.empCode.toLowerCase() === query.toLowerCase());
      } else {
        found = this.records.find(r => r.aadhaar.endsWith(query.slice(-6)) || r.aadhaar === query);
      }
      if (found) { this.result = found; this.generateWatermark(); this.state = 'found'; }
      else { this.state = 'not-found'; }
    }, stepDelay * this.scanSteps.length);
  }

  private generateWatermark(): void {
    const now = new Date();
    
    // Format: DD:MM:YYYY:HH:MM:SS
    const pad = (n: number) => n.toString().padStart(2, '0');
    this.verificationTimestamp = `${pad(now.getDate())}:${pad(now.getMonth() + 1)}:${now.getFullYear()}:${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'KKC-VER-';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    this.verificationCode = code;
    this.watermarkText = `${code} • ${this.verificationTimestamp}`;
    let sig = 'SIG-';
    for (let i = 0; i < 32; i++) { sig += chars[Math.floor(Math.random() * chars.length)]; if (i === 7 || i === 15 || i === 23) sig += '-'; }
    this.digitalSignature = sig;
  }

  async downloadReport(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.result || this.isDownloading) return;
    
    this.isDownloading = true;
    
    // Use global html2canvas from CDN
    const html2canvas = (window as any).html2canvas;
    
    const element = document.getElementById('verification-report-content');
    if (!element) {
      this.isDownloading = false;
      return;
    }
    
    try {
      // Ensure we capture the element in its full height even if scrolled
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F4',
        scrollY: -window.scrollY, // Fix for scrolled pages
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `BGV_Report_${this.result.empCode}_${this.verificationCode}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to capture report', err);
    } finally {
      this.isDownloading = false;
    }
  }

  resetSearch(): void {
    this.state = 'idle';
    this.searchQuery = '';
    this.result = null;
    this.scanProgress = 0;
  }
}
