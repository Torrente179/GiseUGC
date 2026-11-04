import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const remote = process.env.BASE_URL;
const distIndex = resolve(process.cwd(), 'dist/index.html');
const serveDist = !remote && existsSync(distIndex);

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  reporter: [['list']],
  use: {
    baseURL: remote || (serveDist ? 'http://127.0.0.1:4173' : 'https://www.giselasaldarriaga.com'),
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
          'x-vercel-set-bypass-cookie': 'samesitenone',
        }
      : {},
  },
  webServer: serveDist
    ? {
        command: 'npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
        url: 'http://127.0.0.1:4173/',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
