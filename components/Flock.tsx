"use client";

import { useEffect, useRef } from "react";
import type { FlockHandle } from "@/lib/flock-core";

/**
 * The homepage's only client code. Desktop-only by design: a real mouse, a
 * wide screen, and no request for reduced motion. The same query gates the
 * canvas in CSS (.flock), so on phones it is never shown and the animation
 * code is never downloaded. On desktop it loads when the browser is idle,
 * after the page is already readable.
 */
const QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/** Skip machines that report being weak; the page is complete without it. */
function lowEndDevice(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    (nav.hardwareConcurrency ?? 8) < 4 ||
    (nav.deviceMemory ?? 8) < 4 ||
    nav.connection?.saveData === true
  );
}

export function Flock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || lowEndDevice()) return;

    const media = window.matchMedia(QUERY);
    let flock: FlockHandle | null = null;
    let loading = false;
    let disposed = false;

    const start = () => {
      if (flock || loading || !media.matches) return;
      loading = true;
      import("@/lib/flock-core").then(({ createFlock }) => {
        loading = false;
        if (disposed || !media.matches) return;
        flock = createFlock(canvas);
        flock.setActive(!document.hidden);
        // Reveals the "Curious about the cursor?" note only when the flock really runs.
        document.documentElement.dataset.flock = "on";
      });
    };

    const stop = () => {
      flock?.destroy();
      flock = null;
      delete document.documentElement.dataset.flock;
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    };

    const onMediaChange = () => (media.matches ? start() : stop());
    const onVisibility = () => flock?.setActive(!document.hidden);

    // Safari has no requestIdleCallback; a short timeout does the same job.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : window.setTimeout(start, 300);
    const cancelIdle = () =>
      hasIdle ? window.cancelIdleCallback(idleId) : window.clearTimeout(idleId);

    media.addEventListener("change", onMediaChange);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      cancelIdle();
      media.removeEventListener("change", onMediaChange);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} className="flock" aria-hidden="true" />;
}
