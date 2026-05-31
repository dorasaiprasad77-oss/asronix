"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { STORAGE_KEY } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: data.token, user: data.user }));
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/client");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
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
          top: "-10%",
          right: "-5%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
          bottom: "-10%",
          left: "-5%",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
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

        {/* Login Card */}
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
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-teal-300/60 text-sm mt-1"
            >
              Sign in to your ASRONIX account
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-teal-200/80 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-teal-300/30"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(212,175,55,0.15)",
                  color: "white",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(212,175,55,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(212,175,55,0.15)"}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-teal-200/80 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 pr-12 placeholder:text-teal-300/30"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(212,175,55,0.15)",
                    color: "white",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(212,175,55,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(212,175,55,0.15)"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400/50 hover:text-gold-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  "Sign In"
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
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium transition-colors"
                style={{ color: "#D4AF37" }}>
                Register here
              </Link>
            </p>
            <p className="mt-3 text-xs text-teal-300/30">
              Admin: admin@asronixtech.com
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
