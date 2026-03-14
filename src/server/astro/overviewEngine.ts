// src/server/astro/overviewEngine.ts

type Planet = {
  name: string;
  house?: number;
  sign?: string;
  nakshatra?: string;
};

function getPlanet(planets: Planet[], name: string) {
  return planets.find(
    (p) => String(p?.name ?? "").toLowerCase() === name.toLowerCase()
  );
}

function withExample(base: string, example?: string) {
  if (!example) return base;
  return `${base} ${example}`;
}

function ascSection(asc?: string) {
  const s = String(asc ?? "").toLowerCase();

  if (s === "virgo") {
    return withExample(
      "You tend to approach life with a strong instinct to improve systems, situations, and outcomes. Rather than ignoring problems, you usually notice where something can be made more efficient or stable.",
      "In real life, this often shows up when you are the one who spots what is not working in a routine, family setup, or practical situation before others fully notice it."
    );
  }

  if (s === "cancer") {
    return withExample(
      "You are highly aware of emotional environments and tend to notice quickly when something feels unsettled in a group or family setting.",
      "This may show up when you sense tension at home, in relationships, or in conversations even before anyone clearly says what is wrong."
    );
  }

  if (s === "leo") {
    return withExample(
      "You naturally operate with a strong sense of identity and presence, often feeling drawn toward roles where your voice or leadership matters.",
      "In everyday life, this can appear when situations push you to take the lead, speak clearly, or carry yourself with dignity even under pressure."
    );
  }

  return withExample(
    "You tend to notice patterns quickly and usually prefer clarity over noise, and substance over appearances.",
    "This often makes you the person who quietly understands what is really happening beneath the surface of a situation."
  );
}

function moonSignTone(sign?: string) {
  const s = String(sign ?? "").toLowerCase();

  if (s === "leo") {
    return withExample(
      "Emotionally you tend to take pride in how you carry yourself. Even when things feel intense internally, you usually prefer to maintain dignity and composure.",
      "This can show up when you feel deeply but still choose not to react impulsively, especially in situations where self-respect matters."
    );
  }

  if (s === "cancer") {
    return withExample(
      "Emotionally you are highly responsive to the environment around you. The tone of people and situations can affect you more quickly than others realize.",
      "For example, if the atmosphere at home or in a close relationship feels off, it may stay with you longer than people expect."
    );
  }

  if (s === "virgo") {
    return withExample(
      "Emotionally you often process situations through analysis and observation, trying to understand what exactly needs adjustment.",
      "This may show up when you replay conversations, notice inconsistencies, or quietly think through how something could have gone better."
    );
  }

  return withExample(
    "Emotionally you tend to observe situations carefully before fully expressing how you feel.",
    "People may think you are calm quickly, but in truth you usually take time to process the full meaning of what happened."
  );
}

function responsibilitySection(saturnHouse?: number) {
  if (saturnHouse === 2 || saturnHouse === 4) {
    return withExample(
      "A repeating theme in your life is that stability rarely feels accidental. Family structure, financial order, and practical responsibility often require more conscious effort from you than they do for others.",
      "This may appear in moments where family matters need organizing, finances require careful handling, or situations become disordered and you feel compelled to step in."
    );
  }

  if (saturnHouse === 10 || saturnHouse === 6) {
    return withExample(
      "A repeating theme in your life is that responsibility often arrives through work, duty, and practical expectations. You may find that life asks you to become dependable in visible ways.",
      "This can show up when others rely on you to fix problems, keep standards high, or carry the weight of something important."
    );
  }

  return withExample(
    "A repeating theme in your life is learning how to carry responsibility without letting it quietly turn into over-responsibility.",
    "In practice, this often means learning the difference between helping sincerely and carrying more than was ever truly yours."
  );
}

function pressureOrLessonSection(
  marsHouse?: number,
  mercuryHouse?: number,
  rahuHouse?: number
) {
  if (marsHouse === 2 && mercuryHouse === 3) {
    return withExample(
      "Because of this, you may mature early in practical matters. Even when others experience you as composed, part of you is often quietly evaluating whether the situation is sustainable, dependable, and under control.",
      "For example, you may find yourself thinking ahead about money decisions, family responsibilities, fairness in effort, or whether people are truly doing their part."
    );
  }

  if (rahuHouse === 9 || rahuHouse === 10 || rahuHouse === 11) {
    return withExample(
      "A major lesson in this chart is learning how to grow without losing your inner centre. Expansion, visibility, or wider opportunities may become important, but your real progress comes when growth stays aligned with emotional truth and clear boundaries.",
      "This can show up when life pushes you toward bigger opportunities, broader environments, or more visibility — but asks you not to lose yourself while doing it."
    );
  }

  return withExample(
    "A major lesson in this chart is learning how to combine sensitivity with strength, so that care does not gradually turn into silent burden.",
    "This becomes especially important in relationships, responsibilities, and practical decisions where emotional goodwill can otherwise make you carry too much."
  );
}

export function buildOverviewSummary(report: any) {
  const asc = report?.core?.ascSign ?? report?.ascSign ?? "";
  const planets: Planet[] = Array.isArray(report?.planets) ? report.planets : [];

  const moon = getPlanet(planets, "Moon");
  const saturn = getPlanet(planets, "Saturn");
  const mars = getPlanet(planets, "Mars");
  const mercury = getPlanet(planets, "Mercury");
  const rahu = getPlanet(planets, "Rahu");

  return [
    ascSection(asc),
    moonSignTone(moon?.sign),
    responsibilitySection(saturn?.house),
    pressureOrLessonSection(mars?.house, mercury?.house, rahu?.house),
  ];
}

export function buildCoreLifePattern(report: any) {
  const planets: Planet[] = Array.isArray(report?.planets) ? report.planets : [];

  const moon = getPlanet(planets, "Moon");
  const saturn = getPlanet(planets, "Saturn");
  const mars = getPlanet(planets, "Mars");
  const mercury = getPlanet(planets, "Mercury");

  const moonHouse = Number(moon?.house ?? NaN);
  const saturnHouse = Number(saturn?.house ?? NaN);
  const marsHouse = Number(mars?.house ?? NaN);
  const mercuryHouse = Number(mercury?.house ?? NaN);

  if (saturnHouse === 2 || saturnHouse === 4) {
    return {
      title: "The Stabilizer",
      text:
        "You tend to become the person who brings order when situations become unstable. People may rely on your judgement, organization, or emotional steadiness when decisions need to be made. This can show up in family matters, practical responsibilities, or moments when stability feels as if it depends on someone stepping in.",
    };
  }

  if (marsHouse === 6 || mercuryHouse === 3) {
    return {
      title: "The Problem Solver",
      text:
        "You naturally notice what is not working and tend to step in to fix systems, situations, or processes before problems grow larger. In real life, this can make you the person others turn to when something needs to be sorted out properly.",
    };
  }

  if (saturnHouse === 10 || mercuryHouse === 10) {
    return {
      title: "The Strategist",
      text:
        "You tend to think about life in long-term structures. Decisions, reputation, and positioning often matter to you more than short-term comfort. This usually gives you strength in serious situations, but also makes you less casual than others about what is at stake.",
    };
  }

  if (moonHouse === 12 || moonHouse === 8) {
    return {
      title: "The Observer",
      text:
        "You tend to notice emotional undercurrents and hidden dynamics around you. Your strength comes from seeing what others overlook, especially when people’s words and their actual emotional state do not fully match.",
    };
  }

  return {
    title: "The Builder",
    text:
      "You tend to grow through steady improvement and practical progress, gradually shaping your life through consistent effort and thoughtful decisions. You are usually less interested in empty movement and more interested in what will actually hold over time.",
  };
}
export function buildLifePressureZone(report: any) {
  const planets: Planet[] = Array.isArray(report?.planets) ? report.planets : [];

  const saturn = getPlanet(planets, "Saturn");
  const mars = getPlanet(planets, "Mars");

  const saturnHouse = Number(saturn?.house ?? NaN);
  const marsHouse = Number(mars?.house ?? NaN);

  if (saturnHouse === 2)
    return "The area of life that repeatedly demands maturity from you is stability and resources. Financial organization, family expectations, or questions of security may push you to become practical earlier than most people.";

  if (saturnHouse === 4)
    return "The area of life that repeatedly demands maturity from you is emotional foundations and home stability. Situations connected to family dynamics, living conditions, or inner security may ask you to become the stabilizing force.";

  if (saturnHouse === 6)
    return "The area of life that repeatedly demands maturity from you is work structure and daily responsibility. Life may repeatedly place you in situations where discipline, persistence, and problem-solving become essential.";

  if (saturnHouse === 10)
    return "The area of life that repeatedly demands maturity from you is career direction and long-term responsibility. Professional expectations, reputation, or leadership pressure may shape important turning points.";

  if (marsHouse === 6)
    return "Pressure in your life often appears through challenges that require action and problem-solving. Obstacles may push you to develop resilience and practical strength over time.";

  return "Pressure in your life tends to appear when situations require practical maturity. These moments often become important turning points in how your character develops.";
}
export function buildNaturalStrength(report: any) {
  const planets: Planet[] = Array.isArray(report?.planets) ? report.planets : [];

  const moon = getPlanet(planets, "Moon");
  const saturn = getPlanet(planets, "Saturn");
  const mercury = getPlanet(planets, "Mercury");
  const mars = getPlanet(planets, "Mars");
  const rahu = getPlanet(planets, "Rahu");

  const moonHouse = Number(moon?.house ?? NaN);
  const saturnHouse = Number(saturn?.house ?? NaN);
  const mercuryHouse = Number(mercury?.house ?? NaN);
  const marsHouse = Number(mars?.house ?? NaN);
  const rahuHouse = Number(rahu?.house ?? NaN);

  if (mercuryHouse === 3) {
    return "Your natural strength is noticing details, patterns, and practical gaps before they become bigger problems. You often do well when communication, coordination, or intelligent problem-solving is needed.";
  }

  if (saturnHouse === 2 || saturnHouse === 4) {
    return "Your natural strength is creating stability in situations that would otherwise become disorganized or emotionally heavy. You often bring steadiness, structure, and practical grounding when others are less centred.";
  }

  if (moonHouse === 8 || moonHouse === 12) {
    return "Your natural strength is sensing what is happening beneath the surface. You often understand emotional undercurrents, hidden tensions, or unspoken truths faster than people expect.";
  }

  if (marsHouse === 6) {
    return "Your natural strength is stepping into difficult situations and dealing with them directly. When life becomes demanding, you often become more capable rather than less effective.";
  }

  if (rahuHouse === 9 || rahuHouse === 10 || rahuHouse === 11) {
    return "Your natural strength is growing into larger spaces without losing the ability to think independently. You often do well when life asks you to expand, adapt, and think beyond the obvious.";
  }

  return "Your natural strength is practical awareness. You tend to notice what matters, understand what needs to be done, and bring more order into situations than people initially realise.";
}