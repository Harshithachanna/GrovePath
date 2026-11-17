import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Plus, Sprout, Trash2, X } from 'lucide-react';
import type { ReminderItem } from '../types/grove';
import { toLocalDateKey } from '../utils/groveLogic';
import { PixelBellCheckIcon } from './PixelSprites';

interface TodayDrawerProps {
  open: boolean;
  reminders: ReminderItem[];
  onClose: () => void;
  onAddReminder: (payload: { title: string; deadline?: string }) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onClearCompleted: () => void;
  onCarryForward: () => void;
}

type FilterTab = 'All' | 'To Do' | 'Done';

export function TodayDrawer({
  open,
  reminders,
  onClose,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onClearCompleted,
  onCarryForward,
}: TodayDrawerProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [filter, setFilter] = useState<FilterTab>('All');

  const todayKey = toLocalDateKey();

  const totalCount = reminders.length;
  const doneCount = reminders.filter((r) => r.done).length;
  const pastUnfinishedCount = reminders.filter((r) => !r.done && r.date < todayKey).length;

  const filtered = useMemo(() => {
    if (filter === 'To Do') return reminders.filter((r) => !r.done);
    if (filter === 'Done') return reminders.filter((r) => r.done);
    return reminders;
  }, [reminders, filter]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    onAddReminder({
      title: cleanTitle,
      deadline: deadline.trim() || undefined,
    });
    setTitle('');
    setDeadline('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Subtle backdrop */}
      <button
        type="button"
        aria-label="Close Today drawer"
        onClick={onClose}
        className="fixed inset-0 bg-[#0C180E]/45 backdrop-blur-[1px]"
      />

      {/* Slide-out Drawer Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Today Reminder Board"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l-2 border-[#1A531A] bg-[#FAF6EE] shadow-[-6px_0px_0px_rgba(12,24,14,0.35)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1A531A]/20 bg-[#FFFDF8] px-5 py-4">
          <div className="flex items-center gap-2.5 text-[#1A531A]">
            <PixelBellCheckIcon size={20} />
            <h2 className="font-pixel text-2xl font-bold">Today</h2>
            <span className="font-mono-tabular text-xs font-semibold text-[#4A634D]">
              {doneCount}/{totalCount} Done
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Today drawer"
            className="inline-flex h-9 w-9 items-center justify-center border-2 border-[#1A531A]/30 bg-[#FAF6EE] text-[#132A16] hover:border-[#1A531A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Add Input */}
        <form
          onSubmit={handleSubmit}
          className="border-b border-[#1A531A]/15 bg-[#FFFDF8] p-4 space-y-2.5"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add task or deadline..."
              aria-label="Task or deadline"
              maxLength={60}
              className="flex-1 min-w-0 border-2 border-[#1A531A]/35 bg-[#FAF6EE] px-3 py-2 text-sm text-[#132A16] focus:border-[#1A531A] focus:outline-none"
            />
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="6 PM"
              aria-label="Optional time tag"
              maxLength={12}
              className="w-20 shrink-0 border-2 border-[#1A531A]/35 bg-[#FAF6EE] px-2.5 py-2 text-center font-mono-tabular text-xs text-[#132A16] focus:border-[#1A531A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!title.trim()}
              aria-label="Add task"
              className="pixel-btn-primary inline-flex h-[40px] w-[44px] shrink-0 items-center justify-center disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="grid grid-cols-3 gap-1 border-2 border-[#1A531A] p-0.5 bg-[#FAF6EE]">
            {(['All', 'To Do', 'Done'] as const).map((tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`py-1 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#1A531A] text-[#FAF6EE]'
                      : 'text-[#4A634D] hover:text-[#132A16]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex h-44 flex-col items-center justify-center border-2 border-dashed border-[#1A531A]/20 bg-[#FFFDF8] text-center p-4">
              <Sprout className="h-6 w-6 text-[#9DC183] mb-2" />
              <p className="font-pixel text-base font-bold text-[#1A531A]">
                {totalCount === 0 ? 'Nothing queued yet' : `No ${filter} items`}
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center justify-between gap-2.5 border-2 p-2.5 transition-colors ${
                    item.done
                      ? 'border-[#228B22]/40 bg-[#9DC183]/15'
                      : 'border-[#1A531A]/30 bg-[#FFFDF8]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleReminder(item.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left min-h-[36px]"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 ${
                        item.done
                          ? 'border-[#1A531A] bg-[#228B22] text-[#FAF6EE]'
                          : 'border-[#1A531A] bg-[#FAF6EE]'
                      }`}
                    >
                      {item.done && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm font-medium ${
                          item.done ? 'line-through text-[#4A634D]' : 'text-[#132A16]'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {item.done && (
                      <Sprout className="h-4 w-4 shrink-0 text-[#228B22]" aria-hidden="true" />
                    )}
                  </button>

                  {item.deadline && (
                    <span className="shrink-0 font-mono-tabular text-[11px] font-semibold text-[#1A531A]">
                      {item.deadline}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteReminder(item.id)}
                    aria-label={`Remove ${item.title}`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-[#4A634D] hover:text-[#991B1B]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Actions: Clear Done & Carry Forward */}
        <div className="flex items-center justify-between gap-2 border-t-2 border-[#1A531A]/20 bg-[#FFFDF8] px-4 py-3">
          <button
            type="button"
            onClick={onCarryForward}
            disabled={pastUnfinishedCount === 0}
            className="inline-flex items-center gap-1.5 border-2 border-[#1A531A]/35 bg-[#FAF6EE] px-3 py-2 text-xs font-semibold text-[#132A16] hover:border-[#1A531A] disabled:opacity-40 whitespace-nowrap"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            Carry Forward ({pastUnfinishedCount})
          </button>

          <button
            type="button"
            onClick={onClearCompleted}
            disabled={doneCount === 0}
            className="inline-flex items-center gap-1.5 border-2 border-[#1A531A]/35 bg-[#FAF6EE] px-3 py-2 text-xs font-semibold text-[#132A16] hover:border-[#991B1B] hover:text-[#991B1B] disabled:opacity-40 whitespace-nowrap"
          >
            Clear Done ({doneCount})
          </button>
        </div>
      </aside>
    </div>
  );
}
