"use client";

import type { AuthUser } from "../../lib/types";
import { useBrokerConnection } from "../../lib/useBrokerConnection";
import { BrokerConnectionProvider } from "./BrokerConnectionContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useState } from "react";

type DashboardShellProps = {
  user: AuthUser;
  brandName: string;
  children: React.ReactNode;
};

export function DashboardShell({ user, brandName, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const broker = useBrokerConnection({
    userId: user.id,
    userEmail: user.email,
    autoRedirect: false,
  });

  return (
    <BrokerConnectionProvider
      value={{
        connection: broker.connection,
        status: broker.status,
        loading: broker.loading,
        submitting: broker.submitting,
        error: broker.error,
        openOnboarding: broker.openOnboarding,
        handleSkip: broker.handleSkip,
        handleSubmit: broker.handleSubmit,
        refresh: broker.refresh,
        showConnectedMessage: broker.showConnectedMessage,
        dismissConnectedMessage: broker.dismissConnectedMessage,
      }}
    >
      <div className="flex min-h-screen bg-zinc-950">
        <DashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          brandName={brandName}
        />

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
    </BrokerConnectionProvider>
  );
}
