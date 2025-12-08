// FILE: src/app/api/ai-timeline/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const profile = body?.profile ?? {};
    const dashaTimeline = body?.dashaTimeline ?? [];
    const lifeMilestones = body?.lifeMilestones ?? [];

    // Build compact milestone lines
    const lines =
      Array.isArray(lifeMilestones) && lifeMilestones.length
        ? lifeMilestones.map((m: any) => {
            const lineThemes = Array.isArray(m.themes)
              ? m.themes.join("; ")
              : "";
            return `${m.label} (${m.periodStart} → ${m.periodEnd}, approx. ${m.approxAgeRange}) — ${lineThemes}`;
          })
        : [];

const userPrompt = `
You are an insightful, practical Vedic astrologer.

Using the Vimshottari Mahadasha-based milestones below, write a 3-part life story for this person, focused on:

1) Career & Work
2) Relationships & Family
3) Inner Growth, Mindset & Spiritual Path

VERY IMPORTANT STYLE RULES:
- Do NOT start with phrases like "Certainly", "Of course", "Here is", or similar. Begin directly with the story.
- Do NOT use hashtags, emojis or social-media style language.
- Write in the second person ("you"), as if you are gently guiding them.
- Use simple, everyday language. Avoid heavy jargon.
- Be warm, grounded and non-fatalistic. No scare tactics.
- Do NOT talk about death, accidents, or serious illnesses.
- Always emphasize free will, learning, and conscious choices.

SPECIFICITY & EVENTS:
- Use the milestone themes to describe concrete-feeling life situations.
- When themes relate to study, exams, or Mercury/Ketu-type energies, you may describe things like: change of school, shift in stream, exam stress, or a possible break/interruption in education.
- When themes relate to career, you may mention job changes, promotions, role shifts, or periods of extra workload and pressure.
- When themes relate to relationships or family, you may mention phases of support, distance, responsibility, or emotional friction.
- Use probabilistic language like "you may have", "you likely experienced", "this period often brings", rather than saying events happened with certainty.

STRUCTURE THE ANSWER CLEARLY WITH 3 SECTIONS:

Section 1: Career & Work
- Go in rough time order (childhood/early years → youth → mid-career → later years if applicable).
- Show how different Mahadashas shifted focus in studies, career choices, risks, promotions, work stress, leadership, or work changes.
- Highlight periods that look supportive for growth and visibility, and periods that needed extra patience or adjustment.

Section 2: Relationships & Family
- Again, move through the dasha sequence in time order.
- Focus on themes around family support, marriage/partnerships, children, and close emotional bonds.
- Mention phases that seem more harmonious or nurturing, and phases that might bring misunderstandings, distance, or emotional lessons.
- Keep the tone compassionate and practical, suggesting how they could have handled or can handle such energies more wisely.

Section 3: Inner Growth, Mindset & Spiritual Path
- Describe how the changing Mahadashas shaped their inner world: confidence, fears, values, faith, and spiritual curiosity.
- Point out any patterns of "inner turning points" — times when they may question their direction, seek deeper meaning, or feel called to a higher purpose.
- End with an encouraging overall message about how their journey is helping them mature and align with their true path.

Profile:
- Name: ${profile?.name ?? "the native"}
- Birth: ${profile?.birthDateISO ?? "N/A"} ${profile?.birthTime ?? ""} (${profile?.birthTz ?? "tz"})

Mahadasha-based milestones (summary lines):
${lines.join("\n")}

Full milestone data (for your reference as the model):
${JSON.stringify(lifeMilestones, null, 2)}
`.trim();


    const chat = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: userPrompt }],
      max_tokens: 900,
      temperature: 0.6,
    });

    const text = chat.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[ai-timeline] error", e);
    return NextResponse.json(
      { error: "Failed to build timeline narration" },
      { status: 500 }
    );
  }
}
