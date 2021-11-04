---
title: "Manage Multiple Kubeconfigs Using iCloud and Kubectx"
date: 2021-11-04T13:37:46+01:00
tags : [Kubernetes, k8s, kubectx, kubeconfig, fzf, iCloud, apple, config]
draft: false
thumbnail: "images/wesley-tingey-snNHKZ-mGfE-unsplash.jpg"
images: "images/wesley-tingey-snNHKZ-mGfE-unsplash.jpg"
description: "How to manage multiple kubeconfig files, using iCloud sync, and Kubectx"
---

As a part of my [new role](https://www.robert-jensen.dk/posts/2021-new-role/), I found myself having to manage a lot of different Kubeconfig files.

Switching between 2 computers, meant it quicly became a mess, to have access to the same configs, all the time.

This is my little guide on how to solve this.
Note there might be a better way to do this, if you know of one, then let me know on Twitter :-) 

### Kubectx

The best way to switch between configs, seams to be [Kubectx](https://github.com/ahmetb/kubectx)
It's easy to install, and if you also install [fzf](https://github.com/junegunn/fzf) then you can even switch between your configs, using an interactive menu. Really cool :-) 

Follow the links, for installation etc.

### Config files

Normally your config files, goes into the ~/.kube folder
My problem is that it does not sync.
So I have placed mine in ~/Documents/kubeconfig and turned on iCloud sync

All my config files, are then named kubeconfig- with the name after

Like 

kubeconfig-tanzu

kubeconfig-microk8s

etc.

### Configure Kubectx

To make Kubectx look into my kubeconfig folder, I found a small command to run
```
export KUBECONFIG=`ls -1 ~/Documents/kubeconfig/kubeconfig-* | paste -sd ":" -`
```

It sets the KUBECONFIG variable, to point to the files with the name kubeconfig- from the kubeconfig folder
And this is used by Kubectx to provide the list, of my configs.

### Configure on startup

Since the files will change, be deleted and added, I need this to be done automaticly.

In ZSH (the shell used in OSX) it easy
Just add the line
```
export KUBECONFIG=`ls -1 ~/Documents/kubeconfig/kubeconfig-* | paste -sd ":" -`
```

to the end of the ~/.zshrc 
and it will run, every time you start a new terminal.

![terminal](images/terminal.png)

An easy fix, to keep my config files in sync :-) 

Hope you found this usefull