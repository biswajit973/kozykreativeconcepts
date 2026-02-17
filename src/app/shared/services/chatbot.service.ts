import { Injectable } from '@angular/core';
import { KnowledgeEntry } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  readonly knowledgeBase: KnowledgeEntry[] = [
    {
      keywords: ['service', 'what do you do', 'offer', 'help', 'provide', 'solutions'],
      answer:
        `We offer complete digital services:<br><br>` +
        `<b>1) App Development</b><br>• Android App<br>• iOS App<br>• Windows App<br>• Mac App<br><br>` +
        `<b>2) Web Development</b><br>• Landing Pages<br>• Websites and Web Apps<br>• Gen AI solutions<br>• AI and ML projects<br><br>` +
        `<b>3) Chatbots and Automation</b><br>• Customer support chatbots<br>• Workflow automation<br>• Agent integration in existing business<br><br>` +
        `<b>4) Cloud and DevOps</b><br>• AWS, Azure, Google Cloud<br>• Deployment, monitoring, and support<br><br>` +
        `<b>5) QA Testing and Cybersecurity</b><br>• Manual and automation testing<br>• Security testing support<br><br>` +
        `<b>6) Digital Marketing</b><br>• SEO, social media, ads, lead generation<br><br>` +
        `<b>7) Software Trainings</b><br>• Python Full Stack, MERN, AWS, Azure DevOps, AI/ML`
    },
    {
      keywords: ['digitalisation', 'digitalization', 'offline', 'online', 'consulting', 'consultancy'],
      answer:
        `Yes, we help offline businesses come online step by step.<br><br>` +
        `We first understand your business flow, then design practical digital roadmap using product, cloud, and marketing support.`
    },
    {
      keywords: ['workflow', 'automation', 'manual work', 'productivity'],
      answer:
        `Workflow Boost is one of our core strengths.<br><br>` +
        `We automate repetitive daily tasks so your team saves time, reduces errors, and focuses on high-value work.`
    },
    {
      keywords: ['training', 'course', 'upskill', 'python', 'mern', 'aws', 'azure', 'ai', 'ml'],
      answer:
        `We provide B2B and B2C trainings in:<br><br>` +
        `• Python Full Stack<br>` +
        `• MERN Stack<br>` +
        `• AWS<br>` +
        `• Azure DevOps<br>` +
        `• AI and ML<br><br>` +
        `Training is practical and project-oriented.`
    },
    {
      keywords: ['industry', 'industries', 'domain', 'worked with'],
      answer:
        `We have worked with multiple industries:<br><br>` +
        `• Finance<br>` +
        `• Trading<br>` +
        `• E-commerce<br>` +
        `• Ed-tech<br>` +
        `• Manufacturing / Industry<br>` +
        `• Healthcare`
    },
    {
      keywords: ['contact', 'phone', 'call', 'number', 'reach'],
      answer:
        `You can reach us at:<br><br>` +
        `📞 <b>Customer Service:</b> +91 9000500600<br>` +
        `📧 <b>Email:</b> <a href='mailto:info@kkreative.in' style='color:var(--c-teal)'>info@kkreative.in</a><br>` +
        `📧 <b>HR:</b> <a href='mailto:Hr@kkreative.in' style='color:var(--c-teal)'>Hr@kkreative.in</a>`
    },
    {
      keywords: ['linkedin', 'social', 'profile'],
      answer:
        `LinkedIn: <b>Kozy Kreative Concepts Pvt Ltd</b><br><br>` +
        `You can also request a callback from the website and our team will connect with you.`
    },
    {
      keywords: ['location', 'address', 'office', 'where', 'visit'],
      answer:
        `Our office address:<br><br>` +
        `<b>KKREATIVE CONCEPTS PRIVATE LIMITED</b><br>` +
        `White House, 1st & 2nd Floors,<br>` +
        `Khairatabad, Hyderabad.`
    },
    {
      keywords: ['hour', 'timing', 'open', 'when', 'working', 'time'],
      answer:
        `Working hours:<br><br>🕐 <b>Mon-Sat:</b> 10:00 AM to 6:00 PM`
    },
    {
      keywords: ['why choose', 'trust', 'why you', 'benefit'],
      answer:
        `Why choose KKREATIVE:<br><br>` +
        `• Latest tools and updated technology<br>` +
        `• Team that keeps learning and upgrading<br>` +
        `• Multi-timezone support as per client requirement<br>` +
        `• Practical execution, not just theory`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      answer:
        `Hello! 👋 Welcome to <b>KKREATIVE CONCEPTS PRIVATE LIMITED</b>.<br><br>` +
        `How can I help you today with digital services or consultancy?`
    },
    {
      keywords: ['thank', 'thanks', 'bye', 'goodbye', 'see you'],
      answer:
        `You're welcome! 😊<br><br>` +
        `📞 Call us: +91 9000500600<br>` +
        `📧 Email: <a href='mailto:info@kkreative.in' style='color:var(--c-teal)'>info@kkreative.in</a><br><br>` +
        `Have a great day!`
    }
  ];

  readonly quickQuestions = [
    'What services do you offer?',
    'How do you help offline businesses?',
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
      `Thanks for your question.<br><br>` +
      `Please connect with our team for exact guidance:<br>` +
      `📞 <b>+91 9000500600</b><br>` +
      `📧 <a href='mailto:info@kkreative.in' style='color:var(--c-teal)'>info@kkreative.in</a><br><br>` +
      `You can also click Request Callback on this page.`
    );
  }
}
