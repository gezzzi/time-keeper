"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export interface ScheduleConfig {
  anchorHour: number;
  anchorMinute: number;
  intervalMs: number;
}

interface TimerReturn {
  isRunning: boolean;
  remainingMs: number;
  completedCycles: number;
  nextChimeTime: number | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

function calcNextChime(
  nowMs: number,
  anchorHour: number,
  anchorMinute: number,
  intervalMs: number,
): number {
  const now = new Date(nowMs);
  const anchor = new Date(now);
  anchor.setHours(anchorHour, anchorMinute, 0, 0);
  const anchorMs = anchor.getTime();

  const elapsed = nowMs - anchorMs;
  const n = Math.ceil(elapsed / intervalMs);
  const next = anchorMs + n * intervalMs;

  if (next <= nowMs) {
    return next + intervalMs;
  }
  return next;
}

export function useTimer(
  config: ScheduleConfig,
  onComplete: () => void,
): TimerReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(config.intervalMs);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [nextChimeTime, setNextChimeTime] = useState<number | null>(null);

  const targetTimeRef = useRef<number>(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const configRef = useRef(config);

  onCompleteRef.current = onComplete;
  configRef.current = config;

  const tick = useCallback(() => {
    const now = Date.now();
    const remaining = targetTimeRef.current - now;

    if (remaining <= 0) {
      onCompleteRef.current();
      setCompletedCycles((c) => c + 1);
      const c = configRef.current;
      const next = calcNextChime(Date.now(), c.anchorHour, c.anchorMinute, c.intervalMs);
      targetTimeRef.current = next;
      setNextChimeTime(next);
      setRemainingMs(next - Date.now());
    } else {
      setRemainingMs(remaining);
    }
  }, []);

  const start = useCallback(() => {
    const c = configRef.current;
    const next = calcNextChime(Date.now(), c.anchorHour, c.anchorMinute, c.intervalMs);
    targetTimeRef.current = next;
    setNextChimeTime(next);
    setRemainingMs(next - Date.now());
    setIsRunning(true);

    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(tick, 250);
  }, [tick]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setNextChimeTime(null);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setRemainingMs(configRef.current.intervalMs);
    setCompletedCycles(0);
  }, [stop]);

  useEffect(() => {
    if (!isRunning) {
      setRemainingMs(config.intervalMs);
      setNextChimeTime(null);
    }
  }, [config.intervalMs, config.anchorHour, config.anchorMinute, isRunning]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && intervalIdRef.current) {
        tick();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  return { isRunning, remainingMs, completedCycles, nextChimeTime, start, stop, reset };
}
