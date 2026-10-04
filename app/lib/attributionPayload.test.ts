import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanAttribution } from "./attributionPayload";

describe("cleanAttribution", () => {
  it("keeps known string fields and trims them", () => {
    assert.deepEqual(
      cleanAttribution({ utm_source: "  google ", gclid: "abc", landing_page: "/pricing?utm_source=google" }),
      { utm_source: "google", gclid: "abc", landing_page: "/pricing?utm_source=google" }
    );
  });

  it("drops unknown keys, non-strings and empty values", () => {
    assert.deepEqual(cleanAttribution({ utm_source: "", evil: "x", utm_medium: 5, fbclid: { a: 1 } }), {});
  });

  it("caps long values", () => {
    assert.equal(cleanAttribution({ referrer: "x".repeat(500) }).referrer.length, 300);
  });

  it("ignores non-objects", () => {
    assert.deepEqual(cleanAttribution(null), {});
    assert.deepEqual(cleanAttribution(["utm_source"]), {});
    assert.deepEqual(cleanAttribution("utm_source=x"), {});
  });
});
