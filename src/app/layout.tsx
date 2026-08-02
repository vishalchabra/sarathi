import type { Metadata } from "next";

import "./globals.css";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sarathiyourguide.com"),

  title: {
    default: "Sārathi | AI-Powered Vedic Astrology",
    template: "%s | Sārathi",
  },

  description:
    "Discover personalised Vedic astrology insights with AI. Generate detailed Life Reports, ask astrology questions, explore advanced chart analysis and understand your karmic journey with Sārathi.",

  keywords: [
    "Vedic Astrology",
    "AI Astrology",
    "Birth Chart",
    "Kundli",
    "Life Report",
    "Ask Sarathi",
    "Vedic Horoscope",
    "Career Prediction",
    "Marriage Prediction",
    "Planetary Transits",
    "Dasha Analysis",
    "Nakshatra",
    "Moon Sign",
    "Ascendant",
    "Jyotish",
  ],

  authors: [
    {
      name: "Sārathi",
    },
  ],

  creator: "Sārathi",

  publisher: "Sārathi",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://www.sarathiyourguide.com",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sarathiyourguide.com",
    siteName: "Sārathi",
    title: "Sārathi | AI-Powered Vedic Astrology",
    description:
      "Personalised Vedic astrology powered by AI. Life Reports, Ask Sārathi, planetary analysis and professional astrology tools.",

    images: [
      {
        url: "/sarathi-logo.png",
        width: 1024,
        height: 1024,
        alt: "Sārathi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sārathi | AI-Powered Vedic Astrology",
    description:
      "Discover personalised Vedic astrology with AI-powered insights.",
    images: ["/sarathi-logo.png"],
  },

  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}