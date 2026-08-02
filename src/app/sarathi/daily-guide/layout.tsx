import type { Metadata } from "next";

import { createSEO } from "@/lib/seo";

export const metadata: Metadata = createSEO({
  title: "Personalised Daily Vedic Astrology Guide",
  description:
    "Get personalised daily Vedic astrology guidance using your birth details, current dasha, planetary timing and favourable windows for career, money, relationships, property and important decisions.",
  path: "/sarathi/daily-guide",
  keywords: [
    "Daily Vedic Astrology",
    "Personalised Daily Horoscope",
    "Daily Astrology Guidance",
    "Today Astrology Prediction",
    "Dasha and Transit Guidance",
    "Favourable Timing Today",
    "Daily Jyotish Guidance",
  ],
});

export default function DailyGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}