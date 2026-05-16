import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Download, Heart, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

interface Method {
  id: string;
  label: string;
  tagline: string;
  description: string;
  bits: string;
  bestFor: string;
}

const METHODS: Method[] = [
  {
    id: 'All',
    label: 'All Models',
    tagline: 'Every quantized release',
    description: 'The full catalog of AxisQuant quantized releases across all formats including GPTQ, AWQ, GGUF, BNB, and FP8 variants of the models we ship.',
    bits: 'mixed',
    bestFor: 'Browsing the full lineup',
  },
  {
    id: 'GPTQ',
    label: 'GPTQ',
    tagline: 'Optimal weight rounding',
    description: 'Post-training quantization that uses second-order error information and per-column optimal rounding to compress weights to 3, 4, or 8 bits with minimal accuracy loss. Pairs well with vLLM and AutoGPTQ runtimes.',
    bits: '3 / 4 / 8-bit',
    bestFor: 'Datacenter GPUs (A100, H100)',
  },
  {
    id: 'AWQ',
    label: 'AWQ',
    tagline: 'Activation-aware quantization',
    description: 'Activation-aware Weight Quantization. Protects the ~1% of weights that matter most for activations and quantizes the rest aggressively. Excellent perplexity and throughput tradeoff at 4-bit.',
    bits: '4-bit',
    bestFor: 'Inference servers, batched serving',
  },
  {
    id: 'GGUF',
    label: 'GGUF',
    tagline: 'CPU and Apple Silicon native',
    description: 'GGML Universal Format used by llama.cpp. Runs efficiently on CPU, Metal (Apple Silicon), CUDA, and ROCm via a single file. Multiple quant levels per release (Q2_K to Q8_0).',
    bits: 'Q2_K to Q8_0',
    bestFor: 'Local inference, laptops, edge',
  },
  {
    id: 'BNB',
    label: 'BNB',
    tagline: 'Hugging Face native',
    description: 'bitsandbytes int8 and NF4 quantization. Works seamlessly with the Transformers library through `load_in_4bit` and `load_in_8bit`. The easiest path from full-precision to quantized.',
    bits: 'int8 / NF4',
    bestFor: 'Quick experiments, fine-tuning',
  },
  {
    id: 'FP8',
    label: 'FP8',
    tagline: 'Hopper-class precision',
    description: '8-bit floating point (E4M3 and E5M2). Preserves dynamic range better than int8 by keeping a mantissa and exponent split. Targets H100, MI300X, and other FP8-capable accelerators.',
    bits: 'E4M3 / E5M2',
    bestFor: 'H100 / MI300X production',
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

const matchesMethod = (m: HFModel, methodId: string) => {
  if (methodId === 'All') return true;
  const needle = methodId.toLowerCase();
  return (
    m.modelId?.toLowerCase().includes(needle) ||
    m.id?.toLowerCase().includes(needle) ||
    m.tags?.some((t) => t.toLowerCase().includes(needle))
  );
};

export default function QuantizedModels() {
  const [methodId, setMethodId] = useState('All');
  const { data, isLoading } = useQuery<HFModel[]>({
    queryKey: ['hf-models'],
    queryFn: () => api.get('/hf/models').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    METHODS.forEach((m) => {
      out[m.id] = data?.filter((mod) => matchesMethod(mod, m.id)).length ?? 0;
    });
    return out;
  }, [data]);

  const selected = METHODS.find((m) => m.id === methodId)!;
  const filtered = data?.filter((m) => matchesMethod(m, methodId)) ?? [];

  return (
    <div className="aq-container py-16">
      <Link to="/models" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Models
      </Link>

      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">Compressed releases</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Quantized Models</h1>
        <p className="text-muted text-lg max-w-2xl">
          Models compressed to lower bit-widths with negligible accuracy loss, optimized for efficient
          inference across server GPUs, consumer hardware, and edge devices.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* LEFT: Filter panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-3">
            Quantization method
          </p>
          <div className="border border-border rounded-xl bg-surface overflow-hidden">
            {METHODS.map((m, i) => {
              const active = m.id === methodId;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethodId(m.id)}
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
                      {m.label}
                    </span>
                    <span className="text-xs text-subtle truncate">{m.tagline}</span>
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
                      {counts[m.id] ?? 0}
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

        {/* RIGHT: Selected method info + model grid */}
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
                  Precision
                </p>
                <p className="font-mono text-sm text-text">{selected.bits}</p>
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
              <p className="text-4xl mb-3">⚗️</p>
              <p className="mb-1">No {selected.label} models published yet.</p>
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
