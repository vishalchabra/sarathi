export const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", theme: "Quick, pioneering, healer, spontaneous action." },
  { name: "Bharani", lord: "Venus", theme: "Transformation, endurance, creative bearing of burdens." },
  { name: "Krittika", lord: "Sun", theme: "Sharp, cleansing, decisive, fiery determination." },
  { name: "Rohini", lord: "Moon", theme: "Beauty, fertility, charm, artistic expression." },
  { name: "Mrigashira", lord: "Mars", theme: "Curious seeker, gentle yet restless mind." },
  { name: "Ardra", lord: "Rahu", theme: "Storms → renewal; healing through catharsis." },
  { name: "Punarvasu", lord: "Jupiter", theme: "Return to light, resilience, nurturing grace." },
  { name: "Pushya", lord: "Saturn", theme: "Nourishing duty, discipline, spiritual maturity." },
  { name: "Ashlesha", lord: "Mercury", theme: "Penetrating insight, binding, occult wisdom." },
  { name: "Magha", lord: "Ketu", theme: "Ancestral pride, throne, dignified leadership." },
  { name: "Purva Phalguni", lord: "Venus", theme: "Attraction, pleasure, leisure, creativity." },
  { name: "Uttara Phalguni", lord: "Sun", theme: "Contracts, responsibility, noble service." },
  { name: "Hasta", lord: "Moon", theme: "Skill of the hands, charm, persuasive craft." },
  { name: "Chitra", lord: "Mars", theme: "Design brilliance, charisma, aesthetic vision." },
  { name: "Swati", lord: "Rahu", theme: "Freedom, independence, movement, adaptability." },
  { name: "Vishakha", lord: "Jupiter", theme: "Ambition, dual paths, perseverance to goals." },
  { name: "Anuradha", lord: "Saturn", theme: "Loyalty, devotion, spiritual friendship." },
  { name: "Jyeshtha", lord: "Mercury", theme: "Elder authority, responsibility, inner strength." },
  { name: "Mula", lord: "Ketu", theme: "Root truth, deconstruction of illusion, intense seeking." },
  { name: "Purva Ashadha", lord: "Venus", theme: "Victory, enthusiasm, social warmth." },
  { name: "Uttara Ashadha", lord: "Sun", theme: "Unyielding truth, dignified leadership." },
  { name: "Shravana", lord: "Moon", theme: "Listening, learning, wisdom from stories." },
  { name: "Dhanishta", lord: "Mars", theme: "Rhythm, music, generosity, prosperity." },
  { name: "Shatabhisha", lord: "Rahu", theme: "Healing, mysticism, strong individuality." },
  { name: "Purva Bhadrapada", lord: "Jupiter", theme: "Fiery vision, tapas, transformation." },
  { name: "Uttara Bhadrapada", lord: "Saturn", theme: "Stable depth, patience, hidden strength." },
  { name: "Revati", lord: "Mercury", theme: "Compassion, protection, safe journey." },
];

export const PLANET_NAMES: Record<number, string> = {
  0: "Sun", 1: "Moon", 2: "Mercury", 3: "Venus", 4: "Mars",
  5: "Jupiter", 6: "Saturn", 7: "Rahu", [-1]: "Ketu",
};

export function getNakshatra(degree: number) {
  const seg = 13.3333333333; // 13°20′
  const idx = Math.floor((((degree % 360) + 360) % 360) / seg) % 27;
  return NAKSHATRAS[idx];
}
export const SUN_IN_NAKSHATRA: Record<string, string> = {
  Ashwini: "Sun here gives pioneering leadership, quick decisions, healing power.",
  Bharani: "Sun here faces responsibility and transformation themes, endurance in authority.",
  // … fill all 27 gradually
};