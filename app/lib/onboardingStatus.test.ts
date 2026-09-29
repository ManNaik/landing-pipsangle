import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOnboardingChecklist,
  formatBrokerStatusLabel,
  getTrialCountdown,
  isOnboardingIncomplete,
  isOnboardingInProgress,
  isOnboardingReady,
  normalizeBrokerStatus,
  shouldPollOnboarding,
  shouldShowPaymentCta,
} from "./onboardingStatus";

describe("normalizeBrokerStatus", () => {
  it("accepts new lifecycle statuses", () => {
    assert.equal(normalizeBrokerStatus("operator_action"), "operator_action");
    assert.equal(normalizeBrokerStatus("active_trial"), "active_trial");
    assert.equal(normalizeBrokerStatus("trial_expired"), "trial_expired");
  });

  it("falls back unknown values to none", () => {
    assert.equal(normalizeBrokerStatus("weird"), "none");
    assert.equal(normalizeBrokerStatus(undefined), "none");
  });
});

describe("status helpers", () => {
  it("classifies incomplete / in-progress / ready", () => {
    assert.equal(isOnboardingIncomplete("none"), true);
    assert.equal(isOnboardingIncomplete("skipped"), true);
    assert.equal(isOnboardingInProgress("provisioning"), true);
    assert.equal(isOnboardingInProgress("pending"), true);
    assert.equal(isOnboardingReady("active_trial"), true);
    assert.equal(isOnboardingReady("paid"), true);
    assert.equal(isOnboardingReady("connected"), true);
  });

  it("shows payment CTA on trial states", () => {
    assert.equal(shouldShowPaymentCta("active_trial"), true);
    assert.equal(shouldShowPaymentCta("trial_expired"), true);
    assert.equal(shouldShowPaymentCta("paid"), false);
  });

  it("polls while provisioning", () => {
    assert.equal(shouldPollOnboarding("verifying"), true);
    assert.equal(shouldPollOnboarding("paid"), false);
  });
});

describe("buildOnboardingChecklist", () => {
  it("marks details current when not started", () => {
    const steps = buildOnboardingChecklist("none");
    assert.equal(steps[0]?.state, "current");
    assert.equal(steps.find((s) => s.id === "payment")?.state, "blocked");
  });

  it("marks verifying current and trial upcoming", () => {
    const steps = buildOnboardingChecklist("verifying");
    assert.equal(steps.find((s) => s.id === "verifying")?.state, "current");
    assert.equal(steps.find((s) => s.id === "submitted")?.state, "complete");
  });

  it("marks failed verifying step as error", () => {
    const steps = buildOnboardingChecklist("failed", { hasError: true });
    assert.equal(steps.find((s) => s.id === "verifying")?.state, "error");
  });
});

describe("getTrialCountdown", () => {
  it("labels remaining time", () => {
    const ends = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString();
    const result = getTrialCountdown(ends);
    assert.equal(result.expired, false);
    assert.match(result.label, /left$/);
  });

  it("detects expiry", () => {
    const ends = new Date(Date.now() - 1000).toISOString();
    const result = getTrialCountdown(ends);
    assert.equal(result.expired, true);
    assert.equal(result.label, "Trial ended");
  });
});

describe("formatBrokerStatusLabel", () => {
  it("humanizes statuses", () => {
    assert.equal(formatBrokerStatusLabel("operator_action"), "Operator review");
    assert.equal(formatBrokerStatusLabel("active_trial"), "Active trial");
  });
});
