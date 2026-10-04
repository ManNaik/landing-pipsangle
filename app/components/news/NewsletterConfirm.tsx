"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "../../lib/analytics";
import { apiPost } from "../../lib/api";
import { HOW_IT_WORKS_PATH } from "../../lib/paths";

type ConfirmState = { status: "working" } | { status: "done" } | { status: "failed"; message: string };

const MISSING_TOKEN =
  "This link is missing its confirmation code. Open the link in the email exactly as it was sent, or sign up again.";
const SUBSCRIBED = "The weekly market brief will arrive in your inbox. You can unsubscribe at any time.";

export function NewsletterConfirm() {
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<ConfirmState>(
    token ? { status: "working" } : { status: "failed", message: MISSING_TOKEN }
  );
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    apiPost<{ detail: string }>("/newsletter/confirm/", { token })
      .then(() => {
        track("newsletter_confirm");
        setState({ status: "done" });
      })
      .catch((err: unknown) => {
        setState({
          status: "failed",
          message: err instanceof Error ? err.message : "We couldn't confirm your subscription. Please try again.",
        });
      });
  }, [token]);

  if (state.status === "working") {
    return (
      <p role="status" className="text-lg text-sage-300">
        Confirming your subscription…
      </p>
    );
  }

  const done = state.status === "done";
  return (
    <div role="status">
      <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em]">
        {done ? "You're subscribed" : "We couldn't confirm that link"}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-sage-300">{done ? SUBSCRIBED : state.message}</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          href="/news"
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-mint-500 px-6 font-semibold text-white hover:bg-leaf-600"
        >
          {done ? "Read the latest news" : "Back to the news"}
        </Link>
        {done ? (
          <Link href={HOW_IT_WORKS_PATH} className="font-semibold text-mint-400 underline underline-offset-4">
            See how PipsAngel works
          </Link>
        ) : null}
      </div>
    </div>
  );
}
