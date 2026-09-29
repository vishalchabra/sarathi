
import type { LifeArea } from "../astrology-engine/types";

export const DAILY_REMEDY_AREA_MAP: Record<
  LifeArea,
  string[]
> = {
  career: ["career"],
  money: ["money"],
  relationships: ["relationships"],
  health: ["health"],
  mind: ["health", "family"],
  family: ["family"],
  home: ["family"],
  children: ["family", "education"],
  travel: ["career", "education"],
  spirituality: ["family"],
  education: ["education"],
  publicImage: ["career"],
  hiddenMatters: ["money", "relationships"],
  communication: ["education", "career"],
  property: ["family", "money"],
};