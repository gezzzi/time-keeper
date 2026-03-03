"use client";
import { useMemo } from "react";

interface TimerDisplayProps {
  remainingMs: number;
  totalMs: number;
  isRunning: boolean;
}

export function TimerDisplay({ remainingMs, totalMs, isRunning }: TimerDisplayProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = 1 - remainingMs / totalMs;
  const offset = circumference * (1 - progress);

  const timeString = useMemo(() => {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [remainingMs]);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="280" height="280" className="-rotate-90">
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-zinc-200 dark:text-zinc-800"
        />
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-amber-500"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.25s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={`font-mono text-5xl font-bold tabular-nums ${
            isRunning ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"
          }`}
        >
          {timeString}
        </span>
        {isRunning && (
          <span className="mt-1 text-xs text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            running
          </span>
        )}
      </div>
    </div>
  );
}
