"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveBirthProfile } from "@/lib/birth-profile";

type Place = {
  name?: string;
  tz: string;
  lat: number;
  lon: number;
};

type GeoSuggestion = {
  name?: string;
  tz?: string;
  lat?: number | string;
  lon?: number | string;
};

export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [dobISO, setDobISO] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState<Place>({
    name: "",
    tz: "Asia/Kolkata",
    lat: 0,
    lon: 0,
  });

  const [placeQuery, setPlaceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [placePicked, setPlacePicked] = useState(false);
  const [placeSearching, setPlaceSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const searchAbortRef = useRef<AbortController | null>(null);

  async function searchPlaces(q: string) {
    const query = (q || "").trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setPlaceSearching(true);
      searchAbortRef.current?.abort();
      const ac = new AbortController();
      searchAbortRef.current = ac;

      const tryUrl = async (url: string) => {
        const res = await fetch(url, { method: "GET", signal: ac.signal });
        const data = await res.json().catch(() => ({}));
        const list: GeoSuggestion[] =
          (Array.isArray((data as any)?.results) && (data as any).results) ||
          (Array.isArray((data as any)?.places) && (data as any).places) ||
          (Array.isArray((data as any)?.items) && (data as any).items) ||
          [];
        return list;
      };

      let list = await tryUrl(`/api/geo?q=${encodeURIComponent(query)}`);
      if (!list.length) {
        list = await tryUrl(`/api/geo?query=${encodeURIComponent(query)}`);
      }

      setSuggestions(list.slice(0, 8));
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setSuggestions([]);
    } finally {
      setPlaceSearching(false);
    }
  }

  function pickSuggestion(s: GeoSuggestion) {
    const next: Place = {
      name: (s?.name ?? "").toString(),
      tz: (s?.tz ?? "Asia/Kolkata").toString(),
      lat: typeof s?.lat === "number" ? s.lat : Number(s?.lat ?? 0),
      lon: typeof s?.lon === "number" ? s.lon : Number(s?.lon ?? 0),
    };

    const ok =
      Boolean(next.name) &&
      Number.isFinite(next.lat) &&
      Number.isFinite(next.lon) &&
      Boolean(next.tz);

    setPlace(next);
    setPlaceQuery(next.name || "");
    setSuggestions([]);
    setPlacePicked(ok);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on this device/browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(`/api/geo?lat=${lat}&lon=${lon}`, {
            method: "GET",
          });
          const data = await res.json().catch(() => ({}));
          const name =
            (data as any)?.name || (data as any)?.place?.name || "My location";
          const tz =
            (data as any)?.tz ||
            (data as any)?.place?.tz ||
            "Asia/Kolkata";

          const next: Place = { name, tz, lat, lon };
          setPlace(next);
          setPlaceQuery(name);
          setSuggestions([]);
          setPlacePicked(true);
        } catch {
          const next: Place = {
            name: "My location",
            tz: "Asia/Kolkata",
            lat,
            lon,
          };
          setPlace(next);
          setPlaceQuery("My location");
          setSuggestions([]);
          setPlacePicked(true);
        }
      },
      () => alert("Location permission denied."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleContinue() {
    if (!dobISO || !tob || !placePicked) {
      alert("Please enter birth date, birth time, and select a place from the dropdown.");
      return;
    }

    setSaving(true);

    try {
      const profile = {
        name: name || "User",
        dobISO,
        tob,
        place: {
          name: place.name ?? "",
          tz: place.tz ?? "Asia/Kolkata",
          lat: Number(place.lat),
          lon: Number(place.lon),
        },
      };

      saveBirthProfile(profile);
      router.replace("/sarathi/chat");
    } catch (e) {
      console.error("Failed to save profile", e);
      alert("Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Card className="rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Create your profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your birth details first so Sārathi can answer from your actual chart.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-xl"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="date"
              value={dobISO}
              onChange={(e) => setDobISO(e.target.value)}
              className="rounded-xl"
            />
            <Input
              type="time"
              value={tob}
              onChange={(e) => setTob(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Birth place</div>

            <div className="flex flex-col gap-2 md:flex-row">
              <Input
                value={placeQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setPlaceQuery(v);
                  setPlacePicked(false);
                  searchPlaces(v);
                }}
                placeholder="Start typing city…"
                className="rounded-xl"
              />

              <Button
                type="button"
                variant="outline"
                onClick={useMyLocation}
                className="rounded-xl"
              >
                Use my location
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur">
                {suggestions.map((s, idx) => {
                  const label = s?.name ?? "Unknown place";
                  const latN =
                    typeof s?.lat === "number" ? s.lat : Number(s?.lat ?? NaN);
                  const lonN =
                    typeof s?.lon === "number" ? s.lon : Number(s?.lon ?? NaN);
                  const meta = `${s?.tz ?? "tz?"} · ${
                    Number.isFinite(latN) ? latN.toFixed(3) : "?"
                  }, ${Number.isFinite(lonN) ? lonN.toFixed(3) : "?"}`;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pickSuggestion(s);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-white/5/5"
                    >
                      <div className="text-sm text-slate-100">{label}</div>
                      <div className="text-xs text-slate-300/70">{meta}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {placeSearching && (
              <div className="text-xs text-muted-foreground">Searching…</div>
            )}

            {placePicked && (
              <div className="text-xs text-emerald-300/80">
                Place selected: <span className="text-slate-200">{place.name}</span>{" "}
                ({place.tz}) · {Number(place.lat).toFixed(3)},{" "}
                {Number(place.lon).toFixed(3)}
              </div>
            )}
          </div>

          <Button onClick={handleContinue} disabled={saving} className="rounded-xl">
            {saving ? "Saving..." : "Save profile & continue"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}