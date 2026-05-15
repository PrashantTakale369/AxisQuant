import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--aq-font-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--aq-font-display',
  axes: ['opsz', 'SOFT', 'WONK'],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--aq-font-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'AxisQuant — AI research lab for model quantization',
    template: '%s · AxisQuant',
  },
  description:
    'AxisQuant is an AI research and engineering lab focused on model quantization, optimization, and efficient deployment of large language models.',
  applicationName: 'AxisQuant',
  authors: [{ name: 'AxisQuant' }],
  keywords: [
    'AI',
    'quantization',
    'LLM',
    'large language models',
    'fine-tuning',
    'machine learning',
    'open source',
    'Hugging Face',
    'AxisQuant',
  ],
  openGraph: {
    type: 'website',
    title: 'AxisQuant',
    description:
      'AI research and engineering lab focused on model quantization, optimization, and efficient deployment.',
    siteName: 'AxisQuant',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AxisQuant',
    description: 'AI research lab for model quantization and efficient deployment.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetBrainsMono.variable}`}
    >
      <body className="bg-bg text-text antialiased min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
