import type { Metadata } from "next";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: DISCLAIMER_SHORT,
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            SaaS Bill Cutter is a free calculator. You enter what you pay for software, a server
            estimate, and your hourly rate. A fixed formula in your browser estimates savings and
            payback time for switching to an open-source alternative.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not financial, legal, or licensing advice. We don&apos;t know your real vendor
            prices, contracts, data volume, or compliance needs. Setup hours are rough averages
            and can be far off. We are not affiliated with any vendor or project listed and earn
            nothing from the links.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Licenses</h2>
          <p className="mt-2">
            Licenses were read from each project&apos;s GitHub repository on Sep 30, 2026 and can
            change. Some projects are open core, source-available (Elastic License, FSL), or
            copyleft (GPL, AGPL), which limits reselling or requires sharing changes. Read the
            license yourself before relying on it.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your data</h2>
          <p className="mt-2">
            Numbers you type stay in your browser. There is no login, database, or tracking on this
            version.
          </p>
        </section>
      </div>
    </div>
  );
}
