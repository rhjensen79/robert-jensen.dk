---
title: 'Data collection Catalog Item in VRA'
date: 2018-01-04T12:49:00.001+01:00
draft: false
aliases: [ "/2018/01/data-collection-catalog-item-in-vra.html" ]
tags : [vRA, XaaS, vSphere, VMware, automation]
---

[![](https://4.bp.blogspot.com/-ZztK3DqfMjg/Wk4PVgdiFGI/AAAAAAABQyw/om4ggpptpgU--7D4tFYrfEdLOoQBzLxAQCLcBGAs/s640/cog-wheels-2125183_1280.jpg)](https://4.bp.blogspot.com/-ZztK3DqfMjg/Wk4PVgdiFGI/AAAAAAABQyw/om4ggpptpgU--7D4tFYrfEdLOoQBzLxAQCLcBGAs/s1600/cog-wheels-2125183_1280.jpg)

  
One of the tasks, i often en up doing, when i work with vRealize Automation (vRA), is doing a catalog scan. The Catalog scan, checks for changes in my endpoints. This could be new templates, snapshots etc. hat i need in my blueprints.  
  
To do this manually, you have to go to Infrastructure -> Compute Ressources -> Your endpoint -> Data collection -> Request now (under inventory).  
  
Since i'm lazy, I wanted to do this more easy.  
Som time ago, my colleague Henrik, made a XAAS service, that did just that, and due to reinstall etc. we lost that option. Today i decided to do this again, and thought i would share how it's done.  
  
It's really easy to do, and might show you some of the value around vRA, and how powerfull it can be.  
  

[![](https://3.bp.blogspot.com/-mhVF1cEGduU/Wk4Q5_Q7kGI/AAAAAAABQy8/qRCxNVdgZ7sY4n2L3Yj9_9Z6N7MiJmYUgCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.32.20.png)](https://3.bp.blogspot.com/-mhVF1cEGduU/Wk4Q5_Q7kGI/AAAAAAABQy8/qRCxNVdgZ7sY4n2L3Yj9_9Z6N7MiJmYUgCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.32.20.png)

Out of the box, the Orchestrator (vRO) instance in the vRA appliance, has a workflow, that does exactly what i need.

  

[![](https://3.bp.blogspot.com/-iO8XOJ-XLF0/Wk4RRrqz-1I/AAAAAAABQzA/Dg93Hy5JdF8XOu3FOytNu0AMZXJRuuE-wCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.34.10.png)](https://3.bp.blogspot.com/-iO8XOJ-XLF0/Wk4RRrqz-1I/AAAAAAABQzA/Dg93Hy5JdF8XOu3FOytNu0AMZXJRuuE-wCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.34.10.png)

The workflow requires a IAAS host to be configured in vRO, so i started by running the workflow "Add an IaaS host"

  

[![](https://4.bp.blogspot.com/-QGXLs7b93tE/Wk4Rw5JISkI/AAAAAAABQzI/rAyAViS3YkAx6zLwQpPCqiuBDuBTVwjsACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.36.06.png)](https://4.bp.blogspot.com/-QGXLs7b93tE/Wk4Rw5JISkI/AAAAAAABQzI/rAyAViS3YkAx6zLwQpPCqiuBDuBTVwjsACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.36.06.png)

I then duplicated the workflow, to my VRA Production folder, so i'm able to edit the workflow, and also so i have the finished workflows, in the same folder, for easier management.

  

[![](https://1.bp.blogspot.com/-oad5P6ulsnw/Wk4SVv9asbI/AAAAAAABQzQ/p5gnIiHzKiMTOK0EPUNjgB21_You4XwQQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.38.48.png)](https://1.bp.blogspot.com/-oad5P6ulsnw/Wk4SVv9asbI/AAAAAAABQzQ/p5gnIiHzKiMTOK0EPUNjgB21_You4XwQQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.38.48.png)

I renamed the workflow to VRA Data Collection, selected edit.

  

[![](https://1.bp.blogspot.com/-jbo8-QcPPAw/Wk4Sx6KXubI/AAAAAAABQzY/qKXDdrqjXMs65zw53SrHnlqmIEA5C9JrACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.40.38.png)](https://1.bp.blogspot.com/-jbo8-QcPPAw/Wk4Sx6KXubI/AAAAAAABQzY/qKXDdrqjXMs65zw53SrHnlqmIEA5C9JrACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.40.38.png)

I then selected the input, and changed it to a attribute, since I want this as a static input, that the user don't have to choose.

  

[![](https://2.bp.blogspot.com/-eaOO9QsVVNo/Wk4TMjjRsyI/AAAAAAABQzg/U1o8i7QaDvEKznOYEim3PjyW845f3gxmQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.42.25.png)](https://2.bp.blogspot.com/-eaOO9QsVVNo/Wk4TMjjRsyI/AAAAAAABQzg/U1o8i7QaDvEKznOYEim3PjyW845f3gxmQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.42.25.png)

I then changed the attribute, to be my Iaas host, and then i closed the workflow.

  

[![](https://4.bp.blogspot.com/-Bm0-IXKUQ08/Wk4TlCWNbEI/AAAAAAABQzk/B2ccaLqzcpIe_HlBiofwDnLFjPmpxXiXQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.43.57.png)](https://4.bp.blogspot.com/-Bm0-IXKUQ08/Wk4TlCWNbEI/AAAAAAABQzk/B2ccaLqzcpIe_HlBiofwDnLFjPmpxXiXQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.43.57.png)

Back to vRA I selected Design -> Xaas Blueprints and created a new blueprint, selecting the workflow, we just edited.

  

I hide the request page, since there is no reason to show that, and then I published the blueprint, in my catalog, just like i would do with any other blueprint.

  

[![](https://1.bp.blogspot.com/-d7e0soR07Fo/Wk4UHnVzDLI/AAAAAAABQzs/36aqAPWXBwoXNsEFdt0tF_HVYzX6k0oegCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.46.23.png)](https://1.bp.blogspot.com/-d7e0soR07Fo/Wk4UHnVzDLI/AAAAAAABQzs/36aqAPWXBwoXNsEFdt0tF_HVYzX6k0oegCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-04%2Bkl.%2B12.46.23.png)

So now i can chose my VRA Data Collection blueprint, every time I want to do a collection, rather than find the option, by clicking thru vRA.