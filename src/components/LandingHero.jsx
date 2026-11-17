import React, { useEffect, useRef, useState } from 'react';
import { PlotSprite } from './PixelSprites';

const FOLD_STRIP = [
  {
    label: 'Grow Trees',
    line: 'Water daily habits into full bloom.',
    sprite: 'cherry_blossom',
    stage: 3,
  },
  {
    label: 'Clear Paths',
    line: 'Stay steady to keep weeds away.',
    sprite: 'oak_lantern',
    stage: 2,
  },
  {
    label: 'Unlock Plots',
    line: 'Fill sixteen plots with steady roots.',
    sprite: 'wildflower_arch',
    stage: 3,
  },
];

export function LandingHero({ reducedMotion }) {
  const heroRef = useRef(null);
  const rafRef = useRef(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [osReducedMotion, setOsReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setOsReducedMotion(mq.matches);
    const listener = (e) => setOsReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const disableTracking = reducedMotion || osReducedMotion;

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '42%');

    if (disableTracking) return;

    const updateCoords = (clientX, clientY) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const xPct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const yPct = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        el.style.setProperty('--mx', `${xPct.toFixed(2)}%`);
        el.style.setProperty('--my', `${yPct.toFixed(2)}%`);
      });
    };

    const handleMouseMove = (e) => updateCoords(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches[0]) updateCoords(e.touches[0].clientX, e.touches[0].clientY);
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('touchmove', handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [disableTracking]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0C180E] flex flex-col justify-between"
      aria-label="Grovepath Hero"
    >
      {/* Full-bleed 16:9 warm blossom meadow with tagline layered behind the mountains */}
      {!heroImgFailed ? (
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full select-none pointer-events-none"
          role="img"
          aria-label="Navigate Your Growth — warm blossom meadow and mountain horizon"
        >
          <defs>
            <clipPath id="mountain-foreground-clip">
              <path d="M 0 422 L 86 394 L 220 432 L 474 195 L 590 382 L 668 312 L 835 420 L 960 468 L 1075 455 L 1213 408 L 1258 424 L 1427 308 L 1484 336 L 1548 368 L 1788 196 L 1920 315 L 1920 1080 L 0 1080 Z" />
            </clipPath>
            <filter id="tagline-shadow" x="-10%" y="-20%" width="120%" height="150%">
              <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#0C180E" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Base full landscape (sky + mountains + meadow) */}
          <image
            href="/assets/aistudio/hero_section_background_16e6639a.png"
            x="0"
            y="0"
            width="1920"
            height="1080"
            preserveAspectRatio="none"
            onError={() => setHeroImgFailed(true)}
          />

          {/* Grovepath tagline tucked in the sky behind the mountain silhouettes */}
          <g className={disableTracking ? '' : 'animate-sky-tagline'}>
            <text
              x="1050"
              y="342"
              textAnchor="middle"
              fill="#FAF6EE"
              fillOpacity="0.95"
              filter="url(#tagline-shadow)"
              style={{
                fontFamily: "'Pixelify Sans', monospace",
                fontSize: '80px',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              NAVIGATE YOUR GROWTH
            </text>
          </g>

          {/* Foreground mountain ridgeline & meadow clipped in front of the tagline */}
          <image
            href="/assets/aistudio/hero_section_background_16e6639a.png"
            x="0"
            y="0"
            width="1920"
            height="1080"
            preserveAspectRatio="none"
            clipPath="url(#mountain-foreground-clip)"
          />
        </svg>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#1A531A] via-[#228B22]/60 to-[#0C180E] flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="font-pixel text-3xl sm:text-5xl font-bold tracking-widest text-[#FAF6EE]/80">
            NAVIGATE YOUR GROWTH
          </span>
        </div>
      )}

      {/* Golden-blossom cursor glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle 460px at var(--mx, 50%) var(--my, 42%), rgba(242, 193, 78, 0.16) 0%, rgba(157, 193, 131, 0.08) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* #0C180E dark overlay with mouse-following flashlight spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle 380px at var(--mx, 50%) var(--my, 42%), rgba(12, 24, 14, 0.04) 0%, rgba(12, 24, 14, 0.36) 46%, rgba(12, 24, 14, 0.72) 80%)',
        }}
        aria-hidden="true"
      />

      <div className="flex-1" aria-hidden="true" />

      {/* Hero Fold Visual 3-Card Strip */}
      <div className="relative z-10 mx-auto w-full max-w-[1040px] px-4 sm:px-8 pb-7">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-2 border-[#9DC183]/40 bg-[#0C180E]/82 p-3 sm:p-4 backdrop-blur-md shadow-[4px_4px_0px_#060D07]">
          {FOLD_STRIP.map((card, idx) => (
            <div
              key={card.label}
              className="flex items-center gap-3 border border-[#9DC183]/25 bg-[#132A16]/60 p-2.5 sm:p-3 text-left"
            >
              <div className="shrink-0 border border-[#9DC183]/40 bg-[#FAF6EE]/95 p-1">
                <PlotSprite spriteType={card.sprite} stage={card.stage} size={42} />
              </div>
              <div className="min-w-0">
                <div className="font-mono-tabular text-[10px] text-[#D2B48C]">
                  0{idx + 1}
                </div>
                <div className="font-pixel text-sm sm:text-base font-bold text-[#FAF6EE] whitespace-nowrap">
                  {card.label}
                </div>
                <p className="mt-0.5 text-[11px] text-[#9DC183] truncate">
                  {card.line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}