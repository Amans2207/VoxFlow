"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 80;

      // Draw Globe Base
      const gradient = ctx.createRadialGradient(centerX - 20, centerY - 20, 10, centerX, centerY, radius);
      gradient.addColorStop(0, '#0a1a33');
      gradient.addColorStop(1, '#050505');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Grids (Latitude/Longitude)
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      rotation += 0.005;

      for (let i = 0; i < 8; i++) {
        // Latitude
        const yOffset = radius * Math.sin((i / 8) * Math.PI);
        const r = radius * Math.cos((i / 8) * Math.PI);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + yOffset, Math.abs(r), Math.abs(r * 0.3), 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Longitude (simplified)
        const longRot = rotation + (i / 8) * Math.PI * 2;
        const xOffset = radius * Math.sin(longRot);
        if (xOffset > 0) {
           ctx.beginPath();
           ctx.moveTo(centerX + xOffset, centerY - Math.sqrt(radius**2 - xOffset**2));
           ctx.lineTo(centerX + xOffset, centerY + Math.sqrt(radius**2 - xOffset**2));
           ctx.stroke();
        }
      }

      // Draw Connection Lines & Neural Hotspots
      const dots = [
        { x: 30, y: -20, size: 2, label: "SEOUL" },
        { x: -40, y: 30, size: 3, label: "LAGOS" },
        { x: 10, y: 50, size: 2, label: "BERLIN" },
        { x: -20, y: -40, size: 4, label: "NYC" },
        { x: 50, y: 10, size: 2, label: "TOKYO" },
        { x: -50, y: -10, size: 3, label: "LA" },
      ];

      dots.forEach((dot, index) => {
        const pulse = Math.sin(Date.now() / 400 + index) * 0.5 + 0.5;
        const x = centerX + dot.x;
        const y = centerY + dot.y;
        
        ctx.beginPath();
        ctx.arc(x, y, dot.size + pulse * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 102, 255, ${0.4 + pulse * 0.6})`;
        ctx.fill();
        
        // Dynamic Traffic Stream
        if (index > 0) {
            const prevDot = dots[index-1];
            const px = centerX + prevDot.x;
            const py = centerY + prevDot.y;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(centerX, centerY, (x + px) / 2, (y + py) / 2 - 20, px, py);
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.05 + pulse * 0.15})`;
            ctx.setLineDash([5, 15]);
            ctx.lineDashOffset = -rotation * 50;
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Tiny Labels for hotspots
        if (pulse > 0.8) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.font = '6px Inter';
          ctx.fillText(dot.label, x + 8, y);
        }
      });


      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={300} height={200} />
      <div style={{ position: 'absolute', bottom: '10px', left: '20px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: '#00f2ff', borderRadius: '50%', boxShadow: '0 0 10px #00f2ff' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.1em' }}>17 ACTIVE USERS</span>
        </div>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>GLOBAL CONTEXT SYNCED</p>
      </div>
    </div>
  );
}
