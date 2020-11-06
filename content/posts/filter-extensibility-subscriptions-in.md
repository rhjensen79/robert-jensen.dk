---
title: 'Filter Extensibility subscriptions in CAS'
date: 2019-01-22T13:28:00.001+01:00
draft: false
aliases: [ "/2019/01/filter-extensibility-subscriptions-in.html" ]
tags : [CMP, CAS, automation, AWS, extensibility]
---

[![](https://upload.wikimedia.org/wikipedia/commons/f/f0/DARPA_Big_Data.jpg)](https://upload.wikimedia.org/wikipedia/commons/f/f0/DARPA_Big_Data.jpg)

  
For the last couple of days, I have been playing quite a lot with Cloud Automation Services.  
That means deploying a lot of VM's, just to destroy them again.  
  
Some time ago, I got help, from some good colleagues, to setup a Python Slack notification, using the extensibility on AWS Faas. The subscription to this, was on a single project, and on all Post Compute Provisions events.  
  
This ment, that I have gotten A LOT of notifications, the last couple of days. And since I like notifications, when I do customer demo's, turning them off, was not an option.  
  
So I wanted to be able to select, when to get the notification, in a more clever way.  
Disclamer : There are probably more than one way to do this, and i'm still learning, but this is how I did it :-)  
One way to also do it, is described in this [blog](https://blogs.vmware.com/management/2019/01/cloud-automation-services-to-dispatch-or-not-to-dispatch.html).  
  
First I created an input parameter on the blueprint, where i ask for Notification.  
  
_notify:_  
_   type: string_  
_   title: Notify_  
_   description: Notify when deployment is finished_  
_   enum:_  
_    - 'yes'_  
_    - 'no'_  
_   default: 'yes'_  
  
Under my VM's properties (still in the blueprint), I then created the following :  
  
_notify: '${input.notify}'_  
  
This means, that I get a property, called notify under customProperties.  
  
If you want to see the full blueprint, use this link to my Github repo : [https://github.com/rhjensen79/cas/blob/master/blueprints/ubuntu\_demo.yaml](https://github.com/rhjensen79/cas/blob/master/blueprints/ubuntu_demo.yaml)  
  

[![](https://3.bp.blogspot.com/-Xy80pSa2TIk/XEcKoPl4HQI/AAAAAAABoCg/O4uRbGcnOpgQDT1as-de7YsdwZHqUUHWACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-22%2Bkl.%2B13.20.09.png)](https://3.bp.blogspot.com/-Xy80pSa2TIk/XEcKoPl4HQI/AAAAAAABoCg/O4uRbGcnOpgQDT1as-de7YsdwZHqUUHWACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-22%2Bkl.%2B13.20.09.png)

Under Extensibility -> Subscriptions, I then edited my subscription, and selected "Filter events in topic"

  

There I could enter 

  

_event.data.customProperties.notify =='yes'_

  

to make sure the subscription only runs, when i select yes during deployment.

  

[![](https://4.bp.blogspot.com/-vLQMUywbetg/XEcLZuX75kI/AAAAAAABoCo/OXlpbZk6MU8IX7ALC8GLbKFwZyegeFAswCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-22%2Bkl.%2B13.23.41.png)](https://4.bp.blogspot.com/-vLQMUywbetg/XEcLZuX75kI/AAAAAAABoCo/OXlpbZk6MU8IX7ALC8GLbKFwZyegeFAswCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-22%2Bkl.%2B13.23.41.png)

  

The deployment now looks like this, and it works perfectly, meaning I select when I get notification :-)