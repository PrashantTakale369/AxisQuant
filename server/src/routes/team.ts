import { Router, type Request, type Response } from 'express';
import { TeamMember } from '../models/Team';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ orderIndex: 1 }).lean();
    res.json(members);
  } catch { res.json([]); }
});

router.get('/:handle', async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.findOne({ handle: req.params.handle }).lean();
    if (!member) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(member);
  } catch { res.status(503).json({ message: 'Database unavailable' }); }
});

router.post('/', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json(member);
  } catch { res.status(503).json({ message: 'Database unavailable' }); }
});

router.put('/:id', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(member);
  } catch { res.status(503).json({ message: 'Database unavailable' }); }
});

router.delete('/:id', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(503).json({ message: 'Database unavailable' }); }
});

export default router;
