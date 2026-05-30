"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Plus, MessageSquare, Search, User, Calendar } from "lucide-react";

interface Project {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  status: string;
  description: string;
  files: { name: string; url: string; date: string }[];
  messages: { from: string; text: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProject, setNewProject] = useState({ clientName: "", clientEmail: "", clientId: "", projectName: "", description: "" });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      setProjects(await res.json());
    } catch {}
    setLoading(false);
  };

  const createProject = async () => {
    if (!newProject.clientName || !newProject.projectName) return;
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    setShowNewForm(false);
    setNewProject({ clientName: "", clientEmail: "", clientId: "", projectName: "", description: "" });
    fetchProjects();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "update-status", status }),
    });
    fetchProjects();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedProject, action: "add-message", from: "Admin", text: newMessage }),
    });
    setNewMessage("");
    fetchProjects();
  };

  const filtered = projects.filter((p) =>
    p.projectName.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    "in-progress": "bg-blue-100 text-blue-700",
    review: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Projects</h1>
          <p className="text-sm text-gray-500">{projects.length} total projects</p>
        </div>
        <button onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-shadow">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {showNewForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Create New Project</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Client Name *" value={newProject.clientName} onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
            <input type="email" placeholder="Client Email" value={newProject.clientEmail} onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
            <input type="text" placeholder="Client ID" value={newProject.clientId} onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
            <input type="text" placeholder="Project Name *" value={newProject.projectName} onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
            <div className="sm:col-span-2">
              <textarea placeholder="Project Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createProject} disabled={!newProject.clientName || !newProject.projectName}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">Create</button>
            <button onClick={() => setShowNewForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">No projects found.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => setSelectedProject(p.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedProject === p.id ? "border-primary bg-primary/5" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{p.projectName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || "bg-gray-100"}`}>{p.status}</span>
                </div>
                <p className="text-xs text-gray-500">{p.clientName}</p>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            {selectedProject ? (
              (() => {
                const p = projects.find((x) => x.id === selectedProject);
                if (!p) return null;
                return (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{p.projectName}</h2>
                        <select value={p.status} onChange={(e) => updateStatus(p.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm focus:border-primary outline-none bg-white">
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">In Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {p.clientName}</span>
                        <span>{p.clientEmail}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                      {p.description && <p className="text-sm text-gray-600 mt-3">{p.description}</p>}
                    </div>
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-3">Files ({p.files.length})</h3>
                      {p.files.length === 0 ? (
                        <p className="text-sm text-gray-400">No files uploaded.</p>
                      ) : (
                        <div className="space-y-2">
                          {p.files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                              <span className="text-gray-700">{f.name}</span>
                              <span className="text-xs text-gray-400">{new Date(f.date).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" /> Messages ({p.messages.length})
                      </h3>
                      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                        {p.messages.length === 0 ? (
                          <p className="text-sm text-gray-400">No messages yet.</p>
                        ) : (
                          p.messages.map((m, i) => (
                            <div key={i} className={`p-3 rounded-xl ${m.from === "Admin" ? "bg-primary/5 ml-8" : "bg-gray-50 mr-8"}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">{m.from}</span>
                                <span className="text-xs text-gray-400">{new Date(m.date).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-gray-600">{m.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                        <button onClick={sendMessage} disabled={!newMessage.trim()}
                          className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50">Send</button>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Select a Project</h3>
                <p className="text-gray-500 text-sm">Choose a project from the list to manage it.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
