---
title: "Remote Access to POD, without opening firewall, on Tanzu Community Edition"
date: 2022-04-21T08:36:34+02:00
tags : [Access, Ports, Firewall, Tanzu, Community edition, K8S, Kubernetes, Pods, Service, CloudFlare]
draft: true
thumbnail: "images/matthaeus-hew8vAvvvz4-unsplash.jpg"
images: "images/matthaeus-hew8vAvvvz4-unsplash.jpg"
description: "How to open a local POD or Service, to the outside world, without opening any firewall ports"
---
In tihs blog post, i'm gonna show you, how you can open access up to an internal pod, running on your own machine, to the outside world. All without opening any firewall ports, and with a valid certificate, and access control. And did i mention, it's all for free.

I will be doing all on the [Tanzu Community edition](https://tanzucommunityedition.io). It will work on any Kubernetes distibution, Docker container etc. But when we got a cool free product, why not show it there :-) 

## Install Tanzu Community Edition

First off, let's install Tanzu Community edition.
I'm using a Mac, with Brew and docker already installed, so it's really easy.
If you are using something else, then you have to read thru the [documentation](https://tanzucommunityedition.io/docs/v0.11/).

Just run 
```
brew install vmware-tanzu/tanzu/tanzu-community-edition
```

After that, it's as easy as running the following, to get your first cluster up and running
```
tanzu unmanaged-cluster create firstcluster
```

After a minute or so, you should see
```
✅ Cluster created

🎮 kubectl context set to firstcluster
```
To see everything is working run
```
kubectl get pods -A
```
In my setup setup everything looks good
```
NAMESPACE            NAME                                                 READY   STATUS    RESTARTS   AGE
kube-system          calico-kube-controllers-59ccff4b57-mcmlx             1/1     Running   0          100s
kube-system          calico-node-4k986                                    1/1     Running   0          100s
kube-system          coredns-78fcd69978-282k6                             1/1     Running   0          2m12s
kube-system          coredns-78fcd69978-tt28j                             1/1     Running   0          2m12s
kube-system          etcd-firstcluster-control-plane                      1/1     Running   0          2m28s
kube-system          kube-apiserver-firstcluster-control-plane            1/1     Running   0          2m28s
kube-system          kube-controller-manager-firstcluster-control-plane   1/1     Running   0          2m28s
kube-system          kube-proxy-r5kd7                                     1/1     Running   0          2m12s
kube-system          kube-scheduler-firstcluster-control-plane            1/1     Running   0          2m27s
local-path-storage   local-path-provisioner-85494db59d-p5crc              1/1     Running   0          2m12s
tkg-system           kapp-controller-779d9777dc-hf7fr                     1/1     Running   0          2m12s
```

### Configure remote access

The thing that makes all of this work, is [Cloudflare](https://www.cloudflare.com) so you will need to have at least an account there, and a domain, controlled by them.

It's free, and I have been using them, to host all my domains, for the last couple of years, so i can recommend you doing the same.

Once that is done, you need to login, and access their [Zero Trust page.](https://dash.teams.cloudflare.com/)

I seam to remember, having to setup a team the first time i opened the link, just follow the guide if that is the case for you. It's quite easy.



### Create container

Since i'm using an Arm Based M1, I cannot use the officiel Docker image on [Docker Hub](https://hub.docker.com/r/cloudflare/cloudflared). 
Also to be honest, I have yet to make it work, exactly like I want it to. But I think it has more to do with me, than the image.

So I created a simple one, that works on Arm.

The Dockerfile is simply 
```
FROM ubuntu:20.04 AS stage
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get upgrade -y && \
    wget https://github.com/cloudflare/cloudflared/releases/download/2022.4.1/cloudflared-linux-arm64.deb && \
    dpkg -i cloudflared-linux-arm64.deb
FROM stage
CMD ["cloudflared","tunnel","run"]
```

I also created a Github Repo, that can build the image, and share it, so it's easy to access.
You can find the repo, with all the details [here](https://github.com/TanzuDK/cloudflared)
To pull the container image simply run 
```
docker pull ghcr.io/tanzudk/cloudflared:latest
```
Note that it's currently only for ARM, and not x86.


### Create Deployment




### Cleanup

To delete your running cluster, and cleanup just run
```
tanzu unmanaged-cluster delete firstcluster
```

Photo by <a href="https://unsplash.com/@matthaeus123?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">matthaeus</a> on <a href="https://unsplash.com/collections/1964905/open-doors?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  