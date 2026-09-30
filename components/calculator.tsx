"use client";

import { useMemo, useState } from "react";
import { calculate, SETUP_HOURS } from "@/lib/calc";
import { TOOLS } from "@/lib/tools";
import { CardDisclaimer } from "@/components/card-disclaimer";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const effortLabel = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;
const verdictColor = { SWITCH: "text-teal-200", MAYBE: "text-amber", KEEP: "text-rose-300" } as const;

const SAMPLE: Record<string, string> = { typeform: "99", calendly: "120", intercom: "400" };

export function Calculator() {
  const [spend, setSpend] = useState<Record<string, string>>({});
  const [hosting, setHosting] = useState("20");
  const [rate, setRate] = useState("50");

  const result = useMemo(
    () =>
      calculate({
        spend: Object.fromEntries(Object.entries(spend).map(([k, v]) => [k, Number(v)])),
        hostingPerMonth: Number(hosting),
        hourlyRate: Number(rate),
      }),
    [spend, hosting, rate],
  );

  const input =
    "w-28 rounded-xl border border-line bg-black/40 px-3 py-2 text-right font-mono text-sm text-foreground focus:border-amber";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
            What you pay per month
          </p>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSpend(SAMPLE)}
              className="rounded-full border border-line px-3 py-1 text-muted hover:text-foreground"
            >
              Try an example
            </button>
            <button
              type="button"
              onClick={() => setSpend({})}
              className="rounded-full border border-line px-3 py-1 text-muted hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {TOOLS.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-4 py-3">
              <label htmlFor={`spend-${t.id}`} className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{t.paid}</span>
                <span className="block text-xs text-muted">
                  {t.category} → {t.swap} · {effortLabel[t.effort]} setup
                </span>
              </label>
              <div className="flex items-center gap-1 text-muted">
                <span className="font-mono text-sm">$</span>
                <input
                  id={`spend-${t.id}`}
                  inputMode="decimal"
                  placeholder="0"
                  value={spend[t.id] ?? ""}
                  onChange={(e) =>
                    setSpend((s) => ({ ...s, [t.id]: e.target.value.replace(/[^0-9.]/g, "") }))
                  }
                  className={input}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>
              <span className="block text-foreground">Server cost / month</span>
              <span className="block text-xs text-muted">Your guess for hosting all swaps</span>
            </span>
            <input
              inputMode="decimal"
              value={hosting}
              onChange={(e) => setHosting(e.target.value.replace(/[^0-9.]/g, ""))}
              className={input}
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            <span>
              <span className="block text-foreground">Your time / hour</span>
              <span className="block text-xs text-muted">
                Setup: easy {SETUP_HOURS[1]}h, medium {SETUP_HOURS[2]}h, hard {SETUP_HOURS[3]}h
              </span>
            </span>
            <input
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
              className={input}
            />
          </label>
        </div>
      </div>

      <article
        data-testid="result-card"
        className="relative flex flex-col overflow-hidden rounded-3xl border border-line bg-black/50 lg:sticky lg:top-16 lg:self-start"
      >
        <div className="p-5 sm:p-7">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Verdict</p>
          <h2 className={`mt-2 font-display text-5xl ${verdictColor[result.verdict]}`}>
            {result.lines.length ? result.verdict : "—"}
          </h2>
          <p className="mt-3 text-lg font-medium text-foreground">{result.headline}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{result.summary}</p>

          {result.lines.length > 0 && (
            <>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-line p-3">
                  <dt className="text-xs text-muted">Paying now / yr</dt>
                  <dd className="font-mono text-foreground">{money(result.paidPerYear)}</dd>
                </div>
                <div className="rounded-2xl border border-line p-3">
                  <dt className="text-xs text-muted">Servers / yr</dt>
                  <dd className="font-mono text-foreground">{money(result.hostingPerYear)}</dd>
                </div>
                <div className="rounded-2xl border border-line p-3">
                  <dt className="text-xs text-muted">One-time setup</dt>
                  <dd className="font-mono text-foreground">
                    {result.setupHours}h · {money(result.setupCost)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-line p-3">
                  <dt className="text-xs text-muted">First-year net</dt>
                  <dd className="font-mono text-foreground">{money(result.firstYearNet)}</dd>
                </div>
              </dl>
              <ul className="mt-5 space-y-4">
                {result.lines.map((l) => (
                  <li key={l.tool.id} className="text-sm">
                    <p className="text-foreground">
                      {l.tool.paid} → {" "}
                      <a
                        href={l.tool.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber underline underline-offset-2"
                      >
                        {l.tool.swap}
                      </a>{" "}
                      <span className="text-muted">
                        ({l.tool.stars} stars · {l.tool.license})
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      <span className="text-rose-200">Catch:</span> {l.tool.caveat}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      <span className="text-amber">License:</span> {l.tool.licenseNote}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <CardDisclaimer />
      </article>
    </div>
  );
}
