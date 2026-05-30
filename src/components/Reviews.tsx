'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReviewItem } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const displayedReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
      />
    ));
  };

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
            Real feedback from real clients who have worked with us.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No reviews yet</h3>
            <p className="text-gray-400 text-sm">Reviews will appear here once approved.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-8"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm">
                      {review.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#0a0a1a]">{review.customerName}</p>
                      <p className="text-xs text-gray-400">{review.service}</p>
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

            {/* Review Submission CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-gray-500 text-sm mb-4">
                Have you worked with us? Share your experience!
              </p>
              <a
                href="mailto:asronixtechagency@gmail.com?subject=Review Submission&body=I would like to submit a review for ASRONIX TECH AGENCY."
                className="btn-secondary text-sm"
              >
                Submit a Review
              </a>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
