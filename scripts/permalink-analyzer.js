#!/usr/bin/env node

/**
 * Permalink Structure Analyzer
 * Analyzes current permalink structure and suggests SEO improvements
 * Usage: node scripts/permalink-analyzer.js [--apply-config]
 */

const fs = require('fs');
const path = require('path');

class PermalinkAnalyzer {
  constructor(options = {}) {
    this.applyConfig = options.applyConfig || false;
    this.posts = [];
    this.issues = [];
    this.suggestions = [];
  }

  loadPosts() {
    const postDirs = fs.readdirSync('content/posts')
      .filter(dir => fs.statSync(path.join('content/posts', dir)).isDirectory())
      .sort();

    this.posts = postDirs.map(dir => {
      const indexPath = path.join('content/posts', dir, 'index.md');
      if (!fs.existsSync(indexPath)) return null;

      const content = fs.readFileSync(indexPath, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      
      if (!frontmatterMatch) return null;

      const frontmatter = frontmatterMatch[1];
      
      // Parse frontmatter
      const title = (frontmatter.match(/title:\s*["'](.+)["']/) || [])[1] || dir;
      const dateMatch = frontmatter.match(/date:\s*(.+)/);
      const date = dateMatch ? new Date(dateMatch[1]) : new Date();
      
      // Check for custom slug or URL
      const slugMatch = frontmatter.match(/slug:\s*["'](.+)["']/);
      const urlMatch = frontmatter.match(/url:\s*["'](.+)["']/);
      
      // Analyze current permalink structure
      const currentUrl = `/posts/${dir}/`;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      return {
        dir,
        title,
        date,
        year,
        month,
        currentUrl,
        customSlug: slugMatch ? slugMatch[1] : null,
        customUrl: urlMatch ? urlMatch[1] : null,
        hasYear: dir.startsWith(year.toString()),
        wordCount: title.split(' ').length,
        titleLength: title.length,
        slug: this.generateOptimalSlug(title, date)
      };
    }).filter(Boolean);

    console.log(`📚 Loaded ${this.posts.length} blog posts for permalink analysis`);
  }

  generateOptimalSlug(title, date) {
    // Generate SEO-optimized slug
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Remove multiple consecutive hyphens
      .replace(/^-|-$/g, '')    // Remove leading/trailing hyphens
      .substring(0, 60);        // Limit length for SEO
  }

  analyzeCurrentStructure() {
    console.log('🔍 Analyzing current permalink structure...\n');

    // Analyze current URL patterns
    const patterns = {
      withYear: 0,
      withoutYear: 0,
      tooLong: 0,
      tooShort: 0,
      hasNumbers: 0,
      hasSpecialChars: 0,
      goodLength: 0
    };

    const lengthDistribution = {
      'under30': 0,
      '30-50': 0,
      '50-70': 0,
      'over70': 0
    };

    for (const post of this.posts) {
      const urlPath = post.currentUrl;
      const urlLength = urlPath.length;

      // Pattern analysis
      if (post.hasYear) patterns.withYear++;
      else patterns.withoutYear++;

      if (urlLength > 70) patterns.tooLong++;
      else if (urlLength < 30) patterns.tooShort++;
      else patterns.goodLength++;

      if (/\d/.test(post.dir)) patterns.hasNumbers++;
      if (/[^a-zA-Z0-9\-\/]/.test(urlPath)) patterns.hasSpecialChars++;

      // Length distribution
      if (urlLength < 30) lengthDistribution['under30']++;
      else if (urlLength <= 50) lengthDistribution['30-50']++;
      else if (urlLength <= 70) lengthDistribution['50-70']++;
      else lengthDistribution['over70']++;

      // Individual post analysis
      this.analyzePost(post);
    }

    console.log('📊 Current Permalink Structure Analysis:');
    console.log('━'.repeat(50));
    console.log(`Total posts: ${this.posts.length}`);
    console.log(`With year prefix: ${patterns.withYear} (${Math.round(patterns.withYear/this.posts.length*100)}%)`);
    console.log(`Without year: ${patterns.withoutYear} (${Math.round(patterns.withoutYear/this.posts.length*100)}%)`);
    console.log(`Good length (30-70 chars): ${patterns.goodLength} (${Math.round(patterns.goodLength/this.posts.length*100)}%)`);
    console.log(`Too long (>70 chars): ${patterns.tooLong} (${Math.round(patterns.tooLong/this.posts.length*100)}%)`);
    console.log(`Too short (<30 chars): ${patterns.tooShort} (${Math.round(patterns.tooShort/this.posts.length*100)}%)`);

    console.log('\n📏 URL Length Distribution:');
    Object.entries(lengthDistribution).forEach(([range, count]) => {
      console.log(`${range} chars: ${count} posts (${Math.round(count/this.posts.length*100)}%)`);
    });
  }

  analyzePost(post) {
    const issues = [];
    const suggestions = [];

    // Check URL length (SEO best practice: 50-60 chars)
    if (post.currentUrl.length > 70) {
      issues.push({
        type: 'url-too-long',
        severity: 'warning',
        message: `URL is ${post.currentUrl.length} characters (recommended: <70)`
      });
      suggestions.push({
        type: 'shorten-url',
        current: post.currentUrl,
        suggested: `/posts/${post.slug}/`,
        improvement: 'Shorter, more focused URL'
      });
    }

    // Check for SEO-unfriendly patterns
    if (post.dir.includes('--')) {
      issues.push({
        type: 'double-hyphens',
        severity: 'minor',
        message: 'URL contains double hyphens (--)'
      });
    }

    // Check title optimization in URL
    const titleWords = post.title.toLowerCase().split(' ');
    const urlWords = post.dir.toLowerCase().split('-');
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    const importantTitleWords = titleWords.filter(word => 
      !commonWords.includes(word) && word.length > 2
    );

    const missingWords = importantTitleWords.filter(word => 
      !urlWords.some(urlWord => urlWord.includes(word.substring(0, 4)))
    );

    if (missingWords.length > 0) {
      suggestions.push({
        type: 'include-keywords',
        missing: missingWords,
        message: `Consider including key terms: ${missingWords.join(', ')}`
      });
    }

    // Check date in URL (good for blog posts)
    if (!post.hasYear) {
      issues.push({
        type: 'missing-date',
        severity: 'info',
        message: 'URL doesn\'t include publication date (good for SEO and organization)'
      });
    }

    if (issues.length > 0 || suggestions.length > 0) {
      this.issues.push({
        post,
        issues,
        suggestions
      });
    }
  }

  generateOptimizationReport() {
    console.log('\n🎯 SEO Permalink Optimization Recommendations:');
    console.log('━'.repeat(60));

    if (this.issues.length === 0) {
      console.log('✅ All permalinks are well-optimized for SEO!');
      return;
    }

    // Group issues by type
    const issueTypes = {};
    const suggestionTypes = {};

    this.issues.forEach(item => {
      item.issues.forEach(issue => {
        issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
      });
      item.suggestions.forEach(suggestion => {
        suggestionTypes[suggestion.type] = (suggestionTypes[suggestion.type] || 0) + 1;
      });
    });

    console.log('📋 Issue Summary:');
    Object.entries(issueTypes).forEach(([type, count]) => {
      console.log(`  • ${type}: ${count} posts`);
    });

    console.log('\n💡 Optimization Opportunities:');
    Object.entries(suggestionTypes).forEach(([type, count]) => {
      console.log(`  • ${type}: ${count} posts`);
    });

    // Show detailed recommendations for worst cases
    const criticalIssues = this.issues
      .filter(item => item.issues.some(issue => issue.severity === 'warning'))
      .sort((a, b) => b.post.currentUrl.length - a.post.currentUrl.length)
      .slice(0, 5);

    if (criticalIssues.length > 0) {
      console.log('\n🔴 Top Priority Optimizations:');
      criticalIssues.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.post.title}`);
        console.log(`   Current: ${item.post.currentUrl}`);
        console.log(`   Length: ${item.post.currentUrl.length} chars`);
        
        item.suggestions.forEach(suggestion => {
          if (suggestion.suggested) {
            console.log(`   Suggested: ${suggestion.suggested}`);
            console.log(`   Improvement: ${suggestion.improvement}`);
          }
        });
      });
    }
  }

  generatePermalinkConfig() {
    console.log('\n⚙️ Recommended Hugo Permalink Configuration:');
    console.log('━'.repeat(50));

    const config = `
# Optimized permalink structure for SEO
[permalinks]
  posts = "/posts/:year/:slug/"
  
# Alternative configurations:
# posts = "/blog/:year/:month/:slug/"     # Include month for high-volume blogs
# posts = "/posts/:slug/"                 # Date-less for evergreen content
# posts = "/:year/:month/:title/"         # Full title inclusion
`;

    console.log(config);
    
    console.log('📝 Benefits of this structure:');
    console.log('  • Includes publication year for temporal context');
    console.log('  • Uses optimized slug for better keyword targeting');
    console.log('  • Maintains clean, readable URLs');
    console.log('  • Improves crawlability and site organization');
    console.log('  • Supports canonical URL structure');

    if (this.applyConfig) {
      this.applyPermalinkConfiguration();
    }
  }

  applyPermalinkConfiguration() {
    console.log('\n🔧 Applying permalink configuration...');
    
    // Read current config
    let configContent = fs.readFileSync('config.toml', 'utf8');
    
    // Add permalinks section if it doesn't exist
    if (!configContent.includes('[permalinks]')) {
      configContent += `\n# SEO-optimized permalink structure\n[permalinks]\n  posts = "/posts/:year/:slug/"\n`;
      
      if (!this.dryRun) {
        fs.writeFileSync('config.toml', configContent);
        console.log('✅ Added optimized permalink configuration to config.toml');
      } else {
        console.log('🔍 Would add permalink configuration to config.toml');
      }
    } else {
      console.log('ℹ️ Permalink configuration already exists in config.toml');
    }
  }

  async run() {
    console.log('🔗 Permalink Structure SEO Analyzer');
    console.log('═'.repeat(50));

    this.loadPosts();
    this.analyzeCurrentStructure();
    this.generateOptimizationReport();
    this.generatePermalinkConfig();

    console.log('\n📊 Analysis Summary:');
    console.log(`  • Posts analyzed: ${this.posts.length}`);
    console.log(`  • Issues found: ${this.issues.length}`);
    console.log(`  • Current structure: Year-prefixed descriptive URLs`);
    console.log(`  • Overall SEO rating: ${this.calculateSEOScore()}/100`);

    return true;
  }

  calculateSEOScore() {
    let score = 85; // Base score for year-prefixed structure
    
    const longUrls = this.issues.filter(item => 
      item.issues.some(issue => issue.type === 'url-too-long')
    ).length;
    
    const missingDates = this.issues.filter(item =>
      item.issues.some(issue => issue.type === 'missing-date')
    ).length;

    // Deduct points for issues
    score -= (longUrls / this.posts.length) * 10;
    score -= (missingDates / this.posts.length) * 5;

    return Math.max(0, Math.round(score));
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const applyConfig = args.includes('--apply-config');

// Run the analyzer
if (require.main === module) {
  const analyzer = new PermalinkAnalyzer({ applyConfig });
  analyzer.run().catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = PermalinkAnalyzer;