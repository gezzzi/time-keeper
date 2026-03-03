export interface TimerState {
  isRunning: boolean;
  anchorHour: number;
  anchorMinute: number;
  intervalMs: number;
  chimeType: string;
}

const g = globalThis as unknown as { __timerState?: TimerState };

if (!g.__timerState) {
  g.__timerState = {
    isRunning: false,
    anchorHour: 0,
    anchorMinute: 0,
    intervalMs: 30 * 60 * 1000,
    chimeType: "westminster",
  };
}

export function getTimerState(): TimerState {
  return g.__timerState!;
}

export function setTimerState(partial: Partial<TimerState>): TimerState {
  Object.assign(g.__timerState!, partial);
  return g.__timerState!;
}
