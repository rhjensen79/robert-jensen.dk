---
title: 'Getting started with Cloud Automation Services - Almost'
date: 2018-12-12T21:11:00.000+01:00
draft: false
aliases: [ "/2018/12/getting-started-with-cloud-automation.html" ]
tags : [Azure, CAS, vSphere, VMware, automation, AWS, Cloud]
---

[![](https://zdnet1.cbsistatic.com/hub/i/r/2018/08/27/35e3272b-8068-4a7a-9857-788bf474f542/resize/770xauto/944f241b4c67da109c6d4d1b760d9def/vmwarecloudservices.png)](https://zdnet1.cbsistatic.com/hub/i/r/2018/08/27/35e3272b-8068-4a7a-9857-788bf474f542/resize/770xauto/944f241b4c67da109c6d4d1b760d9def/vmwarecloudservices.png)

I finally got started on [Cloud Automation Services](https://cloud.vmware.com/cloud-assembly) (CAS), or at least Cloud Assembly.  
Living in Denmark, where many customers are talking Azure all the time, and the local vSphere environments, are smaller, the SAAS offering makes a lot of sense IMHO.  
  
I must admit I already love the product, even thou it requires some learning, to get the hang of it. But hey, that the fun stuff, and it did not take long, until I got something useful up and running :-)  
  
But it has also required me to think different. The whole YAML approach to all the blueprints, allows me to keep versions of my blueprint, in different ways than i use to.  
And after reading this [blog](https://blogs.vmware.com/management/2018/11/customizing-cloud-assembly-deployments-with-cloud-init.html) (thanks [@Codydearkland](https://twitter.com/Codydearkland)), I could see the benefit in having a git repository, where I can save everything i work on.  
  
So if you are interested in seeing my blueprint so far, take a look at my [Github repository](https://github.com/rhjensen79/cas).  
  
So far it's only copy/paste of the blueprints in the marketplace, that i have reused for my own blueprints. But i'm hoping that will change, and i'm able to share something, that is actually usable :-)  
  
If you haven't tried CAS yet, then i highly recommend you to try the [trial](https://cloud.vmware.com/cloud-assembly) or the [Hands on lab](https://labs.hol.vmware.com/HOL/catalogs/lab/4699).  
  
If you know any good blogs or ressources regarding CAS, YMAL etc, then please let me know in the comments.