"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, FolderKanban, MessageSquare, TrendingUp, Star, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [bookingCount, setBookingCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [bookingsRes, contactsRes, portfolioRes, servicesRes] = await Promise.all([
          fetch("/api/admin/bookings"),
          fetch("/api/admin/contacts"),
          fetch("/api/admin/portfolio"),
          fetch("/api/admin/services"),
        ]);
        const bookings = await bookingsRes.json();
        const contacts = await contactsRes.json();
        const portfolio = await portfolioRes.json();
        const services = await servicesRes.json();
        setBookingCount(Array.isArray(bookings) ? bookings.length : 0);
        setContactCount(Array.isArray(contacts) ? contacts.length : 0);
        setPortfolioCount(Array.isArray(portfolio) ? portfolio.length : 0);
        setServiceCount(Array.isArray(services) ? services.length : 0);
      } catch {}
      setLoading(false);
    }
    fetchStats();
  }, []);

  const metrics = [
    { label: "Total Bookings", value: bookingCount.toString(), icon: CalendarCheck, color: "from-blue-500 to-cyan-500", href: "/admin/bookings" },
    { label: "Contact Messages", value: contactCount.toString(), icon: MessageSquare, color: "from-purple-500 to-pink-500", href: "/admin/contacts" },
    { label: "Services", value: serviceCount.toString(), icon: TrendingUp, color: "from-teal-500 to-emerald-500", href: "/admin/services" },
    { label: "Portfolio Items", value: portfolioCount.toString(), icon: FolderKanban, color: "from-amber-500 to-red-500", href: "/admin/portfolio" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here is your agency overview.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-600">
          ASRONIXTECH Admin
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <Link key={m.label} href={m.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} p-2`}>
                  <m.icon className="w-full h-full text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
                ) : (
                  m.value
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">{m.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Manage Bookings", icon: CalendarCheck, href: "/admin/bookings", desc: `View ${bookingCount} booking submissions` },
              { label: "View Contacts", icon: MessageSquare, href: "/admin/contacts", desc: `${contactCount} contact messages` },
              { label: "Services", icon: TrendingUp, href: "/admin/services", desc: `${serviceCount} services` },
              { label: "Portfolio", icon: FolderKanban, href: "/admin/portfolio", desc: `${portfolioCount} projects` },
              { label: "Feedback", icon: Star, href: "/admin/feedbacks", desc: "Approve testimonials" },
              { label: "Site Content", icon: FileText, href: "/admin/content", desc: "Edit website text" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col gap-1 p-4 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <action.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">{action.label}</span>
                <span className="text-xs text-gray-400">{action.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Storage</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>Form submissions are stored as JSON files in the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">data/</code> directory:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span><strong>bookings.json</strong> — project booking requests</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span><strong>contacts.json</strong> — contact form messages</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span><strong>portfolio.json</strong> — portfolio projects</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <span><strong>services.json</strong> — service offerings (editor)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span><strong>feedbacks.json</strong> — client testimonials & reviews</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span><strong>content.json</strong> — website text content (editor)</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              Bookings and contacts are automatically saved when submitted through the website forms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
