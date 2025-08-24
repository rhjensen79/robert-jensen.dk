#!/bin/bash

# Hugo Performance Testing Script
# This script builds the site and validates optimizations

set -e  # Exit on any error

echo "🚀 Starting Hugo Performance Testing..."
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean previous build
print_status "Cleaning previous build..."
rm -rf public/

# Build the site with Hugo
print_status "Building site with Hugo..."
hugo --minify --printMemoryUsage --printPathWarnings

if [ $? -eq 0 ]; then
    print_success "Hugo build completed successfully"
else
    print_error "Hugo build failed"
    exit 1
fi

# Check if public directory exists
if [ ! -d "public" ]; then
    print_error "Public directory not found after build"
    exit 1
fi

print_success "Site built successfully"

echo ""
echo "📊 Performance Analysis"
echo "======================"

# Test 1: Check FontAwesome optimization
print_status "Testing FontAwesome optimization..."

MINIMAL_FA=$(find public -name "*fontawesome-minimal*.css" | head -1)
ORIGINAL_FA=$(find public -name "fontawesome.min.*.css" | head -1)

if [ -f "$MINIMAL_FA" ]; then
    MINIMAL_SIZE=$(stat -f%z "$MINIMAL_FA" 2>/dev/null || stat -c%s "$MINIMAL_FA" 2>/dev/null)
    print_success "Minimal FontAwesome found: ${MINIMAL_SIZE} bytes"
    
    if [ -f "$ORIGINAL_FA" ]; then
        ORIGINAL_SIZE=$(stat -f%z "$ORIGINAL_FA" 2>/dev/null || stat -c%s "$ORIGINAL_FA" 2>/dev/null)
        REDUCTION=$(echo "scale=1; (1 - $MINIMAL_SIZE / $ORIGINAL_SIZE) * 100" | bc -l 2>/dev/null || echo "N/A")
        print_success "Original FontAwesome: ${ORIGINAL_SIZE} bytes"
        print_success "Size reduction: ${REDUCTION}%"
    fi
else
    print_warning "Minimal FontAwesome CSS not found"
fi

# Test 2: Check critical resources
print_status "Checking critical resource optimization..."

# Check for performance CSS
PERF_CSS=$(find public -name "*performance*.css" | head -1)
if [ -f "$PERF_CSS" ]; then
    PERF_SIZE=$(stat -f%z "$PERF_CSS" 2>/dev/null || stat -c%s "$PERF_CSS" 2>/dev/null)
    print_success "Performance CSS found: ${PERF_SIZE} bytes"
else
    print_warning "Performance CSS not found"
fi

# Test 3: Validate HTML structure
print_status "Validating HTML structure..."

INDEX_FILE="public/index.html"
if [ -f "$INDEX_FILE" ]; then
    # Check for critical optimizations in HTML
    
    # Check for preload hints
    if grep -q "rel=\"preload\"" "$INDEX_FILE"; then
        print_success "Preload hints found in HTML"
    else
        print_warning "No preload hints found"
    fi
    
    # Check for preconnect
    if grep -q "rel=\"preconnect\"" "$INDEX_FILE"; then
        print_success "Preconnect hints found in HTML"
    else
        print_warning "No preconnect hints found"
    fi
    
    # Check for lazy loading
    if grep -q "loading=\"lazy\"" "$INDEX_FILE"; then
        print_success "Lazy loading implemented"
    else
        print_warning "Lazy loading not found"
    fi
    
    # Check for aspect-ratio CSS
    if grep -q "aspect-ratio" "$INDEX_FILE" || find public -name "*.css" -exec grep -l "aspect-ratio" {} \; | head -1 > /dev/null; then
        print_success "Aspect-ratio CSS found (prevents layout shift)"
    else
        print_warning "Aspect-ratio CSS not found"
    fi
    
    # Check for WebP images
    WEBP_COUNT=$(grep -c "\.webp" "$INDEX_FILE" || echo "0")
    if [ "$WEBP_COUNT" -gt 0 ]; then
        print_success "WebP images found: ${WEBP_COUNT} instances"
    else
        print_warning "No WebP images found"
    fi
    
else
    print_error "index.html not found"
fi

# Test 4: Check asset compression and minification
print_status "Checking asset optimization..."

# Check CSS minification
CSS_FILES=$(find public -name "*.css" | wc -l | tr -d ' ')
if [ "$CSS_FILES" -gt 0 ]; then
    print_success "CSS files generated: ${CSS_FILES}"
    
    # Check if CSS is minified (should be single line)
    MINIFIED_CSS=$(find public -name "*.min.*.css" | wc -l | tr -d ' ')
    print_success "Minified CSS files: ${MINIFIED_CSS}"
fi

# Check JS minification
JS_FILES=$(find public -name "*.js" | wc -l | tr -d ' ')
if [ "$JS_FILES" -gt 0 ]; then
    print_success "JavaScript files: ${JS_FILES}"
fi

# Test 5: Check image optimization
print_status "Checking image optimization..."

WEBP_FILES=$(find public -name "*.webp" | wc -l | tr -d ' ')
JPG_FILES=$(find public -name "*.jpg" | wc -l | tr -d ' ')

print_success "WebP images: ${WEBP_FILES}"
print_success "JPG images: ${JPG_FILES}"

# Test 6: Check file sizes
print_status "Analyzing bundle sizes..."

echo ""
echo "📦 Bundle Size Analysis"
echo "======================"

# Main CSS bundle
MAIN_CSS=$(find public -name "main.min.*.css" | head -1)
if [ -f "$MAIN_CSS" ]; then
    MAIN_CSS_SIZE=$(stat -f%z "$MAIN_CSS" 2>/dev/null || stat -c%s "$MAIN_CSS" 2>/dev/null)
    echo "Main CSS: $(echo "scale=1; $MAIN_CSS_SIZE / 1024" | bc -l)KB"
fi

# Performance CSS bundle
if [ -f "$PERF_CSS" ]; then
    echo "Performance CSS: $(echo "scale=1; $PERF_SIZE / 1024" | bc -l)KB"
fi

# FontAwesome comparison
if [ -f "$MINIMAL_FA" ] && [ -f "$ORIGINAL_FA" ]; then
    echo "FontAwesome Original: $(echo "scale=1; $ORIGINAL_SIZE / 1024" | bc -l)KB"
    echo "FontAwesome Minimal: $(echo "scale=1; $MINIMAL_SIZE / 1024" | bc -l)KB"
fi

echo ""
echo "🎯 Performance Summary"
echo "====================="

TOTAL_TESTS=6
PASSED_TESTS=0

# Count successful optimizations
[ -f "$MINIMAL_FA" ] && PASSED_TESTS=$((PASSED_TESTS + 1))
[ -f "$PERF_CSS" ] && PASSED_TESTS=$((PASSED_TESTS + 1))
grep -q "rel=\"preload\"" "$INDEX_FILE" 2>/dev/null && PASSED_TESTS=$((PASSED_TESTS + 1))
grep -q "loading=\"lazy\"" "$INDEX_FILE" 2>/dev/null && PASSED_TESTS=$((PASSED_TESTS + 1))
[ "$WEBP_COUNT" -gt 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))
[ "$MINIFIED_CSS" -gt 0 ] && PASSED_TESTS=$((PASSED_TESTS + 1))

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    print_success "All performance optimizations verified! ($PASSED_TESTS/$TOTAL_TESTS)"
elif [ $PASSED_TESTS -gt $((TOTAL_TESTS / 2)) ]; then
    print_warning "Most optimizations working ($PASSED_TESTS/$TOTAL_TESTS)"
else
    print_error "Several optimizations missing ($PASSED_TESTS/$TOTAL_TESTS)"
fi

echo ""
print_success "Performance testing completed!"

echo ""
echo "🧪 Manual Verification"
echo "===================="
print_status "Automated tests completed. Ready for manual verification."
echo ""
echo "To manually verify optimizations:"
echo "1. Run: hugo server (in another terminal)"
echo "2. Visit: http://localhost:1313"
echo "3. Use browser dev tools to verify:"
echo "   - Network tab: Check FontAwesome file size (~1KB vs ~79KB)"
echo "   - Performance tab: Check Core Web Vitals"
echo "   - Elements tab: Check for preload/preconnect hints"
echo "   - Lighthouse: Run performance audit"
echo ""
print_status "Or run './scripts/manual-test.sh' for guided verification"

exit 0