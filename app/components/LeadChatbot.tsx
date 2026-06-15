"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiPost } from "../lib/api";
import {
  AUTO_OPEN_DELAY_MS,
  getNextStep,
  getSignupUrl,
  LEAD_CAPTURE_MESSAGE,
  LEAD_CHAT_STEPS,
  LEAD_SUCCESS_MESSAGE,
  SESSION_DONE_KEY,
  SESSION_SEEN_KEY,
  type LeadChatAnswers,
  type LeadChatButton,
  type LeadChatStep,
  type LeadExperience,
  type LeadInterest,
  type LeadPlanInterest,
} from "../lib/leadChatFlow";
import type { LeadSubmissionResponse } from "../lib/types";

type ChatMessage =
  | { type: "bot"; text: string }
  | { type: "user"; text: string };

type PanelState = "minimized" | "open" | "completed";

export function LeadChatbot() {
  const [mounted, setMounted] = useState(false);
  const [panelState, setPanelState] = useState<PanelState>("minimized");
  const [step, setStep] = useState<LeadChatStep>("welcome");
  const [answers, setAnswers] = useState<LeadChatAnswers>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: "bot", text: LEAD_CHAT_STEPS.welcome.message },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const minimize = useCallback(() => {
    setPanelState("minimized");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_SEEN_KEY, "1");
    }
  }, []);

  const openPanel = useCallback(() => {
    setPanelState("open");
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_SEEN_KEY, "1");
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_DONE_KEY)) return;

    const timer = window.setTimeout(() => {
      if (!sessionStorage.getItem(SESSION_SEEN_KEY)) {
        openPanel();
      }
    }, AUTO_OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [mounted, openPanel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step, panelState]);

  useEffect(() => {
    if (panelState !== "open") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") minimize();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panelState, minimize]);

  function advanceStep(
    next: LeadChatStep,
    userLabel?: string,
    answerUpdate?: Partial<LeadChatAnswers>
  ) {
    if (userLabel) {
      setMessages((prev) => [...prev, { type: "user", text: userLabel }]);
    }
    if (answerUpdate) {
      setAnswers((prev) => ({ ...prev, ...answerUpdate }));
    }

    if (next === "capture") {
      setMessages((prev) => [...prev, { type: "bot", text: LEAD_CAPTURE_MESSAGE }]);
      setStep("capture");
      return;
    }

    if (next === "success") {
      setMessages((prev) => [...prev, { type: "bot", text: LEAD_SUCCESS_MESSAGE }]);
      setStep("success");
      setPanelState("completed");
      return;
    }

    const config = LEAD_CHAT_STEPS[next as keyof typeof LEAD_CHAT_STEPS];
    if (config) {
      setMessages((prev) => [...prev, { type: "bot", text: config.message }]);
    }
    setStep(next);
  }

  function handleButtonClick(button: LeadChatButton, stepId: LeadChatStep) {
    if (button.action === "dismiss") {
      minimize();
      return;
    }

    const updates: Partial<LeadChatAnswers> = {};
    if (stepId === "interest" && button.value) {
      updates.interest = button.value as LeadInterest;
    }
    if (stepId === "experience" && button.value) {
      updates.experience = button.value as LeadExperience;
    }
    if (stepId === "plan" && button.value) {
      updates.plan_interest = button.value as LeadPlanInterest;
    }

    const next = getNextStep(stepId);
    if (!next) return;
    advanceStep(next, button.label, updates);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();

    if (!answers.interest || !answers.experience || !answers.plan_interest) {
      setError("Please complete the previous steps first.");
      setLoading(false);
      return;
    }

    try {
      await apiPost<LeadSubmissionResponse>("/leads/", {
        name,
        email,
        interest: answers.interest,
        experience: answers.experience,
        plan_interest: answers.plan_interest,
        source: "homepage_chatbot",
      });
      sessionStorage.setItem(SESSION_DONE_KEY, "1");
      advanceStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  const launcher = (
    <button
      type="button"
      onClick={openPanel}
      className={`fixed bottom-4 right-4 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 sm:bottom-6 sm:right-6 ${
        panelState === "open" || panelState === "completed" ? "hidden" : ""
      }`}
      aria-label="Open PipAngel assistant"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
      </svg>
    </button>
  );

  const panel =
    panelState === "open" || panelState === "completed"
      ? createPortal(
          <div
            className="fixed inset-x-0 bottom-0 z-[100] flex justify-end p-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:p-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-chat-title"
          >
            <div
              ref={panelRef}
              className="flex h-[min(520px,85vh)] w-full flex-col rounded-t-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50 sm:h-[480px] sm:w-[360px] sm:rounded-2xl"
            >
              <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
                    PipAngel
                  </p>
                  <h2 id="lead-chat-title" className="text-sm font-semibold text-white">
                    Assistant
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={minimize}
                  className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Minimize chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.type}-${i}`}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.type === "user"
                          ? "bg-emerald-500/20 text-emerald-100"
                          : "bg-zinc-800 text-zinc-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <footer className="border-t border-zinc-800 px-4 py-3">
                {step === "welcome" && (
                  <div className="flex flex-col gap-2">
                    {LEAD_CHAT_STEPS.welcome.buttons?.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleButtonClick(btn, "welcome")}
                        className={
                          btn.action === "dismiss"
                            ? "rounded-lg border border-zinc-700 px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
                            : "rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
                        }
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {step === "interest" && (
                  <div className="flex flex-col gap-2">
                    {LEAD_CHAT_STEPS.interest.buttons?.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleButtonClick(btn, "interest")}
                        className="rounded-lg border border-zinc-700 px-3 py-2.5 text-left text-sm text-zinc-200 transition hover:border-emerald-500/40 hover:bg-zinc-800"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {step === "experience" && (
                  <div className="flex flex-col gap-2">
                    {LEAD_CHAT_STEPS.experience.buttons?.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleButtonClick(btn, "experience")}
                        className="rounded-lg border border-zinc-700 px-3 py-2.5 text-left text-sm text-zinc-200 transition hover:border-emerald-500/40 hover:bg-zinc-800"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {step === "plan" && (
                  <div className="flex flex-col gap-2">
                    {LEAD_CHAT_STEPS.plan.buttons?.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleButtonClick(btn, "plan")}
                        className="rounded-lg border border-zinc-700 px-3 py-2.5 text-left text-sm text-zinc-200 transition hover:border-emerald-500/40 hover:bg-zinc-800"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {step === "capture" && (
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    {error && (
                      <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                        {error}
                      </p>
                    )}
                    <div>
                      <label htmlFor="lead-name" className="sr-only">
                        Name
                      </label>
                      <input
                        id="lead-name"
                        name="name"
                        required
                        placeholder="Your name"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-email" className="sr-only">
                        Email
                      </label>
                      <input
                        id="lead-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/60"
                      />
                    </div>
                    <p className="text-xs text-zinc-500">
                      We&apos;ll use your email to follow up. See our{" "}
                      <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {loading ? "Submitting…" : "Submit"}
                    </button>
                  </form>
                )}

                {step === "success" && (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/pricing"
                      className="rounded-lg border border-zinc-700 px-3 py-2.5 text-center text-sm text-zinc-200 transition hover:bg-zinc-800"
                    >
                      View pricing
                    </Link>
                    <Link
                      href={getSignupUrl(answers.plan_interest)}
                      className="rounded-lg bg-emerald-500 px-3 py-2.5 text-center text-sm font-medium text-white transition hover:bg-emerald-600"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </footer>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {launcher}
      {panel}
    </>
  );
}
