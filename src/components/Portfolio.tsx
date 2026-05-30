'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectItem } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Portfolio() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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

  if (loading) {
    return (
      <section id="portfolio" className="section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="section bg-gradient-to-b from-white via-purple-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="section-header"
        >
          <span className="section-tag">Our Work</span>
          <h2 className="section-title">
            Project <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="section-subtitle">
            Real projects delivered with cutting-edge technology and exceptional design.
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
              <FolderOpen size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects yet</h3>
            <p className="text-gray-400 text-sm">Projects will appear here once uploaded by admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card group rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.projectName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen size={48} className="text-blue-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6">
                  <span className="badge mb-3">{project.clientIndustry}</span>
                  <h3 className="text-lg font-semibold font-[Poppins] text-[#0a0a1a] mb-2">
                    {project.projectName}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <img
                  src={selectedProject.images[0]}
                  alt={selectedProject.projectName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderOpen size={64} className="text-blue-300" />
                </div>
              )}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <span className="badge mb-3">{selectedProject.clientIndustry}</span>
              <h3 className="text-2xl font-bold font-[Poppins] text-[#0a0a1a] mb-4">
                {selectedProject.projectName}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {selectedProject.description}
              </p>
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {selectedProject.projectUrl && (
                <a
                  href={selectedProject.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink size={16} />
                  Visit Project
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
