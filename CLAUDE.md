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
- [ ] **Unused CSS/JS**: Remove unused code to reduce bundle sizes
- [ ] **Compression**: Enable gzip/brotli compression for text assets (server-level)
- [ ] **Browser Caching**: Implement proper caching headers for static assets (server-level)
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

### Recent Optimizations Completed (Latest Update)
- ✅ **Hugo Extended**: Enabled advanced asset processing in CI/CD pipeline
- ✅ **Aggressive Minification**: HTML, CSS, JS, JSON, SVG, XML all optimized
- ✅ **Asset Fingerprinting**: Content hashes for cache busting implemented
- ✅ **Build Statistics**: Performance monitoring enabled
- ✅ **Image Processing**: Quality optimization (85%) and smart anchor configured

### Next Priority Items
1. **Unused CSS/JS**: Remove unused code to reduce bundle sizes
2. **Third-party Scripts**: Optimize Google Analytics and Umami tracking load
3. **Mobile Performance**: Focus on mobile-specific optimizations
4. **Service Worker**: Consider implementing service worker for offline support

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