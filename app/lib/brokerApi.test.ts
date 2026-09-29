import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapBrokerConnection } from "./brokerApi";

describe("mapBrokerConnection", () => {
  it("maps sanitized API payload without password fields", () => {
    const mapped = mapBrokerConnection({
      status: "active_trial",
      id: "conn-1",
      broker_id: "icmarkets",
      broker_name: "IC Markets (MetaTrader 5)",
      mt5_login: "12345678",
      mt5_server: "ICMarketsSC-Demo",
      submitted_at: "2026-09-01T00:00:00Z",
      verified_at: "2026-09-02T00:00:00Z",
      trial_starts_at: "2026-09-02T00:00:00Z",
      trial_ends_at: "2026-09-06T00:00:00Z",
      error: null,
      risk_acknowledged: true,
    });

    assert.equal(mapped.status, "active_trial");
    assert.equal(mapped.mt5Login, "12345678");
    assert.equal(mapped.mt5Server, "ICMarketsSC-Demo");
    assert.equal(mapped.brokerId, "icmarkets");
    assert.equal(mapped.riskAcknowledged, true);
    assert.equal(
      Object.prototype.hasOwnProperty.call(mapped, "mt5Password"),
      false
    );
  });

  it("supports legacy account_id and pending status", () => {
    const mapped = mapBrokerConnection({
      status: "pending",
      account_id: "999",
      broker_id: "icmarkets",
    });
    assert.equal(mapped.status, "pending");
    assert.equal(mapped.mt5Login, "999");
    assert.equal(mapped.accountId, "999");
  });

  it("maps failed with error metadata", () => {
    const mapped = mapBrokerConnection({
      status: "failed",
      error: "MT5 login mismatch",
      error_code: "login_mismatch",
    });
    assert.equal(mapped.status, "failed");
    assert.equal(mapped.error, "MT5 login mismatch");
    assert.equal(mapped.errorCode, "login_mismatch");
  });
});
