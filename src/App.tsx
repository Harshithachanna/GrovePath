import React, { useCallback, useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { GroveCanvas } from './components/GroveCanvas';
import { GroveGlimpse } from './components/GroveGlimpse';
import { InsightsView } from './components/InsightsView';
import { LandingHero } from './components/LandingHero';
import { GrovepathEmblem } from './components/PixelSprites';
import { PlantInspector } from './components/PlantInspector';
import { SettingsView } from './components/SettingsView';
import { ThrowSeedsModal } from './components/ThrowSeedsModal';
import { TodayDrawer } from './components/TodayDrawer';
import { TopNav } from './components/TopNav';
import { WelcomePopup } from './components/WelcomePopup';
import type {
  AppSettings,
  GroveState,
  HabitCategory,
  PlotSpriteType,
  UserProfile,
} from './types/grove';
import { getGroveLevel, getOverallStreak, toLocalDateKey } from './utils/groveLogic';
import { playChime } from './utils/sound';
import {
  createEmptyGroveState,
  loadAccountGroveState,
  loadGroveState,
  saveGroveState,
} from './utils/storage';

export default function App() {
  const [state, setState] = useState<GroveState>(() => loadGroveState());
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [splashPlotId, setSplashPlotId] = useState<number | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [throwSeedsPlotId, setThrowSeedsPlotId] = useState<number | null>(null);
  const [todayDrawerOpen, setTodayDrawerOpen] = useState(false);
  const [welcomeInfo, setWelcomeInfo] = useState<{
    open: boolean;
    displayName: string;
    groveName: string;
    isLoginMode: boolean;
  }>({
    open: false,
    displayName: '',
    groveName: '',
    isLoginMode: true,
  });

  useEffect(() => {
    saveGroveState(state);
  }, [state]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: state.settings.reducedMotion ? 'auto' : 'smooth' });
    }
  }, [state.settings.reducedMotion]);

  const triggerWaterSplash = useCallback((plotId: number) => {
    setSplashPlotId(plotId);
    setTimeout(() => {
      setSplashPlotId((curr) => (curr === plotId ? null : curr));
    }, 750);
  }, []);

  const handleAuthenticate = (payload: {
    displayName: string;
    groveName: string;
    isLoginMode: boolean;
  }) => {
    const savedAccountState = loadAccountGroveState(payload.displayName);

    if (savedAccountState) {
      setState(savedAccountState);
    } else {
      setState((prev) => ({
        ...prev,
        profile: {
          isAuthenticated: true,
          displayName: payload.displayName,
          groveName: payload.groveName,
        },
      }));
    }

    setAuthModalOpen(false);
    playChime('bloom', state.settings.soundEnabled);
    window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? 'auto' : 'smooth' });
    setWelcomeInfo({
      open: true,
      displayName: payload.displayName,
      groveName: savedAccountState?.profile.groveName ?? payload.groveName,
      isLoginMode: payload.isLoginMode,
    });
  };

  const handleLogOut = () => {
    setTodayDrawerOpen(false);
    setThrowSeedsPlotId(null);
    setState((prev) => ({
      ...prev,
      profile: {
        isAuthenticated: false,
        displayName: 'Navigator',
        groveName: 'My Grove',
      },
      habits: [],
      logs: [],
      reminders: [],
    }));
    setSelectedPlotId(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handlePlantSeeds = (payload: {
    title: string;
    category: HabitCategory;
    spriteType: PlotSpriteType;
    plotId: number;
  }) => {
    const todayKey = toLocalDateKey();
    const newHabitId = `hab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setState((prev) => ({
      ...prev,
      habits: [
        ...prev.habits,
        {
          id: newHabitId,
          title: payload.title,
          category: payload.category,
          spriteType: payload.spriteType,
          plotId: payload.plotId,
          plantedDate: todayKey,
          createdAt: todayKey,
        },
      ],
    }));
    setThrowSeedsPlotId(null);
    setSelectedPlotId(payload.plotId);
    playChime('increment', state.settings.soundEnabled);
  };

  const handleWaterHabit = (habitId: string) => {
    const todayKey = toLocalDateKey();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;

    const alreadyWatered = state.logs.some(
      (l) => l.habitId === habitId && l.date === todayKey && l.watered
    );

    setState((prev) => {
      const remaining = prev.logs.filter(
        (l) => !(l.habitId === habitId && l.date === todayKey)
      );
      if (alreadyWatered) {
        return { ...prev, logs: remaining };
      }
      return {
        ...prev,
        logs: [
          ...remaining,
          {
            id: `log-${habitId}-${todayKey}`,
            habitId,
            date: todayKey,
            watered: true,
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    });

    if (!alreadyWatered) {
      triggerWaterSplash(habit.plotId);
      playChime('complete', state.settings.soundEnabled);
    } else {
      playChime('undo', state.settings.soundEnabled);
    }
  };

  const handlePullWeeds = (habitId: string) => {
    const todayKey = toLocalDateKey();
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === habitId ? { ...h, plantedDate: todayKey } : h
      ),
      logs: prev.logs.filter((l) => l.habitId !== habitId),
    }));
    playChime('bloom', state.settings.soundEnabled);
  };

  const handleRemoveHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
      logs: prev.logs.filter((l) => l.habitId !== habitId),
    }));
    setSelectedPlotId(null);
  };

  const handleAddReminder = (payload: { title: string; deadline?: string }) => {
    const todayKey = toLocalDateKey();
    setState((prev) => ({
      ...prev,
      reminders: [
        {
          id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: payload.title,
          deadline: payload.deadline,
          done: false,
          date: todayKey,
          createdAt: new Date().toISOString(),
        },
        ...prev.reminders,
      ],
    }));
    playChime('increment', state.settings.soundEnabled);
  };

  const handleToggleReminder = (id: string) => {
    const target = state.reminders.find((r) => r.id === id);
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    }));
    if (target && !target.done) {
      playChime('complete', state.settings.soundEnabled);
    } else {
      playChime('undo', state.settings.soundEnabled);
    }
  };

  const handleDeleteReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }));
  };

  const handleClearCompletedReminders = () => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => !r.done),
    }));
  };

  const handleCarryForwardReminders = () => {
    const todayKey = toLocalDateKey();
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (!r.done ? { ...r, date: todayKey } : r)),
    }));
    playChime('increment', state.settings.soundEnabled);
  };

  const handleUpdateProfile = (patch: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  };

  const handleUpdateSettings = (patch: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  };

  const handleClearAllData = () => {
    setState(createEmptyGroveState());
    setSelectedPlotId(null);
  };

  const handlePlantFirst = () => {
    scrollToSection('grove');
    setThrowSeedsPlotId(0);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#132A16]">
      <TopNav
        isAuthenticated={state.profile.isAuthenticated}
        displayName={state.profile.displayName}
        onStartGrove={() =>
          state.profile.isAuthenticated ? scrollToSection('grove') : setAuthModalOpen(true)
        }
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogOut={handleLogOut}
      />

      {state.profile.isAuthenticated ? (
        <>
          {/* 2. Interactive Grove / Habit Dashboard */}
          <GroveCanvas
            groveName={state.profile.groveName}
            habits={state.habits}
            logs={state.logs}
            reminders={state.reminders}
            selectedPlotId={selectedPlotId}
            splashPlotId={splashPlotId}
            reducedMotion={state.settings.reducedMotion}
            onSelectPlot={(plotId) => setSelectedPlotId(plotId)}
            onOpenThrowSeeds={(plotId) => setThrowSeedsPlotId(plotId)}
            onWaterHabit={handleWaterHabit}
            onPullWeeds={handlePullWeeds}
            onOpenTodayDrawer={() => setTodayDrawerOpen(true)}
          />

          {/* 3. Per-Habit Plant Growth Inspector */}
          <PlantInspector
            habits={state.habits}
            logs={state.logs}
            selectedPlotId={selectedPlotId}
            onSelectPlot={(plotId) => setSelectedPlotId(plotId)}
            onPlantFirst={handlePlantFirst}
            onWaterHabit={handleWaterHabit}
            onPullWeeds={handlePullWeeds}
            onRemoveHabit={handleRemoveHabit}
          />

          {/* 4. Insights */}
          <InsightsView habits={state.habits} logs={state.logs} />

          {/* 5. Profile / Auth & Settings */}
          <SettingsView
            state={state}
            onOpenAuth={() => setAuthModalOpen(true)}
            onLogOut={handleLogOut}
            onUpdateProfile={handleUpdateProfile}
            onUpdateSettings={handleUpdateSettings}
            onClearAllData={handleClearAllData}
          />
        </>
      ) : (
        <>
          {/* 1. Landing / Hero Section + Glimpse Preview (Before Login Only) */}
          <LandingHero reducedMotion={state.settings.reducedMotion} />
          <GroveGlimpse onOpenAuth={() => setAuthModalOpen(true)} />
        </>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-[#1A531A]/15 py-6">
        <div className="mx-auto flex max-w-[1040px] items-center justify-between px-4 sm:px-8 text-xs text-[#4A634D]">
          <div className="flex items-center gap-2">
            <GrovepathEmblem size={20} />
            <span className="font-pixel text-sm font-bold text-[#1A531A]">Grovepath</span>
          </div>
          <span className="font-pixel text-xs">Navigate Your Growth</span>
        </div>
      </footer>

      {state.profile.isAuthenticated && (
        <>
          {/* Slide-out Today Drawer */}
          <TodayDrawer
            open={todayDrawerOpen}
            reminders={state.reminders}
            onClose={() => setTodayDrawerOpen(false)}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onClearCompleted={handleClearCompletedReminders}
            onCarryForward={handleCarryForwardReminders}
          />

          {/* Throw Seeds Modal */}
          <ThrowSeedsModal
            open={throwSeedsPlotId !== null}
            plotId={throwSeedsPlotId}
            onClose={() => setThrowSeedsPlotId(null)}
            onPlant={handlePlantSeeds}
          />
        </>
      )}

      {/* Log In / Sign Up Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
      />

      {/* Welcome Back Pop-Up */}
      <WelcomePopup
        open={welcomeInfo.open}
        displayName={welcomeInfo.displayName}
        groveName={welcomeInfo.groveName}
        plantCount={state.habits.length}
        streak={getOverallStreak(state.habits, state.logs)}
        level={getGroveLevel(state.logs)}
        isLoginMode={welcomeInfo.isLoginMode}
        onClose={() => setWelcomeInfo((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
