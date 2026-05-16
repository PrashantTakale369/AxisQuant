import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const links = [
  { label: 'Models', to: '/models', ext: false },
  { label: 'Datasets', to: '/datasets', ext: false },
  { label: 'Research', to: '/research', ext: false },
  { label: 'Blog', to: '/blog', ext: false },
  { label: 'About', to: '/about', ext: false },
  { label: 'Contact', to: '/contact', ext: false },
  { label: 'Hugging Face', to: 'https://huggingface.co/AxisQuant', ext: true },
  { label: 'GitHub', to: 'https://github.com/PrashantTakale369/AxisQuant', ext: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="aq-container py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-6 rounded-full overflow-hidden bg-white shrink-0">
            <img src="/images/icon.png" alt="AxisQuant icon" className="w-full h-full object-cover" />
          </div>
          <span className="font-display text-sm font-medium text-text">AxisQuant</span>
          <span className="text-xs text-subtle ml-2 hidden sm:inline">© {new Date().getFullYear()}</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((l) =>
            l.ext ? (
              <a key={l.label} href={l.to} target="_blank" rel="noreferrer"
                className="text-xs text-muted hover:text-text transition-colors">
                {l.label} ↗
              </a>
            ) : (
              <Link key={l.label} to={l.to}
                className="text-xs text-muted hover:text-text transition-colors">
                {l.label}
              </Link>
            )
          )}
          <a href="https://github.com/PrashantTakale369/AxisQuant" target="_blank" rel="noreferrer"
            className="text-muted hover:text-text transition-colors" aria-label="GitHub">
            <Github size={14} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
