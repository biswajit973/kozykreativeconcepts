import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services-page/services-page.component').then((m) => m.ServicesPageComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products-page/products-page.component').then((m) => m.ProductsPageComponent)
  },
  {
    path: 'who-we-are',
    loadComponent: () =>
      import('./pages/who-we-are-page/who-we-are-page.component').then((m) => m.WhoWeArePageComponent)
  },
  {
    path: 'industries',
    loadComponent: () =>
      import('./pages/industries-page/industries-page.component').then((m) => m.IndustriesPageComponent)
  },
  {
    path: 'technology',
    loadComponent: () =>
      import('./pages/technology-page/technology-page.component').then((m) => m.TechnologyPageComponent)
  },
  {
    path: 'our-work',
    loadComponent: () =>
      import('./pages/our-work-page/our-work-page.component').then((m) => m.OurWorkPageComponent)
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('./pages/blogs-page/blogs-page.component').then((m) => m.BlogsPageComponent)
  },
  {
    path: 'blogs/:slug',
    loadComponent: () =>
      import('./pages/blog-topic-page/blog-topic-page.component').then((m) => m.BlogTopicPageComponent)
  },
  {
    path: 'careers',
    loadComponent: () =>
      import('./pages/careers-page/careers-page.component').then((m) => m.CareersPageComponent)
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('./pages/bgv-page/bgv-page.component').then((m) => m.BgvPageComponent)
  },
  { path: '**', redirectTo: '' }
];
