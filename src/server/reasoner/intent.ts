export type Intent =
  | "timing"
  | "career"
  | "relationship"
  | "health"
  | "remedy"
  | "learning"
  | "relationship_timing"  // e.g., "when will I get married"
  | "purchase"             // e.g., "when should I buy a car/house"
  | "general";

export function classifyIntent(message: string): Intent {
  const q = (message || "").toLowerCase();

  // Specific combos
  if (/(when|good time|auspicio).*(marri|wed|spouse|partner)/.test(q) || /(marri|wed).*(when|good time)/.test(q)) {
    return "relationship_timing";
  }
  if (/(when|good time|buy|purchase|muhurta).*(car|vehicle|house|home|property)/.test(q)) {
    return "purchase";
  }

  // Generic buckets
  if (/\bwhen\b|\bgood time\b|\bgood day\b|\bstart\b|\blaunch\b|\bmeeting\b/.test(q)) return "timing";
  if (/\bjob\b|\boffer\b|\bcareer\b|\bpromotion\b|\bsalary\b|\bwork\b/.test(q)) return "career";
  if (/\bmarriage\b|\bpartner\b|\bspouse\b|\brelationship\b|\bfriends?\b|\bfamily\b/.test(q)) return "relationship";
  if (/\bhealth\b|\benergy\b|\broutine\b|\bworkout\b|\bsleep\b|\bstress\b/.test(q)) return "health";
  if (/\bremed(y|ies)\b|\bmantra\b|\bchant\b|\bfast\b|\bgem(s|stone)\b|\bpuja\b/.test(q)) return "remedy";
  if (/\bstudy\b|\blearn\b|\bexam\b|\bwrite\b|\bwriting\b|\bcommunication\b|\bpresentation\b/.test(q)) return "learning";

  return "general";
}
