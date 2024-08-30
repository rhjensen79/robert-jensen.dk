---
title: "VCF NSX Install Fails at 48 percent"
date: 2024-02-18T12:00:00+01:00
tags : [VMware, Broadcom, NSX, VCF]
draft: true
toc: true
thumbnail: "images/marc-olivier-jodoin-NqOInJ-ttqM-unsplash.jpg"
#image: "images/kelly-sikkema-v9FQR4tbIq8-unsplash.jpg"
description: "vCloud Foundation (VCF)"
---
## The problem

For the last 12 years, I have been working in different locations, where I had to have access to different tools, enviroments etc. no matter where I were.

Due to that, it's a core part of my way of working, that all tools, must be either synced or avaliable, whereever I am, as long as I have a working internet connection.

Due to that, I'm a huge fan of [Tailscale](https://tailscale.com), and I use it to access more or less everything I have. if you havent tried it yet, then stop reading, and go test it now. You will thank me later. It truly binds all my services together, and allows me to acces them anywhere.

I'm also using different computers, and having the same dev enviroment on all of them, can be a challenge. 
That's why i'm also using [Devcontainers](https://code.visualstudio.com/docs/devcontainers/containers), as much as possible.

Devcontainers also allow me to use [Github Codespaces](https://github.com/features/codespaces), to spin up a dev env in the cloud. But that one does not have access to local ressources, which I might need.
And that's where Tailscale is a perfect match. It combines cloud with access to my services.

In this blog post, I want to show you, how to setup Devcontainers with Tailscale, and how to use it remote with Github Codespaces.

## Prerequisite

To use this guide you must have the following installed.
- [vscode](https://code.visualstudio.com)
- A container engine ([Docker desktop](https://www.docker.com/products/docker-desktop/), [Colima](https://github.com/abiosoft/colima) etc.)
- [vscode Devcontainer extention](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- A [Github](https://github.com) account


## Setup

I created a new folder and opened vscode in in.
```bash
mkdir devcontainer
cd devcontainer
code.
```

Then I opened VScode command pallette and found "Dev Containers: Add Devcontainers Configuration files..."
![image](images/1.png)

I chose to add the files to my workspace, to keep it in Git. This is my prefered option, since config and code stays in the same location.
![image](images/2.png)

I selected Python, since that is what I will be developing in. But there are tons of options, if you are doing something else.
![image](images/3.png)

I chose latest version as of this writing.
If I was updating an older project, then I might have chosen a different version, that was more compatible. But this is part of the strenght of Devcontainers. You can have a different env, for each repo.
![image](images/4.png)

Then I searched for Tailscale, to have that automaticly installed inside my container.
![image](images/5.png)

VScode automaticly detects that there is now a Devcontainer config, and asked me if I want to open my env inside of it. I selected "Reopen in container", to have it build and run.
![image](images/6.png)

After a short while (Depending on the hardware you are running on), I have a VScode running inside of a container, with the latest version of Python and Tailscale installed.


I also got a couple of new files and folders.

the .devcontainer folder contains the devcontainer.json file, which contains all the configurations of my env

I also got a .github folder, with a dependabot.yml file. 

I won't go into that in this post, but it's used, to help me keep my dentainers and code up2date.

```bash
.
├── .devcontainer
│   └── devcontainer.json
└── .github
    └── dependabot.yml
```

The new devcontainer file looks like this 
```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/python
{
	"name": "Python 3",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/python:1-3.12-bullseye",
	"features": {
		"ghcr.io/devcontainers-contrib/features/tailscale:1": {}
	}

	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],

	// Use 'postCreateCommand' to run commands after the container is created.
	// "postCreateCommand": "pip3 install --user -r requirements.txt",

	// Configure tool-specific properties.
	// "customizations": {},

	// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
	// "remoteUser": "root"
}
```

So in theory this should work, and have done so in the past.
But when I was testing out, writing this article, I could not get Tailscale to start. 
So my setup ended up looking a bit different.

### Devcontainer.json

My devcontainer.json file ended up looking like this (I removed all the comments etc.)
```json
{
	"name": "Python 3",
	"image": "python:3.12",
	"runArgs": ["--env-file",".devcontainer/devcontainer.env"],
	"postCreateCommand": ".devcontainer/install.sh"
}
```
The changes are :
- The image is changed to the latest python:3.12, since I could not get Tailscale working with the official Devcontainer image.
- I load env variables at start, that I use when I start Tailscale.
- I run a post install script, that install Git, curl and Tailscale and later maybe other things I need in my dev env.

Both devcontainer.env and install.sh are located in my .devcontainer folder.
Remember to add .devcontainer/devcontainer.env to your .gitignore file, to make sure you don't commit secrets etc.

### Devcontainer.env

The devcontainer.env contains
