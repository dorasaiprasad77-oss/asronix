"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Trash2, Check, Search, ThumbsUp } from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  review: string;
  rating: number;
  category: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => { fetchFeedbacks(); }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/admin/feedback");
      setFeedbacks(await res.json());
    } catch {}
    setLoading(false);
  };

  const toggleApprove = async (id: string) => {
    await fetch("/api/admin/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "toggle-approve" }),
    });
    fetchFeedbacks();
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    await fetch("/api/admin/feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchFeedbacks();
  };

  const filtered = feedbacks.filter((f) => {
    const match = f.name.toLowerCase().includes(search.toLowerCase()) || f.review.toLowerCase().includes(search.toLowerCase());
    if (filter === "pending") return match && !f.approved;
    if (filter === "approved") return match && f.approved;
    return match;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback & Testimonials</h1>
          <p className="text-sm text-gray-500">{feedbacks.length} total feedbacks</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search feedback..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white text-sm" />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
          {feedbacks.length === 0 ? "No feedback received yet." : "No feedbacks match your filter."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((fb, i) => (
            <motion.div key={fb.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${fb.approved ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-amber-500 to-orange-500"}`}>
                    {fb.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{fb.name}</h3>
                      <span className="text-xs text-gray-400">{fb.company ? `• ${fb.company}` : ""}</span>
                      {!fb.approved && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">Pending</span>}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{fb.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{fb.review}&rdquo;</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(fb.createdAt).toLocaleDateString()} • {fb.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button onClick={() => toggleApprove(fb.id)}
                    className={`p-2 rounded-lg transition-colors ${fb.approved ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                    title={fb.approved ? "Revoke approval" : "Approve"}>
                    {fb.approved ? <Check className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteFeedback(fb.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
