"use client";

import type React from "react";

type ChatSuggestionsProps = {
  suggestions: string[];
  onSelect: (q: string) => void;
};

export default function ChatSuggestions({
  suggestions,
  onSelect,
}: ChatSuggestionsProps) {
  if (!suggestions?.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="rounded-full border px-3 py-1 text-xs hover:bg-slate-50"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
