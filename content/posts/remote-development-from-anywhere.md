---
title: 'Remote development from anywhere'
date: 2019-10-09T09:05:00.000+02:00
draft: false
aliases: [ "/2019/10/remote-development-from-anywhere.html" ]
tags : [Network, Overlay, VPN, SDWAN, SD-WAN, Development, VSCode, VMware, Ansible, Zerotier]
---

[![](https://www.noknok.com/wp-content/uploads/2018/07/big-data-abstract-digital-concept-picture-id870658190-1-1-600x300.jpg)](https://www.noknok.com/wp-content/uploads/2018/07/big-data-abstract-digital-concept-picture-id870658190-1-1-600x300.jpg)

  
[VScode](https://code.visualstudio.com/) is that type of software, that I hated in the beginning, and now love (for the most part).  
I have never been any good at coding, scripting etc. but the more my day job, exposes me to automation, the more I want to learn. And along with that, I found out, that [VScode](https://code.visualstudio.com/), was one of the thing, I better learn to love (or live with).  
  
The main thing, that makes [VScode](https://code.visualstudio.com/) so powerfull (imho), is all the extensions you can get.  
When I started learning [Ansible](https://www.ansible.com/), I downloaded the [Ansible](https://www.ansible.com/) extension, and suddenly I got code completion, and a lot more things, that I don't use or understand at this part om my learning :-)  
  
One thing, that stod out, pretty soon, was the [remote extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack). It enables me to log into a remote machine, container etc. and develop and run my code from there.  
It's so powerfull, and I'm still finding new use cases for it.  
  
One use case I have found, is using a local Linux VM, in my environment, to run my code from.  
It's easier when I transfer a lot of data, from the linux vm, to my endpoint.  
  
My problem, is that I'm working from so many places, and there is not always an easy way, to get SSH access into my linux VM.  
I can use VPN, but I'm also on corporate VPN, and there is a lot of things, with DNS lookup, that makes it, so it's not a usable way to work, all the time.  
  
But the great thing, about working in IT, is that there is always a new cool solution, just around the corner. Meet [Zerotier](https://www.zerotier.com/).  
  
[Zerotier](https://www.zerotier.com/) is an Overlay, SD-Wan network solution (there might be other buzz words, that I'm missing here). but the reason it's a solution for me, is that it enables me, to connect to all my VM's, from my Mac, without having to open a VPN. It's just seamless.  
  
So let's look into it.  
  
[Zerotier](https://www.zerotier.com/) is free for up to 100 clients, and the have a hosted management solution. So al I need to do, is to create a network, and install my clients, and I'm ready to work.  
  
Let me show you.  
  

[![](https://1.bp.blogspot.com/--kSGBZXT79I/XZ1_YipYLSI/AAAAAAAB9jw/8GHKJnsGCV8tnECtAV9OX9xbqWYo-o3NwCLcBGAsYHQ/s640/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.33.53.png)](https://1.bp.blogspot.com/--kSGBZXT79I/XZ1_YipYLSI/AAAAAAAB9jw/8GHKJnsGCV8tnECtAV9OX9xbqWYo-o3NwCLcBGAsYHQ/s1600/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.33.53.png)

I start by creating a network.  
2 important things.  
  
1\. The number 83048a0632d428fb is my network id. I need this, every time I want to join a new client.  
  
2\. The network is set to private. This means, that I have to approve all that joins my network. Set this to public, and everyone, that has my is, can join (you probably don't want that).  
  

[![](https://1.bp.blogspot.com/-2w-KtBWpV8M/XZ1_-H7I9DI/AAAAAAAB9j4/4dEceNlwK7Ygf4a1QiFh9FYUETDyrAAcACLcBGAsYHQ/s640/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.36.29.png)](https://1.bp.blogspot.com/-2w-KtBWpV8M/XZ1_-H7I9DI/AAAAAAAB9j4/4dEceNlwK7Ygf4a1QiFh9FYUETDyrAAcACLcBGAsYHQ/s1600/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.36.29.png)

  
I can also set static routes. But that's for another blog post.  
But I can also chose my network range. Select something you like, and leve it. Zerotier automatically assigns ip adresses from that range.  
  

[![](https://1.bp.blogspot.com/-Obe9h8S6_EM/XZ2CDe3lneI/AAAAAAAB9kE/mvzgr8uyXc8AABZwuMSEHrX9jCJ6acBygCLcBGAsYHQ/s640/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.45.21.png)](https://1.bp.blogspot.com/-Obe9h8S6_EM/XZ2CDe3lneI/AAAAAAAB9kE/mvzgr8uyXc8AABZwuMSEHrX9jCJ6acBygCLcBGAsYHQ/s1600/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.45.21.png)

  
Go to the [download](https://www.zerotier.com/download/) page, and find the package for your os.  
  
For linux I use the GPG option, so I can easily update it later.  
After it's install simply type  
  
_zerotier-cli join NetworkID_  
  
And then approve it on the Zerotier network page.  
A good advice, is to give your clients a saying name. It makes it easier to identify them later.  
  
For OSX, there is a client you install, and join the networks.  
No reason to show that here, it's just as easy, as the cli version.  
  
There are also packages for Windows, containers, NAS etc.  
  
When you have approved both clients, all there is left, is to connect to you VM, any way you want, using their new ip. They are now on the same network :-)  
  
It's so easy, and pretty scary at the same time :-)  
  
My [VScode](https://code.visualstudio.com/) auto reconnects, everytime I open it, as long as there is internet.  
So now I don't have to think about VPN anymore. I'm always on the same network, as my VM.  

[![](https://1.bp.blogspot.com/-2VrcgfVvRdc/XZ2Eb5oXi4I/AAAAAAAB9kQ/YoJXlCGyaFAOWi7GmOVrPGuz0XrLT8WvgCLcBGAsYHQ/s640/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.53.44.png)](https://1.bp.blogspot.com/-2VrcgfVvRdc/XZ2Eb5oXi4I/AAAAAAAB9kQ/YoJXlCGyaFAOWi7GmOVrPGuz0XrLT8WvgCLcBGAsYHQ/s1600/Sk%25C3%25A6rmbillede%2B2019-10-09%2Bkl.%2B08.53.44.png)

  
Note there is a lot more usecases, and probably just as many security concerns. But the solution is imho really cool, and useful, if used in the correct way.  
  
thanks for reading, and hope you found this usefull.