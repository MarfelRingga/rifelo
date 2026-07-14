import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const glowSpriteCache = new Map<string, HTMLCanvasElement>();

function getGlowSprite(color: string, blur: number, particleRadius: number): HTMLCanvasElement {
  const key = `${color}-${blur}-${particleRadius}`;
  let sprite = glowSpriteCache.get(key);
  if (!sprite) {
    sprite = document.createElement('canvas');
    const padding = blur + 5;
    const size = (particleRadius + padding) * 2;
    sprite.width = size;
    sprite.height = size;
    const ctx = sprite.getContext('2d');
    if (ctx) {
      const cx = size / 2;
      const cy = size / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, particleRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.fill();
    }
    glowSpriteCache.set(key, sprite);
  }
  return sprite;
}

export interface ResonanceCanvasRendererProps {
  width?: number;
  height?: number;
  resonanceColor: string;
  // Kept for compatibility with existing usage in UnifiedCirclePage.tsx
  circleName?: string;
  members?: any[];
  activeProfileIds?: string[];
}

export const ResonanceCanvasRenderer = forwardRef<HTMLCanvasElement, ResonanceCanvasRendererProps>(
  ({ width = 720, height = 1280, resonanceColor, circleName, members, activeProfileIds }, ref) => {
    const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);

    useImperativeHandle(ref, () => internalCanvasRef.current!);

    useEffect(() => {
      const canvas = internalCanvasRef.current;
      if (!canvas) return;

      // Force 1:1 pixel mapping for recording. Do NOT use devicePixelRatio 
      // as it will blow up the resolution to 1080p+ on mobile and cause extreme lag.
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // No scaling needed since DPR is 1

      let animationFrameId: number;
      let startTime = performance.now();

      // Ensure color is valid for canvas
      const baseColor = resonanceColor || '#a299af';
      const nameText = circleName || 'UNTITLED';
      const memberList = members || [];
      const activeIds = activeProfileIds || [];
      
      // Extract RGB for opacity variations
      let r = 162, g = 153, b = 175;
      if (baseColor.startsWith('#') && baseColor.length === 7) {
          r = parseInt(baseColor.slice(1, 3), 16);
          g = parseInt(baseColor.slice(3, 5), 16);
          b = parseInt(baseColor.slice(5, 7), 16);
      }

      const draw = (time: number) => {
        const elapsed = (time - startTime) / 1000; // seconds

        // 1. Clear background
        ctx.fillStyle = '#0c0e0b';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        // 2. Active Resonance Glow effect (Background Blur)
        const bgGlowRadius = 600;
        const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, bgGlowRadius);
        bgGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`);
        bgGlow.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.05)`);
        bgGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        // 3. The Giant Merged Circle
        const coreRadius = 160; 
        
        ctx.save();
        ctx.translate(cx, cy);

        // Background gradient
        const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius);
        coreGlow.addColorStop(0, baseColor);
        coreGlow.addColorStop(0.8, 'transparent');
        coreGlow.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreGlow;
        
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 120;
        ctx.fill();
        
        ctx.shadowBlur = 0;

        ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius - 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        const pulseOpacity = 0.75 + 0.25 * Math.sin(elapsed * Math.PI); 
        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${pulseOpacity})`;
        ctx.shadowBlur = 80;
        ctx.fillStyle = 'transparent';
        ctx.fill();

        ctx.restore();

        // 4. Orbiting Aura (Members)
        if (memberList.length > 0) {
          ctx.save();
          ctx.translate(cx, cy);
          
          // Rotation animation (match speed with the original phase rotating)
          const rotation = elapsed * (Math.PI / 3); 
          ctx.rotate(rotation);

          // Give a slight pulsing scale to the orbit radius
          const orbitScale = 1.65 + Math.sin(elapsed * 2) * 0.05;

          memberList.forEach((member, i) => {
            const angle = (i / memberList.length) * Math.PI * 2;
            const isActive = activeIds.includes(member.id);
            const color = member.color || '#ffffff';
            
            const radius = coreRadius * orbitScale;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const particleRadius = isActive ? 18 : 10;
            const blur = isActive ? 32 : 16;
            
            const sprite = getGlowSprite(color, blur, particleRadius);
            ctx.drawImage(sprite, x - sprite.width / 2, y - sprite.height / 2);
          });
          ctx.restore();
        }

        // 5. Center Text: circleName
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 4;
        
        // Split name by newlines (like original CircleNameDisplay)
        const lines = nameText.split('\n').slice(0, 3);
        const maxLineLength = Math.max(...lines.map(l => l.length));
        
        // Calculate font size dynamically based on line length and line count
        let fontSize = 36;
        if (maxLineLength > 8 || lines.length > 1) fontSize = 28;
        if (maxLineLength > 12 || lines.length === 3) fontSize = 24;
        if (maxLineLength > 18) fontSize = 20;

        ctx.font = `900 ${fontSize}px "Inter", sans-serif`; 
        
        const lineHeight = fontSize + 10;
        const startY = -((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
            const text = line;
            const letterSpacing = 8;
            const totalWidth = ctx.measureText(text).width + (text.length - 1) * letterSpacing;
            let startX = -totalWidth / 2;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const charWidth = ctx.measureText(char).width;
                ctx.fillText(char, startX + charWidth / 2, startY + index * lineHeight);
                startX += charWidth + letterSpacing;
            }
        });
        ctx.restore();

        // 6. Bottom Right Text: "rifelo.id"
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '700 20px "Inter", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('rifelo.id', width - 30, height - 30);
        ctx.restore();

        animationFrameId = requestAnimationFrame(draw);
      };

      animationFrameId = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [width, height, resonanceColor, circleName, members, activeProfileIds]);

    return (
      <canvas
        ref={internalCanvasRef}
        width={width}
        height={height}
        className="fixed top-0 left-0 pointer-events-none z-[-1] opacity-0"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }
);

ResonanceCanvasRenderer.displayName = 'ResonanceCanvasRenderer';
