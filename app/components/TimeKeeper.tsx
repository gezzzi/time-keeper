"use client";
import { useState, useCallback } from "react";
import { useChime } from "../hooks/useChime";
import { useTimer } from "../hooks/useTimer";
import { useNotification } from "../hooks/useNotification";
import { TimerDisplay } from "./TimerDisplay";
import { IntervalPicker } from "./IntervalPicker";
import { Controls } from "./Controls";

export function TimeKeeper() {
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const { playChime } = useChime();
  const { requestPermission, notify } = useNotification();

  const handleChime = useCallback(() => {
    playChime();
    notify("Time Keeper", "タスクを切り替える時間です！");
  }, [playChime, notify]);

  const timer = useTimer(intervalMinutes * 60 * 1000, handleChime);

  const handleStart = useCallback(() => {
    requestPermission();
    timer.start();
  }, [requestPermission, timer]);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Time Keeper
      </h1>

      <TimerDisplay
        remainingMs={timer.remainingMs}
        totalMs={intervalMinutes * 60 * 1000}
        isRunning={timer.isRunning}
      />

      <IntervalPicker
        value={intervalMinutes}
        onChange={setIntervalMinutes}
        disabled={timer.isRunning}
      />

      <Controls
        isRunning={timer.isRunning}
        onStart={handleStart}
        onStop={timer.stop}
        onReset={timer.reset}
        onTestChime={playChime}
      />

      <p className="text-sm text-zinc-400">
        Completed cycles: {timer.completedCycles}
      </p>
    </div>
  );
}
