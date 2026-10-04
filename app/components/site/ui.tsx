import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

const BUTTON_BASE =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-[0.95rem] font-semibold transition-colors duration-150";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-mint-500 text-white hover:bg-leaf-600",
  secondary: "border border-forest-500 text-paper hover:border-sage-500 hover:bg-forest-800",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${extra}`.trim();
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`font-semibold text-mint-400 underline decoration-mint-400/40 underline-offset-4 transition-colors hover:decoration-mint-400 ${className}`}
    >
      {children}
    </Link>
  );
}

type SectionTone = "base" | "raised" | "deep";

const SECTION_TONES: Record<SectionTone, string> = {
  base: "bg-forest-900",
  raised: "bg-forest-850",
  deep: "border-y border-forest-700 bg-forest-950",
};

export function Section({
  id,
  tone = "base",
  className = "",
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${SECTION_TONES[tone]} scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20 lg:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionIntro({
  title,
  children,
  className = "",
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.015em] sm:text-[2.15rem]">
        {title}
      </h2>
      {children ? <div className="mt-4 text-[1.0625rem] leading-relaxed text-sage-300">{children}</div> : null}
    </div>
  );
}

export function PageHero({
  title,
  children,
  aside,
}: {
  title: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-forest-700 px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h1 className="text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">{title}</h1>
          {children ? (
            <div className="mt-5 max-w-2xl text-lg leading-relaxed text-sage-300">{children}</div>
          ) : null}
        </div>
        {aside ? <div className="mt-8">{aside}</div> : null}
      </div>
    </section>
  );
}

export function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrossIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5.5 5.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
