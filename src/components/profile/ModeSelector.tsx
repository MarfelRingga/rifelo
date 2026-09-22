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
    <div className="flex overflow-x-auto gap-3 py-3 snap-x hide-scrollbar -mx-4 px-4">
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
              "snap-center shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm border-2",
              isSelected
                ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50",
              readOnly && "cursor-default opacity-70"
            )}
          >
            <Icon className={cn("w-4 h-4", isSelected ? "text-white" : "text-slate-400")} />
            <span className="leading-none">{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
}
