'use client';

import { useState } from 'react';
import {
  ChevronDown, ChevronRight, ShoppingCart, Menu, X,
  TrendingDown, TrendingUp,
} from 'lucide-react';
import ConvixGauge from './ConvixGauge';

function LogoFlower({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="#ef4d23">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 16 + 10 * Math.cos(rad);
        const cy = 16 + 10 * Math.sin(rad);
        return <circle key={angle} cx={cx} cy={cy} r={3.5} />;
      })}
      <circle cx={16} cy={16} r={3.5} />
    </svg>
  );
}

const navItems = ['Home', 'Features', 'About', 'Pages'];

export default function ConvixHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4 font-['Inter',sans-serif]">
      {/* Hero container */}
      <div className="relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          webkit-playsinline="true"
          x5-playsinline="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Foreground Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Navbar */}
          <div className="flex justify-center pt-4 sm:pt-6 px-3 sm:px-4">
            <div className="bg-white rounded-full shadow-sm border border-neutral-200 pl-2 pr-2 py-2 w-full max-w-[760px] relative">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center shrink-0">
                  <LogoFlower className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-neutral-800">
                  {navItems.map((item, i) => (
                    <div key={item} className="flex items-center gap-1.5">
                      {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      <span>{item}</span>
                      {item === 'Pages' && <ChevronDown size={14} className="text-[#ef4d23]" />}
                    </div>
                  ))}
                </div>

                {/* Right Cluster */}
                <div className="flex items-center gap-2 ml-auto">
                  <ShoppingCart size={18} className="hidden sm:block text-neutral-600" />
                  <button className="bg-[#ef4d23] text-white rounded-full text-[13px] sm:text-[14px] font-medium flex items-center gap-1.5 pl-4 sm:pl-5 pr-1.5 py-1.5 hover:opacity-90 transition-opacity">
                    <span className="hidden sm:inline">Get early access</span>
                    <span className="sm:hidden">Early access</span>
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <ChevronRight size={14} />
                    </span>
                  </button>
                  {/* Mobile hamburger */}
                  <button
                    className="md:hidden p-2 text-neutral-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                  >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </div>

              {/* Mobile Dropdown */}
              {menuOpen && (
                <div className="absolute top-full left-2 right-2 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-200 p-3 z-20">
                  {navItems.map((item) => (
                    <button
                      key={item}
                      className="block w-full text-left px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col items-center px-4 pt-10 sm:pt-16 pb-8 sm:pb-12 text-center overflow-y-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-[13px] font-medium text-neutral-800">
              <span className="w-2 h-2 rounded-full bg-[#ef4d23]" />
              Convix Software
            </div>

            {/* Headline */}
            <h1
              className="mt-5 sm:mt-6 max-w-4xl"
              style={{ fontSize: 'clamp(36px, 8vw, 72px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              Shaping{' '}
              <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>
                Agencies
              </span>
              <br />
              of tomorrow
            </h1>

            {/* Subtitle */}
            <p
              className="mt-4 sm:mt-6 text-neutral-700 px-2 max-w-xl"
              style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}
            >
              The All-In-One Software Powering the Future of PR Agencies
            </p>

            {/* CTA */}
            <button className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 text-[14px] font-medium hover:bg-[#1a1f2e] transition-colors">
              Get Started
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center">
                <ChevronRight size={14} />
              </span>
            </button>

            {/* Dashboard Preview */}
            <div className="mt-6 sm:mt-8 w-full px-3 sm:px-4">
              <div className="bg-[#f5f2ee] rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Card 1 - Clicks */}
                  <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[#ef4d23]">Clicks</span>
                      <span className="text-[13px] text-neutral-500">This Month</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[28px] font-semibold text-neutral-900">6,896</span>
                        <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-600 rounded-full px-2 py-0.5 text-[11px] font-medium">
                          <TrendingDown size={11} />
                          -3,382 (33%)
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">Compared to yesterday</span>
                    </div>
                    <div className="text-center text-[12px] font-medium text-neutral-700 mt-1">Month Target achieved</div>
                    <ConvixGauge value={92} color="#ef4d23" showLabels min="389K" max="425K" />
                    {/* Toggle pill */}
                    <div className="bg-neutral-100 rounded-full p-1 flex text-[12px] font-medium mt-1">
                      <span className="bg-white rounded-full px-3 py-1 shadow-sm text-neutral-800 flex-1 text-center">Impressions</span>
                      <span className="px-3 py-1 text-neutral-500 flex-1 text-center">Clicks</span>
                    </div>
                  </div>

                  {/* Card 2 - Form */}
                  <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-neutral-700">Show figures for</label>
                      <button className="flex items-center justify-between w-full border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-700">
                        This month
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-neutral-700">Compare period by</label>
                      <button className="flex items-center justify-between w-full border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-700">
                        Month-to-date (MTD)
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-neutral-700">Ste targets (This month)</label>
                      <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-700">
                        <span className="text-neutral-400">#</span>
                        <input type="text" defaultValue="10" className="flex-1 bg-transparent outline-none border-none ml-1 text-[13px]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-neutral-700">Ste targets (This year)</label>
                      <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2 text-[13px] text-neutral-700">
                        <span className="text-neutral-400">#</span>
                        <input type="text" defaultValue="100" className="flex-1 bg-transparent outline-none border-none ml-1 text-[13px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button className="bg-[#ef4d23] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition-opacity">Save</button>
                      <button className="text-[13px] text-neutral-500 underline">Cancel</button>
                      <button className="ml-auto">
                        <X size={16} className="text-neutral-400" />
                      </button>
                    </div>
                  </div>

                  {/* Card 3 - Video Starts */}
                  <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[#ef4d23]">Video Starts</span>
                      <span className="text-[13px] text-neutral-500">today</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[28px] font-semibold text-neutral-900">0</span>
                        <span className="inline-flex items-center gap-0.5 bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5 text-[11px] font-medium">
                          <TrendingUp size={11} />
                          0
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">Compared to yesterday</span>
                    </div>
                    <ConvixGauge value={68} color="#9ca3af" />
                    {/* Toggle pill */}
                    <div className="bg-neutral-100 rounded-full p-1 flex text-[12px] font-medium mt-1">
                      <span className="bg-white rounded-full px-3 py-1 shadow-sm text-neutral-800 flex-1 text-center">Video Clicks</span>
                      <span className="px-3 py-1 text-neutral-500 flex-1 text-center">Video Starts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
