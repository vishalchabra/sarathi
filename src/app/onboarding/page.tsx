"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveBirthProfile } from "@/lib/birth-profile";
export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [dobISO, setDobISO] = useState("");
  const [tob, setTob] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [tz, setTz] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
        const latNum = Number(lat);
    const lonNum = Number(lon);

    if (
      !dobISO ||
      !tob ||
      !placeName ||
      !tz ||
      !lat ||
      !lon ||
      !Number.isFinite(latNum) ||
      !Number.isFinite(lonNum)
    ) {
      alert("Please fill all required birth details correctly before continuing.");
      return;
    }

    setSaving(true);

    try {
      const profile = {
        name: name || "User",
        dobISO,
        tob,
        place: {
          name: placeName,
          tz,
          lat: latNum,
          lon: lonNum,
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

          <Input
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="Place of birth"
            className="rounded-xl"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              placeholder="Timezone (e.g. Asia/Dubai)"
              className="rounded-xl"
            />
            <Input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              className="rounded-xl"
            />
            <Input
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="Longitude"
              className="rounded-xl"
            />
          </div>

          <Button onClick={handleContinue} disabled={saving} className="rounded-xl">
            {saving ? "Saving..." : "Save profile & continue"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}