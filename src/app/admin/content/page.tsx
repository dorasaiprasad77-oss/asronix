"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, Eye, Globe } from "lucide-react";

interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  aboutDescription: string;
  aboutStats: { label: string; value: string }[];
  contactPhone: string;
  contactEmail: string;
  contactInstagram: string;
  contactLocation: string;
  footerText: string;
}

const defaultContent: SiteContent = {
  heroHeadline: "",
  heroSubheadline: "",
  aboutDescription: "",
  aboutStats: [],
  contactPhone: "",
  contactEmail: "",
  contactInstagram: "",
  contactLocation: "",
  footerText: "",
};

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchContent(); }, []);

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setContent(data);
    } catch {
      setError("Failed to load content");
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setContent(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save content");
    }
    setSaving(false);
  }

  const updateField = (field: keyof SiteContent, value: any) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const updateStat = (index: number, field: "label" | "value", value: string) => {
    const stats = [...content.aboutStats];
    stats[index] = { ...stats[index], [field]: value };
    updateField("aboutStats", stats);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>
          <p className="text-sm text-gray-500">Edit text content across your website sections.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-green-600 font-medium">
              Saved successfully!
            </motion.span>
          )}
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-gray-900">Hero Section</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input
                type="text"
                value={content.heroHeadline}
                onChange={(e) => updateField("heroHeadline", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
              <textarea
                rows={3}
                value={content.heroSubheadline}
                onChange={(e) => updateField("heroSubheadline", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" />
              <h2 className="font-semibold text-gray-900">About Section</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={content.aboutDescription}
                onChange={(e) => updateField("aboutDescription", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Statistics (shown in About section)</label>
              <div className="grid grid-cols-2 gap-3">
                {content.aboutStats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(i, "value", e.target.value)}
                      className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-center text-sm font-bold outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(i, "label", e.target.value)}
                      className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-600" />
              <h2 className="font-semibold text-gray-900">Contact Information</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={content.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  value={content.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  type="text"
                  value={content.contactInstagram}
                  onChange={(e) => updateField("contactInstagram", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={content.contactLocation}
                  onChange={(e) => updateField("contactLocation", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Footer</h2>
          </div>
          <div className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Copyright Text</label>
              <input
                type="text"
                value={content.footerText}
                onChange={(e) => updateField("footerText", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
