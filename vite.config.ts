import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { getAllEntrypointPaths } from "./src/lib/locale-path";

// Every static HTML entrypoint (40+ across both locales) is derived from the
// page registry in src/lib/locale-path.ts — never hand-listed here — so the
// build inputs can't drift from the routes, sitemap, or boot shells.
const rollupInput = Object.fromEntries(
  Object.entries(getAllEntrypointPaths()).map(([key, file]) => [key, path.resolve(__dirname, file)]),
);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: __dirname,
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  preview: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; img-src 'self' https://images.unsplash.com https://media.giselasaldarriaga.com https://www.googletagmanager.com https://www.google-analytics.com data: blob:; media-src 'self' https://media.giselasaldarriaga.com blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://media.giselasaldarriaga.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com; frame-src https://www.googletagmanager.com;",
    },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  build: {
    manifest: true,
    rollupOptions: {
      input: rollupInput,
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('i18next') ||
              id.includes('react-i18next') ||
              id.includes('i18next-browser-languagedetector')
            ) {
              return 'i18n-core';
            }
            if (id.includes('@vercel')) return 'vercel-sdk';
            if (id.includes('embla-carousel')) return 'embla';
            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('scheduler')
            ) {
              return 'react-core';
            }
            if (id.includes('lucide-react')) return 'lucide';
            if (id.includes('date-fns')) return 'date-fns';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
