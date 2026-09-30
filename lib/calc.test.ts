import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate } from "./calc";

test("empty input keeps paying", () => {
  const r = calculate({ spend: {}, hostingPerMonth: 20, hourlyRate: 50 });
  assert.equal(r.verdict, "KEEP");
  assert.equal(r.lines.length, 0);
  assert.equal(r.hostingPerYear, 0);
});

test("big bills and cheap setup say switch", () => {
  const r = calculate({ spend: { typeform: 99, calendly: 120, intercom: 400 }, hostingPerMonth: 40, hourlyRate: 50 });
  assert.equal(r.verdict, "SWITCH");
  assert.equal(r.paidPerYear, 619 * 12);
  assert.equal(r.ongoingNetPerYear, (619 - 40) * 12);
  assert.equal(r.setupHours, 4 + 10 + 10);
  assert.equal(r.breakEvenMonths, Math.ceil((24 * 50) / 579));
});

test("hosting larger than bill keeps paying", () => {
  const r = calculate({ spend: { typeform: 15 }, hostingPerMonth: 20, hourlyRate: 50 });
  assert.equal(r.verdict, "KEEP");
  assert.equal(r.breakEvenMonths, null);
});

test("slow payback is borderline", () => {
  const r = calculate({ spend: { mixpanel: 150 }, hostingPerMonth: 60, hourlyRate: 60 });
  assert.equal(r.verdict, "MAYBE");
  assert.equal(r.breakEvenMonths, 16);
});

test("very slow payback keeps paying", () => {
  const r = calculate({ spend: { chargebee: 60 }, hostingPerMonth: 20, hourlyRate: 100 });
  assert.equal(r.verdict, "KEEP");
});

test("bad numbers are ignored", () => {
  const r = calculate({ spend: { typeform: -5, calendly: Number.NaN }, hostingPerMonth: -1, hourlyRate: 0 });
  assert.equal(r.lines.length, 0);
});
