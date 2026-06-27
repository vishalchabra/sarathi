"use client";

import React from "react";
import { Input } from "@/components/ui/input";
const cityCache = new Map<
  string,
  Array<{ name: string; lat: number; lon: number }>
>();

function expectedTzForPlaceName(name: string): string | null {
  const s = name.toLowerCase();

  if (s.includes("dubai") || s.includes("united arab emirates")) {
    return "Asia/Dubai";
  }

  if (s.includes("india")) {
    return "Asia/Kolkata";
  }

  if (s.includes("london") || s.includes("united kingdom")) {
    return "Europe/London";
  }

  if (s.includes("new york")) {
    return "America/New_York";
  }

  if (s.includes("singapore")) {
    return "Asia/Singapore";
  }

  return null;
}
export default function LockingCityAutocomplete({
  value,
  onSelect,
  placeholder = "Start typing a city",
  disabled = false,
  error,
}: {
  value: { name: string; lat: number; lon: number } | null;
  onSelect: (p: { name: string; lat: number; lon: number } | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}) {
    
    const [q, setQ] = React.useState(value?.name ?? "");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState<
      Array<{ name: string; lat: number; lon: number }>
    >([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const timerRef = React.useRef<number | null>(null);
    
    // keep input in sync if parent changes value
  React.useEffect(() => {
    if (value?.name && value.name !== q) {
      setQ(value.name);
      return;
    }
    if (!value && q !== "") {
      setQ("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

    // search as user types
    React.useEffect(() => {
      if (timerRef.current) window.clearTimeout(timerRef.current);

      const query = q.trim();
      if (query.length < 2) {
        setItems([]);
        setOpen(false);
        return;
      }

      // cache hit
      if (cityCache.has(query)) {
        setItems(cityCache.get(query)!);
        setOpen(true);
        return;
      }

      timerRef.current = window.setTimeout(async () => {
        setLoading(true);
        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&q=${encodeURIComponent(
            query
          )}`;
          const res = await fetch(url, {
    headers: { "Accept-Language": "en" },
    referrerPolicy: "no-referrer",
  });

          const json = (await res.json()) as any[];
         const out = json.map((r) => {
  const city =
    r.address?.city ||
    r.address?.town ||
    r.address?.village ||
    r.address?.municipality ||
    r.address?.hamlet ||
    r.address?.county ||
    r.address?.region;

  const state =
    r.address?.state ||
    r.address?.state_district ||
    r.address?.province ||
    r.address?.region ||
    "";

  const country = r.address?.country || "";

  return {
    name: [city, state, country]
      .filter(Boolean)
      .filter((value, index, arr) => {
  if (index === 0) return true;
  return value.toLowerCase() !== arr[0]?.toLowerCase();
})
      .join(", ") || r.display_name,
    lat: +r.lat,
    lon: +r.lon,
  };
});
          cityCache.set(query, out);
          setItems(out);
          setOpen(true);
        } catch {
          setItems([]);
          setOpen(false);
        } finally {
          setLoading(false);
        }
      }, 250);

      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }, [q]);

    const commit = (it: { name: string; lat: number; lon: number }) => {
      setQ(it.name);
      setItems([]);
      setOpen(false);
      onSelect(it);

      // guess timezone and broadcast
      try {
        const expTz = expectedTzForPlaceName(it.name);
        if (expTz) {
          window.dispatchEvent(new CustomEvent("sarathi:set-tz", { detail: expTz }));
        }
      } catch {}

      try {
        inputRef.current?.blur();
      } catch {}
    };

    const clearAll = () => {
      setQ("");
      setItems([]);
      setOpen(false);
      onSelect(null);
      try {
        inputRef.current?.focus();
      } catch {}
    };

    return (
      <div className="relative">
        <Input
  ref={inputRef}
  placeholder={placeholder}
  autoComplete="off"
  value={q}
  disabled={disabled}
  className={
  error
    ? "border-red-500 focus-visible:ring-red-500"
    : undefined
}
  onFocus={() => {
    if (items.length) setOpen(true);
  }}
  onBlur={(e) => {
    const next = e.relatedTarget as HTMLElement | null;
    if (next && next.closest("[data-citymenu]")) return;
    setOpen(false);
  }}
  onChange={(e) => {
    const el = e.target as HTMLInputElement;
    const caret = el.selectionStart ?? e.target.value.length;
    setQ(e.target.value);
    requestAnimationFrame(() => {
      try {
        el.setSelectionRange(caret, caret);
      } catch {}
    });
  }}
/>
        {q && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-foreground"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearAll}
            aria-label="Clear"
            title="Clear"
          >
            x
          </button>
        )}

        {open && (
          <div
            data-citymenu
            className="absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow"
          >
            {loading && (
              <div className="px-3 py-2 text-sm text-foreground">Searching</div>
            )}
            {!loading && !items.length && (
              <div className="px-3 py-2 text-sm text-foreground">No results</div>
            )}
            {!loading &&
              items.map((it, i) => (
                <button
                  key={`${it.name}-${i}`}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => commit(it)}
                >
                  {it.name}
                  <span className="ml-2 text-xs astro-text-muted">
                    {it.lat.toFixed(2)}, {it.lon.toFixed(2)}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    );
  }