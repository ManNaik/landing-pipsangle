"use client";

import { useState } from "react";
import type { AuthUser } from "../../lib/types";
import { useBrokerConnection } from "../../lib/useBrokerConnection";
import { BrokerConnectionProvider } from "./BrokerConnectionContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { OnboardingModal } from "./OnboardingModal";

type DashboardShellProps = {
  user: AuthUser;
  brandName: string;
  children: React.ReactNode;
};

export function DashboardShell({ user, brandName, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const broker = useBrokerConnection({ userId: user.id, userEmail: user.email });

  return (
    <BrokerConnectionProvider
      value={{
        status: broker.status,
        openOnboarding: broker.openOnboarding,
        showConnectedMessage: broker.showConnectedMessage,
        dismissConnectedMessage: broker.dismissConnectedMessage,
      }}
    >
      <div className="flex min-h-screen bg-zinc-950">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <DashboardTopbar
            brandName={brandName}
            brokerStatus={broker.status}
            onMenuOpen={() => setSidebarOpen(true)}
          />

          <main
            id="main-content"
            className="flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8"
          >
            {children}
          </main>
        </div>
      </div>

      <OnboardingModal
        open={broker.onboardingOpen}
        status={broker.status}
        onSkip={broker.handleSkip}
        onClose={broker.closeOnboarding}
        onSubmit={broker.handleSubmit}
        onCompleteVerification={broker.handleCompleteVerification}
      />
    </BrokerConnectionProvider>
  );
}
