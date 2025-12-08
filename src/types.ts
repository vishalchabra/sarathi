// Shared types across server and UI
export type Place = { name?: string; lat: number; lon: number; tz: string };
export type BirthInput = { dobISO: string; tob: string; place: Place };


export type Category =
| "vehicle"
| "property"
| "job"
| "wealth"
| "health"
| "relationship";


export type QAQuery = {
question: string;
category?: Category;
birth?: BirthInput;
};


export type Window = {
start: string; // ISO date
end: string; // ISO date
score: number; // 0–100
why: string[]; // top contributors
risks?: string[];
actions?: string[];
};


export type DashaInfo = { maha: string; antara: string; until?: string } | null;


export type QAAnswer = {
ok: boolean;
summary: string;
confidence: number; // 0–1
best?: Window | null;
windows?: Window[];
actions?: string[];
risks?: string[];
panchangNote?: string;
dasha?: DashaInfo; // NEW: expose current dasha in UI
debug?: Record<string, unknown>;
};