"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import LockingCityAutocomplete from "@/components/profile/LockingCityAutocomplete";

import {
  getUserBirthProfiles,
  saveUserBirthProfile,
} from "@/lib/supabase/chart-service";

type BirthProfileFormProps = {
  onSaved?: (savedProfileId: string) => void | Promise<void>;
};

export default function BirthProfileForm({
  onSaved,
}: BirthProfileFormProps) {
  const [name, setName] =
    useState("");

  const [birthDateISO, setBirthDateISO] =
    useState("");

  const [birthTime, setBirthTime] =
    useState("");

  const [birthTz, setBirthTz] =
    useState("");

  const [placeName, setPlaceName] =
    useState("");

  const [lat, setLat] =
    useState("");

  const [lon, setLon] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const selectedPlace =
    useMemo(() => {
      if (
        !placeName ||
        !lat ||
        !lon
      ) {
        return null;
      }

      const latitude = Number(lat);
      const longitude = Number(lon);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return null;
      }

      return {
        name: placeName,
        lat: latitude,
        lon: longitude,
      };
    }, [
      placeName,
      lat,
      lon,
    ]);

  /*
   * LockingCityAutocomplete already emits
   * the resolved timezone through this
   * application event.
   */
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent =
        event as CustomEvent<string>;

      if (customEvent.detail) {
        setBirthTz(
          customEvent.detail
        );
      }
    };

    window.addEventListener(
      "sarathi:set-tz",
      handler
    );

    return () => {
      window.removeEventListener(
        "sarathi:set-tz",
        handler
      );
    };
  }, []);


async function handleSave() {
  const trimmedName = name.trim();

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (
    !trimmedName ||
    !birthDateISO ||
    !birthTime ||
    !birthTz.trim() ||
    !placeName.trim() ||
    !lat.trim() ||
    !lon.trim() ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    setError(
      "Please complete your name, birth date, birth time and birth place."
    );
    return;
  }
  // Reject invalid or future birth dates.
const birthDate = new Date(`${birthDateISO}T12:00:00`);

const [year, month, day] = birthDateISO
  .split("-")
  .map(Number);

if (
  !Number.isFinite(birthDate.getTime()) ||
  birthDate.getFullYear() !== year ||
  birthDate.getMonth() + 1 !== month ||
  birthDate.getDate() !== day ||
  birthDate > new Date()
) {
  setError("Please enter a valid date of birth.");
  return;
}

// Require a valid 24-hour birth time.
const timeMatch = /^([01]\d|2[0-3]):[0-5]\d$/.test(
  birthTime
);

if (!timeMatch) {
  setError("Please enter a valid birth time.");
  return;
}
  setSaving(true);
  setError(null);

  try {
    const saved = await saveUserBirthProfile({
      label: trimmedName,
      name: trimmedName,
      birthDateISO,
      birthTime,
      birthTz,
      lat: latitude,
      lon: longitude,
      placeName: placeName.trim(),
    });

    if (!saved?.id) {
      throw new Error(
        "The saved profile did not return a profile ID."
      );
    }

    // Confirm that saved profiles can be retrieved.
    await getUserBirthProfiles();

    // Tell Daily Guidance which profile to select.
    await onSaved?.(String(saved.id));
  } catch (err) {
    console.error(
      "[birth-profile-form] save failed",
      err
    );

    setError(
      "We couldn't save your birth profile. Please try again."
    );
  } finally {
    setSaving(false);
  }
}

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-5">
      <div>
        <h2 className="text-lg font-semibold">
          Add your birth details
        </h2>

        <p className="mt-1 text-sm leading-6 astro-text-soft">
          Save your birth details once
          and use the same profile across
          Sārathi.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Profile name"
            className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Date of birth
          </label>

          <input
            type="date"
            value={birthDateISO}
            onChange={(event) =>
              setBirthDateISO(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Time of birth
          </label>

          <input
            type="time"
            value={birthTime}
            onChange={(event) =>
              setBirthTime(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Birth place
          </label>

          <LockingCityAutocomplete
            value={selectedPlace}
            onSelect={(place) => {
              if (!place) {
                setPlaceName("");
                setLat("");
                setLon("");
                setBirthTz("");
                return;
              }

              setPlaceName(
                place.name
              );

              setLat(
                String(place.lat)
              );

              setLon(
                String(place.lon)
              );
            }}
            placeholder="Start typing birth city"
          />

          {placeName &&
          lat &&
          lon ? (
            <p className="mt-2 text-xs astro-text-muted">
              {placeName} · lat{" "}
              {Number(lat).toFixed(3)},
              lon{" "}
              {Number(lon).toFixed(3)}
            </p>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
