import { useQuery } from '@tanstack/react-query';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

interface Repo { id: number; name: string; description: string; html_url: string; stargazers_count: number; forks_count: number; language: string; updated_at: string; topics: string[]; }

export default function OpenSource() {
  const { data, isLoading } = useQuery<Repo[]>({
    queryKey: ['github-repos'],
    queryFn: () => api.get('/github/repos').then(r => r.data),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <div className="aq-container py-16">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">GitHub</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Open Source</h1>
        <p className="text-muted text-lg max-w-2xl">All of our code is public. Contributions welcome.</p>
      </div>
      <div className="card mb-8 bg-s2 border-axis/20">
        <p className="text-sm text-muted mb-3">Cite AxisQuant in your work:</p>
        <pre className="text-xs text-text font-mono overflow-x-auto leading-relaxed">{`@misc{axisquant,
  author  = {AxisQuant},
  title   = {AxisQuant: AI Research Lab for Model Quantization},
  year    = {2024},
  url     = {https://github.com/PrashantTakale369/AxisQuant}
}`}</pre>
      </div>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 bg-s2 rounded-xl animate-pulse" />)}</div>
      ) : !data?.length ? (
        <div className="text-center py-24 text-muted">
          <p className="text-4xl mb-3">💻</p>
          <p><a href="https://github.com/PrashantTakale369/AxisQuant" target="_blank" rel="noreferrer" className="text-axis underline">View repos on GitHub ↗</a></p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {data.map((r) => (
            <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className="card group flex flex-col gap-3 hover:border-axis/40">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-mono text-sm text-axis group-hover:underline">{r.name}</h3>
                <ExternalLink size={14} className="text-muted shrink-0" />
              </div>
              {r.description && <p className="text-sm text-muted">{r.description}</p>}
              {r.topics?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">{r.topics.slice(0, 4).map(t => <span key={t} className="tag-default text-xs">{t}</span>)}</div>
              )}
              <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border text-xs text-muted">
                {r.language && <span className="text-signal">{r.language}</span>}
                <span className="flex items-center gap-1"><Star size={12} />{r.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork size={12} />{r.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
