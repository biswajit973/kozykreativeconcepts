import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MobileMenuComponent } from '../../components/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FeaturedRole, JobsDataset } from './careers.models';
import { CareersService } from './careers.service';
import { createEmptyDataset, rotateFeaturedRoles } from './utils/careers-rotation.util';

@Component({
  selector: 'app-careers-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    MobileMenuComponent,
    FooterComponent,
    ContactModalComponent,
    ChatbotWidgetComponent
  ],
  templateUrl: './careers-page.component.html',
  styleUrl: './careers-page.component.css'
})
export class CareersPageComponent implements OnInit {
  private readonly careersService = inject(CareersService);

  readonly loading = signal(true);
  readonly dataset = signal<JobsDataset>(createEmptyDataset());
  readonly featuredRoles = signal<FeaturedRole[]>([]);

  readonly searchTerm = signal('');
  readonly selectedCategory = signal('all');
  readonly refreshLabel = signal('Featured roles refreshed weekly');
  readonly refreshPeriod = signal('');

  readonly categories = computed(() => {
    const unique = new Set(this.featuredRoles().map((role) => role.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  });

  readonly filteredRoles = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.featuredRoles().filter((role) => {
      const matchesCategory = category === 'all' || role.category === category;
      if (!matchesCategory) {
        return false;
      }

      if (!term) {
        return true;
      }

      const inTitle = role.title.toLowerCase().includes(term);
      const inTags = role.tags.some((tag) => tag.toLowerCase().includes(term));
      return inTitle || inTags;
    });
  });

  ngOnInit(): void {
    this.careersService
      .getJobsDataset()
      .pipe(take(1))
      .subscribe((dataset) => {
        this.dataset.set(dataset);
        const rotation = rotateFeaturedRoles(dataset, new Date(), 5);
        this.featuredRoles.set(rotation.roles);
        this.refreshLabel.set(rotation.refreshLabel);
        this.refreshPeriod.set(rotation.periodLabel);
        this.loading.set(false);
      });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
  }

  getApplyHref(): string {
    return `mailto:${this.dataset().apply.email}`;
  }

  trackRole(_: number, role: FeaturedRole): string {
    return role.roleKey;
  }
}
