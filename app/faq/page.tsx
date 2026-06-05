import type { Metadata } from "next";

const faqItems = [
  {
    question: "How are trades generated?",
    answer:
      "Our trading strategies combine technical indicators and algorithmic market analysis.",
  },
  {
    question: "Is automated trading safe?",
    answer:
      "The system follows predefined risk management rules and always uses stop loss protection.",
  },
  {
    question: "Can I stop automation anytime?",
    answer: "Yes, automation can be paused or disabled anytime.",
  },
  {
    question: "Do I need trading experience?",
    answer: "No, beginners can start with signals and upgrade later.",
  },
  {
    question: "Which brokers are supported?",
    answer:
      "Our signals and automation work with MetaTrader 4, MetaTrader 5, and major forex brokers.",
  },
];

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about PipAngel signals and automated trading.",
};

export default function FAQPage() {
  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Common questions about our signals and automation.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl min-w-0 space-y-3 sm:space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-6"
            >
              <h2 className="font-medium text-white text-base sm:text-lg">{item.question}</h2>
              <p className="mt-2 text-sm text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
