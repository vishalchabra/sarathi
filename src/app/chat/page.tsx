// FILE: src/app/chat/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const LANBanner = dynamic(() => import("@/components/LANBanner"), { ssr: false });
type BirthLike = {
  name?: string;
  dateISO?: string;
  time?: string;
  tz?: string;
  lat?: number;
  lon?: number;
};
type LifeReportLike = {
  activePeriods?: any;
  timeline?: any[];
  transitWindows?: any[];
  birth?: BirthLike;
  natal?: {
    ascSign?: string | null;
    moonSign?: string | null;
    moonNakshatra?: string | null;
  };
};

type Message = { role: "user" | "assistant"; text: string };

export default function AstroChatPage() {
  const [report, setReport] = useState<LifeReportLike | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

    // Load cached Life Report + dasha bundle for chat
  useEffect(() => {
    try {
      const rawCache =
        localStorage.getItem("sarathi.lifeReportCache.v2") ||
        localStorage.getItem("sarathi.lifeReportCache"); // older fallback

      const rawDasha = localStorage.getItem("life-report-dasha");

      if (!rawCache && !rawDasha) return;

      const cached = rawCache ? JSON.parse(rawCache) : null;
      const dashaBundle = rawDasha ? JSON.parse(rawDasha) : null;

      // --- birth details (best-effort from cache) ---
      const birth = cached
        ? {
            name:
              cached?.name ??
              cached?.profile?.name ??
              cached?.ascendant?.name ??
              "",
            dateISO:
              cached?.birthDateISO ??
              cached?.birth?.dateISO ??
              cached?.profile?.birthDateISO ??
              "",
            time:
              cached?.birthTime ??
              cached?.birth?.time ??
              cached?.profile?.birthTime ??
              "",
            tz:
              cached?.birthTz ??
              cached?.birth?.tz ??
              cached?.profile?.birthTz ??
              "",
            lat:
              cached?.birthLat ??
              cached?.birth?.lat ??
              cached?.profile?.lat ??
              0,
            lon:
              cached?.birthLon ??
              cached?.birth?.lon ??
              cached?.profile?.lon ??
              0,
          }
        : null;
// light natal snapshot if present
      const natal =
        cached?.natal ??
        cached?.natalSummary ??
        null;
           // --- base lite report from cache ---
      let activePeriods: any =
        cached?.activePeriods ??
        cached?.ascendant?.activePeriods ??
        cached?.activePeriodsLive ??
        null;

      let timeline =
        cached?.timeline ??
        cached?.timelineWindows ??
        cached?.dashaTimeline ??
        [];

      // existing transit windows (if life report already built them)
      let transitWindows =
        cached?.transitWindows ??
        cached?.transits?.windows ??
        [];

      // NEW: raw transits from Life Report
      const rawTransits: any[] = Array.isArray((cached as any)?.transits)
        ? (cached as any).transits
        : [];

      // If we have raw transits but no transitWindows, synthesize a simple window
      if ((!transitWindows || transitWindows.length === 0) && rawTransits.length) {
        const now = Date.now();
        const horizonMs = 30 * 24 * 60 * 60 * 1000; // next ~30 days

        const future = rawTransits
          .map((t) => {
            const fromISO =
              t.startISO ||
              t.start ||
              t.from ||
              t.dateISO ||
              t.at ||
              null;
            const toISO =
              t.endISO ||
              t.end ||
              t.to ||
              fromISO;

            const fromMs = fromISO ? new Date(fromISO).getTime() : NaN;
            const toMs = toISO ? new Date(toISO).getTime() : NaN;

            return { t, fromISO, toISO, fromMs, toMs };
          })
          .filter(
            (x) =>
              Number.isFinite(x.fromMs) &&
              x.fromMs >= now &&
              x.fromMs <= now + horizonMs
          );

        if (future.length) {
          // pick the strongest / most relevant hit
          future.sort(
            (a, b) =>
              (Number(b.t.strength) || 0) - (Number(a.t.strength) || 0)
          );
          const top = future[0];

          const cat = (top.t.category || "").toString().toLowerCase();
          const focusAreaMap: Record<string, string> = {
            career: "career / status and recognition",
            relationships: "relationships, partners and key people",
            health: "health, stress and energy management",
            money: "money, gains and practical security",
            inner: "inner work, healing and mindset",
          };
          const focusArea =
            focusAreaMap[cat] || "a key area that’s being activated";

          const driverPlanet = top.t.planet || "A planet";
          const driverSign = top.t.sign ? ` in ${top.t.sign}` : "";
          const driverHouse = top.t.house
            ? ` affecting house ${top.t.house}`
            : "";
          const driver =
            `${driverPlanet}${driverSign}${driverHouse}`.trim() ||
            "Transit activation";

          const tags: string[] = Array.isArray(top.t.tags) ? top.t.tags : [];
          const riskFlag: "caution" | "opportunity" | "mixed" | undefined =
            tags.includes("caution")
              ? "caution"
              : tags.includes("opportunity")
              ? "opportunity"
              : "mixed";

          const summary = top.t.windowLabel || top.t.label || "";

          transitWindows = [
            {
              from: top.fromISO,
              to: top.toISO,
              focusArea,
              driver,
              riskFlag,
              summary,
              actions: [] as string[],
            },
          ];
        }
      }


      // --- now derive MD / AD / PD where possible ---

      // 1) Derive Mahadasha from life-report-dasha.ads
      let maha: any = activePeriods?.mahadasha ?? null;

      if (dashaBundle && Array.isArray(dashaBundle.ads)) {
        const ads: any[] = dashaBundle.ads;
        const todayMs = new Date().setHours(0, 0, 0, 0);

        let currentRow: any = null;

        // try bundle.current first
        if (dashaBundle.current?.md) {
          const startMs = new Date(
            dashaBundle.current.startISO || dashaBundle.current.start
          ).getTime();
          const endMs = new Date(
            dashaBundle.current.endISO || dashaBundle.current.end
          ).getTime();
          if (Number.isFinite(startMs) && Number.isFinite(endMs)) {
            if (todayMs >= startMs && todayMs <= endMs) {
              currentRow = {
                planet: dashaBundle.current.md,
                startISO: dashaBundle.current.startISO,
                endISO: dashaBundle.current.endISO,
              };
            }
          }
        }

        // if not, scan ads[]
        if (!currentRow) {
          for (const r of ads) {
            const startISO = r.startISO || r.start || r.fromISO;
            const endISO = r.endISO || r.end || r.toISO;
            const s = new Date(startISO).getTime();
            const e = new Date(endISO).getTime();
            if (!Number.isFinite(s) || !Number.isFinite(e)) continue;
            if (todayMs >= s && todayMs <= e) {
              currentRow = {
                planet: r.planet || r.md || r.lord,
                startISO,
                endISO,
              };
              break;
            }
          }
        }

        if (currentRow) {
          maha = {
            lord: currentRow.planet,
            start: currentRow.startISO,
            end: currentRow.endISO,
          };
        }
      }

      // 2) Try to infer AD / PD from timeline windows (if present)
      let antar: any = activePeriods?.antardasha ?? null;
      let praty: any = activePeriods?.pratyantardasha ?? null;

      if (Array.isArray(timeline) && timeline.length > 0) {
        const now = Date.now();

        const windows = timeline
          .map((w: any) => {
            const fromISO = w.from || w.startISO || w.start;
            const toISO = w.to || w.endISO || w.end;
            const fromMs = new Date(fromISO).getTime();
            const toMs = new Date(toISO).getTime();
            return { w, fromISO, toISO, fromMs, toMs };
          })
          .filter(
            (x) =>
              Number.isFinite(x.fromMs) &&
              Number.isFinite(x.toMs)
          );

        let currentWin =
          windows.find(
            (x) => now >= x.fromMs && now <= x.toMs
          ) || null;

        // Fallback: closest window by start date
        if (!currentWin && windows.length) {
          currentWin = [...windows].sort(
            (a, b) =>
              Math.abs(a.fromMs - now) -
              Math.abs(b.fromMs - now)
          )[0];
        }

        if (currentWin) {
          const w = currentWin.w;
          const mdLord =
            maha?.lord ||
            w.mdLord ||
            w.mahaLord ||
            w.md ||
            w.planet ||
            "";

          if (!antar && w.adLord) {
            antar = {
              mahaLord: mdLord,
              subLord: w.adLord,
              start: currentWin.fromISO,
              end: currentWin.toISO,
            };
          }

          if (!praty && w.pdLord) {
            praty = {
              mahaLord: mdLord,
              antarLord: w.adLord || "",
              lord: w.pdLord,
              start: currentWin.fromISO,
              end: currentWin.toISO,
            };
          }
        }
      }

      const lite: LifeReportLike = {
        activePeriods: {
          mahadasha: maha || null,
          antardasha: antar || null,
          pratyantardasha: praty || null,
        },
        timeline,
        transitWindows,
        birth: birth ?? undefined,
        natal,
      };

      setReport(lite);
    } catch (e) {
      console.warn("[astro-chat] failed to load Life Report cache", e);
    }
  }, []);

  const canSend = useMemo(() => q.trim().length > 0 && !loading, [q, loading]);

  async function send() {
    if (!canSend) return;
    const question = q.trim();
    setMessages((m) => [...m, { role: "user", text: question }]);
    setQ("");
    setLoading(true);
    try {
       console.log("[astro-chat] report payload →", report);
      const res = await fetch("/api/astro-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, report }),
      });
      const json = await res.json();
      const answer = json?.answer || json?.error || "…";
      setMessages((m) => [...m, { role: "assistant", text: String(answer) }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `⚠️ Network error: ${e?.message || e}` },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <LANBanner />

      <Card className="mb-4 rounded-2xl shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Sārathi Chat</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-lg text-xs">
              GPT-5
            </Badge>
            {report?.activePeriods ? (
              <Badge className="rounded-lg text-xs">Life Report linked</Badge>
            ) : (
              <Badge variant="outline" className="rounded-lg text-xs">
                No report context
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border p-3 bg-muted/40">
            <div className="text-xs text-muted-foreground">
              Tip: Open your Life Report first so the chat can read your current{" "}
              <strong>Mahadasha/Antardasha/PD</strong> and transit windows.
            </div>
          </div>

          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={
                    "inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed " +
                    (m.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-muted")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onEnter}
              placeholder="Ask about career, money, relationships, health…"
              className="rounded-xl"
            />
            <Button onClick={send} disabled={!canSend} className="rounded-xl">
              {loading ? "Thinking…" : "Ask"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
