import { test, expect } from "@playwright/test";
import {
  injectAxe,
  checkA11y
} from "axe-playwright";

let testLocation = "http://localhost:8080";

let pageUrls = ["/", "/our-work/?activeTab=past-projects-btn", "/blog/"];

pageUrls.forEach(pageUrl => {

  test("a11y page tests "+pageUrl, async ({ page }) => {

    await page.goto(testLocation+pageUrl);
  
    await injectAxe(page);

    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  
  });
});
