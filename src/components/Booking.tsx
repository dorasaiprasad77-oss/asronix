"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Upload, X, FileText } from "lucide-react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";
import Button from "./Button";

const serviceList = ["Web Development", "App Development", "AI Solutions", "Graphic Design", "UI/UX Design", "Digital Branding", "Marketing & Growth", "Startup Solutions", "Creative Media"];
const budgetRanges = ["Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000+"];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    service: "", budget: "", deadline: "", name: "", email: "", phone: "", description: ""
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Read file as base64 if present
      let fileData = null;
      let fileName = null;
      if (file) {
        fileName = file.name;
        fileData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fileData, fileName }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AnimatedSection id="booking" className="bg-gradient-to-b from-white via-blue-50/20 to-white">
        <div className="max-w-lg mx-auto text-center px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Submitted!</h2>
          <p className="text-gray-600 mb-8">Thank you! Our team will review your project and contact you within 24 hours.</p>
          <Button variant="gradient" onClick={() => { setSubmitted(false); setStep(0); setForm({ service: "", budget: "", deadline: "", name: "", email: "", phone: "", description: "" }); setFile(null); }}>
            Submit Another Project
          </Button>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection id="booking" className="bg-gradient-to-b from-white via-blue-50/20 to-white">
      <div className="max-w-3xl mx-auto px-4">
        <SectionHeading title="Book a Project" subtitle="Ready to bring your idea to life? Fill out the form and our team will get back to you within 24 hours." />
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-xl shadow-primary/5"
        >
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {["Service", "Details", "Contact"].map((label, i) => {
              const stepState = i < step ? "done" : i === step ? "active" : "upcoming";
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    stepState === "done" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" :
                    stepState === "active" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-primary/20" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {stepState === "done" ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${stepState === "upcoming" ? "text-gray-400" : "text-gray-900"}`}>{label}</span>
                  {i < 2 && <div className={`w-12 h-0.5 ${i < step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

          {step === 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Service *</label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {serviceList.map(s => (
                  <button key={s} type="button" onClick={() => update("service", s)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.service === s ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}>
                    <span className="text-sm font-medium">{s}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="gradient" onClick={() => setStep(1)} disabled={!form.service}>Continue</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <select value={form.budget} onChange={e => update("budget", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white">
                  <option value="">Select your budget</option>
                  {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Deadline</label>
                <input type="date" value={form.deadline} onChange={e => update("deadline", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea rows={4} value={form.description} onChange={e => update("description", e.target.value)}
                  placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white resize-none" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Attach Files (optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload reference files, designs, or documents</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, Images, DOC (Max 10MB)</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button variant="gradient" onClick={() => setStep(2)} disabled={!form.budget || !form.description}>Continue</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
                    placeholder="+91 1234567890"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white" />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" variant="gradient" loading={loading}>Submit Booking</Button>
              </div>
            </div>
          )}
        </motion.form>
      </div>
    </AnimatedSection>
  );
}
