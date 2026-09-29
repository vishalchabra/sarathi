import "server-only";


export type Event = {
t: number; // epoch ms
type: "qa" | "error" | "window";
data: Record<string, unknown>;
};


export function logEvent(e: Event) {
// For now, just console.log. Replace with your DB or file sink later.
// eslint-disable-next-line no-console
console.log("[sarathi]", JSON.stringify(e));
}