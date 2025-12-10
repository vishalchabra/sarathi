// src/components/LANBanner.tsx
"use client";

import { useEffect, useState } from "react";

// @ts-expect-error – qrcode has no TypeScript types; treat as any
import QRCode from "qrcode";


export default function LANBanner() {
  const [url, setUrl] = useState("");
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const href = window.location.href;
    setUrl(href);
  }, []);

  useEffect(() => {
    if (!url) return;
    QRCode.toString(url, {
      type: "svg",
      width: 180,        // sets viewBox size
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then(setSvg)
      .catch(console.error);
  }, [url]);

  if (!url || !svg) return null;

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2">
        <div
          aria-label="QR code"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="text-sm text-muted-foreground break-all text-center">
          {url}
        </p>
      </div>
    </div>
  );
}
