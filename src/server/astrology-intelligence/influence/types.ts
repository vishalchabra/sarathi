import type {
  PlanetName,
} from "../contracts/facts";

export type PlanetaryInfluenceKind =
  | "conjunction"
  | "received_aspect"
  | "dispositor"
  | "mutual_reinforcement"
  | "amplification"
  | "discipline"
  | "detachment"
  | "tension";

export type PlanetaryInfluencePolarity =
  | "supportive"
  | "mixed"
  | "challenging";

export type PlanetaryInfluenceEdge = {
  id: string;

  from: PlanetName;
  to: PlanetName;

  kind: PlanetaryInfluenceKind;
  polarity: PlanetaryInfluencePolarity;

  score: number;
  confidence: number;

  themes: string[];
  reasons: string[];
  evidenceIds: string[];
};

export type PlanetaryInfluenceNode = {
  planet: PlanetName;

  strengthScore: number;
  confidence: number;

  currentlyActive: boolean;

  incomingEdgeIds: string[];
  outgoingEdgeIds: string[];
};

export type PlanetaryInfluenceGraph = {
  nodes: Record<
    PlanetName,
    PlanetaryInfluenceNode
  >;

  edges: PlanetaryInfluenceEdge[];

  supportiveEdges: PlanetaryInfluenceEdge[];
  challengingEdges: PlanetaryInfluenceEdge[];

  warnings: string[];
};
