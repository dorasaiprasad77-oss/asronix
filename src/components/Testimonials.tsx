"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, MessageSquare } from "lucide-react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import Button from "./Button";

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

export default function Testimonials() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", review: "", rating: 5, category: "General" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setFeedbacks(data);
        }
      } else {
        setFeedbacks([]);
      }
    } catch {
      setFeedbacks([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.review) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
      }
    } catch {}
    setSubmitting(false);
  };

  return (
    <AnimatedSection id="testimonials" className="bg-gradient-to-b from-white via-purple-50/20 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading title="What Our Clients Say" subtitle="Hear from our clients about their experience working with ASRONIXTECH." className="mb-0" />
          <button onClick={() => setShowForm(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-all">
            <MessageSquare className="w-4 h-4" /> Write a Review
          </button>
        </div>

        {showForm && !submitted && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-6 md:p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" required />
                <input type="email" placeholder="Your Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" required />
                <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                <input type="text" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}>
                    <Star className={`w-5 h-5 ${star <= form.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} transition-colors`} />
                  </button>
                ))}
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="ml-4 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                  <option>General</option>
                  <option>Web Development</option>
                  <option>App Development</option>
                  <option>AI Solutions</option>
                  <option>UI/UX Design</option>
                  <option>Digital Branding</option>
                  <option>Graphic Design</option>
                </select>
              </div>
              <textarea placeholder="Write your review... *" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })}
                rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none" required />
              <div className="flex gap-2">
                <Button variant="gradient" type="submit" loading={submitting}>Submit Review</Button>
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}

        {submitted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-premium p-8 text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-3 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Thank You!</h3>
            <p className="text-sm text-gray-500">Your review has been submitted and will appear after admin approval.</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-premium p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))
          ) : feedbacks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Quote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No testimonials yet. Be the first to leave a review!</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>Write a Review</Button>
            </div>
          ) : (
            feedbacks.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="card-premium p-6 relative group hover:shadow-lg hover:shadow-primary/5"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/5 group-hover:text-primary/10 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}{t.company ? `, ${t.company}` : ""}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">{t.category}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Mobile review button */}
        <div className="sm:hidden text-center mt-8">
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>
            <MessageSquare className="w-4 h-4" /> Write a Review
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
