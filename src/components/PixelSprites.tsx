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

export function GrovepathEmblem({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`pixel-art ${className}`}
      aria-hidden="true"
    >
      <rect x="4" y="23" width="24" height="5" fill="#228B22" />
      <rect x="6" y="22" width="20" height="2" fill="#9DC183" />
      <rect x="7" y="28" width="18" height="2" fill="#1A531A" />
      <rect x="14" y="19" width="4" height="2" fill="#D2B48C" />
      <rect x="13" y="21" width="5" height="2" fill="#E3C9A8" />
      <rect x="14" y="23" width="6" height="2" fill="#D2B48C" />
      <rect x="13" y="25" width="7" height="2" fill="#E3C9A8" />
      <rect x="11" y="27" width="8" height="2" fill="#D2B48C" />
      <rect x="10" y="29" width="8" height="1" fill="#B8976C" />
      <rect x="15" y="16" width="2" height="4" fill="#5A3F2B" />
      <rect x="15" y="3" width="2" height="2" fill="#228B22" />
      <rect x="13" y="5" width="6" height="3" fill="#228B22" />
      <rect x="14" y="5" width="3" height="2" fill="#9DC183" />
      <rect x="12" y="8" width="8" height="3" fill="#1A531A" />
      <rect x="13" y="8" width="5" height="2" fill="#228B22" />
      <rect x="11" y="11" width="10" height="3" fill="#1A531A" />
      <rect x="12" y="11" width="6" height="2" fill="#228B22" />
      <rect x="10" y="14" width="12" height="3" fill="#1A531A" />
      <rect x="6" y="19" width="3" height="5" fill="#5A3F2B" />
      <rect x="4" y="24" width="2" height="2" fill="#5A3F2B" />
      <rect x="9" y="24" width="2" height="1" fill="#5A3F2B" />
      <rect x="7" y="7" width="2" height="2" fill="#228B22" />
      <rect x="5" y="9" width="6" height="3" fill="#228B22" />
      <rect x="6" y="9" width="3" height="2" fill="#9DC183" />
      <rect x="4" y="12" width="8" height="3" fill="#1A531A" />
      <rect x="5" y="12" width="5" height="2" fill="#228B22" />
      <rect x="3" y="15" width="10" height="4" fill="#1A531A" />
      <rect x="4" y="15" width="6" height="2" fill="#228B22" />
      <rect x="23" y="19" width="3" height="5" fill="#5A3F2B" />
      <rect x="26" y="24" width="2" height="2" fill="#5A3F2B" />
      <rect x="21" y="24" width="2" height="1" fill="#5A3F2B" />
      <rect x="23" y="7" width="2" height="2" fill="#228B22" />
      <rect x="21" y="9" width="6" height="3" fill="#228B22" />
      <rect x="22" y="9" width="3" height="2" fill="#9DC183" />
      <rect x="20" y="12" width="8" height="3" fill="#1A531A" />
      <rect x="21" y="12" width="5" height="2" fill="#228B22" />
      <rect x="19" y="15" width="10" height="4" fill="#1A531A" />
      <rect x="20" y="15" width="6" height="2" fill="#228B22" />
      <rect x="5" y="26" width="1" height="1" fill="#FAF6EE" />
      <rect x="26" y="26" width="1" height="1" fill="#F2A7B5" />
    </svg>
  );
}

export function PixelBellCheckIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="pixel-art shrink-0" aria-hidden="true">
      <rect x="7" y="1" width="2" height="2" fill="currentColor" />
      <rect x="5" y="3" width="6" height="2" fill="currentColor" />
      <rect x="4" y="5" width="8" height="5" fill="currentColor" />
      <rect x="3" y="10" width="10" height="2" fill="currentColor" />
      <rect x="6" y="13" width="4" height="2" fill="currentColor" />
      <rect x="6" y="7" width="1" height="1" fill="#FAF6EE" />
      <rect x="7" y="8" width="1" height="1" fill="#FAF6EE" />
      <rect x="8" y="7" width="1" height="1" fill="#FAF6EE" />
      <rect x="9" y="6" width="1" height="1" fill="#FAF6EE" />
    </svg>
  );
}

export function WaterDropletSprite({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="pixel-art" aria-hidden="true">
      <rect x="7" y="2" width="2" height="2" fill="#87CEEB" />
      <rect x="6" y="4" width="4" height="2" fill="#87CEEB" />
      <rect x="5" y="6" width="6" height="4" fill="#87CEEB" />
      <rect x="6" y="10" width="4" height="2" fill="#5BA8CC" />
      <rect x="7" y="12" width="2" height="1" fill="#5BA8CC" />
      <rect x="6" y="6" width="1" height="3" fill="#FAF6EE" />
    </svg>
  );
}

export function CategoryPixelIcon({
  category,
  size = 16,
}: {
  category: HabitCategory;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="pixel-art shrink-0" aria-hidden="true">
      {category === 'Study' && (
        <>
          <rect x="3" y="3" width="10" height="10" fill="#1A531A" />
          <rect x="4" y="4" width="8" height="8" fill="#FAF6EE" />
          <rect x="7" y="4" width="2" height="8" fill="#D2B48C" />
          <rect x="5" y="6" width="1" height="1" fill="#1A531A" />
          <rect x="10" y="6" width="1" height="1" fill="#1A531A" />
        </>
      )}
      {category === 'Health' && (
        <>
          <rect x="4" y="4" width="3" height="3" fill="#228B22" />
          <rect x="9" y="4" width="3" height="3" fill="#228B22" />
          <rect x="3" y="6" width="10" height="3" fill="#228B22" />
          <rect x="5" y="9" width="6" height="2" fill="#1A531A" />
          <rect x="7" y="11" width="2" height="2" fill="#1A531A" />
        </>
      )}
      {category === 'Routines' && (
        <>
          <rect x="6" y="2" width="4" height="2" fill="#D2B48C" />
          <rect x="4" y="4" width="8" height="8" fill="#9DC183" />
          <rect x="7" y="5" width="2" height="4" fill="#1A531A" />
          <rect x="8" y="8" width="3" height="2" fill="#1A531A" />
        </>
      )}
      {category === 'Creative' && (
        <>
          <rect x="7" y="2" width="2" height="2" fill="#87CEEB" />
          <rect x="5" y="4" width="6" height="4" fill="#E88D96" />
          <rect x="7" y="5" width="2" height="2" fill="#FAF6EE" />
          <rect x="7" y="8" width="2" height="5" fill="#228B22" />
        </>
      )}
    </svg>
  );
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="pixel-art shrink-0"
      style={{ opacity: unlocked ? 1 : 0.35 }}
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" fill={unlocked ? '#FAF6EE' : '#E8E3D8'} />
      <rect x="4" y="2" width="16" height="2" fill="#1A531A" />
      <rect x="4" y="20" width="16" height="2" fill="#1A531A" />
      <rect x="2" y="4" width="2" height="16" fill="#1A531A" />
      <rect x="20" y="4" width="2" height="16" fill="#1A531A" />

      {iconType === 'sprout' && (
        <>
          <rect x="11" y="10" width="2" height="7" fill="#228B22" />
          <rect x="8" y="9" width="3" height="2" fill="#9DC183" />
          <rect x="13" y="8" width="3" height="2" fill="#9DC183" />
          <rect x="9" y="16" width="6" height="2" fill="#6F4E37" />
        </>
      )}
      {iconType === 'path' && (
        <>
          <rect x="9" y="6" width="6" height="3" fill="#D2B48C" />
          <rect x="10" y="9" width="6" height="3" fill="#B8976C" />
          <rect x="8" y="12" width="6" height="3" fill="#D2B48C" />
          <rect x="7" y="15" width="7" height="3" fill="#B8976C" />
        </>
      )}
      {iconType === 'sapling' && (
        <>
          <rect x="11" y="13" width="2" height="5" fill="#6F4E37" />
          <rect x="8" y="8" width="8" height="6" fill="#228B22" />
          <rect x="10" y="6" width="4" height="3" fill="#9DC183" />
        </>
      )}
      {iconType === 'bloom' && (
        <>
          <rect x="10" y="7" width="4" height="2" fill="#E88D96" />
          <rect x="8" y="9" width="8" height="4" fill="#F4B6C2" />
          <rect x="10" y="13" width="4" height="2" fill="#E88D96" />
          <rect x="11" y="10" width="2" height="2" fill="#F2C14E" />
          <rect x="11" y="15" width="2" height="3" fill="#228B22" />
        </>
      )}
      {iconType === 'plots' && (
        <>
          <rect x="6" y="7" width="5" height="5" fill="#9DC183" />
          <rect x="13" y="7" width="5" height="5" fill="#228B22" />
          <rect x="6" y="13" width="5" height="5" fill="#D2B48C" />
          <rect x="13" y="13" width="5" height="5" fill="#87CEEB" />
        </>
      )}
      {iconType === 'canopy' && (
        <>
          <rect x="10" y="14" width="4" height="4" fill="#5A3F2B" />
          <rect x="6" y="6" width="12" height="8" fill="#1A531A" />
          <rect x="8" y="5" width="8" height="4" fill="#228B22" />
          <rect x="9" y="8" width="2" height="2" fill="#F2C14E" />
          <rect x="13" y="10" width="2" height="2" fill="#87CEEB" />
        </>
      )}
    </svg>
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
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className={`pixel-art ${className}`}
        aria-hidden="true"
      >
        <rect x="5" y="20" width="22" height="7" fill="#8B6347" opacity="0.55" />
        <rect x="7" y="22" width="18" height="3" fill="#6F4E37" opacity="0.55" />
        <rect x="8" y="21" width="5" height="1" fill="#D2B48C" opacity="0.6" />
        <rect x="17" y="24" width="6" height="1" fill="#D2B48C" opacity="0.6" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`pixel-art ${className}`}
      aria-hidden="true"
    >
      {stage === -1 && (
        <>
          <rect x="6" y="21" width="20" height="6" fill="#5A4A3A" />
          <rect x="8" y="20" width="16" height="2" fill="#7A6650" />
          <rect x="8" y="13" width="2" height="8" fill="#5B6E43" />
          <rect x="6" y="15" width="2" height="3" fill="#76885B" />
          <rect x="10" y="14" width="2" height="2" fill="#465432" />
          <rect x="14" y="10" width="3" height="11" fill="#465432" />
          <rect x="12" y="12" width="2" height="3" fill="#76885B" />
          <rect x="17" y="13" width="2" height="3" fill="#5B6E43" />
          <rect x="21" y="12" width="2" height="9" fill="#5B6E43" />
          <rect x="23" y="15" width="2" height="3" fill="#76885B" />
          <rect x="19" y="16" width="2" height="2" fill="#465432" />
          <rect x="14" y="9" width="2" height="2" fill="#B8976C" />
          <rect x="21" y="11" width="2" height="1" fill="#B8976C" />
        </>
      )}

      {stage >= 0 && (
        <>
          {stage >= 2 && (
            <>
              <rect x="11" y="25" width="10" height="5" fill="#D2B48C" />
              <rect x="12" y="27" width="8" height="3" fill="#E3C9A8" />
            </>
          )}
          {stage === 3 && (
            <>
              <rect x="4" y="24" width="24" height="5" fill="#9DC183" opacity="0.6" />
              <rect x="10" y="24" width="12" height="6" fill="#D2B48C" />
              <rect x="12" y="26" width="8" height="4" fill="#E3C9A8" />
            </>
          )}
          <rect x="7" y="21" width="18" height="5" fill="#6F4E37" />
          <rect x="9" y="20" width="14" height="2" fill="#8B6347" />
          <rect x="8" y="23" width="4" height="1" fill="#4A3321" />
          <rect x="14" y="23" width="5" height="1" fill="#4A3321" />
          <rect x="20" y="23" width="4" height="1" fill="#4A3321" />
        </>
      )}

      {stage === 0 && (
        <>
          <rect x="11" y="19" width="2" height="2" fill="#D2B48C" />
          <rect x="15" y="18" width="2" height="2" fill="#FAF6EE" />
          <rect x="19" y="19" width="2" height="2" fill="#D2B48C" />
          <rect x="13" y="21" width="2" height="1" fill="#E3C9A8" />
          <rect x="17" y="21" width="2" height="1" fill="#E3C9A8" />
        </>
      )}

      {stage === 1 && (
        <>
          <rect x="15" y="15" width="2" height="6" fill="#228B22" />
          <rect x="12" y="14" width="3" height="2" fill="#9DC183" />
          <rect x="17" y="13" width="3" height="2" fill="#9DC183" />
          <rect x="13" y="15" width="2" height="1" fill="#228B22" />
          <rect x="17" y="14" width="2" height="1" fill="#228B22" />
          <rect x="18" y="12" width="1" height="1" fill="#87CEEB" />
        </>
      )}

      {stage === 2 && (
        <>
          <rect x="15" y="14" width="2" height="7" fill="#6F4E37" />
          <rect x="13" y="15" width="2" height="1" fill="#6F4E37" />
          <rect x="17" y="14" width="2" height="1" fill="#6F4E37" />
          <rect x="11" y="9" width="10" height="7" fill="#228B22" />
          <rect x="13" y="7" width="6" height="3" fill="#9DC183" />
          <rect x="10" y="11" width="3" height="4" fill="#1A531A" />
          <rect x="19" y="11" width="3" height="4" fill="#1A531A" />
          <rect x="12" y="10" width="2" height="2" fill={spriteType === 'cherry_blossom' ? '#F2A7B5' : '#FAF6EE'} />
          <rect x="18" y="12" width="2" height="2" fill={spriteType === 'cherry_blossom' ? '#F2A7B5' : '#87CEEB'} />
        </>
      )}

      {stage === 3 && spriteType === 'pine' && (
        <>
          <rect x="14" y="17" width="4" height="6" fill="#5A3F2B" />
          <rect x="15" y="2" width="2" height="2" fill="#228B22" />
          <rect x="13" y="4" width="6" height="3" fill="#228B22" />
          <rect x="14" y="4" width="3" height="2" fill="#9DC183" />
          <rect x="10" y="7" width="12" height="4" fill="#1A531A" />
          <rect x="12" y="7" width="7" height="3" fill="#228B22" />
          <rect x="8" y="11" width="16" height="4" fill="#1A531A" />
          <rect x="10" y="11" width="10" height="3" fill="#228B22" />
          <rect x="6" y="15" width="20" height="3" fill="#1A531A" />
          <rect x="9" y="15" width="12" height="2" fill="#228B22" />
          <rect x="7" y="22" width="2" height="2" fill="#FAF6EE" />
          <rect x="23" y="21" width="2" height="2" fill="#87CEEB" />
        </>
      )}

      {stage === 3 && spriteType === 'cherry_blossom' && (
        <>
          <rect x="14" y="15" width="4" height="8" fill="#5A3F2B" />
          <rect x="12" y="14" width="3" height="2" fill="#5A3F2B" />
          <rect x="17" y="13" width="3" height="2" fill="#5A3F2B" />
          <rect x="7" y="6" width="18" height="9" fill="#E88D96" />
          <rect x="9" y="4" width="14" height="4" fill="#F4B6C2" />
          <rect x="6" y="9" width="4" height="5" fill="#D97280" />
          <rect x="22" y="9" width="4" height="5" fill="#D97280" />
          <rect x="11" y="7" width="5" height="3" fill="#FAF6EE" />
          <rect x="17" y="10" width="4" height="2" fill="#FAF6EE" />
          <rect x="10" y="13" width="3" height="2" fill="#9DC183" />
          <rect x="19" y="13" width="3" height="2" fill="#9DC183" />
          <rect x="9" y="25" width="1" height="1" fill="#F4B6C2" />
          <rect x="21" y="26" width="1" height="1" fill="#F4B6C2" />
        </>
      )}

      {stage === 3 && spriteType === 'oak_lantern' && (
        <>
          <rect x="14" y="15" width="4" height="8" fill="#5A3F2B" />
          <rect x="11" y="14" width="3" height="2" fill="#5A3F2B" />
          <rect x="7" y="5" width="18" height="10" fill="#1A531A" />
          <rect x="9" y="4" width="14" height="5" fill="#228B22" />
          <rect x="10" y="6" width="8" height="4" fill="#9DC183" />
          <rect x="6" y="8" width="3" height="5" fill="#1A531A" />
          <rect x="23" y="8" width="3" height="5" fill="#1A531A" />
          <rect x="10" y="15" width="1" height="2" fill="#4A3321" />
          <rect x="9" y="17" width="3" height="3" fill="#F2C14E" />
          <rect x="10" y="18" width="1" height="1" fill="#FAF6EE" />
        </>
      )}

      {stage === 3 && spriteType === 'wildflower_arch' && (
        <>
          <rect x="8" y="10" width="2" height="12" fill="#6F4E37" />
          <rect x="22" y="10" width="2" height="12" fill="#6F4E37" />
          <rect x="9" y="7" width="14" height="3" fill="#8B6347" />
          <rect x="7" y="8" width="4" height="9" fill="#228B22" />
          <rect x="21" y="8" width="4" height="9" fill="#228B22" />
          <rect x="10" y="5" width="12" height="4" fill="#9DC183" />
          <rect x="11" y="6" width="2" height="2" fill="#F4B6C2" />
          <rect x="15" y="5" width="2" height="2" fill="#87CEEB" />
          <rect x="19" y="6" width="2" height="2" fill="#F2C14E" />
        </>
      )}

      {stage === 3 && spriteType === 'herb_garden' && (
        <>
          <rect x="6" y="16" width="20" height="6" fill="#8B6347" />
          <rect x="7" y="17" width="18" height="4" fill="#5A3F2B" />
          <rect x="8" y="11" width="5" height="6" fill="#228B22" />
          <rect x="9" y="9" width="3" height="3" fill="#9DC183" />
          <rect x="14" y="10" width="4" height="7" fill="#1A531A" />
          <rect x="15" y="8" width="2" height="2" fill="#87CEEB" />
          <rect x="19" y="12" width="5" height="5" fill="#228B22" />
          <rect x="20" y="10" width="2" height="2" fill="#F4B6C2" />
        </>
      )}

      {stage === 3 && spriteType === 'cedar_shrine' && (
        <>
          <rect x="6" y="8" width="5" height="13" fill="#1A531A" />
          <rect x="7" y="6" width="3" height="4" fill="#228B22" />
          <rect x="21" y="8" width="5" height="13" fill="#1A531A" />
          <rect x="22" y="6" width="3" height="4" fill="#228B22" />
          <rect x="14" y="13" width="4" height="9" fill="#D2B48C" />
          <rect x="12" y="11" width="8" height="3" fill="#B8976C" />
          <rect x="15" y="15" width="2" height="2" fill="#F2C14E" />
          <rect x="13" y="20" width="6" height="2" fill="#9DC183" />
        </>
      )}
    </svg>
  );
}
