import type { MetadataRoute } from "next";

import { appConfig } from "@/lib/constants/app-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${appConfig.url}/sitemap.xml`,
  };
}
