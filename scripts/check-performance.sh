#!/bin/bash

# Performance Budget Check Script
# Usage: ./scripts/check-performance.sh

set -e

echo "🔍 Performance Budget Check"
echo "════════════════════════════"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

# Check if Lighthouse CI is installed
if ! command -v lhci &> /dev/null; then
    echo "📦 Installing Lighthouse CI..."
    npm install -g @lhci/cli@0.12.x
fi

# Check if performance budget file exists
if [ ! -f "performance-budget.json" ]; then
    echo "❌ Performance budget file not found: performance-budget.json"
    exit 1
fi

# Check if Lighthouse config exists
if [ ! -f "lighthouserc.js" ]; then
    echo "❌ Lighthouse configuration not found: lighthouserc.js"
    exit 1
fi

echo "📊 Current Performance Budget:"
echo "────────────────────────────"
node -e "
const budget = require('./performance-budget.json');
console.log('Resource Budgets:');
budget.budgets[0].resourceSizes.forEach(r => {
  console.log(\`  • \${r.resourceType}: \${r.budget}KB\`);
});
console.log('\\nTiming Budgets:');
budget.budgets[0].timings.forEach(t => {
  console.log(\`  • \${t.metric}: \${t.budget}ms\`);
});
console.log('\\nScore Thresholds:');
Object.entries(budget.thresholds).forEach(([k,v]) => {
  console.log(\`  • \${k}: \${v}%\`);
});
"

echo ""
echo "🚀 Running performance audit..."

# Run the performance budget monitor
if node scripts/performance-budget-monitor.js; then
    echo ""
    echo "✅ All performance budgets passed!"
    exit 0
else
    echo ""
    echo "❌ Performance budget violations detected!"
    echo ""
    echo "💡 Tips to improve performance:"
    echo "  • Optimize images (use WebP format)"
    echo "  • Minify CSS and JavaScript"
    echo "  • Enable compression (gzip/brotli)"
    echo "  • Use a CDN for static assets"
    echo "  • Optimize font loading"
    echo "  • Remove unused CSS and JavaScript"
    exit 1
fi