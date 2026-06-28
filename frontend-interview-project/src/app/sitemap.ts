import type { MetadataRoute } from "next";

import { appConfig } from "@/lib/constants/app-config";
import { appRoutes } from "@/lib/constants/app-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [appRoutes.home, appRoutes.login, appRoutes.register].map((route) => ({
    url: `${appConfig.url}${route}`,
    lastModified: now,
  }));
}
