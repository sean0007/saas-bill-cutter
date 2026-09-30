import { TOOLS, type Tool } from "./tools";

export type Inputs = {
  /** tool id -> what you pay per month today, in dollars */
  spend: Record<string, number>;
  /** your estimate of server cost per month for everything you self-host */
  hostingPerMonth: number;
  /** what an hour of your (or a contractor's) time is worth */
  hourlyRate: number;
};

export type Line = {
  tool: Tool;
  monthly: number;
  setupHours: number;
};

export type Verdict = "SWITCH" | "MAYBE" | "KEEP";

export type Result = {
  lines: Line[];
  paidPerYear: number;
  hostingPerYear: number;
  setupHours: number;
  setupCost: number;
  firstYearNet: number;
  ongoingNetPerYear: number;
  breakEvenMonths: number | null;
  verdict: Verdict;
  headline: string;
  summary: string;
};

/** Rough one-time hours to stand up and migrate, by effort tier. */
export const SETUP_HOURS: Record<1 | 2 | 3, number> = { 1: 4, 2: 10, 3: 24 };

function clean(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

export function calculate(inputs: Inputs): Result {
  const lines: Line[] = TOOLS.filter((t) => clean(inputs.spend[t.id]) > 0).map((tool) => ({
    tool,
    monthly: clean(inputs.spend[tool.id]),
    setupHours: SETUP_HOURS[tool.effort],
  }));

  const paidPerMonth = lines.reduce((s, l) => s + l.monthly, 0);
  const hosting = lines.length ? clean(inputs.hostingPerMonth) : 0;
  const setupHours = lines.reduce((s, l) => s + l.setupHours, 0);
  const setupCost = setupHours * clean(inputs.hourlyRate);

  const monthlyNet = paidPerMonth - hosting;
  const ongoingNetPerYear = monthlyNet * 12;
  const firstYearNet = ongoingNetPerYear - setupCost;
  const breakEvenMonths = monthlyNet > 0 ? Math.ceil(setupCost / monthlyNet) : null;

  let verdict: Verdict;
  if (!lines.length || monthlyNet <= 0 || breakEvenMonths === null || breakEvenMonths > 24) {
    verdict = "KEEP";
  } else if (breakEvenMonths <= 6 && ongoingNetPerYear >= 1000) {
    verdict = "SWITCH";
  } else {
    verdict = "MAYBE";
  }

  const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
  let headline: string;
  let summary: string;
  if (!lines.length) {
    headline = "Add what you pay today";
    summary = "Enter a monthly amount for at least one tool to see the math.";
  } else if (verdict === "SWITCH") {
    headline = `About ${money(ongoingNetPerYear)} a year back after hosting`;
    summary = `Setup pays for itself in roughly ${breakEvenMonths} month${breakEvenMonths === 1 ? "" : "s"}. Worth a serious look, starting with the lowest-effort swap.`;
  } else if (verdict === "MAYBE") {
    headline = `Borderline: ${money(ongoingNetPerYear)} a year, slow payback`;
    summary =
      breakEvenMonths !== null
        ? `Break-even is around ${breakEvenMonths} months. Switch only the tools with the biggest bills, or use the vendor's managed cloud.`
        : "The savings are small next to the setup time.";
  } else {
    headline = "Keep paying for now";
    summary =
      monthlyNet <= 0
        ? "Your hosting estimate eats the savings. Paying the vendor is the cheaper choice."
        : "Setup time takes more than two years to earn back. Your time is worth more here.";
  }

  return {
    lines,
    paidPerYear: paidPerMonth * 12,
    hostingPerYear: hosting * 12,
    setupHours,
    setupCost,
    firstYearNet,
    ongoingNetPerYear,
    breakEvenMonths,
    verdict,
    headline,
    summary,
  };
}
