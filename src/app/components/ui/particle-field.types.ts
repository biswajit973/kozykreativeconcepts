export type ParticlePresetId = 'services' | 'industries' | 'testimonials' | 'works' | 'cta';

export interface ParticleColorProfile {
  light: [string, string, string];
  dark: [string, string, string];
}

export interface ParticleFieldConfig {
  count: number;
  speedMin: number;
  speedMax: number;
  drift: number;
  blur: number;
  glow: number;
  opacityLight: number;
  opacityDark: number;
  radiusMin: number;
  radiusMax: number;
  palette: ParticleColorProfile;
}
