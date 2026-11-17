import React, { useEffect, useState } from 'react';
import { Check, Droplets, History, RotateCcw, Shovel, Trash2 } from 'lucide-react';
import type { Habit, HabitLog, PlantStage } from '../types/grove';
import {
  evaluatePlantState,
  formatShortDate,
  getHabitCheckInLogs,
  PLANT_STAGE_LABELS,
} from '../utils/groveLogic';
import { CategoryPixelIcon, PLOT_SPRITE_NAMES, PlotSprite } from './PixelSprites';

interface PlantInspectorProps {
  habits: Habit[];
  logs: HabitLog[];
  selectedPlotId: number | null;
  onSelectPlot: (plotId: number) => void;
  onPlantFirst: () => void;
  onWaterHabit: (habitId: string) => void;
  onPullWeeds: (habitId: string) => void;
  onRemoveHabit: (habitId: string) => void;
}

const HEALTHY_STAGES: PlantStage[] = [0, 1, 2, 3];

export function PlantInspector({
  habits,
  logs,
  selectedPlotId,
  onSelectPlot,
  onPlantFirst,
  onWaterHabit,
  onPullWeeds,
  onRemoveHabit,
}: PlantInspectorProps) {
  const activeHabit =
    habits.find((h) => h.plotId === selectedPlotId) ?? habits[0] ?? null;

  const plantState = activeHabit ? evaluatePlantState(activeHabit, logs) : null;
  const checkIns = activeHabit ? getHabitCheckInLogs(activeHabit, logs) : [];

  const [scrubStage, setScrubStage] = useState<PlantStage>(plantState?.stage ?? 0);
  const [logOpen, setLogOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    if (plantState) {
      setScrubStage(plantState.stage);
    }
    setConfirmRemove(false);
  }, [activeHabit?.id, plantState?.stage]);

  return (
    <section
      id="inspector"
      className="mx-auto max-w-[1040px] px-4 sm:px-8 py-6 scroll-mt-16"
      aria-label="Per-Habit Plant Growth Inspector"
    >
      <div className="pixel-frame p-4 sm:p-6 bg-[#FFFDF8]">
        {/* Section Header + Log Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1A531A]/15 pb-3 mb-4">
          <h2 className="font-pixel text-2xl font-bold text-[#1A531A]">Plant Growth</h2>

          {activeHabit && (
            <button
              type="button"
              onClick={() => setLogOpen((prev) => !prev)}
              aria-expanded={logOpen}
              className="pixel-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
            >
              <History className="h-3.5 w-3.5" />
              <span>Log</span>
              <span className="font-mono-tabular text-[#228B22]">{checkIns.length}</span>
            </button>
          )}
        </div>

        {habits.length === 0 || !activeHabit || !plantState ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center border-2 border-[#1A531A] bg-[#0C180E] py-10 px-4 text-center">
            <PlotSprite spriteType="cherry_blossom" stage={0} empty size={56} />
            <p className="mt-2 font-pixel text-lg font-bold text-[#FAF6EE]">0 Plants</p>
            <button
              type="button"
              onClick={onPlantFirst}
              className="pixel-btn-primary mt-4 px-4 py-2 text-xs font-semibold"
            >
              Throw Seeds
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Clickable Plant Sprite Strip (1-to-1 Habit Switcher) */}
            <div className="flex gap-2 overflow-x-auto pb-1" role="listbox" aria-label="Planted habits">
              {habits.map((h) => {
                const st = evaluatePlantState(h, logs);
                const selected = h.id === activeHabit.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelectPlot(h.plotId)}
                    className={`shrink-0 flex items-center gap-2.5 border-2 px-3 py-2 transition-all ${
                      selected
                        ? 'border-[#1A531A] bg-[#9DC183]/30 shadow-[2px_2px_0px_#1A531A]'
                        : 'border-[#1A531A]/25 bg-[#FAF6EE] hover:border-[#1A531A]/60'
                    }`}
                  >
                    <PlotSprite spriteType={h.spriteType} stage={st.stage} size={32} />
                    <div className="text-left">
                      <div className="max-w-[110px] truncate text-xs font-semibold text-[#132A16]">
                        {h.title}
                      </div>
                      <div className="font-mono-tabular text-[10px] text-[#4A634D]">
                        {PLANT_STAGE_LABELS[st.stage]} · {st.streak}d
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dark-Canopy (#1A531A Framed) Pixel Monitor */}
            <div className="border-4 border-[#1A531A] bg-[#0C180E] p-4 sm:p-5 text-[#FAF6EE] shadow-[4px_4px_0px_#1A531A]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Plant Sprite Screen */}
                <div className="md:col-span-4 flex flex-col items-center justify-center border-2 border-[#9DC183]/35 bg-[#132A16]/75 p-4">
                  <PlotSprite
                    spriteType={activeHabit.spriteType}
                    stage={scrubStage}
                    size={112}
                    className={scrubStage === 3 ? 'animate-gentle-sway' : ''}
                  />
                  {scrubStage !== plantState.stage && (
                    <button
                      type="button"
                      onClick={() => setScrubStage(plantState.stage)}
                      className="mt-2 inline-flex items-center gap-1 border border-[#9DC183]/50 px-2.5 py-1 font-mono-tabular text-[10px] text-[#9DC183] hover:bg-[#9DC183]/15"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Live ({PLANT_STAGE_LABELS[plantState.stage]})
                    </button>
                  )}
                </div>

                {/* Stage Badge, Counters & Scrubber */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#9DC183]/25 pb-3">
                    <div>
                      <div className="flex items-center gap-2 font-mono-tabular text-xs text-[#9DC183]">
                        <CategoryPixelIcon category={activeHabit.category} size={14} />
                        <span>{activeHabit.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{PLOT_SPRITE_NAMES[activeHabit.spriteType]}</span>
                      </div>
                      <h3 className="mt-0.5 font-pixel text-2xl font-bold text-[#FAF6EE]">
                        {activeHabit.title}
                      </h3>
                    </div>

                    {/* Stage Badge */}
                    <span className="border-2 border-[#D2B48C] bg-[#132A16] px-3 py-1 font-pixel text-base font-bold text-[#D2B48C]">
                      {PLANT_STAGE_LABELS[scrubStage]}
                    </span>
                  </div>

                  {/* Numeric Counters + Growth Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono-tabular text-xs">
                      <span className="text-[#9DC183]">
                        {plantState.streak}d streak · {plantState.totalWatered} watered
                      </span>
                      <span className="text-[#D2B48C]">{plantState.progressToNext}%</span>
                    </div>
                    <div className="h-2.5 w-full border border-[#9DC183]/50 bg-[#060D07]">
                      <div
                        className="h-full bg-[#228B22] transition-all duration-300"
                        style={{ width: `${plantState.progressToNext}%` }}
                      />
                    </div>
                  </div>

                  {/* Visual Stage Scrubber */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-1.5">
                      {HEALTHY_STAGES.map((st) => {
                        const active = scrubStage === st;
                        const isLive = plantState.stage === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setScrubStage(st)}
                            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border font-pixel text-xs transition-colors ${
                              active
                                ? 'border-[#D2B48C] bg-[#228B22] text-[#FAF6EE] font-bold'
                                : 'border-[#9DC183]/30 bg-[#132A16]/60 text-[#FAF6EE]/75 hover:border-[#9DC183]'
                            }`}
                          >
                            <span>{PLANT_STAGE_LABELS[st]}</span>
                            {isLive && (
                              <span className="font-mono-tabular text-[9px] text-[#D2B48C]">•</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="range"
                      min={plantState.stage === -1 ? -1 : 0}
                      max={3}
                      step={1}
                      value={scrubStage}
                      aria-label="Growth stage scrubber"
                      onChange={(e) => setScrubStage(Number(e.target.value) as PlantStage)}
                      className="w-full accent-[#9DC183] cursor-pointer"
                    />
                  </div>

                  {/* Direct Care Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2.5">
                      {plantState.stage === -1 ? (
                        <button
                          type="button"
                          onClick={() => onPullWeeds(activeHabit.id)}
                          className="pixel-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
                        >
                          <Shovel className="h-3.5 w-3.5" />
                          Pull Weeds
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onWaterHabit(activeHabit.id)}
                          className="pixel-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
                        >
                          {plantState.wateredToday ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Watered Today
                            </>
                          ) : (
                            <>
                              <Droplets className="h-3.5 w-3.5" />
                              Water Today
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {confirmRemove ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onRemoveHabit(activeHabit.id);
                            setConfirmRemove(false);
                          }}
                          className="border border-[#F87171] bg-[#991B1B] px-2.5 py-1.5 text-xs font-semibold text-[#FAF6EE]"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRemove(false)}
                          className="border border-[#9DC183]/40 px-2.5 py-1.5 text-xs text-[#9DC183]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(true)}
                        aria-label="Remove plant"
                        className="inline-flex h-8 w-8 items-center justify-center border border-[#9DC183]/35 text-[#9DC183] hover:border-[#F87171] hover:text-[#F87171]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Visual Check-In History (Toggled by Log button) */}
              {logOpen && (
                <div className="mt-4 border-t border-[#9DC183]/25 pt-3">
                  {checkIns.length === 0 ? (
                    <div className="font-mono-tabular text-xs text-[#9DC183]/70">
                      0 check-ins logged
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {checkIns.slice(0, 14).map((entry) => (
                        <span
                          key={entry.id}
                          className="inline-flex items-center gap-1.5 border border-[#9DC183]/35 bg-[#132A16] px-2.5 py-1 font-mono-tabular text-[11px] text-[#FAF6EE]"
                        >
                          <Droplets className="h-3 w-3 text-[#87CEEB]" />
                          <span>{formatShortDate(entry.date)}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
