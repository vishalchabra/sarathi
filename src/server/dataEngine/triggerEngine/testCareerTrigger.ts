import type { TriggerFact } from "./types";
import { scoreAllTriggerAreas } from "./scoring";
import { buildTriggerWindow } from "./windows";

const facts: TriggerFact[] = [
  {
    id: "rahu-md",
    area: "career",
    kind: "dasha",
    planet: "Rahu",
    house: 9,
    strength: 85,
    tone: "disruption",
    title: "Rahu Mahadasha active",
    explanation:
      "Rahu Mahadasha supports directional change, foreign-linked growth, restlessness and career reorientation.",
  },
  {
    id: "venus-ad-pd",
    area: "career",
    kind: "dasha",
    planet: "Venus",
    house: 4,
    strength: 80,
    tone: "support",
    title: "Venus Antardasha/Pratyantar active",
    explanation:
      "Venus is the active sub-period lord, so its transit into the 10th house becomes highly relevant for career movement.",
  },
  {
    id: "jupiter-10th",
    area: "career",
    kind: "transit_house",
    planet: "Jupiter",
    house: 10,
    strength: 90,
    tone: "opportunity",
    title: "Jupiter transiting 10th house",
    explanation:
      "Jupiter in the 10th house increases visibility, opportunity, recognition and career expansion.",
  },
  {
    id: "mars-aspect-10th",
    area: "career",
    kind: "transit_aspect",
    planet: "Mars",
    target: "10th house",
    strength: 70,
    tone: "action",
    title: "Mars aspecting 10th house",
    explanation:
      "Mars influence on the 10th house creates action, urgency, meetings and decision-making energy.",
  },
  {
    id: "saturn-pressure",
    area: "career",
    kind: "transit_aspect",
    planet: "Saturn",
    target: "10th house",
    strength: 65,
    tone: "pressure",
    title: "Saturn influencing career axis",
    explanation:
      "Saturn adds pressure, realism and responsibility, making career matters feel serious.",
  },
];

const scores = scoreAllTriggerAreas(facts);
const career = scores.find((s) => s.area === "career");

if (career) {
  console.log("CAREER_SCORE", career);

  const window = buildTriggerWindow({
    areaScore: career,
    startDate: "2026-05-14",
    endDate: "2026-06-02",
  });

  console.log("CAREER_WINDOW", window);
}