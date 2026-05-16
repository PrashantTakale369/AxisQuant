import { Router, type Request, type Response } from 'express';
import axios from 'axios';

const router = Router();
const HF_API = 'https://huggingface.co/api';
const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 3600_000; // 1 hour

const cached = async (key: string, fetcher: () => Promise<unknown>): Promise<unknown> => {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;
  const data = await fetcher();
  cache.set(key, { data, ts: Date.now() });
  return data;
};

const hfHeaders = () => ({
  ...(process.env.HF_TOKEN ? { Authorization: `Bearer ${process.env.HF_TOKEN}` } : {}),
});

const getAuthors = (): string[] => {
  const primary = process.env.HF_ORG || 'AxisQuant';
  const extras = (process.env.HF_EXTRA_AUTHORS || 'prashantcp8')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set([primary, ...extras]));
};

interface HFModel { id?: string; modelId?: string; downloads?: number; likes?: number }

const fetchAllForAuthors = async (kind: 'models' | 'datasets' | 'spaces') => {
  const authors = getAuthors();
  const responses = await Promise.all(
    authors.map((author) =>
      axios
        .get(`${HF_API}/${kind}?author=${author}&sort=downloads&direction=-1&limit=50`, {
          headers: hfHeaders(),
        })
        .then((r) => (Array.isArray(r.data) ? (r.data as HFModel[]) : []))
        .catch(() => [] as HFModel[])
    )
  );
  const merged = responses.flat();
  const seen = new Set<string>();
  return merged.filter((m) => {
    const id = (m.id || m.modelId || '') as string;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

router.get('/models', async (_req: Request, res: Response): Promise<void> => {
  const data = await cached(`models:${getAuthors().join(',')}`, () => fetchAllForAuthors('models'));
  res.json(data);
});

router.get('/models/:id(*)', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = await cached(`model:${id}`, async () => {
    const r = await axios.get(`${HF_API}/models/${id}`, { headers: hfHeaders() });
    return r.data;
  });
  res.json(data);
});

router.get('/datasets', async (_req: Request, res: Response): Promise<void> => {
  const data = await cached(`datasets:${getAuthors().join(',')}`, () => fetchAllForAuthors('datasets'));
  res.json(data);
});

router.get('/spaces', async (_req: Request, res: Response): Promise<void> => {
  const data = await cached(`spaces:${getAuthors().join(',')}`, () => fetchAllForAuthors('spaces'));
  res.json(data);
});

router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  const data = await cached(`stats:${getAuthors().join(',')}`, async () => {
    const [models, datasets, spaces] = await Promise.all([
      fetchAllForAuthors('models'),
      fetchAllForAuthors('datasets'),
      fetchAllForAuthors('spaces'),
    ]);
    const totalDownloads = models.reduce((sum, m) => sum + (m.downloads || 0), 0);
    return {
      models: models.length,
      datasets: datasets.length,
      spaces: spaces.length,
      totalDownloads,
    };
  });
  res.json(data);
});

export default router;
