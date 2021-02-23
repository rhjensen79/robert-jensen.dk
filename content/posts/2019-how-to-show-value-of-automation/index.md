---
title: 'How to show the value of Automation'
date: 2019-12-16T11:27:00.001+01:00
draft: false
aliases: [ "/2019/12/how-to-show-value-of-automation.html" ]
tags : [vRA, code, VMware, automation, AWS, value]
thumbnail: "images/riccardo-annandale-7e2pe9wjL9M-unsplash.jpg"
---

[![](https://1.bp.blogspot.com/-Qi3SFyH2sZo/Xek2RdwBaPI/AAAAAAACBzQ/X0dwvH7N0KI0LTHJ_kqmNCb8ofc86_lrQCLcBGAsYHQ/s640/value-proposition.jpg)](https://1.bp.blogspot.com/-Qi3SFyH2sZo/Xek2RdwBaPI/AAAAAAACBzQ/X0dwvH7N0KI0LTHJ_kqmNCb8ofc86_lrQCLcBGAsYHQ/s1600/value-proposition.jpg)

  
Being able to show the value, of automation is essential, to be able to keep getting support, for the time you spend on it.  
  
One of my coworkers (Tore Brynaa) , gave me an idea, on how we could show that value back to the business, for the customers that have begun using vRealize Automation.  
  
The idea was quite simple. Count the number of VM's you deploy, estimate time saved per deployment, and calculate how much time you have saved.  
  
So I started thinking on how to build this.  
The challenges I had was :  
\- How to run the code (ABX or VRO or other) ?  
\- Where to store the data ?  
\- How to present the data ?  
  
After asking on [twitter](https://twitter.com/), I got at lot of help, on the first and second part from @roberthayden. He build an api and a DB, that I could call, from a post deployment rest call.  
We got it working, and it was a great help, to get the project running.  
  
But I ended up finding another solution, since I did not have full controll on the solution, and I had some problems figuring out, how to get the data back.  
  
So the solution I ended up building, was the following.  

#### How to run the code

I wanted to have something, that was independent of my local environment. Also i have been trying to learn Python for quite some time. So ABX or Lambda on AWS, ended up being my choice.  

#### Where to store the data

The DB was a nice solution, but I tried to find a free alternative, that I could use. But in the end, I ended up saving a JSON file in a S3 bucket.  
It's an easy solution, that is really close to being free, and it can scale, as much as I need it to.  

#### How to present the data

I had a lot of ideas, like using VROPS, Log Insight or Grafana to present the data. But I ended up, getting a solution, that is free, and it not dependent on my local environment again.  
So a [thingspeak.com](http://thingspeak.com/) dashboard, presentet on a [Github](https://github.com/rhjensen79/cmpvalue) page, with a custom url : [cmpvalue.robert-jensen.dk](http://cmpvalue.robert-jensen.dk/)  
  
  

[![](https://1.bp.blogspot.com/-Qa9vo_--rMs/XfdXXoJGAvI/AAAAAAACCR0/p-hUkdodhywbCCZ-TE6k5yrEI0F3rgbTwCLcBGAsYHQ/s640/Sk%25C3%25A6rmbillede%2B2019-12-16%2Bkl.%2B11.07.02.png)](https://1.bp.blogspot.com/-Qa9vo_--rMs/XfdXXoJGAvI/AAAAAAACCR0/p-hUkdodhywbCCZ-TE6k5yrEI0F3rgbTwCLcBGAsYHQ/s1600/Sk%25C3%25A6rmbillede%2B2019-12-16%2Bkl.%2B11.07.02.png)

#### The code

All the code to get this working, is on my Github Repository under [Scripts](https://github.com/rhjensen79/cmpvalue/tree/master/Scripts)  
  
I have 2 ABX functions running.  
1\. after every VM deployment.  
It opens the JSON file on S3, and adds +1 to the counter, and saves it again.  

[![](https://1.bp.blogspot.com/-m2UIqYLkoYY/XfdZczy_H3I/AAAAAAACCSA/BRVrYO0depQ7zE285IKSBB54lFhPGpXoQCLcBGAsYHQ/s640/Sk%25C3%25A6rmbillede%2B2019-12-16%2Bkl.%2B11.16.04.png)](https://1.bp.blogspot.com/-m2UIqYLkoYY/XfdZczy_H3I/AAAAAAACCSA/BRVrYO0depQ7zE285IKSBB54lFhPGpXoQCLcBGAsYHQ/s1600/Sk%25C3%25A6rmbillede%2B2019-12-16%2Bkl.%2B11.16.04.png)

  
2\. After the deployment is finished, it opens the file, reads the data, and updates the values on Thingspeak.com  

[![](https://1.bp.blogspot.com/-Bd70xjBiYkY/XfdZl7V5oSI/AAAAAAACCSE/sDArboleSkQmipzlKWr_l12hgtJ-NjmagCLcBGAsYHQ/s640/Sk%25C3%25A6rmbillede%2B2019-12-16%2Bkl.%2B11.16.45.png)](https://1.bp.blogspot.com/-Bd70xjBiYkY/XfdZl7V5oSI/AAAAAAACCSE/sDArboleSkQmipzlKWr_l12hgtJ-NjmagCLcBGAsYHQ/s1600/Sk%25C3%25A6rmbillede%2B2019-12-16%2Bkl.%2B11.16.45.png)

  

#### Future features

This was really great to get something working. But in the future, i'm planning on enhancing it a bit, with the following feature.  
  
\- Get time saved value from blueprint, to be able to have different values on each blueprint.  
\- Be able to use it on other than just VM deployments, like XaaS etc.  
\- Present different pages, that shows time saved on VM deployments. XaaS and an overview page.  
  
For any other ideas, leave them in the comments, and let me know what you think.

<span>Photo by <a href="https://unsplash.com/@pavement_special?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Riccardo Annandale</a> on <a href="https://unsplash.com/s/photos/value?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>