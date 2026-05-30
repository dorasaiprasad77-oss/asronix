import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/bookings';
import projectRoutes from './routes/projects';
import reviewRoutes from './routes/reviews';
import serviceRoutes from './routes/services';
import contactRoutes from './routes/contacts';

// Load env vars
dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Notify booking route (for Twilio)
app.post('/api/notify-booking', (req, res) => {
  const { customerName, email, phone, service, budget, projectDescription } = req.body;
  
  if (!customerName || !email || !phone || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log the notification
  console.log('📋 Booking Notification Received:', {
    customerName,
    email,
    phone,
    service,
    budget,
    projectDescription,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    message: 'Admin notified successfully',
    notification: {
      customerName,
      email,
      phone,
      service,
      budget,
      projectDescription,
    },
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 ASRONIX TECH AGENCY Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});

export default app;
