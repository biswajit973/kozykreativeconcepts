import { Injectable } from '@angular/core';
import { KnowledgeEntry } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  readonly knowledgeBase: KnowledgeEntry[] = [
    {
      keywords: ['service', 'what do you do', 'offer', 'help', 'provide', 'solutions'],
      answer:
        `We help businesses with:\n\n` +
        `1) Software Development\n• Custom web applications\n• Mobile application development\n\n` +
        `2) Research and Business Consulting\n• Feasibility Study\n• SWOT Analysis\n• Market Mindset\n\n` +
        `3) Training and Skill Development\n• PMP\n• Ethical Hacking\n• Testing\n• Team Building\n\n` +
        `4) Resource Consulting\n• Resource planning\n• Capability matching\n\n` +
        `5) Digital Marketing\n• Online visibility\n• Campaign and enquiry support\n\n` +
        `6) Startup Advisory and Incubator Setup Help`
    },
    {
      keywords: ['digitalisation', 'digitalization', 'offline', 'online', 'consulting', 'consultancy'],
      answer:
        `Yes. We support business consulting through Feasibility Study, SWOT Analysis, and Market Mindset.\n\n` +
        `The goal is to make the next business or technology step simpler and clearer.`
    },
    {
      keywords: ['workflow', 'automation', 'manual work', 'productivity'],
      answer:
        `Yes. Automation is one of the industries and solution areas we support.\n\n` +
        `We look for repeated manual work and suggest practical software-led ways to simplify it.`
    },
    {
      keywords: ['product', 'products', 'quickorder', 'safehome', 'telecom suite', 'telecom product'],
      answer:
        `Our products include:\n\n` +
        `• Quickorder: Restaurant Management Mobile/Tab-based POS Solution\n` +
        `• Safehome: Smart security and management software for apartments, gated communities, and housing societies\n` +
        `• Telecom Product Suite: USSD, Number Management System, Bulk SMS, IVRS, Support Management Tool, GPRS Activation System, and Missed Call Solution`
    },
    {
      keywords: ['training', 'course', 'upskill', 'python', 'mern', 'aws', 'azure', 'ai', 'ml'],
      answer:
        `We provide training and skill development in:\n\n` +
        `• PMP Project Management Certification support\n` +
        `• Ethical Hacking\n` +
        `• Testing\n` +
        `• Team Building\n\n` +
        `Training is shaped around practical capability.`
    },
    {
      keywords: ['industry', 'industries', 'domain', 'worked with'],
      answer:
        `We have supported teams across multiple industries:\n\n` +
        `• E-commerce\n` +
        `• Telecom\n` +
        `• Healthcare\n` +
        `• Banking and Finance\n` +
        `• Retail\n` +
        `• Insurance\n` +
        `• Automation`
    },
    {
      keywords: ['contact', 'phone', 'call', 'number', 'reach'],
      answer:
        `You can reach us at:\n\n` +
        `Phone: +91 9000500600 | +91 9642424545\n` +
        `Email: info@kkreative.in\n` +
        `HR: hr@kkreative.in\n` +
        `Direct: naveent@kkreative.in`
    },
    {
      keywords: ['linkedin', 'social', 'profile'],
      answer:
        `LinkedIn: Kozy Kreative Concepts Pvt Ltd\n` +
        `https://www.linkedin.com/company/kozy-kreative-concepts-pvt-ltd/?originalSubdomain=in\n\n` +
        `You can also request a callback from the website and our team will connect with you.`
    },
    {
      keywords: ['location', 'address', 'office', 'where', 'visit'],
      answer:
        `Our office address:\n\n` +
        `KKREATIVE CONCEPTS PRIVATE LIMITED\n` +
        `Head Office: #6-2-659/3/2/1, White House, 1st & 2nd Floor, Khairtabad, Hyderabad - 500004\n\n` +
        `Sales Office: #402, Block B, MVV Aurum, Hi-Tech City, Kondapur, Hyderabad.`
    },
    {
      keywords: ['hour', 'timing', 'open', 'when', 'working', 'time'],
      answer:
        `Working hours:\n\nMon-Sat: 10:00 AM to 6:00 PM`
    },
    {
      keywords: ['why choose', 'trust', 'why you', 'benefit'],
      answer:
        `Why choose KKREATIVE:\n\n` +
        `• Bigger Problems, Simple Solutions\n` +
        `• Innovative, simple, and service-oriented process\n` +
        `• 10+ years across telecom, ecommerce, healthcare, media, and more\n` +
        `• Build Relation -> Serve Customer -> Happy Customer`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      answer:
        `Hello! Welcome to KKREATIVE CONCEPTS PRIVATE LIMITED.\n\n` +
        `How can I help you today? You can ask about services, industries, contact details, or consultation.`
    },
    {
      keywords: ['thank', 'thanks', 'bye', 'goodbye', 'see you'],
      answer:
        `You're welcome!\n\n` +
      `Call us: +91 9000500600\n` +
      `Alternate: +91 9642424545\n` +
      `Email: info@kkreative.in\n\n` +
        `Have a great day!`
    }
  ];

  readonly quickQuestions = [
    'What services do you offer?',
    'What products do you offer?',
    'Contact details',
    'Office location',
    'Training details',
    'Why choose KKREATIVE?'
  ];

  findAnswer(query: string): string {
    const q = query.toLowerCase().trim();
    let bestMatch: KnowledgeEntry | undefined;
    let bestScore = 0;

    this.knowledgeBase.forEach((item) => {
      let score = 0;
      item.keywords.forEach((kw) => {
        if (q.indexOf(kw.toLowerCase()) !== -1) {
          score += kw.length;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch !== undefined && bestScore > 0) {
      return bestMatch.answer;
    }

    return (
      `Thanks for your question.\n\n` +
      `For the best answer, please connect with our team directly:\n` +
      `+91 9000500600\n` +
      `info@kkreative.in\n\n` +
      `You can also use the contact option on this page.`
    );
  }
}
