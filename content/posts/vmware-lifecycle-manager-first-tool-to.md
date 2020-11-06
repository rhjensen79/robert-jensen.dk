---
title: 'VMware Lifecycle Manager - The first tool to install'
date: 2018-01-02T11:16:00.000+01:00
draft: false
aliases: [ "/2018/01/vmware-lifecycle-manager-first-tool-to.html" ]
tags : [lifecycle manager, installation, VMware, automation]
---

[![](https://4.bp.blogspot.com/-gch9AxQp2Gk/WkINEDqljuI/AAAAAAABQUA/IZjEFdbMJ-E7t1iLN7IRtXnxLER9PAXKQCLcBGAs/s640/vrealizelifecyclemanager.jpg)](https://4.bp.blogspot.com/-gch9AxQp2Gk/WkINEDqljuI/AAAAAAABQUA/IZjEFdbMJ-E7t1iLN7IRtXnxLER9PAXKQCLcBGAs/s1600/vrealizelifecyclemanager.jpg)

VMware has released a new tool, to make it easyer to install and upgrade, some of your VMware products.  
  
The product is called vRealize Suite Lifecycle manger, not to be mistaken for en earlier product VMware had, that was also called Lifecycle Manager.  
  
The tool is fairly easy to install. Just deploy an appliance, and you are good to go.  
After deployment, you configure, a lot of the things you normally do, when you deploy a new VMware product. This time, it's just all done in one place, so it's consistant across your deployments.  
It also follows [VMware validated designs](https://www.vmware.com/solutions/software-defined-datacenter/validated-designs.html), which is always good practice, for any VMware installation.  
  
One nice thing, is that it uses your [My VMware](https://my.vmware.com/) account, for downloading appliances and software (Local NFS locations is also supported). So you don't have to bother with downloading, and maintaining binaries.  

[![](https://2.bp.blogspot.com/-lcbcfWejhUo/Wks0IM1mTII/AAAAAAABQt4/2n6v-uDD9-IdJ7OcBhK9l8OXTr3RiiL_ACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B08.26.00.jpg)](https://2.bp.blogspot.com/-lcbcfWejhUo/Wks0IM1mTII/AAAAAAABQt4/2n6v-uDD9-IdJ7OcBhK9l8OXTr3RiiL_ACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B08.26.00.jpg)

You also add your datacenters (vCentre) on a map, and select their type (Management/Workload or both).

Lifecycle Manager currently supports the following products :  
  

*   Identity manager
*   vRealize Business
*   vRealize Operations
*   vRealize Log Insight
*   vRealize Automation

When you want to install a new a new product you get the option, to follow a wizard, or to use a configuration file. The configuration file, is available, as a export at the end of the wizard, if you want to reuse your configuration.

[![](https://4.bp.blogspot.com/-FqvRacj5x3o/WktBPVIBisI/AAAAAAABQuI/R6x0PhMZzBQe_sTOoD2vypLGiXYJpVe2ACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B08.39.24.jpg)](https://4.bp.blogspot.com/-FqvRacj5x3o/WktBPVIBisI/AAAAAAABQuI/R6x0PhMZzBQe_sTOoD2vypLGiXYJpVe2ACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B08.39.24.jpg)

One of the more interesting things, about the deployment, is that you get to chose, what kind of deployment you are doing. So you can have an automated test setup, as well as a production environment, using the same lifecycle manger. 

[![](https://4.bp.blogspot.com/-imuRRk_cWDA/WktCEJHF14I/AAAAAAABQuQ/xK_mVJV1HiMCqCnHx72dXI2jFvJiRJbiACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B09.23.07.jpg)](https://4.bp.blogspot.com/-imuRRk_cWDA/WktCEJHF14I/AAAAAAABQuQ/xK_mVJV1HiMCqCnHx72dXI2jFvJiRJbiACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B09.23.07.jpg)

  

You can also chose with products you want to install or import (you can always add products later).

[![](https://2.bp.blogspot.com/-LmUm9j6N38U/WktCvcN6AOI/AAAAAAABQuY/zZ9w-Iuchmkic7b21t4s_YTcNrFh5NanwCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B09.26.28.jpg)](https://2.bp.blogspot.com/-LmUm9j6N38U/WktCvcN6AOI/AAAAAAABQuY/zZ9w-Iuchmkic7b21t4s_YTcNrFh5NanwCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B09.26.28.jpg)

  

  
After installation, you can see your installation, and upgrade it, using the tool.  

[![](https://2.bp.blogspot.com/-mAgP6iR3qrw/WktDJNgViAI/AAAAAAABQug/C69LCJl2SXocdcES2XmtE5RwO8c7nfm4wCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B09.29.51.jpg)](https://2.bp.blogspot.com/-mAgP6iR3qrw/WktDJNgViAI/AAAAAAABQug/C69LCJl2SXocdcES2XmtE5RwO8c7nfm4wCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-02%2Bkl.%2B09.29.51.jpg)

  

There is a lot more features to the product. More than i can cover in this blog post. But i highly recommend that you install it, and use it to manage your installations, so you can focus on using the products, instead of installing, maintaining and patching them.

  

If you want to know more, take a look at the video below, or look at this [blog](https://blogs.vmware.com/management/2017/09/vrealize-suite-lifecycle-management.html) post for more information.