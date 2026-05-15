# AxisQuant — Implementation Blueprint

A production-grade, industry-standard full-stack site for an AI research lab focused on model quantization, optimization, and efficient deployment of LLMs.

Reference aesthetic: Anthropic.com (typographic restraint), Together.ai (technical density, benchmarks-forward), EleutherAI (research-first), Mistral (dark-first monochrome with accent), Hugging Face org pages (live model/dataset cards). Target: feels like a serious lab, not a marketing site.

---

## 1. Architecture & Tech Stack

### Recommendation: Hybrid — Next.js 15 (App Router) primary + thin FastAPI sidecar

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Unified Next.js (TS-only) | Single deploy, single language, fast iteration | All HF integration via `@huggingface/hub` JS SDK; no native Python tooling for benchmarks, eval pipelines, model card parsing using HF `transformers` ecosystem | Acceptable but limiting |
| Split Next.js + FastAPI | Python is lingua franca of ML; can run real eval scripts, parse model cards with `huggingface_hub` Python lib, integrate `transformers`/`datasets` directly. Backend itself becomes a research artifact | 2 deploys, 2 langs | **Recommended** |
| Unified FastAPI + React SPA | Decouples cleanly | Loses Next.js SSR/ISR/MDX/Image opt — exactly what a content-heavy lab site needs | Rejected |

### Final Stack

**Frontend (`apps/web`)**
- Next.js 15 App Router + React 19 + TypeScript 5.5 strict
- Tailwind CSS v4 + shadcn/ui (Radix primitives, copy-in)
- MDX via `@next/mdx` + `next-mdx-remote` for research/blog
- Shiki for code highlighting, rehype-katex + remark-math for equations
- Recharts for benchmark charts (Tremor for admin dashboard)
- Framer Motion (restrained — page transitions, hero only)
- next-themes (dark-first)
- Zustand (UI), TanStack Query (server-state on client), RSC by default
- React Hook Form + Zod
- next-seo, JSON-LD, dynamic OG via `next/og`
- Pagefind (static search, builds at deploy)

**Backend — Python sidecar (`apps/api`)**
- FastAPI (async) + Pydantic v2
- uv for deps
- httpx for outbound
- huggingface_hub Python SDK
- redis-py for caching
- SQLAlchemy 2.0 async + Alembic, OR shared schema via Prisma (Prisma is source of truth)
- APScheduler for cron, or arq if queue grows
- structlog + JSON logs

**Data**
- PostgreSQL 16 (Neon)
- Prisma (TypeScript ORM, owns schema migrations)
- Redis (Upstash) — HF response cache + rate limit + jobs

**Auth**
- Auth.js (NextAuth v5) + GitHub OAuth, allowlist by GitHub login. Admin-only — no public auth.

**Email**
- Resend + react-email

**Content**
- MDX in repo for long-form research/blog (versioned, PR-reviewed)
- Postgres-backed for admin-managed surfaces (featured pins, contact submissions, benchmarks, team)

**Deployment**
- Frontend: Vercel (Next.js native — ISR, edge functions, image opt, OG)
- Backend: Fly.io (multi-region, scheduled machines for cron)
- DB: Neon (branching invaluable for content/admin testing)
- Redis: Upstash (serverless-friendly)
- Object storage: Cloudflare R2 (OG images, paper PDFs, large benchmark CSVs)

**Observability**
- Sentry (FE+BE), Axiom or Vercel Analytics, Better Stack uptime

**Tooling**
- pnpm workspaces monorepo + Turborepo (task graph + remote cache)
- Biome (fmt + lint, ESLint fallback for Next.js plugins)
- Vitest + Playwright + pytest
- Changesets
- GitHub Actions: typecheck/lint/test/e2e on PR; Vercel preview; Fly deploy on main

---

## 2. Site Sections — Each as Its Own Module

Every section ships with: `app/<route>/`, `components/<section>/`, `lib/<section>/`, and where applicable `apps/api/routers/<section>.py` + Prisma model.

### 2.1 Home `/`
- `app/(marketing)/page.tsx`, components: `Hero`, `MissionStrip`, `FeaturedModels`, `LatestResearch`, `StatsBand`, `CTA`
- Server-side fetch: featured model HF stats (cached), 3 latest MDX research items, aggregate stats
- Stats band: tabular numerals, animated ticker (server-rendered, hydrated as static)
- Hero: typographic, no stock illustrations, optional subtle WebGL grid (LCP-guarded, reduced-motion respected)

### 2.2 About `/about`
- Static MDX with structured frontmatter (mission, focus areas, philosophy)
- Pulls live team count + research count from DB

### 2.3 Research `/research` and `/research/[slug]`
- **Index:** filterable grid (topic: quantization | fine-tuning | datasets | infra | evals; year). URL-driven filter state.
- **Detail:** MDX with KaTeX, Shiki, footnotes, citation block, BibTeX button, arXiv/HF links, sticky TOC, reading time, last-updated.
- Pipeline: `content/research/*.mdx` → build-time index, RSS+Atom feeds, sitemap, per-post OG.
- Frontmatter: `title, slug, authors[], publishedAt, updatedAt, topics[], abstract, arxiv?, hfPaper?, githubRepo?, models[], datasets[], featured, draft`

### 2.4 Models `/models` and `/models/[id]`
- **Index:** server-rendered grid pulling from HF Hub API filtered by org. Client-side chip filters: quantization method (GPTQ, AWQ, GGUF, EXL2, bitsandbytes), base family (Llama, Mistral, Qwen), size, precision (int4, int8, fp8).
- **Detail:** model card preview (rendered MDX from HF), HF stats (downloads/likes/last-modified), tags, sibling files, "Use with transformers" / "Use with vLLM" / "Pull with HF CLI" snippets, related benchmarks (joined from DB), upstream base model.
- Backend: FastAPI `/api/hf/models`, `/api/hf/models/{id}` — cached in Redis (1h list, 30m detail), stale-on-error fallback. `FeaturedModel` Prisma table for pinning.

### 2.5 Datasets `/datasets` and `/datasets/[id]`
- Mirror of Models module. Separate router/components (no shared abstraction — keeps each module independently editable per "separate separate" directive).
- Adds: row count, size, license, dataset preview (first N rows via HF datasets-server API).

### 2.6 Spaces / Demos `/demos` and `/demos/[id]`
- Index of HF Spaces; thumbnail + short description.
- Detail: sandboxed iframe embed, status badge polled every 30s when tab visible.
- Below embed: "What this demo shows", "How it works" (MDX), linked research/model.

### 2.7 Blog `/blog` and `/blog/[slug]`
- Same MDX pipeline as research, lighter visual treatment.
- Categories: engineering-notes, post-mortems, tutorials, announcements.
- RSS at `/blog/rss.xml`.

### 2.8 Benchmarks `/benchmarks`
- Tabs: Perplexity, Throughput (tok/s), VRAM, Accuracy retention (MMLU/HellaSwag/GSM8K), Latency (TTFT/ITL).
- Interactive Recharts: scatter (size vs perplexity colored by quant method), bar (throughput across hardware), line (accuracy retention vs bits).
- Hardware filter (A100, H100, RTX 4090, M2 Max), base-model filter, quant-method filter — URL-driven.
- Data: Prisma `BenchmarkRun` rows, populated by admin CSV upload + optional automated runs from eval repo via webhook.
- Per-chart "Download CSV" button. Methodology link (MDX).

### 2.9 Open Source `/open-source`
- GitHub org repos via GitHub API (cached); cards: stars, last commit, language, short desc.
- Contribution guide (MDX), Code of Conduct, citation BibTeX for the lab.

### 2.10 Team `/team` and `/team/[handle]`
- DB-backed (`Person` model), editable without git push.
- Detail: bio, focus areas, publications (joined from Research), GitHub/HF/Scholar links.

### 2.11 Contact `/contact`
- Tabs: Partnership, Hiring, General. RHF + Zod, server action → FastAPI `/contact` → DB + Resend + Slack webhook.
- Anti-spam: Cloudflare Turnstile.

### 2.12 Admin `/admin` (auth-gated)
- Routes: `/admin/featured`, `/admin/team`, `/admin/benchmarks`, `/admin/inquiries`, `/admin/cache`, `/admin/jobs`.
- Tremor-based dashboard. Server actions for mutations, optimistic updates via TanStack Query.

---

## 3. Backend Design

### 3.1 API Surface (FastAPI)

```
GET  /api/health
GET  /api/hf/models                  # query: family, method, limit
GET  /api/hf/models/{id}
GET  /api/hf/datasets
GET  /api/hf/datasets/{id}
GET  /api/hf/spaces
GET  /api/hf/spaces/{id}/status
GET  /api/github/repos
GET  /api/stats/aggregate            # totals for landing page
POST /api/contact                    # validated, rate-limited
POST /api/admin/benchmarks/upload    # auth, multipart CSV
POST /api/admin/cache/invalidate     # auth
POST /api/webhooks/benchmarks        # signed webhook from eval repo
```

Next.js owns: rendering, MDX routes, admin CRUD via server actions hitting Prisma directly. FastAPI owns: HF/GitHub integration, scheduled refresh, Python ML ecosystem.

### 3.2 HF Integration Layer (`apps/api/services/hf.py`)
- Per-endpoint Redis cache, jittered TTL, stale-while-revalidate
- 429 backoff, circuit breaker (opens after 5 failures, half-opens 60s)
- `HF_TOKEN` env (read-only, higher rate limits)
- Normalization: stable `ModelDTO`/`DatasetDTO`/`SpaceDTO` so frontend never depends on HF wire format

### 3.3 Database Schema (Prisma — source of truth)

```
User                 (id, githubLogin, email, role: ADMIN|EDITOR, createdAt)
Session              (NextAuth)
Account              (NextAuth)
Person               (id, handle, name, title, bio, photoUrl, links Json, focusAreas[], orderIndex, isActive)
FeaturedModel        (id, hfId, orderIndex, note, addedById, addedAt)
FeaturedDataset      (mirror of FeaturedModel)
BenchmarkRun         (id, modelHfId, baseModel, quantMethod, bits, hardware, metric, value, unit, sourceUrl, runAt, notes)
Publication          (id, slug, title, mdxPath, authors Json, publishedAt, topics[], featured)
ContactSubmission    (id, kind, name, email, org, message, createdAt, status, internalNotes)
JobRun               (id, name, startedAt, finishedAt, status, errorText, recordsTouched)
ApiCacheStat         (id, endpoint, hits, misses, lastReset)
AuditLog             (id, actorId, action, target, diff Json, at)
```

Indices: `BenchmarkRun(quantMethod, hardware)`, `Publication(publishedAt desc)`, `ContactSubmission(status, createdAt)`. Soft delete via `deletedAt`.

### 3.4 Background Jobs
- Refresh HF org snapshot every 30 min — populates Redis + warms per-model caches; updates landing aggregates
- Refresh GitHub repo list every 60 min
- Sweep contact submissions daily — auto-archive after 90 days
- Rebuild Pagefind index on deploy (CI, not runtime)
- Runner: APScheduler in dedicated Fly machine (avoids double-run across replicas), or arq + Redis once jobs > 5

### 3.5 Email
- Resend + react-email templates: `partnership-inquiry-received`, `internal-notification`, `weekly-digest` (optional)
- Always to shared inbox + Slack webhook

### 3.6 Security
- Admin behind NextAuth + role check + middleware
- Server actions: Zod. FastAPI: Pydantic.
- CSP headers, HSTS, signed webhooks (HMAC-SHA256)
- Rate limit `/contact` (5/min/IP via Upstash Ratelimit), HF endpoints (60/min/IP)
- Secrets via Vercel + Fly stores; `.env.example` checked in

---

## 4. Frontend Design System

### 4.1 Identity
- Mood: serious, technical, restrained. Anthropic-grade typographic discipline.
- Palette (dark-first):
  - `--bg: #0a0a0b`
  - `--surface: #111114`
  - `--surface-2: #16161a`
  - `--border: #26262d`
  - `--text: #ededee`
  - `--text-muted: #9b9ba3`
  - accent `--axis: #7c5cff` (electric violet)
  - signal `--signal: #5ee6a8` (positive deltas in benchmarks)
- Type: Inter (UI), Fraunces or Source Serif 4 (editorial display), JetBrains Mono (code & numerals — tabular figures everywhere stats appear)
- Grid: 12-col, max-w 1280, content max-w 720 for prose
- Motion: 150–250ms eases, no parallax, `prefers-reduced-motion` respected
- Voice: sentences not slogans. No "revolutionize", no "unleash"

### 4.2 Component Library Structure
```
packages/ui/
  primitives/    (shadcn-derived: button, dialog, tabs, dropdown, tooltip, sheet, ...)
  patterns/      (StatBand, ResearchCard, ModelCard, DatasetCard, BenchmarkChart, MdxLayout, Toc, AuthorByline)
  layout/        (SiteHeader, SiteFooter, ContentShell, AdminShell)
  charts/        (Recharts wrappers with theme tokens)
  icons/         (lucide-react re-exports + custom svgs)
  tokens/        (CSS vars, Tailwind config preset)
```

### 4.3 MDX Pipeline
- `next-mdx-remote/rsc` for runtime rendering
- Plugins: `remark-gfm`, `remark-math`, `remark-smartypants`, `rehype-katex`, `rehype-shiki`, `rehype-slug`, `rehype-autolink-headings`, `rehype-citation` (`[@key]` → footnote via per-post `references.bib`)
- Custom MDX components: `<Figure>`, `<Callout type="warn|info|note">`, `<BenchmarkTable id=...>` (live from DB), `<ModelLink id=...>`, `<Equation>`, `<Code title=... lang=...>`

### 4.4 Charts
- Recharts wrappers with theme tokens, tabular numerals, accessible legends, keyboard tooltips
- Each accepts `data` + `exportable` flag (CSV/PNG download)

### 4.5 Performance Budget
- LCP < 2.0s on 4G simulated; CLS < 0.05; TBT < 150ms
- All HF data server-fetched, cached at edge (ISR `revalidate: 1800`)
- No client JS on About/Research-detail beyond Shiki HTML

---

## 5. Project Structure

```
axisquant/
├── apps/
│   ├── web/                              # Next.js 15
│   │   ├── app/
│   │   │   ├── (marketing)/
│   │   │   │   ├── page.tsx              # Home
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── research/{page,[slug]/page}.tsx
│   │   │   │   ├── models/{page,[id]/page}.tsx
│   │   │   │   ├── datasets/...
│   │   │   │   ├── demos/...
│   │   │   │   ├── blog/...
│   │   │   │   ├── benchmarks/page.tsx
│   │   │   │   ├── open-source/page.tsx
│   │   │   │   ├── team/...
│   │   │   │   └── contact/page.tsx
│   │   │   ├── (admin)/admin/
│   │   │   │   ├── layout.tsx            # auth gate
│   │   │   │   ├── page.tsx
│   │   │   │   ├── featured/page.tsx
│   │   │   │   ├── team/page.tsx
│   │   │   │   ├── benchmarks/page.tsx
│   │   │   │   ├── inquiries/page.tsx
│   │   │   │   └── cache/page.tsx
│   │   │   ├── api/
│   │   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   │   ├── og/route.tsx
│   │   │   │   └── revalidate/route.ts
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx
│   │   ├── components/{home,about,research,models,datasets,demos,blog,benchmarks,open-source,team,contact,admin,shared}/
│   │   ├── lib/{content,hf,db.ts,auth.ts,seo.ts,search.ts,rate-limit.ts,validators}/
│   │   ├── content/{research,blog}/*.mdx
│   │   ├── public/
│   │   ├── prisma/{schema.prisma,migrations}/
│   │   └── tests/
│   └── api/                              # FastAPI
│       ├── axisquant_api/
│       │   ├── main.py
│       │   ├── routers/{hf,github,contact,admin,webhooks,stats}.py
│       │   ├── services/{hf,github,cache,email}.py
│       │   ├── models/                   # Pydantic + SQLAlchemy
│       │   ├── jobs/                     # APScheduler
│       │   ├── core/                     # config, logging, deps, security
│       │   └── tests/
│       ├── pyproject.toml
│       ├── Dockerfile
│       └── fly.toml
├── packages/
│   ├── ui/                               # shared component lib
│   ├── config/                           # tsconfig, biome, tailwind preset
│   └── types/                            # generated OpenAPI client + shared zod
├── infra/{docker-compose.yml,github-actions}/
├── .github/workflows/
├── content-style-guide.md
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── README.md
└── LICENSE
```

---

## 6. Implementation Phases

**Phase 0 — Foundation (3–4 days)**
- Init pnpm workspace, Turborepo, Biome, tsconfig presets
- Scaffold `apps/web` (Next.js 15, Tailwind v4, shadcn install, theme tokens, fonts)
- Scaffold `apps/api` (FastAPI, uv, Dockerfile, /health)
- Scaffold `packages/ui` with primitives + tokens
- Postgres + Redis via docker-compose; Prisma init
- CI: typecheck + lint + test on PR
- ~20 files, green CI, both apps boot locally

**Phase 1 — Design system + layout shell (4–5 days)**
- Header (wordmark, nav, theme toggle, search trigger), Footer
- Typography scale, prose styles, code style, MDX components
- shadcn primitives copied + themed: Button, Tabs, Dialog, Tooltip, Dropdown, Sheet, Input, Textarea, Select, Badge, Card
- Storybook/Ladle wired
- 404 + error pages
- ~25 components, full token system

**Phase 2 — Static content sections (5–6 days)**
- Home (hero, mission strip, stats placeholder, CTA)
- About (single MDX source)
- Team (DB-backed, seeded)
- Open Source (static initially)
- Contact (form UI only, action stub)
- Sitemap, robots, manifest, dynamic OG route
- 6 routes, ~15 section components

**Phase 3 — MDX content pipeline (4–5 days)**
- Research index + detail with full MDX (KaTeX, Shiki, citations, TOC, reading time)
- Blog index + detail
- RSS/Atom feeds, JSON-LD per post
- Pagefind + Cmd-K search dialog
- Frontmatter validation with Zod (build fails on bad frontmatter)
- 2 real research posts + 2 blog posts seed
- 4 routes, MDX plugin chain, search

**Phase 4 — HF + GitHub integration (5–7 days)**
- FastAPI HF service with caching, retries, circuit breaker
- Models index + detail (live)
- Datasets index + detail (live)
- Spaces / Demos index + detail
- Open Source live GitHub data
- Stats aggregation → Home stats band
- TanStack Query on client where filters apply; RSC default
- 8 routes wired live, 6 FastAPI endpoints, Redis cache layer

**Phase 5 — Benchmarks (4–5 days)**
- Prisma `BenchmarkRun` model + admin CSV upload
- Public `/benchmarks` with all chart variants, URL-driven filters
- Methodology MDX page
- `<BenchmarkTable id>` MDX component
- Webhook receiver for automated runs
- 1 public route, 5 chart components, 1 MDX component, webhook endpoint

**Phase 6 — Admin + auth (4–5 days)**
- NextAuth GitHub provider, allowlist, Prisma adapter
- Admin shell + nav
- Featured pinning UI (drag-to-reorder)
- Team CRUD
- Inquiries inbox with status workflow
- Benchmarks CSV uploader with preview + commit
- Cache invalidation panel
- Audit log
- 6 admin routes, auth flow, ~12 admin components

**Phase 7 — Contact + email + jobs (2–3 days)**
- Wire contact form to FastAPI → Postgres + Resend + Slack webhook
- Cloudflare Turnstile
- APScheduler jobs (HF refresh, GH refresh, sweep)
- Job run history visible in admin
- 1 backend router, 3 scheduled jobs, email templates

**Phase 8 — Polish, perf, deploy (3–4 days)**
- Lighthouse pass to budget; fix LCP, CLS regressions
- Sentry FE + BE wiring; Axiom logs; Better Stack uptime
- Vercel + Fly + Neon + Upstash provisioned with env wiring
- DNS, HTTPS, redirects (apex policy decided)
- Robots policy for staging vs prod; preview deploys protected
- Final content review pass
- Production deploy, monitoring dashboards, runbook in `/docs`

**Total realistic timeline:** 6–8 weeks solo, 3–4 weeks for two devs.

---

## 7. Decisions Flagged for User

1. Backend split: FastAPI sidecar (recommended) or unified Next.js?
2. Auth provider for admin: GitHub OAuth (recommended) or email magic link?
3. Content for research/blog: MDX-in-repo (recommended) or DB-backed CMS?
4. Hosting: Vercel + Fly + Neon + Upstash (recommended) vs Railway vs self-hosted?
5. Hugging Face org slug — actual HF org name?
6. GitHub org slug — same?
7. Domain — `axisquant.org` / `.ai` / `.com`?
8. Brand: violet/green palette acceptable, or alternatives?
9. Logo/wordmark: existing or set in Fraunces with custom ligature?
10. Typography: Inter + Fraunces + JetBrains Mono (all OFL/free) acceptable?
11. Benchmarks data source: existing eval repo as webhook source, or admin CSV only at launch?
12. Team seed data: how many people, headshots/bios ready?
13. i18n: English-only at launch (recommended) or `next-intl` from day 1?
14. Newsletter: Buttondown/Substack/Resend Audiences at launch, or defer?
15. Cookie banner: avoid via Vercel/Plausible analytics (no consent needed). Confirm no GA/Meta pixels.
