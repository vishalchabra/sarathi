"use client";
import React from "react";

export default function SaveSvgPngButton({
  svgId,
  filename = "birth-wheel.png",
  className = "px-2 py-1 text-xs rounded border hover:bg-gray-50",
}: { svgId: string; filename?: string; className?: string }) {
  async function save() {
    const svg = document.getElementById(svgId) as SVGSVGElement | null;
    if (!svg) return;

    const viewBox = svg.getAttribute("viewBox")?.split(/\s+/).map(Number) || [0,0,svg.clientWidth,svg.clientHeight];
    const [, , w = 1024, h = 1024] = viewBox;

    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,w,h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.download = filename;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  }

  return <button onClick={save} className={className}>Save wheel (PNG)</button>;
}
