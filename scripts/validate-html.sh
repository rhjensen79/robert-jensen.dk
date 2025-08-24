#!/bin/bash

# HTML Validation and Optimization Checker
# Validates HTML structure and checks for performance optimizations

set -e

echo "🔍 HTML Validation and Optimization Checker"
echo "==========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Check if public directory exists
if [ ! -d "public" ]; then
    print_error "Public directory not found. Run 'hugo --minify' first."
    exit 1
fi

TOTAL_TESTS=0
PASSED_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "$test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_error "$test_name"
    fi
}

echo ""
echo "🏠 Testing Homepage (index.html)"
echo "==============================="

INDEX_FILE="public/index.html"

if [ ! -f "$INDEX_FILE" ]; then
    print_error "index.html not found"
    exit 1
fi

# Basic HTML structure tests
run_test "HTML5 doctype present" "grep -q '<!doctype html>' '$INDEX_FILE'"
run_test "UTF-8 charset declared" "grep -q 'charset=utf-8' '$INDEX_FILE'"
run_test "Viewport meta tag present" "grep -q 'viewport.*width=device-width' '$INDEX_FILE'"
run_test "Language attribute set" "grep -q 'html.*lang=' '$INDEX_FILE'"

echo ""
echo "🚀 Performance Optimizations"
echo "============================"

# Performance optimization tests
run_test "Minimal FontAwesome CSS loaded" "grep -q 'fontawesome-minimal' '$INDEX_FILE'"
run_test "Performance CSS loaded" "grep -q 'performance.*css' '$INDEX_FILE'"
run_test "Preload hints present" "grep -q 'rel=\"preload\"' '$INDEX_FILE'"
run_test "Preconnect hints present" "grep -q 'rel=\"preconnect\"' '$INDEX_FILE'"
run_test "DNS prefetch present" "grep -q 'rel=\"dns-prefetch\"' '$INDEX_FILE'"

echo ""
echo "🖼️ Image Optimizations"
echo "======================"

# Image optimization tests
run_test "WebP images present" "grep -q '\.webp' '$INDEX_FILE'"
run_test "Lazy loading implemented" "grep -q 'loading=\"lazy\"' '$INDEX_FILE'"
run_test "Image dimensions specified" "grep -q 'width=.*height=' '$INDEX_FILE'"
run_test "Responsive images (srcset)" "grep -q 'srcset=' '$INDEX_FILE'"
run_test "Picture elements for WebP" "grep -q '<picture>' '$INDEX_FILE'"

echo ""
echo "🔤 Font Optimizations"
echo "==================="

# Font optimization tests
run_test "Font display swap implemented" "find public -name '*.css' -exec grep -l 'font-display.*swap' {} \; | head -1"
run_test "Font preloading present" "grep -q 'preload.*font' '$INDEX_FILE'"

echo ""
echo "📱 Mobile & Accessibility"
echo "========================="

# Mobile and accessibility tests
run_test "Touch-friendly navigation" "grep -q 'navbar-burger' '$INDEX_FILE'"
run_test "Semantic HTML structure" "grep -q -E '<main|<nav|<header|<footer|<article|<section' '$INDEX_FILE'"
run_test "Alt text on images" "grep -q 'alt=' '$INDEX_FILE'"
run_test "ARIA labels present" "grep -q 'aria-' '$INDEX_FILE'"

echo ""
echo "⚡ Core Web Vitals"
echo "=================="

# Core Web Vitals related tests
ASPECT_RATIO_FOUND=false
if find public -name "*.css" -exec grep -l "aspect-ratio" {} \; | head -1 > /dev/null; then
    ASPECT_RATIO_FOUND=true
fi

if [ "$ASPECT_RATIO_FOUND" = true ]; then
    print_success "Aspect-ratio CSS (prevents CLS)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_error "Aspect-ratio CSS (prevents CLS)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

run_test "Fetchpriority attributes" "grep -q 'fetchpriority=' '$INDEX_FILE'"
run_test "Async/defer scripts" "grep -q -E 'async|defer' '$INDEX_FILE'"

echo ""
echo "🔒 Security & SEO"
echo "================"

# Security and SEO tests
run_test "Canonical URL present" "grep -q 'rel=\"canonical\"' '$INDEX_FILE'"
run_test "Open Graph meta tags" "grep -q 'property=\"og:' '$INDEX_FILE'"
run_test "Twitter Card meta tags" "grep -q 'name=\"twitter:' '$INDEX_FILE'"
run_test "Structured data (JSON-LD)" "grep -q 'application/ld+json' '$INDEX_FILE'"
run_test "CSP or security headers" "grep -q -E 'crossorigin|integrity' '$INDEX_FILE'"

echo ""
echo "📊 Asset Analysis"
echo "================="

# Count various assets
CSS_COUNT=$(grep -o 'href="[^"]*\.css' "$INDEX_FILE" | wc -l | tr -d ' ')
JS_COUNT=$(grep -o 'src="[^"]*\.js' "$INDEX_FILE" | wc -l | tr -d ' ')
IMG_COUNT=$(grep -o -E '<img[^>]*src=' "$INDEX_FILE" | wc -l | tr -d ' ')
WEBP_COUNT=$(grep -c '\.webp' "$INDEX_FILE" || echo "0")

echo "CSS files loaded: $CSS_COUNT"
echo "JavaScript files loaded: $JS_COUNT"  
echo "Images on homepage: $IMG_COUNT"
echo "WebP images: $WEBP_COUNT"

# Check for large assets
print_info "Checking for oversized assets..."

LARGE_CSS_FILES=$(find public -name "*.css" -size +50k | wc -l | tr -d ' ')
LARGE_JS_FILES=$(find public -name "*.js" -size +100k | wc -l | tr -d ' ')

if [ "$LARGE_CSS_FILES" -gt 0 ]; then
    print_warning "$LARGE_CSS_FILES CSS files larger than 50KB found"
    find public -name "*.css" -size +50k -exec ls -lah {} \;
else
    print_success "All CSS files under 50KB"
fi

if [ "$LARGE_JS_FILES" -gt 0 ]; then
    print_warning "$LARGE_JS_FILES JS files larger than 100KB found"
    find public -name "*.js" -size +100k -exec ls -lah {} \;
else
    print_success "All JS files under 100KB"
fi

echo ""
echo "📝 Test Summary"
echo "=============="

PASS_RATE=$(echo "scale=1; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc -l)

echo "Tests passed: $PASSED_TESTS/$TOTAL_TESTS ($PASS_RATE%)"

if [ "$PASS_RATE" = "100.0" ]; then
    print_success "🎉 All tests passed! Site is fully optimized."
elif (( $(echo "$PASS_RATE >= 80" | bc -l) )); then
    print_success "✅ Most optimizations in place ($PASS_RATE% pass rate)"
elif (( $(echo "$PASS_RATE >= 60" | bc -l) )); then
    print_warning "⚠️ Good progress but room for improvement ($PASS_RATE% pass rate)"
else
    print_error "❌ Many optimizations missing ($PASS_RATE% pass rate)"
fi

echo ""
print_info "HTML validation completed!"

exit 0