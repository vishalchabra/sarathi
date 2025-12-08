// src/components/CityAutocomplete.tsx
import React, { useState } from "react";

export type Place = {
  name: string;
  lat: number;
  lon: number;
  tz?: string;
};

type CityAutocompleteProps = {
  value?: string;
  onChange?: (v: string) => void;
  onSelect?: (p: Place) => void; // <-- make optional
  placeholder?: string;
};

export default function CityAutocomplete({
  value,
  onChange,
  onSelect, // may be undefined
  placeholder = "City, Country",
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(value ?? "");
  const [results, setResults] = useState<Place[]>([]);

  // keep external value in sync if provided
  React.useEffect(() => {
    if (typeof value === "string" && value !== query) setQuery(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(it: Place) {
    const place: Place = {
      name: it.name,
      lat: it.lat,
      lon: it.lon,
      tz: it.tz || "UTC",
    };
    // SAFEGUARD: only call if provided
    if (typeof onSelect === "function") onSelect(place);
  }

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          className="w-full border rounded-md px-3 py-2"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            onChange?.(v);
            // TODO: your search logic here; setResults([...]) when ready
          }}
        />
        {/* Optional: a clear button */}
        {query && (
          <button
            type="button"
            className="border rounded-md px-2"
            onClick={() => {
              setQuery("");
              onChange?.("");
              setResults([]);
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Simple results list (replace with your real UI) */}
      {results.length > 0 && (
        <div className="mt-2 rounded-md border">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-muted/60"
              onClick={() => choose(r)} // ← safe; choose() checks onSelect
            >
              {r.name}
              {r.tz ? <span className="text-xs text-muted-foreground"> • {r.tz}</span> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
