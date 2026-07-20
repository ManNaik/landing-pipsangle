"use client";

import { useSearchParams } from "next/navigation";
import type { SubscriptionScreen } from "../../lib/subscriptionData";
import { useAuth } from "../../lib/useAuth";
import { useSubscriptionInfo } from "../../lib/useSubscriptionInfo";
import { ActiveSubscriptionCard } from "../_components/ActiveSubscriptionCard";

const VALID_VIEWS = new Set<SubscriptionScreen>([
  "extend",
  "renew",
  "expired",
  "active",
  "trial",
]);

function parseInitialScreen(view: string | null): SubscriptionScreen | null {
  if (!view || !VALID_VIEWS.has(view as SubscriptionScreen)) return null;
  return view as SubscriptionScreen;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { subscription, refresh } = useSubscriptionInfo(user);
  const searchParams = useSearchParams();
  const initialScreen = parseInitialScreen(searchParams.get("view"));

  if (!user || !subscription) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-400/70">
          Account billing
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Subscription
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage renewals, extensions, and plan access for your account.
        </p>
      </header>

      <ActiveSubscriptionCard
        user={user}
        subscription={subscription}
        onSubscriptionChange={refresh}
        initialScreen={initialScreen}
      />
    </div>
  );
}
