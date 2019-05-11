The following will be a short post, introspecting on the lessons learnt over the past year.

## Lesson 1: Typesafety is Indispensable
 
 I'll probably write a longer post on this, but long story short, am never picking a language without compile time type checking if I have a choice.

## Lesson 2: Learn to Stop Worrying and Love SQL

I should probably reword this as: stop bothering with ORMs and love SQL.
I have always hated SQL since I found the grammar very ugly. I hated it because it wasn't composable. I hated it because it just had too many primitives to hold in your head.
I don't anymore.
Stuff that hangs around, and dominate for over a couple of decades need to have some merit.
Once you get over the initial repulsion and start grokking it, the power it brings you is magnificent. 
Having a decent SQL IDE(?) like DBeaver also helps.

## Lesson 3: Pick Declarative APIs over Imperative Ones

We needed a job scheduler. A replacement for cron really. We started out with `celery` as the default choice. 
Turned out it was complex and not worth the ef


## Lesson 4: VSCode

I have always relied on vim to do most of the heavy lifting when it comes to code editing. I used to stub my nose at people relying on more "modern" editors.

However, the advent of Golang into my life has forced me to reconsider this. Code completion, debugging and jumping to symbol using golang plugins for vim have been less than satisfactory. I reluctantly bit the bullet and started tinkering around with VSCode, telling myself it's only going to be for golang editing. 

It was rough starting out. The vim plugin didn't exactly work like I wanted it. I hated having to use the mouse to switch between editor and the terminal. I hated that I couldn't use vim bindings in my terminal. I hated that I had to use arrow keys to move between intellisense suggestions. And omg, do you really have to take up so much screen real estate with that sidebar and status bar and half a dozen toolbars I never see myself using?

However, after a weekend of tinkering with the keymaps, I came to the revelation that VSCode is **incredibly** customizable. Using keybindings.json, I could customize _every little detail_ to work exactly the way I wanted. You'd have to try it to believe it. Switch to `hjkl` to move around windows. Check. Use `jk` to move up and down intellisense suggestions. Check. Want a custom terminal that you love in place of the default console? Sure, no probs. Don't wan't UI clutter? Use 'Zen' mode. Wait, but I want the status bar in Zen mode but not the menu bar. Yes, can do. 

And the best part is that all the settings and keybindings can be managed via files. That I can now version control.


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTk3NzYzNDk1NSwtMTgzMTk4ODksMTcxOD
U2NTExNl19
-->