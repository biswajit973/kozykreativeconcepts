import { Injectable } from '@angular/core';
import { KnowledgeEntry } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  readonly knowledgeBase: KnowledgeEntry[] = [
    {
      keywords: ['service', 'what do you do', 'offer', 'help', 'what can', 'provide'],
      answer: `We offer 3 simple service categories:<br><br><b>1) Savings and Investment</b><br>• Mutual Funds<br>• Fixed Deposits<br>• Bonds<br><br><b>2) Protection</b><br>• Term Insurance<br>• Health Insurance<br>• Vehicle Insurance<br><br><b>3) Others</b><br>• NPS<br><br>Would you like me to explain any one service with a real-life story?`
    },
    {
      keywords: ['contact', 'phone', 'call', 'number', 'reach'],
      answer: `You can reach us at:<br><br>📞 <b>Phone:</b> (+91) 8072871049<br>📧 <b>Email:</b> <a href='mailto:info@singlepoint.co.in' style='color:var(--c-teal)'>info@singlepoint.co.in</a><br><br>Or chat with us on <a href='https://api.whatsapp.com/send/?phone=918249402832&text&type=phone_number&app_absent=0' target='_blank' style='color:#25D366;font-weight:600'>WhatsApp</a>!`
    },
    {
      keywords: ['location', 'address', 'office', 'where', 'visit', 'direction'],
      answer: `Our office is located at:<br><br>📍 <b>31, Kharavela Nagar, Unit 3</b><br>Backside of Ram Mandir<br>Bhubaneswar — 751001, Odisha<br><br>Feel free to visit us during working hours!`
    },
    {
      keywords: ['hour', 'timing', 'open', 'when', 'working', 'time', 'schedule'],
      answer: `Our working hours are:<br><br>🕐 <b>Monday – Friday:</b> 10:00 AM – 5:00 PM<br>🕐 <b>Saturday – Sunday:</b> 10:00 AM – 1:00 PM<br><br>We're here to serve you six days a week!`
    },
    {
      keywords: ['about', 'who', 'company', 'single point', 'background', 'history'],
      answer: `Drawing from <b>15 years of UK expertise</b>, Single Point Wealth Management is expanding into India, dedicated to personalized financial services.<br><br>Our tailored approach respects your individual circumstances and goals. We prioritize your interests over affiliations, remaining <b>independent from any single company</b>.<br><br>Each client's uniqueness is recognized, ensuring customized financial plans align with your needs. Our recommendations are unbiased and driven solely by your financial objectives.`
    },
    {
      keywords: ['mutual fund', 'sip', 'equity', 'invest'],
      answer: `We offer <b>curated high-alpha equity & debt mutual fund baskets</b>, handpicked by our research team.<br><br>💡 You can also use our <b>SIP Calculator</b> on this website to see how your money can grow over time!<br><br>Want me to help you get started with mutual funds?`
    },
    {
      keywords: ['insurance', 'life', 'term plan', 'cover', 'health'],
      answer: `Our protection services are:<br><br>🛡️ <b>Term Insurance</b> — income replacement for family security<br>❤️ <b>Health Insurance</b> — support for medical emergencies<br>🚗 <b>Vehicle Insurance</b> — protection from repair and liability costs<br><br>Would you like a simple story example for any one of these?`
    },
    {
      keywords: ['nps', 'retirement', 'pension', 'old age'],
      answer: `NPS helps you build a retirement corpus with long-term discipline.<br><br>It is useful if you want structured retirement planning and a pension-focused path.<br><br>Would you like to know how NPS can fit your long-term goal?`
    },
    {
      keywords: ['loan', 'home', 'housing', 'mortgage'],
      answer: `Our current core offerings focus on Savings and Investment, Protection, and NPS.<br><br>If you still need help with home loan guidance, our advisor can speak with you and share available support options.`
    },
    {
      keywords: ['fd', 'fixed deposit', 'deposit'],
      answer: `We offer <b>Corporate Fixed Deposits</b> that beat inflation — your capital is always working harder.<br><br>These are carefully selected FDs with strong credit ratings for safety and better returns than traditional bank FDs.`
    },
    {
      keywords: ['bond', 'government', 'sovereign'],
      answer: `Our <b>Government Bonds</b> service provides sovereign-backed capital protection for your risk-free allocation.<br><br>Perfect for conservative investors looking for guaranteed returns with zero credit risk.`
    },
    {
      keywords: ['whatsapp', 'chat', 'message'],
      answer: `You can chat with us directly on WhatsApp!<br><br>💬 <a href='https://api.whatsapp.com/send/?phone=918249402832&text&type=phone_number&app_absent=0' target='_blank' style='color:#25D366;font-weight:700'>Click here to chat on WhatsApp</a><br><br>Our team is ready to assist you!`
    },
    {
      keywords: ['calculator', 'tool', 'sip calc', 'target'],
      answer: `We have two powerful calculators on our website:<br><br>📊 <b>SIP Calculator</b> — See how your monthly investments can grow over time<br>🎯 <b>Target Achiever</b> — Find out how much to invest monthly to reach your dream amount<br><br>You can find them under the <b>Tools</b> menu in the navigation bar!`
    },
    {
      keywords: ['experience', 'trust', 'why', 'choose', 'families'],
      answer: `Here's why 1,200+ families trust us:<br><br>✅ <b>₹500Cr+</b> Assets Advised<br>✅ <b>30+ Years</b> Combined Experience<br>✅ <b>15 Years UK Expertise</b> now serving India<br>✅ SEBI Regulated, IRDAI Approved, RBI Compliant<br>✅ Independent & unbiased recommendations<br><br>Your wealth deserves a Single Point of Trust!`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola'],
      answer: `Hello! 👋 Welcome to Single Point Wealth Management. I'm here to help you with information about our services, contact details, working hours, and more.<br><br>How can I assist you today?`
    },
    {
      keywords: ['thank', 'thanks', 'bye', 'goodbye', 'see you'],
      answer: `You're welcome! 😊 If you need anything else, don't hesitate to ask.<br><br>📞 Call us: (+91) 8072871049<br>💬 <a href='https://api.whatsapp.com/send/?phone=918249402832&text&type=phone_number&app_absent=0' target='_blank' style='color:#25D366;font-weight:600'>WhatsApp us</a><br><br>Have a wonderful day! 🌟`
    },
    {
      keywords: ['app', 'mobile', 'dashboard', 'tech', 'technology', 'portal'],
      answer: `We offer a powerful <b>tech platform</b> to track your wealth in real time:<br><br>💻 <b>Web Dashboard</b> — Portfolio overview, goal tracker & tax centre<br>📱 <b>Mobile App</b> — Portfolio, goals, transactions & smart alerts<br><br>Track every rupee, every goal, every move — from anywhere on the planet!`
    },
    {
      keywords: ['founder', 'team', 'leader', 'director', 'bijaya', 'piyush', 'namrata'],
      answer: `Our leadership team brings 30+ years of combined expertise:<br><br>👤 <b>Shri Bijaya K. Padhi</b> — Founder & Managing Director (30 yrs experience, Masters in Economics)<br>👤 <b>Shri Piyush K. Mishra</b> — Director (Strategic growth & sustainability leader)<br>👤 <b>Smt. Namrata Panigrahi</b> — Head of Compliance (13 yrs in finance & regulations)<br><br>A team united by one mission: your financial well-being.`
    }
  ];

  readonly quickQuestions = [
    'What services do you offer?',
    'Contact details',
    'Office location',
    'Working hours',
    'About Single Point',
    'Why trust you?'
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

    return `I appreciate your question! While I may not have the exact answer right now, our team would love to help you.<br><br>📞 <b>Call us:</b> (+91) 8072871049<br>📧 <b>Email:</b> <a href='mailto:info@singlepoint.co.in' style='color:var(--c-teal)'>info@singlepoint.co.in</a><br>💬 <a href='https://api.whatsapp.com/send/?phone=918249402832&text&type=phone_number&app_absent=0' target='_blank' style='color:#25D366;font-weight:600'>Chat on WhatsApp</a><br><br>Or try asking about our services, contact info, location, or working hours!`;
  }
}
