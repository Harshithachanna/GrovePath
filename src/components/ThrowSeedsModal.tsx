import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { HabitCategory, PlotSpriteType } from '../types/grove';
import { CategoryPixelIcon, PLOT_SPRITE_NAMES, PlotSprite } from './PixelSprites';

interface ThrowSeedsModalProps {
  open: boolean;
  plotId: number | null;
  onClose: () => void;
  onPlant: (payload: {
    title: string;
    category: HabitCategory;
    spriteType: PlotSpriteType;
    plotId: number;
  }) => void;
}

const CATEGORIES: HabitCategory[] = ['Study', 'Health', 'Routines', 'Creative'];
const SPRITES: PlotSpriteType[] = [
  'cherry_blossom',
  'pine',
  'oak_lantern',
  'wildflower_arch',
  'herb_garden',
  'cedar_shrine',
];

export function ThrowSeedsModal({ open, plotId, onClose, onPlant }: ThrowSeedsModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [spriteType, setSpriteType] = useState<PlotSpriteType>('cherry_blossom');

  useEffect(() => {
    if (open) {
      setTitle('');
      setCategory('Health');
      setSpriteType('cherry_blossom');
    }
  }, [open, plotId]);

  if (!open || plotId === null) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return;
    onPlant({
      title: clean,
      category,
      spriteType,
      plotId,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C180E]/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="throw-seeds-title"
    >
      <div className="pixel-frame relative w-full max-w-md bg-[#FAF6EE] p-5 sm:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center border-2 border-[#1A531A]/30 text-[#132A16] hover:border-[#1A531A]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="border-2 border-[#1A531A]/30 bg-[#FFFDF8] p-1">
            <PlotSprite spriteType={spriteType} stage={0} size={36} />
          </div>
          <div>
            <h2 id="throw-seeds-title" className="font-pixel text-2xl font-bold text-[#1A531A]">
              Throw Seeds
            </h2>
            <p className="font-mono-tabular text-xs text-[#4A634D]">
              Plot #{String(plotId + 1).padStart(2, '0')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="habit-seed-name" className="block text-xs font-semibold text-[#132A16] mb-1">
              Habit Name
            </label>
            <input
              id="habit-seed-name"
              type="text"
              maxLength={36}
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 10 pages"
              className="w-full border-2 border-[#1A531A]/40 bg-[#FFFDF8] px-3 py-2 text-sm text-[#132A16] focus:border-[#1A531A] focus:outline-none"
            />
          </div>

          {/* Category Icons */}
          <div>
            <span className="block text-xs font-semibold text-[#132A16] mb-1.5">Category</span>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-1 border-2 text-[11px] font-semibold transition-colors ${
                      active
                        ? 'border-[#1A531A] bg-[#9DC183]/35 text-[#132A16] shadow-[2px_2px_0px_#1A531A]'
                        : 'border-[#1A531A]/25 bg-[#FFFDF8] text-[#4A634D] hover:border-[#1A531A]/60'
                    }`}
                  >
                    <CategoryPixelIcon category={cat} size={18} />
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seed / Plant Sprite Selector */}
          <div>
            <span className="block text-xs font-semibold text-[#132A16] mb-1.5">Seed Type</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SPRITES.map((sp) => {
                const active = spriteType === sp;
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpriteType(sp)}
                    className={`flex flex-col items-center p-2 border-2 transition-colors ${
                      active
                        ? 'border-[#1A531A] bg-[#9DC183]/35 shadow-[2px_2px_0px_#1A531A]'
                        : 'border-[#1A531A]/25 bg-[#FFFDF8] hover:border-[#1A531A]/60'
                    }`}
                  >
                    <PlotSprite spriteType={sp} stage={3} size={38} />
                    <span className="mt-1 text-[10px] font-medium text-[#132A16]">
                      {PLOT_SPRITE_NAMES[sp]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn-secondary px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="pixel-btn-primary px-5 py-2 text-xs font-semibold disabled:opacity-50"
            >
              Plant Seeds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
