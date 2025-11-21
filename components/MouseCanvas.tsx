import React, { useEffect, useRef } from 'react';
import { Particle, TrailPoint } from '../types';

const MouseCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trails = useRef<TrailPoint[]>([]);
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      trails.current.push({ x: e.clientX, y: e.clientY, age: 0 });
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: Math.random() > 0.5 ? '#00bfff' : '#ff00ff'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      // Update and draw trails
      for (let i = trails.current.length - 1; i >= 0; i--) {
        const point = trails.current[i];
        point.age += 0.05; // Fade speed
        if (point.age >= 1) {
          trails.current.splice(i, 1);
          continue;
        }

        const size = (1 - point.age) * 15;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 191, 255, ${0.5 * (1 - point.age)})`;
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 255, ${0.8 * (1 - point.age)})`;
        ctx.fill();
      }

      // Update and draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-screen"
    />
  );
};

export default MouseCanvas;