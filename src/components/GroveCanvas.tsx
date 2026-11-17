import React from 'react';
import { Award, Check, CheckCircle2, Droplets, Flame, Plus, Shovel } from 'lucide-react';
import type { Habit, HabitLog, ReminderItem } from '../types/grove';
import {
  evaluatePlantState,
  getGroveLevel,
  getOverallStreak,
  PLANT_STAGE_LABELS,
  toLocalDateKey,
} from '../utils/groveLogic';
import {
  CategoryPixelIcon,
  PixelBellCheckIcon,
  PlotSprite,
  WaterDropletSprite,
} from './PixelSprites';

interface GroveCanvasProps {
  groveName: string;
  habits: Habit[];
  logs: HabitLog[];
  reminders: ReminderItem[];
  selectedPlotId: number | null;
  splashPlotId: number | null;
  reducedMotion: boolean;
  onSelectPlot: (plotId: number) => void;
  onOpenThrowSeeds: (plotId: number) => void;
  onWaterHabit: (habitId: string) => void;
  onPullWeeds: (habitId: string) => void;
  onOpenTodayDrawer: () => void;
}

// 16 tightly clustered cozy grove coordinates flanking the winding sand path
const LAND_COORDS: { left: string; top: string; size: number }[] = [
  // Row 1 (Center-back, closest to horizon)
  { left: '33%', top: '50%', size: 40 },
  { left: '42%', top: '48%', size: 40 },
  { left: '58%', top: '48%', size: 40 },
  { left: '67%', top: '50%', size: 40 },
  // Row 2
  { left: '30%', top: '60%', size: 44 },
  { left: '40%', top: '58%', size: 44 },
  { left: '60%', top: '58%', size: 44 },
  { left: '70%', top: '60%', size: 44 },
  // Row 3
  { left: '27%', top: '71%', size: 48 },
  { left: '38%', top: '69%', size: 48 },
  { left: '62%', top: '69%', size: 48 },
  { left: '73%', top: '71%', size: 48 },
  // Row 4 (Foreground closest to plots)
  { left: '24%', top: '83%', size: 52 },
  { left: '36%', top: '81%', size: 52 },
  { left: '64%', top: '81%', size: 52 },
  { left: '76%', top: '83%', size: 52 },
];

export function GroveCanvas({
  groveName,
  habits,
  logs,
  reminders,
  selectedPlotId,
  splashPlotId,
  reducedMotion,
  onSelectPlot,
  onOpenThrowSeeds,
  onWaterHabit,
  onPullWeeds,
  onOpenTodayDrawer,
}: GroveCanvasProps) {
  const todayKey = toLocalDateKey();
  const streak = getOverallStreak(habits, logs);
  const completedTotal = logs.filter((l) => l.watered).length;
  const wateredToday = logs.filter((l) => l.date === todayKey && l.watered).length;
  const level = getGroveLevel(logs);
  const doneReminders = reminders.filter((r) => r.done).length;

  const plotHabitMap = new Map<number, Habit>();
  habits.forEach((h) => plotHabitMap.set(h.plotId, h));

  const bloomCount = habits.filter((h) => evaluatePlantState(h, logs).stage === 3).length;

  return (
    <section
      id="grove"
      className="mx-auto max-w-[1040px] px-4 sm:px-8 pt-10 pb-6 space-y-5 scroll-mt-16"
      aria-label="Grove Farm"
    >
      {/* Grove Header + Compact Stat Pills + Single Today Drawer Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-[#1A531A]">
            {groveName}
          </h2>

          {/* Compact Stat Pills (0 until logged) */}
          <div className="flex flex-wrap items-center gap-2 font-mono-tabular text-xs">
            <span className="inline-flex items-center gap-1.5 border-2 border-[#1A531A] bg-[#FFFDF8] px-2.5 py-1 text-[#132A16]">
              <Flame className="h-3.5 w-3.5 text-[#D2B48C]" />
              <span>Streak</span>
              <strong className="text-[#1A531A]">{streak}d</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-[#1A531A] bg-[#FFFDF8] px-2.5 py-1 text-[#132A16]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#228B22]" />
              <span>Completed</span>
              <strong className="text-[#1A531A]">{completedTotal}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 border-2 border-[#1A531A] bg-[#FFFDF8] px-2.5 py-1 text-[#132A16]">
              <Award className="h-3.5 w-3.5 text-[#87CEEB]" />
              <span>Level</span>
              <strong className="text-[#1A531A]">{level}</strong>
            </span>
          </div>
        </div>

        {/* Single Today Slide-Out Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenTodayDrawer}
          className="pixel-btn-secondary inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0"
        >
          <PixelBellCheckIcon size={16} />
          <span>Today</span>
          <span className="font-mono-tabular text-xs text-[#228B22]">
            {doneReminders}/{reminders.length}
          </span>
        </button>
      </div>

      {/* Unified Grove Land + 4x4 Tilled Plots Frame */}
      <div className="pixel-frame overflow-hidden bg-[#8DB674]">
        {/* Living Grove Land Panorama — see all plant growth together as one piece of land */}
        <div className="relative h-[196px] sm:h-[236px] w-full border-b-4 border-[#6F4E37] overflow-hidden select-none">
          {/* Pixel Landscape Backdrop */}
          <svg
            viewBox="0 0 960 220"
            preserveAspectRatio="none"
            className="pixel-art absolute inset-0 h-full w-full pointer-events-none"
            aria-hidden="true"
          >
            {/* Blossom Sky Horizon */}
            <rect x="0" y="0" width="960" height="32" fill="#87CEEB" />
            <rect x="0" y="32" width="960" height="24" fill="#A9DCF0" />
            <rect x="0" y="56" width="960" height="22" fill="#CDECF7" />
            <rect x="0" y="78" width="960" height="14" fill="#FAF6EE" />

            {/* Sun */}
            <rect x="852" y="18" width="28" height="28" fill="#FAF6EE" />
            <rect x="856" y="22" width="20" height="20" fill="#F2C14E" />

            {/* Soft Pixel Clouds */}
            <rect x="110" y="24" width="66" height="10" fill="#FAF6EE" opacity="0.88" />
            <rect x="126" y="16" width="34" height="8" fill="#FFFDF8" opacity="0.92" />
            <rect x="520" y="20" width="84" height="10" fill="#FAF6EE" opacity="0.85" />
            <rect x="540" y="12" width="44" height="8" fill="#FFFDF8" opacity="0.9" />

            {/* Distant Forest Hills */}
            <rect x="0" y="74" width="160" height="18" fill="#1A531A" />
            <rect x="28" y="64" width="76" height="10" fill="#1A531A" />
            <rect x="140" y="78" width="210" height="14" fill="#228B22" />
            <rect x="330" y="82" width="300" height="10" fill="#9DC183" />
            <rect x="610" y="76" width="190" height="16" fill="#228B22" />
            <rect x="780" y="70" width="180" height="22" fill="#1A531A" />
            <rect x="830" y="60" width="90" height="10" fill="#1A531A" />

            {/* Rolling Meadow Turf */}
            <rect x="0" y="90" width="960" height="46" fill="#9DC183" />
            <rect x="0" y="136" width="960" height="84" fill="#8DB674" />

            {/* Grass Texture Tufts */}
            <rect x="76" y="106" width="10" height="3" fill="#228B22" opacity="0.45" />
            <rect x="234" y="122" width="12" height="3" fill="#228B22" opacity="0.45" />
            <rect x="712" y="114" width="10" height="3" fill="#228B22" opacity="0.45" />
            <rect x="842" y="128" width="12" height="3" fill="#228B22" opacity="0.45" />
            <rect x="144" y="182" width="12" height="3" fill="#1A531A" opacity="0.35" />
            <rect x="794" y="190" width="12" height="3" fill="#1A531A" opacity="0.35" />

            {/* Winding Warm Sand Footpath Down to Plots */}
            <rect x="456" y="90" width="48" height="18" fill="#D2B48C" />
            <rect x="450" y="108" width="60" height="22" fill="#E3C9A8" />
            <rect x="442" y="130" width="76" height="26" fill="#D2B48C" />
            <rect x="434" y="156" width="92" height="32" fill="#E3C9A8" />
            <rect x="426" y="188" width="108" height="32" fill="#D2B48C" />
            {/* Path stepping stone details */}
            <rect x="472" y="116" width="14" height="5" fill="#B8976C" opacity="0.55" />
            <rect x="462" y="144" width="18" height="6" fill="#B8976C" opacity="0.55" />
            <rect x="484" y="170" width="20" height="6" fill="#B8976C" opacity="0.55" />
            <rect x="460" y="196" width="22" height="7" fill="#B8976C" opacity="0.55" />

            {/* Wooden Fence Posts Along Meadow Edge */}
            {[24, 136, 248, 360, 600, 712, 824, 932].map((fx) => (
              <g key={fx}>
                <rect x={fx} y="78" width="6" height="16" fill="#6F4E37" />
                <rect x={fx + 1} y="78" width="2" height="16" fill="#8B6347" />
              </g>
            ))}
            <rect x="24" y="83" width="342" height="3" fill="#8B6347" />
            <rect x="600" y="83" width="338" height="3" fill="#8B6347" />

            {/* Cozy Framing Bushes & Pines Along Far Meadow Sides */}
            <rect x="34" y="138" width="24" height="14" fill="#1A531A" opacity="0.55" />
            <rect x="40" y="132" width="12" height="6" fill="#228B22" opacity="0.65" />
            <rect x="96" y="172" width="28" height="14" fill="#1A531A" opacity="0.5" />
            <rect x="104" y="166" width="14" height="6" fill="#228B22" opacity="0.6" />
            <rect x="902" y="138" width="24" height="14" fill="#1A531A" opacity="0.55" />
            <rect x="908" y="132" width="12" height="6" fill="#228B22" opacity="0.65" />
            <rect x="836" y="172" width="28" height="14" fill="#1A531A" opacity="0.5" />
            <rect x="842" y="166" width="14" height="6" fill="#228B22" opacity="0.6" />
          </svg>

          {/* Compact Land HUD Strip */}
          <div className="relative z-20 flex items-center justify-between px-3 py-1.5 font-mono-tabular text-[11px] text-[#132A16]">
            <span className="inline-flex items-center gap-2 border border-[#1A531A]/40 bg-[#FAF6EE]/90 px-2 py-0.5 font-semibold">
              <span>{habits.length}/16 Growing</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#228B22]">{bloomCount} Blooms</span>
            </span>
            <span className="border border-[#1A531A]/40 bg-[#FAF6EE]/90 px-2 py-0.5 font-semibold">
              {wateredToday} Watered
            </span>
          </div>

          {/* Interactive Plant Sprites Standing Directly on the Land */}
          <div className="absolute inset-0 z-10">
            {LAND_COORDS.map((pos, plotId) => {
              const habit = plotHabitMap.get(plotId);
              const plant = habit ? evaluatePlantState(habit, logs) : null;
              const isSelected = selectedPlotId === plotId;
              const isSplashing = splashPlotId === plotId && !reducedMotion;
              const spriteSize = pos.size;

              return (
                <button
                  key={`land-plot-${plotId}`}
                  type="button"
                  onClick={() => (habit ? onSelectPlot(plotId) : onOpenThrowSeeds(plotId))}
                  title={
                    habit && plant
                      ? `${habit.title} (${PLANT_STAGE_LABELS[plant.stage]})`
                      : `Plot #${plotId + 1} — Throw Seeds`
                  }
                  aria-label={
                    habit && plant
                      ? `${habit.title} on land (${PLANT_STAGE_LABELS[plant.stage]})`
                      : `Empty soil plot ${plotId + 1} on land`
                  }
                  style={{ left: pos.left, top: pos.top }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform focus-visible:outline-2 focus-visible:outline-[#1A531A] ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105'
                  }`}
                >
                  {habit && plant ? (
                    <div className="relative flex flex-col items-center">
                      <PlotSprite
                        spriteType={habit.spriteType}
                        stage={plant.stage}
                        size={spriteSize}
                        className={
                          !reducedMotion && plant.stage === 3 ? 'animate-gentle-sway' : ''
                        }
                      />

                      {isSplashing && (
                        <div
                          className="pointer-events-none absolute -top-2 inset-x-0 flex justify-center"
                          aria-hidden="true"
                        >
                          <div className="animate-water-splash">
                            <WaterDropletSprite size={22} />
                          </div>
                        </div>
                      )}

                      {isSelected && (
                        <span className="mt-0.5 border border-[#1A531A] bg-[#FAF6EE] px-1.5 py-0.2 font-pixel text-[10px] font-bold text-[#1A531A] shadow-[1px_1px_0px_#1A531A] whitespace-nowrap">
                          {habit.title}
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Subtle empty tilled soil mound on the meadow */
                    <span
                      className={`block h-2.5 w-6 sm:w-7 border border-[#5A3F2B] bg-[#6F4E37]/80 transition-colors ${
                        isSelected
                          ? 'ring-2 ring-[#FAF6EE] bg-[#8B6347]'
                          : 'group-hover:bg-[#8B6347]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive 4x4 Tilled Soil Plots Below */}
        <div className="p-3 sm:p-5 bg-[#7EA864]">
          <div className="relative mx-auto max-w-[740px] p-2 border-2 border-[#6F4E37]/45 bg-[#6E9955]/55">
            {/* Warm Sand Path Crosshair */}
            <div
              className="pointer-events-none absolute inset-y-2 left-1/2 w-5 -translate-x-1/2 bg-[#D2B48C]/80 border-x border-[#B8976C]/70"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-2 top-1/2 h-5 -translate-y-1/2 bg-[#D2B48C]/80 border-y border-[#B8976C]/70"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Array.from({ length: 16 }, (_, plotId) => {
                const habit = plotHabitMap.get(plotId);
                const plant = habit ? evaluatePlantState(habit, logs) : null;
                const isSelected = selectedPlotId === plotId;
                const isSplashing = splashPlotId === plotId && !reducedMotion;

                return (
                  <div
                    key={plotId}
                    className={`group relative flex flex-col justify-between p-2 min-h-[106px] border-2 transition-all ${
                      isSelected
                        ? 'border-[#1A531A] bg-[#FAF6EE] shadow-[3px_3px_0px_#1A531A] -translate-x-0.5 -translate-y-0.5'
                        : plant?.stage === -1
                        ? 'border-[#5A3F2B] bg-[#D9CCB8] hover:border-[#1A531A]'
                        : plant?.wateredToday
                        ? 'border-[#1A531A] bg-[#EAF2DF] hover:bg-[#FAF6EE]'
                        : 'border-[#6F4E37] bg-[#E8DCC4] hover:border-[#1A531A] hover:bg-[#FAF6EE]'
                    }`}
                  >
                  {/* Top Row: Plot ID + Direct Action / Status */}
                  <div className="flex w-full items-center justify-between gap-1 text-[11px] font-mono-tabular">
                    <span className="text-[#4A3321] font-semibold">
                      #{String(plotId + 1).padStart(2, '0')}
                    </span>

                    {habit && plant ? (
                      plant.stage === -1 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlot(plotId);
                            onPullWeeds(habit.id);
                          }}
                          className="inline-flex items-center gap-1 border border-[#6F4E37] bg-[#D2B48C]/60 px-1.5 py-0.5 text-[10px] font-semibold text-[#132A16] hover:bg-[#D2B48C]"
                        >
                          <Shovel className="h-3 w-3" />
                          Clear
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlot(plotId);
                            onWaterHabit(habit.id);
                          }}
                          aria-label={
                            plant.wateredToday
                              ? `${habit.title} watered`
                              : `Water ${habit.title}`
                          }
                          className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                            plant.wateredToday
                              ? 'border-[#228B22] bg-[#228B22] text-[#FAF6EE]'
                              : 'border-[#1A531A]/45 bg-[#FFFDF8] text-[#1A531A] hover:bg-[#87CEEB]/45'
                          }`}
                        >
                          {plant.wateredToday ? (
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          ) : (
                            <Droplets className="h-3 w-3 text-[#228B22]" />
                          )}
                          <span>{plant.wateredToday ? 'Done' : 'Water'}</span>
                        </button>
                      )
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-[#5A3F2B]/65 group-hover:text-[#1A531A]" />
                    )}
                  </div>

                  {/* Clickable Tilled Soil Center */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!habit) {
                        onOpenThrowSeeds(plotId);
                      } else {
                        onSelectPlot(plotId);
                      }
                    }}
                    aria-label={
                      habit && plant
                        ? `Inspect ${habit.title} (${PLANT_STAGE_LABELS[plant.stage]})`
                        : `Plant seeds on Plot ${plotId + 1}`
                    }
                    className="flex flex-1 flex-col items-center justify-center py-1 focus-visible:outline-2 focus-visible:outline-[#1A531A]"
                  >
                    <div className="relative flex items-center justify-center">
                      <PlotSprite
                        spriteType={habit?.spriteType ?? 'cherry_blossom'}
                        stage={plant ? plant.stage : 0}
                        empty={!habit}
                        size={62}
                        className={
                          !reducedMotion && plant?.stage === 3 ? 'animate-gentle-sway' : ''
                        }
                      />

                      {isSplashing && (
                        <div
                          className="pointer-events-none absolute -top-2 inset-x-0 flex justify-center"
                          aria-hidden="true"
                        >
                          <div className="animate-water-splash">
                            <WaterDropletSprite size={28} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-1 flex w-full items-center justify-center gap-1 truncate text-[11px] font-semibold text-[#132A16]">
                      {habit ? (
                        <>
                          <CategoryPixelIcon category={habit.category} size={12} />
                          <span className="truncate max-w-[115px]">{habit.title}</span>
                        </>
                      ) : (
                        <span className="text-[#5A3F2B] font-medium">Throw Seeds</span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
