---
title: "Installing Harbor Container Registry Behind Traefik Reverse Proxy With Letsencrypt Certificate"
date: 2021-02-19T13:53:10+01:00
tags : [Harbor, Traefik, Letsencrypt, Registry, Docker, security, proxy, reverse proxy, Container Registry]
draft: true
thumbnail: "images/everaldo-coelho-KPaSCpklCZw-unsplash.jpg"
---
Ever since [Docker](https://www.docker.com) enforced their [rate limit](https://www.docker.com/increase-rate-limits), I have been looking at using some other registry.

Everywhere you look, [Harbor](https://goharbor.io) is mentioned, so that is the one, that I have been looking at. 
The problem with Container registrys, is that Docker requires there to be a valid certificate, for them to work.
I could just buy a certificate, and use that, but i'm a big fan of [Let's Encrypt](https://letsencrypt.org) so it was natural for me to look into using that.

To make Let's Encrypt work, I would have to expose Harbor to the internet, and I only have one public ipadress, and that is used by my Traefik proxy (on the same ports). Luckely, I can just use Traefik, to generate the certificates, and publish my Harbor container registry.

This blog is about how to do just that :-) 

### Before you begin

- A working Traefik proxy
My setup is [described here](https://www.robert-jensen.dk/posts/2021-secure-deployments-with-docker-and-traefik/), and should be quite easy to follow.

- An clean Ubuntu 18.04 VM for running Harbor
(That is what i'm using anyway)

### Installatin of Harbor

Note: I found a lot of my inspiration, in this [guide](https://thenewstack.io/tutorial-install-the-docker-harbor-registry-server-on-ubuntu-18-04/).
The steps for installing with Traefik is.

Note: I'm running as root, so change accordingly if you are not. 

Install Docker
```
apt-get install docker.io
```
Install Docker-Compose
```
wget https://github.com/docker/compose/releases/download/1.28.4/docker-compose-Linux-x86_64

mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
```
Install NGINX
```
apt-get install nginx
systemctl start nginx
systemctl enable nginx
```

Download Harbor
I chose to install mine in /srv
```
cd /srv

wget https://github.com/goharbor/harbor/releases/download/v2.0.6/harbor-online-installer-v2.0.6.tgz
tar xvzf harbor-online-installer-v2.0.6.tgz

cd harbor
```




Run the installer with trivy (Security scanner)
```
./install.sh --with-trivy
```

<span>Photo by <a href="https://unsplash.com/@_everaldo?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Everaldo Coelho</a> on <a href="https://unsplash.com/s/photos/lighthouse?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
