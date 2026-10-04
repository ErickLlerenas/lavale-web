import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/probar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
