---
title: "Tanzu Application Platform Accelerator with YTT"
date: 2022-04-11T08:18:44+02:00
tags : [Tanzu, TAP, YTT, Carvel, VMware]
draft: false
thumbnail: "images/pro-church-media-7NGU2YqBue8-unsplash.jpg"
images: "images/pro-church-media-7NGU2YqBue8-unsplash.jpg"
description: "How to use YTT with Tanzu Application Accelerators"
---
[Tanzu Appliation Platform (TAP)](https://tanzu.vmware.com/application-platform) has the concept of [accelerators](https://docs.vmware.com/en/Application-Accelerator-for-VMware-Tanzu/index.html).

Accelerators contain complete and runnable application code and deployment configurations, and can be used by developers to create new projects that follow enterprise standards, as stated in the [documentation](https://docs.vmware.com/en/Application-Accelerator-for-VMware-Tanzu/index.html).

While learning TAP, I quickly saw, that a good way for me, would be to use the [Carvel](https://carvel.dev) project [YTT](https://carvel.dev/ytt/), to create my templates. 

YTT a really nice way, to customize your yaml files, with inputs from TAP. Here I can use variables instead of text search/replace, and also do a lot of logic, which is beyond this blog post.

My problem was however, that when I created my accelerator.yaml file with
```
engine:
  type: YTT
```
that it only keept my yaml files, in the generated accelerator zip file, and not my code files.

I could read from the [documentation](https://docs.vmware.com/en/Application-Accelerator-for-VMware-Tanzu/1.0/acc-docs/GUID-creating-accelerators-transforms-ytt.html), that the way TAP uses YTT, is by running it as an external command, as the following command
```
ytt -f <input-folder> \
    --data-values-file <symbols.json> \
    --output-files <output-folder> \
    <extra-args>
```
So since TAP point YTT to the entire directory, this was probably why it only keep the files it knew. 

The solution ended up not being in the documentation, but in one of the sample accelerators [accelerator.yaml](https://github.com/sample-accelerators/new-accelerator/blob/tap-1.0/accelerator.yaml) files.


So the correct syntex, if you want to use YTT for your accelerator, and select which files to keep is the following :
```
engine:
  merge:
    - type: YTT
    - include:
        - "**/*.py"
        - "**/*.txt"
        - "Procfile"
```
In this example, I keep all .py and .txt files in the repo, and also the Procfile in the root.

Hope this saves others some headaches if you encounter the same :-) 

Photo by <a href="https://unsplash.com/@prochurchmedia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Pro Church Media</a> on <a href="https://unsplash.com/s/photos/paper-siccor?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  