// FILE: src/server/astro/life-milestones.ts

// These rows come from vimshottariMDTable
export type MdRow = {
  planet: string;      // "Venus", "Sun", ...
  startISO: string;    // "1984-01-21"
  endISO: string;      // "1990-03-11"
};

// This matches the shape used in your _shell.tsx (TabTimeline)
export type LifeMilestone = {
  label: string;
  approxAgeRange: string;
  periodStart: string;
  periodEnd: string;
  drivers: string;
  themes: string[];
  risk?: "caution" | "opportunity" | "mixed";
};

/* ----------------- helpers ----------------- */

function safeDate(iso: string): Date | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function yearsBetween(fromISO: string, birthISO: string): number | null {
  const from = safeDate(fromISO);
  const birth = safeDate(birthISO);
  if (!from || !birth) return null;
  const ms = from.getTime() - birth.getTime();
  const years = ms / (1000 * 60 * 60 * 24 * 365.25);
  return years;
}

function approxAgeRange(startISO: string, endISO: string, birthISO: string): string {
  const a1 = yearsBetween(startISO, birthISO);
  const a2 = yearsBetween(endISO, birthISO);
  if (a1 == null || a2 == null) return "—";
  const startY = Math.max(0, Math.round(a1));
  const endY = Math.max(startY, Math.round(a2));
  if (startY === endY) return `${startY} years`;
  return `${startY}–${endY} years`;
}
function midAge(startISO: string, endISO: string, birthISO: string): number | null {
  const a1 = yearsBetween(startISO, birthISO);
  const a2 = yearsBetween(endISO, birthISO);
  if (a1 == null || a2 == null) return null;
  return (a1 + a2) / 2;
}

function lifeStageForAge(age: number | null):
  | "childhood"
  | "teen"
  | "young_adult"
  | "adult"
  | "mature"
  | "later" {
  if (age == null) return "adult";
  if (age < 12) return "childhood";
  if (age < 21) return "teen";
  if (age < 36) return "young_adult";
  if (age < 56) return "adult";
  if (age < 71) return "mature";
  return "later";
}

function phaseStatus(
  startISO: string,
  endISO: string,
  todayISO = new Date().toISOString().slice(0, 10)
): "past" | "current" | "future" {
  if (todayISO < startISO) return "future";
  if (todayISO > endISO) return "past";
  return "current";
}
function planetProfile(
  planet: string,
  stage: "childhood" | "teen" | "young_adult" | "adult" | "mature" | "later",
  status: "past" | "current" | "future"
): {
  drivers: string;
  themes: string[];
  risk: "caution" | "opportunity" | "mixed";
} {
  const p = planet.toLowerCase();

  const tense =
    status === "past"
      ? {
          lead: "This phase likely brought",
          may: "may have",
          tends: "tended to",
          focus: "The focus was often on",
        }
      : status === "current"
      ? {
          lead: "This phase is bringing",
          may: "may",
          tends: "tends to",
          focus: "The focus is often on",
        }
      : {
          lead: "This phase is likely to bring",
          may: "may",
          tends: "is likely to",
          focus: "The focus is likely to be on",
        };

  if (stage === "childhood") {
    switch (p) {
      case "venus":
        return {
          drivers: "Early bonding, comfort, affection, and the emotional tone of the home.",
          risk: "opportunity",
          themes: [
            `${tense.lead} a stronger influence of comfort, affection, and family warmth around the child.`,
            "Emotional security, attachment patterns, likes, dislikes, and social softness were likely being formed.",
            "The home atmosphere, caregiving style, and sense of being valued may have mattered more than achievement.",
          ],
        };
      case "sun":
        return {
          drivers: "Identity formation, confidence, rules, and the influence of authority figures.",
          risk: "mixed",
          themes: [
            `${tense.lead} experiences that shaped confidence, self-expression, discipline, and the need to be seen.`,
            "School environment, father figures, authority, expectations, or performance pressure may have become more noticeable.",
            "This may have been a period of learning how to stand out, follow structure, or deal with recognition and comparison.",
          ],
        };
      case "moon":
        return {
          drivers: "Emotional development, home life, attachment, and inner sensitivity.",
          risk: "mixed",
          themes: [
            `${tense.lead} stronger emotional shaping through family atmosphere, caregiving, and belonging.`,
            "Mood patterns, sensitivity, bonding needs, and the feeling of safety or instability may have become central.",
            "This period often reflects the child’s inner world being formed through home, mother, and emotional environment.",
          ],
        };
      case "mars":
        return {
          drivers: "Energy, assertion, conflict response, and early willpower.",
          risk: "caution",
          themes: [
            `${tense.lead} more restlessness, competitiveness, physical energy, or stronger reactions.`,
            "This may have shown up through sports, arguments, impulsiveness, discipline issues, or learning how to express anger.",
            "The child may have been pushed toward courage, self-assertion, or handling friction more directly.",
          ],
        };
      case "rahu":
        return {
          drivers: "Unusual influences, instability, fascination, and a different social or family atmosphere.",
          risk: "mixed",
          themes: [
            `${tense.lead} a sense of unfamiliarity, unusual circumstances, or a more unpredictable environment.`,
            "This may have coincided with unusual schooling, relocation, foreign influence, confusion, or strong fascination with what felt different.",
            "The child may have developed early ambition, insecurity, intensity, or curiosity through non-ordinary circumstances.",
          ],
        };
      case "jupiter":
        return {
          drivers: "Guidance, values, protection, education, and moral shaping.",
          risk: "opportunity",
          themes: [
            `${tense.lead} support through learning, guidance, teachers, family wisdom, or a more protective environment.`,
            "Belief systems, values, education, and the feeling of being guided or encouraged may have deepened.",
            "This phase often helps a child grow through support, meaning, and the presence of wiser influences.",
          ],
        };
      case "saturn":
        return {
          drivers: "Responsibility, pressure, structure, and early maturity.",
          risk: "caution",
          themes: [
            `${tense.lead} heavier duties, stricter structure, emotional restraint, or the need to mature early.`,
            "This may have felt like a more serious chapter shaped by responsibility, limitation, discipline, or distance.",
            "The child may have learned endurance, patience, or caution earlier than usual.",
          ],
        };
      case "mercury":
        return {
          drivers: "Learning, communication, curiosity, school, and skill formation.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger mental activity, learning, questioning, and curiosity.`,
            "Schooling, language, social interaction, skills, and adaptability may have developed quickly here.",
            "This period often reflects a child becoming more observant, expressive, and mentally active.",
          ],
        };
      case "ketu":
        return {
          drivers: "Withdrawal, inner sensitivity, detachment, and quiet karmic shaping.",
          risk: "mixed",
          themes: [
            `${tense.lead} a quieter, more inward, or less easily explainable chapter.`,
            "This may have shown up through separations, unusual inner sensitivity, spiritual tone in the family, or feeling different from peers.",
            "The child may have become more inward, observant, detached, or hard to fully read during this period.",
          ],
        };
      default:
        return {
          drivers: "Early life circumstances and karmic shaping through this Mahadasha.",
          risk: "mixed",
          themes: [
            "This phase likely shaped the child mainly through family environment, emotional tone, and early development.",
            "The effects were more about atmosphere, attachment, learning, and temperament than conscious adult decisions.",
          ],
        };
    }
  }

  if (stage === "teen") {
    switch (p) {
      case "venus":
        return {
          drivers: "Friendships, social belonging, attraction, taste, and emotional validation.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger focus on friendships, likability, attraction, and emotional closeness.`,
            "Aesthetic interests, creativity, self-image, and the need to feel accepted may have increased.",
            "This phase may have shaped relationship patterns and preferences in a visible way.",
          ],
        };
      case "sun":
        return {
          drivers: "Confidence, recognition, individuality, and pressure to prove oneself.",
          risk: "mixed",
          themes: [
            `${tense.lead} stronger identity formation, recognition needs, and comparison with others.`,
            "This may have shown up through academics, performance, competition, leadership roles, or authority conflict.",
            "The pressure to define oneself and be seen more clearly may have intensified.",
          ],
        };
      case "moon":
        return {
          drivers: "Emotional fluctuation, belonging, family influence, and inner life.",
          risk: "mixed",
          themes: [
            `${tense.lead} stronger emotional sensitivity, changing moods, and family-linked responses.`,
            "Belonging, emotional support, insecurity, and private inner struggles may have become more important.",
            "This phase often deepens feeling life, even when it looks quiet from the outside.",
          ],
        };
      case "mars":
        return {
          drivers: "Drive, rebellion, assertion, conflict, competition, and action.",
          risk: "caution",
          themes: [
            `${tense.lead} greater push toward competition, assertion, impulsive choices, or conflict.`,
            "Sports, courage, peer friction, ambition, or strong willpower may have become more visible.",
            "This may have been a phase of testing boundaries and learning how to direct energy constructively.",
          ],
        };
      case "rahu":
        return {
          drivers: "Identity experimentation, unusual interests, pressure, and ambition.",
          risk: "mixed",
          themes: [
            `${tense.lead} a stronger urge to explore what was different, edgy, ambitious, or socially powerful.`,
            "This may have coincided with confusion, reinvention, foreign influence, internet/technology pull, or non-traditional interests.",
            "The phase may have intensified both hunger and uncertainty at the same time.",
          ],
        };
      case "jupiter":
        return {
          drivers: "Education, guidance, belief systems, mentors, and expansion.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger support through teachers, studies, values, mentors, or philosophical growth.`,
            "Education, meaning, future vision, and wiser guidance may have become more important here.",
            "This phase often helps the person grow through broader perspective and better judgment.",
          ],
        };
      case "saturn":
        return {
          drivers: "Pressure, responsibility, seriousness, limits, and maturity.",
          risk: "caution",
          themes: [
            `${tense.lead} heavier pressure, emotional distance, responsibility, or concern about results.`,
            "This may have felt like a more serious chapter with delays, discipline, or having to grow up faster.",
            "It often shapes endurance, realism, and emotional strength through difficulty.",
          ],
        };
      case "mercury":
        return {
          drivers: "Study, communication, adaptability, skills, and networking.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger focus on study, communication, skill-building, and social interaction.`,
            "This phase may have supported exams, writing, speaking, learning systems, or multiple interests at once.",
            "It often makes the mind quicker, more curious, and more socially engaged.",
          ],
        };
      case "ketu":
        return {
          drivers: "Detachment, confusion, subtle insight, and separation from old identity patterns.",
          risk: "mixed",
          themes: [
            `${tense.lead} a quieter or more inward phase where not everything felt explainable.`,
            "This may have included isolation, identity confusion, withdrawal, spiritual interest, or detachment from peer norms.",
            "The person may have felt different, inwardly older, or harder to satisfy in ordinary ways.",
          ],
        };
      default:
        return {
          drivers: "Identity formation and changing priorities through this Mahadasha.",
          risk: "mixed",
          themes: [
            "This phase likely shaped education, confidence, belonging, and the transition toward adulthood.",
            "Its effects were likely visible through emotional growth, pressure, and changing self-definition.",
          ],
        };
    }
  }

  if (stage === "young_adult") {
    switch (p) {
      case "venus":
        return {
          drivers: "Relationships, attraction, quality of life, pleasure, and value-based choices.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger focus on relationships, comfort, attraction, and emotional satisfaction.`,
            "This may have brought important developments in love life, lifestyle choices, home environment, or personal taste.",
            "Money, partnerships, pleasure, and the question of what feels worth keeping may have become important.",
          ],
        };
      case "sun":
        return {
          drivers: "Recognition, visibility, authority, direction, and the urge to lead.",
          risk: "mixed",
          themes: [
            `${tense.lead} stronger pressure to define yourself through direction, recognition, and visible achievement.`,
            "Career decisions, ambition, ego tests, father/authority themes, or stepping into responsibility may have intensified.",
            "This phase often asks the person to own their individuality more clearly.",
          ],
        };
      case "moon":
        return {
          drivers: "Emotional decisions, home, belonging, nourishment, and inner security.",
          risk: "mixed",
          themes: [
            `${tense.lead} stronger focus on emotional stability, family ties, inner needs, or home-related decisions.`,
            "This may have brought changes in living environment, emotional life, attachment, caregiving, or private priorities.",
            "The person may have become more guided by feeling, memory, and emotional safety.",
          ],
        };
      case "mars":
        return {
          drivers: "Action, hustle, risk-taking, pressure, and self-assertion.",
          risk: "caution",
          themes: [
            `${tense.lead} a more effort-heavy and action-driven chapter marked by urgency, conflict, or rapid decisions.`,
            "Career push, competition, physical drive, confrontation, relocation, or survival-based effort may have become stronger.",
            "This phase often rewards courage but punishes impulsiveness.",
          ],
        };
      case "rahu":
        return {
          drivers: "Ambition, reinvention, unconventional growth, foreign links, and breakthrough pressure.",
          risk: "mixed",
          themes: [
            `${tense.lead} unusual turns, bold decisions, outsider paths, or strong hunger for growth and visibility.`,
            "Technology, foreign influence, relocation, reinvention, material ambition, or obsession with scale may have intensified.",
            "This phase often brings both confusion and breakthrough at the same time.",
          ],
        };
      case "jupiter":
        return {
          drivers: "Expansion, guidance, learning, responsibility, and meaningful growth.",
          risk: "opportunity",
          themes: [
            `${tense.lead} supportive growth through learning, wiser choices, relationships, or stable progress.`,
            "Marriage, children, teaching, responsibility, ethics, or long-term guidance may have become more important.",
            "This is often a broadening phase that helps life become more meaningful and better structured.",
          ],
        };
      case "saturn":
        return {
          drivers: "Work, duty, pressure, structure, realism, and long-term building.",
          risk: "caution",
          themes: [
            `${tense.lead} heavier responsibilities, work pressure, delays, or the need to build slowly and seriously.`,
            "Career foundation, endurance, duty, financial pressure, and long-term structure may have become central.",
            "This phase tends to mature a person through effort, restraint, and realism.",
          ],
        };
      case "mercury":
        return {
          drivers: "Learning, trade, communication, business, flexibility, and skills.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger focus on commerce, communication, networking, learning, and adaptability.`,
            "This may have supported business, writing, speaking, training, study, marketing, or multi-track growth.",
            "The person often becomes more mentally agile and opportunity-responsive in this phase.",
          ],
        };
      case "ketu":
        return {
          drivers: "Detachment, endings, inner shifts, reduction, and karmic separation.",
          risk: "mixed",
          themes: [
            `${tense.lead} endings, withdrawals, spiritual shifts, or a sense of being less satisfied by ordinary goals.`,
            "This may have brought detachment from people, roles, ambitions, or identities that no longer fit.",
            "The phase often simplifies life, but not always gently.",
          ],
        };
      default:
        return {
          drivers: "Adult decisions, direction, and karmic redirection through this Mahadasha.",
          risk: "mixed",
          themes: [
            "This phase likely shaped relationships, work, ambition, and identity in practical life.",
            "Its effects were more visible through real-world decisions and consequences.",
          ],
        };
    }
  }

  if (stage === "adult") {
    switch (p) {
      case "venus":
        return {
          drivers: "Relationships, harmony, lifestyle choices, home comfort, and value alignment.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger focus on relationships, family comfort, home quality, and what feels emotionally worthwhile.`,
            "This may have supported partnership growth, lifestyle upgrades, property or home-related choices, and a stronger desire for ease.",
            "The phase often asks whether pleasure, comfort, and loyalty are being handled wisely.",
          ],
        };
      case "sun":
        return {
          drivers: "Authority, recognition, leadership, legacy, and life direction.",
          risk: "mixed",
          themes: [
            `${tense.lead} greater pressure around recognition, position, authority, or stepping into a more visible role.`,
            "Leadership, ego tests, father/authority dynamics, and major directional choices may have become more important.",
            "This phase often asks the person to stand more clearly in their own power.",
          ],
        };
      case "moon":
        return {
          drivers: "Emotional life, family, belonging, caregiving, and internal stability.",
          risk: "mixed",
          themes: [
            `${tense.lead} stronger attention on family, emotional wellbeing, home, caregiving, or private life decisions.`,
            "This may have coincided with inner healing, domestic shifts, stronger attachment themes, or mood-linked decision-making.",
            "The phase tends to make emotional truth harder to ignore.",
          ],
        };
      case "mars":
        return {
          drivers: "Action, pressure, conflict, rebuilding, and forceful change.",
          risk: "caution",
          themes: [
            `${tense.lead} a sharper push toward effort, confrontation, fast decisions, or pressure-heavy action.`,
            "Career battles, property effort, competition, conflict, physical strain, or assertive rebuilding may have become stronger.",
            "This phase often accelerates life, but can also inflame it.",
          ],
        };
      case "rahu":
        return {
          drivers: "Scale, ambition, reinvention, material hunger, foreign influence, and unconventional growth.",
          risk: "mixed",
          themes: [
            `${tense.lead} unusual opportunities, bold turns, larger ambitions, or pressure to grow beyond the familiar.`,
            "This may have brought foreign links, status hunger, technology, reinvention, unstable leaps, or confusing but powerful openings.",
            "Rahu phases often reward boldness, but test clarity.",
          ],
        };
      case "jupiter":
        return {
          drivers: "Wisdom, family meaning, mentoring, ethics, growth, and guidance.",
          risk: "opportunity",
          themes: [
            `${tense.lead} broader growth through wiser decisions, family responsibilities, teaching, or meaningful expansion.`,
            "This may support marriage, children, guidance roles, advisory work, long-term stability, and values-based progress.",
            "The phase often shifts life from chasing more to building meaningfully.",
          ],
        };
      case "saturn":
        return {
          drivers: "Responsibility, karma, endurance, realism, and long-term construction.",
          risk: "caution",
          themes: [
            `${tense.lead} heavier duties, consolidation, fatigue, delays, or pressure to become structurally stronger.`,
            "Career, finances, family duty, health discipline, and long-term commitments may have demanded maturity.",
            "Saturn tends to strip excess and force what is durable.",
          ],
        };
      case "mercury":
        return {
          drivers: "Business, learning, negotiation, skill, mobility, and communication.",
          risk: "opportunity",
          themes: [
            `${tense.lead} stronger movement in business, negotiation, networking, writing, learning, or multi-track planning.`,
            "This phase may support trade, advisory roles, study, communication-led growth, and problem-solving.",
            "Mercury phases often increase movement, information flow, and flexibility.",
          ],
        };
      case "ketu":
        return {
          drivers: "Reduction, spiritual detachment, endings, refinement, and inner truth.",
          risk: "mixed",
          themes: [
            `${tense.lead} a quieter but more karmically sharp phase of release, detachment, or inner redirection.`,
            "People, roles, ambitions, or structures that no longer fit may begin to fall away.",
            "Ketu often reduces outer noise so deeper truth can become visible.",
          ],
        };
      default:
        return {
          drivers: "Major adult life redirection through this Mahadasha.",
          risk: "mixed",
          themes: [
            "This phase likely shaped work, relationships, money, family, and personal priorities in practical ways.",
            "Its meaning is best read through the actual life chapter it activated.",
          ],
        };
    }
  }

  switch (p) {
    case "venus":
      return {
        drivers: "Harmony, relationships, refinement, and emotional value.",
        risk: "opportunity",
        themes: [
          `${tense.lead} more focus on comfort, relationships, and what truly feels valuable.`,
          "This phase may support peace-making, family softness, enjoyment, and emotionally meaningful choices.",
          "It often shifts attention from pressure toward quality, beauty, and connection.",
        ],
      };
    case "sun":
      return {
        drivers: "Identity, authority, legacy, and dignified self-expression.",
        risk: "mixed",
        themes: [
          `${tense.lead} stronger visibility, identity themes, and the need to stand clearly in one’s role.`,
          "Recognition, leadership, authority, and the desire to leave a meaningful mark may deepen.",
          "This phase often asks what kind of presence and legacy the person wants to embody.",
        ],
      };
    case "moon":
      return {
        drivers: "Inner life, emotional truth, belonging, and peace.",
        risk: "mixed",
        themes: [
          `${tense.lead} more emotional processing, family-linked focus, and the need for inner peace.`,
          "Home, emotional nourishment, memory, and personal softness may become more important than speed.",
          "The phase tends to turn life inward before it settles outwardly.",
        ],
      };
    case "mars":
      return {
        drivers: "Action, rebuilding, survival strength, and decisive effort.",
        risk: "caution",
        themes: [
          `${tense.lead} decisive action, pressure, and the need to handle challenges directly.`,
          "This may bring strong will, practical effort, protection themes, or sharper conflict dynamics.",
          "It often tests how wisely force and urgency are handled.",
        ],
      };
    case "rahu":
      return {
        drivers: "Restless expansion, unconventional growth, and karmic acceleration.",
        risk: "mixed",
        themes: [
          `${tense.lead} strong appetite for growth, change, or experiences outside the familiar.`,
          "Unusual opportunities, unstable openings, or powerful reinvention may define the chapter.",
          "The deeper lesson is to separate true growth from compulsion.",
        ],
      };
    case "jupiter":
      return {
        drivers: "Meaning, guidance, faith, wise expansion, and perspective.",
        risk: "opportunity",
        themes: [
          `${tense.lead} broader perspective, meaning, guidance, and more generous growth.`,
          "This often supports counsel, family wisdom, teaching, spirituality, and mature responsibility.",
          "It can be one of the more stabilizing and meaningful life chapters.",
        ],
      };
    case "saturn":
      return {
        drivers: "Responsibility, time, restraint, and durable structure.",
        risk: "caution",
        themes: [
          `${tense.lead} a slower but more serious chapter requiring realism, patience, and structural clarity.`,
          "Duty, health discipline, responsibility, and long-term endurance often become central.",
          "The phase matures the person by reducing what is weak and strengthening what lasts.",
        ],
      };
    case "mercury":
      return {
        drivers: "Mind, communication, adaptability, and intelligent movement.",
        risk: "opportunity",
        themes: [
          `${tense.lead} more movement through communication, learning, adaptability, or problem-solving.`,
          "This may support advice, study, writing, trade, and more flexible ways of living.",
          "Mercury phases often make life busier, mentally sharper, and more interconnected.",
        ],
      };
    case "ketu":
      return {
        drivers: "Release, spiritual thinning, inner truth, and karmic closure.",
        risk: "mixed",
        themes: [
          `${tense.lead} simplification, release, inner searching, or detachment from what no longer fits.`,
          "This can be a spiritually meaningful phase, though not always a comfortable one.",
          "The outer world may reduce so inner truth becomes harder to avoid.",
        ],
      };
    default:
      return {
        drivers: "A karmic life chapter shaped by this Mahadasha lord.",
        risk: "mixed",
        themes: [
          "This phase likely changed priorities in a visible way.",
          "Its meaning is best understood through the life stage and the type of decisions or events it brought.",
        ],
      };
  }
}

/* ----------------- main builder ----------------- */

/**
 * Turn Vimshottari Mahadasha rows into story-style milestones
 * that Tab 3 can display as “Life story by Dasha”.
 */
function findPlanetHouse(
  planets: Array<{ name?: string; house?: number | null; sign?: string }> | undefined,
  planet: string
): number | null {
  if (!Array.isArray(planets)) return null;
  const row = planets.find(
    (p) => String(p?.name ?? "").toLowerCase() === String(planet ?? "").toLowerCase()
  );
  return typeof row?.house === "number" ? row.house : null;
}
function likelyEventsByHouse(
  house: number | null,
  stage: "childhood" | "teen" | "young_adult" | "adult" | "mature" | "later",
  status: "past" | "current" | "future"
): string[] {
  const lead =
    status === "past"
      ? "This phase may have brought"
      : status === "current"
      ? "This phase may be bringing"
      : "This phase is likely to bring";

  if (stage === "childhood") {
    switch (house) {
      case 4:
        return [
          `${lead} changes in the family environment, home atmosphere, or caregiving dynamics.`,
          "This may have reflected parental decisions around home, relocation, stability, or emotional security.",
          "The child likely experienced this more through family circumstances than through personal choice.",
        ];
      case 5:
        return [
          `${lead} stronger development through learning, play, creativity, and early self-expression.`,
          "This may have shown up through school life, hobbies, attention needs, or encouragement of talent.",
          "The effects were likely visible through confidence, creativity, and emotional responsiveness.",
        ];
      case 9:
        return [
          `${lead} shifts in belief, guidance, schooling, or the influence of father/guru figures in the child’s world.`,
          "This may have reflected family travel, educational direction, religious influence, or widening exposure through the environment.",
          "The child likely absorbed this through the worldview around them rather than independent decisions.",
        ];
      case 12:
        return [
          `${lead} distance, withdrawal, unusual surroundings, or a more inward emotional chapter.`,
          "This may have reflected separation, foreign environment, changing emotional security, or quieter development.",
          "The child may have experienced this as feeling different, less settled, or more inward than usual.",
        ];
      default:
        return [
          `${lead} noticeable changes in the child’s environment, development, or emotional atmosphere.`,
          "This was more likely to show through family conditions, schooling, caregiving, and temperament than through adult-style events.",
          "The chapter shaped the child mainly through surroundings, support, and emotional experience.",
        ];
    }
  }

  if (stage === "teen") {
    switch (house) {
      case 3:
        return [
          `${lead} stronger focus on study, effort, communication, courage, or sibling-related developments.`,
          "This may have shown up through exams, skill-building, writing, speaking, short travel, or increased self-driven effort.",
          "The phase likely pushed growth through initiative rather than comfort.",
        ];
      case 4:
        return [
          `${lead} emotional shifts around home, family, schooling, or inner security.`,
          "This may have reflected home changes, family pressure, academic environment, or stronger need for emotional grounding.",
          "Private life and inner stability may have mattered more than was visible from outside.",
        ];
      case 5:
        return [
          `${lead} developments around education, self-expression, attraction, confidence, or creative identity.`,
          "This may have shown up through school achievement, romantic stirrings, performance pressure, or creative interests.",
          "The phase likely shaped self-worth through recognition, comparison, and expression.",
        ];
      case 9:
        return [
          `${lead} expansion through studies, mentors, belief systems, travel, or changing life direction.`,
          "This may have reflected educational ambition, philosophical questioning, father/guru influence, or broadening exposure.",
          "The person may have begun wanting a bigger life beyond the immediate environment.",
        ];
      case 12:
        return [
          `${lead} withdrawal, emotional distance, identity confusion, solitude, or a feeling of being inwardly different.`,
          "This may have coincided with private struggles, foreign exposure, isolation, spiritual searching, or increased inner life.",
          "The phase may have felt harder to explain outwardly than to experience inwardly.",
        ];
      default:
        return [
          `${lead} meaningful shifts in education, confidence, emotional life, or social identity.`,
          "This phase likely shaped the person through school, family expectations, peer dynamics, and changing self-definition.",
          "Its effects were more about identity formation than adult responsibility.",
        ];
    }
  }

  switch (house) {
    case 1:
      return [
        `${lead} a strong personal reset, identity shift, or change in how the person presents themselves.`,
        "Health, confidence, self-direction, and major personal decisions may have taken centre stage.",
        "This can coincide with reinvention, image change, or a new phase of self-definition.",
      ];
    case 2:
      return [
        `${lead} stronger focus on family responsibilities, money management, savings, or speech-related issues.`,
        "This can coincide with changes in income, family priorities, or financial pressure/opportunity.",
        "Questions around values, stability, and what must be protected may have become important.",
      ];
    case 3:
      return [
        `${lead} frequent effort, short travel, communication demands, skill-building, or sibling-related themes.`,
        "This can show up as hustle, self-made effort, content/work communication, or new practical skills.",
        "Initiative and courage often matter more than comfort in this phase.",
      ];
    case 4:
      return [
        `${lead} home changes, relocation, family focus, property matters, or emotional restructuring.`,
        "This can coincide with a house move, renovation, settling down, or stronger concern for mother/home peace.",
        "Private life and inner security usually become more important here.",
      ];
    case 5:
      return [
        `${lead} education, romance, children, creativity, speculation, or personal expression themes.`,
        "This may coincide with studies, a love story, childbirth, creative work, or decisions taken from the heart.",
        "The need to create, guide, or express oneself becomes stronger in this phase.",
      ];
    case 6:
      return [
        `${lead} heavier work routines, job pressure, service roles, health management, or disputes.`,
        "This can coincide with job change, workload increase, office politics, litigation, or the need to fix practical problems.",
        "Life often becomes more effort-based and discipline-dependent here.",
      ];
    case 7:
      return [
        `${lead} major relationship, marriage, partnership, contract, or public-facing developments.`,
        "This can coincide with marriage, a serious relationship, business partnership, separation, or negotiation-heavy periods.",
        "Other people and one-to-one dynamics become central to progress in this phase.",
      ];
    case 8:
      return [
        `${lead} sudden change, emotional upheaval, shared-finance pressure, or deep internal transformation.`,
        "This may coincide with crises, inheritance/shared money matters, psychological shifts, or major endings and resets.",
        "Life tends to become less predictable but more transformative here.",
      ];
    case 9:
      return [
        `${lead} long-distance travel, higher learning, father/guru themes, foreign links, or belief-system shifts.`,
        "This can coincide with foreign travel, country change, advanced study, spiritual search, or a major widening of worldview.",
        "Meaning, faith, guidance, and expansion beyond the familiar often define this phase.",
      ];
    case 10:
      return [
        `${lead} career redefinition, role change, leadership pressure, visibility, or reputation-linked decisions.`,
        "This can coincide with promotion, career shift, job change, business expansion, responsibility increase, or public recognition.",
        "Work direction and social standing often become the main real-world story here.",
      ];
    case 11:
      return [
        `${lead} gains, networking, group support, business scaling, income growth, or shifting social circles.`,
        "This can coincide with stronger professional networks, audience growth, friendships, and practical gains from effort.",
        "Ambitions often become more materially visible in this phase.",
      ];
    case 12:
      return [
        `${lead} foreign residence, distance, withdrawal, expenses, endings, healing, or spiritual retreat.`,
        "This can coincide with country change, living away from one’s base, increased spending, solitude, or inner reset.",
        "The phase often reduces noise in one area while opening a more private or foreign-linked chapter.",
      ];
    default:
      return [
        `${lead} real-life changes around work, relationships, family, or direction.`,
        "The chapter likely changed priorities in a visible way, even if the exact area depends on the full chart.",
      ];
  }
}
function findPlanetRow(
  planets:
    | Array<{ name?: string; house?: number | null; sign?: string; nakshatra?: string }>
    | undefined,
  planet: string
) {
  if (!Array.isArray(planets)) return null;
  return (
    planets.find(
      (p) => String(p?.name ?? "").toLowerCase() === String(planet ?? "").toLowerCase()
    ) ?? null
  );
}

function conjunctionNames(
  planets:
    | Array<{ name?: string; house?: number | null; sign?: string; nakshatra?: string }>
    | undefined,
  planet: string
): string[] {
  const row = findPlanetRow(planets, planet);
  if (!row || typeof row.house !== "number") return [];
  return (planets ?? [])
    .filter(
      (p) =>
        String(p?.name ?? "").toLowerCase() !== String(planet ?? "").toLowerCase() &&
        typeof p?.house === "number" &&
        p.house === row.house
    )
    .map((p) => String(p?.name ?? "").trim())
    .filter(Boolean);
}

function aspectNames(
  aspects:
    | Array<{ from?: string; to?: string; type?: string; houseDiff?: number }>
    | undefined,
  planet: string
): string[] {
  if (!Array.isArray(aspects)) return [];
  const lower = String(planet ?? "").toLowerCase();

  const names = new Set<string>();

  for (const a of aspects) {
    const from = String(a?.from ?? "").toLowerCase();
    const to = String(a?.to ?? "").toLowerCase();

    if (from === lower && to) names.add(String(a?.to ?? ""));
    if (to === lower && from) names.add(String(a?.from ?? ""));
  }

  return Array.from(names).filter(Boolean);
}

function nakshatraTone(nakshatra: string | null | undefined): string {
  const n = String(nakshatra ?? "").toLowerCase();

  if (!n) return "";

  if (["rohini", "bharani", "purva phalguni", "purva ashadha"].includes(n)) {
    return "The tone of this phase is tied to growth through desire, comfort, attraction, and visible creation.";
  }

  if (["mula", "jyeshtha", "ashlesha", "magha"].includes(n)) {
    return "The tone of this phase is more intense, karmic, and transformative, often forcing deeper shifts beneath visible events.";
  }

  if (["pushya", "anuradha", "uttara phalguni", "uttara ashadha"].includes(n)) {
    return "This phase tends to reward responsibility, steadiness, loyalty, and growth through mature commitment.";
  }

  if (["ardra", "swati", "shatabhisha"].includes(n)) {
    return "This phase often brings change, movement, experimentation, and a less conventional life direction.";
  }

  if (["revati", "punarvasu", "hasta"].includes(n)) {
    return "The tone here is adaptive and restorative, often helping life reorganize through learning, adjustment, and practical intelligence.";
  }

  return "The nakshatra tone adds a subtler karmic flavor to how this Mahadasha expresses itself.";
}

function adRefinement(
  currentMD: string,
  currentAD: string,
  mdPlanet: string
): string {
  if (!currentMD || !currentAD) return "";
  if (currentMD.toLowerCase() !== mdPlanet.toLowerCase()) return "";

  return `Because the current sub-phase is ${currentAD}, the Mahadasha story is presently being filtered through ${currentAD}-type priorities and decisions.`;
}
function houseRefinementLine(
  planet: string,
  house: number | null,
  sign?: string | null
): string {
  const p = String(planet ?? "").trim();
  const s = String(sign ?? "").trim();

  switch (house) {
    case 1:
      return `${p} in the 1st house${s ? ` in ${s}` : ""} makes this a strongly personal chapter, often marked by identity shifts, self-reinvention, health focus, or a new way of carrying yourself through life.`;

    case 2:
      return `${p} in the 2nd house${s ? ` in ${s}` : ""} ties this phase to family responsibilities, money patterns, savings, speech, and the question of what must be protected or stabilized.`;

    case 3:
      return `${p} in the 3rd house${s ? ` in ${s}` : ""} makes this a chapter of effort, communication, self-made progress, short travel, skill-building, and learning to push life forward through initiative.`;

    case 4:
      return `${p} in the 4th house${s ? ` in ${s}` : ""} roots this phase in home, family, emotional security, property, and the deeper need to feel settled from within as well as outside.`;

    case 5:
      return `${p} in the 5th house${s ? ` in ${s}` : ""} makes this chapter more expressive and personal, often linking it to education, creativity, confidence, love, children, or decisions taken from the heart.`;

    case 6:
      return `${p} in the 6th house${s ? ` in ${s}` : ""} gives this phase a practical and effort-heavy tone, often showing through work pressure, service, competition, health management, or the need to solve real-life problems.`;

    case 7:
      return `${p} in the 7th house${s ? ` in ${s}` : ""} makes relationships, marriage, partnerships, negotiation, and one-to-one dynamics central to how this chapter unfolds.`;

    case 8:
      return `${p} in the 8th house${s ? ` in ${s}` : ""} gives this phase a more intense and transformative quality, often bringing deeper change, emotional upheaval, shared-finance themes, or powerful inner resets.`;

    case 9:
      return `${p} in the 9th house${s ? ` in ${s}` : ""} pushes this chapter toward travel, foreign links, higher learning, father/guru themes, belief shifts, and expansion beyond the familiar world.`;

    case 10:
      return `${p} in the 10th house${s ? ` in ${s}` : ""} makes career, recognition, authority, role changes, and public direction the main real-world story of this period.`;

    case 11:
      return `${p} in the 11th house${s ? ` in ${s}` : ""} ties this phase to gains, networks, support systems, business scaling, ambitions, and the material results of sustained effort.`;

    case 12:
      return `${p} in the 12th house${s ? ` in ${s}` : ""} gives this phase a more distant or inward tone, often linking it with foreign residence, withdrawal, endings, expenses, healing, or spiritual deepening.`;

    default:
      return `${p}${s ? ` in ${s}` : ""} makes this chapter more concrete in a specific area of life, even if the full expression depends on the rest of the chart.`;
  }
}
export function buildLifeMilestonesFromMD(
  mdRows: MdRow[],
  birthDateISO: string,
  context?: {
    planets?: Array<{
      name?: string;
      house?: number | null;
      sign?: string;
      nakshatra?: string;
    }>;
    aspects?: Array<{
      from?: string;
      to?: string;
      type?: string;
      houseDiff?: number;
    }>;
    activePeriods?: any;
    todayISO?: string;
  }
): LifeMilestone[] {
  if (!Array.isArray(mdRows) || mdRows.length === 0) return [];

  return mdRows.map((row) => {
  const planet = row.planet || "";
  const approx = approxAgeRange(row.startISO, row.endISO, birthDateISO);
  const ageMid = midAge(row.startISO, row.endISO, birthDateISO);
  const stage = lifeStageForAge(ageMid);
  const status = phaseStatus(row.startISO, row.endISO, context?.todayISO);

  const { drivers, themes, risk } = planetProfile(planet, stage, status);

  const planetRow = findPlanetRow(context?.planets, planet);
  const house = typeof planetRow?.house === "number" ? planetRow.house : null;
  const sign = String(planetRow?.sign ?? "").trim();
  const nak = String(planetRow?.nakshatra ?? "").trim();

  const eventLines = likelyEventsByHouse(house, stage, status);
  const conj = conjunctionNames(context?.planets, planet);
  const asp = aspectNames(context?.aspects, planet);

  const currentMD = String(context?.activePeriods?.mahadasha?.lord ?? "");
  const currentAD = String(context?.activePeriods?.antardasha?.subLord ?? "");

  const refinementBits: string[] = [];

 if (house) {
  refinementBits.push(houseRefinementLine(planet, house, sign));
}

  if (nak) {
    refinementBits.push(nakshatraTone(nak));
  }

  if (conj.length > 0) {
    refinementBits.push(
      `${planet} is closely tied to ${conj.join(", ")}, so this phase is colored by those planets too.`
    );
  } else if (asp.length > 0) {
    refinementBits.push(
      `${planet} is strongly connected with ${asp.slice(0, 2).join(", ")}, which modifies how the phase unfolds.`
    );
  }

  const adLine = adRefinement(currentMD, currentAD, planet);

  const label = `${planet} Mahadasha`;

  return {
    label,
    approxAgeRange: approx,
    periodStart: row.startISO,
    periodEnd: row.endISO,
    drivers,
    themes: [
      ...eventLines.slice(0, 2),
      refinementBits[0] ?? themes[themes.length - 1] ?? themes[0] ?? "",
      refinementBits[1] ?? adLine ?? "",
    ].filter(Boolean).slice(0, 4),
    risk,
  };
});
}
