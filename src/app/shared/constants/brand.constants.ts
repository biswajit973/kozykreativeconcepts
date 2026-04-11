export const FOUNDATION_YEAR = 2014;
export const SITE_URL = 'https://kkreative.in';
export const COMPANY_LEGAL_NAME = 'KKREATIVE CONCEPTS PRIVATE LIMITED';
export const COMPANY_BRAND_NAME = 'Kozy Kreative Concepts';
export const COMPANY_PHONE = '+919000500600';
export const COMPANY_EMAIL = 'info@kkreative.in';
export const COMPANY_HR_EMAIL = 'hr@kkreative.in';
export const COMPANY_CITY = 'Hyderabad';
export const COMPANY_REGION = 'Telangana';
export const COMPANY_COUNTRY = 'India';
export const COMPANY_ADDRESS = 'White House, 1st & 2nd Floors, Khairatabad';
export const DEFAULT_OG_IMAGE_PATH = '/work-logos/Logo.png';

export const LINKEDIN_URL =
  'https://www.linkedin.com/company/kozy-kreative-concepts-pvt-ltd/?originalSubdomain=in';

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getYearsOfExperience(currentYear = getCurrentYear()): number {
  return Math.max(1, currentYear - FOUNDATION_YEAR);
}
