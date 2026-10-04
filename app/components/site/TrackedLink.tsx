"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackCtaClick } from "../../lib/analytics";

export function TrackedLink({
  href,
  location,
  label,
  className,
  children,
}: {
  href: string;
  location: string;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackCtaClick(location, label)}>
      {children}
    </Link>
  );
}
