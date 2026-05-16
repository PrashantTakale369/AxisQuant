import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { api } from '@/lib/api';

interface HFModel {
  modelId: string;
  id: string;
  tags: string[];
}

const FT_KEYWORDS = ['instruct', 'sft', 'chat', 'reasoning', 'code', 'coder', 'math', 'multilingual'];
const QUANT_KEYWORDS = ['gptq', 'awq', 'gguf', 'bnb', 'fp8', 'int4', 'int8', 'nf4', 'quant'];

const hasAny = (m: HFModel, list: string[]) => {
  const hay = `${m.modelId ?? ''} ${m.id ?? ''} ${(m.tags ?? []).join(' ')}`.toLowerCase();
  return list.some((k) => hay.includes(k));
};

export default function Models() {
  const { data } = useQuery<HFModel[]>({
    queryKey: ['hf-models'],
    queryFn: () => api.get('/hf/models').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const quantizedCount = data?.filter((m) => hasAny(m, QUANT_KEYWORDS)).length ?? 0;
  const finetunedCount = data?.filter((m) => hasAny(m, FT_KEYWORDS)).length ?? 0;

  const branches = [
    {
      to: '/models/quantized',
      label: 'Quantized Models',
      tagline: 'Smaller, faster, same capability',
      count: quantizedCount,
      cardBg: 'bg-gradient-to-br from-surface via-surface to-amber-soft/40',
      borderHover: 'hover:border-amber/70',
      ringHover: 'focus-visible:ring-amber/50',
      titleColor: 'text-amber',
      description:
        'Foundation models compressed to lower bit-widths using GPTQ, AWQ, GGUF, BNB, and FP8. Run state-of-the-art models on consumer GPUs, CPUs, and edge devices.',
    },
    {
      to: '/models/finetuned',
      label: 'Fine-tuned Models',
      tagline: 'Specialized for real tasks',
      count: finetunedCount,
      cardBg: 'bg-gradient-to-br from-surface via-surface to-teal-soft/40',
      borderHover: 'hover:border-teal/70',
      ringHover: 'focus-visible:ring-teal/50',
      titleColor: 'text-teal',
      description:
        'Foundation models adapted to specific domains and tasks. Reasoning, code, instruction following, multilingual, and vertical specializations with full training methodology.',
    },
  ];

  return (
    <div className="aq-container py-16">
      <div className="mb-10 max-w-3xl">
        <h1 className="font-display text-5xl md:text-6xl font-medium tracking-tight mb-5 text-amber leading-[1.05]">
          Models
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          AxisQuant ships two families of open-weight models. Pick the branch that matches what you
          want to build.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <Link
            key={b.to}
            to={b.to}
            className={`group relative ${b.cardBg} border border-border rounded-2xl p-9 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1 ${b.borderHover} hover:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 ${b.ringHover}`}
          >
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <p className={`text-xs font-mono uppercase tracking-[0.18em] ${b.titleColor}`}>
                {b.tagline}
              </p>
              <p className="font-mono text-xs text-muted tabular-nums">
                {b.count} {b.count === 1 ? 'release' : 'releases'}
              </p>
            </div>

            <h2 className={`font-display text-3xl md:text-4xl font-medium tracking-tight ${b.titleColor} mb-5 transition-transform duration-300 group-hover:translate-x-0.5`}>
              {b.label}
            </h2>

            <p className="text-muted leading-relaxed mb-8">{b.description}</p>

            {/* Small interactive Explore pill, centered */}
            <div className="mt-auto flex justify-center pt-4">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-signal/40 bg-signal-soft/40 text-signal text-sm font-semibold tracking-tight transition-all duration-300 group-hover:bg-signal group-hover:text-bg group-hover:border-signal group-hover:shadow-[0_0_24px_-4px_rgba(94,230,168,0.5)] group-hover:-translate-y-0.5">
                Explore
                <ArrowDown
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-y-0.5 animate-[bounce_2s_ease-in-out_infinite]"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
