"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/data";
import { STORAGE_KEY } from "@/lib/auth";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { user } = JSON.parse(stored);
        setAuthUser(user);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top < 100) {
          setActiveLink("#" + section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthUser(null);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-sm border-b border-gray-100/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo("#home")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
              ASRONIX<span className="gradient-text">TECH</span>
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeLink === link.href
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {authUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href={authUser.role === "admin" ? "/admin" : "/client"}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                >
                  {authUser.role === "admin" ? <LayoutDashboard className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    activeLink === link.href
                      ? "text-primary bg-primary/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </button>
              ))}
              <hr className="my-2 border-gray-100" />
              {authUser ? (
                <>
                  <Link
                    href={authUser.role === "admin" ? "/admin" : "/client"}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium text-primary bg-primary/5"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
