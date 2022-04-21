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




### Create Deployment


Photo by <a href="https://unsplash.com/@matthaeus123?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">matthaeus</a> on <a href="https://unsplash.com/collections/1964905/open-doors?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  