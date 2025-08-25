#!/usr/bin/env node

/**
 * Smart Heading Structure Fixer
 * Automatically fixes heading hierarchy issues while preserving code blocks
 * Usage: node scripts/smart-heading-fixer.js [--dry-run] [--interactive]
 */

const fs = require('fs');
const path = require('path');

class SmartHeadingFixer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.interactive = options.interactive || false;
    this.fixed = 0;
    this.changes = [];
  }

  fixFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    
    const lines = content.split('\n');
    let modifiedLines = [...lines];
    let fileChanges = [];
    
    let inCodeBlock = false;
    let inYamlFrontmatter = false;
    let yamlMarkerCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Track YAML frontmatter
      if (trimmedLine === '---') {
        yamlMarkerCount++;
        if (yamlMarkerCount <= 2) {
          inYamlFrontmatter = yamlMarkerCount === 1;
        }
        continue;
      }
      
      // Skip YAML frontmatter
      if (inYamlFrontmatter) {
        continue;
      }
      
      // Track code blocks
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      
      // Skip lines in code blocks
      if (inCodeBlock) {
        continue;
      }
      
      // Check for actual markdown headings (not code comments)
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch && !trimmedLine.startsWith('{{')) { // Exclude Hugo template comments
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        
        // Fix H1 headings to H2 (since theme provides H1)
        if (level === 1) {
          const newLine = line.replace(/^(\s*)#(\s+)/, '$1##$2');
          modifiedLines[i] = newLine;
          fileChanges.push({
            line: i + 1,
            original: line,
            fixed: newLine,
            type: 'h1-to-h2',
            text: text
          });
        }
        
        // Fix heading hierarchy gaps (e.g., H2 followed by H4)
        if (i > 0 && level > 2) {
          // Find previous heading
          let prevHeadingLevel = 1; // Assume H1 from theme
          for (let j = i - 1; j >= 0; j--) {
            const prevLine = lines[j].trim();
            const prevMatch = prevLine.match(/^(#{1,6})\s+/);
            if (prevMatch && !inCodeBlock) {
              prevHeadingLevel = prevMatch[1].length;
              break;
            }
          }
          
          // If there's a gap in hierarchy, suggest fixing
          if (level > prevHeadingLevel + 1) {
            const suggestedLevel = prevHeadingLevel + 1;
            const newHeading = '#'.repeat(suggestedLevel);
            const newLine = line.replace(/^(\s*)#{1,6}(\s+)/, `$1${newHeading}$2`);
            
            // Only apply this fix if it makes sense
            if (suggestedLevel >= 2 && suggestedLevel <= 4) {
              modifiedLines[i] = newLine;
              fileChanges.push({
                line: i + 1,
                original: line,
                fixed: newLine,
                type: 'hierarchy-fix',
                text: text,
                message: `Fixed H${level} → H${suggestedLevel} (follows H${prevHeadingLevel})`
              });
            }
          }
        }
      }
    }

    // Apply changes if any
    if (fileChanges.length > 0) {
      this.changes.push({
        file: relativePath,
        changes: fileChanges
      });
      
      if (!this.dryRun) {
        fs.writeFileSync(filePath, modifiedLines.join('\n'));
        this.fixed++;
        console.log(`✅ Fixed ${fileChanges.length} heading issues in ${relativePath}`);
        
        // Show details of changes
        fileChanges.forEach(change => {
          console.log(`   Line ${change.line}: ${change.type} - "${change.text}"`);
        });
      } else {
        console.log(`🔍 Would fix ${fileChanges.length} heading issues in ${relativePath}`);
        fileChanges.forEach(change => {
          console.log(`   Line ${change.line}: ${change.type} - "${change.text}"`);
          if (change.message) {
            console.log(`      ${change.message}`);
          }
        });
      }
    }

    return fileChanges.length;
  }

  async run() {
    console.log('🔧 Smart Heading Structure Fixer');
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
      
      // Process files with most critical issues first
      const criticalFiles = [
        'content/posts/2021-auto-install-cloudbase-init/index.md',
        'content/posts/2021-harbor-behind-traefik-with-letsencrypt-certificate/index.md',
        'content/posts/2021-easy-updating-cdicd-tools/index.md',
        'content/posts/2020-application-deployment-with-salt-and-vra/index.md',
        'content/posts/2020-demo-enviroment-on-demand/index.md'
      ];
      
      // Process critical files first
      console.log('🔴 Processing files with critical issues:\n');
      criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const changes = this.fixFile(file);
          totalChanges += changes;
        }
      });

      // Process remaining files
      if (!this.dryRun && totalChanges > 0) {
        console.log('\n🟡 Processing remaining files:\n');
        files.forEach(file => {
          if (!criticalFiles.includes(file)) {
            const changes = this.fixFile(file);
            totalChanges += changes;
          }
        });
      }

      console.log('\n📊 Summary:');
      console.log(`  • Files processed: ${this.changes.length}`);
      console.log(`  • Total fixes: ${totalChanges}`);

      if (this.changes.length > 0) {
        console.log('\n📝 Modified Files:');
        this.changes.forEach(change => {
          console.log(`  • ${change.file}: ${change.changes.length} fixes`);
        });
      }

      if (this.dryRun && totalChanges > 0) {
        console.log('\n💡 To apply these changes, run:');
        console.log('   node scripts/smart-heading-fixer.js');
      }

      if (!this.dryRun && totalChanges > 0) {
        console.log('\n✅ Smart heading fixes applied successfully!');
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
const interactive = args.includes('--interactive');

// Run the fixer
if (require.main === module) {
  const fixer = new SmartHeadingFixer({ dryRun, interactive });
  fixer.run().then(hadChanges => {
    process.exit(0);
  }).catch(error => {
    console.error('❌ Fixer failed:', error);
    process.exit(1);
  });
}

module.exports = SmartHeadingFixer;