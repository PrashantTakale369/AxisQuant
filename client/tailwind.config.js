/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0b',
        surface: '#111114',
        's2': '#16161a',
        's3': '#1c1c22',
        border: '#26262d',
        'border-strong': '#36363f',
        text: '#ededee',
        muted: '#9b9ba3',
        subtle: '#6b6b73',
        axis: {
          DEFAULT: '#7c5cff',
          hover: '#8e72ff',
          soft: '#2a1e5c',
        },
        signal: { DEFAULT: '#5ee6a8', soft: '#0f3a26' },
        amber: { DEFAULT: '#d4985a', soft: '#3a2a14' },
        teal: { DEFAULT: '#5d9b8c', soft: '#143028' },
        warn: '#ffb84d',
        danger: '#ff5c5c',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        grotesk: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: { prose: '720px', site: '1280px' },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        marquee: 'marquee 32s linear infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
