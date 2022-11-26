---
title: 'Duplicate ipadress on Packer Ubuntu VM''s'
date: 2019-05-03T20:57:00.002+02:00
draft: false
aliases: [ "/2019/05/duplicate-ipadress-on-packer-ubuntu-vms.html" ]
tags : [Bash, pipeline, VMware CAS, ubuntu, Release Pipeline, Script, CAS, templates, vSphere, Code Stream, code, packer, VMware, shell]
---

[![](https://www.gohacking.com/wp-content/uploads/2009/10/Trace-IP-735x400.jpg)](https://www.gohacking.com/wp-content/uploads/2009/10/Trace-IP-735x400.jpg)

  
After reading a blog [post](https://www.thehumblelab.com/automating-ubuntu-18-packer/), from Cody's blog [thehumblelab.com](http://thehumblelab.com/), about how to create automated vSphere templates, using Packer.  
I have been using it, for most of my vSphere templates in my demo lab at work.  
  
But it has not been without problems. I have been having a problem with my Ubuntu templates.  
After deploying them, they all came up with the same ipadress :-(  
  
A bit strange, and du to other priorities, I have not had a chance, to really look into it, before now.  
  
So today I sad down, and finally found the error.  
  
It's a combination of a Windows DHCP Server, and Ubuntu 18xx and newer.  
It seams that Ubuntu has switched to Netplan, for configuring networks.  
Instead of using the VM's MAC adresse as identifier, it uses something else, that in my case, don't get customized.  
  
It's actually described here in the Netplan documentation, with examples : [https://netplan.io/examples](https://netplan.io/examples) and it's quite easy to fix.  
  
Just find the file  
  

/etc/netplan/01-netcfg.yaml

And add  
  

dhcp-identifier: mac

  
in the end, of the yaml file.  
  
  
If this was a normal template, I would just change the file in my template VM, and it would probably be fine, until I again need a new template, and I had forgot everything about what I did.  
  
That's what I love about the automated way. It might take me a bit longer, to fix. But then it's automated, and fixed in all new deployments that I do. And if I do it properly, it's also documented in the code, why I have done it this way.  
  
The fix for me, required me to change my deployment quite a bit, but I learned something new, while doing it.  
  
I gave up on adding a line to the yaml file, even thou that was probably the easiest way. If anybody have a easy way of doing this, please let me know.  
Note that it's yaml, so there is some requirements to the formating.  
  
I ended up finding a script, that could do the trick.  
  
I places it in /scripts/networking.sh  
  
All it basically does, is move the old file, to a .old and recreate the entire file, with the missing line. Easy fix :-)  
  

mv /etc/netplan/01-netcfg.yaml /etc/netplan/01-netcfg.yaml.old

  

echo "Create netplan config for eth0"

cat <<EOF >> /etc/netplan/01-netcfg.yaml

network:

version: 2

renderer: networkd

ethernets:

ens192:

dhcp4: yes

dhcp-identifier: mac

EOF

  
```
The script is called from the ubuntu-18.json file like this
``````
  

``````


  

  
"provisioners": \[

  

  
    {

  

  
      "type": "shell",

  

  
  "execute\_command": "echo 'mypassword' | {{.Vars}} sudo -S -E bash '{{.Path}}'",

  

  
      "script": "scripts/networking.sh"

  

  
    }

  

  
  \]

  

  

``````
  

```But it tuned out, that that was not enough.  
The default user, that runs the script, did not have sudo rights.  
  
So I ended up adding the following line to the preside.cfg file, where the user get's created.  
  

d-i passwd/user-default-groups vmware sudo

  
After this, it seams to be working.  
I'm still in the progress of updating all my templates, with this new fix, and if I were a developer, or better at Packer, it would probably have been fixed, in a more elegant way, and faster. But I'm still learning, and really soon, I will have som nice templates, that is automatically updated, just by running a VMware Code Stream pipeline, when the git code is changed, or when I need it to :-)  
  
And yes, it's off course all is done thru a Code Stream pipeline :-)  
To finish up, for inspiration, and because I really like VMware Cloud Automation Services, I will just include a picture of the pipeline :-)  
  
I hope this might inspire others, to start looking into pipelines, for automating stuff.  

[![](https://1.bp.blogspot.com/-7-XQnQqYshk/XMyLZHbYUJI/AAAAAAABujs/uirC6yeEklwVSDsICew1nOByqO9Y7664gCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2019-05-03%2Bkl.%2B20.39.43.png)](https://1.bp.blogspot.com/-7-XQnQqYshk/XMyLZHbYUJI/AAAAAAABujs/uirC6yeEklwVSDsICew1nOByqO9Y7664gCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2019-05-03%2Bkl.%2B20.39.43.png)