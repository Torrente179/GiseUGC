const urls = [
  'http://127.0.0.1:4174/',
  'http://127.0.0.1:4174/en/',
  'http://127.0.0.1:4174/servicios/ugc-ads-tiktok-meta/',
  'http://127.0.0.1:4174/en/services/ugc-ads-tiktok-meta/',
  'http://127.0.0.1:4174/verticales/ugc-beauty/',
  'http://127.0.0.1:4174/en/verticals/beauty-ugc-creator/',
  'http://127.0.0.1:4174/recursos/que-es-ugc/',
  'http://127.0.0.1:4174/en/resources/what-is-ugc/',
  'http://127.0.0.1:4174/politica-de-privacidad/',
  'http://127.0.0.1:4174/en/privacy-policy/',
];

const assertions = {
  'categories:performance': ['error', { minScore: 1 }],
  'categories:accessibility': ['error', { minScore: 1 }],
  'categories:best-practices': ['error', { minScore: 1 }],
  'categories:seo': ['error', { minScore: 1 }],
  'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
  'largest-contentful-paint': ['error', { maxNumericValue: 1800 }],
  'total-blocking-time': ['error', { maxNumericValue: 50 }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.01 }],
  'resource-summary:script:size': ['error', { maxNumericValue: 153600 }],
  'resource-summary:stylesheet:size': ['error', { maxNumericValue: 20480 }],
};

module.exports = { assertions, urls };
