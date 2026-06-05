import type { Metadata } from "next";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$29",
    features: [
      "Daily forex signals",
      "Trade analysis",
      "Performance history",
    ],
  },
  {
    name: "Premium",
    price: "$99",
    features: [
      "Automation trading",
      "Risk management engine",
      "Trade dashboard",
    ],
  },
];

export const metadata: Metadata = {
  title: "Forex Signals Pricing",
  description:
    "Choose a forex trading signals or automation plan.",
};

export default function PricingPage() {
  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Forex Signals Pricing
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Choose the plan that fits your trading goals.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl min-w-0">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 sm:p-8 ${
                  plan.name === "Premium"
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-zinc-800 bg-zinc-900/30"
                }`}
              >
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  {plan.name}
                </h2>
                <p className="mt-2">
                  <span className="text-2xl font-bold text-white sm:text-3xl">
                    {plan.price}
                  </span>
                  <span className="text-zinc-500">/month</span>
                </p>
                <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-zinc-400"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-6 block rounded-lg py-3 text-center text-sm font-medium transition min-h-[3rem] flex items-center justify-center sm:mt-8 ${
                    plan.name === "Premium"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "border border-zinc-600 text-white hover:bg-zinc-800"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
