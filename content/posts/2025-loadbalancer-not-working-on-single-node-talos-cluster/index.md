---
title: "LoadBalancer not working on single node Talos cluster"
date: 2025-03-26T12:00:00+01:00
tags : [Kubernetes, Talos, Loadbalancer, Network, Cilium, MetalLB]
draft: false
toc: true
thumbnail: "images/jackson-simmer-Vqg809B-SrE-unsplash.jpg"
description: "How to fix LoadBalancer services on a single node Talos cluster"
---
## Intro

I've started playing around with [Talos](https://www.talos.dev) for my homelab setup. Talos is a modern OS built specifically for Kubernetes, which makes it an interesting option for running clusters.

In my lab, I only have a single Intel NUC that needs to function as both control plane (master) and worker node. This should work fine in theory, but after setting everything up, I ran into an issue with LoadBalancer services.

## The Problem

I tried setting up LoadBalancer services using both [Cilium](https://cilium.io) and [MetalLB](https://metallb.universe.tf), but encountered the same problem with both solutions.

The service would successfully get assigned an external IP from the configured address pool, but I couldn't:
- Ping the assigned IP
- Access any service behind the LoadBalancer
- Connect to the service externally

When I tried accessing the service directly using port-forwarding (`kubectl port-forward`), everything worked perfectly fine. This indicated that the service itself was working, but the LoadBalancer wasn't properly exposing it.

I went through multiple reinstallations and troubleshooting attempts, but nothing seemed to solve the issue.

## Solution

After digging through various GitHub issues, I finally found the solution in this MetalLB issue: [https://github.com/metallb/metallb/issues/2676](https://github.com/metallb/metallb/issues/2676)

It turns out that Talos (following Kubernetes best practices) automatically adds a label to control plane nodes that prevents them from being used for external load balancers:

```yaml
nodeLabels:
        node.kubernetes.io/exclude-from-external-load-balancers: ""
```

This is a security precaution in standard multi-node clusters, but in a single-node setup where your control plane node is also your only worker node, it prevents LoadBalancer services from working properly.

The solution is simple - just comment out this section in your control plane configuration before deploying:

```yaml
machine:
  # Comment out this section for single-node clusters
  # nodeLabels:
  #   node.kubernetes.io/exclude-from-external-load-balancers: ""
```

If you've already deployed your cluster, you'll need to update your machine configuration by commenting out this label and then applying the updated configuration.

After applying this change, my LoadBalancer services started working correctly.

## Conclusion

I couldn't find this information clearly documented in the Talos documentation. This might be because my single-node setup (using a control plane node as a worker) is somewhat unusual compared to standard production deployments.

However, for homelab and testing environments where resources are limited, this fix is crucial to get LoadBalancer services working properly.

I hope this post helps anyone encountering the same issue with single-node Talos clusters.

A big thanks to [ugoogalizer](https://github.com/ugoogalizer) for providing the solution in the GitHub issue!

Photo by <a href="https://unsplash.com/@simmerdownjpg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jackson Simmer</a> on <a href="https://unsplash.com/photos/blue-green-and-red-plastic-clothes-pin-Vqg809B-SrE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

      