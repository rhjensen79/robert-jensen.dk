---
title: "Using Multiple Traefik Instances on a Single Docker Host"
date: 2025-03-19T12:00:00+01:00
tags : [Docker, Traefik, Networking, Proxy, Labels, Containers]
draft: false
toc: true
thumbnail: "images/sigmund-EJe6LqEjHpA-unsplash.jpg"
description: "How to run multiple Traefik instances on the same Docker host and selectively route containers to different proxies using labels"
---
## Intro

I've been using [Traefik](https://traefik.io) as my reverse proxy of choice for quite some time. It integrates seamlessly with Docker, automatically discovering containers and creating routes based on labels. This makes it incredibly easy to deploy new services without manual configuration.

However, as my setup grew more complex, I found myself wanting to separate my services into different routing groups:

1. Services that should be exposed to the public internet
2. Services that should only be accessible through my [Tailscale](https://tailscale.com) private network

While I could have used a single Traefik instance with different entrypoints and middlewares to handle both scenarios, I found it cleaner and more secure to run two completely separate Traefik instances.

In this post, I'll show you how I've configured multiple Traefik instances on the same Docker host, and how I use container labels to control which proxy handles each service.

## The Challenge

Running multiple reverse proxies on the same Docker host presents a few challenges:

1. How to configure each Traefik instance to only handle specific containers
2. How to avoid conflicts between the instances
3. How to easily designate which services go to which proxy

The solution I found was to use Docker labels as a filtering mechanism, which turned out to be elegant and simple to maintain.

## Setting Up the Configuration

### Provider Constraints

The key component that makes this setup work is the `constraints` parameter in Traefik's Docker provider configuration. This allows you to filter which containers Traefik will discover and route.

For my Tailscale-only Traefik instance, I use the following configuration:

```yaml
providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    constraints: "Label(`tailscale`,`true`)"
```

And for my public-facing Traefik instance:

```yaml
providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    constraints: "Label(`proxy`,`true`)"
```

These constraints ensure that each Traefik instance only discovers and routes containers with the appropriate label.

### Container Labels

With the constraints in place, I can now selectively route containers to either proxy by adding the appropriate label:

For a container I want to expose through my Tailscale network:

```yaml
labels:
  - tailscale=true
  - traefik.http.routers.myservice.rule=Host(`myservice.ts.mydomain.com`)
  - traefik.http.routers.myservice.entrypoints=websecure
  - traefik.http.services.myservice.loadbalancer.server.port=8080
```

And for a service I want to expose to the public internet:

```yaml
labels:
  - proxy=true
  - traefik.http.routers.myservice.rule=Host(`myservice.mydomain.com`)
  - traefik.http.routers.myservice.entrypoints=websecure
  - traefik.http.services.myservice.loadbalancer.server.port=8080
```

## Full Implementation

Let's look at how I've implemented the complete solution:

### External Traefik Instance

Here's my `docker-compose.yml` for the public-facing Traefik instance:

```yaml
services:
  traefik:
    image: traefik:3
    container_name: traefik-external
    restart: always
    security_opt:
      - no-new-privileges:true
    networks:
      - proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik-external.yml:/etc/traefik/traefik.yml:ro
      - ./dynamic:/etc/traefik/dynamic
      - traefik-certs:/certs
    labels:
      - com.centurylinklabs.watchtower.enable=true

volumes:
  traefik-certs: {}

networks:
  proxy:
    name: proxy
    external: true
```

With the corresponding `traefik-external.yml` configuration:

```yaml
api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    constraints: "Label(`proxy`,`true`)"
  file:
    directory: "/etc/traefik/dynamic"
    watch: true

certificatesResolvers:
  letsencrypt:
    acme:
      email: myemail@example.com
      storage: /certs/acme.json
      httpChallenge:
        entryPoint: web
```

### Tailscale Traefik Instance

And here's my `docker-compose.yml` for the Tailscale-only Traefik instance:

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
    depends_on:
      - tailscale-traefik
    network_mode: service:tailscale-traefik
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik-tailscale.yml:/etc/traefik/traefik.yml:ro
      - ./dynamic-ts:/etc/traefik/dynamic
      - traefik-ts-certs:/certs
    labels:
      - com.centurylinklabs.watchtower.enable=true
      - tailscale=true
      - traefik.enable=true
      - traefik.http.routers.traefik.rule=Host(`traefik.ts.mydomain.com`)
      - traefik.http.routers.traefik.entrypoints=websecure
      - traefik.http.routers.traefik.tls.certresolver=letsencrypt
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.services.traefik.loadbalancer.server.port=8080

volumes:
  tailscale: {}
  traefik-ts-certs: {}

networks:
  tailscale:
    name: tailscale
    external: true
```

With the corresponding `traefik-tailscale.yml` configuration:

```yaml
api:
  dashboard: true
  insecure: false

entryPoints:
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    constraints: "Label(`tailscale`,`true`)"
  file:
    directory: "/etc/traefik/dynamic"
    watch: true

certificatesResolvers:
  letsencrypt:
    acme:
      email: myemail@example.com
      storage: /certs/acme.json
      dnsChallenge:
        provider: cloudflare
        delayBeforeCheck: 10
        resolvers:
          - "1.1.1.1:53"
          - "8.8.8.8:53"
```

## Example Service Configuration

Here's an example of how I configure a service that I want to expose through my Tailscale network:

```yaml
services:
  homeassistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    container_name: homeassistant
    networks:
      - tailscale
    volumes:
      - ./config:/config
    restart: always
    labels:
      - tailscale=true
      - traefik.enable=true
      - traefik.http.routers.homeassistant.rule=Host(`home.ts.mydomain.com`)
      - traefik.http.routers.homeassistant.entrypoints=websecure
      - traefik.http.routers.homeassistant.tls.certresolver=letsencrypt
      - traefik.http.services.homeassistant.loadbalancer.server.port=8123
```

And here's an example of a service I want to expose to the public internet:

```yaml
services:
  website:
    image: nginx:alpine
    container_name: my-website
    networks:
      - proxy
    volumes:
      - ./html:/usr/share/nginx/html
    restart: always
    labels:
      - proxy=true
      - traefik.enable=true
      - traefik.http.routers.website.rule=Host(`www.mydomain.com`)
      - traefik.http.routers.website.entrypoints=websecure
      - traefik.http.routers.website.tls.certresolver=letsencrypt
      - traefik.http.services.website.loadbalancer.server.port=80
```

## Benefits of This Approach

Using two separate Traefik instances with label-based routing provides several advantages:

1. **Security Separation**: Services intended for private access are completely isolated from the public internet and handled by a separate proxy.

2. **Configuration Clarity**: Looking at a container's labels, I can immediately tell whether it's meant for public or private access.

3. **Independent SSL/TLS**: Each Traefik instance can use different certificate resolvers - HTTP challenge for the public instance and DNS challenge for the Tailscale instance.

4. **Simplified Maintenance**: When updating or restarting one proxy, the other continues to function without interruption.

## Possible Enhancements

This setup could be further enhanced in several ways:

1. **Third Proxy for Development**: Add a third Traefik instance specifically for development/testing services.

2. **Automated Label Enforcement**: Use CI/CD pipelines to ensure that containers have the appropriate labels for their intended access patterns.

3. **Monitoring Integration**: Add metrics collection to track which proxy handles more traffic and optimize accordingly.

## Troubleshooting

If you implement this approach, here are a few common issues you might encounter:

1. **Container Not Being Routed**: Check if the container has the correct label (`proxy=true` or `tailscale=true`) and that the Traefik configuration has the matching constraint.

2. **Network Connectivity Issues**: Ensure that the container is on the same Docker network as its intended Traefik instance.

3. **Label Conflicts**: If a container accidentally has both labels, it will be routed by both proxies, which might not be what you want.

## Conclusion

Running multiple Traefik instances on the same Docker host might seem like overkill at first, but it provides a clean separation of concerns and improves the security posture of my self-hosted services.

By using simple labels to direct containers to the appropriate proxy, I've created a system that's both flexible and easy to maintain. I can quickly deploy new services and know exactly how they'll be exposed without complex configuration.

If you're running multiple services with different access requirements, I highly recommend giving this approach a try.

Thanks for reading this far!

Photo by <a href="https://unsplash.com/@sigmund?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sigmund</a> on <a href="https://unsplash.com/photos/black-and-silver-computer-ram-stick-EJe6LqEjHpA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      