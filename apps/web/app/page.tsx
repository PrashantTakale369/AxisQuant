import { Badge, Button, Container } from '@axisquant/ui';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

/**
 * Phase 0 boot page.
 * Replaced in Phase 2 with the real Hero / FeaturedModels / LatestResearch / StatsBand composition.
 */
export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 aq-grid-bg opacity-40" aria-hidden />

      <Container className="flex min-h-screen flex-col justify-center py-24">
        <Badge variant="axis" className="mb-6 self-start">
          <span className="size-1.5 rounded-full bg-axis" /> Phase 0 — foundation
        </Badge>

        <h1 className="aq-display text-5xl tracking-tight md:text-7xl max-w-3xl">
          AxisQuant
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-text-muted leading-relaxed">
          {siteConfig.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/research">Research</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={siteConfig.hf.url} target="_blank" rel="noreferrer">
              Hugging Face
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/about">About the lab</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-md overflow-hidden border border-border">
          {siteConfig.focusAreas.map((area) => (
            <div key={area.title} className="bg-surface p-5">
              <div className="text-xs font-mono uppercase tracking-wide text-text-subtle mb-2">
                {area.title}
              </div>
              <div className="text-sm text-text leading-snug">{area.summary}</div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
