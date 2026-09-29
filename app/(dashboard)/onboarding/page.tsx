"use client";

import { useBrokerConnectionContext } from "../_components/BrokerConnectionContext";
import { OnboardingChecklist } from "../_components/OnboardingChecklist";

export default function OnboardingPage() {
  const {
    connection,
    loading,
    submitting,
    error,
    handleSubmit,
    handleSkip,
    refresh,
  } = useBrokerConnectionContext();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-zinc-400">Loading onboarding status…</p>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4">
      <OnboardingChecklist
        connection={connection}
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        onRefresh={() => {
          void refresh();
        }}
      />
    </div>
  );
}
