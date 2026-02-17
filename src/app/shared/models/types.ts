export type ModalId = 'contactModal' | 'sipModal' | 'targetModal' | null;

export type GalleryType = 'web' | 'mob';

export type SipMode = 'sip' | 'lump';

export interface TickerItem {
  name: string;
  val: string;
  up: boolean;
}

export interface KnowledgeEntry {
  keywords: string[];
  answer: string;
}

export interface ChatMessage {
  sender: 'bot' | 'user';
  html: string;
  time: string;
  typing?: boolean;
}

export interface SipSeriesPoint {
  year: number;
  invested: number;
  traditional: number;
  mutualFund: number;
  gap: number;
}
