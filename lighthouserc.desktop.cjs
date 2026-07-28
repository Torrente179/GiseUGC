const { assertions, urls } = require('./lighthouse.shared.cjs');

module.exports = {
  ci: {
    collect: {
      url: urls,
      numberOfRuns: 3,
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4174',
      startServerReadyPattern: 'Local',
      settings: {
        budgetsPath: './lighthouse-budget.json',
        chromeFlags: '--headless --no-sandbox',
        preset: 'desktop',
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
    },
    assert: {
      assertions,
    },
    upload: {
      target: 'filesystem',
      outputDir: './tmp/lighthouse/ci-desktop',
    },
  },
};
