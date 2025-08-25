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
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance budgets
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'total-blocking-time': ['error', {maxNumericValue: 300}],
        'speed-index': ['error', {maxNumericValue: 3000}],
        
        // Accessibility requirements
        'color-contrast': 'error',
        'image-alt': 'error',
        'heading-order': 'error',
        
        // SEO requirements  
        'document-title': 'error',
        'meta-description': 'error',
        'robots-txt': 'warn',
        
        // Best practices
        'uses-https': 'error',
        'no-vulnerable-libraries': 'error',
        
        // Performance scores
        'categories:performance': ['error', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};