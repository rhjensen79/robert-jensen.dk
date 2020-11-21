---
title: "2020 Learning SaltStack"
date: 2020-11-21T13:25:45+01:00
tags : [SaltStack, VMware]
draft: true
---

So VMware (The company i work for) bought SaltStack, if you missed the [news](https://blogs.vmware.com/management/2020/10/vmware-completes-saltstack-acquisition-to-bolster-software-configuration-management-and-infrastructure-automation.html).

That means that SaltStack, is now part of the tools i should know. Well challenge accepted. 
This week I had my first real look at SaltStack, when I attended a 4 day course in SaltStack Enterprice. 

Having attended the course, just made me aware, that I have only scratched the surface of the product, and what it can do. 

This blog is therefore not a "this is how you do a and b, using SaltStack", but more a "this is my findings so far", in my quest to integrate this, with both the products I talk about every day (vRealize Automation), but also using the Open Source version, in my homelab.

This is also not ment to be a reference, of what VMware is doing with the product. I know nothing about this, so whatever i find out, may or may not, be usefull in the future. 

### Initial idea

The plan for me, in using SaltStack (Salt from now on), is to deploy resources with vRealize Automation (VRA from now on), and let Salt take over, and do the customization, and app deployment.

I use cloud-init today, and while I really like cloud-init (most of the time), I want to explore the posibilities, of only using it to install Salt, and let Salt take over from there.

Let's see if that ends up being such a great idea. I seldom think one tool to rule them all, is a good idea, but I don't belive in using too many tools either, since it ends up being a mess as well. 

### Reactors

So the way i'm thinking of handing over to Salt, is by using reactors.

The reactor will listen for the Minion, and approve the key, and then deploy the jobs, based on the profile of the VM. This will probably be based on Grains.

### Top.sls

I will also run a top.sls, at some scheldule, to make sure, that everything stays compliant, in case of modifications etc. happens on the Minions. An example im thinking of here, is as simple as keeping my ssh keys up to date, on all Minions. But here might be a lot more comming here :-) 

### Beacons

For specific


