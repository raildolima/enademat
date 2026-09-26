import { defineConfig, devices } from '@playwright/test';

// Porta própria (não a 4173 padrão do `vite preview`, usada por outras cópias do projeto).
// Sem reaproveitar servidor e com --strictPort: porta ocupada falha em vez de testar outro build.
const PORTA_E2E = 4290;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORTA_E2E}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile-touch',
      use: {
        ...devices['Pixel 7'],
        hasTouch: true,
      },
    },
  ],
  webServer: {
    // Rebuild a cada execução: os E2E sempre testam o src/ e o content/ atuais (CR-28).
    command: `npm run build && npm run preview -- --port ${PORTA_E2E} --strictPort`,
    port: PORTA_E2E,
    reuseExistingServer: false,
    timeout: 180 * 1000,
  },
});
