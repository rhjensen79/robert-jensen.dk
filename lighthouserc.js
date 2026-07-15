module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/about/',
        'http://localhost:8080/posts/',
      ],
      startServerCommand: 'cd public && python3 -m http.server 8080',
      startServerReadyPattern: 'Serving HTTP',
      numberOfRuns: 3,
    },
    assert: {
      // NOTE: we intentionally do NOT use `preset: 'lighthouse:recommended'`.
      // That preset asserts every audit as an error, including many that can
      // never pass in this CI setup:
      //   - Header-based audits (uses-https, uses-text-compression,
      //     uses-long-cache-ttl, csp-xss): the site is served over plain
      //     `python -m http.server`, which sends none of the production
      //     headers configured in static/_headers.
      //   - PWA audits (installable-manifest, service-worker, splash-screen,
      //     themed-omnibox, maskable-icon): this is a content site, not an
      //     installable PWA.
      //   - no-vulnerable-libraries: the audit cannot run in this environment.
      // Instead we assert only meaningful, CI-valid checks below.
      assertions: {
        // Category gates
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }],

        // Hard accessibility / SEO requirements (reliable and meaningful)
        'color-contrast': 'error',
        'image-alt': 'error',
        'heading-order': 'error',
        'aria-allowed-attr': 'error',
        'list': 'error',
        'document-title': 'error',
        'meta-description': 'error',

        // Layout stability is reliable in CI and worth gating on.
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Paint/timing metrics are sensitive to the throttled localhost runner,
        // so we monitor them as warnings rather than hard-failing the build.
        'first-contentful-paint': ['warn', { maxNumericValue: 2600 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 400 }],
        'render-blocking-resources': 'warn',
        'tap-targets': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
