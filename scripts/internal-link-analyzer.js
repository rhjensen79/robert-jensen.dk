#!/usr/bin/env node

/**
 * Internal Link Analyzer
 * Analyzes blog posts and suggests contextual internal links
 * Usage: node scripts/internal-link-analyzer.js [--apply]
 */

const fs = require('fs');
const path = require('path');

class InternalLinkAnalyzer {
  constructor(options = {}) {
    this.apply = options.apply || false;
    this.posts = [];
    this.suggestions = [];
    this.applied = 0;
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
      const body = content.substring(frontmatterMatch[0].length).trim();

      // Parse frontmatter
      const title = (frontmatter.match(/title:\s*["'](.+)["']/) || [])[1] || dir;
      const tagsMatch = frontmatter.match(/tags\s*:\s*\[(.*?)\]/s);
      const tags = tagsMatch 
        ? tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, ''))
        : [];
      
      const dateMatch = frontmatter.match(/date:\s*(.+)/);
      const date = dateMatch ? new Date(dateMatch[1]) : new Date();

      return {
        dir,
        path: indexPath,
        title,
        tags,
        date,
        content: body,
        url: `/posts/${dir}/`,
        wordCount: body.split(/\s+/).length
      };
    }).filter(Boolean);

    console.log(`📚 Loaded ${this.posts.length} blog posts`);
  }

  findRelatedPosts(post, minScore = 2) {
    const related = [];

    for (const otherPost of this.posts) {
      if (otherPost.dir === post.dir) continue;

      let score = 0;
      const reasons = [];

      // Tag similarity
      const commonTags = post.tags.filter(tag => 
        otherPost.tags.some(otherTag => 
          otherTag.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(otherTag.toLowerCase())
        )
      );
      
      if (commonTags.length > 0) {
        score += commonTags.length * 2;
        reasons.push(`${commonTags.length} shared tags: ${commonTags.join(', ')}`);
      }

      // Technology/tool mentions
      const technologies = [
        'Docker', 'Kubernetes', 'Traefik', 'VMware', 'Tanzu', 'Harbor',
        'GitHub Actions', 'Tailscale', 'Packer', 'Salt', 'Hugo', 'Python',
        'vSphere', 'NSX', 'vRealize', 'Buildpacks', 'Kind', 'Cilium'
      ];

      const commonTechs = technologies.filter(tech => {
        const inPost = post.content.toLowerCase().includes(tech.toLowerCase()) || 
                      post.tags.some(tag => tag.toLowerCase().includes(tech.toLowerCase()));
        const inOther = otherPost.content.toLowerCase().includes(tech.toLowerCase()) ||
                       otherPost.tags.some(tag => tag.toLowerCase().includes(tech.toLowerCase()));
        return inPost && inOther;
      });

      if (commonTechs.length > 0) {
        score += commonTechs.length;
        reasons.push(`${commonTechs.length} shared technologies: ${commonTechs.join(', ')}`);
      }

      // Content similarity (basic keyword analysis)
      const postKeywords = this.extractKeywords(post.content);
      const otherKeywords = this.extractKeywords(otherPost.content);
      const commonKeywords = postKeywords.filter(kw => otherKeywords.includes(kw));

      if (commonKeywords.length > 2) {
        score += Math.min(commonKeywords.length, 3);
        reasons.push(`${commonKeywords.length} shared concepts`);
      }

      // Date proximity bonus (posts from similar time periods)
      const daysDiff = Math.abs(post.date - otherPost.date) / (1000 * 60 * 60 * 24);
      if (daysDiff < 90) { // Within 3 months
        score += 1;
        reasons.push('similar timeframe');
      }

      if (score >= minScore) {
        related.push({
          post: otherPost,
          score,
          reasons
        });
      }
    }

    return related.sort((a, b) => b.score - a.score);
  }

  extractKeywords(content) {
    // Simple keyword extraction
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 4)
      .filter(word => !['about', 'there', 'where', 'could', 'would', 'should', 'using', 'after', 'before', 'during'].includes(word));

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .filter(([word, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  generateSuggestions() {
    console.log('🔗 Analyzing potential internal links...\n');

    for (const post of this.posts) {
      const related = this.findRelatedPosts(post, 3);
      
      if (related.length > 0) {
        // Check for existing internal links
        const existingLinks = this.findExistingLinks(post.content);
        const newSuggestions = related.filter(r => 
          !existingLinks.some(link => link.includes(r.post.dir))
        ).slice(0, 3); // Top 3 suggestions

        if (newSuggestions.length > 0) {
          this.suggestions.push({
            post,
            suggestions: newSuggestions,
            existingLinks: existingLinks.length
          });
        }
      }
    }

    console.log(`💡 Found ${this.suggestions.length} posts that could benefit from additional internal links\n`);
  }

  findExistingLinks(content) {
    const linkPattern = /\[.*?\]\(https?:\/\/[^)]*\/posts\/[^)]*\)/g;
    const relativePattern = /\[.*?\]\(\/posts\/[^)]*\)/g;
    const matches = [
      ...(content.match(linkPattern) || []),
      ...(content.match(relativePattern) || [])
    ];
    return matches;
  }

  createLinkSuggestions() {
    console.log('📝 Internal Link Enhancement Suggestions:');
    console.log('═'.repeat(60));

    let totalSuggestions = 0;

    this.suggestions.forEach((item, index) => {
      console.log(`\n${index + 1}. 📁 ${item.post.title}`);
      console.log(`   File: ${item.post.path}`);
      console.log(`   Current links: ${item.existingLinks}`);
      console.log(`   Suggested additions:`);

      item.suggestions.forEach((suggestion, i) => {
        console.log(`   ${i + 1}. Link to: "${suggestion.post.title}"`);
        console.log(`      URL: ${suggestion.post.url}`);
        console.log(`      Score: ${suggestion.score} (${suggestion.reasons.join(', ')})`);
        console.log(`      Suggested text: "For more on ${this.getTopicPhrase(suggestion.post)}, see [${suggestion.post.title}](${suggestion.post.url})"`);
        totalSuggestions++;
      });
    });

    console.log(`\n📊 Summary:`);
    console.log(`  • Posts analyzed: ${this.posts.length}`);
    console.log(`  • Posts needing more links: ${this.suggestions.length}`);
    console.log(`  • Total link suggestions: ${totalSuggestions}`);

    return totalSuggestions > 0;
  }

  getTopicPhrase(post) {
    // Generate contextual phrase based on post tags and content
    const topTags = post.tags.slice(0, 2).map(tag => tag.toLowerCase());
    
    if (topTags.includes('docker')) return 'Docker containerization';
    if (topTags.includes('kubernetes') || topTags.includes('k8s')) return 'Kubernetes deployment';
    if (topTags.includes('vmware')) return 'VMware virtualization';
    if (topTags.includes('traefik')) return 'Traefik configuration';
    if (topTags.includes('automation')) return 'automation solutions';
    if (topTags.includes('github')) return 'GitHub integration';
    if (topTags.some(tag => tag.includes('tanzu'))) return 'Tanzu platform';
    
    return topTags.length > 0 ? topTags.join(' and ') : 'related topics';
  }

  async run() {
    console.log('🔗 Internal Link Enhancement Analyzer');
    console.log('═'.repeat(50));

    this.loadPosts();
    this.generateSuggestions();
    
    const hasSuggestions = this.createLinkSuggestions();

    if (!hasSuggestions) {
      console.log('\n✅ No additional internal link opportunities found');
      console.log('The blog already has good internal linking!');
      return false;
    }

    if (this.apply) {
      console.log('\n🚀 Auto-linking is not implemented yet for safety.');
      console.log('Please review suggestions and add links manually.');
    } else {
      console.log('\n💡 To analyze in more detail, you can:');
      console.log('   • Review the suggestions above');
      console.log('   • Add contextual links manually');
      console.log('   • Focus on high-scoring suggestions first');
    }

    return true;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const apply = args.includes('--apply');

// Run the analyzer
if (require.main === module) {
  const analyzer = new InternalLinkAnalyzer({ apply });
  analyzer.run().catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = InternalLinkAnalyzer;