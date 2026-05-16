import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Box, Database, FileText } from 'lucide-react';
import { motion, useMotionValue, useMotionTemplate, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';

type AccentName = 'amber' | 'signal' | 'teal';

const accentMap: Record<AccentName, { text: string; bg: string; rgb: string }> = {
  amber: { text: 'text-amber', bg: 'bg-amber', rgb: '212, 152, 90' },
  signal: { text: 'text-signal', bg: 'bg-signal', rgb: '94, 230, 168' },
  teal: { text: 'text-teal', bg: 'bg-teal', rgb: '93, 155, 140' },
};

function AnimatedStat({
  label,
  value,
  icon,
  accent,
  fill,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent: AccentName;
  fill: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  const count = useMotionValue(0);
  const display = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, count]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const a = accentMap[accent];
  const background = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(${a.rgb}, 0.18), transparent 60%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variants={popReveal}
      className="relative overflow-hidden border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md px-8 py-9 group transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5"
    >
      {/* Mouse-tracking spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ background, opacity: hovered ? 1 : 0 }}
      />
      {/* Top corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: `rgb(${a.rgb})` }} />

      <div className="relative flex flex-col items-center text-center">
        <div className={`flex items-center justify-center gap-2 mb-5 ${a.text}`}>
          {icon}
          <span className="text-[11px] font-mono uppercase tracking-[0.22em]">
            {label}
          </span>
        </div>
        <motion.div className="font-mono text-5xl md:text-6xl font-semibold text-text tabular-nums leading-none">
          {display}
        </motion.div>
        {/* Animated activity bar with pulsing tip — only shown when value > 0 */}
        {value > 0 && (
          <div className="mt-6 h-1 bg-bg/60 rounded-full overflow-hidden w-full max-w-[240px]">
            <motion.div
              className={`h-full ${a.bg} relative`}
              initial={{ width: 0 }}
              whileInView={{ width: `${fill}%` }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className={`absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full ${a.bg} animate-pulse`}
                style={{ boxShadow: `0 0 10px rgba(${a.rgb}, 0.9)` }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const popReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 130, damping: 14, mass: 0.85 },
  },
};

const popStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

type FocusAccent = 'amber' | 'teal' | 'signal';

const focusAccentMap: Record<FocusAccent, {
  text: string; bg: string; rgb: string; chip: string;
  cardBg: string; borderHover: string; ringHover: string;
}> = {
  amber: {
    text: 'text-amber', bg: 'bg-amber', rgb: '212, 152, 90',
    chip: 'bg-amber-soft/40 text-amber border-amber/30',
    cardBg: 'bg-white/5 backdrop-blur-md',
    borderHover: 'hover:border-amber/50',
    ringHover: 'focus-visible:ring-amber/50',
  },
  teal: {
    text: 'text-teal', bg: 'bg-teal', rgb: '93, 155, 140',
    chip: 'bg-teal-soft/40 text-teal border-teal/30',
    cardBg: 'bg-white/5 backdrop-blur-md',
    borderHover: 'hover:border-teal/50',
    ringHover: 'focus-visible:ring-teal/50',
  },
  signal: {
    text: 'text-signal', bg: 'bg-signal', rgb: '94, 230, 168',
    chip: 'bg-signal-soft/40 text-signal border-signal/30',
    cardBg: 'bg-white/5 backdrop-blur-md',
    borderHover: 'hover:border-signal/50',
    ringHover: 'focus-visible:ring-signal/50',
  },
};

const focusAreas: { n: string; tagline: string; title: string; desc: string; tags: string[]; accent: FocusAccent }[] = [
  {
    n: '01',
    tagline: 'Smaller, faster models',
    title: 'Quantization',
    desc: 'Compressing LLMs into int4, int8, and fp8 with GPTQ, AWQ, GGUF, and EXL2, without sacrificing capability.',
    tags: ['GPTQ', 'AWQ', 'GGUF', 'FP8'],
    accent: 'amber',
  },
  {
    n: '02',
    tagline: 'Specialized for real tasks',
    title: 'Fine-tuning',
    desc: 'Specializing models for real-world tasks with curated data and robust evaluation pipelines.',
    tags: ['SFT', 'DPO', 'LoRA', 'Eval'],
    accent: 'teal',
  },
  {
    n: '03',
    tagline: 'Open, curated data',
    title: 'Datasets',
    desc: 'Building and releasing high-quality instruction, reasoning, and domain-specific datasets.',
    tags: ['Instruction', 'Reasoning', 'Multilingual'],
    accent: 'amber',
  },
  {
    n: '04',
    tagline: 'Reproducible research',
    title: 'Open Research',
    desc: 'Publishing models, datasets, and methodology openly. Reproducibility is part of the contribution.',
    tags: ['Papers', 'Code', 'Weights'],
    accent: 'amber',
  },
];

function FocusCard({
  title,
  desc,
  tags,
  accent,
}: {
  title: string;
  desc: string;
  tags: string[];
  accent: FocusAccent;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);
  const a = focusAccentMap[accent];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(${a.rgb}, 0.18), transparent 60%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variants={popReveal}
      className={`group relative overflow-hidden border border-white/10 rounded-2xl ${a.cardBg} p-9 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1 ${a.borderHover} hover:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)]`}
    >
      {/* Mouse-tracking spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ background, opacity: hovered ? 1 : 0 }}
      />

      <div className="relative flex flex-col h-full">
        <h3 className={`font-display text-3xl md:text-4xl font-medium tracking-tight ${a.text} mb-5 transition-transform duration-300 group-hover:translate-x-0.5`}>
          {title}
        </h3>

        <p className="text-muted leading-relaxed mb-6 max-w-md">{desc}</p>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/60">
          {tags.map((t) => (
            <span
              key={t}
              className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${a.chip}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface HFStats {
  models?: number;
  datasets?: number;
  spaces?: number;
  totalDownloads?: number;
}

interface PubsResp {
  docs?: { _id: string; slug: string; kind: string; title: string; abstract?: string; authors?: { name: string }[]; publishedAt: string; topics?: string[] }[];
  total?: number;
}

export default function Home() {
  const { data: stats } = useQuery<HFStats>({
    queryKey: ['hf-stats'],
    queryFn: () => api.get('/hf/stats').then((r) => r.data),
    staleTime: 60 * 60 * 1000,
  });

  const { data: publications } = useQuery<PubsResp>({
    queryKey: ['publications', 'featured'],
    queryFn: () => api.get('/publications?limit=3').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const { data: blogResp } = useQuery<PubsResp>({
    queryKey: ['publications', 'blog-count'],
    queryFn: () => api.get('/publications?kind=blog&limit=1').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const blogCount = blogResp?.total ?? 0;

  return (
    <div className="relative">
      {/* Static parallax background — image stays fixed, content scrolls over */}
      <div
        aria-hidden
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/images/background.png')" }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,11,0.62) 0%, rgba(10,10,11,0.72) 50%, rgba(10,10,11,0.85) 100%)',
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 aq-grid-bg opacity-15" />
        <div className="absolute -z-10 top-1/4 -left-40 size-[28rem] rounded-full bg-amber/10 blur-[120px]" />
        <div className="absolute -z-10 bottom-0 -right-40 size-[28rem] rounded-full bg-teal/10 blur-[120px]" />

        <div className="aq-container pt-20 md:pt-24 pb-14">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-12 items-center">
            {/* LEFT — content */}
            <div className="animate-fade-up">
              <h1 className="font-grotesk font-semibold tracking-[-0.035em] text-text leading-[1.05] mb-7 text-[clamp(2.5rem,5vw,4.5rem)]">
                Make{' '}
                <span className="text-red-500" style={{ textShadow: '0 0 24px rgba(239,68,68,0.45)' }}>
                  AI
                </span>{' '}
                <span className="text-amber" style={{ textShadow: '0 0 24px rgba(212,152,90,0.35)' }}>
                  faster
                </span>
                ,{' '}
                <span className="text-teal" style={{ textShadow: '0 0 24px rgba(93,155,140,0.35)' }}>
                  lighter
                </span>
                , and more{' '}
                <span className="text-amber" style={{ textShadow: '0 0 24px rgba(212,152,90,0.35)' }}>
                  accessible
                </span>
                .
              </h1>

              <p className="text-base md:text-lg text-muted max-w-xl leading-relaxed mb-6 font-light">
                An open research lab building quantized and fine-tuned models, ready
                to run on the hardware you already own.
              </p>
              <p className="text-sm md:text-base text-muted/80 max-w-xl leading-relaxed mb-14 font-light">
                Our mission is to make state-of-the-art AI accessible to everyone. We
                publish weights, training data, evaluation results, and methodology
                openly on Hugging Face so anyone can reproduce, deploy, and build
                on our work without a data center.
              </p>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <Link
                  to="/models"
                  className="group relative inline-flex items-center gap-3 pl-6 pr-2 py-1.5 rounded-full bg-text text-bg font-semibold tracking-tight transition-all duration-300 hover:bg-amber hover:shadow-[0_0_40px_-6px_rgba(212,152,90,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
                >
                  <span className="text-sm">Explore Models</span>
                  <span className="inline-flex items-center justify-center size-9 rounded-full bg-bg text-text transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-[-12deg]">
                    <ArrowRight size={16} />
                  </span>
                </Link>

                <a
                  href="https://huggingface.co/AxisQuant"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="AxisQuant on Hugging Face"
                  className="group inline-flex items-center gap-2.5 pr-4 pl-1.5 py-1.5 rounded-full border border-white/20 bg-white hover:border-amber/60 hover:shadow-[0_0_20px_-4px_rgba(212,152,90,0.4)] transition-all duration-300"
                >
                  <span className="size-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0 ring-1 ring-black/10">
                    <img src="/images/hf-logo.jpeg" alt="" className="w-full h-full object-cover" />
                  </span>
                  <span className="text-sm font-medium text-bg group-hover:text-amber transition-colors">
                    Hugging Face
                  </span>
                </a>

                <a
                  href="https://github.com/PrashantTakale369/AxisQuant"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="AxisQuant on GitHub"
                  className="group inline-flex items-center gap-2.5 pr-4 pl-1.5 py-1.5 rounded-full border border-white/20 bg-white hover:border-teal/60 hover:shadow-[0_0_20px_-4px_rgba(93,155,140,0.4)] transition-all duration-300"
                >
                  <span className="size-8 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0 ring-1 ring-black/10">
                    <img src="/images/github-logo.jpeg" alt="" className="w-full h-full object-cover" />
                  </span>
                  <span className="text-sm font-medium text-bg group-hover:text-teal transition-colors">
                    GitHub
                  </span>
                </a>
              </div>
            </div>

            {/* RIGHT — code preview card */}
            <div className="hidden lg:flex justify-end animate-fade-up" style={{ animationDelay: '120ms' }}>
              <div className="relative group w-full max-w-2xl mr-0">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber/40 via-teal/30 to-signal/40 opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative rounded-2xl border border-border bg-bg overflow-hidden shadow-2xl">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-s2">
                    <span className="size-2.5 rounded-full bg-danger/70" />
                    <span className="size-2.5 rounded-full bg-warn/70" />
                    <span className="size-2.5 rounded-full bg-signal/70" />
                    <span className="ml-auto text-[10px] font-mono text-subtle">python</span>
                    <span className="text-subtle/40 text-[10px] font-mono">·</span>
                    <span className="text-[10px] font-mono text-subtle uppercase tracking-widest">
                      quickstart.py
                    </span>
                  </div>
                  {/* Code body */}
                  <pre className="px-8 py-10 text-base md:text-[17px] font-mono leading-relaxed overflow-x-auto bg-bg">
                    <code>
                      <span className="text-subtle"># Run a quantized AxisQuant model</span>{'\n'}
                      <span className="text-amber">from</span>{' '}
                      <span className="text-text">transformers</span>{' '}
                      <span className="text-amber">import</span>{' '}
                      <span className="text-text">AutoModelForCausalLM</span>{'\n\n'}
                      <span className="text-text">model</span>{' '}
                      <span className="text-muted">=</span>{' '}
                      <span className="text-teal">AutoModelForCausalLM</span>
                      <span className="text-muted">.</span>
                      <span className="text-signal">from_pretrained</span>
                      <span className="text-muted">(</span>{'\n'}
                      {'    '}
                      <span className="text-amber">"AxisQuant/Qwen3.5-4B-INT8"</span>
                      <span className="text-muted">,</span>
                      {'\n    '}
                      <span className="text-text">device_map</span>
                      <span className="text-muted">=</span>
                      <span className="text-amber">"auto"</span>
                      <span className="text-muted">,</span>
                      {'\n'}
                      <span className="text-muted">)</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services — section heading + interactive cards */}
      <motion.section
        className="aq-container pt-16 pb-12"
        variants={popStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.15 }}
      >
        {/* Centered heading above cards */}
        <motion.div variants={popReveal} className="text-center mb-10">
          <h2 className="font-grotesk text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-text">
            Everything we ship, in one place
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/models', label: 'Models', img: '/images/section-models.png', accent: 'amber' },
            { to: '/datasets', label: 'Datasets', img: '/images/section-datasets.png', accent: 'teal' },
            { to: '/research', label: 'Research', img: '/images/section-research.png', accent: 'teal' },
            { to: '/blog', label: 'Blog', img: '/images/section-blog.png', accent: 'amber' },
          ].map((c) => {
            const sectionAccentMap: Record<string, { ring: string; text: string; glow: string }> = {
              amber: {
                ring: 'group-hover:ring-amber/70',
                text: 'group-hover:text-amber',
                glow: 'group-hover:shadow-[0_0_24px_-4px_rgba(212,152,90,0.5)]',
              },
              teal: {
                ring: 'group-hover:ring-teal/70',
                text: 'group-hover:text-teal',
                glow: 'group-hover:shadow-[0_0_24px_-4px_rgba(93,155,140,0.5)]',
              },
            };
            const a = sectionAccentMap[c.accent];
            return (
              <motion.div key={c.to} variants={popReveal}>
              <Link
                to={c.to}
                className="group relative border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md px-5 py-7 flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 overflow-hidden h-full"
              >
                {/* Logo in white circle */}
                <span className={`relative z-10 size-16 rounded-full overflow-hidden bg-white ring-2 ring-border transition-all duration-300 ${a.ring} ${a.glow} group-hover:scale-110 mb-4 flex items-center justify-center`}>
                  <img src={c.img} alt="" className="w-[68%] h-[68%] object-contain" />
                </span>

                {/* Label */}
                <h3 className={`relative z-10 font-grotesk font-bold text-text text-xl tracking-tight transition-colors duration-300 ${a.text}`}>
                  {c.label}
                </h3>

                {/* Hover arrow indicator */}
                <span className="relative z-10 mt-3 text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
                  Explore
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Live stats */}
      <motion.section
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
      >
        <div className="aq-container py-10">
          {/* Section header */}
          <div className="mb-10 text-center">
            <h2 className="font-grotesk text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-text">
              Open weights,{' '}
              <span className="text-amber" style={{ textShadow: '0 0 24px rgba(212,152,90,0.3)' }}>
                in the wild
              </span>
              .
            </h2>
          </div>

          {/* Stat cards (animated count-up + mouse-tracking spotlight) */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={popStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            <AnimatedStat
              label="Models"
              value={stats?.models ?? 0}
              icon={<Box size={16} />}
              accent="amber"
              fill={42}
            />
            <AnimatedStat
              label="Total Downloads"
              value={stats?.totalDownloads ?? 0}
              icon={<Download size={16} />}
              accent="amber"
              fill={28}
            />
            <AnimatedStat
              label="Datasets"
              value={stats?.datasets ?? 0}
              icon={<Database size={16} />}
              accent="teal"
              fill={18}
            />
            <AnimatedStat
              label="Blog Posts"
              value={blogCount}
              icon={<FileText size={16} />}
              accent="amber"
              fill={22}
            />
          </motion.div>

          {/* Live model name ticker */}
          <div className="mt-8 relative overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-sm py-3">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-transparent to-transparent z-10 pointer-events-none" />
            <div className="flex animate-marquee whitespace-nowrap font-mono text-xs text-muted gap-10">
              {[...Array(2)].map((_, dupIdx) => (
                <div key={dupIdx} className="flex gap-10 items-center shrink-0">
                  <a
                    href="https://huggingface.co/AxisQuant/Qwen3.5-4B-INT8"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-signal font-semibold hover:text-text transition-colors"
                  >
                    <span className="size-1.5 rounded-full bg-signal animate-pulse" />
                    AxisQuant/Qwen3.5-4B-INT8
                  </a>
                  <a
                    href="https://huggingface.co/AxisQuant/Qwen3.6-27b-gptq-int4"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-amber font-semibold hover:text-text transition-colors"
                  >
                    <span className="size-1.5 rounded-full bg-amber animate-pulse" />
                    AxisQuant/Qwen3.6-27b-gptq-int4
                  </a>
                  {[
                    'Llama-3-70B-AWQ',
                    'Mistral-Nemo-FP8',
                    'Gemma-2-9B-GGUF-Q4',
                    'DeepSeek-R1-AWQ',
                    'Phi-3-mini-bnb-4bit',
                    'Qwen2.5-Coder-32B-GPTQ',
                    'Llama-3.1-8B-FP8',
                  ].map((m) => (
                    <span key={`${dupIdx}-${m}`} className="inline-flex items-center gap-2">
                      <span className="size-1 rounded-full bg-signal/60" />
                      <span className="hover:text-text transition-colors">{m}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Focus areas — interactive cards */}
      <section className="aq-container py-14">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="mb-10 text-center"
        >
          <h2 className="font-grotesk text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-text">
            From research{' '}
            <span className="text-amber" style={{ textShadow: '0 0 24px rgba(212,152,90,0.3)' }}>
              to runtime
            </span>
            .
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={popStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
        >
          {focusAreas.map((f) => (
            <FocusCard key={f.title} {...f} />
          ))}
        </motion.div>
      </section>

      {/* Latest publications */}
      {publications?.docs && publications.docs.length > 0 && (
        <motion.section
          className="aq-container py-8 pb-16"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-amber mb-2">Latest</p>
              <h2 className="text-3xl font-semibold tracking-tight">Research & Writing</h2>
            </div>
            <Link to="/research" className="btn-ghost gap-1">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {publications.docs.map((p) => (
              <Link key={p._id} to={`/${p.kind === 'research' ? 'research' : 'blog'}/${p.slug}`} className="card group">
                <span className="tag-default text-xs mb-3 inline-block">{p.kind}</span>
                <h3 className="font-semibold text-text group-hover:text-amber transition-colors mb-2 leading-snug">{p.title}</h3>
                {p.abstract && <p className="text-sm text-muted line-clamp-2 mb-3">{p.abstract}</p>}
                <p className="text-xs text-subtle">{new Date(p.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* CTA */}
      <motion.section
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="aq-container py-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight mb-4">
            Build with our models.
          </h2>
          <p className="text-muted text-lg mb-8 max-w-md mx-auto">
            All models, datasets, and research are openly published on Hugging Face.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="https://huggingface.co/AxisQuant" target="_blank" rel="noreferrer" className="btn-primary">
              View on Hugging Face ↗
            </a>
            <Link to="/contact" className="btn-secondary">Get in touch</Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
