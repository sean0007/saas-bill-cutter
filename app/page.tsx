import { Calculator } from "@/components/calculator";
import { SponsorSlot } from "@/components/sponsor-slot";
import { TOOLS } from "@/lib/tools";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">
          Free calculator · no login
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          Your SaaS bill has a free twin on GitHub. Is switching worth it?
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
    </div>
  );
}
