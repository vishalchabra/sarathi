import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astrologer Data Engine",
  description:
    "Professional Vedic astrology chart analysis workspace for Sārathi astrologers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DataEngineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}