import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  location: string;
  state: 'Odisha' | 'West Bengal' | 'Jharkhand';
  service: string;
  review: string;
  tone: 'teal' | 'mint' | 'gold';
  photoUrl: string;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent {
  pressedCardId: string | null = null;
  isPaused = false;

  readonly testimonials: TestimonialItem[] = [
    this.createItem('sasmita-das', 'Sasmita Das', 'SD', 'Bhubaneswar', 'Odisha', 'Mutual Funds', 'They explained SIP in simple words. I now invest every month without stress.', 'teal'),
    this.createItem('debasish-mohanty', 'Debasish Mohanty', 'DM', 'Cuttack', 'Odisha', 'Term Insurance', 'I got proper term cover for my family. The process was clear and fast.', 'gold'),
    this.createItem('rashmita-sahoo', 'Rashmita Sahoo', 'RS', 'Puri', 'Odisha', 'Health Insurance', 'They compared plans and helped me pick the right one. No confusing language.', 'mint'),
    this.createItem('prabhat-rout', 'Prabhat Rout', 'PR', 'Rourkela', 'Odisha', 'Portfolio Review', 'My old portfolio was messy. They cleaned it and aligned it with my goals.', 'teal'),
    this.createItem('supriya-panda', 'Supriya Panda', 'SP', 'Sambalpur', 'Odisha', 'Tax + NPS', 'They helped me save tax and build retirement together. Very practical guidance.', 'gold'),
    this.createItem('anupam-nayak', 'Anupam Nayak', 'AN', 'Balasore', 'Odisha', 'Fixed Deposits', 'I wanted safe options for parents. They gave a good FD ladder plan.', 'mint'),
    this.createItem('madhusmita-pati', 'Madhusmita Pati', 'MP', 'Berhampur', 'Odisha', 'Goal Planning', 'Now I know how much to invest for child education. Very easy to follow.', 'teal'),
    this.createItem('niranjan-behera', 'Niranjan Behera', 'NB', 'Angul', 'Odisha', 'Bonds', 'They suggested debt options clearly. I feel my money is better balanced now.', 'mint'),
    this.createItem('lipika-patnaik', 'Lipika Patnaik', 'LP', 'Jajpur', 'Odisha', 'Vehicle Insurance', 'Renewal and comparison was smooth. I saved money and got better coverage.', 'gold'),
    this.createItem('subhendu-kar', 'Subhendu Kar', 'SK', 'Jharsuguda', 'Odisha', 'Mutual Funds', 'They never pushed random products. Every suggestion matched my risk comfort.', 'teal'),
    this.createItem('pallavi-mishra', 'Pallavi Mishra', 'PM', 'Kendrapara', 'Odisha', 'Health Insurance', 'I finally understood waiting period and claim limits. Very honest support.', 'mint'),
    this.createItem('amitabh-parida', 'Amitabh Parida', 'AP', 'Bhadrak', 'Odisha', 'Retirement Planning', 'Their retirement calculator made my next 20 years very clear.', 'gold'),
    this.createItem('barsha-pradhan', 'Barsha Pradhan', 'BP', 'Baripada', 'Odisha', 'Mutual Funds', 'They gave a simple SIP plan for my salary. I can follow it each month.', 'teal'),
    this.createItem('rakesh-swain', 'Rakesh Swain', 'RS', 'Dhenkanal', 'Odisha', 'Term Insurance', 'I got the right cover amount. My family is now financially safer.', 'gold'),
    this.createItem('soumya-padhi', 'Soumya Padhi', 'SP', 'Keonjhar', 'Odisha', 'Portfolio Review', 'They checked overlap and reduced risk in my portfolio.', 'mint'),
    this.createItem('arpita-pattanayak', 'Arpita Pattanayak', 'AP', 'Paradeep', 'Odisha', 'Health Insurance', 'Plan comparison was very clear. I chose a better policy with confidence.', 'teal'),
    this.createItem('sudipta-nayak', 'Sudipta Nayak', 'SN', 'Rayagada', 'Odisha', 'Goal Planning', 'They turned my big goals into small monthly steps.', 'mint'),
    this.createItem('sanjukta-patra', 'Sanjukta Patra', 'SP', 'Balangir', 'Odisha', 'Tax + NPS', 'Tax saving is now planned early. No last-minute rush.', 'gold'),
    this.createItem('arindam-sen', 'Arindam Sen', 'AS', 'Kolkata', 'West Bengal', 'Mutual Funds', 'Very clear advice. They explained risk and return in plain language.', 'teal'),
    this.createItem('mousumi-ghosh', 'Mousumi Ghosh', 'MG', 'Howrah', 'West Bengal', 'Health Insurance', 'I got a family floater with clear benefits. Good guidance.', 'mint'),
    this.createItem('souvik-chatterjee', 'Souvik Chatterjee', 'SC', 'Durgapur', 'West Bengal', 'Portfolio Review', 'They removed weak funds and made my plan cleaner.', 'gold'),
    this.createItem('rupa-banerjee', 'Rupa Banerjee', 'RB', 'Asansol', 'West Bengal', 'Term Insurance', 'The team helped me understand policy terms before buying.', 'teal'),
    this.createItem('priyanka-roy', 'Priyanka Roy', 'PR', 'Siliguri', 'West Bengal', 'Goal Planning', 'My child education plan is now clear and realistic.', 'mint'),
    this.createItem('abhijit-de', 'Abhijit De', 'AD', 'Kharagpur', 'West Bengal', 'Fixed Deposits', 'They built an FD split plan for safety and liquidity.', 'gold'),
    this.createItem('ananya-chakraborty', 'Ananya Chakraborty', 'AC', 'Bardhaman', 'West Bengal', 'Tax + NPS', 'I now save tax and build retirement together.', 'teal'),
    this.createItem('sujoy-paul', 'Sujoy Paul', 'SP', 'Haldia', 'West Bengal', 'Bonds', 'Bond options were explained well. I got stable returns with less worry.', 'mint'),
    this.createItem('sayani-das', 'Sayani Das', 'SD', 'Malda', 'West Bengal', 'Mutual Funds', 'My first SIP started with a small amount. Process was smooth.', 'gold'),
    this.createItem('kaushik-saha', 'Kaushik Saha', 'KS', 'Berhampore', 'West Bengal', 'Vehicle Insurance', 'Renewal was quick and simple. Coverage improved too.', 'teal'),
    this.createItem('tania-dutta', 'Tania Dutta', 'TD', 'Krishnanagar', 'West Bengal', 'Health Insurance', 'I liked the simple comparison sheet and honest advice.', 'mint'),
    this.createItem('neeraj-singh', 'Neeraj Singh', 'NS', 'Ranchi', 'Jharkhand', 'Mutual Funds', 'They matched funds to my time horizon and comfort level.', 'gold'),
    this.createItem('pooja-kumari', 'Pooja Kumari', 'PK', 'Jamshedpur', 'Jharkhand', 'Term Insurance', 'I got good term cover at a fair premium.', 'teal'),
    this.createItem('amit-prasad', 'Amit Prasad', 'AP', 'Dhanbad', 'Jharkhand', 'Portfolio Review', 'My portfolio is now balanced between growth and safety.', 'mint'),
    this.createItem('ankita-thakur', 'Ankita Thakur', 'AT', 'Bokaro', 'Jharkhand', 'Goal Planning', 'They gave me a clear monthly plan for home down payment.', 'gold'),
    this.createItem('sanjay-mehta', 'Sanjay Mehta', 'SM', 'Deoghar', 'Jharkhand', 'Tax + NPS', 'Tax planning became easy with their yearly checklist.', 'teal'),
    this.createItem('deepa-sinha', 'Deepa Sinha', 'DS', 'Hazaribagh', 'Jharkhand', 'Health Insurance', 'I understand claim limits now. This helped me choose better.', 'mint'),
    this.createItem('ravindra-shah', 'Ravindra Shah', 'RS', 'Ramgarh', 'Jharkhand', 'Fixed Deposits', 'Their FD ladder suggestion worked well for my parents.', 'gold'),
    this.createItem('ritu-jha', 'Ritu Jha', 'RJ', 'Giridih', 'Jharkhand', 'Bonds', 'Bond allocation added stability in my long-term plan.', 'teal'),
    this.createItem('manish-verma', 'Manish Verma', 'MV', 'Dumka', 'Jharkhand', 'Mutual Funds', 'I like the regular review calls. They keep me disciplined.', 'mint'),
    this.createItem('swati-kumari', 'Swati Kumari', 'SK', 'Chaibasa', 'Jharkhand', 'Vehicle Insurance', 'Good support during renewal. Fast and transparent process.', 'gold')
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
    state: TestimonialItem['state'],
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
