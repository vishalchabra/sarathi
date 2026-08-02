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
      url: "/apple-touch-icon.png",
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
    "Sārathi is an AI-powered Vedic astrology platform offering personalised Life Reports, astrology guidance, professional chart analysis and personal consultations.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.sarathiyourguide.com/#website",
  url: "https://www.sarathiyourguide.com",
  name: "Sārathi",
  alternateName: "Sarathi",
  description:
    "Personalised AI-powered Vedic astrology guidance, Life Reports and professional astrology tools.",
  publisher: {
    "@id": "https://www.sarathiyourguide.com/#organization",
  },
  inLanguage: "en",
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

        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}