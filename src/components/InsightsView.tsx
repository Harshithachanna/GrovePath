import React, { useMemo, useState } from 'react';
import type { Habit, HabitCategory, HabitLog, PlantStage } from '../types/grove';
import {
  evaluatePlantState,
  formatShortDate,
  getGrowthAnalysisSeries,
  getGroveBadges,
  getOffsetDateKey,
  getOverallStreak,
  PLANT_STAGE_LABELS,
} from '../utils/groveLogic';
import { BadgePixelSprite, PlotSprite } from './PixelSprites';

interface InsightsViewProps {
  habits: Habit[];
  logs: HabitLog[];
}

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  Study: '#1A531A',
  Health: '#228B22',
  Routines: '#D2B48C',
  Creative: '#87CEEB',
};

type WindowDays = 7 | 14 | 30;
type ChartMode = 'growth' | 'daily';

const STAGE_BANDS: { pct: number; label: string }[] = [
  { pct: 0, label: 'Seed' },
  { pct: 17, label: 'Sprout' },
  { pct: 50, label: 'Sapling' },
  { pct: 100, label: 'Bloom' },
];

export function InsightsView({ habits, logs }: InsightsViewProps) {
  const [windowDays, setWindowDays] = useState<WindowDays>(14);
  const [chartMode, setChartMode] = useState<ChartMode>('growth');
  const [scopeHabitId, setScopeHabitId] = useState<string>('all');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const today = useMemo(() => new Date(), []);

  const effectiveScopeId = useMemo(() => {
    if (scopeHabitId === 'all') return 'all';
    return habits.some((h) => h.id === scopeHabitId) ? scopeHabitId : 'all';
  }, [habits, scopeHabitId]);

  const series = useMemo(
    () => getGrowthAnalysisSeries(habits, logs, windowDays, effectiveScopeId, today),
    [habits, logs, windowDays, effectiveScopeId, today]
  );

  const activeIndex =
    hoverIdx !== null && hoverIdx >= 0 && hoverIdx < series.length
      ? hoverIdx
      : Math.max(0, series.length - 1);
  const activePoint = series[activeIndex];

  // Summary KPI values
  const kpis = useMemo(() => {
    if (habits.length === 0) {
      return {
        avgGrowth: 0,
        consistencyPct: 0,
        peakStreak: 0,
        bloomCount: 0,
      };
    }

    const evaluated = habits.map((h) => evaluatePlantState(h, logs, today));
    const avgGrowth = Math.round(
      evaluated.reduce((sum, ev) => sum + ev.progressToNext, 0) / habits.length
    );
    const bloomCount = evaluated.filter((ev) => ev.stage === 3).length;
    const peakStreak = Math.max(
      getOverallStreak(habits, logs, today),
      ...evaluated.map((ev) => ev.streak)
    );

    const activeDays = series.filter((p) => p.activeCount > 0);
    const consistencyPct =
      activeDays.length > 0
        ? Math.round(
            activeDays.reduce((sum, p) => sum + p.completionPct, 0) / activeDays.length
          )
        : 0;

    return { avgGrowth, consistencyPct, peakStreak, bloomCount };
  }, [habits, logs, series, today]);

  // 28-Day Streak Grid
  const streakGrid = useMemo(() => {
    const map = new Map<string, number>();
    logs.forEach((l) => {
      if (l.watered) map.set(l.date, (map.get(l.date) ?? 0) + 1);
    });
    return Array.from({ length: 28 }, (_, idx) => {
      const dateKey = getOffsetDateKey(idx - 27, today);
      return {
        dateKey,
        count: map.get(dateKey) ?? 0,
      };
    });
  }, [logs, today]);

  // Category Ring (SVG Donut)
  const totalWateredCount = useMemo(() => logs.filter((l) => l.watered).length, [logs]);

  const categoryMix = useMemo(() => {
    const counts: Record<HabitCategory, number> = {
      Study: 0,
      Health: 0,
      Routines: 0,
      Creative: 0,
    };
    const catMap = new Map(habits.map((h) => [h.id, h.category]));
    logs.forEach((l) => {
      if (!l.watered) return;
      const cat = catMap.get(l.habitId);
      if (cat) counts[cat] += 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    let cumulativePct = 0;
    return (Object.keys(counts) as HabitCategory[]).map((cat) => {
      const pct = total > 0 ? Math.round((counts[cat] / total) * 100) : 0;
      const offset = cumulativePct;
      cumulativePct += pct;
      return {
        category: cat,
        count: counts[cat],
        pct,
        offset,
        color: CATEGORY_COLORS[cat],
      };
    });
  }, [habits, logs]);

  const plantRows = useMemo(
    () =>
      habits.map((h) => ({
        habit: h,
        state: evaluatePlantState(h, logs, today),
      })),
    [habits, logs, today]
  );

  const badges = useMemo(() => getGroveBadges(habits, logs), [habits, logs]);

  // SVG chart geometry
  const W = 680;
  const H = 220;
  const PAD_L = 56;
  const PAD_R = 18;
  const PAD_T = 18;
  const PAD_B = 34;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const baseLineY = PAD_T + plotH;

  const pointsCoords = useMemo(() => {
    const count = Math.max(1, series.length);
    return series.map((pt, idx) => {
      const x =
        count === 1
          ? PAD_L + plotW / 2
          : PAD_L + (idx / (count - 1)) * plotW;
      const valuePct = chartMode === 'growth' ? pt.growthPct : pt.completionPct;
      const y = baseLineY - (valuePct / 100) * plotH;
      return { ...pt, idx, x, y, valuePct };
    });
  }, [series, chartMode, PAD_L, plotW, baseLineY, plotH]);

  const linePath = pointsCoords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath =
    pointsCoords.length > 0
      ? `${PAD_L},${baseLineY} ${linePath} ${pointsCoords[pointsCoords.length - 1].x.toFixed(1)},${baseLineY}`
      : '';

  const colWidth = plotW / Math.max(1, series.length);
  const barWidth = Math.max(5, Math.min(22, colWidth * 0.62));

  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  const getStageBadgeColors = (stage: PlantStage) => {
    if (stage === -1) return 'border-[#991B1B] bg-[#FEE2E2] text-[#991B1B]';
    if (stage === 3) return 'border-[#1A531A] bg-[#228B22] text-[#FAF6EE]';
    if (stage === 2) return 'border-[#1A531A] bg-[#9DC183]/45 text-[#132A16]';
    return 'border-[#1A531A]/40 bg-[#FAF6EE] text-[#132A16]';
  };

  return (
    <section
      id="insights"
      className="mx-auto max-w-[1040px] px-4 sm:px-8 py-6 space-y-5 scroll-mt-16"
      aria-label="Growth Analysis and Insights"
    >
      {/* Header + 4 KPI Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-[#1A531A]">
          Growth Analysis
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="border-2 border-[#1A531A] bg-[#FFFDF8] px-2.5 py-1 shadow-[2px_2px_0px_#1A531A]">
            <span className="text-[10px] font-semibold text-[#4A634D] mr-1.5">Growth</span>
            <span className="font-mono-tabular text-xs font-bold text-[#1A531A]">
              {kpis.avgGrowth}%
            </span>
          </div>
          <div className="border-2 border-[#1A531A] bg-[#FFFDF8] px-2.5 py-1 shadow-[2px_2px_0px_#1A531A]">
            <span className="text-[10px] font-semibold text-[#4A634D] mr-1.5">Rate</span>
            <span className="font-mono-tabular text-xs font-bold text-[#228B22]">
              {kpis.consistencyPct}%
            </span>
          </div>
          <div className="border-2 border-[#1A531A] bg-[#FFFDF8] px-2.5 py-1 shadow-[2px_2px_0px_#1A531A]">
            <span className="text-[10px] font-semibold text-[#4A634D] mr-1.5">Streak</span>
            <span className="font-mono-tabular text-xs font-bold text-[#1A531A]">
              {kpis.peakStreak}d
            </span>
          </div>
          <div className="border-2 border-[#1A531A] bg-[#FFFDF8] px-2.5 py-1 shadow-[2px_2px_0px_#1A531A]">
            <span className="text-[10px] font-semibold text-[#4A634D] mr-1.5">Blooms</span>
            <span className="font-mono-tabular text-xs font-bold text-[#1A531A]">
              {kpis.bloomCount}/{habits.length}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Interactive Growth Trajectory & Daily Rate Graph */}
      <div className="pixel-frame p-4 sm:p-5 bg-[#FFFDF8] space-y-4">
        {/* Graph Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1A531A]/15 pb-3">
          {/* Scope Selector: All Grove vs Individual Plants */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
            <button
              type="button"
              onClick={() => {
                setScopeHabitId('all');
                setHoverIdx(null);
              }}
              className={`shrink-0 border-2 px-2.5 py-1 font-pixel text-xs font-bold transition-colors ${
                effectiveScopeId === 'all'
                  ? 'border-[#1A531A] bg-[#1A531A] text-[#FAF6EE]'
                  : 'border-[#1A531A]/30 bg-[#FAF6EE] text-[#132A16] hover:border-[#1A531A]'
              }`}
            >
              All Plots
            </button>

            {habits.map((h) => {
              const selected = effectiveScopeId === h.id;
              const st = evaluatePlantState(h, logs, today);
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setScopeHabitId(h.id);
                    setHoverIdx(null);
                  }}
                  className={`shrink-0 inline-flex items-center gap-1.5 border-2 px-2 py-0.5 text-xs font-semibold transition-colors ${
                    selected
                      ? 'border-[#1A531A] bg-[#9DC183]/35 text-[#132A16]'
                      : 'border-[#1A531A]/25 bg-[#FAF6EE] text-[#4A634D] hover:border-[#1A531A]/60'
                  }`}
                >
                  <PlotSprite spriteType={h.spriteType} stage={st.stage} size={18} />
                  <span className="max-w-[90px] truncate">{h.title}</span>
                </button>
              );
            })}
          </div>

          {/* Mode + Timeframe Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex border-2 border-[#1A531A] bg-[#FAF6EE]">
              {(['growth', 'daily'] as ChartMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setChartMode(mode)}
                  className={`px-2.5 py-1 text-[11px] font-semibold capitalize ${
                    chartMode === mode
                      ? 'bg-[#1A531A] text-[#FAF6EE]'
                      : 'text-[#132A16] hover:bg-[#9DC183]/25'
                  }`}
                >
                  {mode === 'growth' ? 'Growth Curve' : 'Daily %'}
                </button>
              ))}
            </div>

            <div className="flex border-2 border-[#1A531A] bg-[#FAF6EE]">
              {([7, 14, 30] as WindowDays[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setWindowDays(d);
                    setHoverIdx(null);
                  }}
                  className={`px-2 py-1 font-mono-tabular text-[11px] font-bold ${
                    windowDays === d
                      ? 'bg-[#228B22] text-[#FAF6EE]'
                      : 'text-[#132A16] hover:bg-[#9DC183]/25'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Selected-Day Readout Strip */}
        {activePoint && (
          <div className="flex flex-wrap items-center justify-between gap-2 border border-[#1A531A]/20 bg-[#FAF6EE] px-3 py-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono-tabular text-xs font-bold text-[#1A531A]">
                {activePoint.label}
              </span>
              <span
                className={`border px-2 py-0.5 font-pixel text-[11px] font-bold ${getStageBadgeColors(
                  activePoint.stage
                )}`}
              >
                {PLANT_STAGE_LABELS[activePoint.stage]}
              </span>
            </div>

            <div className="flex items-center gap-4 font-mono-tabular text-xs">
              <span className="text-[#132A16]">
                Growth: <strong className="text-[#1A531A]">{activePoint.growthPct}%</strong>
              </span>
              <span className="text-[#132A16]">
                Watered:{' '}
                <strong className="text-[#228B22]">
                  {activePoint.wateredCount}/{activePoint.activeCount}
                </strong>
              </span>
              <span className="text-[#4A634D]">{activePoint.completionPct}%</span>
            </div>
          </div>
        )}

        {/* Interactive SVG Chart */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto select-none"
            role="img"
            aria-label="Growth analysis chart"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {/* Reference horizontal bands */}
            {(chartMode === 'growth'
              ? STAGE_BANDS
              : [
                  { pct: 0, label: '0%' },
                  { pct: 50, label: '50%' },
                  { pct: 100, label: '100%' },
                ]
            ).map((band) => {
              const y = baseLineY - (band.pct / 100) * plotH;
              return (
                <g key={band.label}>
                  <line
                    x1={PAD_L}
                    y1={y}
                    x2={W - PAD_R}
                    y2={y}
                    stroke="#1A531A"
                    strokeOpacity={band.pct === 0 ? '0.28' : '0.14'}
                    strokeDasharray={band.pct === 0 ? undefined : '4 4'}
                  />
                  <text
                    x={PAD_L - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#4A634D"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {band.label}
                  </text>
                </g>
              );
            })}

            {/* Active vertical crosshair */}
            {pointsCoords[activeIndex] && (
              <line
                x1={pointsCoords[activeIndex].x}
                y1={PAD_T}
                x2={pointsCoords[activeIndex].x}
                y2={baseLineY}
                stroke="#D2B48C"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            )}

            {chartMode === 'growth' ? (
              <>
                {/* Daily check-in subtle sky-blue ticks along bottom */}
                {pointsCoords.map((p) => {
                  if (p.wateredCount === 0) return null;
                  const h = Math.max(4, (p.completionPct / 100) * 26);
                  return (
                    <rect
                      key={`tick-${p.dateKey}`}
                      x={p.x - Math.min(8, barWidth / 2)}
                      y={baseLineY - h}
                      width={Math.min(16, barWidth)}
                      height={h}
                      fill="#87CEEB"
                      fillOpacity="0.65"
                      stroke="#1A531A"
                      strokeOpacity="0.3"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Area fill under growth curve */}
                {areaPath && (
                  <polygon points={areaPath} fill="#9DC183" fillOpacity="0.28" />
                )}

                {/* Main growth curve line */}
                {linePath && (
                  <polyline
                    fill="none"
                    stroke="#1A531A"
                    strokeWidth="3"
                    strokeLinejoin="miter"
                    points={linePath}
                  />
                )}

                {/* Pixel square data nodes */}
                {pointsCoords.map((p) => {
                  const isFocused = p.idx === activeIndex;
                  const fill =
                    p.stage === -1
                      ? '#991B1B'
                      : p.wateredCount > 0
                      ? '#228B22'
                      : p.activeCount > 0
                      ? '#D2B48C'
                      : '#FAF6EE';
                  const size = isFocused ? 9 : 6;
                  return (
                    <rect
                      key={`node-${p.dateKey}`}
                      x={p.x - size / 2}
                      y={p.y - size / 2}
                      width={size}
                      height={size}
                      fill={fill}
                      stroke={isFocused ? '#FAF6EE' : '#1A531A'}
                      strokeWidth={isFocused ? 2 : 1.5}
                    />
                  );
                })}
              </>
            ) : (
              /* Daily % Completion Pixel Bars */
              pointsCoords.map((p) => {
                const h = Math.max(3, (p.completionPct / 100) * plotH);
                const y = baseLineY - h;
                const isFocused = p.idx === activeIndex;
                const fill =
                  p.completionPct >= 75
                    ? '#1A531A'
                    : p.completionPct >= 40
                    ? '#228B22'
                    : p.completionPct > 0
                    ? '#9DC183'
                    : '#D2B48C';
                return (
                  <rect
                    key={`bar-${p.dateKey}`}
                    x={p.x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={h}
                    fill={fill}
                    fillOpacity={p.completionPct === 0 ? 0.55 : 1}
                    stroke={isFocused ? '#0C180E' : '#1A531A'}
                    strokeWidth={isFocused ? 2 : 1}
                  />
                );
              })
            )}

            {/* X-axis key date labels (start, mid, end) */}
            {pointsCoords.map((p, idx) => {
              const midIdx = Math.floor((pointsCoords.length - 1) / 2);
              const showLabel =
                idx === 0 || idx === midIdx || idx === pointsCoords.length - 1;
              if (!showLabel) return null;
              return (
                <text
                  key={`xlabel-${p.dateKey}`}
                  x={p.x}
                  y={H - 10}
                  textAnchor={
                    idx === 0 ? 'start' : idx === pointsCoords.length - 1 ? 'end' : 'middle'
                  }
                  fontSize="10"
                  fill="#4A634D"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {p.label}
                </text>
              );
            })}

            {/* Interactive hit targets per day */}
            {pointsCoords.map((p) => (
              <rect
                key={`hit-${p.dateKey}`}
                x={Math.max(PAD_L, p.x - colWidth / 2)}
                y={PAD_T}
                width={colWidth}
                height={plotH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIdx(p.idx)}
                onClick={() => setHoverIdx(p.idx)}
              />
            ))}
          </svg>
        </div>

        {/* Compact Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1A531A]/10 text-[11px] text-[#4A634D]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 bg-[#1A531A]" />
              <span>Growth %</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 border border-[#1A531A] bg-[#228B22]" />
              <span>Watered</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 border border-[#1A531A] bg-[#D2B48C]" />
              <span>Skipped</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 border border-[#1A531A]/40 bg-[#87CEEB]" />
              <span>Daily Check-in</span>
            </span>
          </div>
          <span className="font-mono-tabular text-[10px]">
            {totalWateredCount} logs
          </span>
        </div>
      </div>

      {/* Row 2: Per-Plant Stage Breakdown · Streak Grid · Category Ring */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Per-Plant Stage Progress */}
        <div className="md:col-span-5 pixel-frame p-4 bg-[#FFFDF8] flex flex-col">
          <div className="flex items-center justify-between border-b border-[#1A531A]/15 pb-2 mb-3">
            <h3 className="font-pixel text-lg font-bold text-[#1A531A]">Plant Progress</h3>
            <span className="font-mono-tabular text-[11px] text-[#4A634D]">
              {plantRows.length}/16
            </span>
          </div>

          {plantRows.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#1A531A]/25 bg-[#FAF6EE] py-6 text-center">
              <PlotSprite spriteType="cherry_blossom" stage={0} empty size={40} />
              <span className="mt-1.5 font-pixel text-sm text-[#4A634D]">0 Plants</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
              {plantRows.map(({ habit, state }) => (
                <div
                  key={habit.id}
                  className="border border-[#1A531A]/20 bg-[#FAF6EE] p-2 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <PlotSprite spriteType={habit.spriteType} stage={state.stage} size={24} />
                      <span className="truncate text-xs font-semibold text-[#132A16]">
                        {habit.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono-tabular text-[10px]">
                      <span className="text-[#4A634D]">{state.streak}d</span>
                      <span
                        className={`border px-1.5 py-0.5 font-pixel text-[10px] font-bold ${getStageBadgeColors(
                          state.stage
                        )}`}
                      >
                        {PLANT_STAGE_LABELS[state.stage]}
                      </span>
                    </div>
                  </div>

                  {/* 4-Stage Segmented Bar */}
                  <div className="grid grid-cols-4 gap-1">
                    {([0, 1, 2, 3] as PlantStage[]).map((st) => {
                      const filled = state.stage >= st;
                      return (
                        <div
                          key={st}
                          className={`h-1.5 border border-[#1A531A]/30 ${
                            state.stage === -1
                              ? 'bg-[#991B1B]/30'
                              : filled
                              ? st === 3
                                ? 'bg-[#1A531A]'
                                : 'bg-[#228B22]'
                              : 'bg-[#FFFDF8]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak Grid (28-day pixel matrix) */}
        <div className="md:col-span-4 pixel-frame p-4 bg-[#FFFDF8] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1A531A]/15 pb-2 mb-3">
            <h3 className="font-pixel text-lg font-bold text-[#1A531A]">Streak Grid</h3>
            <span className="font-mono-tabular text-[11px] text-[#4A634D]">28d</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 my-auto">
            {streakGrid.map((d) => {
              const bg =
                d.count >= 3
                  ? 'bg-[#1A531A]'
                  : d.count === 2
                  ? 'bg-[#228B22]'
                  : d.count === 1
                  ? 'bg-[#9DC183]'
                  : 'bg-[#FAF6EE]';
              return (
                <div
                  key={d.dateKey}
                  title={`${formatShortDate(d.dateKey)}: ${d.count}`}
                  className={`aspect-square w-full border border-[#1A531A]/30 ${bg}`}
                />
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-end gap-1.5 font-mono-tabular text-[10px] text-[#4A634D]">
            <span>0</span>
            <span className="h-2.5 w-2.5 border border-[#1A531A]/30 bg-[#FAF6EE]" />
            <span className="h-2.5 w-2.5 border border-[#1A531A]/30 bg-[#9DC183]" />
            <span className="h-2.5 w-2.5 border border-[#1A531A]/30 bg-[#228B22]" />
            <span className="h-2.5 w-2.5 border border-[#1A531A]/30 bg-[#1A531A]" />
            <span>3+</span>
          </div>
        </div>

        {/* Category Ring */}
        <div className="md:col-span-3 pixel-frame p-4 bg-[#FFFDF8]">
          <div className="border-b border-[#1A531A]/15 pb-2 mb-3">
            <h3 className="font-pixel text-lg font-bold text-[#1A531A]">Categories</h3>
          </div>

          <div className="flex items-center justify-center mb-3">
            <svg width="92" height="92" viewBox="0 0 92 92" role="img" aria-label="Category ring">
              <circle
                cx="46"
                cy="46"
                r={radius}
                fill="none"
                stroke="#FAF6EE"
                strokeWidth="12"
              />
              <circle
                cx="46"
                cy="46"
                r={radius}
                fill="none"
                stroke="#1A531A"
                strokeOpacity="0.15"
                strokeWidth="12"
              />
              {totalWateredCount > 0 &&
                categoryMix.map((c) => {
                  if (c.pct === 0) return null;
                  const dash = (c.pct / 100) * circumference;
                  const dashOffset = -(c.offset / 100) * circumference;
                  return (
                    <circle
                      key={c.category}
                      cx="46"
                      cy="46"
                      r={radius}
                      fill="none"
                      stroke={c.color}
                      strokeWidth="12"
                      strokeDasharray={`${dash} ${circumference}`}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 46 46)"
                    />
                  );
                })}
              <text
                x="46"
                y="50"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#1A531A"
                fontFamily="JetBrains Mono, monospace"
              >
                {totalWateredCount}
              </text>
            </svg>
          </div>

          <div className="space-y-1.5">
            {categoryMix.map((c) => (
              <div key={c.category} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-[#132A16]">
                  <span
                    className="inline-block h-2.5 w-2.5 border border-[#1A531A]"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.category}</span>
                </div>
                <span className="font-mono-tabular text-[#4A634D]">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unlocked Pixel Badge Icons */}
      <div className="pixel-frame p-4 bg-[#FFFDF8]">
        <div className="flex items-center justify-between border-b border-[#1A531A]/15 pb-2 mb-3">
          <h3 className="font-pixel text-lg font-bold text-[#1A531A]">Badges</h3>
          <span className="font-mono-tabular text-xs text-[#4A634D]">
            {badges.filter((b) => b.unlocked).length}/{badges.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`flex flex-col items-center border-2 p-2.5 text-center ${
                b.unlocked
                  ? 'border-[#1A531A] bg-[#9DC183]/22'
                  : 'border-[#1A531A]/20 bg-[#FAF6EE]'
              }`}
            >
              <BadgePixelSprite iconType={b.icon} unlocked={b.unlocked} size={36} />
              <div className="mt-1.5 font-pixel text-xs font-bold text-[#132A16]">
                {b.label}
              </div>
              <div className="font-mono-tabular text-[10px] text-[#4A634D]">
                {b.current}/{b.target}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
