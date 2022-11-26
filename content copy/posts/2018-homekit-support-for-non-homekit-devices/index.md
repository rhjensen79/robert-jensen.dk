---
title: 'Homekit support for non homekit devices'
date: 2018-11-12T08:58:00.001+01:00
draft: false
aliases: [ "/2018/11/homekit-support-for-non-homekit-devices.html" ]
tags : [ITEAD, MQTT, Openhab, Home Automation, Sonoff, Apple, automation, Homekit]
---

[![](https://images.techhive.com/images/article/2017/02/homekit-logo-100707188-large.jpg)](https://images.techhive.com/images/article/2017/02/homekit-logo-100707188-large.jpg)

For that last 2 years, I have been playing around with Home Automation.  
So far i'm running a mix of both an [Openhab](https://www.openhab.org/) installation, based on [MQTT](http://mqtt.org/), and some H[omekit](https://www.apple.com/dk/shop/accessories/all-accessories/homekit) devices ([Philips hue](https://www2.meethue.com/da-dk) etc).  
Openhab is a great product, but I was finding myself, more and more, using Homekit, controlled from my ATV4, to be the way i do home automation.  
Most of the reason being, that I get locality, out of the box, and since all in my household (that matters for home automation) is using IOS devices, i can easily create rules, based on if people are home or not.  
Also it's easy to edit rules etc. when i'm not home.  
  
Openhab has one great feature, that was the primary reason for me to test it in the first place. It can make non Homekit devices, appear as a Homekit device. The downside, is that in my case, it requires that both Openhab, and MQTT is running properly, for it to function. It has done so until now, but it's just another thing that can go wrong, and since there is no room for failure, when your biggest customer, is your girlfriend, I have been looking for a way, to may the installation less complex.  
And now I have found it :-)  
  
The solution involves using [itead Sonoff](https://www.itead.cc/sonoff-wifi-wireless-switch.html) devices. These are cheap devices, that is basically a relay with a wifi chip on board. So you can control them remotely.  
All you have to do, is connect them to a 220v wire, and provide them with some software (if you don't want to use the software they are shipped with), and then you can control your device remotely.  
  
I have 4-5 already, but they where using custom firmware, that hooked up to my MQTT, and presented using Openhab as Homekit devices.  
  
But then i stumbled upon [Ravencore](https://github.com/RavenSystem/esp-homekit-devices).  
  
Ravencore is a piece of code, that you upload to your Sonoff, and then it acts as a Homekit device, without any bridges like Openhab etc.  
It's also includes a "over the air" (OTA) update function, so you can easily update your devices, after they are deployed. A good thing, if you are hiding your Sonoff devices, in places that are hard to access.  
  
Updating the code, is as easy as connecting my computer to the Sonoff, and then running a simple command. After that, I have to connect to the device, and set my wifi, and where the OTA update is located. But it's all described in the [Wiki](https://github.com/RavenSystem/esp-homekit-devices/wiki), so no reason to describe it here.  
  
Ok. to update your Sonoff, from scratch, requires some Soldering, but agin there is a million guides out there. So it's easy to find. And if you are interested in using custom Homekit devices, then a bit of Soldering, probably won't scare you :-)  
  
So far it just works, and i'm really impressed on how much development that is being done. Since I started looking at it, there has been an update, every 3-4 days.  
  
One important feature, that i'm looking forward to is to turn on device as default, when the power comes on. But it's coming in v5. And with the update pace, that can't be long away (v4.7 has just been released, as i'm writing this).  
You can see all releases [here](https://github.com/RavenSystem/esp-homekit-devices/releases).  
  
Note that there is a lot of Sonoff devices, and Ravencore, only supports a few. But I hope it's only a matter of time, until we see support for more devices and features.  
  

[![](https://1.bp.blogspot.com/-7DkWi-4UlaY/W-kwmcBh5UI/AAAAAAABjYc/QkK0EFPxEm82dS2iX54ROL2QDaRISN28QCLcBGAs/s640/IMG_3593.PNG)](https://1.bp.blogspot.com/-7DkWi-4UlaY/W-kwmcBh5UI/AAAAAAABjYc/QkK0EFPxEm82dS2iX54ROL2QDaRISN28QCLcBGAs/s1600/IMG_3593.PNG)

This is the details from Homekit, when it's up and running.

Disclamer : make sure you follow all rules etc. When you are playing with home installations. It's your own responsibility, to make sure everything is safe, secure and legal.