import React, { useEffect, useState } from 'react';
import { Check, LogIn, LogOut, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { AppSettings, GroveState, UserProfile } from '../types/grove';
import { playChime } from '../utils/sound';

interface SettingsViewProps {
  state: GroveState;
  onOpenAuth: () => void;
  onLogOut: () => void;
  onUpdateProfile: (patch: Partial<UserProfile>) => void;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onClearAllData: () => void;
}

export function SettingsView({
  state,
  onOpenAuth,
  onLogOut,
  onUpdateProfile,
  onUpdateSettings,
  onClearAllData,
}: SettingsViewProps) {
  const [groveName, setGroveName] = useState(state.profile.groveName);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setGroveName(state.profile.groveName);
  }, [state.profile.groveName]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ groveName: groveName.trim() || 'My Grove' });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section
      id="settings"
      className="mx-auto max-w-[1040px] px-4 sm:px-8 pt-6 pb-14 space-y-4 scroll-mt-16"
      aria-label="Settings"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-[#1A531A]">Settings</h2>
      </div>

      <div className="pixel-frame p-4 sm:p-6 bg-[#FFFDF8] grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Profile / Grove Name */}
        <form onSubmit={handleSaveName} className="lg:col-span-5 flex items-end gap-2.5">
          <div className="flex-1 min-w-0">
            <label htmlFor="grove-name-input" className="block text-xs font-semibold text-[#132A16] mb-1">
              Grove Name
            </label>
            <input
              id="grove-name-input"
              type="text"
              value={groveName}
              onChange={(e) => setGroveName(e.target.value)}
              className="w-full border-2 border-[#1A531A]/40 bg-[#FAF6EE] px-3 py-2 text-sm text-[#132A16] focus:border-[#1A531A] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="pixel-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0"
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : null}
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </form>

        {/* Toggles + Auth + Export */}
        <div className="lg:col-span-7 flex flex-wrap items-center justify-start lg:justify-end gap-2.5">
          <button
            type="button"
            onClick={onOpenAuth}
            className="pixel-btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold whitespace-nowrap"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>{state.profile.isAuthenticated ? state.profile.displayName : 'Log In'}</span>
          </button>

          {state.profile.isAuthenticated && (
            <button
              type="button"
              onClick={onLogOut}
              className="inline-flex items-center gap-1.5 border-2 border-[#1A531A]/35 bg-[#FAF6EE] px-3 py-2 text-xs font-semibold text-[#132A16] hover:border-[#1A531A] whitespace-nowrap"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          )}

          <button
            type="button"
            role="switch"
            aria-checked={state.settings.soundEnabled}
            onClick={() => {
              const next = !state.settings.soundEnabled;
              onUpdateSettings({ soundEnabled: next });
              if (next) playChime('increment', true);
            }}
            className={`inline-flex items-center gap-1.5 border-2 px-3 py-2 text-xs font-semibold whitespace-nowrap ${
              state.settings.soundEnabled
                ? 'border-[#1A531A] bg-[#1A531A] text-[#FAF6EE]'
                : 'border-[#1A531A]/35 bg-[#FAF6EE] text-[#4A634D]'
            }`}
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <span>Sound</span>
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={state.settings.reducedMotion}
            onClick={() => onUpdateSettings({ reducedMotion: !state.settings.reducedMotion })}
            className={`border-2 px-3 py-2 text-xs font-semibold whitespace-nowrap ${
              state.settings.reducedMotion
                ? 'border-[#1A531A] bg-[#1A531A] text-[#FAF6EE]'
                : 'border-[#1A531A]/35 bg-[#FAF6EE] text-[#4A634D]'
            }`}
          >
            Motion: {state.settings.reducedMotion ? 'Reduced' : 'Full'}
          </button>

          {confirmReset ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onClearAllData();
                  setConfirmReset(false);
                }}
                className="border-2 border-[#991B1B] bg-[#991B1B] px-3 py-2 text-xs font-semibold text-[#FAF6EE]"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="border-2 border-[#1A531A]/30 px-2.5 py-2 text-xs text-[#4A634D]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 border-2 border-[#1A531A]/30 bg-[#FAF6EE] px-3 py-2 text-xs font-semibold text-[#132A16] hover:border-[#991B1B] hover:text-[#991B1B] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
