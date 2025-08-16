import { colors } from './foundations/colors';
import { spacing } from './foundations/spacing';
import { typography } from './foundations/typography';

export const theme = {
  colors,
  ...typography,
  spacing,
} as const;

export type Theme = typeof theme;

export * from './foundations/colors';
export * from './foundations/spacing';
export * from './foundations/typography';
