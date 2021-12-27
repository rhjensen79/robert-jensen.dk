---
title: "Using Github Actions With Tailscale to bouild in the and and Deploy Localy"
date: 2021-12-27T19:46:27+01:00
tags : [Github, Actions, Tailscale, Kubernetes, K8S, container, Docker]
draft: true
thumbnail: "images/jack-sloop-eYwn81sPkJ8-unsplash.jpg"
images: "images/jack-sloop-eYwn81sPkJ8-unsplash.jpg"
description: "How to use github Actions, to Create and build docker containers, and then deploy them localy using Tailscale, in Kubernetes"
---

I have been a long time user of GitLab, due to the fact, that their runners was so easy to get working, and they allowed me to be on prem, when i ran my jobs, to deploy them to my local enviorements. 

I have long been looking at Github actions, but found it hard, to combine this with local deployments (might just be me, who havent found out how).
But then [TailScale](www.tailscale.com) did a [blog post](https://tailscale.com/blog/2021-05-github-actions-and-tailscale/), on how to use them, with [Github](www.github.com) Actions.

This was exactly what I was looking for.
I have been using Tailscale for a long time, to get remote access to my lab enviroment, when i'm on the road. 
And this was the solution that would allow me to use internal ressources, without opening my firewall to the internet. 

All I needed now, was a project, where I could use the two.

### The Project

So this blog post, is not about the project. but I wanted to share a bit of light, on that it is i'm doing here.

The project i'm using here, is a small hobby project, where I grab the current electricity price, and if the price is below a certain amount, I start to charge my electrical car. 
Pretty simpel, but iø'm also trying to make this a lot more complex, but splitting out, what could probably just be a single script, into multiple containers, deployed on Kubernetes. 
The reason is that I also wan't to be able to use this, as a demo app, for my day job. 

So right now, i have 4 containers.
- Value : Grabs the current price
- Log : Sendts logs/metrics to [Tanzu Observability](https://tanzu.vmware.com/observability)
- Control : Controls my charger
- Monitoring : Local monitoring page, with controls for the wanted price, overwride controls etc. 

The name of the app is Perfect-Charge


### Security

An important thing around this project, is that everything is as secure as possible.
This menans it a private GitHub Repo.
There a no passwords in any files. It's all done using env variables, and Github/K8S secrets. 
The Tailscale client, is using Ephemeral keys, that only last a short amount if time.
On the todo list, is to make sure, the Tailscale client, can only talk to the K8S cluster, using Tailscale ACL.

