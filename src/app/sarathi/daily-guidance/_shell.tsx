"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUserChart,
  getUserBirthProfiles,
} from "@/lib/supabase/chart-service";
import BirthProfileForm from "@/components/profile/BirthProfileForm";
import LockingCityAutocomplete from "@/components/profile/LockingCityAutocomplete";
import AstrologicalSnapshot, {
  type AstrologicalSnapshotData,
} from "./AstrologicalSnapshot";
type SavedProfile = Record<string, any>;

type CurrentPlace = {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
};

type DailyTheme = {
  area?: string;

  polarity?: string;

  manifestationId?: string;

  manifestationLabel?: string;

  manifestationDescription?: string;

  prediction?: string;

  action?: string;

  avoid?: string;

  priorityScore?: number;

  manifestationScore?: number;

  role?: "primary" | "secondary" | "background";
};
type GuidanceExplanation = {
  area: string;
  polarity: string;
  dashaPlanets: string[];
  activatedHouses: number[];
  transitMatches: Array<{
    planet?: string | null;
    source?: string | null;
    polarity?: string | null;
  }>;
  manifestation: {
    label: string;
    matchedPrimaryHouses: number[];
    matchedSupportingHouses: number[];
    discriminatorPlanetMatches: string[];
    transitDiscriminatorPlanetMatches: string[];
  } | null;
};
type DailyPrediction = {
  overallTone?: string;

  primaryTheme?: DailyTheme | null;

  secondaryThemes?: DailyTheme[];

  suppressedAreas?: string[];
  explanation?: GuidanceExplanation | null;
  [key: string]: any;
};
type DailyFocus = {
  area: string;
  importance: number;
  dashaScore: number;
  moonSign: string | null;
  moonNakshatra: string | null;
  signals: {
    source: string;
    planet: string | null;
    importance: number;
    polarity: string;
  }[];
  alignment: "aligned" | "different";
};
function todayISO() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(
  value: string
): string {
  if (!value) {
    return "";
  }

  const [year, month, day] =
    value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(
      year,
      month - 1,
      day
    )
  );
}

function titleCase(
  value?: string | null
): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}
function capitalizeFirst(
  value?: string | null
): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return (
    trimmed.charAt(0).toUpperCase() +
    trimmed.slice(1)
  );
}
function getProfileId(
  profile: SavedProfile,
  index: number
): string {
  return String(
    profile?.id ??
      profile?.profileId ??
      profile?.chartId ??
      index
  );
}

function getProfileName(
  profile: SavedProfile,
  index: number
): string {
  return String(
    profile?.name ??
      profile?.profileName ??
      profile?.label ??
      `Profile ${index + 1}`
  );
}

function normalizeBirth(
  profile: SavedProfile | null
) {
  if (!profile) {
    return null;
  }

  const dateISO =
    profile?.dateISO ??
    profile?.birthDateISO ??
    profile?.birth_date ??
    profile?.birthDate ??
    profile?.dob ??
    null;

  const time =
    profile?.time ??
    profile?.birthTime ??
    profile?.birth_time ??
    null;

  const timezone =
    profile?.timezone ??
    profile?.tz ??
    profile?.birthTz ??
    profile?.birth_timezone ??
    null;

  const latRaw =
    profile?.lat ??
    profile?.latitude ??
    profile?.birthLat ??
    profile?.birth_lat;

  const lonRaw =
    profile?.lon ??
    profile?.lng ??
    profile?.longitude ??
    profile?.birthLon ??
    profile?.birth_lon;

  const lat = Number(latRaw);
  const lon = Number(lonRaw);

  if (
    !dateISO ||
    !time ||
    !timezone ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon)
  ) {
    return null;
  }

  return {
    name:
      profile?.name ??
      profile?.profileName ??
      undefined,

    dateISO:
      String(dateISO),

    time:
      String(time),

    timezone:
      String(timezone),

    lat,
    lon,
  };
}
const dailyFocusDescriptions: Record<string, string> = {
  career:
    "Work, professional responsibilities or career-related decisions may draw your attention today.",
  money:
    "Financial priorities, spending decisions or practical opportunities may draw your attention today.",
  communication:
    "Conversations, correspondence or important information may need your attention today.",
  home:
    "Home, family matters or domestic responsibilities may draw your attention today.",
  children:
    "Children, their needs or related responsibilities may draw your attention today.",
  relationships:
    "Personal relationships, partnerships or important interactions may need your attention today.",
  education:
    "Learning, studies or opportunities to develop your knowledge may come into focus today.",
  hiddenMatters:
    "Matters requiring privacy, research or closer examination may draw your attention today.",
  spirituality:
    "Reflection, spiritual practice or time for yourself may be particularly relevant today.",
};

function getDailyFocusDescription(area: string): string {
  return (
    dailyFocusDescriptions[area] ??
    `${titleCase(area)} may draw your attention today.`
  );
}

function MainGuidanceCards({
  primary,
  dailyFocus,
}: {
  primary: DailyTheme;
  dailyFocus: DailyFocus | null;
}) {
  const aligned =
    dailyFocus?.area === primary.area;

  const area = titleCase(primary.area) || "Your Day";

  const prediction =
    primary.prediction ??
    primary.manifestationDescription ??
    "";

  return (
    <div className="space-y-5">
      {dailyFocus?.moonSign && (
        <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider astro-text-muted">
            Today&apos;s Moon
          </p>
          <p className="mt-1 text-lg font-semibold">
            {dailyFocus.moonSign}
            {dailyFocus.moonNakshatra
              ? ` · ${dailyFocus.moonNakshatra}`
              : ""}
          </p>
        </div>
      )}

      <div className={aligned ? "" : "grid gap-5 md:grid-cols-2"}>
        <article
          className={`rounded-3xl border p-6 ${
            aligned
              ? "border-[#B8DCC8] bg-[#F0F8F4]"
              : "border-[#EBD6A6] bg-[#FFF8EA]"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider astro-text-muted">
            {aligned ? "Your Main Guidance" : "Broader Period Theme"}
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            {area}
          </h2>

          {primary.polarity && (
            <p className="mt-2 text-sm astro-text-muted">
              {titleCase(primary.polarity)}
            </p>
          )}

          {prediction && (
            <p className="mt-4 text-base leading-7 astro-text-soft">
              {prediction}
            </p>
          )}

          {aligned && dailyFocus && (
            <p className="mt-4 text-base leading-7 astro-text-soft">
              Today&apos;s Moon also brings attention to this area.{" "}
              {getDailyFocusDescription(dailyFocus.area)}
            </p>
          )}
        </article>

        {!aligned && dailyFocus && (
          <article className="rounded-3xl border border-[#DDD4F0] bg-[#F5F1FC] p-6">
            <p className="text-xs font-bold uppercase tracking-wider astro-text-muted">
              Today&apos;s Focus
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              {titleCase(dailyFocus.area)}
            </h2>

            <p className="mt-4 text-base leading-7 astro-text-soft">
              {getDailyFocusDescription(dailyFocus.area)}
            </p>

            {dailyFocus.dashaScore === 0 && (
              <p className="mt-4 text-sm leading-6 astro-text-muted">
                This is a temporary area of attention,
                rather than a confirmed period-level event.
              </p>
            )}
          </article>
        )}
      </div>

      {(primary.action || primary.avoid) && (
        <div className="grid gap-4 md:grid-cols-2">
          {primary.action && (
            <section className="rounded-2xl bg-[#F0F8F4] p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#246B55]">
                Suggested Action
                {!aligned && ` · ${area}`}
              </h3>
              <p className="mt-3 leading-7">
                {primary.action}
              </p>
            </section>
          )}

          {primary.avoid && (
            <section className="rounded-2xl bg-[#FFF2F0] p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#9A3434]">
                What to Be Mindful Of
                {!aligned && ` · ${area}`}
              </h3>
              <p className="mt-3 leading-7">
                {primary.avoid}
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
function ThemeCard({
  theme,
  primary = false,
}: {
  theme: DailyTheme;
  primary?: boolean;
}) {
  const area =
    titleCase(theme.area) ||
    "Your Day";

  const prediction =
  theme.prediction ??
  theme.manifestationDescription ??
  "";

  const action =
    theme.action ?? "";

  const avoid =
    theme.avoid ?? "";

  return (
    <article
      className={[
        "rounded-3xl border",
        primary
          ? "border-[color:var(--primary)]/30 bg-white p-6 shadow-sm md:p-8"
          : "border-[color:var(--border)] bg-white/80 p-5",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3
          className={
            primary
              ? "text-2xl font-semibold tracking-tight"
              : "text-lg font-semibold"
          }
        >
          {area}
        </h3>

        {theme.polarity ? (
          <span className="rounded-full border border-[color:var(--border)] bg-white px-2.5 py-1 text-xs font-medium astro-text-muted">
            {titleCase(
              theme.polarity
            )}
          </span>
        ) : null}
      </div>

      {prediction ? (
        <p
          className={[
            "leading-7 astro-text-soft",
            primary
              ? "mt-4 text-base md:text-lg"
              : "mt-3 text-sm",
          ].join(" ")}
        >
          {prediction}
        </p>
      ) : null}

      {action || avoid ? (
        <div
          className={[
            "grid gap-3",
            primary
              ? "mt-6 md:grid-cols-2"
              : "mt-4",
          ].join(" ")}
        >
          {action ? (
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] astro-text-muted">
                One Action
              </div>

              <p className="mt-2 text-sm leading-6">
                {action}
              </p>
            </div>
          ) : null}

          {avoid ? (
            <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] astro-text-muted">
                What to Avoid
              </div>

              <p className="mt-2 text-sm leading-6">
                {avoid}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
function WhyThisGuidance({
  explanation,
}: {
  explanation: GuidanceExplanation;
}) {
  const [expanded, setExpanded] = useState(false);

  const transitMatches = explanation.transitMatches.filter(
    (match) => match.planet
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-white/70">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-4 p-5 text-left md:px-6"
      >
        <div>
          <h3 className="text-base font-semibold">
            Why this guidance?
          </h3>
          <p className="mt-1 text-sm astro-text-muted">
            See the planetary factors behind your primary focus.
          </p>
        </div>

        <span
          aria-hidden="true"
          className="text-xl text-[color:var(--primary)]"
        >
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="space-y-5 border-t border-[color:var(--border)] p-5 md:px-6">
          {explanation.dashaPlanets.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold">
                Active Dasha Planets
              </h4>
              <p className="mt-2 text-sm leading-6 astro-text-soft">
                {explanation.dashaPlanets.join(", ")}
              </p>
            </div>
          )}

          {explanation.activatedHouses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold">
                Activated Houses
              </h4>
              <p className="mt-2 text-sm leading-6 astro-text-soft">
                {explanation.activatedHouses
                  .map((house) => `${house}${ordinalSuffix(house)} house`)
                  .join(", ")}
              </p>
            </div>
          )}

          {transitMatches.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold">
                Relevant Planetary Transits
              </h4>

              <div className="mt-2 flex flex-wrap gap-2">
                {transitMatches.map((match, index) => (
                  <span
                    key={`${match.planet}-${match.source}-${index}`}
                    className="rounded-full border border-[color:var(--border)] bg-white px-3 py-1.5 text-sm"
                  >
                    {match.planet}
                    {match.source
                      ? ` · ${titleCase(match.source)}`
                      : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {explanation.manifestation && (
            <div className="rounded-2xl bg-[#FFF6F4] p-4">
              <h4 className="text-sm font-semibold">
                Specific Theme
              </h4>
              <p className="mt-2 text-sm leading-6 astro-text-soft">
                {explanation.manifestation.label}
              </p>

              {explanation.manifestation
                .matchedPrimaryHouses.length > 0 && (
                <p className="mt-2 text-xs astro-text-muted">
                  Primary supporting houses:{" "}
                  {explanation.manifestation
                    .matchedPrimaryHouses.join(", ")}
                </p>
              )}
            </div>
          )}

          <p className="text-xs leading-5 astro-text-muted">
            These are the factors identified by Sārathi's
            existing timing and event-activation analysis.
            They describe astrological indications, not
            guaranteed events.
          </p>
        </div>
      )}
    </section>
  );
}

function ordinalSuffix(value: number): string {
  const lastTwo = value % 100;

  if (lastTwo >= 11 && lastTwo <= 13) {
    return "th";
  }

  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
export default function DailyGuidanceShell() {
  const [profiles, setProfiles] =
    useState<SavedProfile[]>([]);

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] = useState("");

 const [selectedDateISO, setSelectedDateISO] =
  useState(todayISO());

const [currentPlace, setCurrentPlace] =
  useState<CurrentPlace | null>(null);
const [selectedCity, setSelectedCity] = useState<{
  name: string;
  lat: number;
  lon: number;
} | null>(null);

const clearGuidance = () => {
  setPrediction(null);
  setDailyFocus(null);
  setSnapshot(null);
  setError(null);
};
  const [prediction, setPrediction] =
    useState<DailyPrediction | null>(
      null
    );
const [dailyFocus, setDailyFocus] =
  useState<DailyFocus | null>(null);
  const [snapshot, setSnapshot] =
  useState<AstrologicalSnapshotData | null>(null);
  const [loadingProfiles, setLoadingProfiles] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] =
  useState(false);
  const selectedProfile =
    useMemo(() => {
      if (!profiles.length) {
        return null;
      }

      return (
        profiles.find(
          (profile, index) =>
            getProfileId(
              profile,
              index
            ) === selectedProfileId
        ) ?? profiles[0]
      );
    }, [
      profiles,
      selectedProfileId,
    ]);

  const loadProfiles = useCallback(async (preferredProfileId?: string) => {
  setLoadingProfiles(true);
  setError(null);

  try {
    const [savedProfilesResult, currentChartResult] =
      await Promise.all([
        getUserBirthProfiles(),
        getCurrentUserChart(),
      ]);

    const savedProfiles = Array.isArray(savedProfilesResult)
      ? savedProfilesResult
      : Array.isArray((savedProfilesResult as any)?.data)
        ? (savedProfilesResult as any).data
        : [];

    const currentChart =
      (currentChartResult as any)?.data ??
      currentChartResult ??
      null;

    const nextProfiles: SavedProfile[] = [...savedProfiles];

    if (currentChart && normalizeBirth(currentChart)) {
      const currentBirth = normalizeBirth(currentChart);

      const alreadyIncluded = nextProfiles.some((profile) => {
        const birth = normalizeBirth(profile);

        return (
          birth?.dateISO === currentBirth?.dateISO &&
          birth?.time === currentBirth?.time &&
          birth?.lat === currentBirth?.lat &&
          birth?.lon === currentBirth?.lon
        );
      });

      if (!alreadyIncluded) {
        nextProfiles.unshift(currentChart);
      }
    }

    setProfiles(nextProfiles);

    if (nextProfiles.length > 0) {
  const preferredExists = nextProfiles.some(
    (profile, index) =>
      getProfileId(profile, index) === preferredProfileId
  );

  setSelectedProfileId(
    preferredExists && preferredProfileId
      ? preferredProfileId
      : getProfileId(nextProfiles[0], 0)
  );
} else {
  setSelectedProfileId("");
}
  } catch (err) {
    console.error(
      "[daily-guidance] profile load failed",
      err
    );

    setError(
      "We couldn't load your saved birth profiles."
    );
  } finally {
    setLoadingProfiles(false);
  }
}, []);

useEffect(() => {
  void loadProfiles();
}, [loadProfiles]);

  const generateGuidance =
    useCallback(async () => {
      const birth =
        normalizeBirth(
          selectedProfile
        );

      if (!birth) {
  setError(
    "This profile is missing birth details needed to generate your guidance."
  );
  return;
}

if (!currentPlace) {
  setError("Please select your present city.");
  return;
}

setGenerating(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/daily-guidance",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
           body: JSON.stringify({
  birth,
  currentPlace,
}),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          data?.ok === false
        ) {
          throw new Error(
            data?.error ||
              "Unable to generate daily guidance."
          );
        }

        setPrediction(data?.prediction ?? null);
setDailyFocus(data?.dailyFocus ?? null);
setSnapshot(data?.snapshot ?? null);

if (data?.date) {
  setSelectedDateISO(data.date);
}
      } catch (err: any) {
        console.error(
          "[daily-guidance] generation failed",
          err
        );

       setPrediction(null);
  setDailyFocus(null);
  setSnapshot(null);

setError(
          err?.message ||
            "Unable to generate your daily guidance."
        );
      } finally {
        setGenerating(false);
      }
    }, [
  selectedProfile,
  currentPlace,
]);

  const primary =
  prediction?.primaryTheme ??
  null;

const secondary =
  Array.isArray(
    prediction?.secondaryThemes
  )
    ? prediction.secondaryThemes.slice(
        0,
        2
      )
    : [];

  return (
    <div className="space-y-8">
      <section className="astro-card rounded-3xl p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-[color:var(--primary)]">
            TODAY&apos;S GUIDANCE
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Understand what matters
            most today.
          </h1>

          <p className="mt-3 max-w-2xl leading-7 astro-text-soft">
            Your birth chart,
            current planetary period
            and today&apos;s planetary
            movements are read
            together to identify the
            themes that deserve your
            attention.
          </p>
        </div>


<div className="mt-7 grid gap-5 lg:grid-cols-2 lg:items-start">
  {/* Profile and Add Profile button */}
  <div className="min-w-0">
    <label className="mb-2 block text-sm font-semibold">
      Your profile
    </label>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select
        value={selectedProfileId}
        onChange={(event) => {
  setSelectedProfileId(event.target.value);
  setPrediction(null);
setDailyFocus(null);
setSnapshot(null);
}}
        disabled={loadingProfiles || !profiles.length}
        className="h-11 min-w-0 flex-1 rounded-xl border border-[color:var(--border)] bg-white px-3 text-sm outline-none"
      >
        {loadingProfiles ? (
          <option>Loading profiles...</option>
        ) : profiles.length ? (
          profiles.map((profile, index) => (
            <option
              key={getProfileId(profile, index)}
              value={getProfileId(profile, index)}
            >
              {getProfileName(profile, index)}
            </option>
          ))
        ) : (
          <option>No saved profile</option>
        )}
      </select>

      <button
        type="button"
        onClick={() => setShowProfileForm((current) => !current)}
        className="h-11 shrink-0 rounded-full border border-[color:var(--primary)] px-4 text-sm font-semibold text-[color:var(--primary)] hover:opacity-80"
      >
        {showProfileForm ? "Cancel" : "+ Add Profile"}
      </button>
    </div>
  </div>

  {/* Present City and Generate button */}
<div className="min-w-0">
  <label className="mb-2 block text-sm font-semibold">
    Present City
  </label>

  <LockingCityAutocomplete
    value={selectedCity}
    broadcastTimezone={false}
    onSelect={(place) => {
  setSelectedCity(place);
  setCurrentPlace(null);
  clearGuidance();
}}
onTimezoneResolved={(timezone, place) => {
  if (!timezone || !place) {
    setCurrentPlace(null);
    return;
  }

  setCurrentPlace({
    name: place.name,
    lat: place.lat,
    lon: place.lon,
    timezone,
  });
}}
    placeholder="Start typing your present city"
  />

  <p className="mt-2 text-xs astro-text-muted">
    Your daily guidance uses your present city's date and timezone.
    Your birth details remain unchanged.
  </p>

  <button
    type="button"
    onClick={generateGuidance}
    disabled={
      generating ||
      loadingProfiles ||
      !selectedProfile ||
      !currentPlace
    }
    className="mt-4 h-11 rounded-full bg-[color:var(--primary)] px-6 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {generating
      ? "Reading your day..."
      : "View My Guidance"}
  </button>
</div>
</div>

        {!loadingProfiles && profiles.length === 0 && (
  <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-white/60 p-5">
    <h2 className="text-sm font-semibold">
      Add your birth details
    </h2>

    <p className="mt-1 text-sm leading-6 astro-text-soft">
      Save your birth details once to receive
      personalised daily guidance.
    </p>

    {!showProfileForm && (
      <button
        type="button"
        onClick={() => setShowProfileForm(true)}
        className="mt-4 rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Add Birth Details
      </button>
    )}
  </div>
)}

{showProfileForm && (
  <div className="mt-5">
    <BirthProfileForm
  onSaved={async (savedProfileId) => {
  await loadProfiles(savedProfileId);
  setShowProfileForm(false);
  setPrediction(null);
setDailyFocus(null);
setSnapshot(null);
}}
/>
  </div>
)}

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      {prediction ? (
        <>

<section>
  <div className="text-sm font-semibold astro-text-muted">
    {formatDate(selectedDateISO)}
  </div>

  <div className="mt-3 rounded-3xl border border-[color:var(--border)] bg-white/70 p-6">
    <div className="text-xs font-semibold uppercase tracking-[0.14em] astro-text-muted">
      Your Day at a Glance
    </div>

    <p className="mt-3 text-lg leading-8">
      Your broader planetary period and today&apos;s Moon
      highlight different layers of your day. Explore
      your main guidance and today&apos;s focus below.
    </p>
  </div>
</section>

          {primary ? (
            <section>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] astro-text-muted">
                Your Guidance
              </div>

              {prediction.primaryTheme && (
  <MainGuidanceCards
    primary={prediction.primaryTheme}
    dailyFocus={dailyFocus}
  />
)}
                        </section>
          ) : null}

          {primary && prediction.explanation && (
            <WhyThisGuidance
              explanation={prediction.explanation}
            />
          )}

          {secondary.length ? (
            <section>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] astro-text-muted">
                Also Active Today
              </div>

              <div
  className={
    secondary.length === 1
      ? "grid gap-4"
      : "grid gap-4 md:grid-cols-2"
  }
>
                {secondary.map(
                  (
                    theme,
                    index
                  ) => (
                    <ThemeCard
                      key={`${theme.area ?? "theme"}-${index}`}
                      theme={theme}
                    />
                  )
                )}
              </div>
            </section>
          ) : null}

          {!primary &&
          !secondary.length ? (
            <section className="rounded-3xl border border-[color:var(--border)] bg-white/70 p-6">
              <h2 className="text-lg font-semibold">
                Your guidance is ready
              </h2>

              <p className="mt-2 text-sm leading-6 astro-text-soft">
                The prediction engine
                returned guidance, but
                there is no primary
                daily theme available
                to display yet.
              </p>
            </section>
          ) : null}

          {snapshot && (
            <AstrologicalSnapshot
              snapshot={snapshot}
              selectedDateISO={selectedDateISO}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
