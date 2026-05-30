import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken, authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/seed-admin (for initial setup - should be disabled in production)
router.post('/seed-admin', async (_req: AuthRequest, res: Response) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', email: existingAdmin.email });
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      name: 'Admin',
      email: 'asronixtechagency@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    return res.json({ message: 'Admin created successfully', email: admin.email });
  } catch (error) {
    console.error('Seed admin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
