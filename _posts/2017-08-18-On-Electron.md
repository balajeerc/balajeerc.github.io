If you have been following the recent kerfuffle on Electron apps hogging all the resources thrown to them, then you fall in one of two camps:

- "Electron apps are written by incompetent programmers (referred to variously as web developers/script kiddies/morons) who should never have been allowed anywhere near code. You need 250MB of RAM for a color picker?! Fuck you!"
- "You guys are just old geezers who still want to write everything in C, and have to suffer all the memory leaks, security flaws and platform specific issues. The rest of us want to get stuff up and running this century."

The ideal solution to the problem, as always, is somewhere in between.

I started my career writing native applications in C/C++. I now mostly write Javascript (both for frontend and backend on Node). Ideally, I would just like to write just Haskell, but you know how the real world gets in the way of that.

## My 2 cents

Both camps have a point.

It is indeed true how ridiculous it is that color pickers written in Electron consume 250MB RAM. Then again, I would argue that it was ridiculous that a color picker was written in a framework that carries an entire copy of Chromium with it.

It is indeed ridiculous that Slack, a messaging platform should consume nearly a GB or RAM. However, I don't think it was as unreasonable for the Slack team to have picked up Electron for a quick and easy cross platform solution as the aforementioned author of the color picker.

It is indeed worrying that a text editor like Atom or VSCode takes up around 100MB of RAM per instance of window open. However, I don't find this demand of my system's resources as unreasonable as having to cough up a GB of RAM for a messaging platform.

Developer productivity matters. The Slack team could still write their messaging platform in, say QtQuick. But it would take them several more months than just wrapping up the existing web client in Electron and shipping it. When the choice is between a few days and few months, you can't fault them for having taken the quicker route.

Having said that, it is also true that not everybody has 16GB of RAM lying around. On the machine I am currently writing this on, I have 2GB of RAM. I have a mighty rig which I use for work, and this is my lounge-about-laptop - a small light machine that I use to write blog posts and work on code meant for learning. I quickly realized that VSCode is NOT a viable option on this machine. 

Bottomline is this: resource usage MUST justify the use case your application is trying to address. 1GB RAM usage may be ok for apps that is your user's primary workhorse. 1GB is egregious if yours is just a productivity utility (chat client/mail client) that the developer uses for no more than a few minutes at a time.

## The Alternatives

It's only a matter of time before React Native team decides to target desktop OS platforms as well. I read the post withe team saying that it is not in their roadmap, but I have a hunch that it is coming.

As for me, I am really excited about native tools embracing the declarative approach. Today, if I were tasked with writing a rich, responsive application that was "native" and also nimble on resource usage, I would pick one of the following:

- QtQuick - If I wanted a general, customer facing application
- [Ink](https://github.com/vadimdemedes/ink) - If I were writing a developer utility/productivity app

Ink is itself a JS tool and uses the React paradigm. So a developer used to ReactJS should feel entirely at home.

On the other hand, QtQuick lets you create 'native' apps targeting *every* platform you can think of. And do not listen to the scaremongering about having to learn C++. It is possible to write apps in QtQuick (with QML) using just JS and no C++ at all. Being declarative, it supports a purely functional 'redux' style workflow you are already comfortable with.
