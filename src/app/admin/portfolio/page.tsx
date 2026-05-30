'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderOpen, Plus, Trash2, ExternalLink } from 'lucide-react';
import type { ProjectItem } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminPortfolio() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '', description: '', technologies: '', clientIndustry: '', projectUrl: '', images: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetchProjects(token);
  }, [router]);

  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
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
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          projectName: formData.projectName,
          description: formData.description,
          technologies: formData.technologies.split(',').map(t => t.trim()),
          clientIndustry: formData.clientIndustry,
          projectUrl: formData.projectUrl,
          images: formData.images ? [formData.images] : [],
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ projectName: '', description: '', technologies: '', clientIndustry: '', projectUrl: '', images: '' });
        fetchProjects(token);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${API_BASE}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects(token);
    } catch (error) {
      console.error('Failed to delete project:', error);
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
                item.href === '/admin/portfolio' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}>
              <FolderOpen size={18} /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 min-h-screen">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold font-[Poppins] text-[#0a0a1a]">Portfolio Management</h1>
              <p className="text-gray-500 text-sm mt-1">Upload and manage your project portfolio</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm">
              <Plus size={18} /> {showForm ? 'Cancel' : 'Add Project'}
            </button>
          </div>

          {/* Add Project Form */}
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Project Name *</label>
                    <input type="text" value={formData.projectName}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                      className="input-field" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Client Industry *</label>
                    <input type="text" value={formData.clientIndustry}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientIndustry: e.target.value }))}
                      className="input-field" placeholder="e.g., E-commerce, Healthcare" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Technologies (comma separated)</label>
                    <input type="text" value={formData.technologies}
                      onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                      className="input-field" placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Project URL</label>
                    <input type="url" value={formData.projectUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                      className="input-field" placeholder="https://..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Image URL</label>
                    <input type="url" value={formData.images}
                      onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                      className="input-field" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Description *</label>
                  <textarea value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field" rows={4} required />
                </div>
                <button type="submit" disabled={saving}
                  className="btn-primary disabled:opacity-50">
                  {saving ? 'Saving...' : 'Create Project'}
                </button>
              </form>
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="spinner" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <FolderOpen size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects yet</h3>
              <p className="text-gray-400 text-sm">Click "Add Project" to upload your first project.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {project.images && project.images.length > 0 ? (
                      <img src={project.images[0]} alt={project.projectName} className="w-full h-full object-cover" />
                    ) : (
                      <FolderOpen size={40} className="text-blue-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="badge mb-2">{project.clientIndustry}</span>
                    <h3 className="font-semibold text-[#0a0a1a] mb-2">{project.projectName}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies?.map(tech => (
                        <span key={tech} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{tech}</span>
                      ))}
                    </div>
                    <button onClick={() => deleteProject(project._id)}
                      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
                      <Trash2 size={14} /> Delete
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
