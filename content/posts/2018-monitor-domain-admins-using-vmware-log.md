---
title: 'Monitor Domain Admins using VMware Log Insight'
date: 2018-06-27T10:57:00.000+02:00
draft: false
aliases: [ "/2018/06/monitor-domain-admins-using-vmware-log.html" ]
tags : [Active Directory, Compliance, Logging, VMware, Log Insight, automation]
---

I had a customer asking me yesterday, if it was possible to use [Log Insight,](https://www.vmware.com/products/vrealize-log-insight.html) to monitor changes done to the Domain Admins group.  
  
An interesting use case, that i had not thought of before.  
The answer is off course yes, so i thought i would write a small post about it.  
  
The first thing I did, was to create a new user, with an easy search name.  
So i created the user : liuser (as a name - not only logon name).  
  
Then I added the user to the groups Domain Admins, and went to interactive analytics in Log Insight and did a search for liuser.  
  

[![](https://2.bp.blogspot.com/-04Ye_ojnymA/WzNPMCuFddI/AAAAAAABZrw/eriOtfiSx5EzkqobTxMOc5B8lX60NsVhACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-06-27%2Bkl.%2B10.47.25.jpg)](https://2.bp.blogspot.com/-04Ye_ojnymA/WzNPMCuFddI/AAAAAAABZrw/eriOtfiSx5EzkqobTxMOc5B8lX60NsVhACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-06-27%2Bkl.%2B10.47.25.jpg)

  

I then went to events, and clicked on show all lines, on the top event.

  

To make sure i only got the right details, i then marked the lines that i thought would narrow my search, and selected "contains=......" 

  

[![](https://3.bp.blogspot.com/-1yqQKx4CCco/WzNP_5lVn3I/AAAAAAABZr4/sgOHxkSsjmQ0oBeL_44UYL-Uhf0F4O0LwCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-06-27%2Bkl.%2B10.50.44.jpg)](https://3.bp.blogspot.com/-1yqQKx4CCco/WzNP_5lVn3I/AAAAAAABZr4/sgOHxkSsjmQ0oBeL_44UYL-Uhf0F4O0LwCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-06-27%2Bkl.%2B10.50.44.jpg)

  

I ended up with 2 filters in my search.

  

[![](https://2.bp.blogspot.com/-5DJ6VS8iWbc/WzNQkIYouWI/AAAAAAABZsA/vVz1AaUHXU8qQJ0vXfqJqJafL-k22dsOQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-06-27%2Bkl.%2B10.53.04.jpg)](https://2.bp.blogspot.com/-5DJ6VS8iWbc/WzNQkIYouWI/AAAAAAABZsA/vVz1AaUHXU8qQJ0vXfqJqJafL-k22dsOQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-06-27%2Bkl.%2B10.53.04.jpg)

  

If it turns out, that it's not enough, then i can always go back and modify my search.

  

Now all there is left, is to decide, if i want to show this as a widget, or get an alert everything this event happens.

  

Hope this gave some inspiration on what you can use Log Insight for. It suddenly did for me.