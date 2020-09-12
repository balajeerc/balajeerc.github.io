---
test: ''

---
# Debuggers

My thought on use of debuggers is something of an evolving opinion.

The first time I discovered a debugger was when a senior in college saw me, in the college's computer lab, writing a program littered with `printf` statements.

He politely interrupted me and pointed out that I could use this thing called `gdb` instead and gave me a quick intro to the tool. At the time, it struck me as the bees knees and started using it extensively.

(As an aside: several years later, I'd go on to co-found \[a company\]([https://web.sensibull.com](https://web.sensibull.com/ "https://web.sensibull.com/")) with \[that senior\]([https://in.linkedin.com/in/abidhassan](https://in.linkedin.com/in/abidhassan "https://in.linkedin.com/in/abidhassan")). As luck would have it, he moved away from computing after college but probably had not too small a role in setting me off on my career in software development. It all worked out in the end when we finally had to collaborate.)

Ever since I discovered debuggers and learnt to use them with some modicum of competence, I was a vocal proponent for them. However, over the recent few years my thoughts on this have undergone some transformation.

## Imperative 'Object Oriented' Code

Something I realized a few years back was that use of a debugger was typically required in software that was written in a very 'object oriented' fashion. My first job, and the first couple of years in the one after that, were C++ shops doing game engines/computer graphics/scientific computing\` and I found that it was nigh impossible to navigate the complex interactions that arose from various objects mutating their internal state, and calling functions to communicate with each other.

Of course at that point my development had transformed to rely on debuggers so much that I would be crippled when I had to make do with just an IDE that could compile and run, but not do step debugging.

Later, as I moved to the web development side of things, I realized that I was using debuggers as a crutch to work around code bases that were inherently hard to reason about. To be clear, these code bases were written by C++ experts, ran `cppcheck`, and generally followed most of the constantly expanding hygiene practices prevalent in the C++ world. The code was not hard to read. The code was structured reasonably well enough. The trouble was that graphics engines/game engines are extremely stateful applications. And this state, distributed across a few hundred black boxes quickly became a nightmare to hold in my head and reason about.

## Dynamically Typed Languages

As I moved to Javascript, and more importantly, started using functional programming paradigms, with all application state abstracted as a single central store (a la Redux), I found that my cognitive load to reason about applications was dramatically lowered. However, I still found myself relying on debuggers significantly and 