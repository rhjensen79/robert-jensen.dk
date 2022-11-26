---
title: "How I Deploy Apps - config"
date: 2022-11-12T19:46:27+01:00
tags : [Containers, Docker, Github, Kubernetes]
draft: true
thumbnail: "images/john-barkiple-l090uFWoPaI-unsplash.jpg"
#image: "images/john-barkiple-l090uFWoPaI-unsplash.jpg"
description: "How I deploy applications in my setup - configuration"
---

In my home setup, I have several tings running, and I thougt it could be interesting, for others, so hear how I deploy and manage it.

Note I don't do things the most easy way (to begin with), but I do like to make it as easy as possible to maintain, going forward, and I always have a focus, on trying to learn, some of the techniques used in the "real world" where possible.

In this blog post, I will focus on an application, that I use daily. It's the dashboard app [Homer](https://github.com/bastienwirtz/homer)
I use this as a easy bookmark page, for the main services I use in my job, mostly when i'm doing demos, to have fast access to them.

The app, is deployed on a single node Kubernetes cluster, in [Oracles free forever tier](https://www.oracle.com/cloud/free/) on a Ubuntu VM, running [MicroK8S](https://microk8s.io).
Note the things i describe here, can be used in other kinds of setups. Just replace Kubernetes with Docker, and use another deployment method etc.

After reading to the end, you should have an idea on how I

- commit changes to a private Github repo.
- Build a multi arc container
- Push that container to a private registry on Github
- Update the running config, with the new image, and config, on my Kubernetes cluster.

Sounds simple. It is, but it took me some time to get here, So wanted to share, what worked for me :-)

## Config

All configs, and deployment files for this app, are in [Github](https://github.com).

This goes for all my other things as well. If you are not using Git, then I recommend to get started with it.
I really like Github, but chose whatever works for you.

For this app, it's in a private Github org called TanzuDK (not that it really matters). The important things, is that it's in a private repo. This is important, when we get to the deployment part later.

There is only one branch at the time, and it's not protected.
I mostly just commit to the main branch, even thou it's probably not best practice.

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

The Application is configured, using the assets/config.yml file. So all I need to do, to add or edit, a bookmark, is to chainge that file, and maybe add a icon to the icons folder. and commit it, to deploy a new version.

The other files are

- Dockerfile

This is the file I use to build the container.

- docker-compose.yml

A compose file, used to build and test the config localy.

- homer.yaml

This is the deployment config for Kubernetes.

- .github/workflows/homer.yaml

The Github actions file, that I use for the CI part, of the deployment.

I will look closer at each of the above files, in the later posts.

## Build

## Deploy

## Access

## Demo

Photo by <a href="https://unsplash.com/@barkiple?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">John Barkiple</a> on <a href="https://unsplash.com/s/photos/wires?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  