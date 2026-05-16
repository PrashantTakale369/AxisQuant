import { Router, type Request, type Response } from 'express';
import { Contact } from '../models/Contact';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { kind, name, email, org, message } = req.body;
  if (!kind || !name || !email || !message) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }
  const doc = await Contact.create({ kind, name, email, org, message });
  res.status(201).json({ message: 'Message received', id: doc._id });
});

router.get('/', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const docs = await Contact.find(filter).sort({ createdAt: -1 }).lean();
  res.json(docs);
});

router.patch('/:id/status', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  const doc = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!doc) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(doc);
});

export default router;
