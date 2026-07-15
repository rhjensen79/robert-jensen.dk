---
title: "Are you modernizing or just doing lift and shift?"
date: 2025-04-25T12:00:00+01:00
tags: [vmware, kubernetes, cloud]
draft: false
toc: true
thumbnail: "images/hamster.webp"
description: "Moving between hypervisor platforms might save on licensing costs, but are you truly modernizing your applications or just moving in circles?"
---

This blog post is a repost of the following [Linkedin](https://www.linkedin.com/pulse/you-modernizing-just-doing-lift-shift-robert-jensen-7bicf) article.

## Intro

These days, I see a lot of articles about changing one hypervisor platform for another. The reason is that the old platform, is changing the license terms, so you need to buy xx for xx amount (that makes sense, if you are running any serious workload)
Note i'm biased, since I have worked for one of the vendors.

But this is not about vendor A vs vendor B. It's about doing what makes sense for your business, instead of just moving servers around, with little to no value.

I have done my part of migrating servers, in the past, working for an outsourcing company.
It takes

* time
* planning
* downtime.

True It's gotten a lot easier, but since most people run fairly complex datacenter, with interconnected services, the chance of it affecting production, and your users, is high, and the value is nothing else than a bit of (claimed) license savings.

### So what is the alternative ?

The right solution is to modernize the applications. That might not be possible for all workloads, and might cost money, time etc. But looking closely at each application, to see if there is newer alternatives, to the service it's running, makes sense instead of just moving it around.

Also see if your current platform, has the capabilities of supporting different types of workloads. This could be Containers directly, Kubernetes, or maybe Linux machines running containers, to bring more value into your current platform, and utilize it better.
This is also a great stepping stone, to bring your application to a state, that allows you to have the flexibility in the future, to easily migrate to a platform, that allows for greater scaling, locality or availability.

### Conclusion

So the point i'm trying to make here is to see thru the FUD and marketing messages, and make sure you are moving your business forward, and not sideways (like a hamster wheel).