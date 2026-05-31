'use client';

import { useEffect, useRef } from 'react';
import FadeIn from './FadeIn';
import AnimatedHeading from './AnimatedHeading';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      {/* Video Background - NO overlays, raw video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
          type="video/mp4"
        />
      </video>

      {/* Navbar */}
      <div className="relative z-20 px-6 md:px-12 lg:px-16 pt-6">
        <div className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between max-w-5xl mx-auto">
          {/* Left: Logo */}
          <span className="text-2xl font-semibold tracking-tight text-white">VEX</span>

          {/* Center: Links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white">
            {['Story', 'Investing', 'Building', 'Advisory'].map((link) => (
              <button
                key={link}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right: CTA */}
          <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200">
            Start a Chat
          </button>
        </div>
      </div>

      {/* Hero Content - centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 pb-16 lg:pb-24 text-center">
        <div className="max-w-4xl mx-auto">
          <AnimatedHeading
            text="Where innovation\nmeets execution."
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white mb-6"
            style={{ letterSpacing: '-0.04em', lineHeight: 1.1 }}
          />

          <FadeIn delay={800} duration={1000}>
            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              We transform bold ideas into breakthrough digital experiences — from strategy to launch, we build the future, one product at a time.
            </p>
          </FadeIn>

          <FadeIn delay={1200} duration={1000}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                Start a Chat
              </button>
              <button className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-200">
                Explore Now
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={1400} duration={1000}>
            <div className="mt-12">
              <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl inline-block">
                <p className="text-lg md:text-xl lg:text-2xl font-light text-white">
                  Strategy. Design. Engineering.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
