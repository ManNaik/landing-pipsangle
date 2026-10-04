import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidSlug, slugify } from "./slug";

test("slugify makes clean URL slugs from titles", () => {
  assert.equal(slugify("How bond yields affect currencies: lessons from the sell-off"), "how-bond-yields-affect-currencies-lessons-from-the-sell-off");
  assert.equal(slugify("  EUR/USD & GBP/USD — week ahead!  "), "eur-usd-and-gbp-usd-week-ahead");
  assert.equal(slugify("Café crème policy"), "cafe-creme-policy");
  assert.equal(slugify("???"), "");
});

test("slugify caps length at a whole word", () => {
  const slug = slugify("word ".repeat(40));
  assert.ok(slug.length <= 80);
  assert.ok(!slug.endsWith("-"));
  const long = slugify("A deliberately long title that should wrap onto a second line in the editor instead of being cut off");
  assert.equal(long, "a-deliberately-long-title-that-should-wrap-onto-a-second-line-in-the-editor");
});

test("isValidSlug matches what the backend accepts", () => {
  assert.equal(isValidSlug("nfp-preview-october-2026"), true);
  assert.equal(isValidSlug("NFP"), false);
  assert.equal(isValidSlug("double--hyphen"), false);
  assert.equal(isValidSlug("-leading"), false);
});
