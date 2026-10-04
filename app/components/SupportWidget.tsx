"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "../lib/analytics";
import { apiPost } from "../lib/api";
import { readAttribution } from "../lib/attribution";
import { CHAT_CLOSE_EVENT, CHAT_OPEN_EVENT, MENU_TOGGLE_EVENT, QUICK_ANSWERS } from "../lib/chat";

type SupportWidgetProps = {
  supportEmail: string;
  responseTime?: string;
  whatsappUrl?: string;
  telegramUrl?: string;
};

type Status = "idle" | "sending" | "sent";

export function SupportWidget({ supportEmail, responseTime, whatsappUrl, telegramUrl }: SupportWidgetProps) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    const onMenu = (event: Event) => setMenuOpen(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener(CHAT_OPEN_EVENT, onOpen);
    window.addEventListener(CHAT_CLOSE_EVENT, onClose);
    window.addEventListener(MENU_TOGGLE_EVENT, onMenu);
    return () => {
      window.removeEventListener(CHAT_OPEN_EVENT, onOpen);
      window.removeEventListener(CHAT_CLOSE_EVENT, onClose);
      window.removeEventListener(MENU_TOGGLE_EVENT, onMenu);
    };
  }, []);

  useEffect(() => {
    if (open) {
      headingRef.current?.focus();
      track("support_open");
    } else if (wasOpen.current) {
      launcherRef.current?.focus();
    }
    wasOpen.current = open;
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    setError(null);
    setStatus("sending");
    try {
      await apiPost("/contact/", {
        name,
        email,
        subject: "Question from the website",
        message,
        source: "support_widget",
        attribution: readAttribution() ?? {},
      });
      track("generate_lead", { source: "support_widget" });
      setSentTo(email);
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Your message didn't send. Please try again.");
    }
  }

  return (
    <>
      {!open && !menuOpen ? (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[100] inline-flex h-12 w-12 items-center justify-center gap-2 rounded-full border border-forest-500 bg-forest-800 text-sm font-semibold text-paper transition-colors hover:border-sage-500 hover:bg-forest-700 sm:bottom-6 sm:right-6 sm:h-11 sm:w-auto sm:px-4"
          aria-haspopup="dialog"
          aria-label="Questions? Open help"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 sm:h-4 sm:w-4" fill="none" aria-hidden>
            <path
              d="M4 4.5h12a1 1 0 011 1v7a1 1 0 01-1 1H8l-4 3v-3H4a1 1 0 01-1-1v-7a1 1 0 011-1z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">Questions?</span>
        </button>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="support-widget-title"
          className="fixed inset-x-0 bottom-0 z-[100] flex max-h-[85vh] flex-col rounded-t-2xl border border-forest-600 bg-forest-850 text-paper sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:rounded-2xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-forest-700 px-5 py-4">
            <div>
              <h2 id="support-widget-title" ref={headingRef} tabIndex={-1} className="text-base font-bold outline-none">
                Questions?
              </h2>
              <p className="mt-1 text-sm text-sage-400">Quick answers, or send us a message.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-1 rounded-md p-1.5 text-sage-400 hover:bg-forest-700 hover:text-paper"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="divide-y divide-forest-700 border-y border-forest-700">
              {QUICK_ANSWERS.map((item, index) => {
                const isOpen = expanded === index;
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold"
                    >
                      {item.question}
                      <span className={`text-sage-400 transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden>
                        +
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="pb-4 text-sm leading-relaxed text-sage-300">
                        <p>{item.answer}</p>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="mt-2 inline-block font-semibold text-mint-400 underline underline-offset-4"
                        >
                          {item.linkLabel}
                        </Link>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {whatsappUrl || telegramUrl ? (
              <div className="mt-5 grid gap-2">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("contact_channel", { channel: "whatsapp" })}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-forest-500 text-sm font-semibold hover:bg-forest-700"
                  >
                    Message us on WhatsApp
                  </a>
                ) : null}
                {telegramUrl ? (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("contact_channel", { channel: "telegram" })}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-forest-500 text-sm font-semibold hover:bg-forest-700"
                  >
                    Message us on Telegram
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6">
              {status === "sent" ? (
                <div className="rounded-lg border border-leaf-600 bg-forest-800 px-4 py-4 text-sm">
                  <p className="font-semibold">Message sent.</p>
                  <p className="mt-1 text-sage-300">
                    We&apos;ll reply to {sentTo} by email{responseTime ? `, usually ${responseTime}` : ""}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-3 font-semibold text-mint-400 underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <p className="text-sm font-semibold">Ask us something else</p>
                  {error ? (
                    <p role="alert" className="rounded-lg border border-coral-400/50 bg-forest-800 px-3 py-2 text-sm text-coral-400">
                      {error}
                    </p>
                  ) : null}
                  <label className="block text-sm">
                    <span className="text-sage-300">Name</span>
                    <input
                      name="name"
                      required
                      autoComplete="name"
                      className="mt-1 w-full rounded-lg border border-forest-600 bg-forest-900 px-3 py-2.5 text-paper outline-none focus:border-mint-500"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-sage-300">Email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="mt-1 w-full rounded-lg border border-forest-600 bg-forest-900 px-3 py-2.5 text-paper outline-none focus:border-mint-500"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-sage-300">Message</span>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-forest-600 bg-forest-900 px-3 py-2.5 text-paper outline-none focus:border-mint-500"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-mint-500 text-sm font-semibold text-white hover:bg-leaf-600 disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                  <p className="text-xs leading-relaxed text-sage-500">
                    We reply by email{responseTime ? `, usually ${responseTime}` : ""}. You can also write to{" "}
                    <a href={`mailto:${supportEmail}`} className="text-sage-300 underline underline-offset-2">
                      {supportEmail}
                    </a>
                    . See our{" "}
                    <Link href="/privacy" className="text-sage-300 underline underline-offset-2">
                      privacy policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
