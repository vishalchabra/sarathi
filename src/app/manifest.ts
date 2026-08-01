import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sārathi — Your Personal Vedic Astrology Guide",
    short_name: "Sārathi",
    description:
      "Personalised Vedic astrology guidance, Life Reports, Ask Sārathi and professional astrology tools.",
    start_url: "/sarathi",
    display: "standalone",
    background_color: "#f8f6fc",
    theme_color: "#6e4bc6",
    orientation: "portrait",
    icons: [
  {
    src: "/icons/icon-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
],
  };
}