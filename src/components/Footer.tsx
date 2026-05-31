'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Web Development', href: '/#services' },
    { label: 'App Development', href: '/#services' },
    { label: 'AI Solutions', href: '/#services' },
    { label: 'UI/UX Design', href: '/#services' },
    { label: 'Branding', href: '/#services' },
  ],
  company: [
    { label: 'About', href: '/' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Free Consultation', href: 'https://wa.me/917377532141' },
    { label: 'Contact', href: '/#contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a1a] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <h3 className="text-lg font-bold font-[Poppins] text-white leading-tight">
                  ASRONIX
                </h3>
                <p className="text-[10px] text-gray-500 font-medium tracking-[2px] uppercase">
                  Tech Agency
                </p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Ideas. Innovation. Impact. We build AI-powered digital experiences that transform modern businesses.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/asronixtechagency/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://wa.me/917377532141"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6">Services</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+917377532141"
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-3"
                >
                  <Phone size={14} className="text-blue-400 shrink-0" />
                  +91 7377532141
                </a>
              </li>
              <li>
                <a
                  href="mailto:asronixtechagency@gmail.com"
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-3"
                >
                  <Mail size={14} className="text-blue-400 shrink-0" />
                  asronixtechagency@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917377532141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-3"
                >
                  <Send size={14} className="text-green-400 shrink-0" />
                  WhatsApp: +91 7377532141
                </a>
              </li>
              <li>
                <span className="text-gray-400 text-sm flex items-center gap-3">
                  <MapPin size={14} className="text-blue-400 shrink-0" />
                  Berhampur, Odisha, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ASRONIX TECH AGENCY. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Ideas. Innovation. Impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
