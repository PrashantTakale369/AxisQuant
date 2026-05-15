/**
 * Single source of truth for site-wide config.
 * Imported by header, footer, sitemap, OG generation, JSON-LD.
 */

export const siteConfig = {
  name: 'AxisQuant',
  shortName: 'AxisQuant',
  description:
    'AI research and engineering lab focused on model quantization, optimization, and efficient deployment of large language models.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // External org slugs — answered during planning
  hf: {
    org: 'AxisQuant',
    url: 'https://huggingface.co/AxisQuant',
  },
  github: {
    org: 'AxisQuant',
    url: 'https://github.com/AxisQuant',
  },

  contact: {
    email: 'research@axisquant.org',
  },

  social: [
    { name: 'Hugging Face', href: 'https://huggingface.co/AxisQuant' },
    { name: 'GitHub', href: 'https://github.com/AxisQuant' },
  ],

  // Primary navigation surface — every section is its own module per the plan
  primaryNav: [
    { label: 'Research', href: '/research' },
    { label: 'Models', href: '/models' },
    { label: 'Datasets', href: '/datasets' },
    { label: 'Benchmarks', href: '/benchmarks' },
    { label: 'Demos', href: '/demos' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ],

  footerNav: {
    Lab: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Open source', href: '/open-source' },
      { label: 'Contact', href: '/contact' },
    ],
    Work: [
      { label: 'Research', href: '/research' },
      { label: 'Models', href: '/models' },
      { label: 'Datasets', href: '/datasets' },
      { label: 'Benchmarks', href: '/benchmarks' },
    ],
    Connect: [
      { label: 'Hugging Face', href: 'https://huggingface.co/AxisQuant' },
      { label: 'GitHub', href: 'https://github.com/AxisQuant' },
      { label: 'Blog', href: '/blog' },
      { label: 'RSS', href: '/blog/rss.xml' },
    ],
  },

  focusAreas: [
    {
      title: 'Quantization',
      summary:
        'Compressing large language models into int4, int8, and fp8 formats — GPTQ, AWQ, GGUF, EXL2 — without sacrificing capability.',
    },
    {
      title: 'Fine-tuning',
      summary:
        'Specializing models for real-world tasks. Curating data, designing curricula, evaluating regressions across capabilities.',
    },
    {
      title: 'Datasets',
      summary:
        'Building and releasing high-quality datasets — instruction, reasoning, multilingual, domain-specific.',
    },
    {
      title: 'Open research',
      summary:
        'Publishing models, datasets, and methodology openly. Reproducibility is part of the contribution.',
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
