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
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          disabled: false,
        },
      },
    },
    assert: {
      assertions,
    },
    upload: {
      target: 'filesystem',
      outputDir: './tmp/lighthouse/ci-mobile',
    },
  },
};
