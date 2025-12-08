// FILE: src/components/sarathi/DailyRhythmCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ActivePeriods = {
  mahadasha?: { lord: string; start?: string; end?: string };
  antardasha?: { mahaLord?: string; subLord: string; start?: string; end?: string };
  pratyantardasha?: { mahaLord?: string; antarLord?: string; lord: string; start?: string; end?: string };
};

type Natal = {
  moonNakshatra?: string | null;
};

type LifeReportLike = {
  activePeriods?: ActivePeriods;
  natal?: Natal;
};

type DailyRhythm = {
  tone: string;
  focus: string;
  avoid: string;
  foodHint: string;
  relationshipHint: string;
  moneyHint: string;
  oneStep: string;
};

function buildDailyRhythmTone(report?: LifeReportLike | null): {
  tone: string;
  focus: string;
  avoid: string;
} {
  if (!report?.activePeriods) {
    return {
      tone: "Neutral, usable day — nothing extreme, focus on simple progress.",
      focus: "Handle 1–2 important responsibilities without overloading yourself.",
      avoid: "Avoid overthinking timing or comparing yourself to others.",
    };
  }

  const { antardasha, pratyantardasha } = report.activePeriods;
  const antar = (antardasha?.subLord || "").toLowerCase();
  const praty = (pratyantardasha?.lord || "").toLowerCase();
  const stack = antar + " " + praty;

  let tone =
    "Steady but sensitive — progress is possible if you pace yourself.";
  let focus =
    "Pick one meaningful task and complete it with full attention.";
  let avoid = "Avoid forcing big decisions or spiraling in worry.";

  if (stack.includes("saturn")) {
    tone =
      "Slow, serious, but constructive — this is a 'brick by brick' kind of day.";
    focus =
      "Finish one responsibility properly; honour deadlines and commitments.";
    avoid =
      "Avoid taking on too much or judging yourself for slow progress.";
  } else if (stack.includes("rahu")) {
    tone =
      "Restless and ambitious — energy wants change, but can become scattered.";
    focus =
      "Channel the urge to change into structured outreach or planning.";
    avoid =
      "Avoid impulsive career jumps or money risks just to escape discomfort.";
  } else if (stack.includes("ketu")) {
    tone = "Decluttering and detaching — good for cleaning up old obligations.";
    focus =
      "Wrap up loose ends and quietly step away from drains on your energy.";
    avoid =
      "Avoid emotional over-engagement in drama or pointless debates.";
  } else if (stack.includes("mars")) {
    tone = "Active and assertive — good for action, but watch impatience.";
    focus =
      "Take decisive steps on 1–2 pending tasks that need courage or initiative.";
    avoid =
      "Avoid fights, ultimatums, or ‘all or nothing’ reactions.";
  } else if (stack.includes("jupiter")) {
    tone =
      "Expansive and growth-oriented — good for learning, guidance, and long-term plans.";
    focus =
      "Seek advice, study, or work on something that grows your long-term path.";
    avoid =
      "Avoid over-promising or assuming things will work without effort.";
  } else if (stack.includes("venus")) {
    tone =
      "Pleasant and connective — good for people work, aesthetics, and soft diplomacy.";
    focus =
      "Bring warmth and polish to communication or your environment.";
    avoid =
      "Avoid overindulgence in comfort, sweets, or pure pleasure distractions.";
  } else if (stack.includes("mercury")) {
    tone =
      "Thinking and communication-focused — good for planning, writing, and paperwork.";
    focus =
      "Clarify plans, fix documents, send messages, and get facts straight.";
    avoid =
      "Avoid gossip, over-analyzing, or changing decisions every hour.";
  } else if (stack.includes("moon")) {
    tone =
      "Emotionally sensitive — intuition is high but so is mood fluctuation.";
    focus =
      "Honour how you feel; choose tasks that match your emotional capacity.";
    avoid =
      "Avoid suppressing emotions or pushing yourself just to look ‘strong’.";
  } else if (stack.includes("sun")) {
    tone =
      "Visible and evaluative — you are more ‘on stage’ than usual.";
    focus =
      "Show up where it matters; take ownership in one visible area.";
    avoid =
      "Avoid ego battles or overreacting to feedback.";
  }

  return { tone, focus, avoid };
}

function buildDailyRhythmFoodHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Prefer warm, simple, cooked meals over cold or heavy junk today.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("saturn") || stack.includes("ketu")) {
    return "Go for grounding, warm, simple food (dal, khichdi, roti–sabzi) and avoid overeating or very heavy fried items.";
  }
  if (stack.includes("rahu") || stack.includes("mars")) {
    return "Support your system with clean, energising food — avoid too much spice, caffeine, or random snacking when restless.";
  }
  if (stack.includes("moon") || stack.includes("venus")) {
    return "Eat comforting but not excessive meals; hydrate well and allow a small, intentional treat if you like.";
  }
  if (stack.includes("jupiter")) {
    return "Favour sattvic, clean food — fruits, simple grains, moderate ghee; avoid overindulgence ‘just because it feels good’.";
  }
  if (stack.includes("mercury")) {
    return "Keep meals light and clear so your mind stays sharp — avoid very heavy or sleepy-making foods in the daytime.";
  }

  return "Aim for warm, cooked meals and minimise junk or emotional snacking.";
}

function buildDailyRhythmRelationshipHint(
  report?: LifeReportLike | null
): string {
  if (!report?.activePeriods) {
    return "Keep conversations simple and honest; avoid over-explaining or reacting from stress.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("saturn")) {
    return "Show reliability more than drama — follow through on what you’ve already promised.";
  }
  if (stack.includes("venus") || stack.includes("moon")) {
    return "Good for gentle connection — a kind message, shared meal, or small gesture goes far.";
  }
  if (stack.includes("mars") || stack.includes("rahu")) {
    return "Watch tone and impatience; if a topic is heated, pause instead of escalating.";
  }
  if (stack.includes("ketu")) {
    return "Detach slightly from emotionally draining dynamics; protect your peace without guilt.";
  }

  return "Lead with clarity and kindness; keep boundaries clean.";
}

function buildDailyRhythmMoneyHint(report?: LifeReportLike | null): string {
  if (!report?.activePeriods) {
    return "Use today to review money, not for big impulsive decisions.";
  }

  const stack =
    (report.activePeriods.antardasha?.subLord || "").toLowerCase() +
    " " +
    (report.activePeriods.pratyantardasha?.lord || "").toLowerCase();

  if (stack.includes("rahu")) {
    return "Avoid impulsive spending or speculative bets; channel ambition into planning and skill-building.";
  }
  if (stack.includes("saturn")) {
    return "Good for budgeting, clearing dues, or organising documents — slow, responsible money steps.";
  }
  if (stack.includes("jupiter")) {
    return "Look at long-term growth moves (learning, planning, advice), not just short-term gains.";
  }
  if (stack.includes("venus")) {
    return "You may feel like spending on comfort or beauty; allow a little, but stay within a clear limit.";
  }
  if (stack.includes("mercury")) {
    return "Ideal for paperwork, negotiations, or comparing options rather than finalising big commitments.";
  }

  return "Keep money moves simple and deliberate today; avoid big risks made from emotion.";
}

function buildDailyRhythmOneStep(
  report?: LifeReportLike | null
): string {
  const nak = (report as any)?.natal?.moonNakshatra || "";
  if (
    nak &&
    typeof nak === "string" &&
    nak.toLowerCase().includes("phalguni")
  ) {
    return "Pick one responsibility you can complete today, then add one small moment of beauty or joy for yourself afterward.";
  }
  return "Choose one realistic task that matches today’s tone and finish it fully before you touch anything else.";
}

function buildDailyRhythm(report?: LifeReportLike | null): DailyRhythm {
  const { tone, focus, avoid } = buildDailyRhythmTone(report);
  const foodHint = buildDailyRhythmFoodHint(report);
  const relationshipHint = buildDailyRhythmRelationshipHint(report);
  const moneyHint = buildDailyRhythmMoneyHint(report);
  const oneStep = buildDailyRhythmOneStep(report);

  return {
    tone,
    focus,
    avoid,
    foodHint,
    relationshipHint,
    moneyHint,
    oneStep,
  };
}

export function DailyRhythmCard({ report }: { report: LifeReportLike | null }) {
  const rhythm = buildDailyRhythm(report || undefined);

  return (
    <Card className="mt-4 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Daily Rhythm (MD/AD + Moon flavour)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs text-slate-700">
        <div>
          <div className="font-semibold text-slate-900">Tone of the day</div>
          <p>{rhythm.tone}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="font-semibold text-slate-900">Focus</div>
            <p>{rhythm.focus}</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Avoid</div>
            <p>{rhythm.avoid}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="font-semibold text-slate-900">Food</div>
            <p>{rhythm.foodHint}</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Relationships</div>
            <p>{rhythm.relationshipHint}</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Money</div>
            <p>{rhythm.moneyHint}</p>
          </div>
        </div>

        <div className="border-t pt-3 mt-1">
          <div className="font-semibold text-slate-900">One next step</div>
          <p>{rhythm.oneStep}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DailyRhythmCard;
