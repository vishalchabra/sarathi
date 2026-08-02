import type { Metadata } from "next";

const SITE_NAME = "Sārathi";
const BASE_URL = "https://www.sarathiyourguide.com";

type SEOProps = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createSEO({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: SEOProps): Metadata {
  return {
    title,
    description,

    keywords,

    alternates: {
      canonical: `${BASE_URL}${path}`,
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: "/sarathi-logo.png",
          width: 1024,
          height: 1024,
          alt: SITE_NAME,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/sarathi-logo.png"],
    },
  };
}