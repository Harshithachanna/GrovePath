import React from 'react';
import type { HabitCategory, PlantStage, PlotSpriteType } from '../types/grove';

export const PLOT_SPRITE_NAMES: Record<PlotSpriteType, string> = {
  cherry_blossom: 'Blossom',
  pine: 'Pine',
  oak_lantern: 'Oak',
  wildflower_arch: 'Arch',
  herb_garden: 'Herbs',
  cedar_shrine: 'Cedar',
};

interface SpriteImgProps {
  src: string;
  size: number;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

function SpriteImg({
  src,
  size,
  alt = '',
  className = '',
  style,
}: SpriteImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      aria-hidden={alt === ''}
      draggable={false}
      className={`pixel-art ${className}`}
      style={style}
    />
  );
}

export function GrovepathEmblem({ size = 48, className = '' }: { size?: number; className?: string }) {
  return <SpriteImg src="/sprites/emblem.svg" size={size} alt="Grovepath emblem" className={className} />;
}

export function PixelBellCheckIcon({ size = 18 }: { size?: number }) {
  return <SpriteImg src="/sprites/bell-check.svg" size={size} className="shrink-0" />;
}

export function WaterDropletSprite({ size = 24 }: { size?: number }) {
  return <SpriteImg src="/sprites/water-droplet.svg" size={size} />;
}

export function CategoryPixelIcon({
  category,
  size = 16,
}: {
  category: HabitCategory;
  size?: number;
}) {
  const map: Record<HabitCategory, string> = {
    Study: '/sprites/category-study.svg',
    Health: '/sprites/category-health.svg',
    Routines: '/sprites/category-routines.svg',
    Creative: '/sprites/category-creative.svg',
  };
  return <SpriteImg src={map[category]} size={size} alt={category} className="shrink-0" />;
}

export function BadgePixelSprite({
  iconType,
  unlocked,
  size = 40,
}: {
  iconType: 'sprout' | 'path' | 'sapling' | 'bloom' | 'plots' | 'canopy';
  unlocked: boolean;
  size?: number;
}) {
  return (
    <SpriteImg
      src={`/sprites/badge-${iconType}.svg`}
      size={size}
      alt={`${iconType} badge`}
      className="shrink-0"
      style={{ opacity: unlocked ? 1 : 0.35 }}
    />
  );
}

interface PlotSpriteProps {
  spriteType: PlotSpriteType;
  stage: PlantStage;
  empty?: boolean;
  size?: number;
  className?: string;
}

export function PlotSprite({
  spriteType,
  stage,
  empty = false,
  size = 68,
  className = '',
}: PlotSpriteProps) {
  if (empty) {
    return <SpriteImg src="/sprites/plot-empty.svg" size={size} alt="Empty plot" className={className} />;
  }
  if (stage === -1) {
    return <SpriteImg src="/sprites/stage-weeds.svg" size={size} alt="Weeds" className={className} />;
  }
  if (stage <= 1) {
    return (
      <SpriteImg
        src={`/sprites/stage-${stage}.svg`}
        size={size}
        alt={stage === 0 ? 'Seed' : 'Sprout'}
        className={className}
      />
    );
  }
  if (stage === 2) {
    return (
      <SpriteImg
        src={`/sprites/stage-2-${spriteType}.svg`}
        size={size}
        alt={`${PLOT_SPRITE_NAMES[spriteType]} sapling`}
        className={className}
      />
    );
  }
  return (
    <SpriteImg
      src={`/sprites/stage-3-${spriteType}.svg`}
      size={size}
      alt={`${PLOT_SPRITE_NAMES[spriteType]} bloom`}
      className={className}
    />
  );
}