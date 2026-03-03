"use client";
import { type ChimeType, CHIME_LABELS } from "../hooks/useChime";

const CHIME_TYPES = Object.keys(CHIME_LABELS) as ChimeType[];

interface ChimePickerProps {
  value: ChimeType;
  onChange: (type: ChimeType) => void;
  onTest: () => void;
  disabled: boolean;
}

export function ChimePicker({ value, onChange, onTest, disabled }: ChimePickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-zinc-400 uppercase tracking-widest">Chime</span>
      <div className="flex items-center gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as ChimeType)}
          disabled={disabled}
          className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {CHIME_TYPES.map((type) => (
            <option key={type} value={type}>
              {CHIME_LABELS[type]}
            </option>
          ))}
        </select>
        <button
          onClick={onTest}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:border-amber-400 hover:text-amber-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          ♪ Test
        </button>
      </div>
    </div>
  );
}
