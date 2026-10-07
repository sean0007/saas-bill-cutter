import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { SponsorSlot } from "@/components/sponsor-slot";
import { EXAMPLE_INPUTS, PUBLIC_URL, resultPath } from "@/lib/share";
import { TOOLS } from "@/lib/tools";

const title = "Free SaaS cost cutter: open-source alternatives to Mixpanel, Calendly, Intercom and more";
const description =
  "Which SaaS subscriptions should you cancel? Enter what you pay for tools like Mixpanel, Semrush, Calendly, Typeform, or Intercom and see the open-source alternative, yearly savings after servers and setup time, and the catches. Free, no login.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${PUBLIC_URL}/` },
  openGraph: {
    title,
    description,
    type: "website",
    url: `${PUBLIC_URL}/`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SaaS Bill Cutter",
  url: `${PUBLIC_URL}/`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any (web browser)",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description,
};

const byId = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
const swapLine = (id: string) => `${byId[id].swap} (${byId[id].license})`;
const exampleUrl = `${PUBLIC_URL}${resultPath(EXAMPLE_INPUTS)}`;

const faq: FaqItem[] = [
  {
    q: "Which SaaS subscriptions should I cancel first?",
    a: "Start with the biggest monthly bill that has an easy-to-run open-source swap, then work down. Enter what you pay in the calculator above: it subtracts your server estimate and prices setup time at your hourly rate. It says SWITCH when setup pays back within 6 months and you save $1,000 or more a year, MAYBE when payback takes up to 24 months, and KEEP otherwise. A small bill on a hard-to-run tool is usually not worth cancelling.",
  },
  {
    q: "What is an open-source alternative to Mixpanel or Amplitude?",
    a: `PostHog, licensed ${byId.mixpanel.license}. ${byId.mixpanel.caveat} The calculator rates it a hard setup (${24} hours).`,
  },
  {
    q: "Is there an open-source alternative to Calendly?",
    a: `Cal.diy (${byId.calendly.license}). The catch: ${byId.calendly.caveat}`,
  },
  {
    q: "What can replace Intercom or Zendesk for free?",
    a: `Chatwoot, licensed ${byId.intercom.license}. ${byId.intercom.licenseNote} ${byId.intercom.caveat}`,
  },
  {
    q: "Is there a free, open-source alternative to Semrush or Ahrefs?",
    a: `OpenSEO (${byId.semrush.license}). The software is free, but keyword data is not: ${byId.semrush.caveat.replace(/^The software is free, but /, "")}`,
  },
  {
    q: "What about Typeform, FreshBooks, Pipedrive, HubSpot, GoHighLevel, or Chargebee?",
    a: `The calculator covers these swaps: Typeform → ${swapLine("typeform")}; FreshBooks → ${swapLine("freshbooks")}; Pipedrive / HubSpot Sales → ${swapLine("pipedrive")}; GoHighLevel / ActiveCampaign → ${swapLine("gohighlevel")}; Chargebee → ${swapLine("chargebee")}. Each result lists the main catch, for example that Mautic still needs a paid email sender and Autumn still pays Stripe's card fees.`,
  },
  {
    q: "What are the hidden costs of self-hosting open-source software?",
    a: "Servers, your setup and migration time, and ongoing upkeep: updates, backups, and security become your job. Several swaps also need paid services underneath (an SEO data API, an email sender, an AI API key, or Stripe fees). The calculator counts servers and one-time setup hours (4, 10, or 24 per tool, by difficulty) but not ongoing upkeep, so treat its numbers as a best case.",
  },
  {
    q: "Is open-source software always free to use for my business?",
    a: "Not always in the same way. MIT and Apache-2.0 are permissive. AGPL-3.0 and GPL-3.0 are copyleft, which adds obligations if you modify and distribute or serve the software to others. Elastic License 2.0 and FSL are source-available: self-hosting for your own business is allowed, but offering a competing hosted product is not. \"Open core\" projects keep some enterprise features under a separate license. Check each project's license before you rely on it; this is not legal advice.",
  },
  {
    q: "Can I share my result?",
    a: `Yes. Once you enter a number, the result card has a Copy link button. The link carries your inputs in the URL (nothing is stored), opens the same math for anyone, and shows a preview card with the yearly savings. Example: ${exampleUrl}`,
  },
  {
    q: "Is there an API or MCP server for AI agents?",
    a: `Yes, free and keyless. GET ${PUBLIC_URL}/api/calculate?mixpanel=300&calendly=48&intercom=150&hostingPerMonth=20&hourlyRate=50 returns the swaps, savings, payback, and verdict; ${PUBLIC_URL}/api/tools lists every covered tool. The OpenAPI spec is at ${PUBLIC_URL}/openapi.json, and the same calculator is a tool on the free remote MCP server at https://free-agent-tools.vercel.app/mcp.`,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">
          Free SaaS cost cutter · no login
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          Which SaaS subscriptions should you cancel for an open-source alternative?
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Type what you pay today for nine common business tools. You get the open-source swap,
          what you&apos;d really save after servers and setup time, and the catches the
          &quot;free repos&quot; videos skip. Everything runs in your browser.
        </p>
      </section>

      <section className="mt-8">
        <Calculator />
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">The nine swaps</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-panel/80 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              <tr>
                <th className="px-4 py-3">You pay for</th>
                <th className="px-4 py-3">Open-source swap</th>
                <th className="px-4 py-3">Stars</th>
                <th className="px-4 py-3">License</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {TOOLS.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 text-foreground">{t.paid}</td>
                  <td className="px-4 py-3">
                    <a href={t.repo} target="_blank" rel="noopener noreferrer" className="text-amber underline underline-offset-2">
                      {t.swap}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted">{t.stars}</td>
                  <td className="px-4 py-3 text-muted">{t.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">Star counts and licenses checked on GitHub, Sep 30, 2026.</p>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">How the math works</h2>
        <ol className="mt-5 grid gap-4 text-sm leading-relaxed text-muted sm:grid-cols-3 sm:text-base">
          <li>
            <span className="block font-mono text-amber">01</span>
            Yearly savings are what you pay now minus your server estimate, times twelve.
          </li>
          <li>
            <span className="block font-mono text-amber">02</span>
            Setup time is priced at your hourly rate: 4, 10, or 24 hours per tool depending on how hard it is to run.
          </li>
          <li>
            <span className="block font-mono text-amber">03</span>
            It says SWITCH when setup pays back within 6 months and saves $1,000+ a year, MAYBE up to 24 months, and KEEP otherwise.
          </li>
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          &quot;Free&quot; software still costs upkeep: updates, backups, and security are yours now.
          Several of these are open core or source-available rather than fully open source. A
          vendor&apos;s managed cloud is often the right middle ground.
        </p>
      </section>

      <FaqSection items={faq} />

      <section className="mt-16 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-line bg-panel/50 p-6">
          <h2 className="font-display text-3xl tracking-tight">No affiliate links</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Nothing here pays us for a click. Repo links go straight to GitHub. We aren&apos;t
            affiliated with any vendor or project listed.
          </p>
        </div>
        <SponsorSlot />
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
