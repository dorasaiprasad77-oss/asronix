"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, CalendarCheck, MessageSquare, FolderKanban, Star, Package, Settings, FileText, Mail, ChevronLeft, PanelRightOpen, Home, LogOut } from "lucide-react";
import { STORAGE_KEY } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) { router.push("/login"); return; }
    try {
      const { user } = JSON.parse(stored);
      if (user?.role !== "admin") router.push("/login");
    } catch { router.push("/login"); }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
    { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
    { label: "Services", href: "/admin/services", icon: Settings },
    { label: "Feedbacks", href: "/admin/feedbacks", icon: Star },
    { label: "Projects", href: "/admin/projects", icon: Package },
    { label: "Content", href: "/admin/content", icon: FileText },
    { label: "Email Test", href: "/admin/email-test", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`${collapsed ? "w-16" : "w-56"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col sticky top-0 h-screen`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!collapsed && (
            <span className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ASRONIXTECH
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            {collapsed ? <PanelRightOpen className="w-4 h-4 text-gray-500" /> : <ChevronLeft className="w-4 h-4 text-gray-500" />}
          </button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all text-sm">
            <Home className="w-5 h-5" /> {!collapsed && <span>Back to Site</span>}
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm">
            <LogOut className="w-5 h-5" /> {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
