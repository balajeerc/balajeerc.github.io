The following will be a short post, introspecting on the lessons learnt over the past year.

## Lesson 1: Learning How to Learn
Possibly the most important lesson was a meta lesson of how to learn. I am an advocate of learning new tech by just building something and `stackoverflow`-ing your way through it. However, I now realize it's much more optimal to pick a comprehensive book on the topic, and stick to the intellectual straightjacket of looking up everything in then book itself.

That means that you don't just Google for the answer, but you look up what you are trying to do in the Index of the book (remember those?)

The primary benefits I see to this process are:

- looking up a book takes you to the same sections/snippets of code, reinforcing your memory rather than a Google search where you end up at a different link each time
- the more

## Lesson 2: Typesafety is Indispensable
 
 I'll probably write a longer post on this, but long story short, am never picking a language without compile time type checking if I have a choice.

## Lesson 3: Learn to Stop Worrying and Love SQL

I should probably reword this as: stop bothering with ORMs and love SQL.
I have always hated SQL since I found the grammar very ugly. I hated it because it wasn't composable. I hated it because it just had too many primitives to hold in your head.
I don't anymore.
Stuff that hangs around, and dominate for over a couple of decades need to have some merit.
Once you get over the initial repulsion and start grokking it, the power it brings you is magnificent. 
Having a decent SQL IDE(?) like DBeaver also helps.

## Lesson 4: Pick Declarative APIs over Imperative Ones

We needed a job scheduler. A replacement for cron really. We started out with `celery` as the default choice. 
Turned out it was complex and not worth the effort. Celery had bugs involving the way it schedules the next job before the previous one completes. And the worst part is that the workers routinely crash.
I wish I remembered the details of the bug so that I could link to the celery bug report, but I don't.

Anyway, long story short, we switched to a different scheduler and queue manager named [mrq](https://mrq.readthedocs.io/). 

While we didn't switch for this specific reason, it's API's just consumed a JSON input specifying the schedule and settings. 

The result was that we could programmatically generate rather complex schedules and avoid a lot of boilerplate.

This pattern seems to recur over and over again, whether it be in specifying UI frontend elements (jQuery, Angular and other old frameworks vs React), or picking schedulers or programming languages, whatever tends to be more declarative always seems to be more easy to reason about, more composable and maintainable.

## Lesson 5: VSCode

I have always relied on vim to do most of the heavy lifting when it comes to code editing. I used to stub my nose at people relying on more "modern" editors.

However, the advent of Golang into my life has forced me to reconsider this. Code completion, debugging and jumping to symbol using golang plugins for vim have been less than satisfactory. I reluctantly bit the bullet and started tinkering around with VSCode, telling myself it's only going to be for golang editing. 

It was rough starting out. The vim plugin didn't exactly work like I wanted it. I hated having to use the mouse to switch between editor and the terminal. I hated that I couldn't use vim bindings in my terminal. I hated that I had to use arrow keys to move between intellisense suggestions. And omg, do you really have to take up so much screen real estate with that sidebar and status bar and half a dozen toolbars I never see myself using?

However, after a weekend of tinkering with the keymaps, I came to the revelation that VSCode is **incredibly** customizable. Using keybindings.json, I could customize _every little detail_ to work exactly the way I wanted. You'd have to try it to believe it. Switch to `hjkl` to move around windows. Check. Use `jk` to move up and down intellisense suggestions. Check. Want a custom terminal that you love in place of the default console? Sure, no probs. Don't wan't UI clutter? Use 'Zen' mode. Wait, but I want the status bar in Zen mode but not the menu bar. Yes, can do. 

And the best part is that all the settings and keybindings can be managed via files. That I can now version control.


<!--stackedit_data:
eyJoaXN0b3J5IjpbNzA0ODIzMDIsLTIzMDc4MTY3NywxODUwNj
Q5NjMzLC0xODMxOTg4OSwxNzE4NTY1MTE2XX0=
-->