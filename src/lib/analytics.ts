import { YANDEX_METRIKA_ID } from "./site";

declare global {
  interface Window {
    ym?: (counterId: number, method: "reachGoal", goalName: string) => void;
  }
}

export function trackGoal(goalName: string) {
  window.ym?.(YANDEX_METRIKA_ID, "reachGoal", goalName);
}
