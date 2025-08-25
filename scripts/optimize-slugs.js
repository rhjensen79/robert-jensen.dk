#!/usr/bin/env node

/**
 * Slug Optimizer
 * Adds optimized slugs to blog posts for better SEO
 * Usage: node scripts/optimize-slugs.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

class SlugOptimizer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.optimizations = [];
    this.applied = 0;
  }

  generateOptimalSlug(title, currentDir) {
    // Remove year prefix from current directory for comparison
    const currentSlug = currentDir.replace(/^\d{4}-/, '');
    
    // Generate optimized slug from title
    let optimizedSlug = title
      .toLowerCase()
      // Remove common stop words that don't add SEO value
      .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by|is|are|was|were|be|been|have|has|had|do|does|did|will|would|could|should|may|might|must|can|using|from|into|onto|upon|about|against|among|between|during|before|after|above|below|over|under)\b/g, '')
      // Replace special characters
      .replace(/[^\w\s-]/g, '')
      // Replace spaces with hyphens  
      .replace(/\s+/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-|-$/g, '')
      // Limit length for SEO (50-60 chars is optimal)
      .substring(0, 50)
      // Remove trailing hyphen if substring cut in middle
      .replace(/-$/, '');

    return optimizedSlug;
  }

  getHighImpactPosts() {
    // Focus on posts that would benefit most from slug optimization
    return [
      {
        dir: '2024-vcf-create-transport-node-collection-fails',
        title: 'VMware VCF Create Transport Node Collection Fails - Troubleshooting Guide',
        reason: 'Long technical title with important keywords'
      },
      {
        dir: '2024-external-dns-with-cloudflare',
        title: 'External DNS with Cloudflare for Kubernetes Automation',
        reason: 'Popular technology combination'
      },
      {
        dir: '2023-devcontainer-and-git-signing',
        title: 'Devcontainer and Git Signing with SSH Keys',
        reason: 'Developer tools focus'
      },
      {
        dir: '2022-using-github-actions-with-tailscale-to-deploy-locally',
        title: 'Using GitHub Actions with Tailscale to Deploy Locally',
        reason: 'Very long URL, high-value keywords'
      },
      {
        dir: '2021-harbor-behind-traefik-with-letsencrypt-certificate',
        title: 'Harbor Behind Traefik with Let\'s Encrypt Certificate',
        reason: 'Long URL with important container keywords'
      },
      {
        dir: '2021-hello-buildpacks-goodbye-dockerfiles',
        title: 'Hello Buildpacks Goodbye Dockerfiles',
        reason: 'Modern containerization keywords'
      },
      {
        dir: '2025-multiple-traefik-instances-on-a-single-docker-host',
        title: 'Multiple Traefik Instances on Single Docker Host',
        reason: 'Very long, could be optimized'
      },
      {
        dir: '2019-cloud-agnostic-blueprints-in-vmware-cas',
        title: 'Cloud Agnostic Blueprints in VMware CAS',
        reason: 'Important VMware content'
      },
      {
        dir: '2020-application-deployment-with-salt-and-vra',
        title: 'Application Deployment with Salt and vRealize Automation',
        reason: 'VMware automation keywords'
      },
      {
        dir: '2024-fixing-cilium-with-kind',
        title: 'Fixing Cilium CNI with Kind Kubernetes Clusters',
        reason: 'Kubernetes networking focus'
      }
    ];
  }

  optimizePost(postInfo) {
    const postPath = path.join('content/posts', postInfo.dir, 'index.md');
    
    if (!fs.existsSync(postPath)) {
      console.log(`⚠️  Post not found: ${postInfo.dir}`);
      return false;
    }

    const content = fs.readFileSync(postPath, 'utf8');
    
    // Check if slug already exists
    if (content.includes('slug:')) {
      console.log(`ℹ️  Slug already exists for: ${postInfo.dir}`);
      return false;
    }

    // Generate optimal slug
    const optimalSlug = this.generateOptimalSlug(postInfo.title, postInfo.dir);
    
    // Find the frontmatter section
    const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found in: ${postInfo.dir}`);
      return false;
    }

    const [fullMatch, opening, frontmatter] = frontmatterMatch;
    
    // Add slug to frontmatter
    const newFrontmatter = frontmatter + `\nslug: "${optimalSlug}"`;
    const newContent = content.replace(fullMatch, `${opening}${newFrontmatter}\n---`);

    // Calculate improvement
    const currentUrl = `/posts/${postInfo.dir}/`;
    const newUrl = `/posts/${postInfo.dir.split('-')[0]}/${optimalSlug}/`;
    
    this.optimizations.push({
      dir: postInfo.dir,
      currentUrl,
      newUrl,
      slug: optimalSlug,
      reason: postInfo.reason,
      improvement: currentUrl.length - newUrl.length
    });

    if (!this.dryRun) {
      fs.writeFileSync(postPath, newContent);
      console.log(`✅ Added optimized slug to: ${postInfo.dir}`);
      console.log(`   Slug: ${optimalSlug}`);
      this.applied++;
    } else {
      console.log(`🔍 Would add slug to: ${postInfo.dir}`);
      console.log(`   Slug: ${optimalSlug}`);
      console.log(`   Current URL: ${currentUrl}`);
      console.log(`   New URL: ${newUrl}`);
    }

    return true;
  }

  generateReport() {
    console.log('\n📊 Slug Optimization Summary:');
    console.log('━'.repeat(50));
    console.log(`Posts processed: ${this.getHighImpactPosts().length}`);
    console.log(`Slugs optimized: ${this.optimizations.length}`);
    
    if (this.optimizations.length > 0) {
      console.log('\n🎯 SEO Improvements:');
      this.optimizations.forEach((opt, index) => {
        console.log(`\n${index + 1}. ${opt.dir}`);
        console.log(`   Slug: ${opt.slug}`);
        console.log(`   Reason: ${opt.reason}`);
        console.log(`   URL change: ${opt.currentUrl} → ${opt.newUrl}`);
      });

      console.log('\n✨ Benefits:');
      console.log('  • Shorter, more focused URLs');
      console.log('  • Better keyword targeting');
      console.log('  • Improved search engine crawling');
      console.log('  • Enhanced user experience');
      console.log('  • Cleaner permalink structure');
    }
  }

  async run() {
    console.log('🎯 Blog Post Slug Optimizer');
    console.log('═'.repeat(50));
    
    if (this.dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be modified\n');
    }

    const posts = this.getHighImpactPosts();
    
    console.log(`🚀 Optimizing slugs for ${posts.length} high-impact posts...\n`);

    for (const post of posts) {
      this.optimizePost(post);
    }

    this.generateReport();

    if (this.dryRun && this.optimizations.length > 0) {
      console.log('\n💡 To apply these optimizations, run:');
      console.log('   node scripts/optimize-slugs.js');
    }

    if (!this.dryRun && this.applied > 0) {
      console.log('\n✅ Slug optimizations applied successfully!');
      console.log('💡 The Hugo permalink configuration will use these slugs automatically.');
      console.log('🔄 Restart the Hugo server to see the new URL structure.');
    }

    return this.optimizations.length > 0;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Run the optimizer
if (require.main === module) {
  const optimizer = new SlugOptimizer({ dryRun });
  optimizer.run().catch(error => {
    console.error('❌ Slug optimization failed:', error);
    process.exit(1);
  });
}

module.exports = SlugOptimizer;