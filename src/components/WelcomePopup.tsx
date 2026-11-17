import React, { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { PlotSprite } from './PixelSprites';

interface WelcomePopupProps {
  open: boolean;
  displayName: string;
  groveName: string;
  plantCount: number;
  streak: number;
  level: number;
  isLoginMode: boolean;
  onClose: () => void;
}

const WELCOME_LINES = [
  'Back on the path. Ready to bloom.',
  'The grove remembers every drop.',
  'Quiet roots grow the tallest canopy.',
];

export function WelcomePopup({
  open,
  displayName,
  groveName,
  plantCount,
  streak,
  level,
  isLoginMode,
  onClose,
}: WelcomePopupProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const lineIndex = displayName.length % WELCOME_LINES.length;
  const tagline = WELCOME_LINES[lineIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C180E]/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
    >
      <div className="relative w-full max-w-md border-4 border-[#1A531A] bg-[#0C180E] p-6 text-[#FAF6EE] shadow-[6px_6px_0px_#1A531A]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close welcome message"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center border border-[#9DC183]/40 text-[#9DC183] hover:border-[#FAF6EE] hover:text-[#FAF6EE]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-3 inline-flex items-center justify-center border-2 border-[#9DC183]/50 bg-[#132A16] p-3 shadow-[3px_3px_0px_#1A531A]">
            <PlotSprite spriteType="cherry_blossom" stage={3} size={56} className="animate-gentle-sway" />
          </div>

          <div className="inline-flex items-center gap-1.5 border border-[#D2B48C]/50 bg-[#132A16] px-2.5 py-0.5 font-mono-tabular text-[11px] text-[#D2B48C]">
            <Sparkles className="h-3 w-3" />
            <span>{groveName}</span>
          </div>

          <h2
            id="welcome-popup-title"
            className="mt-3 font-pixel text-3xl font-bold tracking-tight text-[#FAF6EE]"
          >
            {isLoginMode ? `Welcome back, ${displayName}!` : `Welcome, ${displayName}!`}
          </h2>

          <p className="mt-1.5 font-pixel text-sm tracking-wide text-[#9DC183]">
            {tagline}
          </p>

          {/* Compact Live Grove Counters */}
          <div className="mt-5 grid w-full grid-cols-3 gap-2">
            <div className="border border-[#9DC183]/30 bg-[#132A16]/80 px-2 py-2">
              <div className="font-mono-tabular text-base font-bold text-[#FAF6EE]">
                {plantCount}
              </div>
              <div className="text-[10px] font-medium text-[#9DC183]">Plants</div>
            </div>
            <div className="border border-[#9DC183]/30 bg-[#132A16]/80 px-2 py-2">
              <div className="font-mono-tabular text-base font-bold text-[#D2B48C]">
                {streak}d
              </div>
              <div className="text-[10px] font-medium text-[#9DC183]">Streak</div>
            </div>
            <div className="border border-[#9DC183]/30 bg-[#132A16]/80 px-2 py-2">
              <div className="font-mono-tabular text-base font-bold text-[#87CEEB]">
                Lv.{level}
              </div>
              <div className="text-[10px] font-medium text-[#9DC183]">Canopy</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="pixel-btn-primary mt-5 w-full py-2.5 text-sm font-semibold"
          >
            Enter Grove
          </button>
        </div>
      </div>
    </div>
  );
}
