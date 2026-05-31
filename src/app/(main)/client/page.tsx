"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, MessageSquare, Upload, LogOut, ExternalLink, Clock, CheckCircle, AlertCircle, User, Calendar } from "lucide-react";
import { STORAGE_KEY } from "@/lib/auth";

interface Project {
  id: string;
  projectName: string;
  status: string;
  description: string;
  files: { name: string; url: string; date: string }[];
  messages: { from: string; text: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) { router.push("/login"); return; }
    try {
      const { user: u, token } = JSON.parse(stored);
      if (!u || u.role !== "client") { router.push("/login"); return; }
      setUser(u);
      fetchProjects(u.clientId);
    } catch { router.push("/login"); }
  }, []);

  const fetchProjects = async (clientId: string) => {
    try {
      const res = await fetch("/api/client/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      if (res.ok) setProjects(await res.json());
    } catch {}
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedProject, action: "add-message", from: user?.name || "Client", text: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchProjects(user.clientId);
      }
    } catch {}
  };

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    pending: { icon: AlertCircle, color: "text-amber-500 bg-amber-50", label: "Pending" },
    "in-progress": { icon: Clock, color: "text-blue-500 bg-blue-50", label: "In Progress" },
    review: { icon: ExternalLink, color: "text-purple-500 bg-purple-50", label: "In Review" },
    completed: { icon: CheckCircle, color: "text-green-500 bg-green-50", label: "Completed" },
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">ASRONIX<span className="gradient-text">TECH</span></span>
            <span className="hidden sm:inline text-sm text-gray-400 ml-2">Client Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Projects</h1>
          <p className="text-gray-500 mb-8">Track your project progress, send messages, and upload files.</p>

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-500 mb-4">You don&apos;t have any active projects. Book a project to get started.</p>
              <button onClick={() => router.push("/#booking")} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium">
                Book a Project
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-3">
                {projects.map((project) => {
                  const status = statusConfig[project.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedProject === project.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{project.projectName}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                          <StatusIcon className="w-3 h-3" /> {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(project.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {project.messages.length}</span>
                        <span className="flex items-center gap-1"><Upload className="w-3 h-3" /> {project.files.length}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-2">
                {selectedProject ? (
                  (() => {
                    const project = projects.find((p) => p.id === selectedProject);
                    if (!project) return null;
                    const status = statusConfig[project.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{project.projectName}</h2>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${status.color}`}>
                              <StatusIcon className="w-4 h-4" /> {status.label}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{project.description}</p>
                        </div>

                        <div className="p-6 border-b border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-primary" /> Files
                          </h3>
                          {project.files.length === 0 ? (
                            <p className="text-sm text-gray-400">No files uploaded yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {project.files.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <span className="text-xs text-gray-400">{new Date(file.date).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" /> Messages
                          </h3>
                          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                            {project.messages.length === 0 ? (
                              <p className="text-sm text-gray-400">No messages yet.</p>
                            ) : (
                              project.messages.map((msg, i) => (
                                <div key={i} className={`p-3 rounded-xl ${msg.from === user?.name ? "bg-primary/5 ml-8" : "bg-gray-50 mr-8"}`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-700">{msg.from}</span>
                                    <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{msg.text}</p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type a message..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button onClick={sendMessage} disabled={!newMessage.trim()}
                              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Project</h3>
                    <p className="text-gray-500">Choose a project from the list to view details.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
