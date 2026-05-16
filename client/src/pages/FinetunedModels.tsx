import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Download, Heart, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

interface Domain {
  id: string;
  label: string;
  tagline: string;
  description: string;
  baseModels: string;
  bestFor: string;
  keywords: string[];
}

const DOMAINS: Domain[] = [
  {
    id: 'All',
    label: 'All Fine-tunes',
    tagline: 'Every specialized release',
    description: 'The full catalog of AxisQuant fine-tuned models across reasoning, coding, instruction following, multilingual, and domain-specific tasks.',
    baseModels: 'Llama, Mistral, Qwen, Gemma',
    bestFor: 'Browsing the full lineup',
    keywords: [],
  },
  {
    id: 'Instruct',
    label: 'Instruction',
    tagline: 'Helpful assistants',
    description: 'Models fine-tuned to follow instructions, answer questions, and hold helpful conversations. Trained on curated SFT and DPO datasets covering diverse task types.',
    baseModels: 'Llama, Mistral, Qwen base',
    bestFor: 'Chat assistants, agents',
    keywords: ['instruct', 'sft', 'chat'],
  },
  {
    id: 'Reasoning',
    label: 'Reasoning',
    tagline: 'Chain-of-thought capable',
    description: 'Fine-tunes optimized for multi-step reasoning, math, and analytical tasks. Trained with reasoning traces and reward modeling to improve long-form thinking.',
    baseModels: 'Llama, Qwen, DeepSeek base',
    bestFor: 'Math, logic, agentic tasks',
    keywords: ['reasoning', 'math', 'cot'],
  },
  {
    id: 'Code',
    label: 'Code',
    tagline: 'Programming-specialized',
    description: 'Models fine-tuned on high-quality code corpora across multiple languages. Optimized for completion, refactoring, and explaining code.',
    baseModels: 'CodeLlama, Qwen, StarCoder',
    bestFor: 'IDE assistants, code review',
    keywords: ['code', 'coder', 'instruct-code'],
  },
  {
    id: 'Multilingual',
    label: 'Multilingual',
    tagline: 'Cross-language coverage',
    description: 'Fine-tunes that extend or balance multilingual capability. Trained on curated multilingual datasets to improve coverage in non-English languages.',
    baseModels: 'Llama, Qwen, Aya',
    bestFor: 'Localization, translation',
    keywords: ['multilingual', 'lang', 'translate'],
  },
  {
    id: 'Domain',
    label: 'Domain-specific',
    tagline: 'Vertical specialization',
    description: 'Fine-tunes adapted for specific verticals like finance, legal, healthcare, or scientific literature. Built with curated domain corpora and rigorous evaluation.',
    baseModels: 'Llama, Mistral base',
    bestFor: 'Vertical applications',
    keywords: ['finance', 'legal', 'medical', 'science', 'domain'],
  },
];

interface HFModel {
  id: string;
  modelId: string;
  downloads: number;
  likes: number;
  tags: string[];
  lastModified: string;
}

const matchesDomain = (m: HFModel, domain: Domain) => {
  if (domain.id === 'All') return true;
  const haystack = `${m.modelId ?? ''} ${m.id ?? ''} ${(m.tags ?? []).join(' ')}`.toLowerCase();
  return domain.keywords.some((k) => haystack.includes(k.toLowerCase()));
};

export default function FinetunedModels() {
  const [domainId, setDomainId] = useState('All');
  const { data, isLoading } = useQuery<HFModel[]>({
    queryKey: ['hf-models'],
    queryFn: () => api.get('/hf/models').then((r) => r.data),
    staleTime: 60 * 60 * 1000,
  });

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    DOMAINS.forEach((d) => {
      out[d.id] = data?.filter((m) => matchesDomain(m, d)).length ?? 0;
    });
    return out;
  }, [data]);

  const selected = DOMAINS.find((d) => d.id === domainId)!;
  const filtered = data?.filter((m) => matchesDomain(m, selected)) ?? [];

  return (
    <div className="aq-container py-16">
      <Link to="/models" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Models
      </Link>

      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">Specialized releases</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Fine-tuned Models</h1>
        <p className="text-muted text-lg max-w-2xl">
          Foundation models adapted to specific tasks and domains. Every release ships with training
          methodology, evaluation results, and recommended usage.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* LEFT: Domain panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-3">
            Specialization
          </p>
          <div className="border border-border rounded-xl bg-surface overflow-hidden">
            {DOMAINS.map((d, i) => {
              const active = d.id === domainId;
              return (
                <button
                  key={d.id}
                  onClick={() => setDomainId(d.id)}
                  className={cn(
                    'w-full text-left px-4 py-3.5 transition-colors flex items-center justify-between gap-3 group',
                    i !== 0 && 'border-t border-border',
                    active
                      ? 'bg-s2 text-text'
                      : 'hover:bg-s2/60 text-muted hover:text-text'
                  )}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-sm font-semibold tracking-tight text-text">
                      {d.label}
                    </span>
                    <span className="text-xs text-subtle truncate">{d.tagline}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'font-mono text-xs px-1.5 py-0.5 rounded tabular-nums',
                        active
                          ? 'bg-text text-bg'
                          : 'bg-s2 text-muted group-hover:bg-border'
                      )}
                    >
                      {counts[d.id] ?? 0}
                    </span>
                    <ChevronRight
                      size={14}
                      className={cn(
                        'transition-transform',
                        active ? 'text-text translate-x-0.5' : 'text-subtle'
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <a
            href="https://huggingface.co/AxisQuant"
            target="_blank"
            rel="noreferrer"
            className="btn-outline w-full mt-4 text-xs justify-center gap-1.5"
          >
            View org on Hugging Face <ExternalLink size={12} />
          </a>
        </aside>

        {/* RIGHT: Domain info + model grid */}
        <main className="min-w-0">
          <div className="border border-border rounded-xl bg-surface p-7 mb-8">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-1.5">
                  {selected.tagline}
                </p>
                <h2 className="font-display text-3xl font-medium tracking-tight">
                  {selected.label}
                </h2>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded border border-border text-muted tabular-nums">
                {filtered.length} {filtered.length === 1 ? 'model' : 'models'}
              </span>
            </div>
            <p className="text-muted leading-relaxed mb-5 max-w-3xl">{selected.description}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border border-border rounded-lg p-3 bg-bg/40">
                <p className="text-[10px] font-mono uppercase tracking-widest text-subtle mb-1">
                  Base models
                </p>
                <p className="font-mono text-sm text-text">{selected.baseModels}</p>
              </div>
              <div className="border border-border rounded-lg p-3 bg-bg/40">
                <p className="text-[10px] font-mono uppercase tracking-widest text-subtle mb-1">
                  Best for
                </p>
                <p className="text-sm text-text">{selected.bestFor}</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-40 bg-s2" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl py-16 text-center text-muted">
              <p className="text-4xl mb-3">🎯</p>
              <p className="mb-1">No {selected.label} fine-tunes published yet.</p>
              <p className="text-sm text-subtle">
                Visit the{' '}
                <a
                  href="https://huggingface.co/AxisQuant"
                  className="text-text underline underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  AxisQuant org page
                </a>{' '}
                for the latest releases.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {filtered.map((m) => (
                <a
                  key={m.id || m.modelId}
                  href={`https://huggingface.co/${m.modelId || m.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="card group flex flex-col gap-3 hover:border-text/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-sm text-text break-all leading-relaxed">
                      {m.modelId || m.id}
                    </h3>
                    <ExternalLink size={14} className="text-muted mt-0.5 shrink-0" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags?.slice(0, 4).map((t) => (
                      <span key={t} className="tag-default text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Download size={12} /> {m.downloads?.toLocaleString?.() ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} /> {m.likes ?? 0}
                    </span>
                    <span className="ml-auto">
                      {m.lastModified
                        ? new Date(m.lastModified).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
