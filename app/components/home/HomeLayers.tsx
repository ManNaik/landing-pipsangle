"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_LAYERS } from "../../lib/homeContent";

const STEP_MS = 1650;
const LAYER_COUNT = HOME_LAYERS.length;

export function HomeLayers() {
  const listRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduceMotion) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % LAYER_COUNT);
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [visible, reduceMotion]);

  const flowActive = visible && !reduceMotion;

  return (
    <section
      id="what-is-pipangel"
      className="border-b border-zinc-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
            What is PipAngel?
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            More Than an Automated Trading Bot
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            PipAngel is built around multiple layers of trading intelligence. AI
            analyzes market conditions, professional trading expertise adds
            validation, and risk controls determine how much capital can be
            exposed before execution.
          </p>
        </div>

        <ol
          ref={listRef}
          className="home-layers relative min-w-0"
          data-active={flowActive ? String(active) : undefined}
        >
          {HOME_LAYERS.map((layer, idx) => {
            const isActive = flowActive && active === idx;
            const isLast = idx === HOME_LAYERS.length - 1;

            return (
              <li
                key={layer.step}
                className={`home-layers-item relative flex gap-4 pb-8 last:pb-0 ${
                  isActive ? "is-active" : ""
                }`}
              >
                {!isLast && (
                  <span className="home-layers-connector" aria-hidden>
                    {isActive && <span className="home-layers-spark" />}
                  </span>
                )}
                <span className="home-layers-node relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-[#09090b] font-mono text-[11px]">
                  {layer.step.replace("0", "")}
                </span>
                <div
                  className={`min-w-0 flex-1 pt-0.5 ${idx === 1 ? "lg:translate-x-6" : ""}`}
                >
                  <h3 className="home-layers-title text-base font-semibold sm:text-lg">
                    {layer.title}
                  </h3>
                  <p className="home-layers-copy mt-1.5 text-sm leading-relaxed">
                    {layer.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
