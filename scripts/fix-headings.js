#!/usr/bin/env node

/**
 * Heading Structure Fixer
 * Automatically fixes common heading hierarchy issues in blog posts
 * Usage: node scripts/fix-headings.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

class HeadingFixer {
  constructor(dryRun = false) {
    this.dryRun = dryRun;
    this.fixed = 0;
    this.changes = [];
  }

  fixFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    
    let modifiedContent = content;
    let fileChanges = 0;

    // Fix H1 headings that are clearly not titles (common patterns)
    const h1Patterns = [
      // YAML configuration comments
      /^# (phoneHomeShouldWait: true|phoneHomeTimeoutSeconds: \d+|phoneHomeFailOnTimeout: true)$/gm,
      /^# (download installer|install Cloudbase-Init|Move conf files|Run sysprep)$/gm,
      /^# (Install Docker-Compose|Install Packer|Install Terraform|Configuration file)$/gm,
      /^# (http related config|https related config|port for http|https port)$/gm,
      /^# (The path of cert|certificate:|private_key:|Network used to expose)$/gm,
      /^# (Controls when the workflow|Allows you to run|Steps represent)$/gm,
      /^# (The type of runner|Checkout|Build the image|Login to Docker Hub)$/gm,
      
      // Fix obvious comment-like headings
      /^# ([A-Z][a-z]+ [a-z]+ [a-z]+: [a-z0-9]+)$/gm,
      /^# ([A-Z][a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+\.)$/gm,
      
      // Fix single word/short technical terms that shouldn't be H1
      /^# (Autorize|Building new image|Configuration of Traefik|The setup)$/gm,
    ];

    h1Patterns.forEach(pattern => {
      const matches = modifiedContent.match(pattern);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern, (match) => {
          // Convert H1 to H2 for these patterns
          return match.replace(/^#/, '##');
        });
        fileChanges += matches.length;
      }
    });

    // Fix H1 headings that are clearly in code blocks or YAML comments
    const lines = modifiedContent.split('\n');
    let inCodeBlock = false;
    let inYamlBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Track code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      
      // Track YAML frontmatter
      if (line === '---') {
        inYamlBlock = !inYamlBlock;
        continue;
      }
      
      // Skip lines in code blocks or YAML
      if (inCodeBlock || inYamlBlock) {
        continue;
      }
      
      // Fix H1 headings that look like configuration or technical content
      if (line.match(/^# [a-z]/)) {
        // Likely a configuration comment or technical detail, not a title
        lines[i] = line.replace(/^#/, '##');
        fileChanges++;
      }
      
      // Fix H1 headings that are clearly not titles (contain colons, numbers, etc.)
      if (line.match(/^# .+[:0-9]/)) {
        lines[i] = line.replace(/^#/, '##');
        fileChanges++;
      }
    }

    if (fileChanges > 0) {
      modifiedContent = lines.join('\n');
    }

    // Track changes
    if (fileChanges > 0) {
      this.changes.push({
        file: relativePath,
        changes: fileChanges
      });
      
      if (!this.dryRun) {
        fs.writeFileSync(filePath, modifiedContent);
        this.fixed++;
        console.log(`✅ Fixed ${fileChanges} heading issues in ${relativePath}`);
      } else {
        console.log(`🔍 Would fix ${fileChanges} heading issues in ${relativePath}`);
      }
    }

    return fileChanges;
  }

  async run() {
    console.log('🔧 Heading Structure Fixer');
    console.log('═'.repeat(50));
    
    if (this.dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be modified\n');
    }

    try {
      // Find all blog post files
      const files = require('child_process').execSync(`find content/posts -name "index.md"`, { encoding: 'utf8' })
        .split('\n')
        .filter(f => f.trim())
        .sort();

      console.log(`Found ${files.length} blog posts to process\n`);

      let totalChanges = 0;
      
      // Process each file
      files.forEach(file => {
        const changes = this.fixFile(file);
        totalChanges += changes;
      });

      console.log('\n📊 Summary:');
      console.log(`  • Files processed: ${files.length}`);
      console.log(`  • Files modified: ${this.changes.length}`);
      console.log(`  • Total fixes: ${totalChanges}`);

      if (this.changes.length > 0) {
        console.log('\n📝 Modified Files:');
        this.changes.forEach(change => {
          console.log(`  • ${change.file}: ${change.changes} fixes`);
        });
      }

      if (this.dryRun && totalChanges > 0) {
        console.log('\n💡 To apply these changes, run:');
        console.log('   node scripts/fix-headings.js');
      }

      if (!this.dryRun && totalChanges > 0) {
        console.log('\n✅ Heading fixes applied successfully!');
        console.log('💡 Run the analyzer again to check remaining issues:');
        console.log('   node scripts/analyze-headings.js');
      }

      return totalChanges > 0;

    } catch (error) {
      console.error('❌ Fix failed:', error.message);
      return false;
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Run the fixer
if (require.main === module) {
  const fixer = new HeadingFixer(dryRun);
  fixer.run().then(hadChanges => {
    process.exit(0);
  }).catch(error => {
    console.error('❌ Fixer failed:', error);
    process.exit(1);
  });
}

module.exports = HeadingFixer;