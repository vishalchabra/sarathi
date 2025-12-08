type Ctx = {
  message: string;
  profile: any;
  facts: any;
};
import { classifyIntent } from "@/server/reasoner/intent";

export async function retrieve(ctx: any) {
  // keep your existing logic; safe default:
  const intent = classifyIntent(ctx.message);
  return []; // or your actual retrieved chunks
}
  // Simple heuristic seeding based on hits
  const hasMercReturn = ctx.facts.hits?.some((h: any) => h.target.includes("Natal Mercury"));
  if (hasMercReturn) {
    chunks.push({
      id: "rule-mercury-return",
      title: "Mercury Return",
      text:
        "Mercury returning to its natal degree refreshes themes of learning, writing, communication, short trips, and skills. Favor study, documentation, negotiations. Avoid overthinking.",
    });
  }

  // Panchang-based
  if (ctx.facts.panchang?.tithi?.name) {
    chunks.push({
      id: "rule-tithi",
      title: `Tithi: ${ctx.facts.panchang.tithi.name}`,
      text:
        "Use the Tithi’s quality to time efforts; harmonious tithis aid beginnings; challenging ones suit maintenance and inner work.",
    });
  }

  return chunks;
}
