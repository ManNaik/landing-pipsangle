"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { track } from "../../lib/analytics";
import { apiPost } from "../../lib/api";
import { readAttribution } from "../../lib/attribution";

type SubscribeResponse = { detail: string };

export function NewsletterSignup({ source }: { source: string }) {
  const inputId = useId();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError(null);
    setSending(true);
    try {
      const response = await apiPost<SubscribeResponse>("/newsletter/subscribe/", {
        email: String(data.get("email") ?? "").trim(),
        website: String(data.get("website") ?? ""),
        source,
        attribution: readAttribution() ?? {},
      });
      track("newsletter_signup", { source });
      setConfirmation(response.detail);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't go through. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      aria-labelledby={`${inputId}-title`}
      className="border-t border-forest-700 bg-forest-950 px-5 py-14 sm:px-8 sm:py-16"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16">
        <div className="max-w-xl">
          <h2 id={`${inputId}-title`} className="text-2xl font-bold sm:text-[1.75rem]">
            The weekly market brief
          </h2>
          <p className="mt-3 leading-relaxed text-sage-300">
            One email a week with the economic releases and central bank decisions most likely to move currencies
            in the days ahead, plus our latest market notes. It&apos;s free, and you can unsubscribe at any time.
          </p>
        </div>

        {confirmation ? (
          <p role="status" className="rounded-xl border border-leaf-600 bg-forest-850 px-5 py-4 leading-relaxed text-sage-200">
            {confirmation}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <label htmlFor={inputId} className="text-sm font-semibold text-sage-200">
              Email address
            </label>
            <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
              <input
                id={inputId}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="min-h-12 w-full min-w-0 rounded-lg border border-forest-600 bg-forest-850 px-4 text-base text-paper outline-none transition-colors placeholder:text-sage-500 focus:border-mint-500"
              />
              <button
                type="submit"
                disabled={sending}
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-mint-500 px-6 font-semibold text-white transition-colors hover:bg-leaf-600 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Get the brief"}
              </button>
            </div>
            <div hidden aria-hidden>
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            {error ? (
              <p role="alert" className="mt-3 text-sm text-coral-400">
                {error}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-sage-400">
              We&apos;ll email you a link to confirm. We won&apos;t share your address. See our{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-paper">
                privacy policy
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
