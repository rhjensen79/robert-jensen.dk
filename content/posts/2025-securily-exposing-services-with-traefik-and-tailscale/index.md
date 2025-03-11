---
title: "Securely Exposing Services with Traefik and Tailscale"
date: 2025-03-10T12:00:00+01:00
tags : [Docker, Traefik, Tailscale, Networking, Security, Proxy]
draft: false
toc: true
thumbnail: "images/joshua-sortino-LqKhnDzSF-8-unsplash.jpg"
description: "How to securely expose internal services on your Tailscale network using Traefik as a reverse proxy"
---
## Intro

I've been using [Tailscale](https://tailscale.com) for quite some time now, and it's one of those tools that just works. It creates a mesh VPN between my devices, making it easy to access services regardless of where I am.

However, I've always wanted a cleaner way to access my internal services without remembering IP addresses or using different ports, and with valid certificates. 

I wanted a solution that would:

1. Use nice, clean URLs for all my services
2. Automatically handle HTTPS certificates
3. Keep everything secure within my Tailscale network
4. Be easy to maintain and scale

The solution I found was to combine [Traefik](https://traefik.io) with Tailscale, creating a secure gateway to all my services with clean, custom domain names.

## The Concept

The basic idea is simple:

1. Set up a Tailscale node as a container in Docker
2. Attach a Traefik container to that Tailscale container, to share ip
3. Create a wildcard DNS record (*.ts.mydomain.com) pointing to my Tailscale node
4. Configure Traefik to route requests to the appropriate services based on container name

This creates a setup where I can access any of my services using a URL like `service-name.ts.mydomain.com`, and all traffic is routed securely through my Tailscale network.

## DNS Setup

The first step was to create a CNAME record for my subdomain. I added a wildcard CNAME record for `*.ts.robert-jensen.dk` that points to my Tailscale endpoint.

This means that any request to a domain ending in `.ts.robert-jensen.dk` will be directed to my Tailscale node.

## Docker Compose Setup

Here's the Docker Compose configuration I'm using:

```yaml
services:
  tailscale-traefik:
    image: ghcr.io/tailscale/tailscale:stable
    hostname: tailscale-traefik
    container_name: tailscale-traefik
    networks:
      - tailscale
    environment:
      - TS_AUTHKEY=${TS_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-tags=tag:container
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=false
    volumes:
      - tailscale:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
    restart: always
    labels:
      - com.centurylinklabs.watchtower.enable=true
  traefik:
    image: traefik:3
    container_name: ts-traefik
    restart: always
    security_opt:
      - no-new-privileges:true
    environment:
      - TZ=Europe/Copenhagen # Change this to your timezone
      - CF_API_EMAIL=${CF_API_EMAIL}
      - CF_DNS_API_TOKEN=${CF_DNS_API_TOKEN}
      - LEGO_DISABLE_CNAME_SUPPORT=true
    depends_on:
      - tailscale-traefik
    network_mode: service:tailscale-traefik
    healthcheck:
      test: traefik healthcheck || exit 1
      interval: 60s
      timeout: 30s
      retries: 3
      start_period: 20s
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro # Docker socket to watch for Traefik
      - traefik-certs:/certs
      - conf:/etc/traefik/
    labels:
      - com.centurylinklabs.watchtower.enable=true
      - tailscale=true
      - traefik.enable=true
      - traefik.http.routers.traefik.rule=Host(`traefik.ts.robert-jensen.dk`)
      - traefik.http.routers.traefik.entrypoints=websecure
      - traefik.http.routers.traefik.tls.certresolver=letencrypt
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.services.traefik.loadbalancer.server.port=8080
volumes:
  tailscale: null
  conf:
    driver: local
    driver_opts:
      o: bind
      type: none
      device: /share/Container/conf/ts_traefik/
  traefik-certs: null
networks:
  tailscale:
    external: true
```

Let's break down the key components:

## Understanding the Components

### Tailscale Container

The first service is the Tailscale container:

```yaml
tailscale-traefik:
  image: ghcr.io/tailscale/tailscale:stable
  hostname: tailscale-traefik
  container_name: tailscale-traefik
  networks:
    - tailscale
  environment:
    - TS_AUTHKEY=${TS_AUTHKEY}
    - TS_EXTRA_ARGS=--advertise-tags=tag:container
    - TS_STATE_DIR=/var/lib/tailscale
    - TS_USERSPACE=false
  volumes:
    - tailscale:/var/lib/tailscale
    - /dev/net/tun:/dev/net/tun
  cap_add:
    - net_admin
    - sys_module
  restart: always
  labels:
    - com.centurylinklabs.watchtower.enable=true
```

This container:
- Uses the official Tailscale image
- Requires an auth key (stored as an environment variable)
- Mounts `/dev/net/tun` for networking
- Requires the `net_admin` and `sys_module` capabilities
- Stores Tailscale state in a persistent volume
- Is tagged for Watchtower updates

### Traefik Container

The second service is Traefik:

```yaml
traefik:
  image: traefik:3
  container_name: ts-traefik
  restart: always
  security_opt:
    - no-new-privileges:true
  environment:
    - TZ=Europe/Copenhagen
    - CF_API_EMAIL=${CF_API_EMAIL}
    - CF_DNS_API_TOKEN=${CF_DNS_API_TOKEN}
    - LEGO_DISABLE_CNAME_SUPPORT=true
  depends_on:
    - tailscale-traefik
  network_mode: service:tailscale-traefik
  healthcheck:
    test: traefik healthcheck || exit 1
    interval: 60s
    timeout: 30s
    retries: 3
    start_period: 20s
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - traefik-certs:/certs
    - conf:/etc/traefik/
  labels:
    - com.centurylinklabs.watchtower.enable=true
    - tailscale=true
    - traefik.enable=true
    - traefik.http.routers.traefik.rule=Host(`traefik.ts.robert-jensen.dk`)
    - traefik.http.routers.traefik.entrypoints=websecure
    - traefik.http.routers.traefik.tls.certresolver=letencrypt
    - traefik.http.routers.traefik.service=api@internal
    - traefik.http.services.traefik.loadbalancer.server.port=8080
```

Key aspects of this configuration:
- Uses Traefik v3 (the latest)
- Uses `network_mode: service:tailscale-traefik` to share the same network/ip as the Tailscale container
- Mounts the Docker socket to auto-discover services
- Stores certificates in a persistent volume
- Configures itself to be accessible at `traefik.ts.robert-jensen.dk`
- Has Cloudflare DNS credentials for Let's Encrypt DNS challenge

## Traefik Configuration

In addition to the Docker Compose file, I needed to configure Traefik. My base configuration is stored in `/share/Container/conf/ts_traefik/` and contains:

### traefik.yml

```yaml
api:
  dashboard: true # Optional can be disabled
  insecure: true # Optional can be disabled
  debug: false # Optional can be Enabled if needed for troubleshooting
entryPoints:
  websecure:
    address: ":443"
serversTransport:
  insecureSkipVerify: true

ping:
  entrypoint: "websecure"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    constraints: "Label(`tailscale`,`true`)"
  file:
    directory: "/etc/traefik/dynamic"
    watch: true
certificatesResolvers:
  letencrypt:
    acme:
      email: MyEmailAddress
      storage: /certs/acme.json
      caServer: https://acme-v02.api.letsencrypt.org/directory # production (default)
      #caServer: https://acme-staging-v02.api.letsencrypt.org/directory # staging
      dnsChallenge:
        provider: cloudflare
        delayBeforeCheck: 10 #Optional to wait x second before checking with the DNS Server
        resolvers:
        - "1.1.1.1:53"
        - "8.8.8.8:53"
```

Note this has a constraint setup, so it requires the container, to have the label "tailscale=true" for it to be picked up by this traefik container.
This is done since I have more Traefik proxys running on the same Docker host.

## Adding Services

Now that I have the basic infrastructure set up, I can easily add new services by simply adding the appropriate labels to my Docker containers. For example, to expose a Home Assistant instance:

```yaml
services:
  homeassistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    container_name: homeassistant
    # ... other configuration ...
    networks:
      - tailscale
    labels:
      - traefik.enable=true
      - traefik.http.routers.homeassistant.rule=Host(`home.ts.robert-jensen.dk`)
      - traefik.http.routers.homeassistant.entrypoints=websecure
      - traefik.http.routers.homeassistant.tls.certresolver=letencrypt
      - traefik.http.services.homeassistant.loadbalancer.server.port=8123
```

With this configuration, my Home Assistant instance is accessible at `https://home.ts.robert-jensen.dk` from any device on my Tailscale network.

## Benefits of This Setup

This setup provides several advantages:

1. **Security**: All services are only accessible through Tailscale, which means:
   - They're not exposed to the public internet
   - There's end-to-end encryption
   - Strong authentication via Tailscale

2. **Convenience**: 
   - Clean URLs like `service.ts.robert-jensen.dk`
   - Automatic HTTPS with valid certificates
   - No need to remember ports or IP addresses
   - No need to setup dns records. Just tag new containers with the hostname I want, and point to hostname.ts.robert-jensen.dk

3. **Manageability**:
   - Centralized management through Traefik
   - Easy to add new services

## Troubleshooting

An important thing to this to work, is that my containers need to be on the same docker network, as the Traefik container.
I can attach multiple networks, but then i need to add the label "traefik.docker.network=tailscale" where tailscale is the Docker network, for Traefik to know, which network to point to.

## Conclusion

Combining Traefik and Tailscale has given me a secure, convenient way to access all my self-hosted services. The setup is:

- Secure by default (no direct exposure to the internet)
- Easy to maintain with Docker Compose
- Scalable as I add more services
- Clean and professional with proper domain names and HTTPS

If you're already using Tailscale, adding Traefik to the mix is a natural next step to make your self-hosted services more accessible and manageable.

Thanks for reading this far!

Photo by <a href="https://unsplash.com/@sortino?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Joshua Sortino</a> on <a href="https://unsplash.com/photos/worms-eye-view-photography-of-ceiling-LqKhnDzSF-8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      