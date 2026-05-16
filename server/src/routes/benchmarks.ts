import { Router, type Request, type Response } from 'express';
import { Benchmark } from '../models/Benchmark';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { metric, hardware, quantMethod } = req.query;
    const filter: Record<string, unknown> = {};
    if (metric) filter.metric = metric;
    if (hardware) filter.hardware = hardware;
    if (quantMethod) filter.quantMethod = quantMethod;
    const docs = await Benchmark.find(filter).sort({ runAt: -1 }).lean();
    res.json(docs);
  } catch { res.json([]); }
});

router.post('/', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await Benchmark.create(req.body);
    res.status(201).json(doc);
  } catch { res.status(503).json({ message: 'Database unavailable' }); }
});

router.delete('/:id', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    await Benchmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(503).json({ message: 'Database unavailable' }); }
});

export default router;
