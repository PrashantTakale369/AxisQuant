import type { Config } from 'tailwindcss';

/**
 * AxisQuant Tailwind preset.
 * Maps design tokens (CSS vars) to Tailwind theme keys so utilities
 * like `bg-surface`, `text-axis`, `border-border` work everywhere.
 */
const preset: Partial<Config> = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        bg: 'var(--aq-bg)',
        'bg-elevated': 'var(--aq-bg-elevated)',
        surface: 'var(--aq-surface)',
        'surface-2': 'var(--aq-surface-2)',
        'surface-3': 'var(--aq-surface-3)',
        border: 'var(--aq-border)',
        'border-strong': 'var(--aq-border-strong)',
        text: 'var(--aq-text)',
        'text-muted': 'var(--aq-text-muted)',
        'text-subtle': 'var(--aq-text-subtle)',
        axis: {
          DEFAULT: 'var(--aq-axis)',
          hover: 'var(--aq-axis-hover)',
          soft: 'var(--aq-axis-soft)',
        },
        signal: {
          DEFAULT: 'var(--aq-signal)',
          soft: 'var(--aq-signal-soft)',
        },
        warn: 'var(--aq-warn)',
        danger: 'var(--aq-danger)',
      },
      fontFamily: {
        sans: 'var(--aq-font-sans)',
        display: 'var(--aq-font-display)',
        mono: 'var(--aq-font-mono)',
      },
      fontSize: {
        xs: 'var(--aq-text-xs)',
        sm: 'var(--aq-text-sm)',
        base: 'var(--aq-text-base)',
        lg: 'var(--aq-text-lg)',
        xl: 'var(--aq-text-xl)',
        '2xl': 'var(--aq-text-2xl)',
        '3xl': 'var(--aq-text-3xl)',
        '4xl': 'var(--aq-text-4xl)',
        '5xl': 'var(--aq-text-5xl)',
        '6xl': 'var(--aq-text-6xl)',
        '7xl': 'var(--aq-text-7xl)',
      },
      letterSpacing: {
        tight: 'var(--aq-tracking-tight)',
        normal: 'var(--aq-tracking-normal)',
        wide: 'var(--aq-tracking-wide)',
      },
      lineHeight: {
        tight: 'var(--aq-leading-tight)',
        snug: 'var(--aq-leading-snug)',
        normal: 'var(--aq-leading-normal)',
        relaxed: 'var(--aq-leading-relaxed)',
      },
      borderRadius: {
        sm: 'var(--aq-radius-sm)',
        DEFAULT: 'var(--aq-radius)',
        md: 'var(--aq-radius-md)',
        lg: 'var(--aq-radius-lg)',
        xl: 'var(--aq-radius-xl)',
      },
      boxShadow: {
        sm: 'var(--aq-shadow-sm)',
        DEFAULT: 'var(--aq-shadow)',
        lg: 'var(--aq-shadow-lg)',
        glow: 'var(--aq-shadow-glow)',
      },
      transitionDuration: {
        fast: 'var(--aq-dur-fast)',
        DEFAULT: 'var(--aq-dur)',
        slow: 'var(--aq-dur-slow)',
      },
      transitionTimingFunction: {
        'aq-out': 'var(--aq-ease-out)',
        'aq-in-out': 'var(--aq-ease-in-out)',
      },
      maxWidth: {
        prose: 'var(--aq-prose-max)',
        container: 'var(--aq-container-max)',
      },
    },
  },
};

export default preset;
