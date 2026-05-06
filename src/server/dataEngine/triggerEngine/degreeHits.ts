type DegreeHit = {
  transitPlanet: string;
  natalPlanet: string;
  distance: number;
  exact: boolean;
  strength: number;
};

function angularDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export function computeDegreeHits(params: {
  transitPlanets: any[];
  natalPlanets: any[];
  orb?: number;
}): DegreeHit[] {
  const { transitPlanets, natalPlanets, orb = 3 } = params;

  const hits: DegreeHit[] = [];

  for (const t of transitPlanets) {
    for (const n of natalPlanets) {
      if (!t?.lon || !n?.lon) continue;

      const distance = angularDistance(t.lon, n.lon);

      if (distance <= orb) {
        const exact = distance < 0.5;

        let strength = 70;

        if (exact) strength = 95;
        else if (distance < 1) strength = 90;
        else if (distance < 2) strength = 80;

        hits.push({
          transitPlanet: t.planet,
          natalPlanet: n.planet,
          distance,
          exact,
          strength,
        });
      }
    }
  }

  return hits.sort((a, b) => b.strength - a.strength);
}