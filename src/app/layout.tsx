import type { Metadata } from "next";

import "./globals.css";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sarathiyourguide.com"),

  title: {
    default: "Sārathi | Personalised Vedic Astrology Guidance",
    template: "%s | Sārathi",
  },

  description:
    "Discover personalised Vedic astrology guidance with Sārathi. Understand your birth chart, dashas, planetary transits and important life phases through detailed Life Reports, focused guidance and professional chart analysis.",

  keywords: [
    "Vedic Astrology",
    "Birth Chart",
    "Kundli",
    "Life Report",
    "Ask Sarathi",
    "Vedic Horoscope",
    "Career Astrology",
    "Marriage Astrology",
    "Planetary Transits",
    "Dasha Analysis",
    "Nakshatra",
    "Moon Sign",
    "Ascendant",
    "Jyotish",
    "Vedic Birth Chart",
    "Personalised Astrology",
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
    title: "Sārathi | Personalised Vedic Astrology Guidance",
    description:
      "Understand your birth chart, planetary timing and important life phases through personalised Vedic astrology guidance with Sārathi.",
    images: [
      {
        url: "/sarathi-logo.png",
        width: 1024,
        height: 1024,
        alt: "Sārathi Vedic Astrology",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sārathi | Personalised Vedic Astrology Guidance",
    description:
      "Understand your birth chart, planetary timing and important life phases through personalised Vedic astrology guidance.",
    images: ["/sarathi-logo.png"],
  },

  icons: {
    icon: [
      {
        url: "/icons/icon-192-v2.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512-v2.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon-v2.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.sarathiyourguide.com/#organization",
  name: "Sārathi",
  alternateName: "Sarathi",
  url: "https://www.sarathiyourguide.com",

  logo: {
    "@type": "ImageObject",
    url: "https://www.sarathiyourguide.com/sarathi-logo.png",
    width: 1024,
    height: 1024,
  },

  description:
    "Sārathi is a Vedic astrology platform offering personalised Life Reports, astrology guidance, detailed chart interpretation and professional astrology tools.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.sarathiyourguide.com/#website",
  url: "https://www.sarathiyourguide.com",
  name: "Sārathi",
  alternateName: "Sarathi",

  description:
    "Personalised Vedic astrology guidance, Life Reports, planetary timing analysis and professional astrology tools.",

  publisher: {
    "@id": "https://www.sarathiyourguide.com/#organization",
  },

  inLanguage: "en",
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.sarathiyourguide.com/#software",

  name: "Sārathi",
  alternateName: "Sarathi",
  url: "https://www.sarathiyourguide.com/sarathi",

  applicationCategory: "LifestyleApplication",
  applicationSubCategory: "Vedic Astrology",
  operatingSystem: "Web",
  browserRequirements: "Requires a modern web browser",

  description:
    "Sārathi is a Vedic astrology platform for personalised Life Reports, astrology question-and-answer guidance, focused reports, planetary timing analysis and professional chart interpretation.",

  image: "https://www.sarathiyourguide.com/sarathi-logo.png",

  publisher: {
    "@id": "https://www.sarathiyourguide.com/#organization",
  },
};

function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(websiteSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(softwareApplicationSchema),
          }}
        />

        <ServiceWorkerRegister />

        {children}

        <GoogleAnalytics gaId="G-WKFJ595D05" />
      </body>
    </html>
  );
}