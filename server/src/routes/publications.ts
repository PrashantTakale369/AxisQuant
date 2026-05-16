import { Router, type Request, type Response } from 'express';
import { Publication } from '../models/Publication';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { kind, topic, page = '1', limit = '12' } = req.query;
    const filter: Record<string, unknown> = { draft: false };
    if (kind) filter.kind = kind;
    if (topic) filter.topics = topic;
    const skip = (Number(page) - 1) * Number(limit);
    const [docs, total] = await Promise.all([
      Publication.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Publication.countDocuments(filter),
    ]);
    res.json({ docs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.json({ docs: [], total: 0, page: 1, pages: 0 });
  }
});

router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await Publication.findOne({ slug: req.params.slug, draft: false }).lean();
    if (!doc) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(doc);
  } catch {
    res.status(503).json({ message: 'Database unavailable' });
  }
});

router.post('/', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await Publication.create(req.body);
    res.status(201).json(doc);
  } catch {
    res.status(503).json({ message: 'Database unavailable' });
  }
});

router.put('/:id', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(doc);
  } catch {
    res.status(503).json({ message: 'Database unavailable' });
  }
});

router.delete('/:id', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    await Publication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(503).json({ message: 'Database unavailable' });
  }
});

export default router;
