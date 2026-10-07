import type { Inputs } from "./calc";
import { TOOLS } from "./tools";

export const PUBLIC_URL = "https://saas-bill-cutter.vercel.app";
export const DEFAULT_HOSTING = 20;
export const DEFAULT_RATE = 50;
/** Hard cap so a hand-edited link can't render absurd numbers. */
export const MAX_AMOUNT = 1_000_000;

/** Example result used in the sitemap, llms.txt, and the API example. */
export const EXAMPLE_INPUTS: Inputs = {
  spend: { mixpanel: 300, calendly: 48, intercom: 150 },
  hostingPerMonth: DEFAULT_HOSTING,
  hourlyRate: DEFAULT_RATE,
};

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function get(p: Params, key: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(key) ?? undefined;
  const v = p[key];
  return Array.isArray(v) ? v[0] : v;
}

function amount(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(Math.round(n * 100) / 100, MAX_AMOUNT);
}

/** Reads calculator inputs from a share URL. Uses the same names as /api/calculate. */
export function parseResultParams(p: Params): Inputs {
  const spend: Record<string, number> = {};
  for (const t of TOOLS) {
    const v = amount(get(p, t.id), 0);
    if (v > 0) spend[t.id] = v;
  }
  return {
    spend,
    hostingPerMonth: amount(get(p, "hostingPerMonth") ?? get(p, "hosting"), DEFAULT_HOSTING),
    hourlyRate: amount(get(p, "hourlyRate") ?? get(p, "rate"), DEFAULT_RATE),
  };
}

const fmt = (n: number) => String(Math.min(Math.round(n * 100) / 100, MAX_AMOUNT));

/** Query string for a result, tool ids in a stable order. */
export function resultQuery(inputs: Inputs): string {
  const q = new URLSearchParams();
  for (const t of TOOLS) {
    const v = Number(inputs.spend[t.id]);
    if (Number.isFinite(v) && v > 0) q.set(t.id, fmt(v));
  }
  const h = Number(inputs.hostingPerMonth);
  const r = Number(inputs.hourlyRate);
  q.set("hostingPerMonth", fmt(Number.isFinite(h) && h >= 0 ? h : DEFAULT_HOSTING));
  q.set("hourlyRate", fmt(Number.isFinite(r) && r >= 0 ? r : DEFAULT_RATE));
  return q.toString();
}

export const resultPath = (inputs: Inputs) => `/r?${resultQuery(inputs)}`;
export const ogPath = (inputs: Inputs) => `/og?${resultQuery(inputs)}`;
export const hasSpend = (inputs: Inputs) => Object.values(inputs.spend).some((v) => v > 0);
