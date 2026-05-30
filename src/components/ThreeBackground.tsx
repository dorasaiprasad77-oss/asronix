"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface MousePos {
  x: number;
  y: number;
}

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });
  const mouseInfluencedRef = useRef<MousePos>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const connectionDistance = 150;
    const mouseInfluenceRadius = 200;
    const mouseForce = 0.8;

    const getParticleCount = () => {
      const w = window.innerWidth;
      if (w < 640) return 40;
      if (w < 1024) return 60;
      if (w < 1440) return 80;
      return 100;
    };

    function createParticle(w: number, h: number): Particle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.4 + 0.15,
        hue: Math.random() * 60 + 210,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
    }

    function initParticles(count: number, w: number, h: number) {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(w, h));
      }
    }

    function drawGlow(gCtx: CanvasRenderingContext2D, gX: number, gY: number, radius: number, color: string) {
      const gradient = gCtx.createRadialGradient(gX, gY, 0, gX, gY, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "transparent");
      gCtx.beginPath();
      gCtx.arc(gX, gY, radius, 0, Math.PI * 2);
      gCtx.fillStyle = gradient;
      gCtx.fill();
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = getParticleCount();
      initParticles(count, canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse influence
      const mi = mouseInfluencedRef.current;
      const m = mouseRef.current;
      mi.x += (m.x - mi.x) * 0.05;
      mi.y += (m.y - mi.y) * 0.05;
      const mx = mi.x;
      const my = mi.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const depthScale = 0.5 + p.z * 0.5;
        const speedMult = 0.6 + p.z * 0.8;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < mouseInfluenceRadius) {
          const force = (1 - distToMouse / mouseInfluenceRadius) * mouseForce * depthScale;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Clamp velocity
        const maxSpeed = 2 * speedMult;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Wrap around
        const padding = p.size * 4;
        if (p.x < -padding) p.x = canvas.width + padding;
        if (p.x > canvas.width + padding) p.x = -padding;
        if (p.y < -padding) p.y = canvas.height + padding;
        if (p.y > canvas.height + padding) p.y = -padding;

        // Pulse
        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase) * 0.3 + 0.7;

        // Depth-based visual properties
        const sizeMult = 0.6 + p.z * 0.8;
        const displaySize = p.size * sizeMult;
        const displayOpacity = p.opacity * (0.5 + p.z * 0.5) * pulse;
        const glowSize = displaySize * (4 + p.z * 4);

        const hue = p.hue;
        const sat = 70 + p.z * 30;
        const light = 50 + p.z * 20;
        const color = `hsla(${hue}, ${sat}%, ${light}%, ${displayOpacity})`;
        const glowColor = `hsla(${hue}, ${sat}%, ${Math.min(light + 20, 90)}%, ${displayOpacity * 0.15})`;

        // Draw glow
        drawGlow(ctx, p.x, p.y, glowSize, glowColor);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, displaySize, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Inner highlight for depth
        if (p.z > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x - displaySize * 0.2, p.y - displaySize * 0.2, displaySize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 80%, 90%, ${displayOpacity * 0.4})`;
          ctx.fill();
        }

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cDx = p2.x - p.x;
          const cDy = p2.y - p.y;
          const dist = Math.sqrt(cDx * cDx + cDy * cDy);

          if (dist < connectionDistance) {
            const connectionAlpha = (1 - dist / connectionDistance) * 0.2;
            const avgHue = (p.hue + p2.hue) / 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${avgHue}, 70%, 60%, ${connectionAlpha})`;
            ctx.lineWidth = 0.5 + p.z * 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}
