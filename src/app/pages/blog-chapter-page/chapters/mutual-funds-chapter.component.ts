import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChapterReaderComponent } from '../shared/chapter-reader/chapter-reader.component';
import { type ChapterContent } from '../chapter-types';

interface ProjectionRow {
  year: number;
  mutualFund: number;
  fixedDeposit: number;
  savings: number;
}

Chart.register(...registerables);

@Component({
  selector: 'app-mutual-funds-chapter',
  standalone: true,
  imports: [CommonModule, ChapterReaderComponent],
  templateUrl: './mutual-funds-chapter.component.html',
  styleUrl: './mutual-funds-chapter.component.css'
})
export class MutualFundsChapterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mfChart') private chartRef?: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private chart: Chart<'line'> | null = null;

  readonly monthlyInvestment = 10000;
  readonly years = 10;

  readonly rows: ProjectionRow[] = this.buildProjectionRows();

  readonly content: ChapterContent = {
    id: 'mutual-funds',
    title: 'Mutual Funds: How Wealth Can Grow Over Time',
    subtitle:
      'This chapter compares mutual fund, fixed deposit, and savings account with simple examples. It is for learning, not a return promise.',
    highlight:
      'Mutual fund return is market linked. Some years can be negative. Long time and discipline make the difference.',
    majorPros: [
      'Good long-term growth potential for goals like retirement and child education.',
      'SIP helps regular investing even with small monthly amount.',
      'Compounding works better when you stay invested for many years.',
      'You can start with one goal and increase SIP later.'
    ],
    pages: [
      {
        heading: 'How Mutual Fund Return Happens',
        paragraphs: [
          'A mutual fund collects money from many people and invests in many companies or bonds. When those investments grow, your fund value can grow too.',
          'Return is not fixed every year. In some years market goes down and your value can fall. In other years it can recover strongly.',
          'That is why mutual fund is best used for long goals, not for money needed in the next few months.'
        ],
        bulletTitle: 'Simple Rule',
        bullets: [
          'Short-term need money: keep safer options.',
          'Long-term growth money: mutual fund can be useful.',
          'Do SIP regularly and review once in a year.'
        ]
      },
      {
        heading: 'Mutual Fund vs FD vs Savings Account',
        paragraphs: [
          'In this chapter chart, all three options use the same monthly amount for 10 years.',
          'We use 12% for mutual fund, 7% for FD, and 3.5% for savings account as an educational example.',
          'Real market return can be higher or lower. This is not promotional and not guaranteed.'
        ],
        bulletTitle: 'What You Should Learn From Comparison',
        bullets: [
          'Mutual fund path can fluctuate but long duration can create bigger corpus.',
          'FD is stable and predictable but usually lower than long-term equity growth.',
          'Savings account gives easy access but usually lowest growth after inflation.'
        ]
      }
    ],
    actionTitle: 'Action For This Week',
    actionText:
      'Choose one goal that is at least 7 to 10 years away. Start one SIP amount that you can continue every month without fail.',
    cautionTitle: 'If You Delay',
    cautionText:
      'Late start means you may need a much bigger SIP later for the same goal.'
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.chartRef) {
      return;
    }

    const context = this.chartRef.nativeElement.getContext('2d');
    if (!context) {
      return;
    }

    const labels = Array.from({ length: this.years + 1 }, (_value, index) =>
      index === 0 ? 'Start' : `Year ${index}`
    );

    const mfValues = this.projectSip(this.monthlyInvestment, this.years, 0.12);
    const fdValues = this.projectSip(this.monthlyInvestment, this.years, 0.07);
    const savingsValues = this.projectSip(this.monthlyInvestment, this.years, 0.035);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ngZone.runOutsideAngular(() => {
      this.chart = new Chart(context, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Mutual Fund (12% example)',
              data: mfValues,
              borderColor: '#028090',
              backgroundColor: 'rgba(2, 128, 144, 0.12)',
              borderWidth: 2.5,
              pointRadius: 0,
              pointHoverRadius: 3,
              tension: 0.28
            },
            {
              label: 'Fixed Deposit (7% example)',
              data: fdValues,
              borderColor: '#C6973F',
              backgroundColor: 'rgba(198, 151, 63, 0.14)',
              borderWidth: 2.5,
              pointRadius: 0,
              pointHoverRadius: 3,
              tension: 0.24
            },
            {
              label: 'Savings A/c (3.5% example)',
              data: savingsValues,
              borderColor: '#6B8289',
              backgroundColor: 'rgba(107, 130, 137, 0.12)',
              borderWidth: 2.5,
              pointRadius: 0,
              pointHoverRadius: 3,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: reduceMotion
            ? false
            : {
                duration: 650,
                easing: 'easeOutQuart'
              },
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#2d3e44',
                boxWidth: 10,
                boxHeight: 10,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  size: 12,
                  family: 'Outfit'
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${this.formatCurrency(Number(ctx.parsed.y || 0))}`
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#60757c'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(11, 32, 39, 0.08)'
              },
              ticks: {
                color: '#60757c',
                callback: (value) => {
                  const amount = Number(value);
                  if (amount >= 1000000) {
                    return `₹${(amount / 100000).toFixed(0)}L`;
                  }
                  return `₹${Math.round(amount / 1000)}K`;
                }
              }
            }
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  private buildProjectionRows(): ProjectionRow[] {
    const mf = this.projectSip(this.monthlyInvestment, this.years, 0.12);
    const fd = this.projectSip(this.monthlyInvestment, this.years, 0.07);
    const savings = this.projectSip(this.monthlyInvestment, this.years, 0.035);

    return [3, 5, 10].map((year) => ({
      year,
      mutualFund: mf[year] ?? 0,
      fixedDeposit: fd[year] ?? 0,
      savings: savings[year] ?? 0
    }));
  }

  private projectSip(monthlyInvestment: number, years: number, annualReturn: number): number[] {
    const monthlyRate = annualReturn / 12;
    const values: number[] = [0];
    let corpus = 0;

    for (let month = 1; month <= years * 12; month += 1) {
      corpus = (corpus + monthlyInvestment) * (1 + monthlyRate);
      if (month % 12 === 0) {
        values.push(Math.round(corpus));
      }
    }

    return values;
  }
}
