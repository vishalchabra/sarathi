import React from "react";

export default function FullGuidanceBriefUI({ brief }: { brief: any }) {
      if (!brief || typeof brief !== "object") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5/5 p-4 text-sm text-white/70">
        Building your full guidance…
      </div>
    );
  }
  if (!brief) return null;

  const sections = [
    { key: "next14", title: brief?.next14?.title, list: brief?.next14?.predictions },
    { key: "next30", title: brief?.next30?.title, list: brief?.next30?.predictions },
    { key: "next60", title: brief?.next60?.title, list: brief?.next60?.predictions },
    { key: "next90", title: brief?.next90?.title, list: brief?.next90?.predictions },
  ];

  const hasLifeStory =
    !!brief?.lifeArchitecture ||
    (Array.isArray(brief?.lifeChapters) && brief.lifeChapters.length) ||
    !!brief?.currentChapter;

  return (
    <div className="space-y-6">
        <div className="rounded-xl border border-yellow-400/40 bg-yellow-500/10 p-2 text-xs text-yellow-100">
  SMOKE: FullGuidanceBriefUI is rendering • hasLifeArchitecture={String(!!brief?.lifeArchitecture)} •
  chapters={String(Array.isArray(brief?.lifeChapters) ? brief.lifeChapters.length : 0)}
</div>
      {/* =========================
          LIFE STORY (PAID LAYER)
         ========================= */}
      {hasLifeStory ? (
        <>
          {/* 1) Life Architecture */}
          <div className="rounded-2xl border border-white/15 bg-white/5/5 p-4">
            <div className="text-sm font-semibold text-slate-100">Life Architecture</div>
            <div className="mt-1 text-xs text-white/60">
              {brief?.lifeArchitecture?.oneLine || "—"}
            </div>

            <div className="mt-3 space-y-2 text-sm text-white/85 leading-relaxed">
              <div>
                <span className="text-white/60">Core pattern: </span>
                {brief?.lifeArchitecture?.corePattern || "—"}
              </div>
              <div>
                <span className="text-white/60">Primary tension: </span>
                {brief?.lifeArchitecture?.primaryTension || "—"}
              </div>
              <div>
                <span className="text-white/60">Growth engine: </span>
                {brief?.lifeArchitecture?.growthEngine || "—"}
              </div>
              <div>
                <span className="text-white/60">Long trajectory: </span>
                {brief?.lifeArchitecture?.longTrajectory || "—"}
              </div>
            </div>
          </div>

         {/* 2) Life Chapters (PAID CLEAN: use activePeriods + dashaTimeline, not brief.lifeChapters) */}
<details
  className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4 backdrop-blur-md"
  open
>
  <summary className="cursor-pointer list-none">
    <div className="text-sm font-semibold text-slate-100">Dasha Snapshot</div>
    <div className="mt-1 text-xs text-white/60">
      Current MD/AD/PD + compact Mahadasha line. No filler.
    </div>
  </summary>

  {(() => {
    // IMPORTANT: avoid relying on brief.lifeChapters (it caused the 2187+ problem)
    // We read from report if available; else try brief.report; else show fallback.
 const b: any = brief ?? null;
const r: any = b?.report ?? b;
const ap: any = r?.activePeriods ?? null;
const paid: any =
  (brief as any)?.paid ??
  (brief as any)?.report?.paid ??
  null;

const predictions14d = Array.isArray(paid?.predictions14d) ? paid.predictions14d : [];
const predictions30d = Array.isArray(paid?.predictions30d) ? paid.predictions30d : [];
const predictions60d = Array.isArray(paid?.predictions60d) ? paid.predictions60d : [];
const predictions90d = Array.isArray(paid?.predictions90d) ? paid.predictions90d : [];
    const mdLine = ap?.mahadasha
      ? {
          label: `Mahadasha — ${String(ap.mahadasha.lord ?? "—")}`,
          start: String(ap.mahadasha.start ?? "").slice(0, 10),
          end: String(ap.mahadasha.end ?? "").slice(0, 10),
          note: String(ap.mahadasha.summary ?? "").trim(),
        }
      : null;

    const adLine = ap?.antardasha
      ? {
          label: `Antardasha — ${String(ap.antardasha.mahaLord ?? "—")}–${String(
            ap.antardasha.subLord ?? "—"
          )}`,
          start: String(ap.antardasha.start ?? "").slice(0, 10),
          end: String(ap.antardasha.end ?? "").slice(0, 10),
          note: String(ap.antardasha.summary ?? "").trim(),
        }
      : null;

    const pdLine = ap?.pratyantardasha
      ? {
          label: `Pratyantardasha — ${String(ap.pratyantardasha.mahaLord ?? "—")}–${String(
            ap.pratyantardasha.antarLord ?? "—"
          )}–${String(ap.pratyantardasha.lord ?? "—")}`,
          start: String(ap.pratyantardasha.start ?? "").slice(0, 10),
          end: String(ap.pratyantardasha.end ?? "").slice(0, 10),
          note: String(ap.pratyantardasha.summary ?? "").trim(),
        }
      : null;

    // Prefer report.dashaTimeline if present; else allow brief.dashaTimeline if you already pass it there
 const tlRaw: any[] = Array.isArray(r?.dashaTimeline) ? r.dashaTimeline : [];
    // compact + guard: drop insane years (e.g. 2187)
    const timeline = (Array.isArray(tlRaw) ? tlRaw : [])
      .map((row: any) => ({
        planet: String(row?.planet ?? row?.mdLord ?? row?.md ?? row?.lord ?? "—").trim(),
        startISO: String(row?.startISO ?? row?.start ?? row?.fromISO ?? "").slice(0, 10),
        endISO: String(row?.endISO ?? row?.end ?? row?.toISO ?? "").slice(0, 10),
      }))
      .filter((x: any) => /^\d{4}-\d{2}-\d{2}$/.test(x.startISO) && /^\d{4}-\d{2}-\d{2}$/.test(x.endISO))
      .filter((x: any) => {
        const y1 = Number(x.startISO.slice(0, 4));
        const y2 = Number(x.endISO.slice(0, 4));
        return y1 >= 1900 && y2 <= 2100 && y2 >= y1;
      });

    return (
      <div className="mt-4 space-y-3">
        {/* Current (paid-clean) */}
        {mdLine || adLine || pdLine ? (
          <div className="space-y-2">
            {mdLine ? (
              <div className="rounded-xl border border-white/10 bg-white/5/5 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  {mdLine.label}
                </div>
                <div className="mt-1 text-[13px] text-white/70">
                  {mdLine.start} → {mdLine.end}
                </div>
                {mdLine.note ? (
                  <div className="mt-2 text-sm text-white/85 leading-relaxed">
                    {mdLine.note}
                  </div>
                ) : null}
              </div>
            ) : null}

            {adLine ? (
              <div className="rounded-xl border border-indigo-400/25 bg-indigo-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  {adLine.label}
                </div>
                <div className="mt-1 text-[13px] text-white/70">
                  {adLine.start} → {adLine.end}
                </div>
                {adLine.note ? (
                  <div className="mt-2 text-sm text-white/85 leading-relaxed">
                    {adLine.note}
                  </div>
                ) : null}
              </div>
            ) : null}

            {pdLine ? (
              <div className="rounded-xl border border-white/10 bg-white/5/5 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  {pdLine.label}
                </div>
                <div className="mt-1 text-[13px] text-white/70">
                  {pdLine.start} → {pdLine.end}
                </div>
                {pdLine.note ? (
                  <div className="mt-2 text-sm text-white/85 leading-relaxed">
                    {pdLine.note}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-sm text-white/60">
            Current dasha not found (activePeriods missing).
          </div>
        )}

        {/* Compact MD timeline (optional) */}
        {timeline.length ? (
          <div className="rounded-xl border border-white/10 bg-white/5/5 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Mahadasha timeline (compact)
            </div>

            <div className="mt-2 space-y-2">
              {timeline.slice(0, 9).map((row: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                    {row.planet} MD
                  </div>
                  <div className="text-[12px] text-white/70">
                    {row.startISO} → {row.endISO}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-white/60">
            No usable dashaTimeline found (or it contained invalid years).
          </div>
        )}
      </div>
    );
  })()}
</details>

          {/* 3) Current Chapter */}
          <div className="rounded-2xl border border-white/15 bg-white/5/5 p-4">
            <div className="text-sm font-semibold text-slate-100">Current Chapter</div>

            <div className="mt-1 text-xs text-white/60">
              {(brief?.currentChapter?.md || "—")}–{(brief?.currentChapter?.ad || "—")}
              {brief?.currentChapter?.pd ? `–${brief.currentChapter.pd}` : ""}
            </div>

            {brief?.currentChapter?.executiveSummary ? (
              <div className="mt-3 text-sm text-white/85 leading-relaxed">
                {brief.currentChapter.executiveSummary}
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100/90">
                  Build
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
                  {(brief?.currentChapter?.whatToBuild || []).slice(0, 5).map((x: string, i: number) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">
                  Stop
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-white/90 space-y-1">
                  {(brief?.currentChapter?.whatToStop || []).slice(0, 5).map((x: string, i: number) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* =========================
          EXISTING BRIEF (your current UI)
         ========================= */}

      {/* Snapshot */}
      <div className="rounded-2xl border border-white/15 bg-white/5/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Full Guidance — Intelligence Brief
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-100">90-day outcomes</div>
            <div className="mt-1 text-sm text-white/70">Probability + confidence + triggers + actions.</div>
          </div>

          <span className="rounded-full border border-white/15 bg-white/5/5 px-3 py-1 text-[11px] text-white/80">
            Confidence: {brief?.overallConfidence ?? "—"}
          </span>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-indigo-950/40 p-3">
            <div className="text-xs text-white/60 uppercase tracking-wide">Primary vector</div>
            <div className="mt-1 text-sm text-white/85">{brief?.snapshot?.primaryVector ?? "—"}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-indigo-950/40 p-3">
            <div className="text-xs text-white/60 uppercase tracking-wide">Opportunity</div>
            <div className="mt-1 text-sm text-white/85">{brief?.snapshot?.opportunity ?? "—"}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-indigo-950/40 p-3">
            <div className="text-xs text-white/60 uppercase tracking-wide">Vulnerability</div>
            <div className="mt-1 text-sm text-white/85">{brief?.snapshot?.vulnerability ?? "—"}</div>
          </div>
        </div>
      </div>

      {/* Today */}
      <div className="rounded-2xl border border-white/15 bg-indigo-950/40 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Today</div>

        <div className="mt-2 rounded-xl border border-white/10 bg-white/5/5 p-3 text-sm text-white/85">
          <div>
            <span className="font-semibold">Directive:</span> {brief?.today?.directive ?? "—"}
          </div>
          <div className="mt-1">
            <span className="font-semibold">Avoid:</span> {brief?.today?.avoid ?? "—"}
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {(brief?.today?.bestWindows ?? []).map((w: any, i: number) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5/5 p-3">
              <div className="text-sm font-semibold text-slate-100">{w?.label ?? "—"}</div>
              <div className="mt-1 text-xs text-white/70">Best for: {w?.bestFor ?? "—"}</div>
              {w?.whyFact ? <div className="mt-2 text-xs text-white/60">Why: {w.whyFact}</div> : null}
              <div className="mt-2 text-xs text-white/80">
                <span className="font-semibold">One action:</span> {w?.oneAction ?? "—"}
              </div>
              <div className="mt-1 text-xs text-white/60">Avoid: {w?.avoid ?? "—"}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-red-100/90">Caution</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-white/85 space-y-1">
            {(brief?.today?.caution ?? []).map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 14/30/60/90 */}
      {(sections as any[]).map((sec: any) => (
  <div key={String(sec?.key ?? sec?.title ?? Math.random())} className="rounded-2xl border border-white/15 bg-white/5/5 p-4">
    <div className="text-sm font-semibold text-slate-100">{sec?.title ?? "—"}</div>

    <div className="mt-3 space-y-3">
      {(Array.isArray(sec?.list) ? sec.list : []).map((p: any, i: number) => (
        <div key={i} className="rounded-xl border border-white/15 bg-white/5/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-white/60">
              {String(p?.domain ?? "—").toUpperCase()} • {p?.startISO ?? "—"} → {p?.endISO ?? "—"}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/5/5 px-3 py-1 text-[11px] text-white/80">
                {p?.probability ?? "—"}%
              </span>
              <span className="rounded-full border border-white/15 bg-white/5/5 px-3 py-1 text-[11px] text-white/80">
                {p?.confidence ?? "—"}
              </span>
            </div>
          </div>

          <div className="mt-2 text-sm font-semibold text-white/90">{p?.event ?? "—"}</div>

          {Array.isArray(p?.triggers) && p.triggers.length ? (
            <div className="mt-2 text-xs text-white/75">
              <div className="font-semibold text-white/85">Triggers</div>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                {p.triggers.slice(0, 4).map((x: string, j: number) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {Array.isArray(p?.actions) && p.actions.length ? (
            <div className="mt-2 text-xs text-white/75">
              <div className="font-semibold text-white/85">Actions</div>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                {p.actions.slice(0, 4).map((x: string, j: number) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-2 text-xs text-white/85">
              <span className="font-semibold text-emerald-100/90">If followed:</span>{" "}
              {p?.consequenceIfFollowed ?? "—"}
            </div>
            <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-2 text-xs text-white/85">
              <span className="font-semibold text-red-100/90">If ignored:</span>{" "}
              {p?.consequenceIfIgnored ?? "—"}
            </div>
          </div>

          {Array.isArray(p?.whyFacts) && p.whyFacts.length ? (
            <div className="mt-2 text-[11px] text-white/60">
              Why: {p.whyFacts.slice(0, 3).join(" • ")}
            </div>
          ) : null}
        </div>
      ))}

      {/* fallback when list is empty */}
      {(!Array.isArray(sec?.list) || sec.list.length === 0) ? (
        <div className="rounded-xl border border-white/10 bg-white/5/5 p-3 text-sm text-white/70">
          No items found for {sec?.title ?? "this section"}.
        </div>
      ) : null}
    </div>
  </div>
))}
      {/* Risk + Protocol */}
      <div className="rounded-2xl border border-white/15 bg-white/5/5 p-4">
        <div className="text-sm font-semibold text-slate-100">Risk Index</div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5/5 p-3 text-sm text-white/85">
            <span className="font-semibold">Likely mistake:</span> {brief?.riskIndex?.likelyMistake ?? "—"}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5/5 p-3 text-sm text-white/85">
            <span className="font-semibold">Emotional trap:</span> {brief?.riskIndex?.emotionalTrap ?? "—"}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5/5 p-3 text-sm text-white/85">
            <span className="font-semibold">Structural trap:</span> {brief?.riskIndex?.structuralTrap ?? "—"}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5/5 p-3 text-sm text-white/85">
            <span className="font-semibold">Financial trap:</span> {brief?.riskIndex?.financialTrap ?? "—"}
          </div>
        </div>

        <div className="mt-4 text-sm font-semibold text-slate-100">Decision Protocol</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-white/85 space-y-1">
          {(brief?.decisionProtocol ?? []).map((x: string, i: number) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}