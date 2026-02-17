import { Injectable } from '@angular/core';
import { TickerItem } from '../models/types';

@Injectable({ providedIn: 'root' })
export class TickerService {
  readonly items: TickerItem[] = [
    { name: 'APP DEVELOPMENT', val: 'Android + iOS + Desktop', up: true },
    { name: 'WEB DEVELOPMENT', val: 'Websites + Web Apps + Gen AI', up: true },
    { name: 'CHATBOTS', val: '24x7 Support Automation', up: true },
    { name: 'WORKFLOW BOOST', val: 'Manual Work Reduction', up: true },
    { name: 'CLOUD & DEVOPS', val: 'AWS • Azure • GCP', up: true },
    { name: 'QA + SECURITY', val: 'Manual + Automation Testing', up: true },
    { name: 'DIGITAL MARKETING', val: 'SEO • Ads • Leads', up: true },
    { name: 'SOFTWARE TRAINING', val: 'Python • MERN • AI/ML', up: true }
  ];
}
