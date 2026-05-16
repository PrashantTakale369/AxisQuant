import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

export default function ArticleDetail({ kind }: { kind: 'research' | 'blog' }) {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['publication', slug],
    queryFn: () => api.get(`/publications/${slug}`).then(r => r.data),
    enabled: !!slug,
  });

  if (isLoading) return (
    <div className="aq-container py-16 max-w-prose mx-auto">
      <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className={`h-4 bg-s2 rounded animate-pulse ${i === 0 ? 'w-2/3' : i === 1 ? 'w-full' : 'w-5/6'}`} />)}</div>
    </div>
  );

  if (isError || !data) return (
    <div className="aq-container py-24 text-center text-muted">
      <p className="text-4xl mb-3">📄</p>
      <p className="mb-6">Article not found.</p>
      <Link to={kind === 'research' ? '/research' : '/blog'} className="btn-secondary">← Back</Link>
    </div>
  );

  return (
    <div className="aq-container py-12">
      <Link to={kind === 'research' ? '/research' : '/blog'} className="btn-ghost gap-2 mb-10 -ml-2 inline-flex">
        <ArrowLeft size={15} /> Back to {kind === 'research' ? 'Research' : 'Blog'}
      </Link>
      <article className="max-w-prose mx-auto">
        <div className="flex flex-wrap gap-1.5 mb-5">
          {data.topics?.map((t: string) => <span key={t} className="tag-axis text-xs">{t}</span>)}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight mb-6">{data.title}</h1>
        {data.abstract && <p className="text-lg text-muted border-l-2 border-axis pl-5 mb-8 italic">{data.abstract}</p>}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-10 pb-8 border-b border-border">
          {data.authors?.length > 0 && (
            <span>By {data.authors.map((a: { name: string }) => a.name).join(', ')}</span>
          )}
          <span>{new Date(data.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {data.arxivUrl && <a href={data.arxivUrl} target="_blank" rel="noreferrer" className="text-axis hover:underline">arXiv ↗</a>}
          {data.githubUrl && <a href={data.githubUrl} target="_blank" rel="noreferrer" className="text-axis hover:underline">GitHub ↗</a>}
        </div>
        <div className="aq-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
