import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SipCalculatorPageComponent } from './pages/sip-calculator-page/sip-calculator-page.component';
import { TargetAchieverPageComponent } from './pages/target-achiever-page/target-achiever-page.component';
import { BlogsPageComponent } from './pages/blogs-page/blogs-page.component';
import { BlogChapterPageComponent } from './pages/blog-chapter-page/blog-chapter-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'blogs', component: BlogsPageComponent },
  { path: 'blogs/:chapterId', component: BlogChapterPageComponent },
  { path: 'sip-calculator', component: SipCalculatorPageComponent },
  { path: 'target-achiever', component: TargetAchieverPageComponent },
  { path: '**', redirectTo: '' }
];
