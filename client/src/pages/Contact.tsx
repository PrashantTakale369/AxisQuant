import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

type Kind = 'partnership' | 'hiring' | 'general';
interface FormData { name: string; email: string; org?: string; message: string; }

const tabs: { id: Kind; label: string; hint: string }[] = [
  { id: 'partnership', label: 'Partnership', hint: 'Research collaboration, model access, enterprise integration.' },
  { id: 'hiring', label: 'Hiring', hint: 'Join the team. Researchers, engineers, and infra builders welcome.' },
  { id: 'general', label: 'General', hint: 'Anything else: questions, feedback, citations, ideas.' },
];

export default function Contact() {
  const [kind, setKind] = useState<Kind>('general');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await api.post('/contact', { ...data, kind });
      setSent(true);
      reset();
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="aq-container py-16 max-w-3xl">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">Get in touch</p>
        <h1 className="text-5xl font-semibold tracking-tight mb-4">Contact</h1>
        <p className="text-muted text-lg">We respond to everything. Usually within a few days.</p>
      </div>

      <div className="flex gap-1 mb-8 p-1 bg-s2 rounded-xl border border-border w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setKind(t.id)}
            className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-colors',
              kind === t.id ? 'bg-axis text-white shadow-sm' : 'text-muted hover:text-text')}>
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted mb-8">{tabs.find(t => t.id === kind)?.hint}</p>

      {sent ? (
        <div className="card border-signal/30 bg-signal/5 text-center py-12">
          <p className="text-2xl mb-3">✓</p>
          <p className="font-semibold text-text mb-1">Message sent</p>
          <p className="text-sm text-muted">We'll be in touch soon at the email you provided.</p>
          <button onClick={() => setSent(false)} className="btn-ghost mt-4 text-sm">Send another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Name *</label>
              <input {...register('name', { required: true })} className={cn('input', errors.name && 'border-danger')} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input {...register('email', { required: true, pattern: /^\S+@\S+$/ })} className={cn('input', errors.email && 'border-danger')} placeholder="you@example.com" type="email" />
            </div>
          </div>
          <div>
            <label className="label">Organization</label>
            <input {...register('org')} className="input" placeholder="Lab / company (optional)" />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea {...register('message', { required: true, minLength: 20 })}
              className={cn('input min-h-36 resize-y', errors.message && 'border-danger')}
              placeholder="Tell us what's on your mind…" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  );
}
