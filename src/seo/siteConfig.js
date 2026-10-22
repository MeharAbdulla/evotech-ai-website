/** Shared SEO constants for Aeromek LLC. */
export const SITE_URL = "https://aeromek.com";
export const SITE_NAME = "Aeromek LLC";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-transparent.png`;
export const DEFAULT_TITLE = "Aeromek LLC | Software & Technology Services";
export const DEFAULT_DESCRIPTION =
  "Aeromek LLC provides software development, mobile and web applications, SaaS products, eSIM/travel connectivity services, and related technology services.";

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
