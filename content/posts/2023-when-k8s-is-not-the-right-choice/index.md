---
title: "When Kubernetes is not the right choice"
date: 2023-06-27T12:00:00+01:00
tags : [Kubernetes, Docker, K8S]
draft: true
toc: true
thumbnail: "images/amos-from-stockphotos-com-4N8oM5L7hyM-unsplash.jpg"
#image: "images/kelly-sikkema-v9FQR4tbIq8-unsplash.jpg"
description: "How to update applications on Docker, the same you you would do on Kubernetes"
---
## Intro

I'm a big fan of Kubernetes. I ise it a lot at work (maybe not a big suprice) and i have also been running it at home. Both on a RPI cluster, as VM's in a ESXi host, As a single physical box, and even as VM's hosted in Oracles cloud.

Most of the reason has been to learn, but it's also about the way you deploy, manage and update applications on Kubernetes. There are so many tools out there, build to make it easy to update your application, just by comitting some changes to a git repository.

But as much as i love Kubernetes, it's not always the right choice.

## Docker

In my home setup, I have a small Qnap nas.
It's runs Docker, and even thou it has the option of also running a K3s cluster, I don't see any value in doing that.
Docker runs really stable, it's easy to manage, and it auto restarts, when the nas restarts. It's rock solid, while still being flexible enoug, for what I need.
