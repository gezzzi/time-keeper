"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useChime, type ChimeType } from "../hooks/useChime";
import { useTimer } from "../hooks/useTimer";
import { useNotification } from "../hooks/useNotification";
import { TimerDisplay } from "./TimerDisplay";
import { AnchorTimePicker } from "./AnchorTimePicker";
import { IntervalPicker } from "./IntervalPicker";
import { ChimePicker } from "./ChimePicker";
import { Controls } from "./Controls";

function syncToServer(data: Record<string, unknown>) {
  fetch("/api/timer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function TimeKeeper() {
  const [loaded, setLoaded] = useState(false);
  const [anchorHour, setAnchorHour] = useState(0);
  const [anchorMinute, setAnchorMinute] = useState(0);
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const [chimeType, setChimeType] = useState<ChimeType>("aurora");
  const shouldResumeRef = useRef(false);

  const { playChime } = useChime(chimeType);
  const { requestPermission, notify } = useNotification();

  const handleChime = useCallback(() => {
    playChime();
    notify("Time Keeper", "タスクを切り替える時間です！");
  }, [playChime, notify]);

  const timer = useTimer(
    { anchorHour, anchorMinute, intervalMs: intervalMinutes * 60 * 1000 },
    handleChime,
  );

  // Fetch server state on mount
  useEffect(() => {
    fetch("/api/timer")
      .then((res) => res.json())
      .then((state) => {
        setAnchorHour(state.anchorHour);
        setAnchorMinute(state.anchorMinute);
        setIntervalMinutes(state.intervalMs / 60000);
        setChimeType(state.chimeType as ChimeType);
        if (state.isRunning) {
          shouldResumeRef.current = true;
        }
        setLoaded(true);
      });
  }, []);

  // Resume timer after state is loaded and rendered with correct config
  useEffect(() => {
    if (loaded && shouldResumeRef.current && !timer.isRunning) {
      shouldResumeRef.current = false;
      timer.start();
    }
  }, [loaded, timer]);

  const handleStart = useCallback(() => {
    requestPermission();
    syncToServer({
      isRunning: true,
      anchorHour,
      anchorMinute,
      intervalMs: intervalMinutes * 60 * 1000,
      chimeType,
    });
    timer.start();
  }, [requestPermission, timer, anchorHour, anchorMinute, intervalMinutes, chimeType]);

  const handleStop = useCallback(() => {
    syncToServer({ isRunning: false });
    timer.stop();
  }, [timer]);

  const handleReset = useCallback(() => {
    syncToServer({ isRunning: false });
    timer.reset();
  }, [timer]);

  // Sync config changes to server while stopped
  useEffect(() => {
    if (loaded && !timer.isRunning) {
      syncToServer({
        anchorHour,
        anchorMinute,
        intervalMs: intervalMinutes * 60 * 1000,
        chimeType,
      });
    }
  }, [anchorHour, anchorMinute, intervalMinutes, chimeType, loaded, timer.isRunning]);

  if (!loaded) {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Time Keeper
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Time Keeper
      </h1>

      <TimerDisplay
        remainingMs={timer.remainingMs}
        totalMs={intervalMinutes * 60 * 1000}
        isRunning={timer.isRunning}
        nextChimeTime={timer.nextChimeTime}
      />

      <AnchorTimePicker
        hour={anchorHour}
        minute={anchorMinute}
        onChangeHour={setAnchorHour}
        onChangeMinute={setAnchorMinute}
        disabled={timer.isRunning}
      />

      <IntervalPicker
        value={intervalMinutes}
        onChange={setIntervalMinutes}
        disabled={timer.isRunning}
      />

      <ChimePicker
        value={chimeType}
        onChange={setChimeType}
        onTest={playChime}
        disabled={timer.isRunning}
      />

      <Controls
        isRunning={timer.isRunning}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
      />

      <p className="text-sm text-zinc-400">
        Completed cycles: {timer.completedCycles}
      </p>
    </div>
  );
}
