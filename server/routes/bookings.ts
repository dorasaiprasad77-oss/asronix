import { Router, Response } from 'express';
import Booking from '../models/Booking';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendAdminNotification, sendCustomerConfirmation } from '../utils/email';
import { sendAdminSMS, sendCustomerSMS } from '../utils/twilio';

const router = Router();

// POST /api/bookings - Create a new booking
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const {
      customerName,
      email,
      phone,
      service,
      budget,
      preferredDate,
      projectDescription,
      fileUrl,
    } = req.body;

    if (!customerName || !email || !phone || !service || !budget || !preferredDate || !projectDescription) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const booking = await Booking.create({
      customerName,
      email,
      phone,
      service,
      budget,
      preferredDate,
      projectDescription,
      fileUrl,
    });

    const bookingDetails = {
      customerName,
      email,
      phone,
      service,
      budget,
      preferredDate,
      projectDescription,
    };

    // Send notifications in background (don't block response)
    Promise.allSettled([
      sendAdminNotification(bookingDetails),
      sendCustomerConfirmation(bookingDetails),
      sendAdminSMS(bookingDetails),
      sendCustomerSMS(phone, customerName),
    ]).catch(err => console.error('Notification error:', err));

    return res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bookings - Get all bookings (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const query: Record<string, unknown> = {};
    
    if (status) query.status = status;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Booking.countDocuments(query),
    ]);

    return res.json({
      bookings,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    return res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/bookings/:id - Update booking status
router.patch('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }) },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json({ booking });
  } catch (error) {
    console.error('Update booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    return res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
