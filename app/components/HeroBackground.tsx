"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function HeroBackground() {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  if (reduceMotion) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/40"
        aria-hidden
      />
    );
  }

  return (
    <div className="absolute inset-0" aria-hidden>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%2309090b' width='1920' height='1080'/%3E%3C/svg%3E"
        className="h-full w-full object-cover opacity-35"
        aria-label="Decorative background video"
      >
        <source src="/Bg-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
