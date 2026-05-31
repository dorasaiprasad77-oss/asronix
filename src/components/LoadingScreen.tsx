"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading?: boolean;
  message?: string;
}

export default function LoadingScreen({
  isLoading = true,
  message = "Loading...",
}: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          role="status"
          aria-live="polite"
          style={{
            background: "linear-gradient(135deg, #0F3B3A 0%, #0A2827 30%, #0F2C2A 60%, #0A3B38 100%)",
          }}
        >
          {/* Animated background dots */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Glowing orbs */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)",
              top: "20%",
              right: "10%",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated logo container */}
            <motion.div
              className="relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Outer spinning ring */}
              <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.4), transparent, rgba(212,175,55,0.4), transparent)",
                  filter: "blur(6px)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Middle spinning ring (reverse direction) */}
              <motion.div
                className="absolute -inset-8 rounded-full"
                style={{
                  border: "1.5px solid rgba(212,175,55,0.15)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />

              {/* Pulse ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  top: -48,
                  right: -48,
                  bottom: -48,
                  left: -48,
                  border: "1px solid rgba(212,175,55,0.08)",
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Logo box */}
              <div
                className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0F3B3A, #1C5C5A)",
                  border: "2px solid rgba(212,175,55,0.3)",
                  boxShadow: "0 0 40px rgba(212,175,55,0.15), inset 0 0 30px rgba(212,175,55,0.05)",
                }}
              >
                <motion.img
                  src="/logo.png"
                  alt="ASRONIX TECH AGENCY"
                  className="w-16 h-16 object-contain"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2
                className="text-xl font-bold tracking-wider"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #F7D44A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ASRONIX
              </h2>
              <p className="text-xs tracking-[4px] uppercase mt-1" style={{ color: "rgba(212,175,55,0.6)" }}>
                Tech Agency
              </p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              className="mt-10 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: "#D4AF37" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: "#D4AF37" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: "#D4AF37" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
            </motion.div>

            {/* Message */}
            <motion.p
              className="mt-6 text-sm tracking-wide"
              style={{ color: "rgba(212,175,55,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
