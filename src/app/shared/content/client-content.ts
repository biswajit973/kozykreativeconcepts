export interface ProductItem {
  title: string;
  summary: string;
  points: string[];
}

export interface ClientGroup {
  country: string;
  clients: string[];
}

export const PRODUCTS: ProductItem[] = [
  {
    title: 'Quickorder',
    summary: 'A complete Restaurant Management Mobile/Tab-based POS Solution.',
    points: [
      'Powerful digital menu for restaurant operations',
      'Dynamic pricing support to improve profitability',
      'Customer flow for menu browsing, ordering, bill viewing, and payments'
    ]
  },
  {
    title: 'Safehome',
    summary:
      'Smart security and complete management software for apartment complexes, gated communities, and co-operative housing societies.',
    points: [
      'Hassle-free society and apartment management platform',
      'Easy control for everyday community operations',
      'Optimized functionality for residents, admins, and security teams'
    ]
  },
  {
    title: 'Telecom Product Suite',
    summary: 'A telecom-focused suite for activation, communication, support, and customer engagement systems.',
    points: [
      'USSD, Number Management System, Bulk SMS, and IVRS implementation',
      'Support Management Tool and GPRS Activation System',
      'Missed Call Solution for lightweight customer interaction'
    ]
  }
];

export const GLOBAL_CLIENTS: ClientGroup[] = [
  { country: 'India', clients: ['Netxcell', 'Synopsis'] },
  { country: 'USA', clients: ['MD Manage', 'AllMySons', 'Microsoft', 'Acclaim Systems', 'Prime Technologies'] },
  { country: 'Singapore', clients: ['Tabsquare', 'Delta X'] },
  { country: 'South Africa', clients: ['Multichoice Africa', 'EOH', 'DSTV', 'GOTV'] }
];
