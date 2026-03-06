import fs from "fs";
import { test, expect } from "@playwright/test";
import { injectAxe, getViolations } from "axe-playwright";

let testLocation = "http://localhost:8080";

let pageList = JSON.parse(fs.readFileSync("./_site_dist/allFiles.json"));

// Filter by recency: only test pages modified within the last N days (default 7).
const maxAgeDays = parseInt(process.env.A11Y_MAX_AGE_DAYS ?? "7", 10);
const cutoff = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000);

const filteredList = pageList.filter((page) => {
  if (page.url === "/") return true; // Always test the home page.
  if (!page.modified) return false;  // No date → skip.
  return new Date(page.modified) >= cutoff;
});

// filter to only include pages that are not in the blog
let pageUrls = filteredList
  .map((page) => page.url)
  .filter((pageUrl) => !pageUrl.includes('/blog/'));

const skipped = pageList.filter((p) => !p.url.includes('/blog/')).length - pageUrls.length;
console.log(`[a11y] Testing ${pageUrls.length} non-blog pages (skipped ${skipped} unchanged, cutoff ${maxAgeDays} days)`);

pageUrls.forEach((pageUrl) => {
  
  test(`desktop: a11y page tests: ${pageUrl}`, async ({ page }) => {
    // use default viewport size which is desktop
    await page.goto(testLocation + pageUrl);
    await page.waitForLoadState('networkidle');

    await injectAxe(page);

    const violations = await getViolations(page, null);
    if (violations.length > 0) {
      const details = violations.map(v =>
        `[${v.impact}] ${v.id}: ${v.description}\n` +
        `  Help: ${v.helpUrl}\n` +
        v.nodes.map(n =>
          `  - Element: ${n.target.join(', ')}\n` +
          `    HTML: ${n.html}\n` +
          `    ${n.failureSummary}`
        ).join('\n')
      ).join('\n\n');

      throw new Error(
        `${violations.length} accessibility violation(s) on ${pageUrl}:\n\n${details}`
      );
    }
  });
});

/*

// run same tests on mobile too
pageUrls.forEach(pageUrl => {

  test("mobile: a11y page tests "+pageUrl, async ({ page }) => {
    await page.setViewportSize({
      width: 360,
      height: 740,
    });

    await page.goto(testLocation+pageUrl);
  
    await injectAxe(page);

    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  
  });
});
*/
