// FILE: src/server/qa/intent.ts

export type Intent =
  | "vehicle"
  | "property"
  | "job"
  | "wealth"
  | "health"
  | "relationships"
  | "marriage"
  | "disputes"
  | "is_today_good"
  | "date_muhurta"
  | "color_today"
  | "ekadashi_next"
  | "festival_when"
  | "generic_web";

export function detectIntent(q: string): Intent {
  const s = (q || "").toLowerCase().trim();

  // Quick exits for utilities
  if (/\b(is\s*today\s*good|good\s*day|today\s*auspicious)\b/.test(s)) return "is_today_good";
  if (/\b(color|colour).*(today|wear|lucky)|\b(lucky\s*color)\b/.test(s)) return "color_today";
  if (/\bekadashi\b/.test(s)) return "ekadashi_next";
  if (/\b(muhurta|muhurat|date\s*(to|for)\s*(meet|start|sign|marry|wedding))\b/.test(s)) return "date_muhurta";
  if (looksFestivalQuestion(s)) return "festival_when";

  // Topic routing (order matters!)
  // Vehicle
  if (/(car|vehicle|bike|scooter|automobile|buy.*(car|vehicle|bike)|delivery|registration)/.test(s)) {
    return "vehicle";
  }
  // Property / Real estate
  if (/(property|flat|apartment|house|home|land|plot|real ?estate|rent|lease|mortgage|possession|registration|handover)/.test(s)) {
    return "property";
  }
  // Job / Career
  if (/(job|career|offer|interview|promotion|raise|hike|switch|change role|join|resign|layoff|hiring|notice period|onsite)/.test(s)) {
    return "job";
  }
  // Wealth / Investing
  if (/(wealth|invest|investment|stock|share|mutual fund|sip|dca|portfolio|money|crypto|gold|etf|options)/.test(s)) {
    return "wealth";
  }
  // Health & fitness
  if (/(health|diet|sleep|workout|exercise|recovery|injury|stress|therapy|doctor|surgery|operation)/.test(s)) {
    return "health";
  }
  // Marriage (must come BEFORE relationships so it isn't swallowed)
  if (/(marry|married|marriage|wed|wedding|engagement|fiance|fiancé|fiancée|shaadi|vivah|when\s+will\s+i\s+get\s+married)/.test(s)) {
    return "marriage";
  }
  // Relationships (general)
  if (/(relationship|dating|date|girlfriend|boyfriend|partner|spouse|love|reconcile|break ?up)/.test(s)) {
    return "relationships";
  }
  // Disputes / legal
  if (/(dispute|legal|lawsuit|case|court|settle|mediation|complaint|penalty|fine|notice|summons)/.test(s)) {
    return "disputes";
  }

  // Fallback
  return "generic_web";
}

function looksFestivalQuestion(q: string) {
  return /\b(diwali|deepavali|holi|navratri|dussehra|vijayadashami|durga puja|onam|pongal|makar sankranti|lohri|raksha bandhan|janmashtami|ram navami|ganesh chaturthi|mahashivratri|karva chauth|gurpurab|baisakhi|eid(?:\s+al(?:[- ]fitr|[- ]adha)?)?|christmas|easter|hanukkah|purim|vesak|buddha purnima)\b/i.test(
    q
  );
}
