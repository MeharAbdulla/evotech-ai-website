import { serviceLandings, getServiceBySlug } from "./serviceLandings";

describe("serviceLandings", () => {
  test("includes primary commercial vision slugs", () => {
    const slugs = serviceLandings.map((s) => s.slug);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "computer-vision",
        "workplace-object-detection",
        "industrial-inspection",
        "cctv-ai",
        "yolo",
      ])
    );
  });

  test("each landing has unique meta title and H1", () => {
    const titles = serviceLandings.map((s) => s.metaTitle);
    const h1s = serviceLandings.map((s) => s.h1);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(h1s).size).toBe(h1s.length);
  });

  test("getServiceBySlug returns money page with warehouse CTA language", () => {
    const page = getServiceBySlug("workplace-object-detection");
    expect(page).toBeTruthy();
    expect(page.metaTitle.toLowerCase()).toMatch(/warehouse|collision|detection/);
  });
});
