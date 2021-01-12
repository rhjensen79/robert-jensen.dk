---
title: 'Jenkins and CodeStream CSRF fix'
date: 2020-07-30T21:38:00.000+02:00
draft: false
aliases: [ "/2020/07/jenkins-and-codestream-csrf-fix.html" ]
tags : [automation]
thumbnail: "images/michael-dziedzic--Rc6usOigMk-unsplash.jpg"
---
For some time, I have had the problem with Jenkins, that when I ran my Code Stream pipeline, it gave me the following error 

[![](https://1.bp.blogspot.com/-BRpc30hcMVE/XyMfwKhdNOI/AAAAAAACP3c/Iq-QLTGWSSA1jgaZLJBO294lPOSv7It4ACLcBGAsYHQ/w400-h130/Sk%25C3%25A6rmbillede%2B2020-07-30%2Bkl.%2B21.29.45.png)](https://1.bp.blogspot.com/-BRpc30hcMVE/XyMfwKhdNOI/AAAAAAACP3c/Iq-QLTGWSSA1jgaZLJBO294lPOSv7It4ACLcBGAsYHQ/s930/Sk%25C3%25A6rmbillede%2B2020-07-30%2Bkl.%2B21.29.45.png)

To fix it, I have been running the code below, in the Jenkins "Script Console" 

  

import jenkins.model.Jenkins

def instance = Jenkins.instance

instance.setCrumbIssuer(null)

  

This has been ok, until my container, running Jenkins, restarted or got updated, and then I got the error again.

  

Today I finally took the time, to fix it, and it was really simple.

  

It turns out, that the error is due to using username/password in Code Stream, and not token.

  

Code Stream supports, username/password, and don't mention token, anywhere.

So I tried to replace my password, with a token I created, and it worked.

  

And now I don't get the errors anymore.

  

So a heads up. If you are using username/password, then generate a token, and replace your password with it, to be future proof.

  

You generate a token, by following the steps below.

  

1.  Log in to Jenkins.
2.  Click you name (upper-right corner).
3.  Click **Configure** (left-side menu).
4.  Use "Add new Token" button to generate a new one then name it.
5.  You must copy the token when you generate it as you cannot view the token afterwards.
6.  Revoke old tokens when no longer needed.

<span>Photo by <a href="https://unsplash.com/@lazycreekimages?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Michael Dziedzic</a> on <a href="https://unsplash.com/s/photos/fix?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>