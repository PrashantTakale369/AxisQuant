import { useQuery } from '@tanstack/react-query';
import { Download, Heart, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

interface HFDataset { id: string; datasetId?: string; downloads: number; likes: number; tags: string[]; lastModified: string; }

export default function Datasets() {
  const { data, isLoading } = useQuery<HFDataset[]>({
    queryKey: ['hf-datasets'],
    queryFn: () => api.get('/hf/datasets').then(r => r.data),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <div className="aq-container py-16">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">Hugging Face</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Datasets</h1>
        <p className="text-muted text-lg max-w-2xl">High-quality datasets built and released openly by AxisQuant.</p>
      </div>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card animate-pulse h-36 bg-s2" />)}</div>
      ) : !data?.length ? (
        <div className="text-center py-24 text-muted">
          <p className="text-4xl mb-3">📦</p>
          <p>No datasets yet. <a href="https://huggingface.co/AxisQuant" className="text-text underline underline-offset-2" target="_blank" rel="noreferrer">Check Hugging Face ↗</a></p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((d) => (
            <a key={d.id || d.datasetId} href={`https://huggingface.co/datasets/${d.datasetId || d.id}`}
              target="_blank" rel="noreferrer" className="card group flex flex-col gap-3 hover:border-text/30">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-mono text-sm text-text break-all">{d.datasetId || d.id}</h3>
                <ExternalLink size={14} className="text-muted shrink-0 mt-0.5" />
              </div>
              <div className="flex flex-wrap gap-1.5">{d.tags?.slice(0, 3).map((t: string) => <span key={t} className="tag-default text-xs">{t}</span>)}</div>
              <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border text-xs text-muted">
                <span className="flex items-center gap-1"><Download size={12} />{d.downloads?.toLocaleString?.() ?? 0}</span>
                <span className="flex items-center gap-1"><Heart size={12} />{d.likes ?? 0}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
