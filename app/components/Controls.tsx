"use client";

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function Controls({ isRunning, onStart, onStop, onReset }: ControlsProps) {
  return (
    <div className="flex gap-3">
      {isRunning ? (
        <button
          onClick={onStop}
          className="rounded-xl bg-zinc-700 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-zinc-600"
        >
          Stop
        </button>
      ) : (
        <button
          onClick={onStart}
          className="rounded-xl bg-amber-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-amber-600"
        >
          Start
        </button>
      )}
      <button
        onClick={onReset}
        className="rounded-xl bg-zinc-200 px-6 py-3 text-lg font-semibold text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        Reset
      </button>
    </div>
  );
}
