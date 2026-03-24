import { NextResponse } from "next/server";

function cleanText(s: any) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function confidenceNote(confidence: string, area: string) {
  if (confidence === "High") {
    return `This ${area} reading is supported by strong active signals in the current timing.`;
  }
  if (confidence === "Medium") {
    return `This ${area} reading is directionally active, though the signals are moderate rather than overwhelming.`;
  }
  return `This ${area} reading is tentative and should be treated as a soft indication, not a fixed outcome.`;
}

function buildAdaptiveDecision(type: string, primaryCard: any) {
  const focus = String(primaryCard?.focus ?? "").toLowerCase();
  const subfocus = String(primaryCard?.subfocus ?? "").toLowerCase();
  const text = `${focus} ${subfocus}`;

  if (type === "career") {
    if (
      text.includes("reputation") ||
      text.includes("leadership") ||
      text.includes("recognition")
    ) {
      return {
        bestMoveNow:
          "Step forward clearly, own your role, and make your priorities visible.",
        mistakeToAvoidNow:
          "Avoid hesitating, underselling yourself, or leaving authority unclear.",
        whatToPostpone:
          "Delay low-value commitments that dilute your visibility or focus.",
        signOfImprovement:
          "People begin responding more directly to your work, and your role becomes easier to define.",
      };
    }

    if (text.includes("work") || text.includes("routine")) {
      return {
        bestMoveNow:
          "Tighten priorities, clear pending tasks, and respond in a structured way.",
        mistakeToAvoidNow:
          "Avoid scattered effort, backlog growth, or letting small issues pile up.",
        whatToPostpone:
          "Delay non-essential expansion until your current load is cleaner.",
        signOfImprovement:
          "Pending work reduces, expectations become clearer, and others trust your execution more quickly.",
      };
    }

    return {
      bestMoveNow:
        "Make your role, output, and priorities easier for others to understand.",
      mistakeToAvoidNow:
        "Assuming your effort is visible without explicitly showing or structuring it.",
      whatToPostpone:
        "Side work or commitments that reduce focus on your main responsibilities.",
      signOfImprovement:
        "Expectations become clearer and your work starts getting more direct response or trust.",
    };
  }

  if (type === "marriage") {
    return {
      bestMoveNow:
        "Say the important thing clearly and make expectations easier to understand.",
      mistakeToAvoidNow:
        "Assuming the other person already understands your intention, tone, or emotional need.",
      whatToPostpone:
        "Delay emotionally loaded reactions until the real issue is clearly named.",
      signOfImprovement:
        "Tone becomes softer, misunderstandings reduce, and practical expectations become clearer.",
    };
  }

  if (type === "money") {
    return {
      bestMoveNow:
        "Review the practical details and make decisions from clarity, not urgency.",
      mistakeToAvoidNow:
        "Avoid rushed financial commitments or acting on incomplete information.",
      whatToPostpone:
        "Delay speculative or poorly verified spending, investments, or commitments.",
      signOfImprovement:
        "The numbers, terms, or consequences start feeling cleaner and easier to evaluate.",
    };
  }

  if (type === "property") {
    return {
      bestMoveNow:
        "Move carefully, verify the foundation, and check long-term suitability before emotion takes over.",
      mistakeToAvoidNow:
        "Avoid haste, weak due diligence, or choosing mainly for immediate comfort.",
      whatToPostpone:
        "Delay commitment until cost, paperwork, and practical fit are cleaner.",
      signOfImprovement:
        "The choice starts looking stronger not just emotionally, but structurally and practically.",
    };
  }

  if (type === "health") {
    return {
      bestMoveNow:
        "Simplify your routine, respond early to repeated signals, and support recovery before strain builds.",
      mistakeToAvoidNow:
        "Avoid pushing through fatigue, irregularity, or recurring signs as if they will fix themselves.",
      whatToPostpone:
        "Delay excess, overexertion, or habits that weaken consistency and recovery.",
      signOfImprovement:
        "Energy steadies, repeated symptoms reduce, and your routine starts feeling easier to maintain.",
    };
  }

  return {
    bestMoveNow: "Take clear, structured action and define responsibilities.",
    mistakeToAvoidNow: "Avoid delay, confusion, or unclear commitments.",
    whatToPostpone: "Delay non-essential choices until the signal is clearer.",
    signOfImprovement:
      "The situation becomes easier to define and less reactive to handle.",
  };
}

function buildDomainContext(type: string, lifeReport: any) {
  const planets = lifeReport?.planets || [];
  const active = lifeReport?.activePeriods || {};
  const transits = lifeReport?.topTransits || [];
  const transitFacts = lifeReport?.transitNowFacts || [];

  const md = active?.mahadasha?.lord;
  const ad = active?.antardasha?.subLord || active?.antardasha?.lord;
  const pd =
    active?.pratyantardasha?.lord || active?.pratyantardasha?.antarLord;

  const findPlanet = (name: string) =>
    planets.find(
      (p: any) =>
        String(p?.name ?? "").toLowerCase() === String(name ?? "").toLowerCase()
    );

  const getHouse = (name: string) => {
    const h = Number(findPlanet(name)?.house);
    return Number.isFinite(h) ? h : null;
  };

  const context: any = {
    type,
    md,
    ad,
    pd,
    mdHouse: getHouse(md),
    adHouse: getHouse(ad),
    pdHouse: getHouse(pd),
    signals: [],
  };

  if (type === "career") {
    context.domain = "Career & Work";
    context.primaryHouse = 10;

    if (context.mdHouse === 10) {
      context.signals.push("Main dasha activating career directly");
    }
    if (context.adHouse === 6 || context.adHouse === 10) {
      context.signals.push("Sub-period activating work and responsibility");
    }
    if (context.pdHouse === 10 || context.pdHouse === 6 || context.pdHouse === 11) {
      context.signals.push("Micro-timing currently tied to work movement, output, or gains");
    }

    const hasJupiterTransit = transits.some((t: any) =>
      String(t?.title || "").toLowerCase().includes("jupiter")
    );
    if (hasJupiterTransit) {
      context.signals.push("Growth opportunity through Jupiter transit");
    }

    const hasSaturnTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("saturn")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("saturn"));
    if (hasSaturnTransit) {
      context.signals.push("Saturn influence increasing responsibility and performance pressure");
    }

    const hasSun10 =
      transitFacts.some((t: string) => t.includes("Sun") && t.includes("(H10)")) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("career"));
    if (hasSun10) {
      context.signals.push("Visibility, authority, or recognition themes are currently emphasized");
    }
  }

  if (type === "marriage") {
    context.domain = "Marriage & Relationship";
    context.primaryHouse = 7;

    if (context.mdHouse === 7) {
      context.signals.push("Main dasha directly influencing relationships");
    }
    if (context.adHouse === 7) {
      context.signals.push("Sub-period activating relationship dynamics");
    }
    if (context.pdHouse === 7 || context.pdHouse === 2 || context.pdHouse === 8) {
      context.signals.push("Micro-timing currently tied to bonding, shared dynamics, or relational sensitivity");
    }

    const hasVenusTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("venus")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("venus"));

    if (hasVenusTransit) {
      context.signals.push("Venus influence increasing relationship focus");
    }

    const hasSun7 =
      transitFacts.some((t: string) => t.includes("Sun") && t.includes("(H7)")) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("relationship"));
    if (hasSun7) {
      context.signals.push("Relationship visibility, expectations, or interpersonal focus are currently emphasized");
    }
  }

  if (type === "money") {
    context.domain = "Money & Finances";
    context.primaryHouse = 2;

    if (context.mdHouse === 2) {
      context.signals.push("Main dasha activating money and resources");
    }
    if (context.adHouse === 2 || context.adHouse === 11) {
      context.signals.push("Sub-period influencing earnings and gains");
    }
    if (context.pdHouse === 2 || context.pdHouse === 11 || context.pdHouse === 8) {
      context.signals.push("Micro-timing currently tied to resources, gains, or shared financial sensitivity");
    }

    const hasJupiterTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("jupiter")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("jupiter"));

    if (hasJupiterTransit) {
      context.signals.push("Jupiter influence increasing opportunity or expansion in financial matters");
    }

    const hasSaturnTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("saturn")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("saturn"));

    if (hasSaturnTransit) {
      context.signals.push("Saturn influence increasing caution, responsibility, or financial realism");
    }

    const hasMoneyFocus =
      transitFacts.some((t: string) => t.includes("(H2)")) ||
      transitFacts.some((t: string) => t.includes("(H11)"));

    if (hasMoneyFocus) {
      context.signals.push("Current transits are emphasizing money, resources, or gains");
    }
  }

  if (type === "property") {
    context.domain = "Property & Assets";
    context.primaryHouse = 4;

    if (context.mdHouse === 4) {
      context.signals.push("Main dasha activating home/property matters");
    }
    if (context.adHouse === 4) {
      context.signals.push("Sub-period activating home, comfort, or property decisions");
    }
    if (context.pdHouse === 4 || context.pdHouse === 8 || context.pdHouse === 2) {
      context.signals.push("Micro-timing currently tied to home foundation, cost, or deeper practical sensitivity");
    }

    const hasSaturnTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("saturn")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("saturn"));

    if (hasSaturnTransit) {
      context.signals.push("Saturn influence increasing realism, delay, or structural scrutiny in property matters");
    }

    const hasJupiterTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("jupiter")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("jupiter"));

    if (hasJupiterTransit) {
      context.signals.push("Jupiter influence increasing possibility for a more supportive long-term base");
    }

    const hasPropertyFocus =
      transitFacts.some((t: string) => t.includes("(H4)")) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("home"));

    if (hasPropertyFocus) {
      context.signals.push("Current transits are emphasizing home, comfort, or foundation matters");
    }
  }

  if (type === "health") {
    context.domain = "Health & Routine";
    context.primaryHouse = 6;

    if (context.mdHouse === 6 || context.adHouse === 6) {
      context.signals.push("Timing strongly connected to health/routine");
    }
    if (context.pdHouse === 6 || context.pdHouse === 12 || context.pdHouse === 8) {
      context.signals.push("Micro-timing currently tied to routine stress, recovery, or physical sensitivity");
    }

    const hasSaturnTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("saturn")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("saturn"));

    if (hasSaturnTransit) {
      context.signals.push("Saturn influence increasing fatigue, pressure, or the need for disciplined correction");
    }

    const hasMarsTransit =
      transits.some((t: any) =>
        String(t?.title || "").toLowerCase().includes("mars")
      ) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("mars"));

    if (hasMarsTransit) {
      context.signals.push("Mars influence increasing heat, strain, irritation, or overexertion risk");
    }

    const hasHealthFocus =
      transitFacts.some((t: string) => t.includes("(H6)")) ||
      transitFacts.some((t: string) => t.toLowerCase().includes("routine"));

    if (hasHealthFocus) {
      context.signals.push("Current transits are emphasizing health, routine, or imbalance correction");
    }
  }

  return context;
}

function buildWhyNarrative(domainContext: any, primaryCard: any, areaLabel: string) {
  const lines: string[] = [];

  if (domainContext?.md) {
    lines.push(
      `Your current major period is setting the larger background for how ${areaLabel} matters unfold.`
    );
  }

  if (domainContext?.ad) {
    lines.push(
      `The current sub-period is making this area more active, practical, and harder to ignore.`
    );
  }

  if (Array.isArray(domainContext?.signals)) {
    for (const s of domainContext.signals) {
      if (/jupiter/i.test(s)) {
        lines.push(
          "There is also an opportunity signal active here, so this phase is not only pressure — it can also open a useful door."
        );
      } else if (/saturn/i.test(s)) {
        lines.push(
          "At the same time, Saturn-type pressure is making timing, realism, and responsibility harder to avoid."
        );
      } else if (/venus/i.test(s)) {
        lines.push(
          "Venus-type influence is making tone, connection, or relational sensitivity more important than usual."
        );
      } else if (/mars/i.test(s)) {
        lines.push(
          "Mars-type pressure is increasing urgency, heat, strain, or the need for a cleaner response."
        );
      }
    }
  }

  const focus = cleanText(primaryCard?.focus);
  if (focus) {
 if (areaLabel === "relationship") {
  lines.push(
    `The strongest current activation is around relationship communication and expectation-setting, which is why this area feels more immediate now.`
  );
} else if (areaLabel === "money") {
  lines.push(
    `The strongest current activation is around financial decisions, obligations, and practical security, which is why money matters feel more immediate now.`
  );
} else if (areaLabel === "property") {
  lines.push(
    `The strongest current activation is around home, foundation, and practical fit, which is why property matters feel more immediate now.`
  );
} else if (areaLabel === "health") {
  lines.push(
    `The strongest current activation is around routine, recovery, and imbalance correction, which is why health matters feel more immediate now.`
  );
} else {
  lines.push(
    `The strongest current activation is around ${focus.toLowerCase()}, which is why this area feels more immediate now.`
  );
}
  }

  return Array.from(new Set(lines)).slice(0, 4);
}
function isRelevantToDomain(type: string, text: string) {
  const t = String(text ?? "").toLowerCase();

  if (type === "career") {
    return /(work|career|manager|client|deadline|project|task|role|supervisor|meeting|output|recognition)/.test(
      t
    );
  }

  if (type === "marriage") {
    return /(partner|relationship|marriage|emotion|tone|communication|expectation|closeness|misunderstanding|bond)/.test(
      t
    );
  }

  if (type === "money") {
    return /(money|payment|expense|finance|budget|cost|investment|purchase|resource|gain)/.test(
      t
    );
  }

  if (type === "property") {
    return /(home|property|house|family|rent|space|foundation|paperwork|location)/.test(
      t
    );
  }

  if (type === "health") {
    return /(health|stress|sleep|routine|fatigue|body|recovery|strain|symptom|energy)/.test(
      t
    );
  }

  return false;
}
function buildAreaEventLines(
  type: string,
  primaryCard: any,
  secondaryCard: any
) {
  const focus = String(primaryCard?.focus ?? "").toLowerCase();
  const subfocus = String(primaryCard?.subfocus ?? "").toLowerCase();
  const trigger = String(primaryCard?.trigger ?? "").toLowerCase();
  const secondaryGuidance = cleanText(secondaryCard?.guidance);

  const lines: string[] = [];

  if (type === "career") {
    if (
      focus.includes("career") ||
      focus.includes("reputation") ||
      subfocus.includes("recognition") ||
      trigger.includes("visibility")
    ) {
      lines.push(
        "A senior person may pay closer attention to your output, tone, or reliability than usual."
      );
      lines.push(
        "You may become more visible for either a strength or a weakness that was previously overlooked."
      );
    }

    if (
      focus.includes("work") ||
      focus.includes("routine") ||
      subfocus.includes("task") ||
      trigger.includes("task") ||
      trigger.includes("workload")
    ) {
      lines.push(
        "A pending task or unresolved responsibility may return and require a clearer answer from you."
      );
      lines.push(
        "You may be expected to respond faster, clean up a backlog, or tighten execution around something routine but important."
      );
    }

    if (
      focus.includes("leadership") ||
      focus.includes("responsibility") ||
      subfocus.includes("ownership")
    ) {
      lines.push(
        "You may be pushed into clearer ownership, even if the authority or title is not fully formal yet."
      );
    }

    if (!lines.length) {
      lines.push(
        "A supervisor, client, or senior colleague may want clearer ownership, faster response, or better visibility into your work."
      );
      lines.push(
        "A recent work matter may come back for clarification because it was not fully closed the first time."
      );
    }

    if (secondaryGuidance && isRelevantToDomain(type, secondaryGuidance)) {
  lines.push(secondaryGuidance);
}
    lines.push(
      "An opportunity may come, but it is likely to carry expectations rather than immediate comfort."
    );
  }

  if (type === "marriage") {
    lines.push(
      "A conversation may reveal that one person’s expectations were different from what was silently assumed."
    );
    lines.push(
      "A practical issue may expose an emotional issue underneath it."
    );
    lines.push(
      "Tone, timing, and how something is said may matter more than the literal topic itself."
    );
    if (secondaryGuidance && isRelevantToDomain(type, secondaryGuidance)) {
  lines.push(secondaryGuidance);
}
    lines.push(
      "Closeness can improve here, but only if honesty becomes clearer and less indirect."
    );
  }

  if (type === "money") {
    lines.push(
      "A payment, purchase, or financial commitment may need more checking than expected."
    );
    lines.push(
      "A money opportunity may appear, but it is likely to reward discipline more than excitement."
    );
   lines.push(
  "A practical obligation, payment, or family-linked expense may force a more realistic decision than the one you would have preferred."
);
    if (secondaryGuidance && isRelevantToDomain(type, secondaryGuidance)) {
  lines.push(secondaryGuidance);
}
    lines.push(
      "A small oversight, missed detail, or repeated habit may create a consequence that forces you to pay closer attention."
    );
  }

  if (type === "property") {
    lines.push(
       "A home or property option may look right at first, but closer inspection may reveal gaps in cost, paperwork, or long-term suitability."
    );
    lines.push(
       "Family preference, cost, location, or paperwork may influence the decision more strongly than your initial plan."
    );
    lines.push(
      "A delay may actually protect you from making a rushed or weak decision."
    );
    if (secondaryGuidance && isRelevantToDomain(type, secondaryGuidance)) {
  lines.push(secondaryGuidance);
}
    lines.push(
      "The better outcome here is more likely to come through patience and verification rather than speed."
    );
  }

  if (type === "health") {
  lines.push(
    "A small recurring issue (fatigue, digestion, sleep, or stress) may repeat because the underlying routine has not been corrected yet."
  );

  lines.push(
    "Your body may react more quickly than usual to irregular habits like poor sleep timing, inconsistent meals, or overwork."
  );

  lines.push(
    "You may feel a clear signal to slow down, simplify, or correct something before it becomes more uncomfortable."
  );

  if (secondaryGuidance && isRelevantToDomain(type, secondaryGuidance)) {
    lines.push(secondaryGuidance);
  }

  lines.push(
    "A small correction now (rest, timing, or routine) may prevent a larger disruption later."
  );
}

  return Array.from(new Set(lines)).slice(0, 4);
}

function buildAreaTiming(type: string, primaryCard: any) {
  const focus = String(primaryCard?.focus ?? "").toLowerCase();
  const subfocus = String(primaryCard?.subfocus ?? "").toLowerCase();

  const next30: string[] = [];
  const next60: string[] = [];
  const next90: string[] = [];

  if (type === "career") {
    if (focus.includes("career") || subfocus.includes("recognition")) {
      next30.push(
        "A conversation around visibility, output, or professional credibility may become more explicit."
      );
      next30.push(
        "You may notice that your work is being watched more closely, even if nobody says it directly."
      );
    }
    if (focus.includes("work") || subfocus.includes("routine")) {
      next30.push(
        "A work process, deadline, or pending responsibility may need stronger structure."
      );
      next30.push(
        "This is not the best period to stay vague about ownership or let open loops build up."
      );
    }
    if (!next30.length) {
      next30.push(
        "A conversation around responsibility, deadlines, or ownership may become more direct."
      );
      next30.push(
        "Someone may expect faster response or clearer output from you."
      );
    }
    next30.push(
      "Best use of this period: reduce vagueness and make your work easier for others to evaluate."
    );

    next60.push(
      "What is now pressure is likely to turn into visible consequence over the next two months."
    );
    next60.push(
      "If handled well, this can improve trust, clarity of role, and how seriously your contribution is taken."
    );
    next60.push(
      "If mishandled, the same period can feel like more responsibility without enough recognition."
    );
    next60.push(
      "This is where role-definition starts mattering more than sheer hard work."
    );

    next90.push(
      "By this stage, your career direction is likely to look more defined than it does now."
    );
    next90.push(
      "A stronger opportunity, role shift, or responsibility jump may appear if you handled the earlier pressure structurally."
    );
    next90.push(
      "If not, the phase may harden into frustration, invisibility, or the feeling of being relied on without proper positioning."
    );
    next90.push(
      "This 90-day arc is really about whether your effort becomes authority, recognition, and momentum."
    );
  }

  if (type === "marriage") {
    next30.push(
      "An important relationship conversation may become more direct or emotionally revealing."
    );
    next30.push(
      "Misunderstanding becomes more likely if tone and expectation are left unspoken."
    );
    next30.push(
      "Best use of this period: say the real thing more clearly and reduce emotional guessing."
    );

    next60.push(
      "What feels emotionally unclear now is likely to become more defined over the next two months."
    );
    next60.push(
      "If handled well, trust improves because expectations become cleaner."
    );
    next60.push(
      "If mishandled, the same phase may turn into distance, resentment, or repeated tension around the same issue."
    );

    next90.push(
      "By this stage, the relationship pattern is likely to show whether honesty improved the bond or whether vagueness weakened it."
    );
    next90.push(
      "This period can deepen closeness, but only if emotional truth becomes easier to express and receive."
    );
    next90.push(
      "If not, the longer-term result may be emotional fatigue or the sense of not being understood properly."
    );
  }

  if (type === "money") {
    next30.push(
  "A payment, purchase, or commitment may require more verification than it first seems to need."
);
next30.push(
  "A financial decision you were delaying may now require a clear yes or no."
);
    next30.push(
      "Best use of this period: improve financial clarity before committing."
    );

    next60.push(
      "Short-term money pressure is likely to turn into clearer consequence over the next two months."
    );
    next60.push(
      "If handled well, this can strengthen stability, budgeting, and better control over resources."
    );
    next60.push(
      "If mishandled, a small weak decision now may create more pressure later."
    );

    next90.push(
      "By this stage, your money pattern is likely to reflect whether you chose realism over urgency."
    );
    next90.push(
      "A useful opportunity may grow from this phase, but only if the earlier decision was handled with discipline and proper checking."
    );
    next90.push(
      "If not, the issue may become a repeat lesson around avoidable leakage or unclear commitment."
    );
  }

  if (type === "property") {
    next30.push(
        "A home, property, or living decision may move from idea into something more concrete or actionable."
    );
    next30.push(
      "Paperwork, cost, suitability, or timing may need closer review."
    );
    next30.push(
      "Best use of this period: slow the decision down enough to test its foundation properly."
    );

    next60.push(
      "What now looks possible may start showing its real practical consequences over the next two months."
    );
    next60.push(
      "If handled carefully, this can improve grounding and the quality of the decision."
    );
    next60.push(
      "If rushed, the same phase can create avoidable stress through cost, fit, paperwork or long-term practicality."
    );

    next90.push(
      "By this stage, the property or home direction is likely to look either more stable or more questionable based on how carefully it was handled."
    );
    next90.push(
      "Patience may prove more valuable here than momentum."
    );
    next90.push(
      "The longer-term result depends on whether the choice was built on reality rather than emotional urgency."
    );
  }

  if (type === "health") {
    next30.push(
        "A repeated signal (fatigue, sleep issue, stress pattern, or body discomfort) may become harder to ignore."
    );
    next30.push(
        "Sleep, food timing, stress, or routine imbalance may need more disciplined correction."

    );
    next30.push(
      "Best use of this period: support recovery early instead of waiting for a larger interruption."
    );

    next60.push(
      "What now feels manageable may start showing clearer consequences over the next two months if the underlying pattern is not corrected."
    );
    next60.push(
      "If handled well, consistency improves and the system starts stabilizing."
    );
    next60.push(
        "If ignored, the same issue may repeat more often or start affecting energy, mood, or consistency more clearly."
    );

    next90.push(
      "By this stage, the health pattern is likely to show whether routine correction actually happened."
    );
    next90.push(
      "Improvement is likely if recovery, discipline, and pacing were treated seriously."
    );
    next90.push(
        "If not, the longer arc may become one of recurring fatigue, stress buildup, or preventable disruption."
    );
  }

  return { next30, next60, next90 };
}

function buildGenericAreaReport(
  type: string,
  primaryCard: any,
  secondaryCard: any,
  domainContext: any
) {
  const areaLabel =
    type === "marriage"
      ? "relationship"
      : type === "money"
      ? "money"
      : type === "property"
      ? "property"
      : type === "health"
      ? "health"
      : "life area";

  const guidance = cleanText(primaryCard?.guidance);
  const decisionGuidance = buildAdaptiveDecision(type, primaryCard);
  const { next30, next60, next90 } = buildAreaTiming(type, primaryCard);
const verdictMap: Record<string, string> = {
  marriage:
    "This is a relationship phase where clarity, tone, and expectation matter more than assumption.",
  money:
    "This is a money phase where clarity, discipline, and verification matter more than urgency.",
  property:
    "This is a property phase where grounding, suitability, and due diligence matter more than speed.",
  health:
   "This is a health phase where your system is asking for correction — routine, recovery, and consistency now matter more than intensity or pushing through."
};
  return {
   verdict: verdictMap[type] || guidance,
    currentReality:
  guidance && isRelevantToDomain(type, guidance)
    ? `This may already be showing up as ${guidance.toLowerCase()}`
    : type === "marriage"
    ? "You may already be noticing that relationship matters are becoming harder to leave vague. This can show up as a need for clearer tone, more honest communication, or stronger emotional understanding between two people."
    : type === "money"
    ? "You may already be noticing that money matters are becoming less forgiving of loose decisions. This can show up as the need to double-check expenses, think harder about commitments, or become more disciplined about what is sustainable."
    : type === "property"
    ? "You may already be noticing that home or property matters require more realism, patience, or practical verification than before."
    : type === "health"
    ? "You may already be noticing that your body or routine is asking for correction. This can show up as fatigue, irregular sleep, stress buildup, or small recurring issues that are becoming harder to ignore."
    : `You may already be noticing that ${areaLabel} matters are asking for more attention, clearer decisions, or a more structured response than before.`,

    whyThisAreaIsActive: buildWhyNarrative(domainContext, primaryCard, areaLabel),

    likelyDevelopments: buildAreaEventLines(type, primaryCard, secondaryCard),

    timing: {
      next30Days: next30,
      next60Days: next60,
      next90Days: next90,
    },

    decisionGuidance,

    opportunity:
      type === "marriage"
        ? "Handled well, this phase can create cleaner expectations, stronger trust, and a more honest relationship dynamic."
        : type === "money"
        ? "Handled well, this phase can improve control over spending, stronger financial decisions, and a more stable sense of security."
        : type === "property"
        ? "Handled well, this phase can improve grounding, fit, and long-term stability."
        : type === "health"
        ? "Handled well, this phase can improve energy stability, recovery quality, and make your daily routine easier to sustain."
        : "Handled well, this phase can create real improvement.",

    risk:
      type === "marriage"
        ? "If mishandled, misunderstanding and assumption may harden into distance or resentment."
        : type === "money"
        ? "If mishandled, weak checking or urgency may create avoidable financial pressure."
        : type === "property"
        ? "If mishandled, haste or weak due diligence may create avoidable stress later."
        : type === "health"
        ? "If mishandled, repeated signs may turn into recurring fatigue, stress, or preventable strain."
        : "If mishandled, uncertainty may become unnecessary pressure.",

   controlLever:
  type === "marriage"
    ? "Your control lever is tone, timing, and saying the real thing before assumption fills the gap."
   : type === "money"
    ? "Your control lever is verification, pacing, and refusing to commit before the numbers, terms, or consequences are truly clear."
    : type === "property"
    ? "Your control lever is due diligence, suitability, and patience before decision."
    : type === "health"
    ? "Your control lever is consistency, recovery, and acting early when the body starts signaling imbalance."
    : decisionGuidance.signOfImprovement ||
      "Clarity and timely response remain your strongest control lever here.",

    nonNegotiable:
      type === "marriage"
        ? "Do not leave important relationship matters in assumption."
        : type === "money"
        ? "Do not make money decisions from urgency alone."
        : type === "property"
        ? "Do not proceed if fit, cost, or foundation is still unclear."
        : type === "health"
        ? "Do not keep overriding repeated signals from the body."
        : "Do not let this area remain undefined for too long.",
  };
}

function buildCareerDeepDive(
  primaryCard: any,
  secondaryCard: any,
  domainContext: any
) {
  const guidance = cleanText(primaryCard?.guidance);
  const { next30, next60, next90 } = buildAreaTiming("career", primaryCard);

  return {
    verdict:
      "This is a career phase where pressure is increasing, but it is pushing you toward clarity, visibility, and stronger positioning.",

    currentReality:
      guidance ||
      "You may already be in a phase where work is asking more from you than before, but the reward, recognition, or clarity is not yet matching the pressure. This can show up as tighter expectations, more responsibility, or the feeling that others want stronger output from you without fully defining the role.",

    whyThisAreaIsActive: buildWhyNarrative(domainContext, primaryCard, "career"),

    likelyDevelopments: buildAreaEventLines("career", primaryCard, secondaryCard),

    timing: {
      next30Days: next30,
      next60Days: next60,
      next90Days: next90,
    },

    decisionGuidance: buildAdaptiveDecision("career", primaryCard),

    opportunity:
      "Handled well, this phase can significantly improve your visibility, credibility, and professional positioning.",

    risk:
      "If ignored, this phase can lead to increased workload without recognition, role confusion, or slow frustration.",

    controlLever:
      "Clarity of output, ownership, and communication is the single biggest lever right now.",

    nonNegotiable:
      "Your work cannot remain undefined. If expectations are unclear, pressure will rise without reward.",

    careerDeepDive: {
      patternNow:
        "This is a performance-and-visibility phase. You are being evaluated more than before, whether explicitly or silently.",
      whatThisOftenLooksLike: [
        "A manager expecting clearer ownership or faster response",
        "Work increasing without proportional recognition yet",
        "A system or backlog forcing you to become more structured",
        "An opportunity that comes with pressure, not ease",
      ],
      bestUseOfThisPhase:
        "Become easier to trust professionally through clarity, structure, and visible execution.",
      wrongUseOfThisPhase:
        "Staying in invisible effort or expecting others to automatically recognize your contribution.",
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, ...lifeInput } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing report type" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/life-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lifeInput),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "life-report failed", details: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    const domainContext = buildDomainContext(type, data);
    const cards = data?.todayNextFewDaysCards || [];

    const domainRules: Record<
      string,
      {
        houseNums: number[];
        keywords: string[];
      }
    > = {
      career: {
        houseNums: [10, 6, 11],
        keywords: [
          "career",
          "work",
          "reputation",
          "leadership",
          "recognition",
          "responsibility",
          "task",
          "service",
          "gains",
        ],
      },
      marriage: {
        houseNums: [7],
        keywords: ["relationship", "partner", "marriage", "agreement", "shared"],
      },
      money: {
        houseNums: [2, 11],
        keywords: ["money", "finance", "resources", "budget", "security", "gains"],
      },
      property: {
        houseNums: [4],
        keywords: ["home", "property", "foundation", "family", "comfort"],
      },
      health: {
        houseNums: [6],
        keywords: ["health", "routine", "workload", "stress", "service"],
      },
    };

    const rule = domainRules[type] || { houseNums: [], keywords: [] };

    function scoreCard(card: any) {
      let score = 0;

      const houseNum = Number(card?.houseNum);
      const focus = String(card?.focus ?? "").toLowerCase();
      const subfocus = String(card?.subfocus ?? "").toLowerCase();
      const guidance = String(card?.guidance ?? "").toLowerCase();
      const trigger = String(card?.trigger ?? "").toLowerCase();

      if (rule.houseNums.includes(houseNum)) score += 5;

      for (const kw of rule.keywords) {
        const k = kw.toLowerCase();
        if (focus.includes(k)) score += 3;
        if (subfocus.includes(k)) score += 2;
        if (guidance.includes(k)) score += 2;
        if (trigger.includes(k)) score += 1;
      }

      return score;
    }

    const rankedCards = [...cards]
      .map((card: any) => ({ card, score: scoreCard(card) }))
      .sort((a, b) => b.score - a.score);

    const rankedValidCards = rankedCards
      .filter((x) => x.card)
      .filter((x) => x.score > 0);

    const primaryCard =
      rankedValidCards[0]?.card || rankedCards[0]?.card || cards[0] || null;

    const secondaryCard =
      rankedValidCards[1]?.card || rankedCards[1]?.card || null;

    const cardFocus = cleanText(primaryCard?.focus);
    const cardSubfocus = cleanText(primaryCard?.subfocus);
    const cardConfidence = cleanText(primaryCard?.confidence || "Medium");

    if (type === "career") {
      const career = buildCareerDeepDive(
        primaryCard,
        secondaryCard,
        domainContext
      );

      return NextResponse.json({
        area: "career",
        confidence: cardConfidence,
        confidenceNote: confidenceNote(cardConfidence, "career"),
        meta: {
          focus: cardFocus || null,
          subfocus: cardSubfocus || null,
          dateISO: primaryCard?.dateISO || null,
        },
        ...career,
      });
    }

    if (type === "marriage") {
      const marriage = buildGenericAreaReport(
        "marriage",
        primaryCard,
        secondaryCard,
        domainContext
      );

      return NextResponse.json({
        area: "marriage",
        confidence: cardConfidence,
        confidenceNote: confidenceNote(cardConfidence, "marriage"),
        meta: {
          focus: cardFocus || null,
          subfocus: cardSubfocus || null,
          dateISO: primaryCard?.dateISO || null,
        },
        ...marriage,
        marriageDeepDive: {
          patternNow:
            "This is a clarity-and-dynamics phase. The key issue is not just feeling, but how expectations and tone are being expressed and understood.",
          whatThisOftenLooksLike: [
            "A conversation revealing different expectations than what was assumed",
            "A practical issue exposing an emotional issue underneath it",
            "Tone and timing mattering more than the literal topic",
            "Closeness improving only when honesty becomes more direct",
          ],
          bestUseOfThisPhase:
            "Reduce assumption and make the relationship easier to understand through directness and steadier tone.",
          wrongUseOfThisPhase:
            "Relying on silence, emotional guessing, or expecting the other person to understand without clarity.",
        },
      });
    }

    if (type === "money") {
      const money = buildGenericAreaReport(
        "money",
        primaryCard,
        secondaryCard,
        domainContext
      );

      return NextResponse.json({
        area: "money",
        confidence: cardConfidence,
        confidenceNote: confidenceNote(cardConfidence, "money"),
        meta: {
          focus: cardFocus || null,
          subfocus: cardSubfocus || null,
          dateISO: primaryCard?.dateISO || null,
        },
        ...money,
        moneyDeepDive: {
          patternNow:
            "This is a clarity-and-stability phase. The issue is not only whether money comes or goes, but how intelligently it is being handled.",
          whatThisOftenLooksLike: [
            "A payment, purchase, or commitment needing more checking than expected",
            "An opportunity that rewards discipline more than excitement",
            "Family or security obligations shaping the decision strongly",
            "A small oversight mattering more than usual",
          ],
          bestUseOfThisPhase:
            "Become more financially precise through better visibility, measured choices, and fewer assumptions.",
          wrongUseOfThisPhase:
            "Relying on urgency, vague optimism, or incomplete checking in financial matters.",
        },
      });
    }

    if (type === "property") {
      const property = buildGenericAreaReport(
        "property",
        primaryCard,
        secondaryCard,
        domainContext
      );

      return NextResponse.json({
        area: "property",
        confidence: cardConfidence,
        confidenceNote: confidenceNote(cardConfidence, "property"),
        meta: {
          focus: cardFocus || null,
          subfocus: cardSubfocus || null,
          dateISO: primaryCard?.dateISO || null,
        },
        ...property,
        propertyDeepDive: {
          patternNow:
            "This is a foundation-and-fit phase. The key issue is not just whether something is available, but whether it is structurally and practically right.",
          whatThisOftenLooksLike: [
            "A property option looking attractive but needing stronger practical review",
            "Family comfort, cost, or paperwork mattering more than expected",
            "A delay protecting you from a rushed decision",
            "The better option emerging through patience rather than speed",
          ],
          bestUseOfThisPhase:
            "Improve the quality of the decision through clearer checking, stronger paperwork, and honesty about long-term suitability.",
          wrongUseOfThisPhase:
            "Letting emotional comfort, urgency, or surface appearance override due diligence.",
        },
      });
    }

    if (type === "health") {
      const health = buildGenericAreaReport(
        "health",
        primaryCard,
        secondaryCard,
        domainContext
      );

      return NextResponse.json({
        area: "health",
        confidence: cardConfidence,
        confidenceNote: confidenceNote(cardConfidence, "health"),
        meta: {
          focus: cardFocus || null,
          subfocus: cardSubfocus || null,
          dateISO: primaryCard?.dateISO || null,
        },
        ...health,
        healthDeepDive: {
          patternNow:
            "The issue is not just the symptom, but whether the underlying routine is being corrected or repeatedly ignored.",
          whatThisOftenLooksLike: [
            "A repeated issue continuing because the routine behind it was not corrected",
            "Stress, sleep, food timing, or recovery mattering more than expected",
            "The body asking for simplification before intensity",
            "A preventive correction now saving a larger interruption later",
          ],
          bestUseOfThisPhase:
            "Support recovery, pacing, and routine discipline before the strain becomes more expensive.",
          wrongUseOfThisPhase:
            "Ignoring repeated signals or assuming the body will keep absorbing excess without consequence.",
        },
      });
    }

    return NextResponse.json(
      { error: "Unsupported report type" },
      { status: 400 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "internal_error", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}