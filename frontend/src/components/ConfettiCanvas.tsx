"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  shape: "rect" | "circle";
  opacity: number;
}

const CONFETTI_COLORS = [
  "#2563EB", // Blue
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#3B82F6", // Sky
  "#FBBF24", // Gold
];

export const ConfettiCanvas: React.FC<{ active?: boolean; onBurstRef?: (trigger: () => void) => void }> = ({
  active = true,
  onBurstRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const createBurst = (count = 100, originX?: number, originY?: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const startX = originX ?? canvas.width * 0.5;
    const startY = originY ?? canvas.height * 0.35;

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      newParticles.push({
        x: startX + (Math.random() - 0.5) * 60,
        y: startY + (Math.random() - 0.5) * 40,
        w: Math.random() * 8 + 5,
        h: Math.random() * 12 + 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - Math.random() * 5,
        angle: Math.random() * 360,
        vAngle: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.4 ? "rect" : "circle",
        opacity: 1,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  useEffect(() => {
    if (onBurstRef) {
      onBurstRef(() => createBurst(80));
    }
  }, [onBurstRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initial burst on mount
    createBurst(120, canvas.width * 0.5, canvas.height * 0.25);
    createBurst(80, canvas.width * 0.2, canvas.height * 0.3);
    createBurst(80, canvas.width * 0.8, canvas.height * 0.3);

    let lastContinuousSpawn = Date.now();

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn a gentle trickle of confetti from the top continuously if active
      if (active && Date.now() - lastContinuousSpawn > 140 && particlesRef.current.length < 180) {
        lastContinuousSpawn = Date.now();
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -20,
          w: Math.random() * 8 + 5,
          h: Math.random() * 12 + 6,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2.5 + 1.8,
          angle: Math.random() * 360,
          vAngle: (Math.random() - 0.5) * 6,
          shape: Math.random() > 0.3 ? "rect" : "circle",
          opacity: 1,
        });
      }

      // Update & render particles
      const gravity = 0.12;
      const drag = 0.99;

      particlesRef.current = particlesRef.current.filter((p) => {
        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx + Math.sin(p.angle * (Math.PI / 180)) * 0.8;
        p.y += p.vy;
        p.angle += p.vAngle;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        return p.y < canvas.height + 40;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
