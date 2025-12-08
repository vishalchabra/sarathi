export function remediesFor(topic: string, dashaLabel?: string): string[] {
  const list: string[] = [
    "Weekly: light sesame lamp Saturdays; 11 Rahu beeja mantras (ॐ भ्रां भीं भ्रूं सः राहवे नमः).",
    "Practical: prune distractions; set 2 weekly ‘deep work’ blocks; review network pledge list.",
    "Weekly: offer white sweets on Tuesdays; short mindfulness practice (10 min/day).",
    "Practical: keep a decision log; avoid reactive switches for 48 hours after new info.",
  ];

  if (topic === "job") {
    list.unshift("Career: refresh CV + portfolio; 5 warm intros/week; track outcomes.");
    if (dashaLabel && /Rahu.*Ketu|Ketu.*Rahu/i.test(dashaLabel)) {
      list.push("Rahu/Ketu axis: avoid gambles; emphasize consistency over volume.");
    }
  }
  return list;
}
