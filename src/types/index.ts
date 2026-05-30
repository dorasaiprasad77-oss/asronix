export interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface ProjectItem {
  _id: string;
  projectName: string;
  images: string[];
  description: string;
  technologies: string[];
  clientIndustry: string;
  projectUrl?: string;
  createdAt: string;
}

export interface ReviewItem {
  _id: string;
  customerName: string;
  email: string;
  service: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface BookingItem {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  businessName: string;
  service: string;
  budget: string;
  preferredDeadline: string;
  projectDescription: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export interface AIAnalysis {
  websiteType: string;
  marketingStrategy: string;
  brandingSuggestions: string;
  automationSuggestions: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
