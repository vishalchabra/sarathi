// src/components/DateTimeFields.tsx
"use client";
import { useState } from "react";

type Place = { name: string; lat: number; lon: number; tz?: string };

export default function DateTimeFields({ onChange }:{ onChange: (v:{dob:string; tob:string; place: Place | null}) => void }) {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [city, setCity] = useState("");

  const emit = (d = dob, t = tob, c = city) => {
    const place = c ? { name: c, lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" } : null; // stub
    onChange({ dob: d, tob: t, place });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <input type="date" value={dob} onChange={e=>{setDob(e.target.value); emit(e.target.value, undefined as any, undefined as any);}} className="border rounded-lg px-3 py-2 w-full" />
      <input type="time" value={tob} onChange={e=>{setTob(e.target.value); emit(undefined as any, e.target.value, undefined as any);}} className="border rounded-lg px-3 py-2 w-full" />
      <input placeholder="City" value={city} onChange={e=>{setCity(e.target.value); emit(undefined as any, undefined as any, e.target.value);}} className="border rounded-lg px-3 py-2 w-full" />
    </div>
  );
}
