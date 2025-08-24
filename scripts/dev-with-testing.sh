#!/bin/bash

# Hugo Development with Live Testing
# This script starts Hugo server and provides testing commands

set -e

echo "🔧 Hugo Development Environment with Testing"
echo "============================================"

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_menu() {
    echo ""
    echo "🛠️  Available Commands:"
    echo "======================"
    echo "1. Run performance test (./scripts/test-performance.sh)"
    echo "2. Start Hugo server (hugo server)"
    echo "3. Build and test (hugo --minify && ./scripts/test-performance.sh)"
    echo "4. Quick validation check"
    echo "5. Check asset sizes"
    echo "q. Quit"
    echo ""
}

quick_validation() {
    print_info "Running quick validation..."
    
    if [ ! -d "public" ]; then
        print_info "Building site first..."
        hugo --minify --quiet
    fi
    
    # Quick checks
    WEBP_COUNT=$(find public -name "*.webp" | wc -l | tr -d ' ')
    CSS_COUNT=$(find public -name "*.min.*.css" | wc -l | tr -d ' ')
    
    echo "WebP images: $WEBP_COUNT"
    echo "Minified CSS files: $CSS_COUNT"
    
    if [ -f "public/index.html" ]; then
        if grep -q "fontawesome-minimal" public/index.html; then
            print_success "✅ Minimal FontAwesome loaded"
        else
            echo "❌ Minimal FontAwesome not found"
        fi
        
        if grep -q "performance.min" public/index.html; then
            print_success "✅ Performance CSS loaded"
        else
            echo "❌ Performance CSS not found"
        fi
    fi
}

check_asset_sizes() {
    print_info "Checking asset sizes..."
    
    if [ ! -d "public" ]; then
        print_info "Building site first..."
        hugo --minify --quiet
    fi
    
    echo ""
    echo "📦 CSS Bundle Sizes:"
    find public -name "*.css" -exec ls -lah {} \; | awk '{print $5 "\t" $9}' | sort -hr
    
    echo ""
    echo "📦 JS Bundle Sizes:"
    find public -name "*.js" -exec ls -lah {} \; | awk '{print $5 "\t" $9}' | sort -hr
    
    echo ""
    echo "📦 FontAwesome Comparison:"
    FA_MINIMAL=$(find public -name "*fontawesome-minimal*.css" | head -1)
    FA_ORIGINAL=$(find public -name "fontawesome.min.*.css" | head -1)
    
    if [ -f "$FA_MINIMAL" ] && [ -f "$FA_ORIGINAL" ]; then
        ls -lah "$FA_MINIMAL" "$FA_ORIGINAL" | awk '{print $5 "\t" $9}'
    fi
}

# Check if we're in the right directory
if [ ! -f "config.toml" ]; then
    echo "Error: Must be run from Hugo site root directory"
    exit 1
fi

# Create scripts directory if it doesn't exist
mkdir -p scripts

print_info "Hugo site detected"
print_info "Current directory: $(pwd)"

if command -v hugo >/dev/null 2>&1; then
    HUGO_VERSION=$(hugo version | head -n1)
    print_success "Hugo found: $HUGO_VERSION"
else
    echo "Error: Hugo not found in PATH"
    exit 1
fi

# Main menu loop
while true; do
    print_menu
    read -p "Choose an option (1-5, q): " choice
    
    case $choice in
        1)
            print_info "Running performance test..."
            ./scripts/test-performance.sh
            ;;
        2)
            print_info "Starting Hugo development server..."
            print_info "Site will be available at: http://localhost:1313"
            print_info "Press Ctrl+C to stop the server"
            echo ""
            hugo server --bind=0.0.0.0 --baseURL=http://localhost:1313 --buildDrafts --navigateToChanged
            ;;
        3)
            print_info "Building and testing..."
            hugo --minify
            ./scripts/test-performance.sh
            ;;
        4)
            quick_validation
            ;;
        5)
            check_asset_sizes
            ;;
        q|Q)
            print_info "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid option. Please choose 1-5 or q."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done