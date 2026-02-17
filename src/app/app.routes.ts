import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { BlogsPageComponent } from './pages/blogs-page/blogs-page.component';
import { BlogTopicPageComponent } from './pages/blog-topic-page/blog-topic-page.component';
import { CareersPageComponent } from './pages/careers-page/careers-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { WhoWeArePageComponent } from './pages/who-we-are-page/who-we-are-page.component';
import { IndustriesPageComponent } from './pages/industries-page/industries-page.component';
import { TechnologyPageComponent } from './pages/technology-page/technology-page.component';
import { OurWorkPageComponent } from './pages/our-work-page/our-work-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'who-we-are', component: WhoWeArePageComponent },
  { path: 'industries', component: IndustriesPageComponent },
  { path: 'technology', component: TechnologyPageComponent },
  { path: 'our-work', component: OurWorkPageComponent },
  { path: 'blogs', component: BlogsPageComponent },
  { path: 'blogs/:slug', component: BlogTopicPageComponent },
  { path: 'careers', component: CareersPageComponent },
  { path: '**', redirectTo: '' }
];
