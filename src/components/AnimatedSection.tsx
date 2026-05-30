"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className, id, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay }}
      className={cn("section-padding", className)}
    >
      {children}
    </motion.section>
  );
}
