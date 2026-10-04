import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cumulativePips, summarizeTrades } from "./performance";
import type { Trade } from "./types";

function trade(pips: number, day: number): Trade {
  return {
    id: `t${day}`,
    pair: "EURUSD",
    direction: "BUY",
    entry: "1.1",
    stop_loss: "1.09",
    take_profit: "1.12",
    pips,
    result: pips > 0 ? "profit" : "loss",
    closed_at: new Date(Date.UTC(2026, 8, day)).toISOString(),
  };
}

describe("summarizeTrades", () => {
  it("counts streaks in closing order, not list order", () => {
    const summary = summarizeTrades([trade(-10, 3), trade(20, 1), trade(-5, 4), trade(15, 2)]);
    assert.equal(summary.longestWinStreak, 2);
    assert.equal(summary.longestLossStreak, 2);
    assert.equal(summary.netPips, 20);
    assert.equal(summary.winRate, 50);
    assert.equal(summary.averageWin, 17.5);
    assert.equal(summary.averageLoss, -7.5);
  });

  it("handles an empty list", () => {
    const summary = summarizeTrades([]);
    assert.equal(summary.total, 0);
    assert.equal(summary.winRate, 0);
    assert.equal(summary.firstClosedAt, null);
  });
});

describe("cumulativePips", () => {
  it("starts at zero and follows closing order", () => {
    assert.deepEqual(cumulativePips([trade(-10, 2), trade(30, 1)]), [0, 30, 20]);
  });
});
