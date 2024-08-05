---
title: "Enhance Kubectl with Local AI using Ollama and Open Source LLMs"
date: 2024-08-04T12:00:00+01:00
tags : [AI, Kubectl, Kubernetes, Ollama, LLM, kubectl-ai, github]
draft: false
toc: true
thumbnail: "images/boliviainteligente-DEci5GH0r0k-unsplash.jpg"
#image: "images/kelly-sikkema-v9FQR4tbIq8-unsplash.jpg"
description: "Learn how to enhance your Kubectl experience with local AI using Ollama and open-source LLMs."
---
## Intro

I know how to write a Kubernetes Deployment, service, secret or many of the other types you need when working with Kubernetes.

This post is not about that. 

It's about doing it faster and avoiding having to google for things, I can't remember, at the time when I need it.

The solution is getting a bit of AI help, directly from the LLM running on my laptop.

## Kubectl-AI

I have been following the [Kubectl-ai](https://github.com/sozercan/kubectl-ai) project, from the beginning, and have also tested it out, a couple of times.

It died a bit on me, since (as far as I can remember), you had to have an OpenAI subscription, to have it working, and I don't use it enough for that.

Also, I have long been a big fan of [Ollama](https://ollama.com) which allows you to run local LLM's on your laptop.

so whenever I can, I try to use a local LLM instead of a public one.

## New release

Today I saw that Kubectl-ai had a new [release](https://github.com/sozercan/kubectl-ai/releases/tag/v0.0.13), where the start of the release notes, stated that it could be used with Open LLM's.

So I had to try it out. 

This blog is about that :-)

## Installation

Prereq :

- Ollama installed (brew install ollama)
- A LLM downloaded (I use llama3.1 in this example) (ollama pull llama3.1)

To install Kubectl-AI follow the guide on the [Github Repo](https://github.com/sozercan/kubectl-ai)

I used homebrew 
```bash
brew tap sozercan/kubectl-ai https://github.com/sozercan/kubectl-ai
brew install kubectl-ai
```

After this, I added the following to .zshrc to make sure it was there every time I start my terminal.
```bash
# kubectl-ai
export OPENAI_ENDPOINT="http://localhost:11434/v1"
export OPENAI_DEPLOYMENT_NAME="llama3.1"
export OPENAI_API_KEY="n/a"
alias kai=kubectl-ai
```

This set's the OpenAI endpoint to my local Ollama, and the deployment to llama3.1

Note that llama3.1 might not be the best choice for this. So test it out yourself.

I also set an alias so I can write KAI instead of kubectl-ai when I want to use it.

## Execution

To test it, I tried the following in a new terminal.

```bash
kai write a deployment with nginx and a service that exposes port 80
```

The result was

```yaml
apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
    spec:
      replicas: 3
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
 - name: nginx
            image: nginx:latest
            ports:
 - containerPort: 80
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: nginx-service
    spec:
      selector:
        app: nginx
      ports:
 - name: http
        port: 80
        targetPort: 80
      type: LoadBalancer
```

It also asks me if I want to apply it directly.
```bash
Use the arrow keys to navigate: ↓ ↑ → ←
? (context: kind-educates) Would you like to apply this? [Reprompt/Apply/Don't Apply]:
+   Reprompt
 ▸ Apply
 Don't Apply
```

For me, I just select no, and copy-paste it to where I need it. 

## Conclusion

For me, this is a nice little tool, to help me.

It's faster than using Google, to get the same result, since I can add the customizations I need for my specific use case, and not have to customize what I find after.

Also, I find it really interesting, that I have another use case for my local LLM's that I have running anyway. 


Photo by <a href="https://unsplash.com/@boliviainteligente?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">BoliviaInteligente</a> on <a href="https://unsplash.com/photos/a-close-up-of-a-keyboard-with-a-blue-button-DEci5GH0r0k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  