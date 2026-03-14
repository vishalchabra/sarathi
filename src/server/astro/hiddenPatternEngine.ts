// src/server/astro/hiddenPatternEngine.ts

type Planet = {
  name: string
  house?: number
}

function getPlanet(planets: Planet[], name: string) {
  return planets.find(
    (p) => String(p?.name ?? "").toLowerCase() === name.toLowerCase()
  )
}

export function buildHiddenPattern(report: any) {
  const planets: Planet[] = report?.planets ?? [];

  const moon = getPlanet(planets, "Moon");
  const saturn = getPlanet(planets, "Saturn");
  const mars = getPlanet(planets, "Mars");

  if (saturn && moon)
    return "A hidden pattern in your life is that the more aware you are of what is unstable, the more likely you are to take responsibility for fixing it. Over time, this can make you the steady one in situations where others stay less affected — but it can also make you carry burdens that were never fully yours.";

  if (saturn && mars)
    return "A hidden pattern in your life is that pressure often activates effort very quickly. You may become the one who acts, fixes, or manages when life becomes demanding, but this can also create cycles of carrying too much for too long.";

  return "A hidden pattern in your life is learning where responsibility is truly yours, and where your strength has been quietly absorbing more than it should.";
}