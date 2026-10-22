import { absoluteUrl } from "./seo/siteConfig";

/**
 * Lightweight smoke tests — full App render needs router + lazy chunks
 * and is covered by production build + live route checks.
 */
test("canonical helper points at aeromek.com", () => {
  expect(absoluteUrl("/privacy")).toBe("https://aeromek.com/privacy");
  expect(absoluteUrl("/terms")).toBe("https://aeromek.com/terms");
});
