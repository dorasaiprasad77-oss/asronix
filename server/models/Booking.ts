import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  customerName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  preferredDate: string;
  projectDescription: string;
  fileUrl?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    budget: { type: String, required: true },
    preferredDate: { type: String, required: true },
    projectDescription: { type: String, required: true },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
