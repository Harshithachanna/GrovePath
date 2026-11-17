import React from 'react';
import { Lock, LogIn } from 'lucide-react';
import type { PlantStage } from '../types/grove';
import { PLANT_STAGE_LABELS } from '../utils/groveLogic';
import { PlotSprite } from './PixelSprites';

interface GroveGlimpseProps {
  onOpenAuth: () => void;
}

const PREVIEW_STAGES: { stage: PlantStage; sprite: 'cherry_blossom' }[] = [
  { stage: 0, sprite: 'cherry_blossom' },
  { stage: 1, sprite: 'cherry_blossom' },
  { stage: 2, sprite: 'cherry_blossom' },
  { stage: 3, sprite: 'cherry_blossom' },
];

export function GroveGlimpse({ onOpenAuth }: GroveGlimpseProps) {
  return (
    <section
      id="glimpse"
      className="mx-auto max-w-[1040px] px-4 sm:px-8 py-10 space-y-6 scroll-mt-16"
      aria-label="Grove Glimpse"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-[#1A531A]">
            Grove Glimpse
          </h2>
          <span className="inline-flex items-center gap-1 border border-[#1A531A]/35 bg-[#D2B48C]/35 px-2.5 py-0.5 font-mono-tabular text-[11px] font-semibold text-[#132A16]">
            <Lock className="h-3 w-3" />
            <span>Preview</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAuth}
          className="pixel-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Log In to Unlock</span>
        </button>
      </div>

      {/* 3 Visual-First Preview Cards (No full boards/settings before login) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 4x4 Empty Soil Plots */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="pixel-frame p-4 bg-[#FFFDF8] text-left group hover:bg-[#FAF6EE] transition-colors"
        >
          <div className="flex items-center justify-between border-b border-[#1A531A]/15 pb-2 mb-3">
            <span className="font-pixel text-lg font-bold text-[#1A531A]">4×4 Plots</span>
            <span className="font-mono-tabular text-[11px] text-[#4A634D]">16 Soil</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 bg-[#E6DEC8]/65 p-2.5 border-2 border-[#1A531A]/25">
            {Array.from({ length: 16 }, (_, idx) => (
              <div
                key={idx}
                className="aspect-square flex items-center justify-center border border-[#1A531A]/25 bg-[#FAF6EE]"
              >
                <PlotSprite spriteType="cherry_blossom" stage={0} empty size={22} />
              </div>
            ))}
          </div>
        </button>

        {/* Card 2: Seed to Bloom Stages */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="pixel-frame p-4 bg-[#0C180E] text-left text-[#FAF6EE] group hover:bg-[#132A16] transition-colors"
        >
          <div className="flex items-center justify-between border-b border-[#9DC183]/25 pb-2 mb-3">
            <span className="font-pixel text-lg font-bold text-[#FAF6EE]">Plant Stages</span>
            <span className="font-mono-tabular text-[11px] text-[#9DC183]">Seed → Bloom</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {PREVIEW_STAGES.map((item) => (
              <div
                key={item.stage}
                className="flex flex-col items-center justify-center border border-[#9DC183]/30 bg-[#132A16]/75 py-2.5"
              >
                <PlotSprite spriteType={item.sprite} stage={item.stage} size={34} />
                <span className="mt-1 font-pixel text-[11px] text-[#D2B48C]">
                  {PLANT_STAGE_LABELS[item.stage]}
                </span>
              </div>
            ))}
          </div>
        </button>

        {/* Card 3: Growth Curve Glimpse */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="pixel-frame p-4 bg-[#FFFDF8] text-left group hover:bg-[#FAF6EE] transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-[#1A531A]/15 pb-2 mb-3">
            <span className="font-pixel text-lg font-bold text-[#1A531A]">Growth Curve</span>
            <span className="font-mono-tabular text-[11px] text-[#4A634D]">7D · 30D</span>
          </div>

          <svg viewBox="0 0 220 110" className="w-full h-auto my-auto" aria-hidden="true">
            <line x1="10" y1="90" x2="210" y2="90" stroke="#1A531A" strokeOpacity="0.2" />
            <line x1="10" y1="52" x2="210" y2="52" stroke="#1A531A" strokeOpacity="0.12" strokeDasharray="3 3" />
            <line x1="10" y1="16" x2="210" y2="16" stroke="#1A531A" strokeOpacity="0.12" strokeDasharray="3 3" />
            <polygon
              points="16,90 16,80 48,72 80,62 112,62 144,44 176,30 204,18 204,90"
              fill="#9DC183"
              fillOpacity="0.32"
            />
            <polyline
              fill="none"
              stroke="#1A531A"
              strokeWidth="2.5"
              points="16,80 48,72 80,62 112,62 144,44 176,30 204,18"
            />
            {[
              [16, 80, '#228B22'],
              [48, 72, '#228B22'],
              [80, 62, '#228B22'],
              [112, 62, '#D2B48C'],
              [144, 44, '#228B22'],
              [176, 30, '#228B22'],
              [204, 18, '#1A531A'],
            ].map(([cx, cy, color], idx) => (
              <rect
                key={idx}
                x={Number(cx) - 3}
                y={Number(cy) - 3}
                width="6"
                height="6"
                fill={String(color)}
                stroke="#1A531A"
                strokeWidth="1"
              />
            ))}
          </svg>

          <div className="mt-2 flex items-center justify-between font-mono-tabular text-[11px] text-[#4A634D]">
            <span>Today · Insights</span>
            <span className="inline-flex items-center gap-1 text-[#1A531A] font-semibold">
              <Lock className="h-3 w-3" />
              Locked
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
