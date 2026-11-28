// Shared Life Report interpretation helpers.
// Extracted from the existing website implementation.

export function cleanNowCardText(text: string) {
  const raw = String(text || "").trim();
  if (!raw) return raw;

const banned = [
  "a little structure now will reduce friction later",
  "a little structure and a timely response will make the situation easier to handle",
  "the more clearly you respond, the easier this becomes",
  "a clear response will prevent unnecessary back-and-forth",
  "this is easier to handle well when details are not rushed",
  "handling it early should keep the rest of the day smoother",
];

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();

  const parts = raw.match(/[^.!?]+[.!?]?/g) || [raw];
  const kept: string[] = [];
  const seen = new Set<string>();

  for (const p of parts.map((x) => x.trim()).filter(Boolean)) {
    const key = normalize(p);
    if (!key) continue;
    if (banned.some((b) => key.includes(b))) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(p);
    if (kept.length >= 2) break;
  }

  return kept.join(" ").replace(/\s{2,}/g, " ").trim();
}

function cleanText(input: string): string {
    if (!input) return "";

    return String(input ?? "")
    // remove Unicode "replacement character"
    .replace(/\uFFFD/g, "")
    // normalize smart quotes to plain quotes
    .replace(/[“”„‟]/g, '"')
    .replace(/[‘’‚‛]/g, "'")
    // normalize dashes to hyphen (safe inside strings)
    .replace(/[–—]/g, "-")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
  }

function normalizeMojibake(input: any): string {
    let s = String(input ?? "");

    // Normalize to reduce weird unicode forms
    try {
      s = s.normalize("NFKC");
    } catch {}

    // Remove control chars (keep newline + tab)
    s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

    // Kill common replacement chars / mojibake sequences
    s = s
      .replace(/\uFFFD/g, "")        // � replacement char
      .replace(/-/g, "")
      .replace(/â€“/g, "–")
      .replace(/â€”/g, "—")
      .replace(/â€˜/g, "‘")
      .replace(/â€™/g, "’")
      .replace(/â€œ/g, "“")
      .replace(/â€/g, "”")
      .replace(/â€¦/g, "…")
      .replace(/Â/g, "")
      .replace(/ΓÇÖ/g, "’")
      .replace(/ΓÇô/g, "–")
      .replace(/ΓÇö/g, "—");

    // Remove bidi / zero-width / direction marks that can create visual garbage
    s = s.replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, "");

    // ✅ Remove box drawing + block elements + geometric shapes
    // (this is exactly the “line garbage” in your screenshot)
    s = s.replace(/[\u2500-\u257F\u2580-\u259F\u25A0-\u25FF]/g, "");

    // Collapse whitespace
    s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

    // ✅ Hard guard 1: if it STILL contains box/block chars, drop it
    if (/[\u2500-\u257F\u2580-\u259F\u25A0-\u25FF]/.test(s)) return "";

    // ✅ Hard guard 2: repeated-glyph runs like "──────" or "██████" patterns
    // (helps even when chars aren’t in the exact ranges above)
    if (/(.)\1{10,}/.test(s)) return "";

    // ✅ Junk ratio: tighten a bit so it gets discarded earlier
    const total = s.length || 1;
    const good =
      (s.match(/[A-Za-z0-9\u0600-\u06FF\u0900-\u097F ,.'"“”‘’\-–—:;!?()\n]/g) ??
        []).length;

    const junkRatio = 1 - good / total;

      // ✅ Keep text unless it's clearly the box/block gibberish
    // If text is extremely short after cleanup, it's not useful.
    if (s.length < 2) return "";

    return s;

  }

function fixQuotedGibberish(input: any) {
    const s = String(input ?? "");
    const quoteCount = (s.match(/"/g) || []).length;

    // If the string has an unusually high quote density,
    // it’s likely the `"E"x"p"...` style corruption.
    if (quoteCount > Math.max(12, Math.floor(s.length * 0.12))) {
      return s
        .replace(/"/g, "")          // remove all double quotes
        .replace(/\s{2,}/g, " ")    // collapse whitespace
        .trim();
    }
    return s;
  }

function safeText(x: any): string {
    return cleanText(normalizeMojibake(x));
  }

function isMostlyGarbage(input: string): boolean {
    const s = String(input ?? "").trim();
    if (!s) return true;

    // Quick catches for common mojibake / replacement-char spam
    if (s.includes("�") || s.includes("-") || s.includes("Ã") || s.includes("Â")) return true;

    // Remove whitespace for ratio checks
    const compact = s.replace(/\s+/g, "");
    if (compact.length < 8) return false;

    // Count "non-normal" characters (symbols/box-drawing/etc.)
    // Allow normal punctuation + letters/numbers.
    const weird = compact.match(/[^a-zA-Z0-9.,!?'"():;\-–—/%&@#]/g)?.length ?? 0;

    // If too many weird chars, it's likely garbage
    const ratio = weird / compact.length;
    return ratio > 0.22; // tune if needed
  }

function stripNakshatraClaims(s: string) {
    const t = String(s ?? "");
    if (!t.trim()) return t;

    // Build a safe list of nakshatra names we want to strip if AI mentions them
    const NAKS = [
      "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra",
      "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
      "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
      "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha",
      "Purva Bhadrapada","Uttara Bhadrapada","Revati",
    ];

    // Matches things like:
    // "Pushya Moon day...", "This Ashlesha Moon...", "Moon in Purva Phalguni...",
    // "Moon moves through Pushya...", "Moon nakshatra is Pushya..."
    const nakPattern = NAKS.map((n) => n.replace(/\s+/g, "\\s+")).join("|");

    return t
      // "Pushya Moon day ..." / "Ashlesha Moon ..."
      .replace(new RegExp(`\\b(?:${nakPattern})\\s+Moon\\b[^.]*\\.?\\s*`, "gi"), "")

      // "Moon in Pushya..." / "Moon is in Pushya..."
      .replace(new RegExp(`\\bMoon\\s+(?:is\\s+)?in\\s+(?:${nakPattern})\\b[^.]*\\.?\\s*`, "gi"), "")

      // "Moon moves through Pushya..." / "Moon transits Pushya..."
      .replace(new RegExp(`\\bMoon\\s+(?:moves\\s+through|transits|enters)\\s+(?:${nakPattern})\\b[^.]*\\.?\\s*`, "gi"), "")

      // "Moon nakshatra is: Pushya"
      .replace(new RegExp(`\\bMoon\\s+nakshatra\\s+(?:is|:)?\\s*(?:${nakPattern})\\b[^.]*\\.?\\s*`, "gi"), "")
      // "Today the Moon ..." (general)
      .replace(/\bToday\s+the\s+Moon\b[^.]*\.?\s*/gi, "")
      // cleanup extra spaces
      .replace(/\s{2,}/g, " ")
      .trim();
  }

export function interpretNatalInteraction(evidenceLine: string) {
  const text = evidenceLine.toLowerCase();

  if (text.includes("natal venus"))
    return "This may touch relationship expectations or financial priorities.";

  if (text.includes("natal mars"))
    return "This may push you to act more decisively or assert your position.";

  if (text.includes("natal saturn"))
    return "Responsibilities or long-term commitments may shape the situation.";

  if (text.includes("natal jupiter"))
    return "An opportunity for growth, learning, or expansion may emerge here.";

  if (text.includes("natal rahu"))
    return "This may connect to long-term ambitions or unfamiliar territory.";

  if (text.includes("natal ketu"))
    return "Something may feel less important now, encouraging simplification.";

  if (text.includes("natal mercury"))
    return "Communication style or information flow may become especially important.";

  if (text.includes("natal moon"))
    return "Emotional reactions or comfort zones may influence decisions.";

  return "";
}

export function buildContextLine(headline: string, evidenceLine: string) {
  const source = `${headline} ${evidenceLine}`.toLowerCase();

  if (/work|routine|task|responsibilit|colleague/.test(source)) {
    return "A quick response or clearer role definition will help keep things moving smoothly.";
  }

  if (/communication|reply|message|document|followup|negotiat|clarif/.test(source)) {
    return "The sooner details are clarified, the easier it will be to avoid unnecessary back-and-forth.";
  }

  if (/home|family|repair|property|foundation|schedule/.test(source)) {
    return "Practical coordination matters more than speed, so keep arrangements simple and specific.";
  }

  if (/money|expense|budget|shared resource|shared expense|financial|cost/.test(source)) {
    return "It will help to confirm terms, expectations, or numbers before making a final decision.";
  }

  if (/relationship|agreement|collaboration|team|shared/.test(source)) {
    return "A balanced response will work better than pushing too hard or leaving things vague.";
  }

  if (/career|direction|lead|project|initiative/.test(source)) {
    return "Small decisions made now may shape how others read your priorities over the next few days.";
  }

  return "";
}

function sentenceCase(s: string) {
    const t = String(s ?? "").trim();
    if (!t) return "";
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

function normalizeText(input: string): string {
    if (!input) return "";

    return input
      .replace(/[?]/g, "")                 // remove replacement chars
      .replace(/\s+/g, " ")                // normalize whitespace
      .replace(/\u00A0/g, " ")             // non-breaking spaces
      .replace(/\s+([.,!?])/g, "$1")       // fix spacing before punctuation
      .trim();
  }

function normalizeHighlightText(raw: string, i: number): string {
    // 1) Normalize encoding + spacing
    let s = String(raw ?? "");
    s = fixWeirdEncoding(s);
    s = sanitizeText(s);
    s = cleanText(s);

    // 2) Kill the exact repeated nudge line (anywhere, even mid paragraph)
    s = s.replace(
      /\s*(A\s+noticeable\s+transit\s+from\s+Venus\s+to\s+conjunction\s+natal\s+Venus\s+is\s+active\s+\s*treat\s+it\s+as\s+a\s+nudge\s+for\s+small,\s+conscious\s+adjustments\s+rather\s+than\s+big,\s+impulsive\s+moves\.?)\s*/gi,
      " "
    );

    // 3) Also remove similar variants (slightly different wording)
    s = s.replace(
      /\s*(A\s+noticeable\s+transit\s+from\s+Venus[^.]{0,140}?\s+is\s+active\s+\s*treat\s+it\s+as\s+a\s+nudge[^.]*\.?)\s*/gi,
      " "
    );

    // 4) Add a rotating ending so each day doesn't feel cloned
    const endings = [
      "Keep it simple: one priority, one action.",
      "Go steadysmall improvements beat big reactions.",
      "Choose clarity over speed today.",
      "Do one useful thing and stop there.",
      "Slow down before you reply or decide.",
      "Pick one adjustment and repeat it.",
      "Less drama, more precision.",
    ];

    s = s.replace(/\s+/g, " ").trim();

    // Only append an ending if we actually removed the repeated line
    // (so we dont bloat good text)
    const removedSomething =
      /Venus\s+to\s+conjunction\s+natal\s+Venus/i.test(String(raw ?? "")) &&
      !/Venus\s+to\s+conjunction\s+natal\s+Venus/i.test(s);

    if (removedSomething) {
      s = `${s} ${endings[i % endings.length]}`.trim();
    }

    return s;
  }

function strengthenEventLine(text: string) {
  let s = safeText(text);

  s = s.replace(/^a situation may arise where you need to /i, "You may need to ");
  s = s.replace(/^a situation may arise where /i, "");
  s = s.replace(/^you may need to respond to a practical obligation that needs timely attention\.?/i,
    "A pending task, request, or responsibility may need your attention.");
  s = s.replace(/^someone may ask you to respond to a practical obligation that needs timely attention\.?/i,
    "Someone may ask for an update or expect you to handle a pending responsibility.");
  s = s.replace(/^you may need to bring more structure into /i,
    "You may need to define clearer expectations in ");
  s = s.replace(/^someone may ask you to discuss roles commitments or shared responsibilities\.?/i,
    "Someone may want clarity on roles, commitments, or shared responsibilities.");
  s = s.replace(/^you could be asked to review a budget or financial plan for an upcoming project\.?/i,
    "A budget, cost, or project-related financial decision may need review.");

  // cleanup of smashed words / awkward joins
  s = s.replace(/\bfastmoving\b/gi, "fast-moving");
  s = s.replace(/\blongterm\b/gi, "long-term");
  s = s.replace(/\bsharedresponsibility\b/gi, "shared-responsibility");
  s = s.replace(/\bsharedresponsibilities\b/gi, "shared-responsibilities");
  s = s.replace(/\bworkrelated\b/gi, "work-related");
  s = s.replace(/\bhomerelated\b/gi, "home-related");
  s = s.replace(/\bfamilyrelated\b/gi, "family-related");
  s = s.replace(/this may connect to long-term ambitions or unfamiliar territory\.?/gi, "");
  s = s.replace(/responsibilities or long-term commitments may shape the situation\.?/gi, "");
  s = s.replace(/communication style or information flow may become especially important\.?/gi, "");
  s = s.replace(/\s{2,}/g, " ").trim();
  // soften repetitive weak openers
  s = s.replace(/^you may need to confirm next steps in an unfinished conversation\.?/i,
    "An unfinished conversation may need a clear next step.");
  s = s.replace(/^you may need to confirm a plan or agreement before moving ahead\.?/i,
    "A plan or agreement may need to be confirmed before anything moves forward.");
  s = s.replace(/^someone may ask you to clarify expectations with someone important\.?/i,
    "Someone may ask for clarity on expectations or responsibilities.");
  s = s.replace(/^you may need to double-check numbers before agreeing to terms\.?/i,
    "You may need to check the numbers carefully before agreeing.");
  s = s.replace(/^you may need to resolve a lingering issue from the past with a family member\.?/i,
    "A family issue that was left unresolved may need attention.");
  s = s.replace(/^a family member could bring up a past misunderstanding asking for your perspective or explanation\.?/i,
    "A family member may revisit an earlier misunderstanding and want your side of it.");

  // clean spacing
  s = s.replace(/\s{2,}/g, " ").trim();

  return s;
}

export function buildContinuityLine(cards: any[]) {
  if (!Array.isArray(cards) || cards.length < 3) return "";

  const text = JSON.stringify(cards).toLowerCase();

  if (/payment|money|expense|reimbursement|financial/.test(text)) {
    return "The week builds around practical accountability: first a loose end returns, then expectations become visible, and by the later window money, responsibility, or ownership needs clearer handling.";
  }

  if (/relationship|partner|agreement|expectation|shared|client|colleague/.test(text)) {
    return "The week moves through relationship clarity: first something unsaid becomes noticeable, then expectations need alignment, and by the later window a direct conversation or boundary becomes harder to avoid.";
  }

  if (/work|task|deadline|backlog|role|project|responsibility/.test(text)) {
    return "The week builds through unfinished responsibility: first the loose end returns, then ownership becomes visible, and by the later window something needs closure rather than more delay.";
  }

  return "The next few days appear connected rather than random: an unfinished matter returns, expectations become clearer, and the later window asks for a cleaner decision or response.";
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function pickFromSeed<T>(arr: T[], seedKey: string, offset = 0): T {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("pickFromSeed requires a non-empty array");
  }
  const idx = (hashSeed(seedKey) + offset) % arr.length;
  return arr[idx];
}

function scenarioPoolForCard(params: {
  houseNum: number | null;
  focus: string;
  headline: string;
  evidenceLine: string;
}) {
  const houseNum = params.houseNum;
  const text = `${params.focus} ${params.headline} ${params.evidenceLine}`.toLowerCase();

  if (
    houseNum === 2 ||
    houseNum === 8 ||
    /money|finance|financial|expense|budget|bill|payment|resource|reimbursement|shared finances/.test(text)
  ) {
    return [
  "review a bill, reimbursement, or shared expense",
  "confirm a payment detail or transfer",
  "discuss who is covering a cost or responsibility",
  "update a shared budget or financial understanding",
  "double-check numbers before agreeing to terms",
];
  }

  if (
    houseNum === 3 ||
    /communication|message|reply|paperwork|document|follow.?up|email|clarify/.test(text)
  ) {
    return [
  "reply to a message or request you postponed earlier",
  "send a document, update, or confirmation someone is waiting for",
  "follow up on a pending reply or approval",
  "clear up a misunderstanding before it grows",
  "confirm next steps in an unfinished conversation",
];
  }

  if (
    houseNum === 4 ||
    /home|family|property|foundation|domestic|repair|maintenance/.test(text)
  ) {
    return [
      "coordinate a home or family responsibility",
      "deal with a practical issue linked to home, comfort, or maintenance",
      "adjust plans around family logistics or domestic priorities",
      "revisit a property, household, or family-related decision",
      "handle something that affects your sense of stability or peace",
    ];
  }

  if (
    houseNum === 6 ||
    /work|routine|responsibility|schedule|task|service|admin/.test(text)
  ) {
    return [
  "handle a work task, deadline, or routine responsibility",
  "organize a backlog, admin item, or unresolved practical matter",
  "sort out a schedule or task division issue",
  "fix something small but necessary before it creates friction",
  "respond to a practical obligation that needs timely attention",
];
  }

  if (
    houseNum === 7 ||
    /relationship|agreement|partner|partnership|expectation|commitment/.test(text)
  ) {
    return [
      "clarify expectations with someone important",
      "discuss roles, commitments, or shared responsibilities",
      "confirm a plan or agreement before moving ahead",
      "address tension caused by mismatched expectations",
      "bring more structure into a partnership or collaboration",
    ];
  }

  if (
    houseNum === 9 ||
    /travel|learning|higher learning|foreign|belief|mentor|guru/.test(text)
  ) {
    return [
      "discuss travel, learning, or a longer-term growth plan",
      "revisit a decision linked to expansion, study, or a wider opportunity",
      "think seriously about a move, trip, or broader life direction",
      "engage with a mentor, teacher, or guiding perspective",
      "make sense of a bigger opportunity that could widen your world",
    ];
  }

  if (
    houseNum === 10 ||
    /career|reputation|leadership|role|public|visibility/.test(text)
  ) {
    return [
      "step into a leadership, responsibility, or visibility moment",
      "handle a work decision that affects your role or reputation",
      "respond to a request that places more responsibility on you",
      "clarify expectations in a career or business context",
      "make a practical decision that shapes how others see your priorities",
    ];
  }

  if (
    houseNum === 11 ||
    /friends|gains|network|team|group|support/.test(text)
  ) {
    return [
      "coordinate something involving a group, team, or network",
      "follow up on a gain, opportunity, or collaborative opening",
      "clarify your role in a shared effort or wider circle",
      "respond to movement in a group plan or social commitment",
      "make use of support, connections, or people already around you",
    ];
  }

  if (
    houseNum === 12 ||
    /rest|withdrawal|distance|foreign residence|solitude|healing/.test(text)
  ) {
    return [
      "step back from noise and sort something out quietly",
      "handle a matter connected to distance, privacy, or emotional space",
      "review something in private before speaking or deciding",
      "need more rest, reflection, or a slower response before acting",
      "notice that distance or withdrawal is clarifying what matters",
    ];
  }

  return [
    "handle a practical situation that needs a clear response",
    "follow through on something small but important",
    "clarify expectations before moving ahead",
    "close an open loop that has been draining attention",
    "respond to a situation that rewards steadiness over speed",
  ];
}

export function buildPremiumTriggerLabel(area: string, text: string): string {
  const src = `${area} ${text}`.toLowerCase();

  if (/home|family|household|repair/.test(src)) {
    return "Family Coordination Trigger";
  }
  if (/partner|relationship|agreement|shared|role/.test(src)) {
    return "Partnership Focus Trigger";
  }
  if (/payment|expense|budget|money|reimbursement/.test(src)) {
    return "Money Clarity Trigger";
  }
  if (/message|reply|conversation|communication|document/.test(src)) {
    return "Pending Task Trigger";
  }
  if (/work|task|deadline|backlog|schedule|coordination/.test(src)) {
    return "Workload Trigger";
  }
  return "Current Focus Trigger";
}

export function buildPremiumEmotion(area: string, text: string): string {
  const src = `${area} ${text}`.toLowerCase();

  if (/conversation|message|reply|document/.test(src)) {
    return "You may feel mentally occupied or slightly pressured to respond quickly.";
  }
  if (/payment|expense|budget|money|reimbursement/.test(src)) {
    return "You may feel more cautious than usual and want clearer numbers before moving ahead.";
  }
  if (/home|family|household|repair/.test(src)) {
    return "You may feel responsible for keeping things coordinated and emotionally steady.";
  }
  if (/work|task|deadline|backlog|schedule/.test(src)) {
    return "You may feel some pressure to clear pending matters before they pile up.";
  }
  if (/relationship|partner|agreement|role|shared/.test(src)) {
    return "You may feel alert to tone, expectations, and what is being left unsaid.";
  }
  return "You may feel slightly more reactive to practical matters that need closure.";
}

export function buildPremiumWatchOrBestUse(area: string, text: string): { label: "Watch for" | "Best use"; value: string } {
  const src = `${area} ${text}`.toLowerCase();

  if (/conversation|message|reply|document/.test(src)) {
    return {
      label: "Watch for",
      value: "a delayed reply turning a small issue into a bigger one.",
    };
  }
  if (/payment|expense|budget|money|reimbursement/.test(src)) {
    return {
      label: "Best use",
      value: "confirm the amount, timing, and who is covering what.",
    };
  }
  if (/home|family|household|repair/.test(src)) {
    return {
      label: "Best use",
      value: "settle timing and responsibility early before emotions lead the discussion.",
    };
  }
  if (/work|task|deadline|backlog|schedule/.test(src)) {
    return {
      label: "Watch for",
      value: "poor sequencing creating pressure that was avoidable.",
    };
  }
  if (/relationship|partner|agreement|role|shared/.test(src)) {
    return {
      label: "Best use",
      value: "make expectations explicit before you move the matter forward.",
    };
  }
  return {
    label: "Watch for",
    value: "letting a small practical issue stay vague for too long.",
  };
}

export function buildNext14Action(text: string, idx: number = 0) {
  const src = String(text || "").toLowerCase();

  const early = idx === 0 || idx === 1;
  const late = idx >= 2;

  if (/payment|expense|budget|money/.test(src)) {
    return early
      ? {
          label: "Best use" as const,
          value: "confirm the numbers and timing before assumptions build up.",
        }
      : {
          label: "Best use" as const,
          value: "settle ownership clearly so the issue does not drag on.",
        };
  }

  if (/schedule|plan|timing/.test(src)) {
    return early
      ? {
          label: "Best use" as const,
          value: "align availability early before other plans stack on top.",
        }
      : {
          label: "Best use" as const,
          value: "lock the sequence and responsibility down so things move cleanly.",
        };
  }

  if (/message|reply|document/.test(src)) {
    return early
      ? {
          label: "Watch for" as const,
          value: "leaving a small message unresolved for longer than needed.",
        }
      : {
          label: "Watch for" as const,
          value: "a communication gap becoming bigger because nobody closed the loop.",
        };
  }

  if (/shared|role|responsibility|task|project/.test(src)) {
    return early
      ? {
          label: "Best use" as const,
          value: "name who is handling the next step before assumptions form.",
        }
      : {
          label: "Best use" as const,
          value: "reconfirm ownership once the task starts moving again.",
        };
  }

  if (/family|home|household/.test(src)) {
    return early
      ? {
          label: "Best use" as const,
          value: "settle timing and support early so emotions stay secondary.",
        }
      : {
          label: "Best use" as const,
          value: "keep the conversation practical and define the next concrete step.",
        };
  }

  return early
    ? {
        label: "Best use" as const,
        value: "handle the practical step early while the matter is still small.",
      }
    : {
        label: "Best use" as const,
        value: "close the loop properly before the issue repeats again.",
      };
}

export function buildPlanetTriggerLabel(driver: string, area?: string, text?: string): string {
  const d = String(driver || "").toLowerCase();
  const src = `${area || ""} ${text || ""}`.toLowerCase();

  if (d.includes("mercury")) return "Mercury Communication Trigger";
  if (d.includes("venus")) return "Venus Relationship Trigger";
  if (d.includes("mars")) return "Mars Action Trigger";
  if (d.includes("jupiter")) return "Jupiter Growth Trigger";
  if (d.includes("saturn")) return "Saturn Responsibility Trigger";
  if (d.includes("sun")) return "Sun Visibility Trigger";
  if (d.includes("moon")) return "Moon Emotional Trigger";
  if (d.includes("rahu")) return "Rahu Pressure Trigger";
  if (d.includes("ketu")) return "Ketu Reset Trigger";

  if (/partner|relationship|agreement|shared|role/.test(src)) return "Partnership Focus Trigger";
  if (/payment|expense|budget|money|reimbursement/.test(src)) return "Money Clarity Trigger";
  if (/message|reply|conversation|communication|document/.test(src)) return "Pending Task Trigger";
  if (/home|family|household|repair/.test(src)) return "Family Coordination Trigger";
  if (/work|task|deadline|backlog|schedule|coordination/.test(src)) return "Workload Trigger";

  return "Current Focus Trigger";
}

export function buildPremiumDriver(report: any): string {
  const facts = Array.isArray(report?.transitNowFacts)
    ? report.transitNowFacts.filter(Boolean)
    : [];

  if (facts.length > 0) {
    return facts.slice(0, 2).join(" • ");
  }

  const np = report?.nowPlan ?? report?.nowNearFuture ?? null;
  const snap = Array.isArray(np?.now3Days?.transitSnapshot)
    ? np.now3Days.transitSnapshot.filter(Boolean)
    : [];

  if (snap.length > 0) {
    return snap.slice(0, 2).join(" • ");
  }

  return "Current transit pattern active";
}

function hashString(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

export type PrecisionSignal = {
  score: number;
  label: string;
  reason: string;
};

function planetWeightForTiming(planet: string) {
  const p = planet.toLowerCase();
  if (p.includes("mars")) return 18;
  if (p.includes("saturn")) return 17;
  if (p.includes("rahu") || p.includes("ketu")) return 16;
  if (p.includes("jupiter")) return 14;
  if (p.includes("venus")) return 11;
  if (p.includes("mercury")) return 10;
  if (p.includes("sun")) return 9;
  if (p.includes("moon")) return 7;
  return 5;
}

export function precisionSignalFromEvidence(params: {
  evidenceLine: string;
  houseNum: number | null;
  mdLord?: string;
  adLord?: string;
}) {
  const text = String(params.evidenceLine || "").toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  const planets = ["mars", "saturn", "rahu", "ketu", "jupiter", "venus", "mercury", "sun", "moon"];

  for (const p of planets) {
    if (text.includes(p)) {
      score += planetWeightForTiming(p);
      reasons.push(`${p[0].toUpperCase() + p.slice(1)} is active`);
      break;
    }
  }

  if (/trine|opposition|square|conjunction|aspect/.test(text)) {
    score += 15;
    reasons.push("direct transit-to-natal contact");
  }

  if (/h2|money|payment|expense|family|speech/.test(text) || params.houseNum === 2) {
    score += 10;
    reasons.push("money/resources house activated");
  }

  if (/h6|work|routine|debt|dispute|health/.test(text) || params.houseNum === 6) {
    score += 10;
    reasons.push("workload/routine house activated");
  }

  if (/h7|partner|client|agreement|shared/.test(text) || params.houseNum === 7) {
    score += 10;
    reasons.push("relationship/agreement house activated");
  }

  if (/h10|career|authority|visibility|status/.test(text) || params.houseNum === 10) {
    score += 10;
    reasons.push("career/visibility house activated");
  }

  const md = String(params.mdLord || "").toLowerCase();
  const ad = String(params.adLord || "").toLowerCase();

  if (md && text.includes(md)) {
    score += 12;
    reasons.push(`${params.mdLord} Mahadasha alignment`);
  }

  if (ad && text.includes(ad)) {
    score += 14;
    reasons.push(`${params.adLord} Antardasha alignment`);
  }

  const label =
    score >= 55
      ? "High precision signal"
      : score >= 35
      ? "Moderate precision signal"
      : "Background signal";

  return {
    score,
    label,
    reason: reasons.slice(0, 3).join(" • "),
  };
}

export function realLifeEventProbability(params: {
  precisionScore: number;
  houseNum: number | null;
  evidenceLine: string;
  finalLine: string;
}) {
  const source = `${params.evidenceLine} ${params.finalLine}`.toLowerCase();

  let score = params.precisionScore;

  if (/message|reply|document|follow.?up|conversation|email/.test(source)) score += 8;
  if (/payment|expense|reimbursement|money|budget|shared/.test(source)) score += 10;
  if (/work|task|deadline|project|responsibility|backlog/.test(source)) score += 9;
  if (/partner|client|colleague|family|team|shared/.test(source)) score += 7;

  if ([2, 6, 7, 8, 10].includes(Number(params.houseNum))) score += 8;

  if (score >= 70) {
    return {
      label: "High likelihood of a real-life trigger",
      text: "This is more likely to show through an actual message, request, expense, meeting, follow-up, or responsibility rather than remaining only as an inner mood.",
    };
  }

  if (score >= 45) {
    return {
      label: "Moderate likelihood of a real-life trigger",
      text: "This may show through a practical conversation, delayed response, small obligation, or shared responsibility if the same theme has already been active recently.",
    };
  }

  return {
    label: "Subtle background influence",
    text: "This may be felt more as mood, awareness, or internal pressure unless another person or pending matter activates it.",
  };
}

export function likelyPersonInvolved(params: {
  houseNum: number | null;
  text: string;
}) {
  const text = String(params.text || "").toLowerCase();
  const h = Number(params.houseNum);

  const pick = (arr: string[], salt: number) => pickFromSeed(arr, text, salt);

  if (/payment|expense|money|reimbursement|shared cost|bill/.test(text) || h === 2 || h === 8) {
    return pick(
      [
        "someone waiting for payment clarity or a number to be confirmed",
        "someone connected to a shared cost, reimbursement, or family resource",
        "a person who wants to know who is carrying what financially",
        "someone affected by a payment, expense, or practical obligation",
      ],
      801
    );
  }

  if (/work|task|deadline|project|backlog|responsibility/.test(text) || h === 6 || h === 10) {
    return pick(
      [
        "someone expecting clearer follow-through or visible progress from you",
        "a person waiting for an update, handoff, or decision",
        "someone depending on your timing, response, or completion of a task",
        "a person who may notice whether ownership is clear or delayed",
      ],
      802
    );
  }

  if (/partner|relationship|agreement|shared|client|colleague/.test(text) || h === 7) {
    return pick(
      [
        "someone who needs clarity before they can move ahead",
        "a person trying to understand your role, response, or commitment",
        "someone who may be reading your silence or delay more deeply",
        "a person looking for reassurance, alignment, or a clearer agreement",
      ],
      803
    );
  }

  if (/home|family|household|schedule|domestic/.test(text) || h === 4) {
    return pick(
      [
        "someone connected to home, family timing, or emotional reliability",
        "a family member or close person depending on your coordination",
        "someone at home who may need support, timing, or steadiness",
        "a person affected by how household responsibilities are shared",
      ],
      804
    );
  }

  if (/message|reply|document|communication|follow/.test(text) || h === 3) {
    return pick(
      [
        "someone waiting for your reply, confirmation, or missing detail",
        "a person who needs a clearer answer before the matter can move",
        "someone affected by a delayed message, document, or update",
        "a person expecting you to close a communication loop",
      ],
      805
    );
  }

  return pick(
    [
      "someone affected by your timing, decision, or follow-through",
      "a person waiting for clarity before taking the next step",
      "someone who may need a clearer response than before",
      "a person connected to an unresolved practical matter",
    ],
    806
  );
}

export function detectPrimaryLifeArea(text: string, houseNum?: number | null) {
  const t = String(text || "").toLowerCase();
  const h = Number(houseNum);

  if (/money|payment|expense|bill|resource|financial|reimbursement/.test(t) || h === 2 || h === 8) {
    return "Money & expectations";
  }

  if (/work|deadline|career|project|boss|task|backlog/.test(t) || h === 6 || h === 10) {
    return "Work & pressure";
  }

  if (/partner|relationship|agreement|expectation|client|shared/.test(t) || h === 7) {
    return "Relationships & clarity";
  }

  if (/family|home|household|domestic/.test(t) || h === 4) {
    return "Home & emotional balance";
  }

  if (/health|fatigue|routine|stress/.test(t)) {
    return "Health & energy management";
  }

  if (/message|communication|reply|document|email/.test(t) || h === 3) {
    return "Communication & pending discussions";
  }

  return "Practical life adjustments";
}

export function buildManifestationModeText(type: string) {
  if (type === "internal") {
    return {
      title: "Inner shift",
      text: "This may first show as a realization, emotional response, or change in how you read the situation.",
    };
  }

  if (type === "external") {
    return {
      title: "External trigger",
      text: "This is more likely to show through a visible event, request, message, meeting, payment, or practical development.",
    };
  }

  return {
    title: "Mixed influence",
    text: "This may blend inner processing with a practical development happening around you.",
  };
}

export function buildEventAtmosphere(type: string) {
  switch (type) {
    case "internal":
      return {
        title: "Inner shift",
        text:
          "This period may feel more psychological or emotional than externally dramatic at first.",
      };

    case "external":
      return {
        title: "External trigger",
        text:
          "This energy is more likely to manifest through visible events, conversations, requests, or practical developments.",
      };

    default:
      return {
        title: "Mixed influence",
        text:
          "This period may blend emotional processing with practical developments happening around you.",
      };
  }
}

export function buildScenarioLine(opts: {
  dateISO: string;
  triggerLabel?: string;
  houseNum?: number | null;
  focus?: string;
  headline?: string;
  evidenceLine?: string;
}) {
  const trigger = String(opts.triggerLabel ?? "").toLowerCase();
  const focus = String(opts.focus ?? "").toLowerCase();
  const headline = String(opts.headline ?? "").toLowerCase();
  const evidence = String(opts.evidenceLine ?? "").toLowerCase();
  const houseNum = Number.isFinite(Number(opts.houseNum))
    ? Number(opts.houseNum)
    : null;

  const text = `${trigger} ${focus} ${headline} ${evidence}`;
  const styleSeed = Math.abs(hashString(text)) % 3;
  // MONEY / VALUE
  if (
    /money|payment|finance|expense|budget|resource|reimbursement|cost/.test(text)
  ) {
    const arr = [
      "A money matter that was sitting quietly in the background may now require direct handling.",
      "Financial expectations, reimbursements, or shared responsibilities may become harder to postpone.",
      "Questions around value, payment, or who carries the burden may become more emotionally charged.",
      "A financial delay or practical obligation may reveal where assumptions were never fully aligned.",
    ];

    return pickFromSeed(arr, text, 101);
  }

  // RELATIONSHIPS
  if (
    /relationship|partner|agreement|expectation|shared|client|colleague|team/.test(text)
  ) {
    const arr = [
      "An unspoken expectation between you and someone else may now need a clearer definition.",
      "A conversation may reveal that two people were operating with different assumptions.",
      "Someone may want reassurance, clarity, or visible follow-through before moving ahead.",
      "A relationship or collaboration may become more sensitive to tone, timing, or consistency.",
    ];

    return pickFromSeed(arr, text, 102);
  }

  // WORK / RESPONSIBILITY
  if (
    /work|deadline|career|responsibility|task|workflow|project|leadership|role/.test(text)
  ) {
    const arr = [
      "An unfinished responsibility may return because it can no longer stay in the background.",
      "Pressure may build around delivery, timing, or whether expectations were actually understood.",
      "You may realize that something assumed to be settled still requires ownership or structure.",
      "A work or responsibility matter may become more visible than expected over the next few days.",
    ];

    return pickFromSeed(arr, text, 103);
  }

  // COMMUNICATION
  if (
    /communication|message|reply|document|paperwork|follow.?up|email/.test(text)
  ) {
    const arr = [
      "A conversation, reply, or missing detail may become more important than it first appeared.",
      "An unfinished exchange may quietly return until clarity is fully established.",
      "Something left vague earlier may now require a more direct response.",
      "A delayed message or unresolved discussion may start influencing practical decisions.",
    ];

    return pickFromSeed(arr, text, 104);
  }

  // HOME / FAMILY
  if (
    /home|family|property|domestic|household/.test(text)
  ) {
    const arr = [
      "Home or family responsibilities may require more emotional balance than expected.",
      "A domestic issue may carry deeper emotional weight than the practical situation itself.",
      "Questions around support, timing, or shared responsibility may surface within the home environment.",
      "A family or household matter may need clearer coordination before emotions take over.",
    ];

    return pickFromSeed(arr, text, 105);
  }

  // HOUSE FALLBACKS
  if (houseNum === 6) {
    return "Pressure may slowly build around routines, obligations, or unresolved responsibilities.";
  }

  if (houseNum === 7) {
    return "Partnership dynamics may reveal where expectations were never fully spoken aloud.";
  }

  if (houseNum === 8) {
    return "An emotionally loaded or financially sensitive issue may become difficult to ignore.";
  }

  if (houseNum === 10) {
    return "Questions around visibility, responsibility, or professional expectations may intensify.";
  }

  // FINAL FALLBACK
  const fallbackLines = [
  "Something left unresolved may now require clearer attention or follow-through.",
  "An issue that was quietly sitting in the background may become harder to postpone.",
  "What seemed manageable earlier may now need a more direct response or decision.",
  "An unfinished matter may slowly become more visible over the next few days.",
  "Someone may now expect a clearer answer than the one given earlier.",
"A loose end may become visible through another person’s question, delay, or request.",
];

return pickFromSeed(fallbackLines, text, 999);
}

export function buildPsychologicalLayer(opts: {
  houseNum?: number | null;
  dasha?: string;
  text?: string;
}) {
  const text = String(opts.text ?? "").toLowerCase();
  const h = Number(opts.houseNum);

  if (h === 2) {
    return "The deeper theme here is value and security — not just the amount involved, but whether responsibility, support, or fairness feels properly balanced.";
  }

  if (h === 4) {
    return "The deeper theme here is emotional grounding. A home or family matter may be asking for steadiness, not just a quick practical fix.";
  }

  if (h === 6) {
    return "The deeper theme here is accumulated pressure. Small pending duties may now reveal where routine, health, or workload needs better boundaries.";
  }

  if (h === 7) {
    return "The deeper theme here is expectation. What feels obvious to you may not have been clearly understood by the other person.";
  }

  if (h === 8) {
    return "The deeper theme here is shared responsibility. Money, trust, or emotional vulnerability may need more honesty than avoidance.";
  }

  if (h === 10) {
    return "The deeper theme here is visibility. How you respond may affect how others see your reliability, ownership, or professional maturity.";
  }

  if (/money|payment|expense|budget|finance|reimbursement/.test(text)) {
    return "The deeper theme here is not only money, but fairness, emotional investment, and whether responsibilities have silently become uneven over time.";
  }

  if (/work|deadline|task|responsibility|career|project|backlog/.test(text)) {
    return "This period may expose where you have been carrying pressure quietly while expecting others to eventually notice on their own.";
  }

  if (/partner|relationship|expectation|shared|agreement|colleague/.test(text)) {
    return "The emotional lesson here is around clearer expectations. What feels obvious to you may never have been fully expressed to the other person.";
  }

  if (/family|home|household|domestic/.test(text)) {
    return "This may bring attention to emotional labour inside the home — especially where support, timing, or reliability have become unbalanced.";
  }

  return "";
}

export function buildActionBias(params: {
  houseNum: number | null;
  focus: string;
  headline: string;
  evidenceLine: string;
}) {
  const text = `${params.focus} ${params.headline} ${params.evidenceLine}`.toLowerCase();

  if (
    /mars/.test(text) &&
    /saturn/.test(text) &&
    /(partner|relationship|communication|agreement)/.test(text)
  ) {
    const arr = [
      "Best use: define the responsibility clearly and settle who will handle what.",
      "Watch for: stepping into conflict before roles and expectations are properly named.",
      "Best use: slow the conversation down enough to assign ownership clearly.",
      "Watch for: carrying more than your share because nobody named the boundary.",
    ];
    return pickFromSeed(arr, text, 9);
  }

  if (/jupiter/.test(text) && /saturn/.test(text)) {
    const arr = [
      "Best use: take the opportunity seriously, but accept only what you can support properly.",
      "Watch for: saying yes to growth without defining the responsibility that comes with it.",
      "Best use: move forward where effort, structure, and timing are aligned.",
      "Watch for: stretching yourself too thin just because an opening appears.",
    ];
    return pickFromSeed(arr, text, 10);
  }

  if (
    params.houseNum === 2 ||
    params.houseNum === 8 ||
    /money|finance|expense|budget|bill|payment|resource|cost|pricing|shared finance/.test(text)
  ) {
    const arr = [
      "Best use: confirm the amount, timing, and who is covering what.",
      "Watch for: agreeing in principle before the numbers are actually clear.",
      "Best use: pause on the decision until costs, terms, or ownership are specific.",
      "Watch for: small financial details creating bigger misunderstandings later.",
    ];
    return pickFromSeed(arr, text, 11);
  }

  if (
    params.houseNum === 3 ||
    /communication|reply|message|paperwork|document|email|clarify|follow.?up|conversation/.test(text)
  ) {
    const arr = [
      "Best use: send the reply, update, or document before the gap gets awkward.",
      "Watch for: assuming the other person understood what was never clearly said.",
      "Best use: put the missing detail in writing instead of leaving it implied.",
      "Watch for: a delayed response turning a small issue into a bigger one.",
    ];
    return pickFromSeed(arr, text, 12);
  }

  if (
    params.houseNum === 4 ||
    /home|family|property|foundation|domestic|household/.test(text)
  ) {
    const arr = [
      "Best use: handle the home or family issue directly while it is still manageable.",
      "Watch for: a practical issue becoming emotional before the basics are handled.",
      "Best use: settle timing, errands, or responsibilities before opinions take over.",
      "Watch for: postponing a small domestic matter that really needs closure.",
    ];
    return pickFromSeed(arr, text, 13);
  }

  if (
    params.houseNum === 6 ||
    /work|routine|task|responsibility|admin|schedule|workflow|process|deadline|service/.test(text)
  ) {
    const arr = [
      "Best use: name the next task clearly and move it before backlog builds.",
      "Watch for: poor sequencing creating pressure that was avoidable.",
      "Best use: fix the small process issue now instead of working around it again.",
      "Watch for: saying yes too quickly before priorities are properly ordered.",
    ];
    return pickFromSeed(arr, text, 14);
  }

  if (
    params.houseNum === 7 ||
    /relationship|agreement|partner|partnership|expectation|commitment|shared|client|colleague/.test(text)
  ) {
    const arr = [
      "Best use: confirm who is doing what before the conversation moves on.",
      "Watch for: vague expectations that sound agreed but are not actually aligned.",
      "Best use: address the mismatch early instead of smoothing it over politely.",
      "Watch for: assuming support, agreement, or follow-through without naming it.",
    ];
    return pickFromSeed(arr, text, 15);
  }

  if (
    params.houseNum === 10 ||
    /career|leadership|role|visibility|reputation|recognition|supervisor|client|business/.test(text)
  ) {
    const arr = [
      "Best use: respond in a way that shows ownership without overcommitting.",
      "Watch for: stepping into responsibility before scope and expectations are clear.",
      "Best use: give one clear decision or update instead of leaving the matter open-ended.",
      "Watch for: taking on pressure that should have been shared or defined first.",
    ];
    return pickFromSeed(arr, text, 16);
  }

  return pickFromSeed(
    [
      "Best use: keep the next step clear, specific, and easy to act on.",
      "Watch for: rushing past a small detail that changes the whole tone later.",
      "Best use: close one open loop properly before moving to the next thing.",
      "Watch for: scattered attention making a simple matter harder than it is.",
    ],
    text,
    17
  );
}

function toPrettyDayRange(dates: string[]): string {
  const clean = Array.from(new Set((dates || []).filter(Boolean))).sort();
  if (!clean.length) return "";

  const fmt = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    });
  };

  if (clean.length === 1) return fmt(clean[0]);

  return `${fmt(clean[0])}–${fmt(clean[clean.length - 1])}`;
}

export function detectEventType(source: string) {
  const s = source.toLowerCase();

  if (/budget|payment|expense|finance|financial|resource|bill|reimbursement|transfer/.test(s)) {
    return "payment";
  }

  if (/document|paperwork|email|reply|message|communication|follow.?up|approval|confirmation/.test(s)) {
    return "communication";
  }

  if (/relationship|partner|agreement|expectation|commitment|collaboration/.test(s)) {
    return "relationship";
  }

  if (/home|family|property|repair|domestic|household|maintenance/.test(s)) {
    return "home";
  }

  if (/career|work|task|responsibility|deadline|role|leadership|project|workflow|schedule/.test(s)) {
    return "work";
  }

  if (/travel|foreign|learning|study|mentor|guru|trip/.test(s)) {
    return "travel_learning";
  }

  return "general";
}

export function detectManifestationMode(params: {
  text: string;
  precisionScore: number;
}) {
  const t = String(params.text || "").toLowerCase();
  const score = params.precisionScore;

  if (
    /message|reply|meeting|call|document|payment|expense|followup|follow-up|deadline|task|request/.test(t)
  ) {
    return score >= 45 ? "external" : "mixed";
  }

  if (/emotion|realization|distance|clarity|fairness|pressure|feeling|sensitivity/.test(t)) {
    return "internal";
  }

  if (/moon|venus|ketu/.test(t)) return "internal";

  if (/mars|mercury|saturn/.test(t)) return "external";

  return "mixed";
}

function buildEventSentence(event: string) {
  const map: Record<string, string> = {
    payment:
      "A payment detail, shared expense, reimbursement, or financial number may need clarification",

    communication:
      "A message, document, pending reply, or confirmation may require a clear response",

    relationship:
      "A partner, colleague, or collaborator may want to clarify expectations, roles, or plans",

    home:
      "A home, family, property, or household matter may require coordination or a practical decision",

    work:
      "A task, deadline, responsibility, or work-related request may suddenly need attention",

    travel_learning:
      "A travel plan, learning decision, wider opportunity, or long-range discussion may need attention",

    general:
      "A practical situation may arise that requires a clear response",
  };

  return map[event] || map.general;
}

export function buildDetailedEventSentence(source: string) {
  const s = source.toLowerCase();

  if (/payment|expense|budget|finance|resource/.test(s) && /relationship|partner|agreement|shared/.test(s)) {
    return "A shared expense, payment split, or financial agreement with someone may need clarification";
  }

  if (/payment|expense|budget|finance|resource/.test(s) && /work|project|task|deadline/.test(s)) {
    return "A work-related cost, budget item, or practical resource decision may need attention";
  }

  if (/communication|message|reply|document|paperwork/.test(s) && /work|project|task|deadline/.test(s)) {
    return "A work message, document, approval, or follow-up may need a timely response";
  }

  if (/communication|message|reply|document|paperwork/.test(s) && /home|family|property/.test(s)) {
    return "A family, property, or home-related message or document may require clarification";
  }

  if (/relationship|partner|agreement|expectation/.test(s) && /money|payment|expense|resource/.test(s)) {
    return "A partner or close contact may want clarity around money, responsibilities, or shared expectations";
  }

  if (/relationship|partner|agreement|expectation/.test(s) && /work|project|team|collaboration/.test(s)) {
    return "A colleague, collaborator, or partner may want to clarify roles, deliverables, or expectations";
  }

  if (/home|family|property/.test(s) && /money|payment|expense|resource/.test(s)) {
    return "A home or family matter may involve a payment, cost, or practical resource decision";
  }

  if (/travel|foreign|learning|study|mentor|guru/.test(s)) {
    return "A travel plan, study decision, or wider opportunity may require practical clarity";
  }

  const eventType = detectEventType(s);
  return buildEventSentence(eventType);
}

function groupConsecutiveDates(dates: string[]): string[][] {
  const clean = Array.from(new Set((dates || []).filter(Boolean))).sort();
  if (!clean.length) return [];

  const out: string[][] = [];
  let current: string[] = [clean[0]];

  const dayMs = 1000 * 60 * 60 * 24;

  for (let i = 1; i < clean.length; i++) {
    const prev = new Date(`${clean[i - 1]}T00:00:00`).getTime();
    const curr = new Date(`${clean[i]}T00:00:00`).getTime();

    if (Number.isFinite(prev) && Number.isFinite(curr) && curr - prev === dayMs) {
      current.push(clean[i]);
    } else {
      out.push(current);
      current = [clean[i]];
    }
  }

  out.push(current);
  return out;
}

export type DecisionWindow = {
  kind: "push" | "review" | "caution";
  range: string;
  text: string;
};

export function buildDecisionWindows(cards: any[]): DecisionWindow[] {
  const push: any[] = [];
  const review: any[] = [];
  const caution: any[] = [];

  for (const c of Array.isArray(cards) ? cards : []) {
    const dateISO = String(c?.dateISO ?? "").trim();
    if (!dateISO) continue;

    const trigger = String(c?.trigger ?? "").toLowerCase();
    const focus = String(c?.focus ?? "").toLowerCase();
    const evidence = Array.isArray(c?.evidence)
      ? c.evidence.join(" ").toLowerCase()
      : "";
    const confidence = String(c?.confidence ?? "").toLowerCase();

    const source = `${trigger} ${focus} ${evidence}`;

    const isMercuryLike =
      /(mercury|communication|agreement|document|paperwork|message|reply|approval|confirmation)/.test(source);

    const isMoneyLike =
      /(money|resource|budget|payment|finance|expense|bill|reimbursement|transfer)/.test(source);

    const isPush =
      /(jupiter|sun|venus)/.test(source) &&
      confidence === "high" &&
      !isMercuryLike;

    const isReview =
      isMercuryLike || isMoneyLike;

    const isCaution =
      /(saturn|rahu|ketu|pressure|delay|responsibility|unclear|transformation)/.test(source) ||
      confidence === "low";

    if (isPush) push.push(c);
    if (isReview) review.push(c);
    if (isCaution) caution.push(c);
  }

  function buildText(kind: DecisionWindow["kind"], sample: any): string {
    const triggerRaw = String(sample?.trigger ?? "").toLowerCase();
    const focus = String(sample?.focus ?? "").toLowerCase();
    const evidence = Array.isArray(sample?.evidence)
      ? sample.evidence.join(" ").toLowerCase()
      : "";

    const source = `${triggerRaw} ${focus} ${evidence}`;

    const isMoney =
      /(money|resource|budget|payment|finance|expense|bill|reimbursement|transfer)/.test(source);

    const isCommunication =
      /(communication|message|document|paperwork|email|reply|approval|confirmation|follow.?up)/.test(source);

    const isRelationship =
      /(relationship|partner|agreement|expectation|commitment|collaboration)/.test(source);

    const isHome =
      /(home|family|property|repair|domestic|household|maintenance)/.test(source);

    const isWork =
      /(career|work|task|responsibility|deadline|role|leadership|project|workflow|schedule)/.test(source);

    const isTravel =
      /(travel|foreign|learning|study|mentor|guru|trip)/.test(source);

    if (kind === "review") {
      if (isMoney) {
        return "A payment, shared expense, or budget detail may need careful review. This is a better window to verify numbers, confirm terms, or clarify who is handling what.";
      }
      if (isCommunication) {
        return "A message, document, or pending reply may need a careful response. This is a better window to clarify details, confirm next steps, or close an unfinished loop.";
      }
      if (isRelationship) {
        return "An agreement, expectation, or shared responsibility may need clarification. Review what is being assumed before you commit or respond too quickly.";
      }
      if (isHome) {
        return "A home, property, or family-related matter may need practical review. Check details before deciding how to handle it.";
      }
      return "A practical situation may need review before you move ahead. Confirm details and expectations rather than assuming they are already clear.";
    }

    if (kind === "caution") {
      if (isMoney) {
        return "Money, shared costs, or resource decisions may feel more sensitive here. Avoid rushing numbers, commitments, or financial assumptions.";
      }
      if (isRelationship) {
        return "Expectations or roles may be more sensitive here. Go slower before reacting to what someone says or assumes.";
      }
      if (isHome) {
        return "A family or home matter may carry more emotional weight here. Slow the pace and avoid turning a practical issue into a bigger one.";
      }
      if (isWork) {
        return "Responsibilities or deadlines may feel heavier here. Go slower before accepting pressure, extra tasks, or unclear expectations.";
      }
      if (isCommunication) {
        return "Messages, updates, or discussions may be easier to misread here. Slow down and make sure the meaning is fully clear before moving ahead.";
      }
      return "This window may carry more pressure or uncertainty than it first appears. Go slower and avoid rushing important decisions.";
    }

    // push
    if (isWork) {
      return "Work, progress, or practical action has stronger support here. This is a better window to act, respond, or move something forward.";
    }
    if (isRelationship) {
      return "Agreements or partnership matters may move more smoothly here. This is a better window to have the conversation or make the decision.";
    }
    if (isHome) {
      return "Home or family matters may become easier to organize here. This is a better window to act on something practical.";
    }
    if (isTravel) {
      return "Travel, learning, or wider-direction decisions may gain traction here. This is a better window to move plans forward.";
    }

    return "This window carries better support for practical progress. If something is already clear, this is a better time to move it forward.";
  }

  function pickWindow(
    kind: DecisionWindow["kind"],
    items: any[]
  ): DecisionWindow | null {
    if (!items.length) return null;

    const dates = items.map((x: any) => String(x?.dateISO ?? "").trim()).filter(Boolean);
    const groups = groupConsecutiveDates(dates);
    if (!groups.length) return null;

    const best = groups.sort((a, b) => b.length - a.length)[0];
    const range = toPrettyDayRange(best);
    const sample =
      items.find((x: any) => best.includes(String(x?.dateISO ?? "").trim())) || items[0];

    return {
      kind,
      range,
      text: buildText(kind, sample),
    };
  }

  const reviewWindow = pickWindow("review", review);
  const cautionWindow = pickWindow("caution", caution);
  const pushWindow = pickWindow("push", push);

  const out: DecisionWindow[] = [];

if (reviewWindow) out.push(reviewWindow);

if (
  cautionWindow &&
  cautionWindow.range !== reviewWindow?.range &&
  !String(cautionWindow.range).includes(String(reviewWindow?.range ?? ""))
) {
  out.push(cautionWindow);
}

  // only show push if it is genuinely different from review/caution
  if (
    pushWindow &&
    pushWindow.range !== reviewWindow?.range &&
    pushWindow.range !== cautionWindow?.range
  ) {
    out.unshift(pushWindow);
  }

  return out;
}

const PLANET_EXPRESSIONS: Record<string, string[]> = {
  mars: [
    "urgency may become harder to ignore",
    "someone may push for faster movement or clearer action",
    "patience may wear thinner than usual",
    "direct action may now feel unavoidable",
    "frustration may surface faster than expected",
  ],

  saturn: [
    "progress may feel slower but more serious",
    "responsibilities may carry more emotional weight",
    "a delay may reveal what still lacks structure",
    "something may now require consistency instead of intention",
    "the situation may feel heavier than expected",
  ],

  jupiter: [
    "a future opportunity may become more visible",
    "growth may come through planning or support",
    "a broader perspective may shift the situation",
    "someone may encourage expansion or forward movement",
    "guidance or learning may unexpectedly help resolve something",
  ],

  venus: [
    "emotional balance and fairness may become more important",
    "comfort, expectations, or relationship dynamics may become more noticeable",
    "you may become more aware of emotional reciprocity",
    "money or relationship themes may quietly influence decisions",
    "someone may seek reassurance, harmony, or agreement",
  ],

  mercury: [
    "communication gaps may become more visible",
    "details, timing, or missing information may matter more than expected",
    "a conversation may need clarification",
    "someone may revisit an unfinished discussion",
    "documents, replies, or coordination may require attention",
  ],

  moon: [
    "emotional reactions may feel stronger than usual",
    "your sensitivity to other people’s behaviour may increase",
    "mood and emotional timing may shape the situation more than logic",
    "comfort, reassurance, or emotional validation may quietly matter more",
    "small interactions may carry larger emotional meaning",
  ],

  sun: [
    "visibility and recognition may become more important",
    "ego, pride, or personal authority may subtly shape the interaction",
    "someone may expect clearer leadership or decisiveness",
    "a matter connected to reputation or accountability may surface",
    "confidence or personal direction may become more visible",
  ],

  rahu: [
    "the situation may feel unusually amplified or emotionally charged",
    "urgency, uncertainty, or restlessness may distort perspective",
    "something unfamiliar or unexpected may disrupt the normal flow",
    "desire for faster progress may create pressure",
    "the situation may feel larger or more consuming than it truly is",
  ],

  ketu: [
    "detachment or emotional distance may shape the interaction",
    "clarity may temporarily feel incomplete",
    "someone may withdraw instead of directly explaining themselves",
    "the situation may feel strangely unresolved or fragmented",
    "letting go may become more important than forcing resolution",
  ],
};

export function buildPlanetFlavor(text: string) {
  const t = String(text || "").toLowerCase();

  for (const [planet, expressions] of Object.entries(PLANET_EXPRESSIONS)) {
    if (t.includes(planet)) {
      return pickFromSeed(expressions, t, planet.length * 77);
    }
  }

  return "";
}

export function buildPrecisionNarrative(signal: PrecisionSignal) {
  const reason = String(signal.reason || "").toLowerCase();

  if (/mars/.test(reason)) {
    return "This stands out because Mars is strongly activating pressure, responsibility, and unfinished action patterns in your chart right now.";
  }

  if (/saturn/.test(reason)) {
    return "This stands out because Saturn is increasing the weight of responsibility, timing, and long-term consequences around this situation.";
  }

  if (/jupiter/.test(reason)) {
    return "This stands out because Jupiter is expanding visibility, future planning, or growth-related themes connected to this area.";
  }

  if (/rahu|ketu/.test(reason)) {
    return "This stands out because karmic or emotionally charged themes are being amplified more strongly than usual right now.";
  }

  return "This period appears more personally significant because multiple chart factors are activating the same life theme at once.";
}

function fixWeirdEncoding(input: string) {
    const s = String(input ?? "");

    return s
      // 1) Kill Unicode replacement char
      .replace(/\uFFFD/g, "")

      // 2) Common mojibake sequences
      .replace(/\u00E2\u0080\u0099/g, "\u2019") // -
      .replace(/\u00E2\u0080\u009C/g, "\u201C") // -
      .replace(/\u00E2\u0080\u009D/g, "\u201D") // -
      .replace(/\u00E2\u0080\u0093/g, "\u2013") // -
      .replace(/\u00E2\u0080\u0094/g, "\u2014") // -
      .replace(/\u00E2\u0080\u00A6/g, "\u2026") // -
      .replace(/\u00E2\u0086\u0092/g, "\u2192") // ?

      // 3) Drop stray and NBSP
      .replace(/\u00C2/g, "")
      .replace(/\u00A0/g, " ")

      // 4) Fix apostrophes in common contractions (safe)
      // today?s -> today's, we?ll -> we'll, you?re -> you're, don?t -> don't, etc.
      .replace(
        /\b([A-Za-z]+)\?(s|t|re|ve|ll|d|m)\b/g,
        "$1'$2"
      )

      // 5) Fix numeric ranges where - stands for a dash (do this BEFORE degree fixes)
      // 1?2 sentence/day/week/month -> 1-2 sentence/day/week/month
      .replace(
        /(\d)\?(\d)(\s*(?:sentence|sentences|day|days|week|weeks|month|months)\b)/gi,
        "$1-$2$3"
      )

      // 6) Fix degree symbol corruption (only when it looks like deg+minutes)
      // 13?20' -> 13-20'
      .replace(/(\d{1,2})\?(\d{2})(?=')/g, "$1-$2")

      // Also handle cases like 0?30 (common in astro text)
      .replace(/(\d{1,2})\?(\d{2})(?!\d)/g, "$1-$2")

      // 7) Fix separators: "active? treat" or "Retrograde ?"
      .replace(/([A-Za-z0-9])\?\s+(?=[A-Za-z])/g, "$1 - ")
      .replace(/\s+\?\s+/g, " – ")

      // 8) Collapse extra spaces
      .replace(/\s{2,}/g, " ")
      .trim();
  }

function sanitizeText(input: string): string {
    if (!input) return "";

    return input
      // remove - replacement characters
      .replace(/\uFFFD/g, "")
      // common mojibake fixes
      .replace(/-/g, "")
      .replace(/-|/g, '"')
      .replace(/-|-/g, "'")
      .replace(/-|-/g, "")
      .replace(/-/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }


export function interpretDailyCard(params: {
  card: any;
  index: number;
  dateISO: string;
  triggerLabel: string;
  houseNum: number | null;
  houseLabel: string;
  focusRaw: string;
  mdLord?: string;
  adLord?: string;
}) {
  const {
    card: d,
    index: idx,
    dateISO,
    triggerLabel,
    houseNum,
    houseLabel,
    focusRaw,
    mdLord,
    adLord,
  } = params;

// --- Pull + sanitize fields ---
const rawText = safeText(
  (d as any)?.text ??
  (d as any)?.guidance ??
  ""
);
const moodText = safeText((d as any)?.moodText ?? "");
const dailyFeeling = safeText((d as any)?.dailyFeeling ?? "");
const headlineRaw = safeText((d as any)?.headline ?? "");
const focusText = safeText((d as any)?.focus ?? "");
const subfocusText = safeText((d as any)?.subfocus ?? "");
const adjustedFocus =
  triggerLabel.toLowerCase().includes("misunderstanding") &&
  /career growth|recognition/i.test(focusText || focusRaw)
    ? "Communication and agreements"
    : (safeText((d as any)?.focus ?? "") || (houseNum ? `H${houseNum} ${houseLabel}` : ""));
const headline =
  headlineRaw ||
  (
    subfocusText &&
    subfocusText.toLowerCase() !== focusText.toLowerCase()
      ? subfocusText
      : ""
  ) ||
  String((d as any)?.title || "").trim() ||
  "";
const conf = String((d as any)?.confidence ?? "").trim().toLowerCase();

const doListRaw = Array.isArray((d as any)?.do) ? (d as any).do : [];
const avoidListRaw = Array.isArray((d as any)?.avoid) ? (d as any).avoid : [];

const pickText = (v: any) => {
  if (typeof v === "string") return safeText(v);
  if (v && typeof v === "object") {
    const t = (v.text ?? v.label ?? v.value ?? v.title ?? "") as any;
    if (typeof t === "string") return safeText(t);
  }
  return "";
};

const doList = doListRaw.map(pickText).filter(Boolean);
const avoidList = avoidListRaw.map(pickText).filter(Boolean);

const finalLineRaw = fixQuotedGibberish(
  safeText(
    normalizeHighlightText(stripNakshatraClaims(rawText), idx)
  )
)
  .replace(/([a-z])([A-Z])/g, "$1 $2") // auto-fix smashed words
  .replace(/([a-z])such as/gi, "$1 such as")
  .replace(/([a-z])could\b/gi, "$1 could")
  .replace(/selfassertion/gi, "self-assertion")
  .replace(/selfdirection/g, "self-direction")
  .replace(/homesuch/gi, "home such")
  .replace(/reorganizationcould/gi, "reorganization could")
  .replace(/homerelated/gi, "home-related")
  .replace(/familyrelated/gi, "family-related")
  .replace(/workrelated/gi, "work-related")
  .replace(/healthrelated/gi, "health-related")

const looksLikeInternalFacts = (s: string) =>
  /transit moon nakshatra:|strongest transit:|transit strength:|focus area:|from natal moon/i.test(s);

const finalLineCandidate =
  finalLineRaw && looksLikeInternalFacts(finalLineRaw) ? "" : finalLineRaw;

const evidenceLine = Array.isArray((d as any)?.evidence)
  ? (d as any).evidence.filter(Boolean).join(" • ")
  : "";
const actionBias = buildActionBias({
  houseNum,
  focus: focusText || focusRaw,
  headline,
  evidenceLine,
});
const fallbackLine =
  dailyFeeling ||
  moodText ||
  evidenceLine ||
  "A steady day: keep it simple, choose one priority, and close loops.";

const aiLine = (() => {
  const source = !finalLineCandidate || isMostlyGarbage(finalLineCandidate)
    ? fallbackLine
    : finalLineCandidate;

  const sentences = String(source)
    .split(/(?<=[.!?])\s+/)
    .slice(0, 1);

  return sentences.join(" ").trim();
})();

const scenarioLine = buildScenarioLine({
  dateISO: dateISO || `day-${idx}`,
  triggerLabel,
  houseNum,
  focus: focusText || focusRaw,
  headline,
  evidenceLine,
});
const precisionSignal = precisionSignalFromEvidence({
  evidenceLine,
  houseNum,
  mdLord,
  adLord,
});

const likelyEventLine = (() => {
  const s1 = strengthenEventLine(String(scenarioLine || "").trim());
  const s2 = strengthenEventLine(String(aiLine || "").trim());

  if (!s2) return s1;
  if (!s1) return s2;

  const norm1 = s1.toLowerCase();
  const norm2 = s2.toLowerCase();

  const overlapPairs = [
  ["payment", "payment"],
  ["document", "document"],
  ["responsibil", "responsibil"],
  ["follow up", "follow up"],
  ["clarif", "clarif"],
  ["priority", "priority"],
  ["misunderstanding", "misunderstanding"],
  ["agreement", "agreement"],
  ["expectation", "expectation"],
  ["task", "task"],
  ["update", "update"],
  ["client", "client"],
  ["family", "family"],
];

if (
  overlapPairs.some(([a, b]) => norm1.includes(a) && norm2.includes(b))
) {
  return s1;
}
const mismatch =
  (norm1.includes("misunderstanding") && /save|reallocate|financial review|budget opportunity/.test(norm2)) ||
  (norm1.includes("misunderstanding") && /career|recognition|growth/.test(norm2)) ||
  (norm1.includes("growth opportunity") && /misunderstanding|communication gap/.test(norm2));

if (mismatch) {
  return s1;
}
  return `${s1} ${s2}`;
})();
const contextLine = buildContextLine(headline, evidenceLine);

const cleanedContextLine = (() => {
  const c = String(contextLine || "").trim().toLowerCase();

  if (!c) return "";

  const bannedContext = [
  "communication style or information flow may become especially important",
  "responsibilities or long-term commitments may shape the situation",
  "this may connect to long-term ambitions or unfamiliar territory",
  "something may feel less important now",
  "a practical obligation may need timely attention",
  "clarify details before assumptions build up",
  "keep communication transparent and balanced",
  "make roles and responsibilities explicit",
];

  if (bannedContext.some((x) => c.includes(x))) return "";
  return contextLine;
})();

const finalLine = [likelyEventLine, cleanedContextLine]
  .filter(Boolean)
  .join(" ");
const confLabel =
  conf === "high" ? "High" : conf === "low" ? "Low" : "Medium";
const eventProbability = realLifeEventProbability({
  precisionScore: precisionSignal.score,
  houseNum,
  evidenceLine,
  finalLine,
});
const personInvolved = likelyPersonInvolved({
  houseNum,
  text: `${finalLine} ${headline} ${focusText} ${evidenceLine}`,
});
const primaryArea = detectPrimaryLifeArea(
  `${finalLine} ${headline} ${focusText} ${evidenceLine}`,
  houseNum
);
const planetFlavor = buildPlanetFlavor(
  `${finalLine} ${headline} ${evidenceLine}`
);
const manifestationMode = detectManifestationMode({
  text: `${finalLine} ${headline} ${focusText} ${evidenceLine}`,
  precisionScore: precisionSignal.score,
});

const eventAtmosphere =
  buildManifestationModeText(manifestationMode);

  const psychologicalLayer = buildPsychologicalLayer({
    houseNum,
    text: `${finalLine} ${headline} ${focusText} ${evidenceLine}`,
  });

  return {
    dateISO,
    dateLabel: d?.dateLabel ?? dateISO,
    triggerLabel,
    houseNum,
    focus: adjustedFocus || focusText || focusRaw,
    primaryArea,
    headline,
    prediction: finalLine,
    personInvolved,
    manifestationMode,
    eventAtmosphere,
    psychologicalLayer,
    emotionalAtmosphere: planetFlavor
      ? sentenceCase(planetFlavor)
      : "",
    precisionSignal,
    precisionNarrative:
      buildPrecisionNarrative(precisionSignal),
    eventIndication: eventProbability,
    actionBias,
    dailyFeeling,
    moonTone: d?.moonTone ?? "",
    evidence: Array.isArray(d?.evidence)
      ? d.evidence
      : [],
    do: doList.slice(0, 4),
    avoid: avoidList.slice(0, 4),
  };
}

function weeklyPattern(visible: any[]) {
  const list = Array.isArray(visible) ? visible : [];
  if (!list.length) return null;

  const combined = list
    .map((card: any) => {
      const trigger = String(card?.trigger ?? "");
      const focus = String(card?.focus ?? "");
      const evidence = Array.isArray(card?.evidence) ? card.evidence.join(" ") : "";
      return `${trigger} ${focus} ${evidence}`;
    })
    .join(" ")
    .toLowerCase();

  const eventSentence = buildDetailedEventSentence(combined);

  let message = `${eventSentence}. This theme appears more than once across the coming days, so early clarity will help the week run more smoothly.`;

  if (/work|task|deadline|workflow|schedule/.test(combined)) {
    message =
      "Work tasks, follow-ups, or practical responsibilities are likely to repeat across the week. The smoother approach is to deal with small obligations early before they create pressure.";
  } else if (/payment|expense|budget|finance|resource/.test(combined)) {
    message =
      "Money, shared expenses, or practical resource decisions may come up more than once this week. Clarifying numbers and responsibilities early will prevent avoidable friction.";
  } else if (/relationship|partner|agreement|expectation/.test(combined)) {
    message =
      "Relationship dynamics, shared expectations, or partnership coordination may become a repeating theme this week. Clear communication will matter more than speed.";
  } else if (/home|family|property|repair/.test(combined)) {
    message =
      "Home, family, or household coordination may require repeated attention this week. Practical handling will work better than emotional overreaction.";
  } else if (/communication|message|reply|document|paperwork/.test(combined)) {
    message =
      "Messages, documents, and unfinished conversations may need repeated attention this week. Closing small communication loops early will keep things from becoming messy.";
  }

  return {
    title: "This week’s pattern",
    text: message,
  };
}

function weeklyAdvantage(visible: any[]) {
  const text = JSON.stringify(visible).toLowerCase();

  if (/work|routine|communication|paperwork|follow.?up|effort/.test(text)) {
    return "The week supports practical organization, follow-through, and clearing pending matters while they are still manageable.";
  }

  if (/money|finance|resource|budget|shared/.test(text)) {
    return "Momentum is strongest where budgeting, cost clarity, and practical resource decisions are handled early and directly.";
  }

  if (/relationship|agreement|partner|team|group/.test(text)) {
    return "Progress is strongest when expectations are spoken clearly instead of being left implied.";
  }

  if (/home|family|property|repair/.test(text)) {
    return "The week favors practical home or family coordination, especially where small issues can be resolved before they grow.";
  }

  return "The week rewards steadiness, practical clarity, and timely action on small but important matters.";
}

function weeklyFriction(visible: any[]) {
  const text = JSON.stringify(visible).toLowerCase();

  if (/money|finance|resource|budget|shared/.test(text)) {
    return "Friction may appear when costs, numbers, or responsibilities are assumed rather than clearly discussed.";
  }

  if (/communication|reply|message|paperwork|document/.test(text)) {
    return "Friction may come from delayed replies, vague wording, or documents that are left hanging too long.";
  }

  if (/relationship|agreement|partner|team|group/.test(text)) {
    return "Friction may show up when expectations differ but nobody clarifies them early enough.";
  }

  if (/home|family|property|repair/.test(text)) {
    return "Friction may come from practical home or family matters becoming emotional before they are handled clearly.";
  }

  return "Friction is most likely when a small practical issue is postponed instead of addressed directly.";
}


const NEAR_FUTURE_HOUSE_LABELS: Record<number, string> = {
  1: "Self & direction",
  2: "Money & resources",
  3: "Communication & effort",
  4: "Home & foundations",
  5: "Creativity & children",
  6: "Work & routines",
  7: "Relationships & agreements",
  8: "Shared finances & change",
  9: "Learning & travel",
  10: "Career & reputation",
  11: "Friends & gains",
  12: "Rest & reflection",
};

export function buildNearFutureInterpretation(report: any) {
  const mdLord = String(
    report?.activePeriods?.mahadasha?.lord ?? ""
  ).trim();

  const adLord = String(
    report?.activePeriods?.antardasha?.subLord ??
    report?.activePeriods?.antardasha?.lord ??
    ""
  ).trim();

  const pdLord = String(
    report?.activePeriods?.pratyantardasha?.lord ?? ""
  ).trim();

  const plan =
    report?.nowPlan ??
    report?.nowNearFuture ??
    null;

  const visible = Array.isArray(
    report?.todayNextFewDaysCards
  )
    ? report.todayNextFewDaysCards
        .filter((card: any) => card && typeof card === "object")
        .slice(0, 7)
    : [];

  const dailyCards = visible.map((card: any, index: number) => {
    const dateISO = String(card?.dateISO ?? "").trim();

    const focusRaw = cleanNowCardText(
      String(card?.focus ?? "")
    );

    const textRaw = cleanNowCardText(
      String(card?.text ?? card?.guidance ?? "")
    );

    const rawHouse =
      card?.houseNum == null ||
      String(card.houseNum).trim() === ""
        ? NaN
        : Number(card.houseNum);

    const inferredHouse = /\bH(\d+)\b/i.exec(
      focusRaw || textRaw
    );

    const candidate = Number.isInteger(rawHouse)
      ? rawHouse
      : inferredHouse
        ? Number(inferredHouse[1])
        : NaN;

    const houseNum =
      Number.isInteger(candidate) &&
      candidate >= 1 &&
      candidate <= 12
        ? candidate
        : null;

    const houseLabel =
      houseNum !== null
        ? NEAR_FUTURE_HOUSE_LABELS[houseNum]
        : "";

    const triggerLabel =
      safeText(card?.trigger ?? "") ||
      "Transit Activation";

    return interpretDailyCard({
      card,
      index,
      dateISO,
      triggerLabel,
      houseNum,
      houseLabel,
      focusRaw,
      mdLord,
      adLord,
    });
  });

  // Do not use the original fixed confidence ratings
  // to qualify decision windows.
  const decisionInput = visible
    .filter((card: any) =>
      /^\d{4}-\d{2}-\d{2}$/.test(
        String(card?.dateISO ?? "").trim()
      )
    )
    .map((card: any) => ({
      ...card,
      confidence: undefined,
    }));

  return {
    version: "near-future-v1",

    currentPhase: {
      mdLord,
      adLord,
      pdLord,
    },

    weekly: visible.length
      ? {
          pattern: weeklyPattern(visible),
          momentum: weeklyAdvantage(visible),
          friction: weeklyFriction(visible),
          decisionWindows:
            buildDecisionWindows(decisionInput),
          continuity:
            buildContinuityLine(visible),
        }
      : null,

    dailyCards,

    headline: plan?.headline ?? null,
    astroDrivers: plan?.astroDrivers ?? [],
    now3Days: plan?.now3Days ?? null,
    next14Days: plan?.next14Days ?? null,
    next30Days: plan?.next30Days ?? null,
    evidence: plan?.evidence ?? [],
    closing: plan?.closing ?? null,
  };
}
