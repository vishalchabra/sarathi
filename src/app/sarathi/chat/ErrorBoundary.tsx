// FILE: src/app/sarathi/chat/ErrorBoundary.tsx
"use client";

import React from "react";

type Props = { children: React.ReactNode; fallback?: React.ReactNode };

export class ErrorBoundary extends React.Component<Props, { hasError: boolean; msg?: string }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, msg: undefined };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, msg: err?.message || String(err) };
  }
  componentDidCatch(err: any) {
    console.error("[Chat ErrorBoundary] render error:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="font-medium">Something broke while rendering Chat.</div>
            <div className="mt-1 opacity-80">{this.state.msg}</div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
