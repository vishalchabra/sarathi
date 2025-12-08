"use client";

import * as React from "react";

export function ScrollArea({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        // default styles for scrollable area
        "relative overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30 rounded-md border border-border bg-background " +
        (className || "")
      }
      style={{
        maxHeight: "100%",
      }}
    >
      <div className="p-2">{children}</div>
    </div>
  );
}
