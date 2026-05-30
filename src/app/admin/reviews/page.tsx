'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, CheckCircle, Trash2, MessageSquare } from 'lucide-react';
import type { ReviewItem } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminReviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetchReviews(token);
  }, [router]);

  const fetchReviews = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews(token);
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews(token);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40">
        <div className="p-6 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">A</div>
            <div>
              <h2 className="font-bold font-[Poppins] text-[#0a0a1a]">ASRONIX</h2>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase">Admin Panel</p>
            </div>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {[
            { href: '/admin/dashboard', label: 'Dashboard' },
            { href: '/admin/bookings', label: 'Bookings' },
            { href: '/admin/portfolio', label: 'Portfolio' },
            { href: '/admin/reviews', label: 'Reviews' },
            { href: '/admin/services', label: 'Services' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.href === '/admin/reviews' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}>
              <Star size={18} /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 min-h-screen">
        <div className="p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-[Poppins] text-[#0a0a1a]">Reviews Management</h1>
            <p className="text-gray-500 text-sm mt-1">Approve or delete customer reviews</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="spinner" /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No reviews yet</h3>
              <p className="text-gray-400 text-sm">Customer reviews will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className={`bg-white rounded-2xl p-6 border transition-all ${
                  !review.approved ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm">
                          {review.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#0a0a1a]">{review.customerName}</p>
                          <p className="text-xs text-gray-400">{review.email} • {review.service}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!review.approved ? (
                        <button onClick={() => approveReview(review._id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                          <CheckCircle size={16} /> Approve
                        </button>
                      ) : (
                        <span className="px-4 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-medium">Approved</span>
                      )}
                      <button onClick={() => deleteReview(review._id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
