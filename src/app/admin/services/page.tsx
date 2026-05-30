'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Settings, Plus, Trash2, Edit3, CheckCircle, XCircle, Globe, Smartphone, Brain, Palette, Layout, Target, TrendingUp, Bot, Camera } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Globe, Smartphone, Brain, Palette, Layout, Target, TrendingUp, Bot, Camera,
};

export default function AdminServices() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', icon: 'code' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetchServices(token);
  }, [router]);

  const fetchServices = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/services/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: '', description: '', icon: 'code' });
        fetchServices(token);
      }
    } catch (error) {
      console.error('Failed to create service:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      fetchServices(token);
    } catch (error) {
      console.error('Failed to toggle service:', error);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices(token);
    } catch (error) {
      console.error('Failed to delete service:', error);
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
                item.href === '/admin/services' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}>
              <Settings size={18} /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 min-h-screen">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold font-[Poppins] text-[#0a0a1a]">Services Management</h1>
              <p className="text-gray-500 text-sm mt-1">Add, edit, or manage your services</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm">
              <Plus size={18} /> {showForm ? 'Cancel' : 'Add Service'}
            </button>
          </div>

          {showForm && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Service Name *</label>
                    <input type="text" value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Icon</label>
                    <select value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="input-field">
                      <option value="code">Code</option>
                      <option value="Globe">Globe</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Brain">Brain</option>
                      <option value="Palette">Palette</option>
                      <option value="Layout">Layout</option>
                      <option value="Target">Target</option>
                      <option value="TrendingUp">Trending Up</option>
                      <option value="Bot">Bot</option>
                      <option value="Camera">Camera</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Description *</label>
                  <textarea value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field" rows={3} required />
                </div>
                <button type="submit" disabled={saving}
                  className="btn-primary disabled:opacity-50">
                  {saving ? 'Saving...' : 'Create Service'}
                </button>
              </form>
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="spinner" /></div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <Settings size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No services yet</h3>
              <p className="text-gray-400 text-sm">Add your first service to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service._id} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#0a0a1a]">{service.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {service.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(service._id, service.isActive)}
                      className={`p-2 rounded-xl transition-colors ${
                        service.isActive ? 'hover:bg-yellow-50 text-yellow-500' : 'hover:bg-green-50 text-green-500'
                      }`} title={service.isActive ? 'Deactivate' : 'Activate'}>
                      {service.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button onClick={() => deleteService(service._id)}
                      className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
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
