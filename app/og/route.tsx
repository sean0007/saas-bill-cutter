import { ImageResponse } from "next/og";
import { calculate } from "@/lib/calc";
import { EXAMPLE_INPUTS, hasSpend, parseResultParams } from "@/lib/share";

const COLOR = { SWITCH: "#99f6e4", MAYBE: "#f0b429", KEEP: "#fda4af" } as const;
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export async function GET(req: Request) {
  const parsed = parseResultParams(new URL(req.url).searchParams);
  const inputs = hasSpend(parsed) ? parsed : EXAMPLE_INPUTS;
  const r = calculate(inputs);
  const positive = r.ongoingNetPerYear > 0;
  const swaps = r.lines.slice(0, 4);
  const more = r.lines.length - swaps.length;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "56px 64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0b429" }}>SaaS Bill Cutter</div>
          <div style={{ display: "flex", fontSize: 22, color: "#9b9588" }}>open-source swap calculator</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: COLOR[r.verdict], letterSpacing: "0.12em" }}>{r.verdict}</div>
          {positive ? (
            <div style={{ display: "flex", alignItems: "baseline", marginTop: 6 }}>
              <span style={{ fontSize: 132, fontWeight: 800, letterSpacing: "-0.04em", color: COLOR[r.verdict], lineHeight: 1 }}>{money(r.ongoingNetPerYear)}</span>
              <span style={{ fontSize: 44, color: "#9b9588", marginLeft: 14 }}>/ year</span>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 84, fontWeight: 800, color: COLOR[r.verdict], lineHeight: 1.05, marginTop: 6 }}>{r.headline}</div>
          )}
          <div style={{ display: "flex", fontSize: 28, color: "#c9c3b6", marginTop: 14 }}>
            {`${positive ? "saved after servers" : "Hosting eats the savings"} · setup ${r.setupHours}h (${money(r.setupCost)})${r.breakEvenMonths !== null ? ` · pays back in ~${r.breakEvenMonths} mo` : ""}`}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {swaps.map((l) => (
            <div key={l.tool.id} style={{ display: "flex", fontSize: 24, border: "2px solid #23252c", borderRadius: 999, padding: "8px 18px", background: "#101218", color: "#f3efe4" }}>
              {`${l.tool.paid.split(" / ")[0]} → ${l.tool.swap}`}
            </div>
          ))}
          {more > 0 ? <div style={{ display: "flex", fontSize: 24, color: "#9b9588", padding: "8px 6px" }}>{`+${more} more`}</div> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6f6a60" }}>
          <span>saas-bill-cutter.vercel.app · free, no login</span>
          <span>Educational estimate only. Not financial advice.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}
