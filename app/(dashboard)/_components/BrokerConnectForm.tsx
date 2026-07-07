"use client";

import { useState } from "react";
import {
  CONNECTABLE_BROKER,
  CONNECTABLE_PLATFORM,
  getConnectableBrokerLabel,
} from "../../lib/brokers";
import type { BrokerConnectPayload } from "../../lib/brokerConnection";

type BrokerConnectFormProps = {
  onSubmit: (payload: BrokerConnectPayload) => void;
  disabled?: boolean;
};

export function BrokerConnectForm({ onSubmit, disabled }: BrokerConnectFormProps) {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedAccount = accountId.trim();
    if (!trimmedAccount) {
      setError("Please enter your broker account ID.");
      return;
    }
    if (!password) {
      setError("Please enter your broker password.");
      return;
    }

    onSubmit({
      brokerId: CONNECTABLE_BROKER.id,
      brokerName: getConnectableBrokerLabel(),
      accountId: trimmedAccount,
    });
    setPassword("");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
        <label htmlFor="broker-account-id" className="block text-sm font-medium text-zinc-300">
          Account ID
        </label>
        <input
          id="broker-account-id"
          type="text"
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          disabled={disabled}
          autoComplete="off"
          placeholder="e.g. 12345678"
          className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="broker-password" className="block text-sm font-medium text-zinc-300">
          Broker password
        </label>
        <input
          id="broker-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={disabled}
          autoComplete="off"
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
        />
        <p className="mt-1.5 text-xs text-zinc-500">
          Demo only — credentials are not sent anywhere.
        </p>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        Connect broker
      </button>
    </form>
  );
}
