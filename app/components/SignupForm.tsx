"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { track } from "../lib/analytics";
import { readAttribution } from "../lib/attribution";
import { signup } from "../lib/auth";
import { dailyPrice, formatPrice, type PricingTier } from "../lib/pricing";
import { openLogin } from "../lib/uiEvents";

const FIELD =
  "mt-1.5 w-full rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-base text-paper placeholder:text-sage-500 outline-none transition-colors focus:border-mint-500";

const PHONE_COUNTRY_CODES = [
  { code: "91", label: "IN +91" },
  { code: "1", label: "US +1" },
  { code: "44", label: "UK +44" },
  { code: "61", label: "AU +61" },
  { code: "971", label: "AE +971" },
  { code: "65", label: "SG +65" },
  { code: "27", label: "ZA +27" },
  { code: "234", label: "NG +234" },
  { code: "60", label: "MY +60" },
  { code: "63", label: "PH +63" },
];

export function SignupForm({ tiers }: { tiers: PricingTier[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requested = searchParams.get("plan");
  const initialPlan = tiers.some((tier) => tier.id === requested) ? (requested as PricingTier["id"]) : "basic";
  const [plan, setPlan] = useState<PricingTier["id"]>(initialPlan);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const accepted = formData.get("accept") === "on";
    if (!accepted) {
      setError("Please confirm you've read the terms and understand the risks.");
      setLoading(false);
      return;
    }

    try {
      const phoneCountryCode = String(formData.get("phone_country_code") ?? "").trim();
      const phoneNumber = String(formData.get("phone_number") ?? "").trim();
      await signup(email, password, plan, {
        acceptedTerms: true,
        attribution: readAttribution() ?? {},
        phoneCountryCode,
        phoneNumber,
      });
      track("sign_up", { method: "email", plan });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't create your account. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate={false}>
      {error ? (
        <p role="alert" className="rounded-lg border border-coral-400/50 bg-forest-850 px-4 py-3 text-sm text-coral-400">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend className="text-sm font-semibold text-sage-200">Plan</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {tiers.map((tier) => {
            const selected = plan === tier.id;
            return (
              <label
                key={tier.id}
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-colors ${
                  selected ? "border-mint-400 bg-forest-800" : "border-forest-600 bg-forest-850 hover:border-sage-500"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-bold">{tier.name}</span>
                  <input
                    type="radio"
                    name="plan"
                    value={tier.id}
                    checked={selected}
                    onChange={() => setPlan(tier.id)}
                    className="h-4 w-4 accent-mint-500"
                  />
                </span>
                <span className="mt-1 text-sm text-sage-300">
                  {formatPrice(tier.price)} for {tier.periodLabel} ({dailyPrice(tier)} a day)
                </span>
                <span className="mt-1 text-sm text-sage-400">Capital utilization: {tier.capitalUtilization}</span>
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-sage-400">
          You won&apos;t pay anything now. You can switch plans before paying.
        </p>
      </fieldset>

      <label className="block text-sm font-semibold text-sage-200">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={FIELD}
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-sage-200">Phone</legend>
        <div className="mt-1.5 grid grid-cols-[7.5rem_1fr] gap-2">
          <select
            name="phone_country_code"
            required
            defaultValue="91"
            aria-label="Country code"
            className="w-full rounded-lg border border-forest-600 bg-forest-850 px-3 py-3 text-base text-paper outline-none transition-colors focus:border-mint-500"
          >
            {PHONE_COUNTRY_CODES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="phone_number"
            required
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="98765 43210"
            aria-label="Phone number"
            className="w-full rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-base text-paper placeholder:text-sage-500 outline-none transition-colors focus:border-mint-500"
          />
        </div>
        <p className="mt-2 text-sm text-sage-400">One free trial per phone number.</p>
      </fieldset>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-semibold text-sage-200">
          Password for your PipsAngel account
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className={`${FIELD} pr-20`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-[calc(50%+3px)] -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-sage-300 hover:text-paper"
            aria-pressed={showPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-1.5 text-sm text-sage-400">Not your MT5 password. You&apos;ll add that in the next step.</p>
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-sage-300">
        <input type="checkbox" name="accept" required className="mt-1 h-4 w-4 shrink-0 accent-mint-500" />
        <span>
          I&apos;ve read the{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-mint-400 underline underline-offset-4">
            terms of service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-mint-400 underline underline-offset-4">
            privacy policy
          </Link>
          , and I understand that trading on margin is risky and I could lose money.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-mint-500 text-base font-semibold text-white hover:bg-leaf-600 disabled:opacity-60"
      >
        {loading ? "Creating your account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-sage-400">
        Already have an account?{" "}
        <button type="button" onClick={openLogin} className="font-semibold text-mint-400 underline underline-offset-4">
          Log in
        </button>
      </p>
    </form>
  );
}
