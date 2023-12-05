---
title: "VScode Devcontainer and Git signing"
date: 2023-12-05T00:00:00+01:00
tags : [VScode, Git, SSH, Devcontainer]
draft: false
toc: true
thumbnail: "images/certificate.jpg"
#image: "images/felix-mooneeram-evlkOfkQ5rE-unsplash.jpg"
description: "How to setup VScode Devcontainer to use a local SSH key for signing"
---
## Intro

I have long been a fan of [VScode DevContainer extention](https://code.visualstudio.com/docs/devcontainers/create-dev-container).

The idea is really simple.
To make sure you have a clean, reusable dev enviroment, for each of your projects, you spin it up in a container, with all the dependencies you need.

Simple right ? 

## Problem

Setting up a new laptop, I descided that I needed to be better at creating enviroments, that I can reuse across different systems etc. 
So I started setting up a simple Devcontainer env.

But starting on a new laptop, also ment, that I just setup [Git signing](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work), using SSH keys. 
And at the very first commit, I encountered the problem. 

Signing did now work.

## Why

It's kinda simple.
The VScode env takes all my settings, and put's them into the container.
The path and the SSH key is just not there, and there is no mapning to the key files.

## Solution

The solution was also kinda simple.
Map the .ssh  directory into my Container.

So my new Devcontainer.json file looks like this
```
{
	"name": "Python 3",
	"image": "mcr.microsoft.com/devcontainers/python:1-3.12-bullseye",

	"mounts": [
		"type=bind,source=${localEnv:HOME}/.ssh,target=${localEnv:HOME}/.ssh,readonly",
	]
}
```

To make sure it's reusable across different accounts, I used the `${localEnv:HOME}` path, instead of a hardcoded path. 

Now all my commits are verified again (as they should be), and it's reusable everywhere I need it. Just note, that I need to have a SSH key, that I can use to sign, on any system I run this on.
![verified](images/verified.png)


## Links

If you are not signing your commit, then you should get started ASAP.
It's not that hard, and since Git 2.34 it's been possible to use a SSH key as signing which for me, makes it a lot easier.

Github has a nice [Guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) on how to set this up.

Photo by <a href="https://unsplash.com/@skillscouter?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Lewis Keegan</a> on <a href="https://unsplash.com/photos/text-XQaqV5qYcXg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  