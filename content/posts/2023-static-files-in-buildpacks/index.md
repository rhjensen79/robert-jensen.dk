---
title: "Static files in Buildpacks"
date: 2023-01-20T12:00:00+01:00
tags : [Buildpacks, Containers, Golang, static]
draft: false
toc: true
thumbnail: "images/amos-from-stockphotos-com-4N8oM5L7hyM-unsplash.jpg"
#image: "images/kelly-sikkema-v9FQR4tbIq8-unsplash.jpg"
description: "How to use static files in Buildpacks"
---
## Intro

I spend quite some time the other day, trubleshooting how to preserve static files, when using [Buildpacks](https://buildpacks.io). So I thought it was a good idea to document it here, in case other's have the same problem.

## The problem

When you are using Buildpacks, in [Tanzu Application Platform (TAP)](https://tanzu.vmware.com/application-platform), like I am.

You point to your repository, and then you get a container, that is build to run that code. It does not know, of the static files, you might reference in your code.

In my case, I was building a Golang Webserver, to serve some static HTML content. And yes, that HTML content, was the source of my problem.

## File structure

So my file structure in my project, looks like this.

```bash
.
├── README.md
├── accelerator-log.md
├── app
│   ├── html
│   │   ├── index.html
│   │   ├── style.css
│   │   └── tap-into-prod.png
│   └── main.go
├── catalog
│   └── catalog-info.yaml
├── config
│   └── workload.yaml
├── docs
│   ├── index.md
│   └── links.md
├── k8s-resource.yaml
├── mkdocs.yml
└── project.toml
```

The interesting part, is what's in the app folder and below.
The rest is mostly for TAP, and someting we can talk about another day.

## Build

So TAP (or Buildpacks) looks at the root of the directory, for code to determine how to build the container.
In my case my code is in the app folder.
So I needed to tell it, where to look.
That is done, using a project.toml file, in the root of my repository.

To point it to my folder, I first added an env variable that does just that.

```bash
[[ build.env ]]
name="BP_GO_TARGETS"
value="./app"
```

That resulted in a nice container, without any files.
So I had to add another variable, to tell it which files to preserve.

```bash
[[ build.env ]]
name="BP_KEEP_FILES"
value="app/html/*"
```

I had to give it the full path, for it to work.

One could think, that a html folder would now apear, in my container. But no.

The full path of the files, is now at `/workspace/app/html/`
So that is where I ended up pointing my webserver root to.

Not hard, when you find out how, but I did have to ask some collegaues, before I found the solution.

The full project.toml file, ended up looking like this

```bash
# project.toml
[ build ]

[[ build.env ]]
name="BP_GO_TARGETS"
value="./app"

[[ build.env ]]
name="BP_KEEP_FILES"
value="app/html/*"
```

I'm not 100% sure the first part is needed, but it's working now, so i'm keeping it.

## Documentation

It turns out, it is actualily documented quite nicely in the Github repo [https://github.com/paketo-buildpacks/go-build](https://github.com/paketo-buildpacks/go-build#bp_keep_files) but it was not something I found, while i was searching.

Photo by <a href="https://unsplash.com/@stockphotos_com?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Amos from Stockphotos.com</a> on <a href="https://unsplash.com/photos/4N8oM5L7hyM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  