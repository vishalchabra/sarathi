"use client";
import type { SunPack } from "@/server/astro/types";

export function SunCard({ data }: { data: SunPack }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white space-y-3">
      <h2 className="text-xl font-bold">
        ☀ Sun — {data.natal.sign} • House {data.natal.house}
        {data.natal.nak ? ` • ${data.natal.nak.name} (p${data.natal.nak.pada})` : ""}
      </h2>

      <div className="text-sm text-gray-700">
  <p>
    <b>Dignity:</b>{" "}
    {(data.features as any).dignity ?? "Not computed"}
  </p>
  {data.features.yogas.length > 0 && (
    <p>
      <b>Yogas:</b> {data.features.yogas.join(", ")}
    </p>
  )}
  {data.features.conjunctions.length > 0 && (
    <p>
      <b>Conjunctions:</b> {data.features.conjunctions.join(", ")}
    </p>
  )}
  {data.features.aspects_on_sun.length > 0 && (
  <p>
    <b>Aspects:</b>{" "}
    {data.features.aspects_on_sun
      .map((a: any) => `${a.from} ${a.aspect} ${a.to}`)
      .join("; ")}
  </p>
)}

</div>


      {data.explain.length > 0 && (
        <details>
          <summary>Why</summary>
          <ul className="list-disc pl-4">{data.explain.map((x,i) => <li key={i}>{x}</li>)}</ul>
        </details>
      )}

      {data.remedies.length > 0 && (
        <details>
          <summary>Remedies</summary>
          <ul className="list-disc pl-4">{data.remedies.map((x,i) => <li key={i}>{x}</li>)}</ul>
        </details>
      )}
    </div>
  );
}
