import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.sarathiyourguide.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/sarathi/console/",
          "/sarathi/data-engine/clients/",
          "/sarathi/login",
          "/sarathi/individual/login",
          "/sarathi/astrologers/login",
          "/sarathi/forgot-password",
          "/sarathi/reset-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}