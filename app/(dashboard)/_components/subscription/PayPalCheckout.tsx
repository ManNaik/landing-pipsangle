"use client";

import { useEffect, useRef, useState } from "react";
import {
  capturePayPalOrder,
  createPayPalOrder,
  fetchPayPalConfig,
} from "../../../lib/paymentsApi";

type PayPalButtonsInstance = {
  render: (container: HTMLElement) => Promise<void>;
  close?: () => void;
};

type PayPalNamespace = {
  Buttons: (options: {
    style?: Record<string, string | number>;
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }) => Promise<void>;
    onError: (err: unknown) => void;
    onCancel?: () => void;
  }) => PayPalButtonsInstance;
};

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

const SDK_SCRIPT_ID = "paypal-sdk-script";

function loadPayPalSdk(clientId: string, currency: string): Promise<PayPalNamespace> {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }
    const existing = document.getElementById(SDK_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.id = SDK_SCRIPT_ID;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${currency}&intent=capture`;
      document.body.appendChild(script);
    }
    script.addEventListener("load", () => {
      if (window.paypal) resolve(window.paypal);
      else reject(new Error("PayPal SDK failed to initialize."));
    });
    script.addEventListener("error", () => reject(new Error("Failed to load PayPal SDK.")));
  });
}

type PayPalCheckoutProps = {
  planSlug: string;
  label?: string;
  onSuccess: () => void;
};

export function PayPalCheckout({ planSlug, label, onSuccess }: PayPalCheckoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "processing" | "unconfigured" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let buttons: PayPalButtonsInstance | null = null;

    async function setup() {
      try {
        const config = await fetchPayPalConfig();
        if (cancelled) return;
        if (!config.client_id) {
          setState("unconfigured");
          return;
        }

        const paypal = await loadPayPalSdk(config.client_id, config.currency || "USD");
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";
        buttons = paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal", height: 45 },
          createOrder: () => createPayPalOrder(planSlug),
          onApprove: async (data) => {
            setState("processing");
            setError(null);
            try {
              await capturePayPalOrder(data.orderID);
              onSuccess();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Payment capture failed.");
              setState("ready");
            }
          },
          onError: () => {
            setError("PayPal checkout failed. Please try again.");
            setState("ready");
          },
          onCancel: () => setState("ready"),
        });
        await buttons.render(containerRef.current);
        if (!cancelled) setState("ready");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load PayPal.");
          setState("error");
        }
      }
    }

    void setup();
    return () => {
      cancelled = true;
      buttons?.close?.();
    };
  }, [planSlug, onSuccess]);

  if (state === "unconfigured") {
    return (
      <p className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-xs text-zinc-500">
        Payments are not configured yet. Set <code className="text-zinc-400">PAYPAL_CLIENT_ID</code>{" "}
        and <code className="text-zinc-400">PAYPAL_CLIENT_SECRET</code> on the backend to enable
        PayPal checkout.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-medium text-zinc-400">{label}</p>}
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}
      {state === "loading" && (
        <div className="flex h-[45px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60">
          <span className="text-xs text-zinc-500">Loading PayPal…</span>
        </div>
      )}
      {state === "processing" && (
        <div className="flex h-[45px] items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
          <span className="text-xs text-emerald-300">Confirming payment…</span>
        </div>
      )}
      <div ref={containerRef} className={state === "processing" ? "hidden" : ""} />
    </div>
  );
}
