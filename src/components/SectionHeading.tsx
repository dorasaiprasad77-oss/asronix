"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({ title, subtitle, centered = true, light = false, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn("max-w-3xl mb-16", centered && "mx-auto text-center", className)}
    >
      <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight", light ? "text-white" : "text-gray-900")}>
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-lg md:text-xl max-w-2xl", centered && "mx-auto", light ? "text-gray-300" : "text-gray-600")}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
