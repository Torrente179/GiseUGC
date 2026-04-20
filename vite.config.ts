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
        "default-src 'self'; img-src 'self' https://images.unsplash.com https://media.giselasaldarriaga.com https://www.googletagmanager.com https://www.google-analytics.com data: blob:; media-src 'self' https://media.giselasaldarriaga.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://media.giselasaldarriaga.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com; frame-src https://www.googletagmanager.com;",
    },
  },
  plugins: [
    react(),
    // Defer-CSS: convert Vite's auto-injected <link rel="stylesheet"> tags into
    // the non-blocking `media="print" onload="this.media='all'"` pattern so the
    // browser can render the inlined boot-shell CSS before the full stylesheet
    // arrives. Only applied in production builds (dev keeps normal behavior for HMR).
    {
      name: 'defer-non-critical-css',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(
            /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+\.css)"\s*\/?>/g,
            (_match, href) =>
              `<link rel="preload" as="style" crossorigin href="${href}">` +
              `<link rel="stylesheet" crossorigin href="${href}" media="print" onload="this.media='all'">` +
              `<noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`,
          );
        },
      },
    },
  ].filter(Boolean),
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        en: path.resolve(__dirname, 'en/index.html'),
        privacyEs: path.resolve(__dirname, 'politica-de-privacidad/index.html'),
        privacyEn: path.resolve(__dirname, 'en/privacy-policy/index.html'),
        termsEs: path.resolve(__dirname, 'terminos-y-uso-de-contenido/index.html'),
        termsEn: path.resolve(__dirname, 'en/terms-and-content-use/index.html'),
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
        beautyEs: path.resolve(__dirname, 'verticales/ugc-beauty/index.html'),
        beautyEn: path.resolve(__dirname, 'en/verticals/beauty-ugc-creator/index.html'),
        fashionEs: path.resolve(__dirname, 'verticales/ugc-moda/index.html'),
        fashionEn: path.resolve(__dirname, 'en/verticals/fashion-ugc-creator/index.html'),
        techSaasEs: path.resolve(__dirname, 'verticales/ugc-tech-saas/index.html'),
        techSaasEn: path.resolve(__dirname, 'en/verticals/tech-saas-ugc-creator/index.html'),
        ecommerceEs: path.resolve(__dirname, 'verticales/ugc-ecommerce/index.html'),
        ecommerceEn: path.resolve(__dirname, 'en/verticals/ecommerce-ugc-creator/index.html'),
        lifestyleWellnessEs: path.resolve(__dirname, 'verticales/ugc-lifestyle-bienestar/index.html'),
        lifestyleWellnessEn: path.resolve(__dirname, 'en/verticals/lifestyle-wellness-ugc-creator/index.html'),
        whatIsUgcEs: path.resolve(__dirname, 'recursos/que-es-ugc/index.html'),
        whatIsUgcEn: path.resolve(__dirname, 'en/resources/what-is-ugc/index.html'),
        howToHireEs: path.resolve(__dirname, 'recursos/como-contratar-creadora-ugc/index.html'),
        howToHireEn: path.resolve(__dirname, 'en/resources/how-to-hire-ugc-creator/index.html'),
        ugcVsInfluencerEs: path.resolve(__dirname, 'recursos/ugc-vs-influencer-marketing/index.html'),
        ugcVsInfluencerEn: path.resolve(__dirname, 'en/resources/ugc-vs-influencer-marketing/index.html'),
        ugcAdFormatsEs: path.resolve(__dirname, 'recursos/formatos-ugc-ads/index.html'),
        ugcAdFormatsEn: path.resolve(__dirname, 'en/resources/ugc-ad-formats-guide/index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (
              id.includes('i18next') ||
              id.includes('react-i18next') ||
              id.includes('i18next-browser-languagedetector')
            ) {
              return 'i18n-core';
            }
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('@tanstack')) return 'tanstack';
            if (id.includes('@vercel')) return 'vercel-sdk';
            if (id.includes('@emailjs')) return 'emailjs';
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
            if (id.includes('lenis')) return 'lenis';
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
