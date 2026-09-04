import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sarathiyourguide.com";

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sarathi`,
      changeFrequency: "weekly",
      priority: 1,
    },

    // Knowledge Centre
    {
      url: `${baseUrl}/sarathi/learn`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/how-to-read-vedic-birth-chart`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Vedic Astrology Foundations
    {
      url: `${baseUrl}/sarathi/learn/astrology/9-grahas-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/12-houses-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/12-rashis-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/lagna-ascendant-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/house-lords-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/planetary-strength-dignity-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/aspects-conjunctions-sambandha-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/nakshatras-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/reading-d1-birth-chart-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/vimshottari-dasha-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/divisional-charts-vargas-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/transits-gochar-vedic-astrology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/learn/astrology/predictive-astrology-event-timing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
  url: `${baseUrl}/sarathi/learn/astrology/yogas-vedic-astrology`,
  changeFrequency: "monthly",
  priority: 0.8,
},
    // Question-based Knowledge Centre articles
    {
      url: `${baseUrl}/sarathi/learn/questions/when-will-i-get-a-job`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Main public pages
    {
      url: `${baseUrl}/sarathi/individual`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sarathi/astrologers`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sarathi/why-sarathi`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sarathi/faqs`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sarathi/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sarathi/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sarathi/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sarathi/refund-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}