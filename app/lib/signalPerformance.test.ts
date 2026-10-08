import assert from "node:assert/strict";
import test from "node:test";
import { getSignalPerformance, signalOutcome } from "./signalPerformance";
import type { Signal } from "./types";

function makeSignal(overrides: Partial<Signal>): Signal {
  return {
    id: "signal",
    pair: "EUR/USD",
    direction: "BUY",
    entry: "100",
    stop_loss: "98",
    take_profit: "105",
    risk_reward: "1:2.5",
    status: "active",
    issued_at: "2026-10-01T00:00:00Z",
    closed_at: null,
    ...overrides,
  };
}

test("calculates signed price movement for buy and sell outcomes", () => {
  assert.deepEqual(
    signalOutcome(makeSignal({ status: "hit_tp" })),
    {
      signal: makeSignal({ status: "hit_tp" }),
      result: "profit",
      percentage: 5,
    }
  );
  assert.equal(
    signalOutcome(
      makeSignal({
        direction: "SELL",
        status: "hit_sl",
        stop_loss: "103",
      })
    )?.percentage,
    -3
  );
});

test("summarizes only completed TP and SL signals", () => {
  const performance = getSignalPerformance([
    makeSignal({ id: "win", status: "hit_tp" }),
    makeSignal({ id: "loss", status: "hit_sl" }),
    makeSignal({ id: "active", status: "active" }),
  ]);

  assert.equal(performance.total, 2);
  assert.equal(performance.profitHits, 1);
  assert.equal(performance.lossHits, 1);
  assert.equal(performance.profitHitPercent, 50);
  assert.equal(performance.lossHitPercent, 50);
});
