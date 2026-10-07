import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate } from "./calc";
import { EXAMPLE_INPUTS, MAX_AMOUNT, hasSpend, ogPath, parseResultParams, resultPath, resultQuery } from "./share";

test("result query round-trips through the parser", () => {
  const q = resultQuery(EXAMPLE_INPUTS);
  assert.equal(q, "mixpanel=300&calendly=48&intercom=150&hostingPerMonth=20&hourlyRate=50");
  const back = parseResultParams(new URLSearchParams(q));
  assert.deepEqual(back, EXAMPLE_INPUTS);
});

test("share URL gives the same result as the calculator", () => {
  const back = parseResultParams(new URLSearchParams(resultQuery(EXAMPLE_INPUTS)));
  const a = calculate(EXAMPLE_INPUTS);
  const b = calculate(back);
  assert.equal(b.headline, a.headline);
  assert.equal(b.ongoingNetPerYear, 5736);
  assert.equal(b.verdict, "SWITCH");
});

test("paths use /r and /og", () => {
  assert.ok(resultPath(EXAMPLE_INPUTS).startsWith("/r?mixpanel=300"));
  assert.ok(ogPath(EXAMPLE_INPUTS).startsWith("/og?mixpanel=300"));
});

test("parser accepts a plain record, aliases, and drops junk", () => {
  const i = parseResultParams({ typeform: "99", calendly: ["120", "5"], hosting: "40", rate: "abc", evil: "9", intercom: "-3" });
  assert.deepEqual(i.spend, { calendly: 120, typeform: 99 });
  assert.equal(i.hostingPerMonth, 40);
  assert.equal(i.hourlyRate, 50);
});

test("parser caps huge values and handles empty input", () => {
  const i = parseResultParams(new URLSearchParams("mixpanel=1e12&hourlyRate=1e9"));
  assert.equal(i.spend.mixpanel, MAX_AMOUNT);
  assert.equal(i.hourlyRate, MAX_AMOUNT);
  assert.equal(hasSpend(parseResultParams(new URLSearchParams(""))), false);
  assert.equal(hasSpend(i), true);
});
