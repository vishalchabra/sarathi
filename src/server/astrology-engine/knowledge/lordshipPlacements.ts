import type { LifeArea } from "../types";

export type LordshipPlacementKnowledge = {
  lordshipHouse: number;
  placementHouse: number;
  key: string;
  principle: string;
  areas: LifeArea[];
  supportiveThemes: string[];
  cautionThemes: string[];
  synthesis: string;
  advice: string;
};

export function lordshipPlacementKey(
  lordshipHouse: number,
  placementHouse: number
): string {
  return `${lordshipHouse}_lord_in_${placementHouse}`;
}

export const LORDSHIP_PLACEMENT_KNOWLEDGE: Record<
  string,
  LordshipPlacementKnowledge
> = {
  "1_lord_in_1": {
    lordshipHouse: 1,
    placementHouse: 1,
    key: "1_lord_in_1",
    principle: "self connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_2": {
    lordshipHouse: 1,
    placementHouse: 2,
    key: "1_lord_in_2",
    principle: "self connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_3": {
    lordshipHouse: 1,
    placementHouse: 3,
    key: "1_lord_in_3",
    principle: "self connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_4": {
    lordshipHouse: 1,
    placementHouse: 4,
    key: "1_lord_in_4",
    principle: "self connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_5": {
    lordshipHouse: 1,
    placementHouse: 5,
    key: "1_lord_in_5",
    principle: "self connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_6": {
    lordshipHouse: 1,
    placementHouse: 6,
    key: "1_lord_in_6",
    principle: "self connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_7": {
    lordshipHouse: 1,
    placementHouse: 7,
    key: "1_lord_in_7",
    principle: "self connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_8": {
    lordshipHouse: 1,
    placementHouse: 8,
    key: "1_lord_in_8",
    principle: "self connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_9": {
    lordshipHouse: 1,
    placementHouse: 9,
    key: "1_lord_in_9",
    principle: "self connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_10": {
    lordshipHouse: 1,
    placementHouse: 10,
    key: "1_lord_in_10",
    principle: "self connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_11": {
    lordshipHouse: 1,
    placementHouse: 11,
    key: "1_lord_in_11",
    principle: "self connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "1_lord_in_12": {
    lordshipHouse: 1,
    placementHouse: 12,
    key: "1_lord_in_12",
    principle: "self connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "self, body, confidence may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_1": {
    lordshipHouse: 2,
    placementHouse: 1,
    key: "2_lord_in_1",
    principle: "money connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_2": {
    lordshipHouse: 2,
    placementHouse: 2,
    key: "2_lord_in_2",
    principle: "money connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_3": {
    lordshipHouse: 2,
    placementHouse: 3,
    key: "2_lord_in_3",
    principle: "money connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_4": {
    lordshipHouse: 2,
    placementHouse: 4,
    key: "2_lord_in_4",
    principle: "money connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_5": {
    lordshipHouse: 2,
    placementHouse: 5,
    key: "2_lord_in_5",
    principle: "money connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_6": {
    lordshipHouse: 2,
    placementHouse: 6,
    key: "2_lord_in_6",
    principle: "money connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_7": {
    lordshipHouse: 2,
    placementHouse: 7,
    key: "2_lord_in_7",
    principle: "money connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_8": {
    lordshipHouse: 2,
    placementHouse: 8,
    key: "2_lord_in_8",
    principle: "money connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_9": {
    lordshipHouse: 2,
    placementHouse: 9,
    key: "2_lord_in_9",
    principle: "money connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_10": {
    lordshipHouse: 2,
    placementHouse: 10,
    key: "2_lord_in_10",
    principle: "money connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_11": {
    lordshipHouse: 2,
    placementHouse: 11,
    key: "2_lord_in_11",
    principle: "money connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "2_lord_in_12": {
    lordshipHouse: 2,
    placementHouse: 12,
    key: "2_lord_in_12",
    principle: "money connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "money, speech, family may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_1": {
    lordshipHouse: 3,
    placementHouse: 1,
    key: "3_lord_in_1",
    principle: "effort connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_2": {
    lordshipHouse: 3,
    placementHouse: 2,
    key: "3_lord_in_2",
    principle: "effort connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_3": {
    lordshipHouse: 3,
    placementHouse: 3,
    key: "3_lord_in_3",
    principle: "effort connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_4": {
    lordshipHouse: 3,
    placementHouse: 4,
    key: "3_lord_in_4",
    principle: "effort connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_5": {
    lordshipHouse: 3,
    placementHouse: 5,
    key: "3_lord_in_5",
    principle: "effort connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_6": {
    lordshipHouse: 3,
    placementHouse: 6,
    key: "3_lord_in_6",
    principle: "effort connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_7": {
    lordshipHouse: 3,
    placementHouse: 7,
    key: "3_lord_in_7",
    principle: "effort connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_8": {
    lordshipHouse: 3,
    placementHouse: 8,
    key: "3_lord_in_8",
    principle: "effort connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_9": {
    lordshipHouse: 3,
    placementHouse: 9,
    key: "3_lord_in_9",
    principle: "effort connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_10": {
    lordshipHouse: 3,
    placementHouse: 10,
    key: "3_lord_in_10",
    principle: "effort connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_11": {
    lordshipHouse: 3,
    placementHouse: 11,
    key: "3_lord_in_11",
    principle: "effort connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "3_lord_in_12": {
    lordshipHouse: 3,
    placementHouse: 12,
    key: "3_lord_in_12",
    principle: "effort connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "effort, communication, siblings may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_1": {
    lordshipHouse: 4,
    placementHouse: 1,
    key: "4_lord_in_1",
    principle: "home connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_2": {
    lordshipHouse: 4,
    placementHouse: 2,
    key: "4_lord_in_2",
    principle: "home connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_3": {
    lordshipHouse: 4,
    placementHouse: 3,
    key: "4_lord_in_3",
    principle: "home connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_4": {
    lordshipHouse: 4,
    placementHouse: 4,
    key: "4_lord_in_4",
    principle: "home connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_5": {
    lordshipHouse: 4,
    placementHouse: 5,
    key: "4_lord_in_5",
    principle: "home connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_6": {
    lordshipHouse: 4,
    placementHouse: 6,
    key: "4_lord_in_6",
    principle: "home connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_7": {
    lordshipHouse: 4,
    placementHouse: 7,
    key: "4_lord_in_7",
    principle: "home connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_8": {
    lordshipHouse: 4,
    placementHouse: 8,
    key: "4_lord_in_8",
    principle: "home connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_9": {
    lordshipHouse: 4,
    placementHouse: 9,
    key: "4_lord_in_9",
    principle: "home connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_10": {
    lordshipHouse: 4,
    placementHouse: 10,
    key: "4_lord_in_10",
    principle: "home connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_11": {
    lordshipHouse: 4,
    placementHouse: 11,
    key: "4_lord_in_11",
    principle: "home connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "4_lord_in_12": {
    lordshipHouse: 4,
    placementHouse: 12,
    key: "4_lord_in_12",
    principle: "home connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "home, comfort, mother may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_1": {
    lordshipHouse: 5,
    placementHouse: 1,
    key: "5_lord_in_1",
    principle: "children connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_2": {
    lordshipHouse: 5,
    placementHouse: 2,
    key: "5_lord_in_2",
    principle: "children connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_3": {
    lordshipHouse: 5,
    placementHouse: 3,
    key: "5_lord_in_3",
    principle: "children connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_4": {
    lordshipHouse: 5,
    placementHouse: 4,
    key: "5_lord_in_4",
    principle: "children connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_5": {
    lordshipHouse: 5,
    placementHouse: 5,
    key: "5_lord_in_5",
    principle: "children connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_6": {
    lordshipHouse: 5,
    placementHouse: 6,
    key: "5_lord_in_6",
    principle: "children connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_7": {
    lordshipHouse: 5,
    placementHouse: 7,
    key: "5_lord_in_7",
    principle: "children connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_8": {
    lordshipHouse: 5,
    placementHouse: 8,
    key: "5_lord_in_8",
    principle: "children connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_9": {
    lordshipHouse: 5,
    placementHouse: 9,
    key: "5_lord_in_9",
    principle: "children connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_10": {
    lordshipHouse: 5,
    placementHouse: 10,
    key: "5_lord_in_10",
    principle: "children connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_11": {
    lordshipHouse: 5,
    placementHouse: 11,
    key: "5_lord_in_11",
    principle: "children connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "5_lord_in_12": {
    lordshipHouse: 5,
    placementHouse: 12,
    key: "5_lord_in_12",
    principle: "children connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "children, creativity, learning may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_1": {
    lordshipHouse: 6,
    placementHouse: 1,
    key: "6_lord_in_1",
    principle: "workload connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_2": {
    lordshipHouse: 6,
    placementHouse: 2,
    key: "6_lord_in_2",
    principle: "workload connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_3": {
    lordshipHouse: 6,
    placementHouse: 3,
    key: "6_lord_in_3",
    principle: "workload connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_4": {
    lordshipHouse: 6,
    placementHouse: 4,
    key: "6_lord_in_4",
    principle: "workload connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_5": {
    lordshipHouse: 6,
    placementHouse: 5,
    key: "6_lord_in_5",
    principle: "workload connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_6": {
    lordshipHouse: 6,
    placementHouse: 6,
    key: "6_lord_in_6",
    principle: "workload connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_7": {
    lordshipHouse: 6,
    placementHouse: 7,
    key: "6_lord_in_7",
    principle: "workload connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_8": {
    lordshipHouse: 6,
    placementHouse: 8,
    key: "6_lord_in_8",
    principle: "workload connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_9": {
    lordshipHouse: 6,
    placementHouse: 9,
    key: "6_lord_in_9",
    principle: "workload connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_10": {
    lordshipHouse: 6,
    placementHouse: 10,
    key: "6_lord_in_10",
    principle: "workload connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_11": {
    lordshipHouse: 6,
    placementHouse: 11,
    key: "6_lord_in_11",
    principle: "workload connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "6_lord_in_12": {
    lordshipHouse: 6,
    placementHouse: 12,
    key: "6_lord_in_12",
    principle: "workload connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "workload, health, conflict may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_1": {
    lordshipHouse: 7,
    placementHouse: 1,
    key: "7_lord_in_1",
    principle: "relationships connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_2": {
    lordshipHouse: 7,
    placementHouse: 2,
    key: "7_lord_in_2",
    principle: "relationships connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_3": {
    lordshipHouse: 7,
    placementHouse: 3,
    key: "7_lord_in_3",
    principle: "relationships connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_4": {
    lordshipHouse: 7,
    placementHouse: 4,
    key: "7_lord_in_4",
    principle: "relationships connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_5": {
    lordshipHouse: 7,
    placementHouse: 5,
    key: "7_lord_in_5",
    principle: "relationships connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_6": {
    lordshipHouse: 7,
    placementHouse: 6,
    key: "7_lord_in_6",
    principle: "relationships connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_7": {
    lordshipHouse: 7,
    placementHouse: 7,
    key: "7_lord_in_7",
    principle: "relationships connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_8": {
    lordshipHouse: 7,
    placementHouse: 8,
    key: "7_lord_in_8",
    principle: "relationships connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_9": {
    lordshipHouse: 7,
    placementHouse: 9,
    key: "7_lord_in_9",
    principle: "relationships connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_10": {
    lordshipHouse: 7,
    placementHouse: 10,
    key: "7_lord_in_10",
    principle: "relationships connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_11": {
    lordshipHouse: 7,
    placementHouse: 11,
    key: "7_lord_in_11",
    principle: "relationships connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "7_lord_in_12": {
    lordshipHouse: 7,
    placementHouse: 12,
    key: "7_lord_in_12",
    principle: "relationships connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "relationships, clients, partnerships may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_1": {
    lordshipHouse: 8,
    placementHouse: 1,
    key: "8_lord_in_1",
    principle: "sudden changes connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_2": {
    lordshipHouse: 8,
    placementHouse: 2,
    key: "8_lord_in_2",
    principle: "sudden changes connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_3": {
    lordshipHouse: 8,
    placementHouse: 3,
    key: "8_lord_in_3",
    principle: "sudden changes connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_4": {
    lordshipHouse: 8,
    placementHouse: 4,
    key: "8_lord_in_4",
    principle: "sudden changes connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_5": {
    lordshipHouse: 8,
    placementHouse: 5,
    key: "8_lord_in_5",
    principle: "sudden changes connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_6": {
    lordshipHouse: 8,
    placementHouse: 6,
    key: "8_lord_in_6",
    principle: "sudden changes connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_7": {
    lordshipHouse: 8,
    placementHouse: 7,
    key: "8_lord_in_7",
    principle: "sudden changes connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_8": {
    lordshipHouse: 8,
    placementHouse: 8,
    key: "8_lord_in_8",
    principle: "sudden changes connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_9": {
    lordshipHouse: 8,
    placementHouse: 9,
    key: "8_lord_in_9",
    principle: "sudden changes connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_10": {
    lordshipHouse: 8,
    placementHouse: 10,
    key: "8_lord_in_10",
    principle: "sudden changes connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_11": {
    lordshipHouse: 8,
    placementHouse: 11,
    key: "8_lord_in_11",
    principle: "sudden changes connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "8_lord_in_12": {
    lordshipHouse: 8,
    placementHouse: 12,
    key: "8_lord_in_12",
    principle: "sudden changes connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "sudden changes, hidden matters, deep emotions may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_1": {
    lordshipHouse: 9,
    placementHouse: 1,
    key: "9_lord_in_1",
    principle: "luck connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_2": {
    lordshipHouse: 9,
    placementHouse: 2,
    key: "9_lord_in_2",
    principle: "luck connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_3": {
    lordshipHouse: 9,
    placementHouse: 3,
    key: "9_lord_in_3",
    principle: "luck connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_4": {
    lordshipHouse: 9,
    placementHouse: 4,
    key: "9_lord_in_4",
    principle: "luck connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_5": {
    lordshipHouse: 9,
    placementHouse: 5,
    key: "9_lord_in_5",
    principle: "luck connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_6": {
    lordshipHouse: 9,
    placementHouse: 6,
    key: "9_lord_in_6",
    principle: "luck connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_7": {
    lordshipHouse: 9,
    placementHouse: 7,
    key: "9_lord_in_7",
    principle: "luck connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_8": {
    lordshipHouse: 9,
    placementHouse: 8,
    key: "9_lord_in_8",
    principle: "luck connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_9": {
    lordshipHouse: 9,
    placementHouse: 9,
    key: "9_lord_in_9",
    principle: "luck connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_10": {
    lordshipHouse: 9,
    placementHouse: 10,
    key: "9_lord_in_10",
    principle: "luck connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_11": {
    lordshipHouse: 9,
    placementHouse: 11,
    key: "9_lord_in_11",
    principle: "luck connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "9_lord_in_12": {
    lordshipHouse: 9,
    placementHouse: 12,
    key: "9_lord_in_12",
    principle: "luck connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "luck, guidance, teachers may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_1": {
    lordshipHouse: 10,
    placementHouse: 1,
    key: "10_lord_in_1",
    principle: "career connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_2": {
    lordshipHouse: 10,
    placementHouse: 2,
    key: "10_lord_in_2",
    principle: "career connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_3": {
    lordshipHouse: 10,
    placementHouse: 3,
    key: "10_lord_in_3",
    principle: "career connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_4": {
    lordshipHouse: 10,
    placementHouse: 4,
    key: "10_lord_in_4",
    principle: "career connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_5": {
    lordshipHouse: 10,
    placementHouse: 5,
    key: "10_lord_in_5",
    principle: "career connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_6": {
    lordshipHouse: 10,
    placementHouse: 6,
    key: "10_lord_in_6",
    principle: "career connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_7": {
    lordshipHouse: 10,
    placementHouse: 7,
    key: "10_lord_in_7",
    principle: "career connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_8": {
    lordshipHouse: 10,
    placementHouse: 8,
    key: "10_lord_in_8",
    principle: "career connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_9": {
    lordshipHouse: 10,
    placementHouse: 9,
    key: "10_lord_in_9",
    principle: "career connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_10": {
    lordshipHouse: 10,
    placementHouse: 10,
    key: "10_lord_in_10",
    principle: "career connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_11": {
    lordshipHouse: 10,
    placementHouse: 11,
    key: "10_lord_in_11",
    principle: "career connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "10_lord_in_12": {
    lordshipHouse: 10,
    placementHouse: 12,
    key: "10_lord_in_12",
    principle: "career connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "career, status, responsibility may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_1": {
    lordshipHouse: 11,
    placementHouse: 1,
    key: "11_lord_in_1",
    principle: "gains connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_2": {
    lordshipHouse: 11,
    placementHouse: 2,
    key: "11_lord_in_2",
    principle: "gains connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_3": {
    lordshipHouse: 11,
    placementHouse: 3,
    key: "11_lord_in_3",
    principle: "gains connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_4": {
    lordshipHouse: 11,
    placementHouse: 4,
    key: "11_lord_in_4",
    principle: "gains connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_5": {
    lordshipHouse: 11,
    placementHouse: 5,
    key: "11_lord_in_5",
    principle: "gains connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_6": {
    lordshipHouse: 11,
    placementHouse: 6,
    key: "11_lord_in_6",
    principle: "gains connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_7": {
    lordshipHouse: 11,
    placementHouse: 7,
    key: "11_lord_in_7",
    principle: "gains connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_8": {
    lordshipHouse: 11,
    placementHouse: 8,
    key: "11_lord_in_8",
    principle: "gains connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_9": {
    lordshipHouse: 11,
    placementHouse: 9,
    key: "11_lord_in_9",
    principle: "gains connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_10": {
    lordshipHouse: 11,
    placementHouse: 10,
    key: "11_lord_in_10",
    principle: "gains connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_11": {
    lordshipHouse: 11,
    placementHouse: 11,
    key: "11_lord_in_11",
    principle: "gains connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "11_lord_in_12": {
    lordshipHouse: 11,
    placementHouse: 12,
    key: "11_lord_in_12",
    principle: "gains connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "gains, network, income may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_1": {
    lordshipHouse: 12,
    placementHouse: 1,
    key: "12_lord_in_1",
    principle: "rest connects with self.",
    areas: ["mind"],
    supportiveThemes: ["self", "body", "confidence", "identity"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through self, body, confidence.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_2": {
    lordshipHouse: 12,
    placementHouse: 2,
    key: "12_lord_in_2",
    principle: "rest connects with money.",
    areas: ["mind"],
    supportiveThemes: ["money", "speech", "family", "values"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through money, speech, family.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_3": {
    lordshipHouse: 12,
    placementHouse: 3,
    key: "12_lord_in_3",
    principle: "rest connects with effort.",
    areas: ["mind"],
    supportiveThemes: ["effort", "communication", "siblings", "short travel"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through effort, communication, siblings.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_4": {
    lordshipHouse: 12,
    placementHouse: 4,
    key: "12_lord_in_4",
    principle: "rest connects with home.",
    areas: ["mind"],
    supportiveThemes: ["home", "comfort", "mother", "property"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through home, comfort, mother.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_5": {
    lordshipHouse: 12,
    placementHouse: 5,
    key: "12_lord_in_5",
    principle: "rest connects with children.",
    areas: ["mind"],
    supportiveThemes: ["children", "creativity", "learning", "romance"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through children, creativity, learning.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_6": {
    lordshipHouse: 12,
    placementHouse: 6,
    key: "12_lord_in_6",
    principle: "rest connects with workload.",
    areas: ["mind"],
    supportiveThemes: ["workload", "health", "conflict", "discipline"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through workload, health, conflict.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_7": {
    lordshipHouse: 12,
    placementHouse: 7,
    key: "12_lord_in_7",
    principle: "rest connects with relationships.",
    areas: ["mind"],
    supportiveThemes: ["relationships", "clients", "partnerships", "public dealings"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through relationships, clients, partnerships.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_8": {
    lordshipHouse: 12,
    placementHouse: 8,
    key: "12_lord_in_8",
    principle: "rest connects with sudden changes.",
    areas: ["mind"],
    supportiveThemes: ["sudden changes", "hidden matters", "deep emotions", "research"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through sudden changes, hidden matters, deep emotions.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_9": {
    lordshipHouse: 12,
    placementHouse: 9,
    key: "12_lord_in_9",
    principle: "rest connects with luck.",
    areas: ["mind"],
    supportiveThemes: ["luck", "guidance", "teachers", "beliefs"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through luck, guidance, teachers.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_10": {
    lordshipHouse: 12,
    placementHouse: 10,
    key: "12_lord_in_10",
    principle: "rest connects with career.",
    areas: ["mind"],
    supportiveThemes: ["career", "status", "responsibility", "visibility"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through career, status, responsibility.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_11": {
    lordshipHouse: 12,
    placementHouse: 11,
    key: "12_lord_in_11",
    principle: "rest connects with gains.",
    areas: ["mind"],
    supportiveThemes: ["gains", "network", "income", "friends"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through gains, network, income.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  },

  "12_lord_in_12": {
    lordshipHouse: 12,
    placementHouse: 12,
    key: "12_lord_in_12",
    principle: "rest connects with rest.",
    areas: ["mind"],
    supportiveThemes: ["rest", "sleep", "expenses", "foreign matters"],
    cautionThemes: [],
    synthesis:
      "rest, sleep, expenses may express through rest, sleep, expenses.",
    advice:
      "Handle this area consciously and keep decisions practical.",
  }
};
