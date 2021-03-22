---
title: "Integrate Azure Devops With Vmware Codestream"
date: 2021-03-22T08:22:25+01:00
tags : [Azure, gitlab, CiCD, VMware, CodeStream, integrate, DevOps]
draft: true
thumbnail: "images/clay-banks-LjqARJaJotc-unsplash.jpg"
images: "images/clay-banks-LjqARJaJotc-unsplash.jpg"
---
For a customer case, I had to show integration between Azure Devops, and VMware CodeStream.

Since the Git endpoint in Code Stream, does not seam to work with Azure DevOps Git repository, I had to do this different. 

So the solution was quite simple. Trigger the pipeline, using a pipeline run by Azure Devops.

Note lot of the code snippets, i'm using, I got from [Grant Orchard blog](https://grantorchard.com/tango/cloud-assembly-api-getting-started/) so take a look at that, if you want to know more.

Before you begin, you need to have an API token, that can trigger the pipeline, and a Pipeline to run.


Photo by <a href="https://unsplash.com/@claybanks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Clay Banks</a> on <a href="/s/photos/integration?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  