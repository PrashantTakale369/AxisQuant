import tailwindPreset from '@axisquant/ui/tailwind-preset';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [tailwindPreset as Config],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
