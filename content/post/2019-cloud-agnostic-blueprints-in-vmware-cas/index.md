---
title: 'Cloud Agnostic Blueprints in VMware CAS'
date: 2019-01-18T07:51:00.001+01:00
draft: false
aliases: [ "/2019/01/cloud-agnostic-blueprints-in-vmware-cas.html" ]
tags : [yaml, Azure, CAS, multi cloud, vSphere, gcp, VMware, automation, AWS, Cloud]
---

[![](https://i.pinimg.com/originals/48/d3/26/48d326ab0636b4902d16f0a216385380.jpg)](https://i.pinimg.com/originals/48/d3/26/48d326ab0636b4902d16f0a216385380.jpg)

VMware Cloud Automation Services went GA 2 days ago, on the 15/1/2019.  
There is already a ton of blogs, describing the solution.  
  
I thought that I would give my view on one of the things, that i find most cool about the solution.  
Note that i'm no expert, but I already love the solution, and i'm looking forward to learning more  about what I, and the customers I talk to, can do with it.  
  
Having spend the last 3-4 years talking about vRealize Automation, I like a lot of the features available today, but i'm also missing some (when i compare the 2). But that's the beauty of a SAAS product. Just from the time i have spend on it, it has constantly been evolving, and adding new features. All without me having to do anything. You kinda get used to that :-)  
  
So the feature I want to talk about today, is the Cloud Agnostic blueprints.  
  
The idea is that a blueprint, can be used on multiple clouds, just by selecting different tags/constraints. And it actually works really well.  
  
I will spend my time in Cloud Assembly today. So all you see, is taken from there.  
  
Cloud Assembly support the following Clouds today.  

[![](https://2.bp.blogspot.com/-NIPov-0VhiA/XEDbF-D36AI/AAAAAAABnuY/pub5k8aKoKggHl-C4oLYmWgeu62c-KrFwCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.43.11.jpg)](https://2.bp.blogspot.com/-NIPov-0VhiA/XEDbF-D36AI/AAAAAAABnuY/pub5k8aKoKggHl-C4oLYmWgeu62c-KrFwCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.43.11.jpg)

  
I have connected to AWS, Azure, GCP and vSphere, along with NSX-v  
  
For each account, I have created one or more Cloud Zones, containing the different zones, in a region.  

[![](https://3.bp.blogspot.com/-SAGsSgPW51A/XEDbyBkcStI/AAAAAAABnug/RthqJ6UY9JksYANYyI5HIFeEl9Q_yv4NwCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.45.25.jpg)](https://3.bp.blogspot.com/-SAGsSgPW51A/XEDbyBkcStI/AAAAAAABnug/RthqJ6UY9JksYANYyI5HIFeEl9Q_yv4NwCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.45.25.jpg)

  
The way I have tagged all my locations, is in the compute zones, that is available in each zone.  
All my tags are in the form "region:city"  
  
So my tags are :  
\- region:copenhagen - For local vSphere environment in Copenhagen  
\- region:frankfurt - For AWS in Frankfurt  
\- region:stockholm - For the new AWS in Stockholm  
\- region:ireland - For Azure in Ireland  
\- region:netherlands - for GCP in Nederlands  

[![](https://3.bp.blogspot.com/-_ibxkbQm00o/XEDcZLUgSNI/AAAAAAABnuw/w5a_Gb0cPYUEZuQJ3EQjmI01hf6hcdkqQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.47.55.jpg)](https://3.bp.blogspot.com/-_ibxkbQm00o/XEDcZLUgSNI/AAAAAAABnuw/w5a_Gb0cPYUEZuQJ3EQjmI01hf6hcdkqQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.47.55.jpg)

  

The image I use in this post, is Ubuntu, and I have also mapped this, to an image in each zone.

[![](https://1.bp.blogspot.com/-ZhieVcg8O38/XEDc3oFEE3I/AAAAAAABnu4/qsuRgNF9AzM1AoSrYrfK6dYVk3046C52QCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.51.46.jpg)](https://1.bp.blogspot.com/-ZhieVcg8O38/XEDc3oFEE3I/AAAAAAABnu4/qsuRgNF9AzM1AoSrYrfK6dYVk3046C52QCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.51.46.jpg)

  
The same is done with the size. Here it's small  

[![](https://2.bp.blogspot.com/-oI_Nd36grjU/XEDdTbXXfMI/AAAAAAABnvA/sw06pEx82uUnib0cBpahuLJsb1djd--UACLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.53.08.jpg)](https://2.bp.blogspot.com/-oI_Nd36grjU/XEDdTbXXfMI/AAAAAAABnvA/sw06pEx82uUnib0cBpahuLJsb1djd--UACLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B20.53.08.jpg)

  

After this, we are ready to build our blueprint.

  

The blueprint I will use, consists of the following YAML code.

You can copy/paste it, and reuse it in your own environment, with your own tags, and mappings. 

  

_inputs: _

_  region:_

_    type: string_

_    description: Region_

_    title: Region Tag Name_

_    enum:_

_      - 'region:copenhagen'_

_      - 'region:frankfurt'_

_      - 'region:stockholm'_

_      - 'region:ireland'_

_      - 'region:netherlands'_

_    default: 'region:copenhagen'_

_resources:_

_  Cloud\_Machine\_1:_

_    type: Cloud.Machine_

_    properties:_

_      image: 'ubuntu'_

_      flavor: 'small'_

_      constraints:_

_        - tag: '${input.region}'_

I have created the regions as dropdown menu's, with a default to region:copenhagen and hardcoded the image and the size, just for this post.

[![](https://3.bp.blogspot.com/-qYTypMN9YwE/XEDs_iGPSXI/AAAAAAABnvQ/7fIcTEqjfLEJg1_EYyJSteIdEWU1Ts1wgCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B22.00.29.jpg)](https://3.bp.blogspot.com/-qYTypMN9YwE/XEDs_iGPSXI/AAAAAAABnvQ/7fIcTEqjfLEJg1_EYyJSteIdEWU1Ts1wgCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-17%2Bkl.%2B22.00.29.jpg)

  

The deploy dialog now looks like this

[![](https://1.bp.blogspot.com/-ns010OzALlI/XEF0xe4h_oI/AAAAAAABnwI/JpKftI8vO6YW4IbGEbJRKzl1I_tVLwIAQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-18%2Bkl.%2B07.39.48.jpg)](https://1.bp.blogspot.com/-ns010OzALlI/XEF0xe4h_oI/AAAAAAABnwI/JpKftI8vO6YW4IbGEbJRKzl1I_tVLwIAQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-18%2Bkl.%2B07.39.48.jpg)

[![](https://2.bp.blogspot.com/-qfOMLioI2Ns/XEF06JtOp5I/AAAAAAABnwM/cewVNRSR5fAbgobL51uetkCChk5SgfQAwCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-01-18%2Bkl.%2B07.40.28.jpg)](https://2.bp.blogspot.com/-qfOMLioI2Ns/XEF06JtOp5I/AAAAAAABnwM/cewVNRSR5fAbgobL51uetkCChk5SgfQAwCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-01-18%2Bkl.%2B07.40.28.jpg)

  

Now to test it, all there is left, is to deploy one in each location.

[![](https://3.bp.blogspot.com/-Om0WHShZDpU/XEDtp0RcY0I/AAAAAAABnvc/W1yB2fBvFd4EYSeV85S1hUchGIYBzeNcQCLcBGAs/s640/Billede1.png)](https://3.bp.blogspot.com/-Om0WHShZDpU/XEDtp0RcY0I/AAAAAAABnvc/W1yB2fBvFd4EYSeV85S1hUchGIYBzeNcQCLcBGAs/s1600/Billede1.png)

  

And there you have it. The same blueprint, deployed in 2 x AWS, 1 x Azure, 1 x GCP and 1 x vSphere, just by selecting different tags/constraints.

  

Hope you enjoyed this little demonstration, on how easy we can consume so many different cloud providers, in a single blueprint.