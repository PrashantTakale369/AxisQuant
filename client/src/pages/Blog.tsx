import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

interface Post { _id: string; title: string; slug: string; abstract?: string; authors: { name: string }[]; publishedAt: string; topics: string[]; }

export default function Blog() {
  const { data, isLoading } = useQuery({
    queryKey: ['publications', 'blog'],
    queryFn: () => api.get('/publications?kind=blog&limit=20').then(r => r.data),
  });

  return (
    <div className="aq-container py-16">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">Engineering notes</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Blog</h1>
        <p className="text-muted text-lg max-w-2xl">Shorter-form writing: tutorials, findings, post-mortems, and announcements.</p>
      </div>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-s2 rounded-xl animate-pulse" />)}</div>
      ) : !data?.docs?.length ? (
        <div className="text-center py-24 text-muted"><p className="text-4xl mb-3">✍️</p><p>No posts yet. Check back soon.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.docs.map((p: Post) => (
            <Link key={p._id} to={`/blog/${p.slug}`} className="card group flex flex-col gap-3 hover:border-axis/40">
              <div className="flex flex-wrap gap-1.5">
                {p.topics.slice(0, 2).map(t => <span key={t} className="tag-default text-xs">{t}</span>)}
              </div>
              <h2 className="font-semibold text-text group-hover:text-axis transition-colors leading-snug">{p.title}</h2>
              {p.abstract && <p className="text-sm text-muted line-clamp-3">{p.abstract}</p>}
              <p className="text-xs text-subtle mt-auto">{new Date(p.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
