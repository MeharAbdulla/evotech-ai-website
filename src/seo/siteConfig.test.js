import { absoluteUrl, SITE_URL } from "./siteConfig";

describe("siteConfig", () => {
  test("SITE_URL is apex https", () => {
    expect(SITE_URL).toBe("https://aeromek.com");
  });

  test("absoluteUrl builds canonical paths", () => {
    expect(absoluteUrl("/")).toBe("https://aeromek.com/");
    expect(absoluteUrl("/services/computer-vision")).toBe(
      "https://aeromek.com/services/computer-vision"
    );
    expect(absoluteUrl("contact")).toBe("https://aeromek.com/contact");
  });
});
