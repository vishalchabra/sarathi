import type { Metadata } from "next";

import { createSEO } from "@/lib/seo";

export const metadata: Metadata = createSEO({
  title: "Focused Vedic Astrology Reports",
  description:
    "Generate in-depth Vedic astrology reports focused on career, marriage, money, property or health. Understand timing, opportunities, risks and practical guidance based on your birth chart.",
  path: "/sarathi/focused-reports",
  keywords: [
    "Career Astrology Report",
    "Marriage Astrology Report",
    "Money Astrology Report",
    "Property Astrology Report",
    "Health Astrology Report",
    "Focused Astrology Report",
    "Vedic Astrology Analysis",
  ],
});

export default function FocusedReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}