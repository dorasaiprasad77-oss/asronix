import { Router, Response } from 'express';
import Service from '../models/Service';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/services - Get all active services (public)
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: 1 });
    return res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/services/all - Get all services (admin)
router.get('/all', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    return res.json({ services });
  } catch (error) {
    console.error('Get all services error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/services - Create service (admin)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, icon } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const service = await Service.create({ name, description, icon });
    return res.status(201).json({ service });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/services/:id - Update service
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, icon, isActive } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, isActive },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json({ service });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/services/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
