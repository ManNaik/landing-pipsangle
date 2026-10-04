"use client";

import type { ReactNode } from "react";
import { openChat } from "../../lib/chat";

export function OpenSupportLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={openChat} className={className}>
      {children}
    </button>
  );
}
