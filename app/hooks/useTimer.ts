"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface TimerReturn {
  isRunning: boolean;
  remainingMs: number;
  completedCycles: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(intervalMs: number, onComplete: () => void): TimerReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(intervalMs);
  const [completedCycles, setCompletedCycles] = useState(0);

  const targetTimeRef = useRef<number>(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const intervalMsRef = useRef(intervalMs);

  onCompleteRef.current = onComplete;
  intervalMsRef.current = intervalMs;

  const tick = useCallback(() => {
    const now = Date.now();
    const remaining = targetTimeRef.current - now;

    if (remaining <= 0) {
      onCompleteRef.current();
      setCompletedCycles((c) => c + 1);
      targetTimeRef.current = now + intervalMsRef.current;
      setRemainingMs(intervalMsRef.current);
    } else {
      setRemainingMs(remaining);
    }
  }, []);

  const start = useCallback(() => {
    targetTimeRef.current = Date.now() + intervalMsRef.current;
    setRemainingMs(intervalMsRef.current);
    setIsRunning(true);

    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(tick, 250);
  }, [tick]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setRemainingMs(intervalMsRef.current);
    setCompletedCycles(0);
  }, [stop]);

  // Sync remainingMs when intervalMs changes while stopped
  useEffect(() => {
    if (!isRunning) {
      setRemainingMs(intervalMs);
    }
  }, [intervalMs, isRunning]);

  // visibilitychange handler
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && intervalIdRef.current) {
        tick();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  return { isRunning, remainingMs, completedCycles, start, stop, reset };
}
