import { Router, Response } from 'express';
import Contact from '../models/Contact';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/contacts - Submit contact form (public)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({ name, email, phone, message });

    return res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/contacts - Get all contacts (admin)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Contact.countDocuments(),
    ]);

    return res.json({
      contacts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    return res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
