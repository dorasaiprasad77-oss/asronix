"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  items: string[];
  index: number;
}

export default function ServiceCard({ title, description, icon, gradient, items, index }: ServiceCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Code;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 h-full relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-3 mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <IconComponent className="w-full h-full text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
        <ul className="space-y-2">
          {items.slice(0, 4).map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
              {item}
            </li>
          ))}
          {items.length > 4 && (
            <li className="text-sm text-primary font-medium">+{items.length - 4} more</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
