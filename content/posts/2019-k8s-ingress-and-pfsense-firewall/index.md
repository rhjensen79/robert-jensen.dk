---
title: 'K8S Ingress and Pfsense firewall'
date: 2019-07-04T15:04:00.002+02:00
draft: false
aliases: [ "/2019/07/k8s-ingress-and-pfsense-firewall.html" ]
tags : [cna, container, vSphere, kubernetes, pfsense, ingress, k8s]
thumbnail: "images/georg-bommeli-ybtUqjybcjE-unsplash.jpg"
---

[![](https://mapr.com/products/kubernetes/assets/k8s-logo.png)](https://mapr.com/products/kubernetes/assets/k8s-logo.png)

I have been playing a bit with [Kubernettes](https://kubernetes.io/) (K8S) lately.  
Since it's running on my [vSphere](https://www.vmware.com/products/vsphere.html) environment, and not a public cloud, I don't have native access to a load balancer, so I have to use the Ingress Controller instead.  
  
Right now i'm using [Rancher](https://rancher.com/) to deploy the K8S cluster, and due to lack of static ipadresses on my nodes, a LoadBalancer is not an easy thing to get working, it seams.  
  
There is probably a new blog post coming out around that, in the future :-)  
  
I had some problems getting the Ingress Controller to work.  
It seamed, that no matter what kind of application, I was using, it was just not working, with the [Xip.io](http://xip.io/) service.  
  
I ended up finding a really basic [blog](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-ingress-guide-nginx-example.html), where you deploy an apple and a banana workload, to see how the Ingress Controller, can handle both, using different urls. And it was still not working.  
  
And then i found the error. I'm using Pfsense for my home environment. And there i'm using the DNS forwarder service.  
It turns out, that Pfsense is protecting me from DNS rebind, witch is exactly what xip.io is doing.  
Then the solution was easy, and can be found [here](https://docs.netgate.com/pfsense/en/latest/dns/dns-rebinding-protections.html)  
  

[![](https://1.bp.blogspot.com/-Fs7rlyQBC3s/XR32_nRrOjI/AAAAAAAB0eg/9P3AXc9vCVclGgr5EPEh7xGRkrkDsR-1gCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-07-04%2Bkl.%2B14.54.03.png)](https://1.bp.blogspot.com/-Fs7rlyQBC3s/XR32_nRrOjI/AAAAAAAB0eg/9P3AXc9vCVclGgr5EPEh7xGRkrkDsR-1gCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-07-04%2Bkl.%2B14.54.03.png)

  
Simply add "rebind-domain-ok=/xip.io/" to the Custom options in Pfsense -> Services -> DNS Forwarder. And now it's working perfectly.  
  
Hope this helps some of you, that might be in the same situation.  
  
Update : I switched to DNS revolver instead of forwarder today.  
The fix looks a bit different.  
Chose custom options, and add the following text.  

[![](https://1.bp.blogspot.com/-RnWnKPVhFp8/XR-jlWfctHI/AAAAAAAB0j4/Bz0rCzZJK1Qf_EPQHx5dr5soFzsVePG4QCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-07-05%2Bkl.%2B21.21.57.png)](https://1.bp.blogspot.com/-RnWnKPVhFp8/XR-jlWfctHI/AAAAAAAB0j4/Bz0rCzZJK1Qf_EPQHx5dr5soFzsVePG4QCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-07-05%2Bkl.%2B21.21.57.png)

<span>Photo by <a href="https://unsplash.com/@calina?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Georg Bommeli</a> on <a href="https://unsplash.com/s/photos/lock?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>


