import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calculator } from "@/components/calculator";
import { calculate } from "@/lib/calc";
import { EXAMPLE_INPUTS, PUBLIC_URL, hasSpend, ogPath, parseResultParams, resultPath, resultQuery } from "@/lib/share";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

type SP = Promise<Record<string, string | string[] | undefined>>;

const verdictColor = { SWITCH: "text-teal-200", MAYBE: "text-amber", KEEP: "text-rose-300" } as const;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const inputs = parseResultParams(await searchParams);
  if (!hasSpend(inputs)) return { title: "Your result" };
  const r = calculate(inputs);
  const swaps = r.lines.map((l) => `${l.tool.paid.split(" / ")[0]} → ${l.tool.swap}`).join(", ");
  const title = `${r.verdict}: ${r.headline}`;
  const description = `${swaps}. ${r.summary} Free open-source swap calculator, no login.`;
  const image = ogPath(inputs);
  const isExample = resultQuery(inputs) === resultQuery(EXAMPLE_INPUTS);
  return {
    title,
    description,
    alternates: { canonical: `${PUBLIC_URL}${resultPath(inputs)}` },
    robots: isExample ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `SaaS Bill Cutter · ${title}`,
      description,
      type: "website",
      url: `${PUBLIC_URL}${resultPath(inputs)}`,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `SaaS Bill Cutter · ${title}`, description, images: [image] },
  };
}

export default async function ResultPage({ searchParams }: { searchParams: SP }) {
  const inputs = parseResultParams(await searchParams);
  if (!hasSpend(inputs)) redirect("/");
  const r = calculate(inputs);
  const initial = {
    spend: Object.fromEntries(Object.entries(inputs.spend).map(([k, v]) => [k, String(v)])),
    hosting: String(inputs.hostingPerMonth),
    rate: String(inputs.hourlyRate),
  };
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Shared result · SaaS Bill Cutter</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          <span className={verdictColor[r.verdict]}>{r.verdict}:</span> {r.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{r.summary}</p>
        <p className="mt-3 text-sm text-muted">
          Swaps: {r.lines.map((l) => `${l.tool.paid} → ${l.tool.swap}`).join(" · ")}
        </p>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-muted underline underline-offset-2 hover:text-foreground">
            ← Start over with your own numbers
          </Link>
        </p>
      </section>
      <section className="mt-8">
        <Calculator initial={initial} />
      </section>
      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
        {DISCLAIMER_SHORT} {HONESTY}
      </p>
    </div>
  );
}
