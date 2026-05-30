'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar, Users, FolderOpen, MessageSquare, Star,
  TrendingUp, LogOut, Menu, X, LayoutDashboard,
  BookOpen, Briefcase, Settings
} from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalProjects: number;
  totalReviews: number;
  pendingReviews: number;
  totalContacts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0, pendingBookings: 0, totalProjects: 0,
    totalReviews: 0, pendingReviews: 0, totalContacts: 0,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const [bookingsRes, projectsRes, reviewsRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE}/api/bookings?limit=1`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/projects`),
        fetch(`${API_BASE}/api/reviews/all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/contacts?limit=1`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [bookings, projects, reviews, contacts] = await Promise.all([
        bookingsRes.json(), projectsRes.json(), reviewsRes.json(), contactsRes.json(),
      ]);

      setStats({
        totalBookings: bookings.total || 0,
        pendingBookings: bookings.bookings?.filter((b: { status: string }) => b.status === 'pending').length || 0,
        totalProjects: projects.projects?.length || 0,
        totalReviews: reviews.reviews?.length || 0,
        pendingReviews: reviews.reviews?.filter((r: { approved: boolean }) => !r.approved).length || 0,
        totalContacts: contacts.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Pending', value: stats.pendingBookings, icon: BookOpen, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 text-orange-600' },
    { label: 'Projects', value: stats.totalProjects, icon: Briefcase, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 text-purple-600' },
    { label: 'Reviews', value: stats.totalReviews, icon: Star, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50 text-pink-600' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: MessageSquare, color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50 text-yellow-600' },
    { label: 'Contacts', value: stats.totalContacts, icon: Users, color: 'from-green-500 to-green-600', bg: 'bg-green-50 text-green-600' },
  ];

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/portfolio', label: 'Portfolio', icon: FolderOpen },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/services', label: 'Services', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm">A</div>
          <span className="font-semibold font-[Poppins]">Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          {user && (
            <div className="mb-3 px-4 py-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-[#0a0a1a]">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold font-[Poppins] text-[#0a0a1a] mb-2">Dashboard</h1>
            <p className="text-gray-500 text-sm mb-8">Welcome back! Here&apos;s your overview.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, index) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <card.icon size={22} />
                  </div>
                  <TrendingUp size={18} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold font-[Poppins] text-[#0a0a1a] mb-1">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} className="mt-10">
            <h2 className="text-lg font-semibold font-[Poppins] text-[#0a0a1a] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: '/admin/bookings', label: 'View All Bookings', icon: Calendar },
                { href: '/admin/portfolio', label: 'Upload Project', icon: FolderOpen },
                { href: '/admin/reviews', label: 'Approve Reviews', icon: Star },
                { href: '/admin/services', label: 'Manage Services', icon: Settings },
              ].map((action) => (
                <Link key={action.href} href={action.href}
                  className="glass-card rounded-2xl p-5 flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <action.icon size={20} className="text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-[#0a0a1a]">{action.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
