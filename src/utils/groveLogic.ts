import type { Habit, HabitLog, PlantStage } from '../types/grove';
import groveData from '../data/groveData.json';

export function toLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateKey(daysOffset: number, from: Date = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() + daysOffset);
  return toLocalDateKey(d);
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatShortDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export const PLANT_STAGE_LABELS: Record<PlantStage, string> = {
  [-1]: groveData.plantStageLabels.weeds,
  0: groveData.plantStageLabels.seed,
  1: groveData.plantStageLabels.sprout,
  2: groveData.plantStageLabels.sapling,
  3: groveData.plantStageLabels.bloom,
};

export interface EvaluatedPlantState {
  stage: PlantStage;
  wateredToday: boolean;
  streak: number;
  totalWatered: number;
  consecutiveMissedDays: number;
  progressToNext: number;
}

export function evaluatePlantState(
  habit: Habit,
  logs: HabitLog[],
  today: Date = new Date()
): EvaluatedPlantState {
  const todayKey = toLocalDateKey(today);
  const wateredDates = new Set(
    logs
      .filter((l) => l.habitId === habit.id && l.watered && l.date >= habit.plantedDate)
      .map((l) => l.date)
  );

  const wateredToday = wateredDates.has(todayKey);
  const totalWatered = wateredDates.size;

  const start = parseDateKey(habit.plantedDate);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let growthScore = 0; // 0: Seed, 1..2: Sprout, 3..5: Sapling, 6+: Bloom
  let stage: PlantStage = 0;
  let consecutiveMissedDays = 0;

  const scoreToStage = (score: number): PlantStage => {
    if (score >= 6) return 3;
    if (score >= 3) return 2;
    if (score >= 1) return 1;
    return 0;
  };

  const stageFloorScore = (st: PlantStage): number => {
    if (st === 3) return 6;
    if (st === 2) return 3;
    if (st === 1) return 1;
    return 0;
  };

  const cursor = new Date(start.getTime());
  while (cursor.getTime() < end.getTime()) {
    const key = toLocalDateKey(cursor);
    if (wateredDates.has(key)) {
      consecutiveMissedDays = 0;
      if (stage !== -1) {
        growthScore = Math.min(6, growthScore + 1);
        stage = scoreToStage(growthScore);
      }
    } else {
      consecutiveMissedDays += 1;
      if (consecutiveMissedDays >= 3 && stage !== -1) {
        const regressed = (stage - 1) as PlantStage;
        stage = regressed;
        growthScore = regressed === -1 ? 0 : stageFloorScore(regressed);
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (wateredToday && stage !== -1) {
    consecutiveMissedDays = 0;
    growthScore = Math.min(6, growthScore + 1);
    stage = scoreToStage(growthScore);
  }

  let streak = 0;
  let offset = wateredToday ? 0 : -1;
  for (let i = 0; i < 365; i++) {
    const key = getOffsetDateKey(offset, today);
    if (key < habit.plantedDate) break;
    if (wateredDates.has(key)) {
      streak++;
      offset--;
    } else {
      break;
    }
  }

  const progressToNext =
    stage === -1 ? 0 : Math.min(100, Math.round((growthScore / 6) * 100));

  return {
    stage,
    wateredToday,
    streak,
    totalWatered,
    consecutiveMissedDays,
    progressToNext,
  };
}

export function getOverallStreak(habits: Habit[], logs: HabitLog[], today: Date = new Date()): number {
  if (habits.length === 0) return 0;
  const wateredDates = new Set(logs.filter((l) => l.watered).map((l) => l.date));
  if (wateredDates.size === 0) return 0;

  const todayKey = toLocalDateKey(today);
  let streak = 0;
  let offset = wateredDates.has(todayKey) ? 0 : -1;
  for (let i = 0; i < 365; i++) {
    const key = getOffsetDateKey(offset, today);
    if (wateredDates.has(key)) {
      streak++;
      offset--;
    } else {
      break;
    }
  }
  return streak;
}

export function getGroveLevel(logs: HabitLog[]): number {
  const total = logs.filter((l) => l.watered).length;
  if (total === 0) return 0;
  if (total >= 30) return 4;
  if (total >= 15) return 3;
  if (total >= 6) return 2;
  return 1;
}

export function getHabitCheckInLogs(habit: Habit, logs: HabitLog[]) {
  return logs
    .filter((l) => l.habitId === habit.id && l.watered)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export interface GroveBadge {
  id: string;
  label: string;
  icon: 'sprout' | 'path' | 'sapling' | 'bloom' | 'plots' | 'canopy';
  unlocked: boolean;
  current: number;
  target: number;
}

export function getGroveBadges(habits: Habit[], logs: HabitLog[]): GroveBadge[] {
  const metrics = {
    totalCompleted: logs.filter((l) => l.watered).length,
    bestStreak: habits.reduce(
      (max, h) => Math.max(max, evaluatePlantState(h, logs).streak),
      0
    ),
    saplingPlusCount: habits.filter((h) => evaluatePlantState(h, logs).stage >= 2).length,
    habitCount: habits.length,
    bloomCount: habits.filter((h) => evaluatePlantState(h, logs).stage === 3).length,
  };

  return groveData.badgeDefinitions.map((badge) => {
    const rawValue = metrics[badge.metric as keyof typeof metrics] ?? 0;
    return {
      id: badge.id,
      label: badge.label,
      icon: badge.icon as GroveBadge['icon'],
      unlocked: rawValue >= badge.target,
      current: Math.min(badge.target, rawValue),
      target: badge.target,
    };
  });
}

export interface GrowthAnalysisPoint {
  dateKey: string;
  label: string;
  wateredCount: number;
  activeCount: number;
  completionPct: number;
  growthPct: number;
  stage: PlantStage;
}

export function getGrowthAnalysisSeries(
  habits: Habit[],
  logs: HabitLog[],
  days: number,
  habitId: string = 'all',
  today: Date = new Date()
): GrowthAnalysisPoint[] {
  const targetHabit = habitId === 'all' ? null : habits.find((h) => h.id === habitId) ?? null;

  return Array.from({ length: days }, (_, idx) => {
    const dateKey = getOffsetDateKey(idx - (days - 1), today);
    const asOfDate = parseDateKey(dateKey);

    const scoped = targetHabit
      ? targetHabit.plantedDate <= dateKey
        ? [targetHabit]
        : []
      : habits.filter((h) => h.plantedDate <= dateKey);

    const activeCount = scoped.length;
    if (activeCount === 0) {
      return {
        dateKey,
        label: formatShortDate(dateKey),
        wateredCount: 0,
        activeCount: 0,
        completionPct: 0,
        growthPct: 0,
        stage: 0 as PlantStage,
      };
    }

    let wateredCount = 0;
    let growthSum = 0;
    let lastStage: PlantStage = 0;
    let stageSum = 0;

    scoped.forEach((h) => {
      const ev = evaluatePlantState(h, logs, asOfDate);
      if (ev.wateredToday) wateredCount += 1;
      growthSum += ev.progressToNext;
      lastStage = ev.stage;
      stageSum += Math.max(0, ev.stage);
    });

    const completionPct = Math.min(100, Math.round((wateredCount / activeCount) * 100));
    const growthPct = Math.min(100, Math.round(growthSum / activeCount));
    const avgStage = Math.round(stageSum / activeCount) as PlantStage;

    return {
      dateKey,
      label: formatShortDate(dateKey),
      wateredCount,
      activeCount,
      completionPct,
      growthPct,
      stage: targetHabit ? lastStage : avgStage,
    };
  });
}