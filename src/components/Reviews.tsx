'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ChevronLeft, ChevronRight, Send, X, CheckCircle, Quote } from 'lucide-react';
import type { ReviewItem } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Feedback {
  id: string;
  name: string;
  email: string;
  company: string;
  review: string;
  rating: number;
  category: string;
  approved: boolean;
  createdAt: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<(ReviewItem | Feedback)[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    review: '',
    rating: 5,
    category: 'General',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // First try the backend API (MongoDB)
      const res = await fetch(`${API_BASE}/api/reviews`);
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Backend unavailable, try local API
    }

    try {
      // Fallback: try local /api/feedback (JSON file storage)
      const localRes = await fetch('/api/feedback');
      if (localRes.ok) {
        const data = await localRes.json();
        if (data.length > 0) {
          setReviews(data);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Local API unavailable
    }

    // No reviews exist yet — show empty state
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!form.name || !form.email || !form.review) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setSubmitError('');
        setForm({ name: '', email: '', company: '', review: '', rating: 5, category: 'General' });
      } else {
        const errData = await res.json().catch(() => ({ error: 'Failed to submit review' }));
        setSubmitError(errData.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    }
    setSubmitting(false);
  };

  const getRatingText = (rating: number) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating] || '';
  };

  const renderStars = (rating: number, size = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} transition-colors`}
      />
    ));
  };

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const displayedReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  return (
    <section id="reviews" className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-purple-50/20 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="section-header"
        >
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="section-subtitle">
            Real feedback from real clients who have worked with us. Share your experience too!
          </p>
        </motion.div>

        {/* Feedback Submission Toggle Button */}
        <div className="text-center mb-10">
          <button
            onClick={() => { setShowForm(!showForm); setSubmitted(false); }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              showForm
                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                : 'gradient-bg text-white hover:shadow-lg hover:shadow-blue-500/25'
            }`}
          >
            {showForm ? (
              <><X size={18} /> Close Form</>
            ) : (
              <><MessageSquare size={18} /> Write a Review</>
            )}
          </button>
        </div>

        {/* Feedback Form */}
        <AnimatePresence>
          {showForm && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="glass-card rounded-2xl p-8 mb-12 overflow-hidden"
            >
              <h3 className="text-xl font-semibold font-[Poppins] text-[#0a0a1a] mb-2">
                Share Your Feedback
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Your review will be visible after admin approval.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email *</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company (Optional)</label>
                    <input
                      type="text"
                      placeholder="Your Company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="input-field"
                    >
                      <option>General</option>
                      <option>Web Development</option>
                      <option>App Development</option>
                      <option>AI Solutions</option>
                      <option>UI/UX Design</option>
                      <option>Graphic Design</option>
                      <option>Digital Branding</option>
                      <option>Marketing</option>
                      <option>Business Automation</option>
                      <option>Creative Media</option>
                    </select>
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm({ ...form, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={`${
                              star <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                            } transition-colors cursor-pointer`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-500 ml-2">
                      {getRatingText(form.rating)}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review *</label>
                  <textarea
                    placeholder="Tell us about your experience working with us..."
                    value={form.review}
                    onChange={(e) => setForm({ ...form, review: e.target.value })}
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 flex items-center gap-2 bg-red-50 px-4 py-3 rounded-xl"
                    >
                      <X size={14} />
                      {submitError}
                    </motion.p>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      {submitting ? (
                        <span className="spinner-sm" />
                      ) : (
                        <Send size={16} />
                      )}
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thank You Message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-8 mb-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold font-[Poppins] text-[#0a0a1a] mb-2">Thank You!</h3>
              <p className="text-gray-500 text-sm">
                Your review has been submitted successfully. It will appear on our website after admin approval.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                Write another review
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : reviews.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No reviews yet</h3>
            <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedReviews.map((review: any, index) => (
                <motion.div
                  key={review._id || review.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-8 relative group"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100 group-hover:text-blue-200 transition-colors" />
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic relative z-10">
                    &ldquo;{review.comment || review.review}&rdquo;
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm">
                      {((review.customerName || review.name) || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#0a0a1a]">{review.customerName || review.name}</p>
                      <p className="text-xs text-gray-400">
                        {review.service || review.category || ''}
                        {review.company ? ` • ${review.company}` : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      currentPage === i
                        ? 'gradient-bg text-white'
                        : 'border border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
