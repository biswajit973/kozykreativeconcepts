import { Injectable } from '@angular/core';
import { KnowledgeEntry } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  readonly knowledgeBase: KnowledgeEntry[] = [
    {
      keywords: ['service', 'what do you do', 'offer', 'help', 'provide', 'solutions'],
      answer:
        `We help businesses with the digital work they usually need:\n\n` +
        `1) App Development\n• Android App\n• iOS App\n• Windows App\n• Mac App\n\n` +
        `2) Web Development\n• Landing Pages\n• Websites and Web Apps\n• Gen AI solutions\n• AI and ML projects\n\n` +
        `3) Chatbots and Automation\n• Customer support chatbots\n• Workflow automation\n• Agent integration in existing business\n\n` +
        `4) Cloud and DevOps\n• AWS, Azure, Google Cloud\n• Deployment, monitoring, and support\n\n` +
        `5) QA Testing and Cybersecurity\n• Manual and automation testing\n• Security testing support\n\n` +
        `6) Digital Marketing\n• SEO, social media, ads, lead generation\n\n` +
        `7) Software Trainings\n• Python Full Stack\n• MERN\n• AWS\n• Azure DevOps\n• AI and ML`
    },
    {
      keywords: ['digitalisation', 'digitalization', 'offline', 'online', 'consulting', 'consultancy'],
      answer:
        `Yes. We help offline businesses come online step by step.\n\n` +
        `We first understand how the business works today, then suggest a simple plan for website, process, marketing, or automation support.`
    },
    {
      keywords: ['workflow', 'automation', 'manual work', 'productivity'],
      answer:
        `Yes, we help reduce repeated manual work.\n\n` +
        `We set up chatbots, workflow rules, alerts, and tool integrations so the team saves time and makes fewer avoidable mistakes.`
    },
    {
      keywords: ['training', 'course', 'upskill', 'python', 'mern', 'aws', 'azure', 'ai', 'ml'],
      answer:
        `We provide B2B and B2C trainings in:\n\n` +
        `• Python Full Stack\n` +
        `• MERN Stack\n` +
        `• AWS\n` +
        `• Azure DevOps\n` +
        `• AI and ML\n\n` +
        `Training is practical and project-oriented.`
    },
    {
      keywords: ['industry', 'industries', 'domain', 'worked with'],
      answer:
        `We have supported teams across multiple industries:\n\n` +
        `• Finance\n` +
        `• Trading\n` +
        `• E-commerce\n` +
        `• Ed-tech\n` +
        `• Manufacturing / Industry\n` +
        `• Healthcare`
    },
    {
      keywords: ['contact', 'phone', 'call', 'number', 'reach'],
      answer:
        `You can reach us at:\n\n` +
        `Customer Service: +91 9000500600\n` +
        `Email: info@kkreative.in\n` +
        `HR: hr@kkreative.in`
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
        `White House, 1st & 2nd Floors,\n` +
        `Khairatabad, Hyderabad.`
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
        `• We try to keep things clear and practical\n` +
        `• We work across product, cloud, AI, and growth support\n` +
        `• We can support clients across different time zones\n` +
        `• We care about delivery after launch, not only launch day`
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
        `Email: info@kkreative.in\n\n` +
        `Have a great day!`
    }
  ];

  readonly quickQuestions = [
    'What services do you offer?',
    'How do you help offline businesses go online?',
    'Contact details',
    'Office location',
    'Software training details',
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
