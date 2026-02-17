import { Injectable } from '@angular/core';
import { TickerItem } from '../models/types';

@Injectable({ providedIn: 'root' })
export class TickerService {
  readonly items: TickerItem[] = [
    { name: 'NIFTY 50', val: '22,450', up: true },
    { name: 'SENSEX', val: '73,980', up: true },
    { name: 'GOLD', val: '61,200', up: false },
    { name: 'NASDAQ', val: '16,099', up: true },
    { name: 'USD/INR', val: '82.90', up: false },
    { name: 'CRUDE', val: '78.45', up: true },
    { name: 'BANK NIFTY', val: '47,280', up: true },
    { name: 'SILVER', val: '73,500', up: false }
  ];
}
