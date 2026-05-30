'use client';

import { motion } from 'framer-motion';

export default function LaptopIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      <svg
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Glow effect behind laptop */}
        <defs>
          <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6a00ff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="screenContent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1628" />
            <stop offset="100%" stopColor="#0f1f3d" />
          </linearGradient>
          <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <clipPath id="screenClip">
            <path d="M130 100 L470 100 L460 340 L140 340 Z" />
          </clipPath>
        </defs>

        {/* Background glow rings */}
        <ellipse cx="300" cy="280" rx="250" ry="180" fill="url(#screenGlow)" filter="url(#glow)" opacity="0.4" />
        
        {/* Floating particles */}
        <circle cx="80" cy="120" r="3" fill="#00aaff" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="520" cy="150" r="2.5" fill="#6a00ff" opacity="0.4">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="350" r="2" fill="#00aaff" opacity="0.3">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="510" cy="380" r="3.5" fill="#6a00ff" opacity="0.4">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="70" r="2" fill="#00aaff" opacity="0.4">
          <animate attributeName="opacity" values="0.5;0.3;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="60" r="2.5" fill="#6a00ff" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* Lid / Screen back */}
        <path
          d="M100 380 L120 80 L480 80 L500 380 Z"
          fill="url(#lidGrad)"
          stroke="#334155"
          strokeWidth="1.5"
          rx="12"
        />
        <path
          d="M100 380 Q100 395 115 395 L485 395 Q500 395 500 380 Z"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Screen bezel */}
        <path
          d="M130 100 L470 100 L460 340 L140 340 Z"
          fill="url(#screenContent)"
          stroke="#1e293b"
          strokeWidth="1"
        />

        {/* Screen content - code lines */}
        <g clipPath="url(#screenClip)">
          {/* Dashboard header bar */}
          <rect x="145" y="110" width="305" height="24" rx="4" fill="#1e293b" />
          <circle cx="157" cy="122" r="4" fill="#ef4444" />
          <circle cx="172" cy="122" r="4" fill="#f59e0b" />
          <circle cx="187" cy="122" r="4" fill="#10b981" />
          
          {/* Sidebar */}
          <rect x="145" y="140" width="50" height="190" rx="4" fill="#1e293b" opacity="0.6" />
          <rect x="152" y="148" width="36" height="8" rx="2" fill="#334155" />
          <rect x="152" y="162" width="36" height="8" rx="2" fill="#00aaff" opacity="0.3" />
          <rect x="152" y="176" width="36" height="8" rx="2" fill="#334155" />
          <rect x="152" y="190" width="36" height="8" rx="2" fill="#334155" />
          
          {/* Main content area - code lines */}
          <rect x="205" y="148" width="120" height="8" rx="2" fill="#00aaff" opacity="0.6" />
          <rect x="205" y="164" width="80" height="6" rx="2" fill="#6366f1" opacity="0.5" />
          <rect x="205" y="180" width="140" height="6" rx="2" fill="#334155" />
          <rect x="205" y="196" width="60" height="6" rx="2" fill="#10b981" opacity="0.5" />
          <rect x="205" y="212" width="160" height="6" rx="2" fill="#334155" />
          <rect x="205" y="228" width="100" height="6" rx="2" fill="#00aaff" opacity="0.4" />
          
          {/* Data cards */}
          <rect x="205" y="248" width="60" height="40" rx="4" fill="#00aaff" opacity="0.15" />
          <rect x="215" y="256" width="40" height="4" rx="2" fill="#00aaff" opacity="0.5" />
          <rect x="215" y="266" width="25" height="4" rx="2" fill="#00aaff" opacity="0.3" />
          
          <rect x="272" y="248" width="60" height="40" rx="4" fill="#6366f1" opacity="0.15" />
          <rect x="282" y="256" width="40" height="4" rx="2" fill="#6366f1" opacity="0.5" />
          <rect x="282" y="266" width="25" height="4" rx="2" fill="#6366f1" opacity="0.3" />
          
          <rect x="339" y="248" width="60" height="40" rx="4" fill="#10b981" opacity="0.15" />
          <rect x="349" y="256" width="40" height="4" rx="2" fill="#10b981" opacity="0.5" />
          <rect x="349" y="266" width="25" height="4" rx="2" fill="#10b981" opacity="0.3" />

          {/* Chart line */}
          <polyline
            points="220,310 260,295 300,305 340,280 380,290 420,270"
            fill="none"
            stroke="#00aaff"
            strokeWidth="2"
            opacity="0.6"
          />
          <polyline
            points="220,320 260,310 300,315 340,300 380,305 420,290"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
            opacity="0.4"
          />

          {/* Screen reflection/glow */}
          <rect x="130" y="100" width="340" height="240" fill="url(#screenGlow)" opacity="0.08" />
        </g>

        {/* Screen glare line */}
        <path
          d="M140 105 L460 105"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.05"
        />

        {/* Camera dot */}
        <circle cx="300" cy="92" r="2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />

        {/* Base / Keyboard */}
        <path
          d="M50 400 L120 395 L480 395 L550 400 L570 450 L530 450 Q300 460 70 450 Z"
          fill="url(#baseGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />
        
        {/* Keyboard keys area */}
        <rect x="130" y="405" width="340" height="35" rx="3" fill="#1e293b" opacity="0.5" />
        
        {/* Key rows */}
        <g opacity="0.4">
          {/* Row 1 */}
          <rect x="140" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="162" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="184" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="210" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="232" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="254" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="280" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="302" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="324" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="350" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="372" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="394" y="408" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="420" y="408" width="36" height="8" rx="1.5" fill="#334155" />
          
          {/* Row 2 */}
          <rect x="140" y="420" width="24" height="8" rx="1.5" fill="#334155" />
          <rect x="168" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="190" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="216" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="238" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="264" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="286" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="312" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="334" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="360" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="382" y="420" width="18" height="8" rx="1.5" fill="#334155" />
          <rect x="408" y="420" width="48" height="8" rx="1.5" fill="#334155" />
          
          {/* Trackpad */}
          <rect x="245" y="432" width="110" height="10" rx="4" fill="#334155" opacity="0.3" />
        </g>

        {/* Light reflection on base */}
        <path
          d="M100 402 Q300 410 500 402"
          stroke="white"
          strokeWidth="0.3"
          opacity="0.08"
          fill="none"
        />

        {/* Hinge */}
        <rect x="100" y="393" width="400" height="4" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}
