import {
  FeaturedRole,
  JobRefreshMode,
  JobRoleRaw,
  JobsDataset,
  JobsDatasetRaw,
  RotationResult
} from '../careers.models';

const DEFAULT_COMPANY = 'Kozy Kreative Concepts';
const DEFAULT_EMAIL = 'careers@kkreative.in';
const DEFAULT_OPEN_CTA = 'Apply now';
const DEFAULT_EVERGREEN_CTA = 'Join our talent pool';
const DEFAULT_LOCATION = 'Remote-India';
const DEFAULT_RESPONSIBILITY = 'Role responsibilities will be shared during interview.';
const DEFAULT_REQUIREMENT = 'Role requirements will be shared during interview.';
const DEFAULT_TITLE = 'Team Member';
const DEFAULT_SUMMARY = 'This role supports product and delivery goals across teams.';
const DEFAULT_TAG = 'General';

interface PeriodInfo {
  key: string;
  label: string;
}

export function normalizeJobsDataset(raw: JobsDatasetRaw | null | undefined): JobsDataset {
  const refreshMode: JobRefreshMode = raw?.refreshMode === 'daily' ? 'daily' : 'weekly';
  const roles = Array.isArray(raw?.roles)
    ? raw!.roles.filter((role): role is JobRoleRaw => typeof role?.roleKey === 'string' && role.roleKey.length > 0)
    : [];

  return {
    company: normalizeString(raw?.company, DEFAULT_COMPANY),
    refreshMode,
    apply: {
      email: normalizeString(raw?.apply?.email, DEFAULT_EMAIL),
      ctaOpen: normalizeString(raw?.apply?.ctaOpen, DEFAULT_OPEN_CTA),
      ctaEvergreen: normalizeString(raw?.apply?.ctaEvergreen, DEFAULT_EVERGREEN_CTA)
    },
    roles
  };
}

export function createEmptyDataset(): JobsDataset {
  return {
    company: DEFAULT_COMPANY,
    refreshMode: 'weekly',
    apply: {
      email: DEFAULT_EMAIL,
      ctaOpen: DEFAULT_OPEN_CTA,
      ctaEvergreen: DEFAULT_EVERGREEN_CTA
    },
    roles: []
  };
}

export function rotateFeaturedRoles(dataset: JobsDataset, now: Date, maxRoles: number): RotationResult {
  const period = getPeriodInfo(dataset.refreshMode, now);
  const seed = `${dataset.company}|${period.key}`;

  const sortedRoles = [...dataset.roles].sort((a, b) => {
    const aHash = hashString(`${seed}|order|${a.roleKey}`);
    const bHash = hashString(`${seed}|order|${b.roleKey}`);
    return aHash - bHash;
  });

  const pickedRoles = sortedRoles.slice(0, Math.max(0, maxRoles));
  const roles = pickedRoles.map((role) => resolveRole(role, seed, dataset.apply));

  const refreshLabel =
    dataset.refreshMode === 'daily' ? 'Featured roles refreshed daily' : 'Featured roles refreshed weekly';

  return {
    roles,
    seed: period.key,
    refreshLabel,
    periodLabel: period.label
  };
}

function resolveRole(role: JobRoleRaw, seed: string, applyConfig: JobsDataset['apply']): FeaturedRole {
  const title = pickFromStringArray(role.titleVariants, `${seed}|${role.roleKey}|title`, DEFAULT_TITLE);
  const summary = pickFromStringArray(role.summaryVariants, `${seed}|${role.roleKey}|summary`, DEFAULT_SUMMARY);
  const responsibilities = pickFromNestedStringArrays(
    role.responsibilitySets,
    `${seed}|${role.roleKey}|responsibilities`,
    [DEFAULT_RESPONSIBILITY]
  );
  const requirements = pickFromNestedStringArrays(
    role.requirementSets,
    `${seed}|${role.roleKey}|requirements`,
    [DEFAULT_REQUIREMENT]
  );
  const tags = pickFromSkillTagSets(role.skillTags, `${seed}|${role.roleKey}|tags`, [DEFAULT_TAG]);
  const location = pickFromStringArray(role.locations, `${seed}|${role.roleKey}|location`, DEFAULT_LOCATION);
  const experienceLabel = `${normalizeExperience(role.experienceMinYears)}+ years`;
  const type = normalizeType(role.type);

  return {
    roleKey: role.roleKey,
    category: normalizeString(role.category, 'General'),
    type,
    title,
    summary,
    responsibilities,
    requirements,
    tags,
    location,
    experienceLabel,
    applyCta: type === 'Evergreen' ? applyConfig.ctaEvergreen : applyConfig.ctaOpen
  };
}

function normalizeExperience(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return 0;
  }
  return Math.floor(value);
}

function normalizeType(type: string | undefined): string {
  const normalized = normalizeString(type, 'Open').toLowerCase();
  if (normalized === 'evergreen') {
    return 'Evergreen';
  }
  if (normalized === 'open') {
    return 'Open';
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function pickFromStringArray(values: string[] | undefined, seedKey: string, fallback: string): string {
  const cleaned = sanitizeStringArray(values);
  if (cleaned.length === 0) {
    return fallback;
  }

  const idx = hashString(seedKey) % cleaned.length;
  return cleaned[idx] ?? cleaned[0] ?? fallback;
}

function pickFromNestedStringArrays(
  sets: string[][] | undefined,
  seedKey: string,
  fallback: string[]
): string[] {
  const cleanedSets = (Array.isArray(sets) ? sets : [])
    .map((set) => sanitizeStringArray(set))
    .filter((set) => set.length > 0);

  if (cleanedSets.length === 0) {
    return fallback;
  }

  const idx = hashString(seedKey) % cleanedSets.length;
  return cleanedSets[idx] ?? cleanedSets[0] ?? fallback;
}

function pickFromSkillTagSets(
  skillTags: string[] | string[][] | undefined,
  seedKey: string,
  fallback: string[]
): string[] {
  if (!Array.isArray(skillTags)) {
    return fallback;
  }

  if (skillTags.length === 0) {
    return fallback;
  }

  if (Array.isArray(skillTags[0])) {
    return pickFromNestedStringArrays(skillTags as string[][], seedKey, fallback);
  }

  const tags = sanitizeStringArray(skillTags as string[]);
  return tags.length > 0 ? tags : fallback;
}

function sanitizeStringArray(values: string[] | undefined): string[] {
  return (Array.isArray(values) ? values : [])
    .map((value) => normalizeString(value, ''))
    .filter((value) => value.length > 0);
}

function normalizeString(value: string | undefined, fallback: string): string {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized.length > 0 ? normalized : fallback;
}

function getPeriodInfo(mode: JobRefreshMode, now: Date): PeriodInfo {
  if (mode === 'daily') {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return {
      key: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
      label: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    };
  }

  const { isoYear, isoWeek, weekStart, weekEnd } = getIsoWeekInfo(now);
  return {
    key: `${isoYear}-W${pad(isoWeek)}`,
    label: `${weekStart.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC'
    })} - ${weekEnd.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    })}`
  };
}

function getIsoWeekInfo(date: Date): { isoYear: number; isoWeek: number; weekStart: Date; weekEnd: Date } {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);

  const isoYear = utcDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const diffDays = Math.floor((utcDate.getTime() - yearStart.getTime()) / 86400000);
  const isoWeek = Math.floor(diffDays / 7) + 1;

  const weekStart = new Date(utcDate);
  weekStart.setUTCDate(utcDate.getUTCDate() - 3);

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

  return { isoYear, isoWeek, weekStart, weekEnd };
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
