import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HoverSparkDirective } from '../../shared/directives/hover-spark.directive';
import { ParticleFieldComponent } from '../ui/particle-field.component';

interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  location: string;
  state: string;
  service: string;
  review: string;
  tone: 'teal' | 'mint' | 'gold';
  photoUrl: string;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule, ParticleFieldComponent, HoverSparkDirective],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent {
  pressedCardId: string | null = null;
  isPaused = false;

  readonly testimonials: TestimonialItem[] = [
    this.createItem('rahul-fintech', 'Rahul Verma', 'RV', 'Hyderabad', 'Telangana', 'App Development', 'They converted our manual onboarding into one clean app flow. Team adoption was fast.', 'teal'),
    this.createItem('ananya-edtech', 'Ananya Sharma', 'AS', 'Bengaluru', 'Karnataka', 'Web Development', 'Our new website and lead pages started bringing much better quality enquiries.', 'gold'),
    this.createItem('saurabh-trading', 'Saurabh Jain', 'SJ', 'Mumbai', 'Maharashtra', 'Process Automation', 'Daily reporting is now automated. We save hours every day.', 'mint'),
    this.createItem('nikhil-ecom', 'Nikhil Gupta', 'NG', 'Delhi', 'Delhi', 'Chatbots and Automation', 'Support chatbot reduced repetitive calls and improved response time.', 'teal'),
    this.createItem('megha-health', 'Megha Reddy', 'MR', 'Hyderabad', 'Telangana', 'Cloud and DevOps', 'Release cycles became stable after their CI/CD and monitoring setup.', 'gold'),
    this.createItem('prateek-manufacture', 'Prateek Singh', 'PS', 'Pune', 'Maharashtra', 'QA and Cybersecurity', 'They found critical issues before launch. Saved us from production pain.', 'mint'),
    this.createItem('divya-edtech', 'Divya Mishra', 'DM', 'Noida', 'Uttar Pradesh', 'Software Trainings', 'Training was practical. Our team started building features with more confidence.', 'teal'),
    this.createItem('arjun-health', 'Arjun Patil', 'AP', 'Chennai', 'Tamil Nadu', 'Digital Marketing', 'Their SEO and ads strategy improved our inbound leads in 2 months.', 'gold'),
    this.createItem('farhan-finance', 'Farhan Ali', 'FA', 'Kolkata', 'West Bengal', 'Business Digitalisation', 'We were fully offline before. They guided us step by step to go digital.', 'mint'),
    this.createItem('shruti-trading', 'Shruti Agarwal', 'SA', 'Ahmedabad', 'Gujarat', 'App Development', 'The mobile app is simple for field staff and strong on performance.', 'teal'),
    this.createItem('avinash-industry', 'Avinash Rao', 'AR', 'Visakhapatnam', 'Andhra Pradesh', 'Cloud and DevOps', 'Infra migration to cloud was smooth and downtime stayed minimal.', 'gold'),
    this.createItem('sneha-retail', 'Sneha Das', 'SD', 'Bhubaneswar', 'Odisha', 'Web Development', 'Landing pages now explain our services clearly and convert much better.', 'mint'),
    this.createItem('pallav-fintech', 'Pallav Mehta', 'PM', 'Gurugram', 'Haryana', 'Process Automation', 'Manual approvals were a bottleneck. Their automation solved it.', 'teal'),
    this.createItem('ritika-edtech', 'Ritika Ghosh', 'RG', 'Kolkata', 'West Bengal', 'Software Trainings', 'The MERN and cloud sessions were easy to understand and useful for real work.', 'gold'),
    this.createItem('karan-ecom', 'Karan Shetty', 'KS', 'Mangalore', 'Karnataka', 'Digital Marketing', 'Campaign tracking became clear. We now know what channel gives ROI.', 'mint'),
    this.createItem('hemanth-health', 'Hemanth Kumar', 'HK', 'Warangal', 'Telangana', 'QA and Cybersecurity', 'Testing quality improved and release confidence is much better now.', 'teal'),
    this.createItem('isha-trading', 'Isha Kapoor', 'IK', 'Jaipur', 'Rajasthan', 'Chatbots and Automation', 'Their chatbot and escalation flow reduced support load in peak hours.', 'gold'),
    this.createItem('manoj-manufacture', 'Manoj Das', 'MD', 'Ranchi', 'Jharkhand', 'Business Digitalisation', 'They gave us a practical roadmap, not complicated theory. Very useful team.', 'mint')
  ];

  private readonly splitIndex = Math.ceil(this.testimonials.length / 2);
  readonly rowOne = this.testimonials.slice(0, this.splitIndex);
  readonly rowTwo = this.testimonials.slice(this.splitIndex);
  readonly rowOneLoop = [...this.rowOne, ...this.rowOne];
  readonly rowTwoLoop = [...this.rowTwo, ...this.rowTwo];

  trackByLoop(index: number, item: TestimonialItem): string {
    return `${item.id}-${index}`;
  }

  onCardPress(cardId: string): void {
    this.pressedCardId = cardId;
    this.isPaused = true;
  }

  onCardRelease(): void {
    this.pressedCardId = null;
    this.isPaused = false;
  }

  onBoardEnter(): void {
    this.isPaused = true;
  }

  onBoardLeave(): void {
    this.pressedCardId = null;
    this.isPaused = false;
  }

  private createItem(
    id: string,
    name: string,
    initials: string,
    location: string,
    state: string,
    service: string,
    review: string,
    tone: TestimonialItem['tone']
  ): TestimonialItem {
    return {
      id,
      name,
      initials,
      location,
      state,
      service,
      review,
      tone,
      photoUrl: this.buildPhotoUrl(name, tone)
    };
  }

  private buildPhotoUrl(name: string, tone: TestimonialItem['tone']): string {
    const bg = tone === 'teal' ? '114B5F' : tone === 'mint' ? '2E8A7E' : 'C6973F';
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=128&rounded=true&background=${bg}&color=ffffff&format=svg&bold=true`;
  }
}
