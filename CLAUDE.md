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
- [ ] **Image Optimization**: Implement next-gen image formats (WebP/AVIF) and responsive images
- [ ] **CSS Optimization**: Minify and inline critical CSS, defer non-critical CSS
- [ ] **JavaScript Optimization**: Minify JavaScript and implement code splitting
- [ ] **Font Loading**: Optimize web font loading with font-display: swap
- [ ] **Core Web Vitals**: Address Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS)

### Medium Priority  
- [ ] **Render-blocking Resources**: Eliminate render-blocking CSS and JavaScript
- [ ] **Unused CSS/JS**: Remove unused code to reduce bundle sizes
- [ ] **Compression**: Enable gzip/brotli compression for text assets
- [ ] **Browser Caching**: Implement proper caching headers for static assets
- [ ] **Preload Critical Resources**: Add `<link rel="preload">` for critical assets

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
- Consider implementing Hugo Pipes for CSS/JS optimization  
- Test changes with lighthouse CI in GitHub Actions (both mobile and desktop)
- Monitor Core Web Vitals in Google Search Console for both mobile and desktop
- Mobile performance often significantly worse than desktop - prioritize mobile optimization
- Test on real mobile devices and slower network conditions