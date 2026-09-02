import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birth Chart Reader",
  description:
    "Access the Sārathi Vedic birth chart reader to calculate planetary placements, ascendant, nakshatras, houses and Panchāṅga details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BirthChartReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}