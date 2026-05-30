import { Router, Response } from 'express';
import Review from '../models/Review';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/reviews - Get approved reviews (public)
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reviews/all - Get all reviews (admin)
router.get('/all', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    console.error('Get all reviews error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reviews - Submit a review (customer)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, email, service, rating, comment } = req.body;

    if (!customerName || !email || !service || !rating || !comment) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      customerName,
      email,
      service,
      rating,
      comment,
      approved: false,
    });

    return res.status(201).json({ message: 'Review submitted for approval', review });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/reviews/:id/approve - Approve review (admin)
router.patch('/:id/approve', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.json({ review });
  } catch (error) {
    console.error('Approve review error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
