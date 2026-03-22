import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

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
        "default-src 'self'; img-src 'self' https://images.unsplash.com https://media.giselasaldarriaga.com data: blob:; media-src 'self' https://media.giselasaldarriaga.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://media.giselasaldarriaga.com; script-src 'self' 'unsafe-inline';",
    },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        en: path.resolve(__dirname, 'en/index.html'),
        bilingualUgcEs: path.resolve(__dirname, 'servicios/creadora-ugc-bilingue/index.html'),
        spokespersonEs: path.resolve(__dirname, 'servicios/videos-de-portavoz/index.html'),
        ugcAdsEs: path.resolve(__dirname, 'servicios/ugc-ads-tiktok-meta/index.html'),
        bilingualUgcEn: path.resolve(__dirname, 'en/services/bilingual-ugc-creator/index.html'),
        spokespersonEn: path.resolve(__dirname, 'en/services/spokesperson-videos/index.html'),
        ugcAdsEn: path.resolve(__dirname, 'en/services/ugc-ads-tiktok-meta/index.html'),
        testimonialsEs: path.resolve(__dirname, 'servicios/testimoniales-resenas-ugc/index.html'),
        testimonialsEn: path.resolve(__dirname, 'en/services/ugc-testimonials-reviews/index.html'),
        productDemoEs: path.resolve(__dirname, 'servicios/demo-producto-ugc/index.html'),
        productDemoEn: path.resolve(__dirname, 'en/services/ugc-product-demo/index.html'),
        problemSolutionEs: path.resolve(__dirname, 'servicios/ugc-problema-solucion/index.html'),
        problemSolutionEn: path.resolve(__dirname, 'en/services/ugc-problem-solution/index.html'),
        lifestyleEs: path.resolve(__dirname, 'servicios/ugc-lifestyle/index.html'),
        lifestyleEn: path.resolve(__dirname, 'en/services/lifestyle-ugc-organic-content/index.html'),
        brollEs: path.resolve(__dirname, 'servicios/b-roll-footage-ugc/index.html'),
        brollEn: path.resolve(__dirname, 'en/services/ugc-b-roll-footage/index.html'),
      },
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'i18n-core': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
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
