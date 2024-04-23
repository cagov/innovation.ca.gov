// playwright.config.js
// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './test',
  webServer: {
    command: 'npm run test:serve',
    port: 8080,
    timeout: 180 * 1000,
    reuseExistingServer: false,
  },
  workers: 4,
};
export default config;