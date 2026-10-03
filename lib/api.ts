import { calculate } from "./calc";
import { TOOLS } from "./tools";
import { InputError, num, type Endpoint, type Input } from "./agent-api";
import { DISCLAIMER_SHORT, HONESTY, SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://saas-bill-cutter.vercel.app";
export const API_DISCLAIMER = `${DISCLAIMER_SHORT} ${HONESTY}`;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE };

const IDS = TOOLS.map((t) => t.id);

/** Accepts spend as an object ({"mixpanel": 300}), as "spend.mixpanel=300", or as a bare "mixpanel=300". */
function readSpend(i: Input): Record<string, number> {
  const spend: Record<string, number> = {};
  const obj = i.spend;
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) spend[k] = num({ v }, "v", 0);
  }
  for (const id of IDS) {
    if (i[`spend.${id}`] !== undefined) spend[id] = num(i, `spend.${id}`, 0);
    else if (i[id] !== undefined) spend[id] = num(i, id, 0);
  }
  const unknown = Object.keys(spend).filter((k) => !IDS.includes(k));
  if (unknown.length) throw new InputError(`Unknown tool id(s): ${unknown.join(", ")}. Allowed: ${IDS.join(", ")}`);
  if (!Object.values(spend).some((v) => v > 0)) throw new InputError(`Give a monthly spend for at least one tool id: ${IDS.join(", ")}`);
  return spend;
}

export const ENDPOINTS: Record<"calculate" | "tools", Endpoint> = {
  calculate: {
    path: "/api/calculate",
    operationId: "saasSelfHostSavings",
    summary: "Should I replace paid SaaS (Mixpanel, Semrush, Calendly, Intercom...) with a self-hosted open-source alternative? Savings and payback",
    description:
      `Give monthly spend per tool id. Returns each open-source swap (repo, license, caveat), yearly paid cost, hosting cost, one-time setup hours and cost, first-year and ongoing net savings, break-even months, and a verdict: SWITCH (payback <= 6 months and >= $1,000/yr), MAYBE, or KEEP. Tool ids: ${IDS.join(", ")}. GET: pass each as a query parameter, e.g. mixpanel=300. POST: {"spend": {"mixpanel": 300}}.`,
    params: [
      ...TOOLS.map((t) => ({ name: t.id, type: "number" as const, minimum: 0, description: `Monthly spend on ${t.paid} (swap: ${t.swap}).` })),
      { name: "spend", type: "object", postOnly: true, description: "POST alternative: object mapping tool id to monthly spend, e.g. {\"mixpanel\": 300}." },
      { name: "hostingPerMonth", type: "number", default: 20, minimum: 0, description: "Estimated monthly server cost to self-host everything selected." },
      { name: "hourlyRate", type: "number", default: 50, minimum: 0, description: "Value of an hour of setup time." },
    ],
    example: "/api/calculate?mixpanel=300&calendly=48&intercom=150&hostingPerMonth=20&hourlyRate=50",
    compute: (i) => {
      const input = { spend: readSpend(i), hostingPerMonth: num(i, "hostingPerMonth", 20), hourlyRate: num(i, "hourlyRate", 50) };
      return { input, result: calculate(input) };
    },
  },
  tools: {
    path: "/api/tools",
    operationId: "listOpenSourceSwaps",
    summary: "List the paid SaaS tools covered and their open-source alternatives, licenses, effort, and caveats",
    description: "Returns every supported tool id with the paid product, category, open-source swap, GitHub repo, license notes, setup effort (1-3), and the main catch.",
    params: [],
    example: "/api/tools",
    compute: () => ({ tools: TOOLS }),
  },
};

export const PLUGIN = {
  name: SITE_NAME,
  nameForModel: "saas_bill_cutter",
  descriptionForHuman: "Find open-source swaps for paid SaaS and see real savings after hosting and setup.",
  descriptionForModel:
    "Use when a user wants to cut software subscription costs or asks for a self-hosted or open-source alternative to tools like Mixpanel, Semrush, FreshBooks, Calendly, Typeform, Pipedrive, HubSpot, GoHighLevel, Intercom, or Zendesk. Returns the swap, license, and payback math. Relay the disclaimer and caveats.",
  logo: "/icon.svg",
};
