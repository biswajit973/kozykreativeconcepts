import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  COMPANY_ADDRESS,
  COMPANY_BRAND_NAME,
  COMPANY_CITY,
  COMPANY_COUNTRY,
  COMPANY_EMAIL,
  COMPANY_LEGAL_NAME,
  COMPANY_PHONE,
  COMPANY_REGION,
  DEFAULT_OG_IMAGE_PATH,
  FOUNDATION_YEAR,
  LINKEDIN_URL,
  SITE_URL
} from '../constants/brand.constants';

interface SeoConfig {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  imagePath?: string;
  keywords?: string;
  articlePublishedTime?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(config: SeoConfig): void {
    const canonicalUrl = new URL(config.path, SITE_URL).toString();
    const imageUrl = new URL(config.imagePath ?? DEFAULT_OG_IMAGE_PATH, SITE_URL).toString();
    const title = config.title;
    const description = config.description;
    const type = config.type ?? 'website';

    this.title.setTitle(title);

    this.setMeta('name', 'description', description);
    this.setMeta('name', 'robots', 'index,follow');
    this.setMeta('name', 'author', COMPANY_LEGAL_NAME);
    this.setMeta('name', 'keywords', config.keywords ?? '');

    this.setMeta('property', 'og:title', title);
    this.setMeta('property', 'og:description', description);
    this.setMeta('property', 'og:type', type);
    this.setMeta('property', 'og:url', canonicalUrl);
    this.setMeta('property', 'og:site_name', COMPANY_BRAND_NAME);
    this.setMeta('property', 'og:locale', 'en_IN');
    this.setMeta('property', 'og:image', imageUrl);

    this.setMeta('name', 'twitter:card', 'summary_large_image');
    this.setMeta('name', 'twitter:title', title);
    this.setMeta('name', 'twitter:description', description);
    this.setMeta('name', 'twitter:image', imageUrl);

    if (config.articlePublishedTime) {
      this.setMeta('property', 'article:published_time', config.articlePublishedTime);
    }

    this.setCanonical(canonicalUrl);
    this.setJsonLd(config, canonicalUrl, imageUrl);
  }

  private setMeta(attr: 'name' | 'property', key: string, content: string): void {
    if (!content) {
      return;
    }

    this.meta.updateTag({ [attr]: key, content });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setJsonLd(config: SeoConfig, canonicalUrl: string, imageUrl: string): void {
    const existing = this.document.getElementById('kk-seo-jsonld');
    if (existing) {
      existing.remove();
    }

    const websiteId = `${SITE_URL}/#website`;
    const organizationId = `${SITE_URL}/#organization`;
    const webpageId = `${canonicalUrl}#webpage`;

    const graph: unknown[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: COMPANY_BRAND_NAME,
        publisher: { '@id': organizationId }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': organizationId,
        name: COMPANY_LEGAL_NAME,
        alternateName: [
          COMPANY_BRAND_NAME,
          'KKreative',
          'Kkreative.in',
          'Kozy Kreative',
          'Kozy Kreative Concepts Pvt Ltd',
          'Kozy Kreative Hyderabad'
        ],
        url: SITE_URL,
        telephone: COMPANY_PHONE,
        email: COMPANY_EMAIL,
        foundingDate: `${FOUNDATION_YEAR}`,
        image: imageUrl,
        logo: new URL(DEFAULT_OG_IMAGE_PATH, SITE_URL).toString(),
        sameAs: [LINKEDIN_URL],
        description:
          'KOZY KREATIVE CONCEPTS PRIVATE LIMITED (Kkreative) is a young innovative company in Hyderabad that develops cutting-edge technology and makes business problems easier through software development, consulting, training, products, digital marketing, and startup advisory.',
        knowsAbout: [
          'Software Development', 'Web Development', 'Mobile App Development',
          'Business Consulting', 'Feasibility Study', 'SWOT Analysis',
          'Training and Skill Development', 'Resource Consulting', 'Digital Marketing',
          'Startup Advisory', 'Quickorder', 'Safehome', 'Telecom Product Suite'
        ],
        areaServed: [
          {
            '@type': 'City',
            name: COMPANY_CITY
          },
          {
            '@type': 'State',
            name: COMPANY_REGION
          },
          {
            '@type': 'Country',
            name: COMPANY_COUNTRY
          }
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY_ADDRESS,
          addressLocality: COMPANY_CITY,
          addressRegion: COMPANY_REGION,
          postalCode: '500004',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 17.4065,
          longitude: 78.4772
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': config.type === 'article' ? 'BlogPosting' : 'WebPage',
        '@id': webpageId,
        url: canonicalUrl,
        name: config.title,
        headline: config.title,
        description: config.description,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        primaryImageOfPage: imageUrl,
        publisher: { '@id': organizationId },
        ...(config.articlePublishedTime ? { datePublished: config.articlePublishedTime } : {})
      }
    ];

    const script = this.document.createElement('script');
    script.id = 'kk-seo-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({ '@graph': graph });
    this.document.head.appendChild(script);
  }
}
