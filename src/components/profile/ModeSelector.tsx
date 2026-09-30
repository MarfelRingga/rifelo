import React from 'react';
import { ProfileMode } from '@/lib/types/profile';
import { cn } from '@/lib/utils';
import { Smile, Briefcase, Palette } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ProfileMode;
  onModeSelect: (mode: ProfileMode) => void;
  readOnly?: boolean;
}

const MODES: { id: ProfileMode; name: string; icon: React.FC<any> }[] = [
  { id: 'casual', name: 'Casual', icon: Smile },
  { id: 'professional', name: 'Professional', icon: Briefcase },
  { id: 'creative', name: 'Creative', icon: Palette },
];

export function ModeSelector({
  currentMode,
  onModeSelect,
  readOnly = false,
}: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 py-1 overflow-x-auto hide-scrollbar">
      {MODES.map((mode) => {
        const isSelected = currentMode === mode.id;
        const Icon = mode.icon;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => !readOnly && onModeSelect(mode.id)}
            disabled={readOnly}
            className={cn(
              "shrink-0 flex items-center justify-center gap-2 p-2.5 sm:p-3 px-4 sm:px-5 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm border-2 whitespace-nowrap",
              isSelected
                ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:border-slate-300",
              readOnly && "cursor-default opacity-70"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0", isSelected ? "text-white" : "text-slate-500")} />
            <span className="leading-none whitespace-nowrap">{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
}
