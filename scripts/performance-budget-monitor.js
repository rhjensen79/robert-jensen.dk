#!/usr/bin/env node

/**
 * Performance Budget Monitor
 * Monitors site performance against defined budgets
 * Usage: node scripts/performance-budget-monitor.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BUDGET_FILE = 'performance-budget.json';
const LIGHTHOUSE_CONFIG = 'lighthouserc.js';
const RESULTS_DIR = '.lighthouseci';

class PerformanceBudgetMonitor {
  constructor() {
    this.budget = this.loadBudget();
    this.results = [];
  }

  loadBudget() {
    try {
      const budgetPath = path.join(process.cwd(), BUDGET_FILE);
      return JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
    } catch (error) {
      console.error('❌ Failed to load performance budget:', error.message);
      process.exit(1);
    }
  }

  async runLighthouse() {
    console.log('🚀 Running Lighthouse performance audit...');
    
    try {
      // Build the site first
      console.log('📦 Building site...');
      execSync('hugo --minify --enableGitInfo=false --baseURL "http://localhost:8080/"', {
        stdio: 'inherit'
      });

      // Start local server in background
      console.log('🌐 Starting local server...');
      const serverProcess = execSync('cd public && python3 -m http.server 8080 > /dev/null 2>&1 & echo $!', {
        encoding: 'utf8'
      }).trim();

      // Wait for server to start
      await this.sleep(3000);

      // Run Lighthouse CI
      console.log('🔍 Running Lighthouse audit...');
      execSync('lhci autorun --config=./lighthouserc.js', {
        stdio: 'inherit'
      });

      // Kill the server
      execSync(`kill ${serverProcess}`, { stdio: 'ignore' });

      return this.loadResults();
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message);
      return null;
    }
  }

  loadResults() {
    try {
      const resultsDir = path.join(process.cwd(), RESULTS_DIR);
      const files = fs.readdirSync(resultsDir);
      const reportFiles = files.filter(f => f.startsWith('lhr-') && f.endsWith('.json'));
      
      const results = [];
      for (const file of reportFiles) {
        const filePath = path.join(resultsDir, file);
        const report = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        results.push(report);
      }
      
      return results;
    } catch (error) {
      console.error('❌ Failed to load Lighthouse results:', error.message);
      return [];
    }
  }

  analyzePerformance(reports) {
    const analysis = {
      budgetViolations: [],
      warnings: [],
      summary: {},
      passed: true
    };

    if (!reports || reports.length === 0) {
      analysis.passed = false;
      analysis.warnings.push('No Lighthouse reports found');
      return analysis;
    }

    // Analyze the latest report
    const report = reports[reports.length - 1];
    const categories = report.categories;
    const audits = report.audits;

    // Check category score thresholds
    for (const [category, threshold] of Object.entries(this.budget.thresholds)) {
      if (categories[category]) {
        const score = categories[category].score * 100;
        analysis.summary[category] = score;
        
        if (score < threshold) {
          analysis.budgetViolations.push({
            type: 'category',
            category,
            actual: score,
            budget: threshold,
            severity: score < threshold * 0.8 ? 'critical' : 'warning'
          });
          analysis.passed = false;
        }
      }
    }

    // Check timing budgets
    const budget = this.budget.budgets[0];
    if (budget.timings) {
      for (const timing of budget.timings) {
        const auditKey = timing.metric;
        const audit = audits[auditKey];
        
        if (audit && audit.numericValue !== undefined) {
          const actual = audit.numericValue;
          const budgetValue = timing.budget;
          
          if (actual > budgetValue) {
            analysis.budgetViolations.push({
              type: 'timing',
              metric: timing.metric,
              actual: Math.round(actual),
              budget: budgetValue,
              severity: actual > budgetValue * 1.5 ? 'critical' : 'warning'
            });
            analysis.passed = false;
          }
        }
      }
    }

    // Check resource size budgets
    if (budget.resourceSizes) {
      const resourceSummary = audits['resource-summary'];
      if (resourceSummary && resourceSummary.details) {
        const items = resourceSummary.details.items || [];
        
        for (const resourceBudget of budget.resourceSizes) {
          const resourceType = resourceBudget.resourceType;
          const budgetKB = resourceBudget.budget;
          
          let actualKB = 0;
          if (resourceType === 'total') {
            actualKB = items.reduce((total, item) => total + (item.transferSize || 0), 0) / 1024;
          } else {
            const item = items.find(i => i.resourceType === resourceType);
            if (item) {
              actualKB = (item.transferSize || 0) / 1024;
            }
          }
          
          if (actualKB > budgetKB) {
            analysis.budgetViolations.push({
              type: 'resource',
              resourceType,
              actual: Math.round(actualKB),
              budget: budgetKB,
              severity: actualKB > budgetKB * 1.5 ? 'critical' : 'warning'
            });
            analysis.passed = false;
          }
        }
      }
    }

    return analysis;
  }

  generateReport(analysis) {
    console.log('\n📊 Performance Budget Report');
    console.log('═'.repeat(50));

    // Overall status
    if (analysis.passed) {
      console.log('✅ All performance budgets passed!');
    } else {
      console.log('❌ Performance budget violations detected!');
    }

    // Category scores
    console.log('\n📈 Category Scores:');
    for (const [category, score] of Object.entries(analysis.summary)) {
      const threshold = this.budget.thresholds[category];
      const status = score >= threshold ? '✅' : '❌';
      console.log(`${status} ${category}: ${score.toFixed(1)}/100 (budget: ${threshold})`);
    }

    // Budget violations
    if (analysis.budgetViolations.length > 0) {
      console.log('\n🚨 Budget Violations:');
      
      const critical = analysis.budgetViolations.filter(v => v.severity === 'critical');
      const warnings = analysis.budgetViolations.filter(v => v.severity === 'warning');

      if (critical.length > 0) {
        console.log('\n🔴 Critical Issues:');
        critical.forEach(violation => {
          this.printViolation(violation);
        });
      }

      if (warnings.length > 0) {
        console.log('\n🟡 Warnings:');
        warnings.forEach(violation => {
          this.printViolation(violation);
        });
      }
    }

    // Warnings
    if (analysis.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      analysis.warnings.forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }

    console.log('\n' + '═'.repeat(50));
    return analysis.passed;
  }

  printViolation(violation) {
    switch (violation.type) {
      case 'category':
        console.log(`  • ${violation.category}: ${violation.actual.toFixed(1)} < ${violation.budget} (threshold)`);
        break;
      case 'timing':
        console.log(`  • ${violation.metric}: ${violation.actual}ms > ${violation.budget}ms (budget)`);
        break;
      case 'resource':
        console.log(`  • ${violation.resourceType}: ${violation.actual}KB > ${violation.budget}KB (budget)`);
        break;
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async run() {
    console.log('🔍 Performance Budget Monitor');
    console.log('═'.repeat(50));

    const reports = await this.runLighthouse();
    if (!reports) {
      console.error('❌ Failed to run Lighthouse audit');
      process.exit(1);
    }

    const analysis = this.analyzePerformance(reports);
    const passed = this.generateReport(analysis);

    // Exit with appropriate code
    process.exit(passed ? 0 : 1);
  }
}

// Run the monitor
if (require.main === module) {
  const monitor = new PerformanceBudgetMonitor();
  monitor.run().catch(error => {
    console.error('❌ Monitor failed:', error);
    process.exit(1);
  });
}

module.exports = PerformanceBudgetMonitor;