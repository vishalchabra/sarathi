export type EventArea =
  | "career"
  | "money"
  | "health"
  | "relationship"
  | "property"
  | "travel"
  | "education"
  | "spiritual";

export type TriggerKind =
  | "dasha"
  | "transit_house"
  | "transit_aspect"
  | "degree_hit"
  | "moon_trigger"
  | "nakshatra_link";

export type TriggerTone =
  | "opportunity"
  | "pressure"
  | "action"
  | "disruption"
  | "support"
  | "risk";

export type TriggerFact = {
  id: string;
  area: EventArea;
  kind: TriggerKind;
  planet: string;
  target?: string;
  house?: number;
  strength: number; // 0 to 100
  priority?: "primary" | "secondary";
  tone: TriggerTone;
  title: string;
  explanation: string;
  strengthContext?: {
  shadbalaStatus: string;
  afflictionLevel: string;
  reasons: string[];
  note: string;
};
};

export type TriggerScore = {
  area: EventArea;
  score: number;
  level: "low" | "medium" | "high" | "very_high";
  facts: TriggerFact[];
};

export type TriggerWindow = {
  area: EventArea;
  startDate: string;
  endDate: string;
  score: number;
  level: "low" | "medium" | "high" | "very_high";
  title: string;
  reasons: string[];
};