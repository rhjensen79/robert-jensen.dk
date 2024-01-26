---
title: "Fixing Cilium on Kind"
date: 2024-01-25T12:00:00+01:00
tags : [Kubernetes, Docker, Cilium, Colima]
draft: false
toc: true
thumbnail: "images/marc-olivier-jodoin-NqOInJ-ttqM-unsplash.jpg"
#image: "images/kelly-sikkema-v9FQR4tbIq8-unsplash.jpg"
description: "How to fix running Cilium on a local Kind cluster on a M1 Macbook"
---
## Intro

I have started playing with [Cilium](https://cilium.io), and learning about all the interesting things it offeres. 
That involves running a local Kind cluster, where I can quickly test things out. 

## Problem

Cilium has a [guide](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/) on how to run this on a Kind cluster. The only problem, is that it's not working on my M1 Macbook.

The deamonset pods keep restarting, and my coredns pods, never starts.

This means it's pretty useless for me.

I have created a [PR](https://github.com/cilium/cilium/issues/30278), where I think the error was found, but no real solution, until [Parshin Pavel](https://github.com/pparshin) gave me a workaround.

## Solution

The workaround was simply to replace Docker desktop with [Colima](https://github.com/abiosoft/colima)

This was also a good excuse to try something else that Docker desktop.

So I tested it by simply deleting the Docker desktop app from my system, and followed the following steps, from this [guide](https://jacobtomlinson.dev/posts/2022/goodbye-docker-desktop-for-mac-hello-colima/), to install Colima and tools.

```bash
brew install docker docker-compose kubectl kubectx colima

colima start
```

After that it was just a matter of starting Colima by running
```bash
colima start
```

I ran it with the default settings, but it might make sense to give it a bit more resources later. See the [blog](https://jacobtomlinson.dev/posts/2022/goodbye-docker-desktop-for-mac-hello-colima/) post on how to to do that.

With colima running, I could follow the Cilium Kind guide again, and after 2 minutes, I had a fully working Cilium installation again.
![Cilium-cluster-working](images/cluster-working.png)

## Afterthought

Calima seams to be a seamless replacement for Docker desktop.

The biggest thing to be aware of, sems to be the resources that the VM is given, and that Calima don't auto start. But these are really minor things, that is fixable.

Thanks for reading this far.

Photo by <a href="https://unsplash.com/@marcojodoin?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Marc-Olivier Jodoin</a> on <a href="https://unsplash.com/photos/long-exposure-photography-of-road-and-cars-NqOInJ-ttqM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  