#!/usr/bin/env node

/**
 * Heading Structure Analyzer
 * Analyzes blog posts for proper heading hierarchy
 * Usage: node scripts/analyze-headings.js
 */

const fs = require('fs');
const path = require('path');

class HeadingAnalyzer {
  constructor() {
    this.issues = [];
    this.analyzed = 0;
  }

  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Extract headings
    const headings = this.extractHeadings(content);
    const issues = this.checkHeadingHierarchy(headings, relativePath);
    
    this.issues.push(...issues);
    this.analyzed++;
    
    return { headings, issues };
  }

  extractHeadings(content) {
    const lines = content.split('\n');
    const headings = [];
    
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
      
      const match = trimmedLine.match(/^(#{1,6})\s+(.+)/);
      
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        
        // Skip Hugo comments and template directives
        if (text.startsWith('{{') || text.startsWith('#')) {
          continue;
        }
        
        // Skip lines that look like YAML properties or code comments
        if (text.includes(':') && text.match(/^[a-zA-Z_][a-zA-Z0-9_]*:\s*(true|false|\d+|"[^"]*")$/)) {
          continue;
        }
        
        // Skip common code comment patterns
        if (text.match(/^(download|install|move|run|start|copy|set|get|put|delete)\s/i)) {
          continue;
        }
        
        headings.push({
          level,
          text,
          line: i + 1,
          raw: trimmedLine
        });
      }
    }
    
    return headings;
  }

  checkHeadingHierarchy(headings, filePath) {
    const issues = [];
    
    if (headings.length === 0) {
      issues.push({
        file: filePath,
        type: 'no-headings',
        message: 'No headings found in content',
        severity: 'warning'
      });
      return issues;
    }

    // Check for H1 headings (should start with H2 since theme adds H1)
    const h1Headings = headings.filter(h => h.level === 1);
    if (h1Headings.length > 0) {
      h1Headings.forEach(heading => {
        issues.push({
          file: filePath,
          type: 'improper-h1',
          line: heading.line,
          text: heading.text,
          message: 'H1 heading found in content (theme already adds H1 for title)',
          severity: 'error',
          suggestion: 'Change to H2 (##)'
        });
      });
    }

    // Check for proper hierarchy
    let previousLevel = 1; // Start with 1 since theme adds H1
    
    headings.forEach((heading, index) => {
      // Check for skipped levels
      if (heading.level > previousLevel + 1) {
        issues.push({
          file: filePath,
          type: 'skipped-level',
          line: heading.line,
          text: heading.text,
          message: `Heading level ${heading.level} follows level ${previousLevel} (skipped level ${previousLevel + 1})`,
          severity: 'warning',
          suggestion: `Consider using H${previousLevel + 1} instead of H${heading.level}`
        });
      }

      // Check for first heading level
      if (index === 0 && heading.level !== 2) {
        issues.push({
          file: filePath,
          type: 'improper-first-heading',
          line: heading.line,
          text: heading.text,
          message: `First heading should be H2, found H${heading.level}`,
          severity: 'warning',
          suggestion: 'Start with H2 (##) after the title'
        });
      }

      previousLevel = Math.min(heading.level, previousLevel + 1);
    });

    return issues;
  }

  generateReport() {
    console.log('📝 Heading Structure Analysis Report');
    console.log('═'.repeat(50));
    console.log(`Analyzed ${this.analyzed} blog posts\n`);

    if (this.issues.length === 0) {
      console.log('✅ No heading structure issues found!');
      return true;
    }

    const errors = this.issues.filter(i => i.severity === 'error');
    const warnings = this.issues.filter(i => i.severity === 'warning');

    if (errors.length > 0) {
      console.log('🔴 Critical Issues (must fix):');
      this.printIssues(errors);
    }

    if (warnings.length > 0) {
      console.log('\n🟡 Warnings (should fix):');
      this.printIssues(warnings);
    }

    console.log('\n📊 Summary:');
    console.log(`  • Total issues: ${this.issues.length}`);
    console.log(`  • Critical: ${errors.length}`);
    console.log(`  • Warnings: ${warnings.length}`);

    // Group by issue type
    const byType = {};
    this.issues.forEach(issue => {
      byType[issue.type] = (byType[issue.type] || 0) + 1;
    });

    console.log('\n📈 Issue Types:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  • ${type}: ${count}`);
    });

    return errors.length === 0;
  }

  printIssues(issues) {
    issues.forEach(issue => {
      console.log(`\n  📁 ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      console.log(`     ${issue.message}`);
      if (issue.text) {
        console.log(`     Text: "${issue.text}"`);
      }
      if (issue.suggestion) {
        console.log(`     💡 ${issue.suggestion}`);
      }
    });
  }

  async run() {
    console.log('🔍 Analyzing blog post heading structures...\n');

    try {
      // Find all blog post files
      const pattern = 'content/posts/*/index.md';
      const files = require('child_process').execSync(`find content/posts -name "index.md"`, { encoding: 'utf8' })
        .split('\n')
        .filter(f => f.trim())
        .sort();

      console.log(`Found ${files.length} blog posts to analyze\n`);

      // Analyze each file
      files.forEach(file => {
        this.analyzeFile(file);
      });

      // Generate report
      return this.generateReport();

    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      return false;
    }
  }
}

// No additional dependencies needed

// Run the analyzer
if (require.main === module) {
  const analyzer = new HeadingAnalyzer();
  analyzer.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Analyzer failed:', error);
    process.exit(1);
  });
}

module.exports = HeadingAnalyzer;