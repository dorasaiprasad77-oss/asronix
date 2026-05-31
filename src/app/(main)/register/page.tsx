"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { STORAGE_KEY } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: data.token, user: data.user }));
      router.push("/client");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(212,175,55,0.15)",
    color: "white",
  } as React.CSSProperties;

  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(212,175,55,0.5)";
  };

  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(212,175,55,0.15)";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0F3B3A 0%, #0A2827 30%, #0F2C2A 60%, #0A3B38 100%)" }}>

      {/* Animated background grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />

      {/* Floating gold orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          top: "-5%",
          left: "-5%",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
          bottom: "-8%",
          right: "-5%",
        }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-teal-300/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Register Card */}
        <div className="backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border"
          style={{
            background: "rgba(255,255,255,0.06)",
            borderColor: "rgba(212,175,55,0.15)",
            boxShadow: "0 25px 60px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}>

          {/* Logo with animation */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative inline-block mb-5"
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.3), transparent, rgba(212,175,55,0.3), transparent)",
                  filter: "blur(4px)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center mx-auto overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #0F3B3A, #1C5C5A)",
                  border: "2px solid rgba(212,175,55,0.3)",
                }}>
                <img
                  src="/logo.png"
                  alt="ASRONIX TECH AGENCY"
                  className="w-14 h-14 object-contain"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-teal-300/60 text-sm mt-1"
            >
              Track your projects and stay connected
            </motion.p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 p-3 rounded-xl text-sm border"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#FCA5A5",
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-teal-200/80 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-teal-300/30"
                style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} required />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-teal-200/80 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-teal-300/30"
                style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} required />
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-medium text-teal-200/80 mb-1.5">
                Phone
              </label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                placeholder="+1234567890"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-teal-300/30"
                style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-teal-200/80 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-teal-300/30"
                style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} required minLength={8} />
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-sm font-medium text-teal-200/80 mb-1.5">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)}
                placeholder="Repeat your password"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-teal-300/30"
                style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} required />
            </motion.div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #C49B2E)",
                  color: "#0F2C2A",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(212,175,55,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(212,175,55,0.3)";
                }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-sm"
          >
            <p className="text-teal-300/50">
              Already have an account?{" "}
              <Link href="/login" className="font-medium transition-colors"
                style={{ color: "#D4AF37" }}>
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
