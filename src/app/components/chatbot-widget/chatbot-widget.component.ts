import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../shared/models/types';
import { ChatbotService } from '../../shared/services/chatbot.service';

const KOZYBOT_PLAYED_KEY = 'kozybot_audio_played';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.css'
})
export class ChatbotWidgetComponent implements OnDestroy {
  private readonly chatbot = inject(ChatbotService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('cbMessages') private cbMessages?: ElementRef<HTMLDivElement>;
  @ViewChild('cbInput') private cbInput?: ElementRef<HTMLInputElement>;

  isOpen = false;
  chatbotInitialized = false;
  inputText = '';
  messages: ChatMessage[] = [];
  showQuickReplies = false;
  isAudioPlaying = false;

  private audioCtx: AudioContext | null = null;
  private kozybotAudio: HTMLAudioElement | null = null;
  private readonly timers: number[] = [];
  private messageCounter = 0;

  readonly quickQuestions = this.chatbot.quickQuestions;

  trackByIndex(index: number): number {
    return index;
  }

  /** New entry point: handles first-time audio or direct open */
  onTriggerClick(): void {
    if (this.isAudioPlaying) {
      // If audio is currently playing and user clicks again, stop audio and open immediately
      this.stopKozybotAudio();
      this.markAudioPlayed();
      this.openChatbot();
      return;
    }

    if (this.isOpen) {
      // Closing the chatbot
      this.isOpen = false;
      return;
    }

    // Check if kozybot audio has already been played this session
    if (this.shouldPlayKozybotAudio()) {
      this.playKozybotAudio();
    } else {
      this.openChatbot();
    }
  }

  private shouldPlayKozybotAudio(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    try {
      return sessionStorage.getItem(KOZYBOT_PLAYED_KEY) !== 'true';
    } catch {
      return false;
    }
  }

  private markAudioPlayed(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      sessionStorage.setItem(KOZYBOT_PLAYED_KEY, 'true');
    } catch {
      // noop — private browsing may block sessionStorage
    }
  }

  private playKozybotAudio(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.openChatbot();
      return;
    }

    this.isAudioPlaying = true;

    try {
      this.kozybotAudio = new Audio('work-logos/kozyBot.mp3');
      this.kozybotAudio.volume = 0.85;

      this.kozybotAudio.addEventListener('ended', () => {
        this.isAudioPlaying = false;
        this.markAudioPlayed();
        this.openChatbot();
      });

      this.kozybotAudio.addEventListener('error', () => {
        // If audio fails to load/play, just open the chatbot directly
        this.isAudioPlaying = false;
        this.markAudioPlayed();
        this.openChatbot();
      });

      const playPromise = this.kozybotAudio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay blocked — open chatbot directly
          this.isAudioPlaying = false;
          this.markAudioPlayed();
          this.openChatbot();
        });
      }
    } catch {
      this.isAudioPlaying = false;
      this.markAudioPlayed();
      this.openChatbot();
    }
  }

  private stopKozybotAudio(): void {
    if (this.kozybotAudio) {
      this.kozybotAudio.pause();
      this.kozybotAudio.currentTime = 0;
      this.kozybotAudio = null;
    }
    this.isAudioPlaying = false;
  }

  private openChatbot(): void {
    this.isOpen = true;

    if (!this.chatbotInitialized) {
      this.chatbotInitialized = true;
      this.schedule(() => {
        this.addBotMessage("Hello! Welcome to KKREATIVE CONCEPTS PRIVATE LIMITED. I'm your virtual assistant.", true);
        this.schedule(() => {
          this.addBotMessage('I can help you with our services, contact details, office location, working hours, and digital consulting. What would you like to know?');
          this.schedule(() => this.showQuickReplyButtons(), 1600);
        }, 1400);
      }, 300);
    }

    this.schedule(() => this.cbInput?.nativeElement.focus(), 0);
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendUserMessage();
    }
  }

  handleQuickQuestion(question: string): void {
    this.hideQuickReplyButtons();
    this.addUserMessage(question);
    const answer = this.chatbot.findAnswer(question);
    this.addBotMessage(answer);
    this.schedule(() => this.showQuickReplyButtons(), Math.min(1400 + answer.length * 5, 3200));
  }

  sendUserMessage(): void {
    const text = this.inputText.trim();
    if (!text) {
      return;
    }

    this.inputText = '';
    this.hideQuickReplyButtons();
    this.addUserMessage(text);
    const answer = this.chatbot.findAnswer(text);
    this.addBotMessage(answer);
    this.schedule(() => this.showQuickReplyButtons(), Math.min(1400 + answer.length * 5, 3200));
  }

  private playNotifSound(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      if (!this.audioCtx) {
        const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = Context ? new Context() : null;
      }
      if (!this.audioCtx) {
        return;
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, this.audioCtx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch {
      // noop
    }
  }

  private getTimeStr(): string {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m < 10 ? '0' : ''}${m} ${ampm}`;
  }

  private addBotMessage(text: string, skipSound = false): void {
    this.messages.push({ id: this.nextMessageId(), sender: 'bot', text: '', time: '', typing: true });
    this.scrollMessages();

    const delay = Math.min(800 + text.length * 5, 2000);
    this.schedule(() => {
      const firstTyping = this.messages.findIndex((m) => m.typing);
      if (firstTyping >= 0) {
        this.messages.splice(firstTyping, 1);
      }
      this.messages.push({ id: this.nextMessageId(), sender: 'bot', text, time: this.getTimeStr() });
      this.scrollMessages();
      if (!skipSound) {
        this.playNotifSound();
      }
    }, delay);
  }

  private addUserMessage(text: string): void {
    this.messages.push({ id: this.nextMessageId(), sender: 'user', text, time: this.getTimeStr() });
    this.scrollMessages();
  }

  private showQuickReplyButtons(): void {
    this.showQuickReplies = true;
    this.scrollMessages();
  }

  private hideQuickReplyButtons(): void {
    this.showQuickReplies = false;
  }

  private scrollMessages(): void {
    this.schedule(() => {
      const container = this.cbMessages?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }

  private nextMessageId(): string {
    this.messageCounter += 1;
    return `msg-${this.messageCounter}`;
  }

  private schedule(fn: () => void, ms: number): void {
    const id = window.setTimeout(fn, ms);
    this.timers.push(id);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      this.isOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.stopKozybotAudio();
    this.timers.forEach((id) => clearTimeout(id));
  }
}
