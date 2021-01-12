---
title: 'Demo Enviroment on demand'
date: 2020-06-02T12:25:00.001+02:00
draft: false
aliases: [ "/2020/06/demo-enviroment-on-demand.html" ]
tags : [SDDC, VMware CAS, ubuntu, CMP, multi cloud, Self Service, Release Pipeline, cloud management, automation, XaaS, On Demand, CAS, Code Stream, VMware, AWS]
thumbnail: "images/ismail-enes-ayhan-lVZjvw-u9V8-unsplash.jpg"
---

  

[![](https://1.bp.blogspot.com/-a5hzLmkc714/XtYjm8W9TPI/AAAAAAACMj0/C-9xB871HfgCM9bW2YbHo39P9dQdDP--QCK4BGAsYHg/w640-h340/1*LLI4rWjfzkrKCLZtLA4zpA.jpeg)](https://1.bp.blogspot.com/-a5hzLmkc714/XtYjm8W9TPI/AAAAAAACMj0/C-9xB871HfgCM9bW2YbHo39P9dQdDP--QCK4BGAsYHg/1*LLI4rWjfzkrKCLZtLA4zpA.jpeg)

  

A couple of years ago Jad El-Zein (@virtualjad) created a demo, where he ordered a VM (I think it was) using Siri on his iPhone, with vRealize Automation (VRA).

  

As a side project, to another thing, I'm working on, I thought I would recreate that demo, in a 2020 VRA Cloud version.

  

This blog post, is around how I did just that :-)

  

You can see the demo below. 

  

  

Flow
----

So to make this work, the following happens. 

  

1\. On my phone, I call an app ([httpbot](http://www.httpbot.io)) and using Apple Shortcuts and call this, to request the url I have created on my AWS API Gateway.

2\. The API Gateway, then triggers a Lambda function.

3\. The lambda function, get's a token from VRA Cloud, and executes a Pipeline in CodeStream.

4\. The Pipeline in CodeStream, requests a Blueprint, with a specific sets of input properties, and deploys a VM in my VMware environment. 

5\. As part of the deployment, a ABX Action is triggered, that gives me a notification in Telegram, with the details of the deployment. 

  

  

The first question that you are probably thinking, is either Why or could this have been done more easily?

  

The short answer is : to show how customizable VRA is, and YES, but this is version 1.

  

API Gateway
-----------

I won't go thru, how to setup the API Gateway, but to make it execute the Lambda function, I setup integrations.

[![](https://1.bp.blogspot.com/-gZhMkvC_6jQ/XtYUInKgCHI/AAAAAAACMic/WAslebcrz5IEIK4quFYGxwdWEDgXJnGUQCK4BGAsYHg/w640-h335/Sk%25C3%25A6rmbillede%2B2020-06-02%2Bkl.%2B10.55.10.png)](https://1.bp.blogspot.com/-gZhMkvC_6jQ/XtYUInKgCHI/AAAAAAACMic/WAslebcrz5IEIK4quFYGxwdWEDgXJnGUQCK4BGAsYHg/Sk%25C3%25A6rmbillede%2B2020-06-02%2Bkl.%2B10.55.10.png)

  

So to execute my Lambda, I have to thus the url/test\_env.

The "Any" means I can use any type (get, Post, Put etc.)

Lambda
------

I won't run thru how to create a Lambda function. But the code, I uses, can be found (and customized) below. You can also find it in my [Github repo](https://github.com/rhjensen79/vra-extensibility).

  

All I need, is a Auth token from VRA, and the pipeline id from Codestream (copy the id, from the url in CodeStream).

  

```
import json  
from botocore.vendored import requests  
#Variables  
auth\_token  = "Your Token"  
pipeline    = "Your pipeline ID"  
def lambda\_handler(event, context):  
    # Autorize  
    url = "https://api.mgmt.cloud.vmware.com/iaas/api/login"  
    payload = "{\\n\\t\\"refreshToken\\": \\""+auth\_token+"\\"\\n}"  
    headers = {  
    'Content-Type': 'application/json'  
    }  
    response = requests.request("POST", url, headers=headers, data = payload)  
    data = response.json()  
    token = (data\['token'\])  
    #print ("Token : "+token)  
      
    #Request   
    url = "https://api.mgmt.cloud.vmware.com/pipeline/api/pipelines/"+pipeline+"/executions"  
    headers = {  
    'Content-Type': 'application/json',  
    'Authorization': 'Bearer '+token  
    }  
    response = requests.request("POST", url, headers=headers, data = payload)  
    #print(response)  
      
    return {  
        'statusCode': 200,  
        'body': json.dumps('Demo Env comming up!')  
    }
```

  

CodeStream Pipeline
-------------------

The CodeStream pipeline, is really simple. It just uses blueprints, I already have and uses, in Cloud Assembly.

The only real thing I have done so far, is the Deployment name. 

It's "Test\_Env-${executionId}" to make sure I can recognize it, and to make sur, it gets a unique name, every time. 

[![](https://1.bp.blogspot.com/-zmeaZ-NAN3Q/XtYVGxCrQxI/AAAAAAACMi8/3-6H-FqDM8cmJLLeSRsZjVHVJrh_6jItQCK4BGAsYHg/w640-h312/Sk%25C3%25A6rmbillede%2B2020-06-02%2Bkl.%2B10.57.56.png)](https://1.bp.blogspot.com/-zmeaZ-NAN3Q/XtYVGxCrQxI/AAAAAAACMi8/3-6H-FqDM8cmJLLeSRsZjVHVJrh_6jItQCK4BGAsYHg/Sk%25C3%25A6rmbillede%2B2020-06-02%2Bkl.%2B10.57.56.png)

  

Note that the most important reason for me to use codestream (I could just have used the API, to do a deployment in Cloud Assemble), is that it's really customizable. And if I want to change things, or extend my demo environment, to include more services etc. then all can be done from my CodeStream pipeline, without changing any API's etc. 

Wrap Up
-------

That's all it took. 

I hope this has given som inspiration, to how VRA can be extended, or consumed, from places that you might not thing off.

  

  

If you wanna look at other extensibility scripts etc. for VRA, then take a look at my Github repo : [https://github.com/rhjensen79/vra-extensibility](https://github.com/rhjensen79/vra-extensibility) or look at [Code.VMware.com](https://code.vmware.com/samples)'s Sample Exchange.

  

Thanks for reading this far, and please reach out, if you have questions etc.

<span>Photo by <a href="https://unsplash.com/@ismailenesayhan?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">İsmail Enes Ayhan</a> on <a href="https://unsplash.com/s/photos/servers?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>