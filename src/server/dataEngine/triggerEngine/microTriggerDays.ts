type MicroTriggerDay = {
  dateISO: string;
  house: number | null;
  sign: string | null;
  nakshatra: string | null;
  strength: number;
  title: string;
  reasons: string[];
};

const CAREER_TRIGGER_HOUSES = [1, 7, 10, 6, 4];

function scoreMoonHouse(house: number | null) {
  if (!house) return 0;
  if (house === 10) return 90;
  if (house === 1) return 80;
  if (house === 7) return 75;
  if (house === 6) return 70;
  if (house === 4) return 65;
  return 0;
}

export function buildMicroTriggerDays(params: {
  moonTransits: any[];
  area?: "career";
}): MicroTriggerDay[] {
  const { moonTransits } = params;

  return (moonTransits ?? [])
    .map((m: any) => {
      const house =
        m.houseFromLagna ??
        m.house ??
        m.transitHouse ??
        null;

      const strength = scoreMoonHouse(house);

      const reasons: string[] = [];

      if (house === 10) reasons.push("Moon activates the 10th house of career.");
      if (house === 1) reasons.push("Moon activates Lagna, creating personal decision energy.");
      if (house === 7) reasons.push("Moon activates the 7th house, bringing meetings, discussions or external triggers.");
      if (house === 6) reasons.push("Moon activates the 6th house of work, service, pressure and competition.");
      if (house === 4) reasons.push("Moon activates the 4th house, increasing inner dissatisfaction or comfort-related decisions.");

      return {
        dateISO: m.dateISO ?? m.date ?? "",
        house,
        sign: m.sign ?? null,
        nakshatra: m.nakshatra ?? null,
        strength,
        title:
          strength >= 85
            ? "Peak career trigger day"
            : strength >= 75
            ? "Strong career decision day"
            : strength >= 65
            ? "Moderate career trigger day"
            : "Mild trigger day",
        reasons,
      };
    })
    .filter((d) => d.dateISO && CAREER_TRIGGER_HOUSES.includes(d.house ?? 0))
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5);
}