// src/server/astro/lifePatternEngine.ts

function describeMahadasha(md: string) {
  const p = String(md ?? "").toLowerCase()

  if (p === "rahu")
    return "This life phase encourages exploration, expansion, and stepping beyond familiar territory."

  if (p === "saturn")
    return "This period emphasizes responsibility, discipline, and long-term structure."

  if (p === "jupiter")
    return "This phase focuses on learning, growth, and expanding opportunities."

  if (p === "venus")
    return "Themes of relationships, comfort, and creative expression become more prominent."

  return "Your current life chapter emphasizes gradual development and new experiences."
}

export function buildLifePatternMap(report: any) {
  const md = report?.activePeriods?.mahadasha?.lord ?? ""

  return {
    lifeChapter: describeMahadasha(md),
    saturnCycle:
      "Saturn cycles tend to bring periods where responsibility and long-term structure become important.",
    rahuCycle:
      "Rahu cycles often coincide with phases when life direction shifts or new ambitions appear.",
  }
}