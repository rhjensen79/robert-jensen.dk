---
title: 'Auto Clean up old recordings'
date: 2018-01-07T20:47:00.003+01:00
draft: false
aliases: [ "/2018/01/auto-clean-up-old-recording.html" ]
tags : [Bash, Linux, Netatmo, Script, Presence, Survalience, Synology]
---

[![](https://3.bp.blogspot.com/-mm3eelAnTf4/WlJ1piJwP3I/AAAAAAABQ9E/e3emey4hdEIsHTlOxqK2xzUHPHFHKnmAwCLcBGAs/s640/codecode.jpg)](https://3.bp.blogspot.com/-mm3eelAnTf4/WlJ1piJwP3I/AAAAAAABQ9E/e3emey4hdEIsHTlOxqK2xzUHPHFHKnmAwCLcBGAs/s1600/codecode.jpg)

  

Some time ago, I bought the [Netatmo Presence](https://www.netatmo.com/en-US/product/security/presence) cam. 

I love the "Intelligence" in the cam (it detects different objects linke cars, people, animals), and it's ability, to work when there is no wifi etc. due to the build in SD card.

I do however, upload everything to my NAS using ftp, for safe keeping.

  

My settings, is to keep everything for 30 days. That's more than enough, and something the Netatmo supports -  or so I thought. 

  

It turns out, that the uploaded data, is not deleted after 30 days, so to keep myself from storing tons of old video files, I decided to use the build in scheduled tasks in my Synology, todo some cleanup.

  

Everything is keept in a folders called Cam, on the [Synology](https://www.synology.com/).

And it's stored in a folder structure like year -> month -> date -> File

  

So the solution was rather easy.

  

[![](https://4.bp.blogspot.com/-oxYImTW4Zl8/WlJ29oB0RnI/AAAAAAABQ9I/0P4lsU5SBz82XKNyFyzgwZgjWuNo6FUwQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-07%2Bkl.%2B20.29.33.jpg)](https://4.bp.blogspot.com/-oxYImTW4Zl8/WlJ29oB0RnI/AAAAAAABQ9I/0P4lsU5SBz82XKNyFyzgwZgjWuNo6FUwQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-07%2Bkl.%2B20.29.33.jpg)

Create a task in the Synologt DSM interface, that runs every day at 23:59 (sorry for the danish screenshot).

  

[![](https://2.bp.blogspot.com/-i1UQaboe41E/WlJ3ID_4RuI/AAAAAAABQ9M/VJbBkgeBx5oQmFfhDRbjCCh73ibmeF9gQCLcBGAs/s640/Sk%25C3%25A6rmbillede%2B2018-01-07%2Bkl.%2B20.29.16.jpg)](https://2.bp.blogspot.com/-i1UQaboe41E/WlJ3ID_4RuI/AAAAAAABQ9M/VJbBkgeBx5oQmFfhDRbjCCh73ibmeF9gQCLcBGAs/s1600/Sk%25C3%25A6rmbillede%2B2018-01-07%2Bkl.%2B20.29.16.jpg)

Run the script :

  

_find '/volume1/cam/' -mtime +30 -type f -delete_

_find '/volume1/cam/'  -type d -empty -delete_

  

The 1 line find's all files, in the folder structure, that is older then 30 days and deletes them.

The 2 line, find's all empty folders, and deletes them.

  

This could probably have been done smarter, but this seam to work.

  

Right now it sends a notification to me after each run.

When i know it runs perfectly, i will chose to only receive email, when it ends with errors.