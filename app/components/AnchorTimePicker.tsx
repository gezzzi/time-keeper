"use client";

interface AnchorTimePickerProps {
  hour: number;
  minute: number;
  onChangeHour: (h: number) => void;
  onChangeMinute: (m: number) => void;
  disabled: boolean;
}

export function AnchorTimePicker({
  hour,
  minute,
  onChangeHour,
  onChangeMinute,
  disabled,
}: AnchorTimePickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-zinc-400 uppercase tracking-widest">
        基準時刻
      </span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={23}
          value={String(hour).padStart(2, "0")}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 0 && v <= 23) onChangeHour(v);
          }}
          disabled={disabled}
          className="w-14 rounded border border-zinc-300 bg-white px-2 py-1 text-center text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="text-lg font-bold text-zinc-400">:</span>
        <input
          type="number"
          min={0}
          max={59}
          value={String(minute).padStart(2, "0")}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 0 && v <= 59) onChangeMinute(v);
          }}
          disabled={disabled}
          className="w-14 rounded border border-zinc-300 bg-white px-2 py-1 text-center text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
