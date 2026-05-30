'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const COMPANY_WHATSAPP = '917377532141';

const services = [
  'Web Development',
  'App Development',
  'AI Solutions',
  'Graphic Design',
  'UI/UX Design',
  'Branding',
  'Marketing',
  'Business Automation',
  'Creative Media',
];

const budgetRanges = [
  'Under ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  'Above ₹5,00,000',
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    businessName: '',
    service: '',
    budget: '',
    projectDescription: '',
    preferredDeadline: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'customerName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const cleaned = value.replace(/[\s\-()]/g, '');
        const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
        if (!phoneRegex.test(cleaned)) return 'Enter a valid 10-digit Indian mobile number';
        return '';
      case 'email':
        if (!value.trim()) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Enter a valid email address';
        return '';
      case 'businessName':
        if (!value.trim()) return 'Business name is required';
        if (value.trim().length < 2) return 'Business name must be at least 2 characters';
        return '';
      case 'service':
        if (!value) return 'Please select a required service';
        return '';
      case 'budget':
        if (!value) return 'Please select a budget range';
        return '';
      case 'projectDescription':
        if (!value.trim()) return 'Project description is required';
        if (value.trim().length < 10) return 'Please provide more detail (at least 10 characters)';
        return '';
      case 'preferredDeadline':
        if (!value.trim()) return 'Preferred deadline is required';
        if (value.trim().length < 2) return 'Please enter a valid deadline';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        newTouched[key] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(prev => ({ ...prev, ...newTouched }));
    // Scroll to first error
    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      setTimeout(() => {
        const el = document.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    return isValid;
  };

  const buildWhatsAppMessage = () => {
    const message =
      `🚀 NEW PROJECT INQUIRY\n\n` +
      `Client Name:\n${formData.customerName || '[Not provided]'}\n\n` +
      `Phone Number:\n${formData.phone || '[Not provided]'}\n\n` +
      `Email:\n${formData.email || '[Not provided]'}\n\n` +
      `Business Name:\n${formData.businessName || '[Not provided]'}\n\n` +
      `Required Service:\n${formData.service || '[Not selected]'}\n\n` +
      `Estimated Budget:\n${formData.budget || '[Not specified]'}\n\n` +
      `Project Details:\n${formData.projectDescription || '[Not provided]'}\n\n` +
      `Preferred Deadline:\n${formData.preferredDeadline || '[Not specified]'}\n\n` +
      `Thank you for choosing ASRONIX TECH AGENCY.\n\n` +
      `We look forward to working with you.`;
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    if (!validateForm()) return;
    setSending(true);
    const message = buildWhatsAppMessage();
    setTimeout(() => {
      window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${message}`, '_blank');
      setSending(false);
      setSent(true);
    }, 400);
  };

  if (sent) {
    return (
      <section id="booking" className="section">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold font-[Poppins] text-[#0a0a1a] mb-3">
              Details Sent Successfully!
            </h3>
            <p className="text-gray-500 mb-6">
              Your project details have been shared with us via WhatsApp.
              Our team will review your requirements and get back to you shortly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${COMPANY_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Us on WhatsApp
              </a>
              <button
                onClick={() => setSent(false)}
                className="btn-secondary"
              >
                Send Another
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="section bg-gradient-to-b from-white via-blue-50/20 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="section-header"
        >
          <span className="section-tag">WhatsApp Booking</span>
          <h2 className="section-title">
            Send Project <span className="gradient-text">Details</span>
          </h2>
          <p className="section-subtitle">
            Fill in your details below and we&apos;ll connect with you on WhatsApp to discuss your project.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 md:p-10"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`input-field ${errors.customerName && touched.customerName ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                  required
                />
                {errors.customerName && touched.customerName && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+91 9876543210"
                  className={`input-field ${errors.phone && touched.phone ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                  required
                />
                {errors.phone && touched.phone && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john@example.com"
                  className={`input-field ${errors.email && touched.email ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                  required
                />
                {errors.email && touched.email && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Business Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Business Name"
                  className={`input-field ${errors.businessName && touched.businessName ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                  required
                />
                {errors.businessName && touched.businessName && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {errors.businessName}
                  </p>
                )}
              </div>

              {/* Required Service */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Service *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.service && touched.service ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.service && touched.service && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {errors.service}
                  </p>
                )}
              </div>

              {/* Estimated Budget */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget *
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.budget && touched.budget ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                  required
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.budget && touched.budget && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {errors.budget}
                  </p>
                )}
              </div>
            </div>

            {/* Project Description */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your project in detail including goals, features, and any specific requirements..."
                className={`input-field ${errors.projectDescription && touched.projectDescription ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                rows={5}
                required
              />
              {errors.projectDescription && touched.projectDescription && (
                <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                  <AlertCircle size={12} />
                  {errors.projectDescription}
                </p>
              )}
            </div>

            {/* Preferred Deadline */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Deadline *
              </label>
              <input
                type="text"
                name="preferredDeadline"
                value={formData.preferredDeadline}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 2 weeks, 1 month, by December 2024"
                className={`input-field ${errors.preferredDeadline && touched.preferredDeadline ? '!border-red-400 !ring-red-400/20 focus:!ring-red-400/30' : ''}`}
                required
              />
              {errors.preferredDeadline && touched.preferredDeadline && (
                <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                  <AlertCircle size={12} />
                  {errors.preferredDeadline}
                </p>
              )}
            </div>

            {/* Premium WhatsApp Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                disabled={sending}
                className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 px-8 py-5 text-white font-semibold text-lg shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />

                {sending ? (
                  <span className="relative flex items-center justify-center gap-3">
                    <Loader2 size={22} className="animate-spin" />
                    Opening WhatsApp...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-white"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Send Project Details on WhatsApp
                  </span>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Your details will be sent directly to us on WhatsApp. No database storage required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
