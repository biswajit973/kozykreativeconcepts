export type JobRefreshMode = 'weekly' | 'daily';

export interface JobApplyConfig {
  email?: string;
  ctaOpen?: string;
  ctaEvergreen?: string;
}

export interface JobRoleRaw {
  roleKey: string;
  category?: string;
  type?: string;
  experienceMinYears?: number;
  titleVariants?: string[];
  summaryVariants?: string[];
  responsibilitySets?: string[][];
  requirementSets?: string[][];
  skillTags?: string[] | string[][];
  locations?: string[];
}

export interface JobsDatasetRaw {
  company?: string;
  refreshMode?: string;
  apply?: JobApplyConfig;
  roles?: JobRoleRaw[];
}

export interface JobsDataset {
  company: string;
  refreshMode: JobRefreshMode;
  apply: Required<JobApplyConfig>;
  roles: JobRoleRaw[];
}

export interface FeaturedRole {
  roleKey: string;
  category: string;
  type: string;
  title: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  tags: string[];
  location: string;
  experienceLabel: string;
  applyCta: string;
}

export interface RotationResult {
  roles: FeaturedRole[];
  seed: string;
  refreshLabel: string;
  periodLabel: string;
}
