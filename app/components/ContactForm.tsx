"use client";

import { useState } from "react";
import { track } from "../lib/analytics";
import { apiPost } from "../lib/api";
import { readAttribution } from "../lib/attribution";

type ContactResponse = {
  id: string;
  message: string;
};

const TOPICS = [
  "Help connecting my account",
  "Billing and payments",
  "Questions before signing up",
  "Something else",
];

const FIELD =
  "mt-1.5 w-full rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-base text-paper outline-none transition-colors focus:border-mint-500";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    try {
      await apiPost<ContactResponse>("/contact/", {
        name: formData.get("name"),
        email,
        subject: formData.get("subject"),
        message: formData.get("message"),
        source: "contact_page",
        attribution: readAttribution() ?? {},
      });
      track("generate_lead", { source: "contact_page" });
      setSentTo(email);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message didn't send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <div className="rounded-2xl border border-leaf-600 bg-forest-850 p-6 sm:p-8" role="status">
        <h2 className="text-xl font-bold">Message sent</h2>
        <p className="mt-2 leading-relaxed text-sage-300">We&apos;ll reply to {sentTo} by email.</p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-4 font-semibold text-mint-400 underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5 rounded-2xl border border-forest-600 bg-forest-900 p-6 sm:p-8" onSubmit={handleSubmit}>
      {error ? (
        <p role="alert" className="rounded-lg border border-coral-400/50 bg-forest-850 px-4 py-3 text-sm text-coral-400">
          {error}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-sage-200">
          Name
          <input name="name" required autoComplete="name" className={FIELD} />
        </label>
        <label className="block text-sm font-semibold text-sage-200">
          Email
          <input name="email" type="email" required autoComplete="email" className={FIELD} />
        </label>
      </div>
      <label className="block text-sm font-semibold text-sage-200">
        What&apos;s it about?
        <select name="subject" required defaultValue={TOPICS[0]} className={FIELD}>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold text-sage-200">
        Message
        <textarea name="message" required rows={6} className={FIELD} />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-mint-500 font-semibold text-white hover:bg-leaf-600 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
