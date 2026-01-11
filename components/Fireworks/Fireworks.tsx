"use client";

import { Firework, Particle } from "@/shared/types/fireworks";
import { useEffect, useRef, useCallback } from "react";

const MAX_WHISTLE_SOUNDS = 3;
const MAX_EXPLOSION_SOUNDS = 5;

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeWhistles = useRef<HTMLAudioElement[]>([]);
  const activeExplosions = useRef<HTMLAudioElement[]>([]);
  const isMounted = useRef(true);

  const playWhistleSound = useCallback((volume = 0.3) => {
    if (!isMounted.current) return;
    if (activeWhistles.current.length >= MAX_WHISTLE_SOUNDS) return;

    const audio = new Audio("/hu.mp3");
    audio.volume = Math.min(volume, 1);
    activeWhistles.current.push(audio);

    audio.onended = () => {
      activeWhistles.current = activeWhistles.current.filter(
        (a) => a !== audio
      );
    };

    audio.play().catch(() => {});
  }, []);

  const playExplosionSound = useCallback((volume = 0.5) => {
    if (!isMounted.current) return;
    if (activeExplosions.current.length >= MAX_EXPLOSION_SOUNDS) return;

    const audio = new Audio("/no.mp3");
    audio.volume = Math.min(volume, 1);
    activeExplosions.current.push(audio);

    const cleanup = () => {
      activeExplosions.current = activeExplosions.current.filter(
        (a) => a !== audio
      );
    };

    audio.onended = cleanup;

    setTimeout(() => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        cleanup();
      }
    }, 2500);

    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const isHighFirework = Math.random() < 0.5;
      const targetY = isHighFirework
        ? canvas.height * (0.03 + Math.random() * 0.12)
        : canvas.height * (0.15 + Math.random() * 0.25);

      const vy = -6 - Math.random() * 4;
      const vx = (Math.random() - 0.5) * 4;

      const isSpecial = Math.random() < 0.15;
      const size = isSpecial ? 6 : 3;

      if (Math.random() < 0.5) {
        playWhistleSound(isSpecial ? 0.4 : 0.2 + Math.random() * 0.1);
      }

      fireworks.push({
        x,
        y: canvas.height,
        vx,
        targetY,
        vy,
        exploded: false,
        hue: Math.random() * 360,
        isSpecial,
        size,
      });
    };

    const createParticles = (
      x: number,
      y: number,
      hue: number,
      isSpecial: boolean
    ) => {
      const particleCount = isSpecial
        ? 100 + Math.random() * 50
        : 50 + Math.random() * 30;
      const particleSize = isSpecial ? 4 : 2;
      const velocityMultiplier = isSpecial ? 1.5 : 1;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = (2 + Math.random() * 4) * velocityMultiplier;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        particles.push({
          x,
          y,
          vx,
          vy,
          alpha: 1,
          color: `hsl(${hue + Math.random() * 60 - 30}, 100%, ${
            50 + Math.random() * 20
          }%)`,
          gravity: 0.05 + Math.random() * 0.05,
          friction: 0.95 + Math.random() * 0.03,
          size: particleSize,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;
          fw.vy += 0.05;
          fw.vx *= 0.99;

          ctx.beginPath();
          ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${fw.hue}, 100%, 60%)`;
          ctx.fill();

          if (fw.y <= fw.targetY || fw.vy >= 0) {
            fw.exploded = true;
            createParticles(fw.x, fw.y, fw.hue, fw.isSpecial);
            playExplosionSound(fw.isSpecial ? 0.5 : 0.2 + Math.random() * 0.15);
            fireworks.splice(i, 1);
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.01;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        } else {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    let isPaused = false;
    let burstCount = 0;
    const maxBurstSize = 3 + Math.floor(Math.random() * 4);

    const fireworkInterval = setInterval(() => {
      if (isPaused) return;

      if (Math.random() > 0.15) {
        createFirework();
        burstCount++;

        if (burstCount >= maxBurstSize) {
          isPaused = true;
          burstCount = 0;
          const pauseDuration = 2000 + Math.random() * 1000;
          setTimeout(() => {
            isPaused = false;
          }, pauseDuration);
        }
      }
    }, 400);

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createFirework(), i * 300);
    }

    animate();

    return () => {
      isMounted.current = false;
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(fireworkInterval);

      activeWhistles.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      activeExplosions.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      activeWhistles.current = [];
      activeExplosions.current = [];
    };
  }, [playWhistleSound, playExplosionSound]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
