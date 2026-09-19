export const colors = {
  background: "#F8F9FA",
  surface: "#FFFFFF",
  textPrimary: "#1A1D1F",
  textSecondary: "#6F767E",
  purchase: "#22C55E",
  sale: "#EF4444",
  accent: "#2563EB",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export const theme = {
  colors,
  spacing,
  typography,
} as const;

export type Theme = typeof theme;
