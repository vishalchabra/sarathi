"use client";
import TopNav from "../TopNav";

type Place = { name: string; tz: string; lat: number; lon: number };
type Report = any;

// ... we leave your existing logic exactly as before

import { useEffect, useMemo, useState } from "react";
import DashaTimeline from "@/components/DashaTimeline";

const LS_KEY = "sarathi_profile_v1";

export default function LifeGuidancePage() {
  const [dobISO, setDobISO] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState<Place>({
    name: "",
    tz: "Asia/Kolkata",
    lat: 0,
    lon: 0,
  });

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setDobISO(p.dobISO ?? "");
        setTob(p.tob ?? "");
        setPlace(p.place ?? place);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveProfile() {
    localStorage.setItem(LS_KEY, JSON.stringify({ dobISO, tob, place }));
  }

  function fillSample() {
    setDobISO("1984-01-21");
    setTob("23:35");
    setPlace({
      name: "Saharanpur",
      tz: "Asia/Kolkata",
      lat: 29.986,
      lon: 77.504,
    });
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPlace((old) => ({
          ...old,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }));
      },
      (e) => setError(e?.message ?? "Location permission denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function generate() {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      setPreviewKey((k) => k + 1);
      const res = await fetch("/api/life-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birth: { dobISO, tob, place } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || res.statusText);
      setReport(data.report);
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const node = document.getElementById("guidancePrint");
      if (!node) return window.print();

      const canvas = await html2canvas(node, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const w = canvas.width * ratio;
      const h = canvas.height * ratio;
      pdf.addImage(imgData, "PNG", (pageWidth - w) / 2, 20, w, h);
      pdf.save("Sarathi-Life-Guidance.pdf");
    } catch {
      window.print();
    }
  }

  function printPage() {
    window.print();
  }

  const chartSrc = (kind: "d1" | "d9" | "moon" | "d10") =>
    `/api/charts?kind=${kind}` +
    `&dobISO=${encodeURIComponent(dobISO || "")}` +
    `&tob=${encodeURIComponent(tob || "")}` +
    `&tz=${encodeURIComponent(place.tz || "")}` +
    `&lat=${place.lat}&lon=${place.lon}` +
    `&name=${encodeURIComponent(place.name || "")}` +
    `&v=${previewKey}`;

  const canRender = useMemo(
    () =>
      Boolean(
        dobISO &&
          tob &&
          place.tz &&
          Number.isFinite(place.lat) &&
          Number.isFinite(place.lon)
      ),
    [dobISO, tob, place]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <TopNav />
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        {/* the rest of your guidance layout stays as we already refactored it */}
        {/* ... keep the card layout we built earlier ... */}
      </div>
    </div>
  );
}
