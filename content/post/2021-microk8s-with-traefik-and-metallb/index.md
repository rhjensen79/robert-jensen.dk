---
title: "Installing Microk8s With Traefik and Metallb"
date: 2021-10-18T20:32:15+02:00
Description: "How to install MicroK8S with Traefik and MetalLB on Ubuntu 20.04"
Tags: [k8s, kubernetes, traefik, metallb, reverse proxy, full guide, Tanzu, community]
Categories: []
DisableComments: false
toc: true
thumbnail: "images/kimi-lee-M3RVFbqKGu4-unsplash.jpg"
#images: 
#- "images/kimi-lee-M3RVFbqKGu4-unsplash.jpg"
draft: false
---
## Intro

For some time, I have been writing about setting up [Traefik](https://traefik.io), with [docker](https://www.docker.com), and using it as a reverse proxy, for my workloads.

I have been running a stand alone Docker host, for a while, but due to changes in my job (more about that in the next post), I wanted to change this to Kubernetes instead, to get a lot more hands on.

I have been a fan of Traefik, for quite some time. But getting it up and running on [Kubernetes](https://kubernetes.io), has not been easy. I think that it's mostly due to Kubernetes evolving so fast, so the guides out there, quickly get's outdated (or maybe it's just my lack of knowledge)

I ended up asking on the [Traefik forum](https://community.traefik.io/t/k8s-traefik-and-lets-encrypt/11937) for help, and I got pointed to a [Youtube channel](https://www.youtube.com/c/wenkatn-justmeandopensource/featured), that had a lot of good videos, on how to set this up.
A big thanks to [Ramon Tayag](https://community.traefik.io/u/ramon.tayag/summary) for pointing me this way.

## Extrenal Trainings etc

The playlist, that helped me, was [this one](https://youtube.com/playlist?list=PL34sAs7_26wNldKrBBY_uagluNKC9cCak), but there is so much good content in there, so I highly recommend giving the [channel](https://www.youtube.com/c/wenkatn-justmeandopensource/featured) a subscribe, and a lot of likes, for the awsome work.

This is my attempt, to write a simple guide, based on these [youtube videos](https://youtube.com/playlist?list=PL34sAs7_26wNldKrBBY_uagluNKC9cCak), on how to get [Microk8s](https://microk8s.io), up and running with [Traefik](https://traefik.io) and [MetalLB](https://metallb.universe.tf).

There are a lot of Kubernetes distributions out there.
[VMware](https://www.vmware.com) just released a [community version](https://tanzucommunityedition.io), of Tanzu, that I highly recommend, you take a look at, if you are looking into Kubernetes.

Expect to se a blog post or 2, around tthat in the future :-)

But since this was done, before Tanzu community edition was released, I will stick with MicroK8S, for this guide.

Let's get started.

## MicroK8S

I'm using a cleanly installed Ubuntu 20.04 for this guide.

Microk8S is deliveres as a [Snap](https://snapcraft.io) package, so it's easy to install.

Start by installing Snap, and nfs-common, if you want to use NFS for external storage (we will use this later in the guide).

```
apt update && apt install snapd nfs-common
```

Install MicroK8s.

```
snap install microk8s --classic
```

This will install a single Kubernetes host. If you want more, then follow the documentation, on how to do this.

To get the details for connection to the server, from your own laptop, type

```
microk8s config
```

For documentation and howto's on MicroK8S take a look at the [website](https://microk8s.io).

## MetalLB

Next step is install MetalLB, to get an external ipadress, that we can use for Traefik.

Reserve an iprange that it can use, and enable metalLB using the following command (substitute this range, with yours)

```
microk8s enable metallb:192.168.100.240-192.168.100.250
```

You now have a working Loadbalancer service, that we can use.

## Storage

Traefik requires storage, for saving the certificates it pulls from [Let's Encrypt](https://letsencrypt.org).
In my case, I have used NFS.
So if you want to do the same, then make sure you have some NFS storage, that you can access from your Kubernetes cluster.

We then add the Helm repo, update it, and deploy it to the cluster, in a namespace, called Operations.
Replace ipadress and path, to make it fit your storage.

```
helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/
helm repo update
helm install nfs-subdir-external-provisioner nfs-subdir-external-provisioner/nfs-subdir-external-provisioner -n operations \
    --set nfs.server=192.168.100.20 \
    --set nfs.path=/volume1/kube \
    --set storageClass.archiveOnDelete=false \
    --set storageClass.defaultClass=true 
```

If you run

```
kubectl get sc
```

![Get SC](images/get_sc.png)

you shuld now see you new storage class, with a (default) after it, showing that it's the default storage, meaning we don't have to specify it later.
If you want other configurations, then look at the [Github](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner) page, for the project. for documentation.

## Traefik

To install Traefik we add the Helm repo (There is also a build in option, but that is for another guide).

```
helm repo add traefik https://helm.traefik.io/traefik
helm repo update
helm show values traefik/traefik > traefik-values.yaml
helm install traefik traefik/traefik -n traefik --create-namespace
```

Traefik is now installed in the namespace traefik, and we have a config file, that we can edit, to make it fit our needs.

Open traefik-values.yaml and edit/add the following options.

```
additionalArguments: 
  - --certificatesresolvers.letsencrypt.acme.tlschallenge=true
  - --certificatesresolvers.letsencrypt.acme.email=your-own-email
  - --certificatesresolvers.letsencrypt.acme.storage=/data/acme.json
  - --certificatesresolvers.letsencrypt.acme.caserver=https://acme-v02.api.letsencrypt.org/directory
```

and

```
persistence:
  enabled: true
  name: data
#  existingClaim: ""
  accessMode: ReadWriteOnce
  size: 128Mi
  # storageClass: ""
  path: /data
  annotations: {}
```

and the update your Traefik deployment using

```
helm upgrade --install traefik traefik/traefik --values traefik-values.yaml -n traefik
```

If you have DNS and port forward in place, you should be able to expose your traefik dashboard, with an Let's Encrypt certificate, by creating the file dashboard.yaml with the following content

```
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: dashboard
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`your public DNS name`) 
      kind: Rule
      services:
        - name: api@internal
          kind: TraefikService
  tls:
    certResolver: letsencrypt
```

and running

```
kubectl apply -f dashboard.yaml
```

To check that the dashboard is working go to <https://yoururl/dashboard/>
remember the last / it's important.

You should also see, that a file acme.json shows up, in a folder traefik-traefik-pvc-xxxxxxx in the nfs directory you specified.
This is the certificate, that Traefik get's from Let's Encrypt.

## Exposing apps

You can now expose your apps, by creating an IngressRoute, in the following way, on your apps.
The TLS part, tells Traefik to pull a valid certificate from Let's Encrypt.

```
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: whoami-https
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`your-dns-name`)
      kind: Rule
      services:
        - name: whoami-service
          port: 80
  tls:
    certResolver: letsencrypt

```

## Closing

There is probably tons of more stuff, I could show, but this must be it for now.
I hope this guide, can help some of you, that is also struggeling.

And again I highly recommend that you take a look at the [Youtube Channel](https://www.youtube.com/c/wenkatn-justmeandopensource/featured) if you want to learn more.

Photo by <a href="https://unsplash.com/@kimileee?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">kimi lee</a> on <a href="https://unsplash.com/s/photos/highway?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  