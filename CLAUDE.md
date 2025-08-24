# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Hugo-based personal blog for Robert Jensen (robert-jensen.dk). The site uses the Anatole theme and is deployed to GitHub Pages via GitHub Actions.

## Build and Development Commands

### Local Development
- `hugo server` - Start the development server (typically runs on http://localhost:1313)
- `hugo server -D` - Start server including draft posts
- `hugo server --bind=0.0.0.0` - Bind to all interfaces for remote access

### Building
- `hugo` - Build the static site to `/public` directory
- `hugo --minify` - Build with minification enabled
- `hugo --baseURL "https://your-domain.com/"` - Build with custom base URL

### Content Management
- `hugo new posts/your-post-title/index.md` - Create new blog post
- `hugo new events/your-event.md` - Create new event page

## Architecture

### Key Directories
- `content/` - Markdown content files
  - `posts/` - Blog posts organized by year and title
  - `events/` - Event presentations and materials
  - `about/` - About page content
- `static/` - Static assets (images, PDFs, etc.)
- `themes/` - Hugo theme files (using Anatole theme as Go module)
- `config.toml` - Site configuration
- `public/` - Generated static site (ignored in git)

### Theme and Configuration
- Uses Anatole theme (v1.16.2) loaded as Go module
- Theme configuration in `config.toml`
- Google Analytics and Umami tracking configured
- Utterances comments integration
- Social media links configured for GitHub, BlueSky, LinkedIn, YouTube

### Content Structure
- Blog posts use bundle format (each post in its own directory with `index.md`)
- Events contain PDFs and presentations
- Static images stored in `/static/images/`
- Profile image and favicon configured

### Deployment
- Automated deployment via GitHub Actions (`.github/workflows/hugo.yml`)
- Builds on push to master branch
- Uses Hugo v0.147.0 in CI/CD
- Deploys to GitHub Pages
- Triggers profile update on rhjensen79/rhjensen79 repo after deployment

### Hugo Version
- CI uses Hugo v0.147.0
- Local development should use Hugo extended version with latest updates

### Testing and Development
- **Performance Testing**: `./scripts/test-performance.sh` - Comprehensive performance analysis
- **HTML Validation**: `./scripts/validate-html.sh` - Detailed optimization validation
- **Development Environment**: `./scripts/dev-with-testing.sh` - Interactive development with testing
- **Testing Documentation**: `./scripts/README.md` - Complete testing setup guide

### Testing Results
- **FontAwesome Optimization**: 98.7% size reduction (79KB → 990B)
- **Asset Compression**: All CSS/JS files minified with integrity hashes
- **Image Optimization**: 601 WebP images, 426 JPG fallbacks
- **Core Web Vitals**: Layout shift prevention, critical CSS, preload hints
- **Performance Score**: 4/6 major optimizations verified ✅

## Performance Optimization TODO

Based on PageSpeed Insights analysis, the following performance improvements should be implemented:

### High Priority
- [x] **Image Optimization**: ✅ COMPLETED - Implemented next-gen image formats (WebP) and responsive images with automatic processing
- [x] **CSS Optimization**: ✅ COMPLETED - Minify and inline critical CSS, defer non-critical CSS
- [x] **JavaScript Optimization**: ✅ COMPLETED - Minify JavaScript and implement code splitting
- [x] **Font Loading**: ✅ COMPLETED - Optimized web font loading with font-display: swap
- [x] **Core Web Vitals**: ✅ COMPLETED - Addressed LCP, FID, and CLS with optimizations
- [x] **Critical Resource Preloading**: ✅ COMPLETED - Added preload hints and preconnect for critical resources

### Medium Priority  
- [x] **Render-blocking Resources**: ✅ COMPLETED - Eliminated render-blocking CSS and JavaScript through minification
- [x] **Unused CSS/JS**: ✅ COMPLETED - Removed unused FontAwesome icons (98.7% reduction from 79KB to 990B), optimized CSS
- [x] **Compression**: ✅ COMPLETED - Enabled gzip compression for HTML, CSS, JS, JSON, XML, TXT, SVG files via _headers
- [x] **Browser Caching**: ✅ COMPLETED - Comprehensive caching strategy implemented: 1yr for images/fonts/CSS/JS, 1wk for PDFs, 1day for JSON, 1hr for XML, immediate revalidation for HTML
- [x] **Preload Critical Resources**: ✅ COMPLETED - Asset fingerprinting and integrity hashes implemented

### Low Priority
- [ ] **Third-party Scripts**: Optimize Google Analytics and Umami tracking load
- [ ] **Social Media Embeds**: Lazy load social media widgets and embeds
- [ ] **Image Lazy Loading**: Implement native lazy loading for below-fold images
- [ ] **Service Worker**: Consider implementing service worker for caching strategy

### Mobile-Specific Optimizations
- [ ] **Mobile Performance**: Mobile scores typically lower than desktop - requires specific attention
- [ ] **Touch Target Size**: Ensure buttons/links meet 44px minimum touch target size
- [ ] **Viewport Configuration**: Optimize mobile viewport and responsive design
- [ ] **Mobile-First CSS**: Prioritize mobile CSS delivery and reduce mobile-specific render blocking
- [ ] **Touch Interactions**: Optimize touch event handling and reduce input latency
- [ ] **Mobile Image Optimization**: Serve appropriately sized images for mobile viewports
- [ ] **Mobile Font Loading**: Optimize font loading specifically for mobile connections

### Implementation Notes
- Use Hugo's built-in image processing for responsive images
- ✅ Hugo Pipes implemented for CSS/JS optimization with aggressive minification
- Test changes with lighthouse CI in GitHub Actions (both mobile and desktop)
- Monitor Core Web Vitals in Google Search Console for both mobile and desktop
- Mobile performance often significantly worse than desktop - prioritize mobile optimization
- Test on real mobile devices and slower network conditions

### Required Testing Workflow
**IMPORTANT**: Before marking any performance/SEO optimization task as completed, ALWAYS follow this testing workflow:

1. **Start Local Server**: Run `hugo server --bind=0.0.0.0 --port=1313` for testing
2. **User Validation**: Wait for user to test and validate the changes at http://localhost:1313
3. **User Approval**: Only mark task complete after user confirms the implementation works correctly
4. **No Assumptions**: Never assume implementation works without user testing and approval

This ensures all optimizations are properly validated before being marked as complete.

### Recent Optimizations Completed (Latest Update)
- ✅ **Hugo Extended**: Enabled advanced asset processing in CI/CD pipeline
- ✅ **Aggressive Minification**: HTML, CSS, JS, JSON, SVG, XML all optimized
- ✅ **Asset Fingerprinting**: Content hashes for cache busting implemented
- ✅ **Build Statistics**: Performance monitoring enabled
- ✅ **Image Processing**: Quality optimization (85%) and smart anchor configured
- ✅ **PageSpeed Issues Fixed**: All major performance issues resolved
  - ✅ Image delivery optimization with fetchpriority and lazy loading
  - ✅ Cache lifetimes with proper headers (_headers file)
  - ✅ Render blocking requests eliminated with preload/async
  - ✅ Font display optimization with swap and preload
  - ✅ Layout shift prevention with aspect ratios and dimensions
  - ✅ LCP request discovery with high priority preloading
- ✅ **Service Worker**: Implemented for offline caching and performance
- ✅ **Layout Issues Fixed**: Resolved homepage display problems
  - ✅ Fixed broken custom baseof.html overriding theme
  - ✅ Fixed aggressive CSS breaking image layouts
  - ✅ Restored proper homepage with post previews and thumbnails
  - ✅ Maintained performance optimizations with theme compatibility

### PageSpeed Insights Analysis Tasks (2024)

Based on recent PageSpeed Insights reports analysis, the following performance optimizations should be implemented:

#### Critical Performance Tasks
- [x] **Core Web Vitals Optimization**: ✅ COMPLETED - Implemented layout shift prevention, critical CSS, and performance optimizations
- [x] **First Contentful Paint**: ✅ COMPLETED - Added critical CSS inlining and optimized above-fold content
- [ ] **Time to First Byte**: Improve server response time to ≤800ms (server-level optimization)
- [x] **Interaction to Next Paint**: ✅ COMPLETED - Optimized animations and reduced repaints
- [ ] **Mobile Performance Gap**: Address mobile vs desktop performance disparities

#### Asset Optimization Tasks  
- [x] **Unused CSS Removal**: ✅ COMPLETED - Created minimal FontAwesome with 98.7% size reduction, optimized performance CSS
- [x] **Unused JavaScript Removal**: ✅ COMPLETED - Audited JS files, all current JS is necessary for functionality
- [x] **Critical Resource Prioritization**: ✅ COMPLETED - Added preload/preconnect for fonts and external resources
- [ ] **Third-party Script Optimization**: Optimize Google Analytics and Umami tracking load timing
- [x] **Font Loading Enhancement**: ✅ COMPLETED - Implemented font-display: swap and preload for critical fonts

#### Layout and Rendering Tasks
- [x] **Layout Shift Prevention**: ✅ COMPLETED - Added aspect-ratio properties and proper image sizing to prevent CLS
- [x] **Render-blocking Resource Elimination**: ✅ COMPLETED - Implemented critical CSS inlining and resource optimization
- [x] **Above-fold Content Optimization**: ✅ COMPLETED - Critical CSS for above-fold content prioritized
- [x] **Image Lazy Loading Enhancement**: ✅ COMPLETED - Native lazy loading already implemented in render-image.html
- [x] **Responsive Image Optimization**: ✅ COMPLETED - Responsive images with WebP format and proper sizing implemented

#### Mobile-Specific Performance Tasks
- [ ] **Mobile-First CSS Delivery**: Prioritize mobile CSS and reduce render blocking
- [ ] **Touch Target Optimization**: Ensure 44px minimum touch target sizes
- [ ] **Mobile Image Sizing**: Serve appropriately sized images for mobile viewports  
- [ ] **Mobile Font Loading**: Optimize font loading for mobile connections
- [ ] **Touch Interaction Optimization**: Reduce touch event latency

#### Server and Caching Tasks
- [ ] **Server Response Time**: Optimize backend response times
- [x] **Browser Caching Headers**: ✅ COMPLETED - Comprehensive cache-control headers implemented via _headers file
- [x] **Compression Enhancement**: ✅ COMPLETED - gzip compression enabled for all text assets (HTML, CSS, JS, JSON, XML, TXT, SVG)
- [ ] **CDN Optimization**: Verify optimal CDN configuration for global delivery
- [ ] **HTTP/2 Push**: Implement HTTP/2 server push for critical resources

#### Monitoring and Testing Tasks
- [ ] **Lighthouse CI Integration**: Set up automated performance testing
- [ ] **Core Web Vitals Monitoring**: Implement real user monitoring (RUM)
- [ ] **Performance Budget**: Establish and monitor performance budgets
- [ ] **Mobile Testing**: Regular testing on actual mobile devices
- [ ] **Network Condition Testing**: Test on slower network conditions

### Next Priority Items (Updated - August 2025)
1. ✅ **Core Web Vitals**: COMPLETED - Implemented layout shift prevention, critical CSS, performance optimizations
2. ✅ **Unused Code Removal**: COMPLETED - 98.7% reduction in FontAwesome size, optimized CSS structure
3. ✅ **Server-Level Optimizations**: COMPLETED - Compression and comprehensive caching headers implemented via _headers
4. **Mobile Performance**: Address mobile-specific optimization gaps
5. **Third-party Scripts**: Optimize Analytics and tracking script loading

## SEO Optimization TODO

Based on comprehensive SEO analysis of robert-jensen.dk, the following improvements should be implemented:

### High Priority SEO Items
- [ ] **Meta Tags Enhancement**: Add explicit title and meta description tags for all pages
- [ ] **Heading Structure**: Standardize H1/H2 hierarchy across all blog posts
- [ ] **Image Alt Text**: ✅ COMPLETED - Add descriptive alt text to all images
- [ ] **Internal Linking**: ✅ COMPLETED - Enhance contextual internal links between related posts
- [ ] **Structured Data**: Expand JSON-LD to include post-specific metadata

### Medium Priority SEO Items
- [ ] **Content Strategy**: Develop comprehensive topic clusters around core themes
- [ ] **Accessibility**: Ensure WCAG color contrast compliance and keyboard navigation
- [ ] **URL Structure**: Optimize permalink structure for better SEO
- [ ] **Breadcrumb Navigation**: Implement breadcrumb schema and navigation
- [ ] **Social Media Tags**: Enhance Open Graph and Twitter Card metadata

### Low Priority SEO Items
- [ ] **Site Speed**: ✅ PARTIALLY COMPLETED - Implement lazy loading for images
- [ ] **XML Sitemap**: Verify sitemap optimization and submission
- [ ] **Robots.txt**: Optimize crawling directives
- [ ] **Schema Markup**: Add article-specific schema for better rich snippets
- [ ] **Mobile SEO**: Optimize mobile-specific SEO elements

### Content SEO Strategy
- [ ] **Keyword Research**: Conduct keyword analysis for core topics (K8s, DevOps, VMware)
- [ ] **Content Gaps**: Identify missing content opportunities in technical niche
- [ ] **Publishing Schedule**: Maintain consistent content publication
- [ ] **Topic Clusters**: Create pillar pages for main topics with supporting content
- [ ] **User Intent**: Optimize content for different search intents (how-to, troubleshooting, tutorials)
- aways save and read from claude.md task list. so it's updated