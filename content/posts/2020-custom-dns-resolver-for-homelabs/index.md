---
title: "Custom DNS Resolver for Homelabs"
date: 2020-12-20T09:53:39+01:00
tags : [homelab, dns, custom, server, vpn]
draft: false
thumbnail: "images/andrew-neel-1-29wyvvLJA-unsplash.jpg"
---
Using custom dns servers, depending on enviroment, or resolving multiple internal domains, can be a real pain.

You can setup host files, but it's a pain to manage.
You can also setup your own DNS server, but if you are using company VPN etc, then it's not always the right DNS server, that is being used. 

I struggled a lot too, undtil I found, a easy solution, when you are using Mac or Linux.

The fix is simply to make custom resolver files, depending on which domain you want to resolve (don't confuse this with /etc.resolv.conf)

The fix is simple.
On MAC (it's probably the same on Linux)

Create the resolver directory
```
sudo mkdir /etc/resolver
```

Create a file, for each of the domain names you want to resolve.
In my case, my file is called cmplab.dk
```
sudo touch /etc/resolver/domainname
```

Edit the file, in your favorite editor. Nano is the example I use here.

```
sudo nano /etc/resolver/domainname
```

Add the dns servers you want to use like this (change the ip, to your dns servers. I put mine in for example)
```
nameserver 192.168.100.2
nameserver 192.168.100.3
```

Save and you are done. 
It sometimes take a couple of minutes before it works.
But now, when you use the FQDN of your server, it resolves on the dns servers, specified in the domain specific file. And it takes priority over other configures dns servers, like VPN etc. 

I did find a solution, that works on Windows. 
I will try to update the post, when I get to it, But since i'm never using windows, I have been mainly focused on the Mac and Linux part. 

Thanks for reading.

<span>Photo by <a href="https://unsplash.com/@andrewtneel?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Andrew Neel</a> on <a href="https://unsplash.com/s/photos/find-in-book?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>