import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

const TOPICS = ['All', 'quantization', 'fine-tuning', 'datasets', 'infra', 'evals'];

interface Publication { _id: string; title: string; slug: string; kind: string; abstract?: string; authors: { name: string }[]; publishedAt: string; topics: string[]; }

export default function Research() {
  const [topic, setTopic] = useState('All');
  const { data, isLoading } = useQuery({
    queryKey: ['publications', 'research', topic],
    queryFn: () => api.get(`/publications?kind=research${topic !== 'All' ? `&topic=${topic}` : ''}&limit=20`).then(r => r.data),
  });

  return (
    <div className="aq-container py-16">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">Publications</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Research</h1>
        <p className="text-muted text-lg max-w-2xl">Technical papers, findings, and methodology from the AxisQuant lab.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-10">
        {TOPICS.map(t => (
          <button key={t} onClick={() => setTopic(t)}
            className={cn('tag cursor-pointer', topic === t ? 'tag-axis' : 'tag-default hover:border-border-strong')}>
            {t}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-s2 rounded-xl animate-pulse" />)}</div>
      ) : !data?.docs?.length ? (
        <div className="text-center py-24 text-muted"><p className="text-4xl mb-3">📄</p><p>No research published yet. Check back soon.</p></div>
      ) : (
        <div className="space-y-4">
          {data.docs.map((p: Publication) => (
            <Link key={p._id} to={`/research/${p.slug}`}
              className="card group flex flex-col sm:flex-row gap-4 hover:border-axis/40">
              <div className="flex-1">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.topics.map(t => <span key={t} className="tag-axis text-xs">{t}</span>)}
                </div>
                <h2 className="font-semibold text-lg text-text group-hover:text-axis transition-colors mb-1.5 leading-snug">{p.title}</h2>
                {p.abstract && <p className="text-sm text-muted line-clamp-2">{p.abstract}</p>}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-subtle">{new Date(p.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                {p.authors.length > 0 && <p className="text-xs text-muted mt-1">{p.authors.map(a => a.name).join(', ')}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
