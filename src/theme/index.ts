import { colors } from './foundations/colors';
import { spacing } from './foundations/spacing';
import { typography } from './foundations/typography';

export const theme = {
  colors,
  ...typography,
  spacing,
} as const;

export type Theme = typeof theme;

// Export individual foundations
export * from './foundations/colors';
export * from './foundations/spacing';
export * from './foundations/typography';
