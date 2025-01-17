import { colors } from './foundations/colors';
import { typography } from './foundations/typography';
import { spacing } from './foundations/spacing';

export const theme = {
  colors,
  ...typography,
  spacing,
} as const;

export type Theme = typeof theme;

// Export individual foundations
export * from './foundations/colors';
export * from './foundations/typography';
export * from './foundations/spacing'; 