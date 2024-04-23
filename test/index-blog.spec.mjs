import fs from "fs";
import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

let testLocation = "http://localhost:8080";

let pageList = JSON.parse(fs.readFileSync("./_site_dist/allFiles.json"));
let pageUrls = pageList.map((page) => page.url);

// filter pageUrls to only include pages that are in the blog
pageUrls = pageUrls.filter((pageUrl) => pageUrl.includes('/blog/'));

pageUrls.forEach((pageUrl) => {
  test(`desktop: a11y page tests: ${pageUrl}`, async ({ page }) => {
    // use default viewport size which is desktop
    await page.goto(testLocation + pageUrl);

    await injectAxe(page);

    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
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
