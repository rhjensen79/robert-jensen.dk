---
title: "When Kubernetes is not the right choice"
date: 2023-06-27T12:00:00+01:00
tags : [Kubernetes, Docker, K8S, Github Action, Watchtower, CICD]
draft: false
toc: true
thumbnail: "images/minions.jpg"
#image: "images/kelly-sikkema-v9FQR4tbIq8-unsplash.jpg"
description: "How to update applications on Docker, the same you you would on Kubernetes"
---
## Intro

I'm a big fan of [Kubernetes](https://kubernetes.io). I use it a lot at work (maybe not a big suprice - Hint: [Tanzu](https://tanzu.vmware.com)) and I have also been running it at home.

- On a RPI cluster
- As VM's in a ESXi host
- As a single physical box
- And even as VM's hosted in Oracles cloud.

Most of the reason has been to learn, but it has also been about the way you deploy, manage and update applications on Kubernetes. There are so many tools out there, build to make it easy to update your application, by just by comitting some changes to a git repository.

Some of my favorites are

- [ArgoCD](https://argo-cd.readthedocs.io/en/stable/)
- [Fluxcd](https://fluxcd.io)

But as much as I love Kubernetes, it's not always the right choice.

## Docker

In my home setup, I have a small [Qnap nas](https://www.qnap.com/en/product/ts-364).
It's runs [Docker](https://www.docker.com), and even thou it has the option of also running a [K3s](https://k3s.io) cluster, I don't see any value in doing that.

Docker runs really stable, it's easy to manage, and it auto restarts, when the nas restarts.

It's rock solid, while still being flexible enough, for my needs.

But i'm really missing the whole CI/CD (Mostly CD) that comes with running Kubernetes.

So this blog post, is all about, one way I solved that, without running Kubernetes.

## Updates

The first thing I did, when I started running Docker, was to deploy [Watchtower](https://containrrr.dev/watchtower/).

Watchtower is an application, that checks for updated to containers, at a certain interval, and updates them if there is a new image avaliable.

Extemely usefull, but does require you to use latest tag. But it's an ok tradeoff, for my home setup.

Due to docker hub rate limiting, I check for new images every 24 hour.

That's also the reason, I started looking at doing something else, since an automated pipeline, that creates a new container image, takes up to 24 hours, to complete.

Not really usable. Not even in my home setup.

## Enhancing Watchtower

The solution I found, was that Watchtower has the option of enabling a [HTTP api mode](https://containrrr.dev/watchtower/http-api-mode/), where you can trigger an update of your containers, by calling an endpoint.

The drawback, was that it removed the schelduled update, but luckely whare was a fix to that as well :-)

I added my Watchtover container, to my Cloudflare network, and exposed Watchtower api, to the internet, so I could call the API from outside using Github Actions.

It's required to add an api token, to make it a bit more secure (it fails to start, if you don't specify it).

Som my end Docker-Compose.yaml file ended up looking like this

```yaml
services:
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    environment:
    - PUID=1000
    - PGID=100
    - TZ=Europe/Copenhagen
    - WATCHTOWER_CLEANUP=true
    - WATCHTOWER_LABEL_ENABLE=true
    - WATCHTOWER_INCLUDE_RESTARTING=true
    restart: unless-stopped
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 86400 --http-api-update --http-api-periodic-polls
    networks:
      - external
    environment:
      - WATCHTOWER_HTTP_API_TOKEN=MySecretToken
    ports:
      - 8080


networks:
  common:
    name: external
    external: true
```

To test it, I simply ran

```bash
curl -H "Authorization: Bearer MySecretToken" https://watchtower.domain.name/v1/update
```

And saw it update all my containers.

If I was running many jobs, then the Docker hub API limit, might have been a problem, but in my case, it should be ok to check for updates on all my running containers, everytime the API is called.

So now all i needed was to make it part of my pipeline

## Github Actions

GitHub Actions is my goto tool, when I want to automate something.

So to automate the update, I found an action, where I create and publish a new container image.

After the image has been published I added a new step, that calls the API.

And just to be a little bit secure, I created a Secret, containing the token from my Watchtower API.

The action step, ended up looking like this

```yaml
watchtower-update:
  runs-on: ubuntu-latest
  steps:
    # Get the repositery's code
    - name: REST API with curl
      run: |
        curl -H "Authorization: Bearer ${{ secrets.WATCHTOWER_TOKEN }}" https://watchtower.domain.name/v1/update
```

And it works perfectly.

Everytime I update my repo, a new container image is build, and pushed to my Github registry.
Then Watchtower api is called, and my running container on my NAS is updated.

Just the way I like it :-)

Thanks for reading this far.
