import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, MessageSquare, Home } from 'lucide-react';
import { cn } from '@/lib/cn';

type NavItem = {
  label: string;
  to: string;
  ext?: boolean;
  icon?: 'home' | 'reddit' | 'discord' | 'github' | 'hf';
};

const links: NavItem[] = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Reddit', to: 'https://reddit.com/r/AxisQuant', ext: true, icon: 'reddit' },
  { label: 'Discord', to: 'https://discord.com/invite/DHkZNYUrB', ext: true, icon: 'discord' },
  { label: 'GitHub', to: 'https://github.com/PrashantTakale369/AxisQuant', ext: true, icon: 'github' },
  { label: 'Hugging Face', to: 'https://huggingface.co/AxisQuant', ext: true, icon: 'hf' },
];

function RedditGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12c0-1.38-1.12-2.5-2.5-2.5-.69 0-1.31.28-1.76.73C16.04 9.07 14 8.34 11.74 8.27l1-4.7 3.27.7c.04.79.69 1.42 1.49 1.42.83 0 1.5-.67 1.5-1.5S18.33 2.69 17.5 2.69c-.59 0-1.1.34-1.34.84l-3.66-.78a.5.5 0 0 0-.59.39l-1.13 5.31c-2.31.04-4.4.78-5.96 1.96A2.51 2.51 0 0 0 2 12c0 .94.52 1.76 1.29 2.18-.05.27-.08.55-.08.83 0 3.31 3.94 6 8.79 6s8.79-2.69 8.79-6c0-.28-.03-.56-.08-.83.77-.42 1.29-1.24 1.29-2.18zM7 13.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.33 15 8.5 15 7 14.33 7 13.5zm8.66 4.31c-1.06 1.06-3.09 1.14-3.66 1.14s-2.6-.08-3.66-1.14a.4.4 0 1 1 .57-.57c.67.67 2.1.91 3.09.91s2.42-.24 3.09-.91a.4.4 0 1 1 .57.57zM15.5 15c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

function GithubGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DiscordGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.07.07 0 0 0-.075.036c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.51 12.51 0 0 0-.617-1.25.077.077 0 0 0-.075-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.197.372.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function HFGlyph() {
  return (
    <span className="size-4 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
      <img src="/images/hf-logo.jpeg" alt="" className="w-full h-full object-cover" />
    </span>
  );
}

function NavIcon({ kind }: { kind: NavItem['icon'] }) {
  switch (kind) {
    case 'home':
      return <Home size={14} />;
    case 'reddit':
      return <RedditGlyph />;
    case 'discord':
      return <DiscordGlyph />;
    case 'github':
      return <GithubGlyph />;
    case 'hf':
      return <HFGlyph />;
    default:
      return <MessageSquare size={14} />;
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="aq-container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="size-9 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0 ring-1 ring-border transition-all duration-300 group-hover:ring-amber/60 group-hover:shadow-[0_0_16px_-2px_rgba(212,152,90,0.45)]">
            <img
              src="/images/icon.png"
              alt="AxisQuant"
              className="w-[78%] h-[78%] object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </span>
          <span className="font-display text-lg font-medium tracking-tight text-text group-hover:text-amber transition-colors duration-300">AxisQuant</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {links.map((l) => {
              const className = ({ isActive }: { isActive: boolean }) =>
                cn(
                  'group relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium tracking-tight transition-colors duration-200',
                  isActive ? 'text-amber' : 'text-text/85 hover:text-text'
                );
              const inner = (isActive: boolean) => (
                <>
                  <span
                    className={cn(
                      'absolute inset-0 rounded-md transition-all duration-300 -z-10',
                      isActive
                        ? 'bg-amber-soft/40'
                        : 'bg-s2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-1/2 -translate-x-1/2 bottom-1 h-[2px] rounded-full transition-all duration-300 ease-out',
                      isActive
                        ? 'w-5 bg-amber'
                        : 'w-0 bg-amber/80 group-hover:w-5'
                    )}
                  />
                  <span className="relative inline-flex items-center gap-1.5">
                    <NavIcon kind={l.icon} />
                    {l.label}
                  </span>
                </>
              );
              return l.ext ? (
                <a
                  key={l.label}
                  href={l.to}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium tracking-tight text-text/85 hover:text-text transition-colors duration-200"
                >
                  {inner(false)}
                </a>
              ) : (
                <NavLink key={l.label} to={l.to} end={l.to === '/'} className={className}>
                  {({ isActive }) => inner(isActive)}
                </NavLink>
              );
            })}
          </nav>
          <span className="block w-px h-5 bg-border mx-1" />
          <Link to="/about" className="btn-primary text-xs px-3.5 py-2">About</Link>
        </div>

        <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-bg">
          <nav className="aq-container py-4 flex flex-col gap-1">
            {links.map((l) =>
              l.ext ? (
                <a
                  key={l.label}
                  href={l.to}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-md text-sm font-medium text-text/90 hover:bg-s2 inline-flex items-center gap-2"
                >
                  <NavIcon kind={l.icon} />
                  {l.label}
                </a>
              ) : (
                <NavLink
                  key={l.label}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2.5 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2',
                      isActive ? 'text-amber bg-amber-soft/40' : 'text-text/90 hover:bg-s2'
                    )
                  }
                  onClick={() => setOpen(false)}
                >
                  <NavIcon kind={l.icon} />
                  {l.label}
                </NavLink>
              )
            )}

            <div className="pt-3 flex flex-col gap-2 border-t border-border mt-2">
              <Link to="/about" className="btn-primary text-sm" onClick={() => setOpen(false)}>About</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
