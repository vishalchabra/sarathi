import type { QAAnswer } from "@/server/core/orchestrator";


export function explain(answer: QAAnswer) {
const lines: string[] = [];
lines.push(`**Verdict:** ${answer.verdict}`);


if (answer.timing?.label || answer.timing?.start) {
const slot =
answer.timing?.start && answer.timing?.end
? `${answer.timing.start}–${answer.timing.end}`
: answer.timing?.label ?? "";
lines.push(`**Best window:** ${slot}`);
}


if (answer.reasoning?.length) {
lines.push("\n**Why this works:**");
for (const r of answer.reasoning) lines.push(`- ${r}`);
}


if (answer.caveats?.length) {
lines.push("\n**Caveats:**");
for (const c of answer.caveats) lines.push(`- ${c}`);
}


return lines.join("\n");
}