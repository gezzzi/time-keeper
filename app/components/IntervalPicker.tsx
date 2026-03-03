"use client";

const PRESETS = [15, 25, 30, 45, 60];

interface IntervalPickerProps {
  value: number;
  onChange: (minutes: number) => void;
  disabled: boolean;
}

export function IntervalPicker({ value, onChange, disabled }: IntervalPickerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map((min) => (
          <button
            key={min}
            onClick={() => onChange(min)}
            disabled={disabled}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              value === min
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {min}m
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <label htmlFor="custom-interval">Custom:</label>
        <input
          id="custom-interval"
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 1 && v <= 180) onChange(v);
          }}
          disabled={disabled}
          className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-center text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span>min</span>
      </div>
    </div>
  );
}
