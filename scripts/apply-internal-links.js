#!/usr/bin/env node

/**
 * Apply Internal Links
 * Automatically applies high-scoring internal link suggestions
 * Usage: node scripts/apply-internal-links.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

class InternalLinkApplier {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.applied = 0;
    this.changes = [];
  }

  // High-value link suggestions to apply automatically
  getHighValueSuggestions() {
    return [
      // Docker/Container related posts
      {
        file: 'content/posts/2021-using-github-actions-to-build-containers/index.md',
        suggestions: [
          {
            searchText: 'Some time ago, I wrote a blog, around how to easily build and host',
            afterText: ' For more comprehensive containerization strategies, you might also find my post on [Hello Buildpacks, goodbye Dockerfiles](/posts/2021-hello-buildpacks-goodbye-dockerfiles/) useful for modern container building approaches.',
            reason: 'High-scoring Docker-related content'
          }
        ]
      },
      
      // VMware/vSphere related posts
      {
        file: 'content/posts/2019-duplicate-ipadress-on-packer-ubuntu-vms/index.md',
        suggestions: [
          {
            searchText: 'This can be a problem, if you are doing large scale deployments',
            afterText: ' If you\'re working with similar automation challenges, check out my guide on [Cloud Agnostic Blueprints in VMware CAS](/posts/2019-cloud-agnostic-blueprints-in-vmware-cas/) for scalable deployment strategies.',
            reason: 'High-scoring VMware automation content'
          }
        ]
      },

      // Kubernetes/Container orchestration
      {
        file: 'content/posts/2024-fixing-cilium-with-kind/index.md',
        suggestions: [
          {
            searchText: 'Colima seems to be a seamless replacement for Docker desktop.',
            afterText: ' For more Kubernetes networking insights, you might find my post on [K8S Ingress and Pfsense firewall](/posts/2019-k8s-ingress-and-pfsense-firewall/) helpful for understanding ingress configurations.',
            reason: 'High-scoring Kubernetes networking content'
          }
        ]
      },

      // Traefik/Networking related
      {
        file: 'content/posts/2025-multiple-traefik-instances-on-a-single-docker-host/index.md',
        suggestions: [
          {
            searchText: 'This is useful when you want to separate concerns',
            afterText: ' For additional security considerations with Traefik, see my guide on [Secure Deployments with Docker and Traefik](/posts/2021-secure-deployments-with-docker-and-traefik/).',
            reason: 'High-scoring Traefik security content'
          }
        ]
      },

      // VMware Cloud Management
      {
        file: 'content/posts/2018-getting-started-with-cloud-automation/index.md',
        suggestions: [
          {
            searchText: 'So in this blog, I want to share the experience I have gotten so far.',
            afterText: ' For more advanced cloud automation patterns, check out my [Cloud Agnostic Blueprints in VMware CAS](/posts/2019-cloud-agnostic-blueprints-in-vmware-cas/) post which builds on these concepts.',
            reason: 'High-scoring VMware CAS progression'
          }
        ]
      },

      // Automation and DevOps
      {
        file: 'content/posts/2020-automating-fah-with-cs/index.md',
        suggestions: [
          {
            searchText: 'I have been wanting to automate the deployment of Folding@Home',
            afterText: ' For more CI/CD automation strategies, you might find my [Easy Updating CI/CD Tools](/posts/2021-easy-updating-cdicd-tools/) post useful for maintaining your automation infrastructure.',
            reason: 'High-scoring CI/CD automation content'
          }
        ]
      },

      // Home automation and networking
      {
        file: 'content/posts/2020-custom-dns-resolver-for-homelabs/index.md',
        suggestions: [
          {
            searchText: 'So I decided to implement a custom DNS resolver',
            afterText: ' For additional homelab networking solutions, check out my guide on [Remote Access to Demolab using Apache Guacamole](/posts/2021-remote-access-to-demolab/).',
            reason: 'High-scoring homelab networking content'
          }
        ]
      },

      // Development tools
      {
        file: 'content/posts/2023-devcontainer-and-git-signing/index.md',
        suggestions: [
          {
            searchText: 'For more advanced devcontainer setups, check out my guide on using Devcontainers with Tailscale',
            afterText: ' You might also be interested in my post on [Remote development from anywhere](/posts/2019-remote-development-from-anywhere/) for additional remote development strategies.',
            reason: 'High-scoring development setup content'
          }
        ]
      }
    ];
  }

  applyLinks() {
    const suggestions = this.getHighValueSuggestions();
    
    console.log('🔗 Applying High-Value Internal Links');
    console.log('═'.repeat(50));
    
    if (this.dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be modified\n');
    }

    for (const item of suggestions) {
      if (!fs.existsSync(item.file)) {
        console.log(`⚠️  File not found: ${item.file}`);
        continue;
      }

      const content = fs.readFileSync(item.file, 'utf8');
      let modifiedContent = content;
      let fileChanges = 0;

      for (const suggestion of item.suggestions) {
        if (content.includes(suggestion.searchText) && !content.includes(suggestion.afterText)) {
          modifiedContent = modifiedContent.replace(
            suggestion.searchText,
            suggestion.searchText + suggestion.afterText
          );
          fileChanges++;
        }
      }

      if (fileChanges > 0) {
        this.changes.push({
          file: item.file,
          changes: fileChanges,
          reason: item.suggestions[0].reason
        });

        if (!this.dryRun) {
          fs.writeFileSync(item.file, modifiedContent);
          console.log(`✅ Added ${fileChanges} contextual links to ${item.file.split('/').pop()}`);
        } else {
          console.log(`🔍 Would add ${fileChanges} contextual links to ${item.file.split('/').pop()}`);
        }
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  • Files processed: ${suggestions.length}`);
    console.log(`  • Files modified: ${this.changes.length}`);
    console.log(`  • Total links added: ${this.changes.reduce((sum, change) => sum + change.changes, 0)}`);

    if (this.changes.length > 0) {
      console.log('\n📝 Enhanced Files:');
      this.changes.forEach(change => {
        console.log(`  • ${change.file}: ${change.changes} links (${change.reason})`);
      });
    }

    return this.changes.length > 0;
  }

  async run() {
    const hasChanges = this.applyLinks();

    if (this.dryRun && hasChanges) {
      console.log('\n💡 To apply these changes, run:');
      console.log('   node scripts/apply-internal-links.js');
    }

    if (!this.dryRun && hasChanges) {
      console.log('\n✅ Internal links applied successfully!');
      console.log('💡 These links enhance content discoverability and SEO.');
    }

    return hasChanges;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Run the applier
if (require.main === module) {
  const applier = new InternalLinkApplier({ dryRun });
  applier.run().catch(error => {
    console.error('❌ Link application failed:', error);
    process.exit(1);
  });
}

module.exports = InternalLinkApplier;