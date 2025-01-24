import { colors } from "./foundations/colors";
import { typography } from "./foundations/typography";
import { spacing } from "./foundations/spacing";

export const theme = {
  colors,
  ...typography,
  spacing,
} as const;

export type Theme = typeof theme;

export * from "./foundations/colors";
export * from "./foundations/typography";
export * from "./foundations/spacing";
