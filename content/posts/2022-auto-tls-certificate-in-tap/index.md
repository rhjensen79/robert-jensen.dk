---
title: "How I Deploy Apps - config"
date: 2022-11-12T19:46:27+01:00
tags : [Containers, Docker, Github, Kubernetes]
draft: true
thumbnail: "images/bank-phrom-Tzm3Oyu_6sk-unsplash.jpg"
images: "images/bank-phrom-Tzm3Oyu_6sk-unsplash.jpg"
description: "How I deploy applications in my setup - configuration"
---

In my home setup, I have several tings running, and I thougt it could be interesting, for others, so hear how I do things, for inspiration.
I don't do things the most easy way (to begin with), but I do like to make it as easy to maintain, going forward, and I always have a focus, on trying to learn, some of the techniques used in the "real world" where possible,

In this blog post, I will focus on an application, that I use daily. It's the dashboard app [Homer](https://github.com/bastienwirtz/homer)
I use this as a easy bookmark page, for the services I use in my job, mostly when i'm doing demos, to have fast access to them.

The app, is deployed on a single node Kubernetes cluster, in [Oracles free forever tier](https://www.oracle.com/cloud/free/) on a Ubuntu VM, running [MicroK8S](https://microk8s.io)

## Config

All config, and deployment for this app, are in [Github](https://github.com)
In this case, it's in a priva Github org called TanzuDK (not that it really matters). The important things, is that it's in a private repo. This is important, when we get to the deployment part.

The repo's file structure, looks like this (I excluded the .git directory). The app itself, is in the "assets" directory, so my focus in this post, is around the other files.

```
.
├── .DS_Store
├── .github
│   └── workflows
│       └── homer.yaml
├── Dockerfile
├── assets
│   ├── .DS_Store
│   ├── additional-page.yml.dist
│   ├── config.yml
│   ├── config.yml.dist
│   ├── config.yml.dist.sample-sui
│   ├── custom.css.sample
│   ├── icons
│   │   ├── argo-icon-color.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── firewall.png
│   │   ├── grafana_icon.svg
│   │   ├── harbor-icon-color.png
│   │   ├── icon-any.png
│   │   ├── icon-any.svg
│   │   ├── icon-maskable.png
│   │   ├── qnap.png
│   │   ├── safari-pinned-tab.svg
│   │   ├── saltstack-icon-white-fill.png
│   │   ├── saltstack.png
│   │   ├── tanzu-icon.png
│   │   ├── tekton.png
│   │   ├── vcd.png
│   │   └── vcenter.png
│   ├── manifest.json
│   └── tools
│       ├── sample.png
│       └── sample2.png
├── docker-compose.yml
├── homer.yaml
└── readme.md
```

The Application is configured, using the config.yml file. So all I need to do, to add or edit, a bookmark, is to chainge that file, and maybe add am icon to the icons folder. and commit it. I will show the entire flow, in the end.

The other files are

- Dockerfile
This is the

## Build

## Deploy

## Access

## Demo
