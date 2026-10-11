import { defineConfig, devices } from '@playwright/test';

// Runs against the production build served by `astro preview`.
// `npm run build` must have been run first (the webServer command only serves dist/).
// Specs live in tests/e2e; screenshots are written to test-results/screenshots (gitignored).
export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx astro preview --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: true,
    timeout: 90_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
