import { useEffect, useRef, useState } from "react";

// Animates a number from 0 up to `target` with an ease-out curve, instead of
// having stats (cost, match score, etc.) just snap into place. Used on the
// AI Trip Planner's result view so the numbers feel like they're "arriving".
//
// Skips straight to `target` if the visitor has prefers-reduced-motion set,
// or while `active` is false (e.g. before the value has actually loaded).
export default function useCountUp(target, { duration = 900, active = true } = {}) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const numericTarget = Number(target) || 0;

    if (!active) {
      setValue(0);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(numericTarget);
      return;
    }

    let start;
    const step = (timestamp) => {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.round(numericTarget * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, active]);

  return value;
}
