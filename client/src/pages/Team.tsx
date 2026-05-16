import { useQuery } from '@tanstack/react-query';
import { Github, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

interface Member { _id: string; name: string; handle: string; title: string; bio: string; photoUrl?: string; focusAreas: string[]; links: Record<string, string>; }

export default function Team() {
  const { data, isLoading } = useQuery<Member[]>({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then(r => r.data),
  });

  return (
    <div className="aq-container py-16">
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">People</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Team</h1>
        <p className="text-muted text-lg max-w-xl">The researchers and engineers behind AxisQuant.</p>
      </div>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-52 bg-s2 rounded-xl animate-pulse" />)}</div>
      ) : !data?.length ? (
        <div className="text-center py-24 text-muted"><p className="text-4xl mb-3">👥</p><p>Team profiles coming soon.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((m) => (
            <div key={m._id} className="card flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.name} className="size-14 rounded-full object-cover border-2 border-border" />
                ) : (
                  <div className="size-14 rounded-full bg-s2 border-2 border-border flex items-center justify-center text-xl font-display">
                    {m.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-text">{m.name}</h3>
                  <p className="text-sm text-muted">{m.title}</p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed">{m.bio}</p>
              {m.focusAreas?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {m.focusAreas.map(f => <span key={f} className="tag-default text-xs">{f}</span>)}
                </div>
              )}
              <div className="flex gap-2 mt-auto">
                {m.links?.github && <a href={m.links.github} target="_blank" rel="noreferrer" className="btn-ghost p-2"><Github size={15} /></a>}
                {m.links?.hf && <a href={m.links.hf} target="_blank" rel="noreferrer" className="btn-ghost p-2 text-xs">HF</a>}
                {m.links?.website && <a href={m.links.website} target="_blank" rel="noreferrer" className="btn-ghost p-2"><ExternalLink size={15} /></a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
