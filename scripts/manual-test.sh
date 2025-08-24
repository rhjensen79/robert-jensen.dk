#!/bin/bash

# Manual Testing Script with Hugo Dev Server
# This script starts the dev server and guides manual verification

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_highlight() {
    echo -e "${CYAN}[ACTION]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${CYAN}$1${NC}"
    echo "$(echo "$1" | sed 's/./-/g')"
}

echo "🧪 Manual Testing & Verification"
echo "================================"

# Check if we're in the right directory
if [ ! -f "config.toml" ]; then
    echo "Error: Must be run from Hugo site root directory"
    exit 1
fi

print_info "Starting manual verification process..."

# Step 1: Build the site
print_header "Step 1: Building Site"
print_info "Running Hugo build with minification..."

hugo --minify --quiet

if [ $? -eq 0 ]; then
    print_success "Site built successfully"
else
    echo "Error: Hugo build failed"
    exit 1
fi

# Step 2: Quick automated checks
print_header "Step 2: Pre-verification Checks"

# Check key optimizations
MINIMAL_FA=$(find public -name "*fontawesome-minimal*.css" | head -1)
if [ -f "$MINIMAL_FA" ]; then
    FA_SIZE=$(stat -f%z "$MINIMAL_FA" 2>/dev/null || stat -c%s "$MINIMAL_FA" 2>/dev/null)
    print_success "FontAwesome minimal found: ${FA_SIZE} bytes"
else
    print_warning "FontAwesome minimal not found"
fi

WEBP_COUNT=$(find public -name "*.webp" | wc -l | tr -d ' ')
print_info "WebP images: $WEBP_COUNT"

# Step 3: Start development server
print_header "Step 3: Starting Development Server"

print_info "Starting Hugo development server..."
print_highlight "Server will be available at: http://localhost:1313"

# Check if port 1313 is already in use
if lsof -Pi :1313 -sTCP:LISTEN -t >/dev/null; then
    print_warning "Port 1313 is already in use"
    read -p "Kill existing process and continue? (y/N): " kill_process
    if [[ $kill_process =~ ^[Yy]$ ]]; then
        lsof -ti:1313 | xargs kill -9 2>/dev/null || true
        sleep 2
    else
        print_info "Using existing server on port 1313"
    fi
fi

# Start Hugo server in background
print_info "Starting Hugo server (Ctrl+C to stop)..."

hugo server --bind=0.0.0.0 --baseURL=http://localhost:1313 --navigateToChanged --disableFastRender &
HUGO_PID=$!

# Wait for server to start
print_info "Waiting for server to start..."
sleep 3

# Check if server is running
if ! curl -s http://localhost:1313 > /dev/null; then
    print_warning "Server may not be fully ready yet. Trying again..."
    sleep 2
fi

if curl -s http://localhost:1313 > /dev/null; then
    print_success "Hugo server is running!"
else
    echo "Error: Failed to start Hugo server"
    kill $HUGO_PID 2>/dev/null
    exit 1
fi

# Step 4: Manual verification guide
print_header "Step 4: Manual Verification Guide"

echo ""
print_highlight "🌐 WEBSITE URL: http://localhost:1313"
echo ""

print_info "Please open your browser and follow these verification steps:"
echo ""

echo "📋 VERIFICATION CHECKLIST:"
echo "========================="
echo ""

echo "✅ 1. BASIC FUNCTIONALITY"
echo "   • Open: http://localhost:1313"
echo "   • Verify site loads correctly"
echo "   • Check homepage displays properly"
echo "   • Test navigation between pages"
echo ""

echo "✅ 2. PERFORMANCE OPTIMIZATIONS (Browser DevTools)"
echo "   • Open DevTools (F12)"
echo "   • Go to Network tab, reload page"
echo "   • Look for 'fontawesome-minimal' file (~1KB) ✓"
echo "   • Verify NO large FontAwesome files (~79KB) ✓"
echo "   • Check WebP images are loading ✓"
echo "   • Verify preload/preconnect hints in HTML ✓"
echo ""

echo "✅ 3. LIGHTHOUSE PERFORMANCE AUDIT"
echo "   • Open DevTools → Lighthouse tab"
echo "   • Select 'Performance' category"
echo "   • Click 'Generate report'"
echo "   • Target scores:"
echo "     - Performance: 85+ ✓"
echo "     - LCP: ≤2500ms ✓"
echo "     - CLS: ≤0.10 ✓"
echo ""

echo "✅ 4. CORE WEB VITALS (Performance tab)"
echo "   • Open DevTools → Performance tab"
echo "   • Record page load"
echo "   • Check Web Vitals panel:"
echo "     - First Contentful Paint ✓"
echo "     - Largest Contentful Paint ✓"
echo "     - Cumulative Layout Shift ✓"
echo ""

echo "✅ 5. VISUAL VERIFICATION"
echo "   • Images load properly with aspect ratios ✓"
echo "   • No layout shifts during load ✓"
echo "   • FontAwesome icons display correctly ✓"
echo "   • Responsive design works on mobile ✓"
echo ""

# Interactive verification
echo ""
print_highlight "🔍 SPECIFIC CHECKS TO PERFORM:"
echo ""

echo "1. Network Tab Verification:"
echo "   • Reload page with Network tab open"
echo "   • Sort by Size (largest first)"
echo "   • Should see minimal FontAwesome (~1KB) instead of large (~79KB)"
echo ""

echo "2. Elements Tab Verification:"
echo "   • Look at <head> section"
echo "   • Find preload hints: <link rel='preload' href='/fontawesome/webfonts/...'"
echo "   • Find preconnect: <link rel='preconnect' href='https://umami.robert-jensen.dk'>"
echo ""

echo "3. Performance Testing:"
echo "   • Run Lighthouse audit"
echo "   • Check for 'Serve images in next-gen formats' (should pass)"
echo "   • Check for 'Remove unused CSS' (FontAwesome should be optimized)"
echo ""

# Wait for user confirmation
echo ""
print_highlight "⏳ MANUAL TESTING IN PROGRESS..."
echo "   Server running at: http://localhost:1313"
echo "   PID: $HUGO_PID"
echo ""

# Function to handle cleanup on exit
cleanup() {
    print_info "Stopping Hugo server..."
    kill $HUGO_PID 2>/dev/null
    wait $HUGO_PID 2>/dev/null
    print_info "Server stopped"
}

# Set trap to cleanup on exit
trap cleanup EXIT

echo "Please complete the manual verification steps above."
echo ""
read -p "Press Enter when you've completed manual testing, or Ctrl+C to stop..."

print_success "Manual verification completed!"

# Ask for verification results
echo ""
print_highlight "📊 VERIFICATION RESULTS"
echo "Please confirm your findings:"
echo ""

read -p "Did the site load correctly? (y/N): " site_works
read -p "Did you see the minimal FontAwesome file (~1KB)? (y/N): " fa_optimized
read -p "Did Lighthouse show good performance scores? (y/N): " lighthouse_good
read -p "Were there any layout shifts or visual issues? (y/N): " layout_issues

echo ""
echo "📋 VERIFICATION SUMMARY:"
echo "======================="

if [[ $site_works =~ ^[Yy]$ ]]; then
    print_success "✅ Site functionality: PASS"
else
    print_warning "❌ Site functionality: FAIL"
fi

if [[ $fa_optimized =~ ^[Yy]$ ]]; then
    print_success "✅ FontAwesome optimization: PASS"
else
    print_warning "❌ FontAwesome optimization: FAIL"
fi

if [[ $lighthouse_good =~ ^[Yy]$ ]]; then
    print_success "✅ Lighthouse performance: PASS"
else
    print_warning "❌ Lighthouse performance: FAIL"
fi

if [[ $layout_issues =~ ^[Yy]$ ]]; then
    print_warning "❌ Layout stability: ISSUES FOUND"
else
    print_success "✅ Layout stability: PASS"
fi

echo ""
if [[ $site_works =~ ^[Yy]$ ]] && [[ $fa_optimized =~ ^[Yy]$ ]] && [[ $lighthouse_good =~ ^[Yy]$ ]] && [[ ! $layout_issues =~ ^[Yy]$ ]]; then
    print_success "🎉 ALL MANUAL TESTS PASSED!"
    print_info "Site optimizations are working correctly"
else
    print_warning "⚠️ Some tests failed - review optimizations"
fi

echo ""
print_info "Manual verification completed"
print_info "Server will stop automatically"

exit 0