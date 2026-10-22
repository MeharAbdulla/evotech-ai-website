/** Shared SEO constants for Aeromek. */
export const SITE_URL = "https://aeromek.com";
export const SITE_NAME = "Aeromek AI";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-poster.jpg`;
export const DEFAULT_TITLE =
  "Industrial Computer Vision & AI Engineering | Aeromek AI";
export const DEFAULT_DESCRIPTION =
  "Industrial computer vision, object detection, and AI camera systems for factories and warehouses — plus embedded, IoT, and PCB engineering.";

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
