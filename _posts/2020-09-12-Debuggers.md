---
test: ''

---
My thought on use of debuggers is something of an evolving opinion.

The first time I discovered a debugger was when a senior in college saw me, in the college's computer lab, writing a program littered with `printf` statements.

He politely interrupted me and pointed out that I could use this thing called `gdb` instead and gave me a quick intro to the tool. At the time, it struck me as the bee's knees and started using it extensively.

(As an aside: several years later, I'd go on to co-found [a company](https://sensibull.com/ "Sensibull") with [that senior](https://in.linkedin.com/in/abidhassan). As luck would have it, he moved away from computing after college but probably had not too small a role in setting me off on my career in software development.)

Ever since I discovered debuggers and learnt to use them with some modicum of competence, I was a vocal proponent for them. However, over the recent few years my thoughts on this have undergone some transformation.

The first trigger to me questioning my embrace of step debuggers was when a colleague at work I respect immensely, and an old college mate of mine that I regard highly, both described step debugging as 'boring', in separate conversations with me. At the time, I suppose I didn't get the full import of what they were trying to convey. To me, getting stuff done as quick as possible seemed more important than turning every bug hunting session into a kind of intellectual joust.

Later, I stumbled on two [separate](https://news.ycombinator.com/item?id=19829435) [posts](https://news.ycombinator.com/item?id=19829435) on HackerNews and the comment storms that ensued in both cases, extensively documents problems that others have with the use of debuggers. Both of these again got me grappling with my own views on the matter.

Now I eschew debuggers if I can. However, at this point you are forming a protest on why you have found debuggers so useful to you, let me try and offer concessions on 4 scenarios I have found where debuggers are indeed indispensable.

## Exploring a New Codebase

The most genuine use for a debugger I've found is when reading a new codebase. I argue that stepping through code, inspecting the variables at key breakpoints, gives you much more insight into what is happening than just having to scan the code.

## Grappling with 'Object Oriented' State

Something I realized a few years back was that use of a debugger was typically required in software that was written in a very 'object oriented' fashion. My first job, and the first couple of years in the one after that, were C++ shops doing game engines/computer graphics/scientific computing and I found that it was nigh impossible to navigate the complex interactions that arose from various objects mutating their internal state, and calling methods on each other.

Of course at that point my development style had transformed to rely on debuggers so much that I would be crippled when I had to make do with just an IDE that could compile and run code, but not do step debugging.

Later, as I moved to the web development side of things, I realized that I had been using debuggers as a crutch to work around code bases that were inherently hard to reason about. To be clear, these code bases were written by C++ experts, ran `cppcheck`, and generally followed most of the ever expanding hygiene practices prevalent in the C++ world. The code was not hard to read. Variables were well named. The code was structured reasonably well enough: they followed all the fancy 'design patterns' which you were expected to grok when it was introduced to you in the company's orientation.

The trouble was that graphics engines/game engines are extremely stateful applications. And this state, distributed across a few thousand disparate black boxes quickly became a nightmare to hold in one's head and reason about. As I moved to Javascript, and more importantly, started using functional programming paradigms, with all application state abstracted as a single central store (a la Redux), I found that my cognitive load to reason about applications was dramatically lowered. I realized that I was automatically relying far less on debuggers, especially when working on code in the React/Redux ecosystem that put emphasis on turning everything into small pure functions and composing them together.

## Dynamically Typed Languages

However, I still find myself relying on debuggers occassionally, but for an altogether different reason: lack of type information.

Since there's no way for you to tell what the shape of inputs to JS/Python functions are, I am forced to again open up the code in debuggers to investigate when errors occurred. In fact, it's nigh impossible to reason about JS bugs without a debugger, even when the code is stateless, even when it's just pure functions calling each other. The problem stems from the fact that you don't know the shape of inputs to those functions, and when one of the params input is `null` or `undefined`

This is in contrast to a typesafe functional language like Haskell that I dabbled with in my spare time, where I never feel the need for a debugger. I realize now that while functional programming itself makes it easier to reason about state and mutations, dynamically typed languages still necessitate a debugger to reason about the shape of data when things go awry.

## Imperatively Written Code

In addition to the above two scenarios, there is another kind of code that necessitates use of debuggers: long imperatively written functions, full of while loops and mutations of counters and flags. More simply speaking: bad code. I have run up against this in codebases that were written in both static typed (C++, Golang, Java) and dynamically typed languages (Javascript, Python).

While one strives to write elegant, simple code, more often that not you run up against an existing codebase full of complex functions like the above that it is now your responsibility to fix a bug in. Without a debugger, this will typically require you to construct a complex state machine in your head. 

Some people love doing this. I find it an exercise in masochism. Life is too short to be expending intellectual effort on fixing shitty code. I'd rather spin up a debugger to troubleshoot a bug and squash it ASAP, or just refactor the existing code into easier to reason about smaller chunks. In the real world, most of the time, that refactor and the necessary re-testing of all the flows in that new code is just a luxury you cannot afford. So I prefer to just fix the bug and move on. The important thing I've found in these situations is to NOT be too eager to 'be done with it' either. As with all things in life, you need to strike a balance between narrowing down on the problem, and figuring out the overall context of that code, shitty as it may be, so as to not introduce new bugs in the process.

## The No Debugger Straightjacket

These days when I write code, I put myself in an intellectual straightjacket: I refuse to use a debugger though I always have a debugger accessible to me. I don't use naive `print` statements (or its equivalent) either. 

Instead, when I do need to troubleshoot a bug, I add logs. Specifically, debug logs. Copious amounts of it. And I any debug log I add, I leave it in code. After all, they only manifest when you turn `LOG_LEVEL` to the necessary verbosity.

This straightjacket has turned out to be a force for good. Whenever the logic gets hairy, I automatically start decomposing it into smaller, and separate functions that make the code easier to reason about. Of course, am a big fan of unit tests, and they are a force multiplier of their own.

## Final Thoughts

There is a quote from Bob Martin that I think is particularly insightful in this regard:

> I consider debuggers to be a drug -- an addiction. Programmers can get into the horrible habbit of depending on the debugger instead of on their brain. IMHO a debugger is a tool of last resort. Once you have exhausted every other avenue of diagnosis, and have given very careful thought to just rewriting the offending code, then you may need a debugger.

I think this just about sums up my thoughts on the matter. I also think this to be the reasonable middle ground in the 'should we or shouldn't we' as concerns debuggers: use a debugger if you have to, but once you are doing that, acknowledge that you are dealing with inherent shortcomings of your code base: complexity in state management, lack of types, or just outright poorly written code.

My rules of thumb are, spin up a debugger only if:

- you are trying to understand a new codebase.
- you are grappling with extensive state management in an 'object oriented' codebase.
- you are trying to figure out the shape of a piece of data in a dynamically typed language.
- you are troubleshooting a bug in a poorly written piece of code that is not worth refactoring at the moment.
