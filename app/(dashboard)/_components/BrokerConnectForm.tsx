"use client";

import { useState } from "react";
import {
  CONNECTABLE_BROKER,
  CONNECTABLE_PLATFORM,
  getConnectableBrokerLabel,
} from "../../lib/brokers";
import type { BrokerConnectPayload, BrokerConnectionData } from "../../lib/brokerConnection";

type BrokerConnectFormProps = {
  onSubmit: (payload: BrokerConnectPayload) => void | Promise<unknown>;
  disabled?: boolean;
  initial?: Pick<
    BrokerConnectionData,
    "mt5Login" | "mt5Server" | "brokerId" | "brokerName"
  >;
  submitLabel?: string;
};

export function BrokerConnectForm({
  onSubmit,
  disabled,
  initial,
  submitLabel = "Submit credentials",
}: BrokerConnectFormProps) {
  const [mt5Login, setMt5Login] = useState(initial?.mt5Login ?? "");
  const [mt5Server, setMt5Server] = useState(initial?.mt5Server ?? "");
  const [mt5Password, setMt5Password] = useState("");
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const login = mt5Login.trim();
    const server = mt5Server.trim();

    if (!login) {
      setError("Enter your MT5 login (account number).");
      return;
    }
    if (!server) {
      setError("Enter your MT5 server name.");
      return;
    }
    if (!mt5Password) {
      setError("Enter your MT5 password.");
      return;
    }
    if (!riskAcknowledged) {
      setError("Confirm the risk acknowledgement to continue.");
      return;
    }

    setBusy(true);
    try {
      await onSubmit({
        brokerId: CONNECTABLE_BROKER.id,
        brokerName: getConnectableBrokerLabel(),
        mt5Login: login,
        mt5Server: server,
        mt5Password,
        riskAcknowledged: true,
      });
      // Never persist password client-side.
      setMt5Password("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  const locked = disabled || busy;

  return (
    <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-zinc-500">Broker</p>
            <p className="mt-0.5 text-sm font-medium text-white">{CONNECTABLE_BROKER.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500">Platform</p>
            <p className="mt-0.5 text-sm font-medium text-white">{CONNECTABLE_PLATFORM.name}</p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="mt5-login" className="block text-sm font-medium text-zinc-300">
          MT5 login
        </label>
        <input
          id="mt5-login"
          type="text"
          name="mt5_login"
          value={mt5Login}
          onChange={(event) => setMt5Login(event.target.value)}
          disabled={locked}
          autoComplete="off"
          inputMode="numeric"
          placeholder="e.g. 12345678"
          className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="mt5-server" className="block text-sm font-medium text-zinc-300">
          MT5 server
        </label>
        <input
          id="mt5-server"
          type="text"
          name="mt5_server"
          value={mt5Server}
          onChange={(event) => setMt5Server(event.target.value)}
          disabled={locked}
          autoComplete="off"
          placeholder="e.g. ICMarketsSC-Demo"
          className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="mt5-password" className="block text-sm font-medium text-zinc-300">
          MT5 password
        </label>
        <input
          id="mt5-password"
          type="password"
          name="mt5_password"
          value={mt5Password}
          onChange={(event) => setMt5Password(event.target.value)}
          disabled={locked}
          autoComplete="new-password"
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
        />
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
          Use your main MT5 password; an investor password can&apos;t place trades. It&apos;s sent once to our
          trading servers and stored there encrypted. This login can open and close trades but can&apos;t withdraw
          money. Change it at IC Markets any time to cut access.{" "}
          <a href="/security" target="_blank" className="text-emerald-400 underline underline-offset-2">
            Security details
          </a>
        </p>
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={riskAcknowledged}
          onChange={(event) => setRiskAcknowledged(event.target.checked)}
          disabled={locked}
          className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/40"
        />
        <span>
          I understand trading involves risk of loss, consent to PipsAngel using these
          credentials to configure MetaTrader for copy trading, and confirm I am submitting
          one MT5 account for this customer profile.
        </span>
      </label>

      <button
        type="submit"
        disabled={locked}
        className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {busy ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
