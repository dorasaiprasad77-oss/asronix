'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, Search, ChevronLeft, ChevronRight, FileText,
  ExternalLink, MessageCircle, Trash2, ArrowLeft,
  LayoutDashboard, FolderOpen, Star, Settings
} from 'lucide-react';
import type { BookingItem } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const COMPANY_WHATSAPP = '917377532141';

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetchBookings(token);
  }, [page, statusFilter, router]);

  const fetchBookings = async (token: string) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await fetch(`${API_BASE}/api/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchBookings(token);
        if (selectedBooking?._id === id) {
          setSelectedBooking(prev => prev ? { ...prev, status: newStatus as BookingItem['status'] } : null);
        }
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings(token);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleWhatsAppContact = (booking: BookingItem) => {
    const message = encodeURIComponent(
      `Hi ${booking.customerName}! Thank you for your booking with ASRONIX TECH AGENCY. ` +
      `We have received your request for ${booking.service} and would like to discuss further. ` +
      `Could you please let us know your availability for a call?`
    );
    window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${message}`, '_blank');
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const getToken = () => localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Sidebar */}
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
            { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
            { href: '/admin/portfolio', label: 'Portfolio', icon: FolderOpen },
            { href: '/admin/reviews', label: 'Reviews', icon: Star },
            { href: '/admin/services', label: 'Services', icon: Settings },
          ].map((item) => {
            const IconComponent = item.icon;
            return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.href === '/admin/bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}>
              <IconComponent size={18} />
              {item.label}
            </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-64 min-h-screen">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold font-[Poppins] text-[#0a0a1a]">Bookings Management</h1>
              <p className="text-gray-500 text-sm mt-1">View and manage all customer bookings</p>
            </div>
            <Link href="/admin/dashboard" className="btn-secondary text-sm">Back to Dashboard</Link>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="input-field !w-48">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No bookings found</h3>
              <p className="text-gray-400 text-sm">Bookings will appear here once customers submit them.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedBooking(booking)}>
                          <td className="px-6 py-4 text-sm font-mono text-gray-400">#{booking._id.slice(-6)}</td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-sm text-[#0a0a1a]">{booking.customerName}</p>
                            <p className="text-xs text-gray-400">{booking.email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.service}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.budget}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={(e) => { e.stopPropagation(); handleWhatsAppContact(booking); }}
                                className="p-2 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Contact via WhatsApp">
                                <MessageCircle size={16} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); deleteBooking(booking._id); }}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-blue-300 disabled:opacity-50">
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-blue-300 disabled:opacity-50">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-[Poppins] text-[#0a0a1a]">Booking Details</h3>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedBooking.status]}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Customer Name</p>
                  <p className="font-medium text-[#0a0a1a]">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <a href={`mailto:${selectedBooking.email}`} className="font-medium text-blue-500 hover:underline">{selectedBooking.email}</a>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <p className="font-medium text-[#0a0a1a]">{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Service</p>
                  <p className="font-medium text-[#0a0a1a]">{selectedBooking.service}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Budget</p>
                  <p className="font-medium text-[#0a0a1a]">{selectedBooking.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Business Name</p>
                  <p className="font-medium text-[#0a0a1a]">{selectedBooking.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Preferred Deadline</p>
                  <p className="font-medium text-[#0a0a1a]">{selectedBooking.preferredDeadline}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-400 mb-2">Project Description</p>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedBooking.projectDescription}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-400 mb-2">Created At</p>
                <p className="text-sm text-gray-600">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                <select onChange={(e) => updateStatus(selectedBooking._id, e.target.value)} value={selectedBooking.status}
                  className="input-field !w-auto">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => handleWhatsAppContact(selectedBooking)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                  <MessageCircle size={16} /> WhatsApp
                </button>
                <button onClick={() => { deleteBooking(selectedBooking._id); }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
