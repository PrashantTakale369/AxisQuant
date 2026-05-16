import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ message: 'Email and password required' }); return; }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

router.get('/me', protect, (req: Request, res: Response) => {
  res.json({ user: (req as Request & { user: unknown }).user });
});

export default router;
