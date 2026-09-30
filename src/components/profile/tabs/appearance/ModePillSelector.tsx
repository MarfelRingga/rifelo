'use client';

import { ProfileMode } from '@/lib/types/profile';
import { cn } from '@/lib/utils';

interface ModePillSelectorProps {
  currentMode: ProfileMode;
  onModeSelect: (mode: ProfileMode) => void;
}

const MODES: { id: ProfileMode; label: string }[] = [
  { id: 'casual', label: 'Casual' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
];

export function ModePillSelector({ currentMode, onModeSelect }: ModePillSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
        Persona Mode
      </label>
      <div className="flex items-center gap-2 sm:gap-3 py-1 overflow-x-auto hide-scrollbar">
        {MODES.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeSelect(m.id)}
              className={cn(
                'shrink-0 flex items-center justify-center gap-2 p-2.5 sm:p-3 px-4 sm:px-5 text-xs sm:text-sm rounded-full transition-colors font-semibold border-2 whitespace-nowrap',
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
              )}
            >
              <span className="leading-none whitespace-nowrap">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
