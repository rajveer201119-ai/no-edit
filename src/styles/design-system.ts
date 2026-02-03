// EPIC Design System - Unified theme tokens for all non-Home tabs
// These are the ONLY styles to be used across Generator, Editor, Library, Profile tabs

// Color palette - using CSS variables from index.css
export const colors = {
  // Primary brand colors
  primary: "hsl(var(--primary))",
  primaryForeground: "hsl(var(--primary-foreground))",
  secondary: "hsl(var(--secondary))",
  secondaryForeground: "hsl(var(--secondary-foreground))",
  
  // Surfaces
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  card: "hsl(var(--card))",
  cardForeground: "hsl(var(--card-foreground))",
  muted: "hsl(var(--muted))",
  mutedForeground: "hsl(var(--muted-foreground))",
  
  // Accents
  accent: "hsl(var(--accent))",
  accentForeground: "hsl(var(--accent-foreground))",
  
  // Semantic
  destructive: "hsl(var(--destructive))",
  destructiveForeground: "hsl(var(--destructive-foreground))",
  border: "hsl(var(--border))",
  
  // Status colors
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "JetBrains Mono, Monaco, Consolas, monospace",
  },
  fontSize: {
    xs: "0.75rem",   // 12px
    sm: "0.875rem",  // 14px
    base: "1rem",    // 16px
    lg: "1.125rem",  // 18px
    xl: "1.25rem",   // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

// Spacing scale (matches Tailwind)
export const spacing = {
  0: "0",
  1: "0.25rem",  // 4px
  2: "0.5rem",   // 8px
  3: "0.75rem",  // 12px
  4: "1rem",     // 16px
  5: "1.25rem",  // 20px
  6: "1.5rem",   // 24px
  8: "2rem",     // 32px
  10: "2.5rem", // 40px
  12: "3rem",   // 48px
  16: "4rem",   // 64px
} as const;

// Border radius
export const borderRadius = {
  none: "0",
  sm: "calc(var(--radius) - 4px)",
  md: "calc(var(--radius) - 2px)",
  lg: "var(--radius)",
  xl: "1.25rem",
  "2xl": "1.5rem",
  full: "9999px",
} as const;

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  glow: "0 0 20px hsl(var(--primary) / 0.3)",
} as const;

// Animation transitions
export const transitions = {
  fast: "150ms ease",
  normal: "200ms ease",
  slow: "300ms ease",
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Component-specific tokens

// Button variants
export const buttonVariants = {
  primary: {
    base: "bg-primary text-primary-foreground hover:bg-primary/90",
    disabled: "opacity-50 cursor-not-allowed",
  },
  secondary: {
    base: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    disabled: "opacity-50 cursor-not-allowed",
  },
  outline: {
    base: "border border-border bg-transparent hover:bg-muted",
    disabled: "opacity-50 cursor-not-allowed",
  },
  ghost: {
    base: "bg-transparent hover:bg-muted",
    disabled: "opacity-50 cursor-not-allowed",
  },
} as const;

// Card styles
export const cardStyles = {
  default: "bg-card text-card-foreground rounded-lg border border-border shadow-sm",
  elevated: "bg-card text-card-foreground rounded-lg border border-border shadow-md",
  glass: "bg-card/50 backdrop-blur-lg text-card-foreground rounded-lg border border-border/50",
  interactive: "bg-card text-card-foreground rounded-lg border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all",
} as const;

// Input styles
export const inputStyles = {
  default: "h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
  error: "border-destructive focus:ring-destructive",
} as const;

// Badge variants
export const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-border text-foreground",
  success: "bg-green-500/10 text-green-600 border border-green-500/20",
  warning: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  error: "bg-destructive/10 text-destructive border border-destructive/20",
} as const;

// Icon sizes
export const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
} as const;

// Min touch target size for mobile accessibility
export const minTouchTarget = "min-h-[44px] min-w-[44px]";

// Z-index scale
export const zIndex = {
  dropdown: 50,
  modal: 100,
  toast: 150,
  tooltip: 200,
} as const;

// Default export for easy importing
const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  buttonVariants,
  cardStyles,
  inputStyles,
  badgeVariants,
  iconSizes,
  minTouchTarget,
  zIndex,
};

export default designSystem;
