import { computed, Injectable, signal } from '@angular/core';
import { SipMode, SipSeriesPoint } from '../models/types';

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  readonly sipMode = signal<SipMode>('sip');

  readonly sipAmtMin = signal(5000);
  readonly sipAmtMax = signal(100000);
  readonly sipAmtStep = signal(5000);

  readonly sipAmt = signal(25000);
  readonly sipYr = signal(10);
  readonly sipRt = signal(12);
  readonly sipTradRt = signal(7);

  readonly sipAmtLabel = signal('Monthly Investment');
  readonly sipAmtVal = signal('₹25,000');
  readonly sipYrVal = signal('10');
  readonly sipRtVal = signal('12%');
  readonly sipTradRtVal = signal('7%');

  readonly sipInv = signal('₹30L');
  readonly sipGain = signal('₹28.5L');
  readonly sipTotal = signal('₹58.5L');
  readonly sipTrad = signal('₹43.4L');
  readonly sipDiff = signal('₹15.1L');

  readonly sipInvestedNum = signal(3000000);
  readonly sipTraditionalNum = signal(4340000);
  readonly sipMutualFundNum = signal(5850000);
  readonly sipLossNum = signal(1510000);
  readonly sipGainNum = signal(2850000);
  readonly sipExtraGainNum = computed(() => Math.max(0, this.sipMutualFundNum() - this.sipTraditionalNum()));
  readonly sipHasExtraGain = computed(() => this.sipMutualFundNum() > this.sipTraditionalNum());

  readonly tgtAmt = signal(500000);
  readonly tgtYr = signal(3);
  readonly tgtRt = signal(12);
  readonly tgtFdRt = signal(7);

  readonly tgtAmtVal = signal('₹5L');
  readonly tgtYrVal = signal('3');
  readonly tgtRtVal = signal('12%');
  readonly tgtFdRtVal = signal('7%');
  readonly tgtSIP = signal('₹11,615');
  readonly tgtInvested = signal('₹4.2L');
  readonly tgtWealth = signal('₹80K');
  readonly tgtDaily = signal('₹387');
  readonly tgtGoal = signal('₹5L');
  readonly tgtYears = signal('3 years');
  readonly tgtBarsHtml = signal('');

  readonly tgtMfSip = signal('₹11,615');
  readonly tgtFdSip = signal('₹13,729');
  readonly tgtExtraMonthly = signal('₹2,114');
  readonly tgtExtraTotal = signal('₹76,100');
  readonly tgtEfficiency = signal('15.4% lower');

  readonly tgtMfSipNum = signal(11615);
  readonly tgtFdSipNum = signal(13729);
  readonly tgtExtraMonthlyNum = signal(2114);
  readonly tgtMfTotalInvestedNum = signal(418140);
  readonly tgtFdTotalInvestedNum = signal(494244);
  readonly tgtExtraTotalNum = signal(76104);
  readonly tgtHasFdBurden = computed(() => this.tgtExtraMonthlyNum() > 0);

  constructor() {
    this.calcSIP();
    this.calcTarget();
  }

  fmt(n: number): string {
    if (n >= 10000000) {
      return '₹' + (n / 10000000).toFixed(1) + 'Cr';
    }
    if (n >= 100000) {
      return '₹' + (n / 100000).toFixed(1) + 'L';
    }
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  sipCalc(monthly: number, years: number, rate: number): number {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    return monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
  }

  lumpCalc(principal: number, years: number, rate: number): number {
    return principal * (1 + rate / 100) ** years;
  }

  switchSipMode(mode: SipMode): void {
    this.sipMode.set(mode);
    this.sipAmtLabel.set(mode === 'sip' ? 'Monthly Investment' : 'Lumpsum Amount');

    if (mode === 'lump') {
      this.sipAmtMin.set(500000);
      this.sipAmtMax.set(10000000);
      this.sipAmtStep.set(50000);
      this.sipAmt.set(500000);
    } else {
      this.sipAmtMin.set(5000);
      this.sipAmtMax.set(100000);
      this.sipAmtStep.set(5000);
      this.sipAmt.set(25000);
    }

    this.calcSIP();
  }

  updateSipAmt(value: number): void {
    this.sipAmt.set(value);
    this.calcSIP();
  }

  updateSipYr(value: number): void {
    this.sipYr.set(value);
    this.calcSIP();
  }

  updateSipRt(value: number): void {
    const snapped = Math.min(15, Math.max(5, Math.round(value)));
    this.sipRt.set(snapped);
    this.calcSIP();
  }

  updateSipTradRt(value: number): void {
    const snapped = Math.min(8, Math.max(5, Math.round(value)));
    this.sipTradRt.set(snapped);
    this.calcSIP();
  }

  calcSIP(): void {
    const amount = this.sipAmt();
    const years = this.sipYr();
    const mfRate = this.sipRt();
    const tradRate = this.sipTradRt();

    this.sipAmtVal.set(this.fmt(amount));
    this.sipYrVal.set(String(years));
    this.sipRtVal.set(Math.round(mfRate) + '%');
    this.sipTradRtVal.set(Math.round(tradRate) + '%');

    let invested: number;
    let mfTotal: number;
    let traditionalTotal: number;

    if (this.sipMode() === 'sip') {
      invested = amount * years * 12;
      mfTotal = this.sipCalc(amount, years, mfRate);
      traditionalTotal = this.sipCalc(amount, years, tradRate);
    } else {
      invested = amount;
      mfTotal = this.lumpCalc(amount, years, mfRate);
      traditionalTotal = this.lumpCalc(amount, years, tradRate);
    }

    const wealthGain = mfTotal - invested;
    const extraGainOverTraditional = Math.max(0, mfTotal - traditionalTotal);

    this.sipInvestedNum.set(invested);
    this.sipTraditionalNum.set(traditionalTotal);
    this.sipMutualFundNum.set(mfTotal);
    this.sipLossNum.set(extraGainOverTraditional);
    this.sipGainNum.set(wealthGain);

    this.sipInv.set(this.fmt(Math.round(invested)));
    this.sipGain.set(this.fmt(Math.round(wealthGain)));
    this.sipTotal.set(this.fmt(Math.round(mfTotal)));
    this.sipTrad.set(this.fmt(Math.round(traditionalTotal)));
    this.sipDiff.set(this.fmt(Math.round(extraGainOverTraditional)));
  }

  buildSipSeries(years: number = this.sipYr()): SipSeriesPoint[] {
    const points: SipSeriesPoint[] = [];
    const amount = this.sipAmt();
    const mfRate = this.sipRt();
    const tradRate = this.sipTradRt();
    const mode = this.sipMode();

    for (let year = 1; year <= years; year += 1) {
      let invested: number;
      let traditional: number;
      let mutualFund: number;

      if (mode === 'sip') {
        invested = amount * year * 12;
        traditional = this.sipCalc(amount, year, tradRate);
        mutualFund = this.sipCalc(amount, year, mfRate);
      } else {
        invested = amount;
        traditional = this.lumpCalc(amount, year, tradRate);
        mutualFund = this.lumpCalc(amount, year, mfRate);
      }

      points.push({
        year,
        invested,
        traditional,
        mutualFund,
        gap: Math.max(0, mutualFund - traditional)
      });
    }

    return points;
  }

  updateTgtAmt(value: number): void {
    const snapped = Math.min(50000000, Math.max(50000, Math.round(value / 50000) * 50000));
    this.tgtAmt.set(snapped);
    this.calcTarget();
  }

  updateTgtYr(value: number): void {
    const snapped = Math.min(30, Math.max(1, Math.round(value)));
    this.tgtYr.set(snapped);
    this.calcTarget();
  }

  updateTgtRt(value: number): void {
    const snapped = Math.min(15, Math.max(8, Math.round(value)));
    this.tgtRt.set(snapped);
    this.calcTarget();
  }

  updateTgtFdRt(value: number): void {
    const snapped = Math.min(8, Math.max(5, Math.round(value)));
    this.tgtFdRt.set(snapped);
    this.calcTarget();
  }

  calcTarget(): void {
    const target = this.tgtAmt();
    const years = this.tgtYr();
    const mfRate = this.tgtRt();
    const fdRate = this.tgtFdRt();
    const months = years * 12;

    this.tgtAmtVal.set(this.fmt(target));
    this.tgtYrVal.set(String(years));
    this.tgtRtVal.set(mfRate + '%');
    this.tgtFdRtVal.set(fdRate + '%');

    const mfSip = this.requiredSipForTarget(target, years, mfRate);
    const fdSip = this.requiredSipForTarget(target, years, fdRate);
    const mfTotalInvested = mfSip * months;
    const fdTotalInvested = fdSip * months;
    const wealthCreated = target - mfTotalInvested;
    const extraMonthly = Math.max(0, fdSip - mfSip);
    const extraTotal = Math.max(0, fdTotalInvested - mfTotalInvested);
    const efficiencyPct = fdSip > 0 ? Math.max(0, ((fdSip - mfSip) / fdSip) * 100) : 0;

    this.tgtMfSipNum.set(mfSip);
    this.tgtFdSipNum.set(fdSip);
    this.tgtExtraMonthlyNum.set(extraMonthly);
    this.tgtMfTotalInvestedNum.set(mfTotalInvested);
    this.tgtFdTotalInvestedNum.set(fdTotalInvested);
    this.tgtExtraTotalNum.set(extraTotal);

    this.tgtSIP.set(this.fmt(Math.round(mfSip)));
    this.tgtInvested.set(this.fmt(Math.round(mfTotalInvested)));
    this.tgtWealth.set(this.fmt(Math.round(wealthCreated)));
    this.tgtDaily.set('₹' + Math.round(mfSip / 30).toLocaleString('en-IN'));
    this.tgtGoal.set(this.fmt(target));
    this.tgtYears.set(years + (years === 1 ? ' year' : ' years'));
    this.tgtMfSip.set(this.fmt(Math.round(mfSip)));
    this.tgtFdSip.set(this.fmt(Math.round(fdSip)));
    this.tgtExtraMonthly.set(this.fmt(Math.round(extraMonthly)));
    this.tgtExtraTotal.set(this.fmt(Math.round(extraTotal)));
    this.tgtEfficiency.set(`${efficiencyPct.toFixed(1)}% lower`);

    this.drawTargetBars(mfSip, years, mfRate, target);
  }

  private requiredSipForTarget(target: number, years: number, rate: number): number {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (monthlyRate <= 0) {
      return target / Math.max(1, months);
    }
    const factor = (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    return factor > 0 ? target / factor : target / Math.max(1, months);
  }

  private drawTargetBars(sip: number, years: number, rate: number, target: number): void {
    const steps: number[] = [];
    if (years <= 5) {
      for (let i = 1; i <= years; i += 1) {
        steps.push(i);
      }
    } else if (years <= 15) {
      for (let i = 0; i <= years; i += Math.max(1, Math.floor(years / 5))) {
        if (i > 0) {
          steps.push(i);
        }
      }
      if (!steps.includes(years)) {
        steps.push(years);
      }
    } else {
      [1, 3, 5, 10, 15, 20, 25, 30].forEach((value) => {
        if (value <= years) {
          steps.push(value);
        }
      });
      if (!steps.includes(years)) {
        steps.push(years);
      }
    }

    const data = steps.map((yr) => {
      const inv = sip * yr * 12;
      const val = this.sipCalc(sip, yr, rate);
      return { yr, inv, val };
    });

    const maxValue = Math.max(target, ...data.map((d) => d.val)) * 1.05;
    let html = '';

    data.forEach((d) => {
      const pValue = Math.max(4, (d.val / maxValue) * 100);
      const pInvested = Math.max(4, (d.inv / maxValue) * 100);
      const pTarget = Math.max(4, (target / maxValue) * 100);
      html += `<div class="bar-row"><div class="bar-label">Yr ${d.yr}</div><div class="bar-group"><div class="bar-track"><div class="bar-fill b-yours" style="width:${pValue}%"><span>${this.fmt(Math.round(d.val))}</span></div></div><div class="bar-track sm"><div class="bar-fill b-invested" style="width:${pInvested}%"><span>${this.fmt(Math.round(d.inv))}</span></div></div><div class="bar-track xs"><div class="bar-fill b-trad" style="width:${pTarget}%"><span style="font-size:.6rem">🎯 ${this.fmt(target)}</span></div></div></div></div>`;
    });

    this.tgtBarsHtml.set(html);
  }
}
