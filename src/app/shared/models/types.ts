export type ModalId = 'contactModal' | 'sipModal' | 'targetModal' | 'applyModal' | null;

export type GalleryType = 'web' | 'mob';

export type ThemeMode = 'light' | 'dark';

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

export type ChatActionType = 'quick' | 'call' | 'whatsapp' | 'email' | 'consultation' | 'navigate';

export interface ChatMessageLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ChatQuickAction {
  id: string;
  label: string;
  type: ChatActionType;
  payload?: string;
  route?: string;
  style?: 'primary' | 'secondary' | 'ghost';
}

export interface ChatResponseVariant {
  text: string;
  bullets?: string[];
  links?: ChatMessageLink[];
  actions?: ChatQuickAction[];
}

export interface ChatIntent {
  id: string;
  category: string;
  examples: string[];
  keywords: string[];
  tags?: string[];
  responses: ChatResponseVariant[];
  followUps?: string[];
}

export interface ChatSmallTalkEntry {
  id: string;
  examples: string[];
  responses: ChatResponseVariant[];
}

export interface ChatKnowledgeProfile {
  companyName: string;
  phone: string;
  whatsappNumber: string;
  emails: string[];
  hours: string;
  addressLines: string[];
}

export interface KnowledgeDataset {
  profile: ChatKnowledgeProfile;
  quickQuestions: string[];
  intents: ChatIntent[];
  fallbackResponses: ChatResponseVariant[];
  clarificationPrompts: string[];
  smallTalk: ChatSmallTalkEntry[];
}

export interface ChatLeadState {
  stage: 'idle' | 'name' | 'need' | 'channel' | 'complete';
  name?: string;
  need?: string;
  preferredChannel?: 'call' | 'whatsapp' | 'email';
}

export interface ChatSessionState {
  messages: ChatMessage[];
  lastIntentId: string | null;
  lastIntentCategory: string | null;
  interestTags: string[];
  lowConfidenceStreak: number;
  lead: ChatLeadState;
  quickRepliesVisible: boolean;
  suggestionsDockOpen: boolean;
  mobileComposerOpen: boolean;
  muted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  bullets?: string[];
  links?: ChatMessageLink[];
  actions?: ChatQuickAction[];
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
