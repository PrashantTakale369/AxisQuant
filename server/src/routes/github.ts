import { Router, type Request, type Response } from 'express';
import axios from 'axios';

const router = Router();
const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 3_600_000;

router.get('/repos', async (_req: Request, res: Response): Promise<void> => {
  const org = process.env.GITHUB_ORG || 'AxisQuant';
  const key = `gh:repos:${org}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) { res.json(hit.data); return; }

  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const r = await axios.get(
    `https://api.github.com/orgs/${org}/repos?sort=updated&per_page=30&type=public`,
    { headers }
  );
  cache.set(key, { data: r.data, ts: Date.now() });
  res.json(r.data);
});

export default router;
