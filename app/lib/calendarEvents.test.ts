import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapCalendarEvents } from "./news";

describe("mapCalendarEvents", () => {
  it("maps stored forex rows and leaves demo data out", () => {
    const [event] = mapCalendarEvents([
      {
        id: "row-1",
        currency: "USD",
        title: "Core PCE Price Index YoY (Aug)",
        when_label: "Today",
        time: "18:00",
        actual: "",
        previous: "2.9%",
        consensus: "2.9%",
        impact: "high",
        source_url: "https://www.moneycontrol.com/economic-calendar/united-states-core-pce-price-index-yoy/135",
      },
    ]);
    assert.equal(event.isDemo, false);
    assert.equal(event.whenLabel, "Today");
    assert.equal(event.consensus, "2.9%");
    assert.equal(event.currency, "USD");
    assert.match(event.sourceUrl ?? "", /moneycontrol\.com/);
  });
});
