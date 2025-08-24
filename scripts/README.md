# Hugo Performance Testing Scripts

This directory contains automated testing scripts to verify Hugo site optimizations and performance improvements.

## Available Scripts

### 1. `test-performance.sh`
**Main performance testing script** - Runs comprehensive performance analysis after Hugo builds.

```bash
./scripts/test-performance.sh
```

**What it checks:**
- ✅ FontAwesome optimization (minimal vs original)
- ✅ Critical resource loading (performance CSS)
- ✅ HTML structure validation
- ✅ Image optimization (WebP, lazy loading)
- ✅ Asset minification and compression
- ✅ Bundle size analysis

**Sample Output:**
```
🚀 Starting Hugo Performance Testing...
📊 Performance Analysis
======================
✅ Minimal FontAwesome found: 990 bytes
✅ Original FontAwesome: 80888 bytes  
✅ Size reduction: 98.7%
✅ WebP images found: 11 instances
🎯 Most optimizations working (4/6)
```

### 2. `validate-html.sh`
**Detailed HTML validation** - Comprehensive checks for performance optimizations.

```bash
./scripts/validate-html.sh
```

**What it validates:**
- 🏠 Homepage HTML structure
- 🚀 Performance optimizations (preload, preconnect, etc.)
- 🖼️ Image optimizations (WebP, lazy loading, srcset)
- 🔤 Font optimizations (display: swap, preloading)
- 📱 Mobile & accessibility features
- ⚡ Core Web Vitals optimizations
- 🔒 Security & SEO (canonical, meta tags, structured data)

### 3. `dev-with-testing.sh`
**Interactive development environment** - Menu-driven development with testing options.

```bash
./scripts/dev-with-testing.sh
```

**Menu Options:**
1. Run performance test
2. Start Hugo server
3. Build and test
4. Quick validation check
5. Check asset sizes
q. Quit

## Usage Workflow

### After Making Changes
```bash
# Option 1: Quick test
./scripts/test-performance.sh

# Option 2: Detailed validation
./scripts/validate-html.sh

# Option 3: Interactive development
./scripts/dev-with-testing.sh
```

### Development Server with Testing
```bash
# Start interactive development environment
./scripts/dev-with-testing.sh

# Choose option 2 to start Hugo server
# Choose option 1 to run performance tests
# Choose option 4 for quick validation
```

## Performance Metrics Tracked

### Bundle Sizes
- **FontAwesome**: Original (~79KB) vs Minimal (~1KB) = 98.7% reduction
- **Performance CSS**: Critical optimizations (~1KB)
- **Main CSS**: Theme styles (~18KB)
- **JavaScript**: Minimal required functionality

### Optimizations Verified
- ✅ **Core Web Vitals**: Layout shift prevention, LCP optimization
- ✅ **Critical CSS**: Inlined above-the-fold styles
- ✅ **Resource Hints**: Preload, preconnect, dns-prefetch
- ✅ **Font Loading**: font-display: swap, preloading
- ✅ **Image Optimization**: WebP format, lazy loading, responsive
- ✅ **Asset Minification**: CSS/JS compression with integrity hashes

### Test Results
- **100% Pass Rate**: All optimizations working perfectly
- **80-99% Pass Rate**: Most optimizations working (good)
- **60-79% Pass Rate**: Room for improvement
- **<60% Pass Rate**: Many optimizations missing

## Integration with Hugo Commands

### Standard Hugo Commands
```bash
# Build site
hugo --minify

# Development server
hugo server

# Build and test in one command
hugo --minify && ./scripts/test-performance.sh
```

### Recommended Workflow
1. Make changes to content/CSS/JS
2. Run `./scripts/test-performance.sh` to verify optimizations
3. If tests pass, continue development
4. If tests fail, check specific issues and fix
5. Use `hugo server` for live development
6. Run full validation before deployment

## Error Troubleshooting

### Common Issues

**"Public directory not found"**
- Run `hugo --minify` first to build the site

**"Minimal FontAwesome not found"**
- Check that `fontawesome-minimal.css` is in `assets/css/`
- Verify it's included in `config.toml` customCss array

**"Preload hints not found"**
- Check that custom `head.html` partial is being loaded
- Verify theme override is working correctly

**"Large CSS files found"**
- Original FontAwesome files are still being loaded
- Check theme configuration to disable default FontAwesome

### Performance Targets
- **LCP**: ≤2500ms (Largest Contentful Paint)
- **INP**: ≤200ms (Interaction to Next Paint)  
- **CLS**: ≤0.10 (Cumulative Layout Shift)
- **CSS bundles**: <50KB each
- **JS bundles**: <100KB each
- **FontAwesome**: <1KB (vs 79KB original)

## Future Enhancements

### Planned Features
- [ ] Lighthouse CI integration
- [ ] Real User Monitoring (RUM) data
- [ ] Performance budgets with alerts
- [ ] Mobile-specific testing
- [ ] Network throttling simulation

### Advanced Testing
```bash
# Run with detailed output
DEBUG=1 ./scripts/test-performance.sh

# Test specific optimizations only
./scripts/validate-html.sh | grep "PASS"

# Monitor file sizes during development
watch -n 2 './scripts/dev-with-testing.sh choice=5'
```

## Contributing

When adding new optimizations:
1. Update test scripts to verify the new optimization
2. Add test cases to validation scripts
3. Update this README with new metrics
4. Test across different browsers/devices