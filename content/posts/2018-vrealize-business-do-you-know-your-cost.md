---
title: 'vRealize Business - Do you know your cost ? '
date: 2018-01-29T09:05:00.000+01:00
draft: false
aliases: [ "/2018/01/vrealize-business-do-you-know-your-cost.html" ]
tags : [SDDC, VMware cloud on AWS, Azure, vSphere, Public, Business, VMware, Reports, AWS, Cost, Private]
---

[![](https://1.bp.blogspot.com/-ioGkc_FI3b0/Wm7ArYuLXsI/AAAAAAABTDg/ymHXOxdaxTgwDQCz-8fkbwnR5NM3sXSwgCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.34.56.jpg)](https://1.bp.blogspot.com/-ioGkc_FI3b0/Wm7ArYuLXsI/AAAAAAABTDg/ymHXOxdaxTgwDQCz-8fkbwnR5NM3sXSwgCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.34.56.jpg)

  

Do you know the cost of your datacenters, and what the cost would be, if you had to move your workloads to the public Cloud ?  
  
One of the products, that can help with that, is VMware vRealize Business.  
It's probably one of the most overlooked products, in VMwares portfolio.  
  
I think that mostly has to do, with the fact that most IT admins, aren't really into cost, and therefore are focusing on the more technical products.  
  
That said, knowing the cost, can really change the discussion, when management decides, that they want to move everything, to the cloud, due of cheaper prices.  
  
I wanted to give a short sneak peak on what the product can do, to get som interest out there.  
  
Installation is really easy. If you read my post about [Lifecycle Manager](https://www.robert-jensen.dk/2018/01/vmware-lifecycle-manager-first-tool-to.html), that can also be used to install vRealise Business (vRB), so I won't go to deep into that.  
  
If you are running vRealise Automation (vRA), vRB integrates, and it's the component that provides cost info, for vRA.  
  
Without vRA, it can be used, and integrated with [vRealise Operations Manager](https://www.vmware.com/products/vrealize-operations.html), and [vRealize Log Insight](https://www.vmware.com/products/vrealize-log-insight.html), with [Identity manager](https://www.vmware.com/products/workspace-one/identity-manager.html), as the identity source. It's all installed by Lifecycle manager, as mentioned before.  
  
Lets get started :-)  
The first thing to do, is to connect it to your endpoints.  
That can be vCenter, VCD (for VMware cloud providers), NSX manager, Public clouds like AWS and Azure, or even your own custom ones.  

[![](https://4.bp.blogspot.com/-4pUIMk-ymCE/Wm7E0vnSqJI/AAAAAAABTD0/duydaM1UNl05bIFfYvT_gb2gKP7MSpi-ACLcBGAs/s400/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.50.55.jpg)](https://4.bp.blogspot.com/-4pUIMk-ymCE/Wm7E0vnSqJI/AAAAAAABTD0/duydaM1UNl05bIFfYvT_gb2gKP7MSpi-ACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.50.55.jpg)

[![](https://2.bp.blogspot.com/-FJH3DiTsVhM/Wm7Ett0n3DI/AAAAAAABTDw/j3Cw31dFJhc80bKwXUdZlI9DZ3y1At92QCLcBGAs/s400/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.51.02.jpg)](https://2.bp.blogspot.com/-FJH3DiTsVhM/Wm7Ett0n3DI/AAAAAAABTDw/j3Cw31dFJhc80bKwXUdZlI9DZ3y1At92QCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.51.02.jpg)

  

 After that, you probably also want to set how your calculations are done. Do you deprecate your hardware after 3 or 5 years.  
That's easy to setup.  

[![](https://1.bp.blogspot.com/-vvv6kBqtUeA/Wm7Etldr0uI/AAAAAAABTD4/oB6kcGMLlz8fTmSNUS8n0tMuei8ixDtPQCEwYBhgL/s400/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.51.23.jpg)](https://1.bp.blogspot.com/-vvv6kBqtUeA/Wm7Etldr0uI/AAAAAAABTD4/oB6kcGMLlz8fTmSNUS8n0tMuei8ixDtPQCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B07.51.23.jpg)

Note that vRB downloads a pricing list, that gives some indications on what the different components  cost in your datacenter. That's a good start, but something you want to change.

  

There is a lot more things you can setup, but to keep this post short, this is all for now.

If everything is ok (check the top right corner) , then you are ready to get some numbers.

  

[![](https://3.bp.blogspot.com/-dr-IwXntdOs/Wm7H0MeguaI/AAAAAAABTEI/fUPex1qKg9YudHjcyKw7grb2cAFczmnsACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.03.13.jpg)](https://3.bp.blogspot.com/-dr-IwXntdOs/Wm7H0MeguaI/AAAAAAABTEI/fUPex1qKg9YudHjcyKw7grb2cAFczmnsACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.03.13.jpg)

  

The first page that meets you, is the Launchpad. From here, you can easily navigate around the vRB.

  

[![](https://2.bp.blogspot.com/-l1BfMGtmqfM/Wm7JPwc7fnI/AAAAAAABTEU/LPdhLcQgHvw3U4CQZylq-tyoPjLvExoPACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.11.42.jpg)](https://2.bp.blogspot.com/-l1BfMGtmqfM/Wm7JPwc7fnI/AAAAAAABTEU/LPdhLcQgHvw3U4CQZylq-tyoPjLvExoPACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.11.42.jpg)

Selecting Expenses, gives a nice overview, of the current cost of the datacenter, divided up into Hardware, Storage, License etc. 

  

In the top left corner, there is a link "Edit cost drivers" Clicking that, directs you to where, you can set your own prices.

I have just attached screenshots of all the options. It should be easy to understand what they do.

  

[![](https://4.bp.blogspot.com/-0hLcXxRWQJ4/Wm7Jxjj2HsI/AAAAAAABTEk/H8ir4JoXvjEY-LrOMMFvZSqiBWcSiNWtwCEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.13.55%2B1.jpg)](https://4.bp.blogspot.com/-0hLcXxRWQJ4/Wm7Jxjj2HsI/AAAAAAABTEk/H8ir4JoXvjEY-LrOMMFvZSqiBWcSiNWtwCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.13.55%2B1.jpg)

  

[![](https://4.bp.blogspot.com/-uScVchkKwmw/Wm7MFhu7LAI/AAAAAAABTEw/1Po4IIzAqkMYZDAgx3EUdv-yenzPsAENQCEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.14.jpg)](https://4.bp.blogspot.com/-uScVchkKwmw/Wm7MFhu7LAI/AAAAAAABTEw/1Po4IIzAqkMYZDAgx3EUdv-yenzPsAENQCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.14.jpg)

  

[![](https://1.bp.blogspot.com/-OdGuSyM-LC0/Wm7MEoGoN9I/AAAAAAABTEo/pAp-df4CgAEbN1hE5_NmSyb6ej5v5gCTQCEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.23.jpg)](https://1.bp.blogspot.com/-OdGuSyM-LC0/Wm7MEoGoN9I/AAAAAAABTEo/pAp-df4CgAEbN1hE5_NmSyb6ej5v5gCTQCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.23.jpg)

  

[![](https://1.bp.blogspot.com/-V-8o6yd4lRQ/Wm7MFsbOPiI/AAAAAAABTEs/Riz6Dx6IoHYUmdWBELMePjTEjCLxoVk-wCEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.31.jpg)](https://1.bp.blogspot.com/-V-8o6yd4lRQ/Wm7MFsbOPiI/AAAAAAABTEs/Riz6Dx6IoHYUmdWBELMePjTEjCLxoVk-wCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.31.jpg)

  

[![](https://3.bp.blogspot.com/-NUQJ_rfc6Is/Wm7MNh5t8lI/AAAAAAABTFA/OROYJFp9fpM1bUkKuTCdzUp7-1HeyZ1fgCEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.42.jpg)](https://3.bp.blogspot.com/-NUQJ_rfc6Is/Wm7MNh5t8lI/AAAAAAABTFA/OROYJFp9fpM1bUkKuTCdzUp7-1HeyZ1fgCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.42.jpg)

  

[![](https://1.bp.blogspot.com/-Ag55H8U8WNE/Wm7MGVYVkJI/AAAAAAABTE4/RW-7SLIRriUUJqFY-7ULG4-ioWAQrPCHwCEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.48.jpg)](https://1.bp.blogspot.com/-Ag55H8U8WNE/Wm7MGVYVkJI/AAAAAAABTE4/RW-7SLIRriUUJqFY-7ULG4-ioWAQrPCHwCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.48.jpg)

  

[![](https://2.bp.blogspot.com/-f5e-pZ6grfc/Wm7MGX5_tHI/AAAAAAABTE0/yEGHsXkoqpww9ku7kdLYQj6EByh8WnjhACEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.58.jpg)](https://2.bp.blogspot.com/-f5e-pZ6grfc/Wm7MGX5_tHI/AAAAAAABTE0/yEGHsXkoqpww9ku7kdLYQj6EByh8WnjhACEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.15.58.jpg)

  

[![](https://3.bp.blogspot.com/-nllAg8qv4PU/Wm7MHKdOl5I/AAAAAAABTE8/EgW9bZ_6DDo2pka8c2fcWQUDNrs1FUp1gCEwYBhgL/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.16.08.jpg)](https://3.bp.blogspot.com/-nllAg8qv4PU/Wm7MHKdOl5I/AAAAAAABTE8/EgW9bZ_6DDo2pka8c2fcWQUDNrs1FUp1gCEwYBhgL/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.16.08.jpg)

  

The better numbers you can provide, the more precise the cost will be (obvious).  
  

[![](https://1.bp.blogspot.com/-OrLTqBb6CK0/Wm7NmHrRW9I/AAAAAAABTFU/1a6wIxLUR_UIbeBUp5Nc1fg_ttkyDS9SQCLcBGAs/s320/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.30.17.jpg)](https://1.bp.blogspot.com/-OrLTqBb6CK0/Wm7NmHrRW9I/AAAAAAABTFU/1a6wIxLUR_UIbeBUp5Nc1fg_ttkyDS9SQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.30.17.jpg)

In my demo environment, I don't have any Azure og AWS accounts, where I can use costing. So I can't show you what that would look. But as soon as you provide credentials, for your Cloud accounts, the numbers start to come in.  
  

[![](https://3.bp.blogspot.com/-hVvGxEGLidI/Wm7Ou0oUDGI/AAAAAAABTFg/0DVOd3dT-UgPPFbed9rZW-9uSjaMXN1LQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.35.05.jpg)](https://3.bp.blogspot.com/-hVvGxEGLidI/Wm7Ou0oUDGI/AAAAAAABTFg/0DVOd3dT-UgPPFbed9rZW-9uSjaMXN1LQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.35.05.jpg)

One of the more interesting features, is the ability to compare public cloud pricing, with your private datacenter. This can be done, on existing VM's but also on a new sample group. So if somebody ask you, where it's cheapest to put VM's with a custom size, it's possible to see here.

[![](https://1.bp.blogspot.com/-KSYmtblnk9I/Wm7UsiUTeeI/AAAAAAABTF4/Ni_7ezc6zIAtutr4S92oyp0f_0e4z5bJACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.59.52.jpg)](https://1.bp.blogspot.com/-KSYmtblnk9I/Wm7UsiUTeeI/AAAAAAABTF4/Ni_7ezc6zIAtutr4S92oyp0f_0e4z5bJACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.59.52.jpg)

  

[![](https://2.bp.blogspot.com/-YoxZN49B6kA/Wm7Uspv00BI/AAAAAAABTF8/cuWVBxSubQkxbX78e3xuEY_zAhzpLRtDgCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B09.00.23.jpg)](https://2.bp.blogspot.com/-YoxZN49B6kA/Wm7Uspv00BI/AAAAAAABTF8/cuWVBxSubQkxbX78e3xuEY_zAhzpLRtDgCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B09.00.23.jpg)

One of the new features in vRB 7.3.1, is the ability to do an assessment, on what it would cost, and what ressources you need, if you want to move all or some of your datacenter, to [VMware cloud on AWS.](https://cloud.vmware.com/vmc-aws)

  

  

[![](https://4.bp.blogspot.com/-QJu_UI-Vn0Y/Wm7PfNNNl0I/AAAAAAABTFo/fm1nu7gtfb0Lsc4L4xuyVMUDQQ_nNxfDQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.38.18.jpg)](https://4.bp.blogspot.com/-QJu_UI-Vn0Y/Wm7PfNNNl0I/AAAAAAABTFo/fm1nu7gtfb0Lsc4L4xuyVMUDQQ_nNxfDQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-29%2Bkl.%2B08.38.18.jpg)

Lastly there is repports. You can give your management access to vRB, but if they rather want a report, you can schedule one of the many predefined reports, or create a custom one, that fits your company. 

  

I hope this has given you some ide on what vRB can do, and spiked your interest enough to get it installed in your own datacenter. 

  

If you want the features, but don't want to run it locally the take a look at [Cost Insight](https://cloud.vmware.com/cost-insight/resources). It's a SAAS solution, that provides some of the same features as a pure Cloud solution.