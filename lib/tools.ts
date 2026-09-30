export type Tool = {
  id: string;
  paid: string;
  category: string;
  swap: string;
  repo: string;
  license: string;
  licenseNote: string;
  stars: string;
  effort: 1 | 2 | 3;
  caveat: string;
};

/** Star counts checked on GitHub, Sep 30 2026. Licenses from each repo's LICENSE file. */
export const TOOLS: Tool[] = [
  {
    id: "mixpanel",
    paid: "Mixpanel / Amplitude",
    category: "Product analytics",
    swap: "PostHog",
    repo: "https://github.com/PostHog/posthog",
    license: "MIT core + paid EE folder",
    licenseNote: "Open core. Some enterprise features live in a separately licensed folder.",
    stars: "40k",
    effort: 3,
    caveat: "Self-hosting at scale needs real servers (ClickHouse, Kafka). Their cloud free tier may be simpler.",
  },
  {
    id: "semrush",
    paid: "Semrush / Ahrefs",
    category: "SEO research",
    swap: "OpenSEO",
    repo: "https://github.com/every-app/open-seo",
    license: "MIT",
    licenseNote: "Permissive. Needs your own DataForSEO API key for keyword data.",
    stars: "22k",
    effort: 2,
    caveat: "The software is free, but SEO data comes from DataForSEO, which you pay per request. Their hosted plan is $10/month plus data.",
  },
  {
    id: "freshbooks",
    paid: "FreshBooks",
    category: "Invoicing",
    swap: "Invoice Ninja",
    repo: "https://github.com/invoiceninja/invoiceninja",
    license: "Elastic License 2.0 (source-available)",
    licenseNote: "Source-available. Fine to self-host for your business; you can't resell it as a hosted service.",
    stars: "10k",
    effort: 2,
    caveat: "Not accounting software. You'll still need something for taxes and books.",
  },
  {
    id: "calendly",
    paid: "Calendly",
    category: "Scheduling",
    swap: "Cal.diy",
    repo: "https://github.com/calcom/cal.diy",
    license: "MIT",
    licenseNote: "Permissive.",
    stars: "49k",
    effort: 2,
    caveat: "Cal.diy's own README says it's for personal, non-production use and points businesses to hosted Cal.com. Calendar sync also needs your own Google or Microsoft app credentials.",
  },
  {
    id: "chargebee",
    paid: "Chargebee / Stripe Billing add-ons",
    category: "Subscription & usage billing",
    swap: "Autumn",
    repo: "https://github.com/useautumn/autumn",
    license: "Apache-2.0",
    licenseNote: "Permissive.",
    stars: "2.7k",
    effort: 3,
    caveat: "Sits on top of Stripe, so Stripe's own card fees still apply. Billing bugs cost real money; test hard.",
  },
  {
    id: "typeform",
    paid: "Typeform",
    category: "Forms & chat funnels",
    swap: "Typebot",
    repo: "https://github.com/baptisteArno/typebot.io",
    license: "FSL-1.1 (becomes Apache-2.0 later)",
    licenseNote: "Source-available. Self-hosting for yourself is allowed; offering a competing hosted product isn't.",
    stars: "10k",
    effort: 1,
    caveat: "WhatsApp and some integrations need their own paid accounts.",
  },
  {
    id: "pipedrive",
    paid: "Pipedrive / HubSpot Sales",
    category: "CRM",
    swap: "Frappe CRM",
    repo: "https://github.com/frappe/crm",
    license: "AGPL-3.0",
    licenseNote: "Copyleft. If you modify it and offer it to others over a network, you must share your changes.",
    stars: "3.6k",
    effort: 2,
    caveat: "Runs on the Frappe framework, which has its own learning curve.",
  },
  {
    id: "gohighlevel",
    paid: "GoHighLevel / ActiveCampaign",
    category: "Email marketing & automation",
    swap: "Mautic",
    repo: "https://github.com/mautic/mautic",
    license: "GPL-3.0",
    licenseNote: "Copyleft.",
    stars: "11k",
    effort: 3,
    caveat: "You still pay an email sender like Amazon SES, and deliverability is on you.",
  },
  {
    id: "intercom",
    paid: "Intercom / Zendesk",
    category: "Support inbox",
    swap: "Chatwoot",
    repo: "https://github.com/chatwoot/chatwoot",
    license: "MIT core + paid EE folder",
    licenseNote: "Open core. Some enterprise features are separately licensed.",
    stars: "37k",
    effort: 2,
    caveat: "AI replies mean bringing your own OpenAI key, which has its own usage bill.",
  },
];
