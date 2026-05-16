import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const focuses = [
  { title: 'Model Quantization', desc: 'Compressing LLMs into int4, int8, fp8 formats using GPTQ, AWQ, GGUF, and EXL2. Benchmarked across hardware: A100, H100, consumer GPUs, and Apple Silicon.' },
  { title: 'Fine-tuning', desc: 'Adapting foundation models for specialized domains. Curating training data, designing curricula, building eval suites that catch regressions across all capabilities.' },
  { title: 'Dataset Curation', desc: 'Building instruction, reasoning, multilingual, and domain-specific datasets. Every dataset is documented, versioned, and released with full methodology.' },
  { title: 'Open Research', desc: 'Publishing all models, datasets, and findings openly on Hugging Face and GitHub. We believe reproducibility is part of the contribution.' },
  { title: 'Efficient Inference', desc: 'Exploring vLLM, llama.cpp, ExLlamaV2, and custom CUDA kernels to maximize throughput and minimize latency for real-world deployments.' },
  { title: 'AI Infrastructure', desc: 'Building and sharing tooling for evaluation, serving, and benchmarking compressed models at scale.' },
];

export default function About() {
  return (
    <div>
      <section className="aq-container py-20 border-b border-border">
        <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-4">About the lab</p>
        <h1 className="font-display text-6xl md:text-7xl font-light tracking-tight max-w-3xl leading-tight mb-8">
          We compress models so anyone can run them.
        </h1>
        <p className="text-xl text-muted max-w-2xl leading-relaxed">
          AxisQuant is an AI research and engineering lab dedicated to making large language models
          faster, lighter, and more accessible, without sacrificing what makes them powerful.
        </p>
      </section>

      <section className="aq-container py-20 border-b border-border">
        <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-4">Mission</p>
        <p className="text-2xl text-text max-w-3xl leading-relaxed">
          The best AI should run where people already are, on the hardware they already own.
          That means efficient inference, open weights, and transparent methodology.
          We build, refine, and share high-performance compressed models so the community
          can deploy AI without needing a data center.
        </p>
      </section>

      <section className="aq-container py-20 border-b border-border">
        <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-8">Our work focuses on</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {focuses.map(f => (
            <div key={f.title} className="card">
              <h3 className="font-mono text-xs uppercase tracking-widest text-axis mb-3">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="aq-container py-20">
        <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-6">Philosophy</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
          {[
            { n: '01', title: 'Open by default', body: 'Everything we build goes on Hugging Face and GitHub. Research that can\'t be reproduced isn\'t research.' },
            { n: '02', title: 'Benchmarks over claims', body: 'Every model ships with perplexity, throughput, VRAM, and accuracy benchmarks. No marketing, just numbers.' },
            { n: '03', title: 'Community first', body: 'We build for practitioners: the people running models on their own hardware, in their own deployments.' },
          ].map(({ n, title, body }) => (
            <div key={n}>
              <p className="font-mono text-3xl text-border mb-4 select-none">{n}</p>
              <h3 className="font-semibold text-text mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-12">
          <Link to="/team" className="btn-primary gap-2">Meet the team <ArrowRight size={16} /></Link>
          <Link to="/research" className="btn-secondary">Read our research</Link>
        </div>
      </section>
    </div>
  );
}
