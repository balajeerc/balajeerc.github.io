If you work in a shop where they talk of object oriented programming in glowing terms, you probably got handed a copy of the 'Design Patterns' book by Eric Gamma et al., the so called "Gang of Four" or the 'Head First Design Patterns' book by Eric Freeman et al. Your colleagues probably pride themselves on how they can "think and communicate with each other" in all these repeatedly used abstractions called "design patterns". Yeah, I know. I was one of them.

Having read through most of both those books, it appears that most of the "design patterns" are an advisory on how NOT to use the building blocks of OOP, the cornerstone among them being inheritance.

Let me illustrate with an example. Consider [the very first chapter of 'Head First Design Patterns'](https://www.safaribooksonline.com/library/view/head-first-design/0596007124/ch01.html). It introduces the so called 'Strategy Pattern' using a quirky - and what the author hopes is a funny - example involving ducks.

The scenario is set up as follows. There is a company that makes a 'Duck Simulator' app. In the beginning, they have three kinds of ducks. The first stab at a simplistic design involves a Duck super class followed by two derived classes. The ducks differ only in their appearance; they swim and quack the same way.

```cpp
class IDuck {
public:
    virtual void display() = 0; // Abstract, each duck displays differently
    void swim() { // ...swim like all ducks do }
    void quack() { // ...quack like all ducks do }
};
```
```cpp
class MallardDuck : public IDuck {
public:
	void display() { // ... Display a Mallard duck };
};
```

```cpp
class RedheadDuck : public IDuck {
public:
	void display() { // ... Display a redhead duck };
};
```

```cpp
class RubberDuck : public IDuck {
public:
	void display() { // ... Display a rubber duck };
};
```
But soon, the company's executives come up with a customer requirement:  they need to make *some* of these ducks fly.

The first stab that the company's engineer ("Joe") takes at it is to implement a new function in the `Duck` class.

```cpp
class Duck {
public:
    virtual void display() = 0; // Abstract, each duck displays differently
    void swim() { // ...swim like all ducks do }
    void quack() { // ...quack like all ducks do }
    void fly() { // ... fly like all ducks do?? }
};
```
This allows for a flying duck, but as you can imagine this causes quite a fracas since Rubber ducks don't fly in the real world. However, since `RubberDuck` also inherits from the Duck class that implements a common `fly` method, its instances of end up flying in the simulation. (Not good.)

So the next solution he comes up with is to make the `Duck` class an interface containing only abstract functions that are common to all ducks, moving all the implementations of all the functions to the concrete classes. In addition, since only some ducks can fly, he abstracts that away into a separate interface: `Flyable`.

So his new design looks as follows:

```cpp
class Duck {
public:
    virtual void display() = 0;
    virtual void swim() = 0;
    virtual void quack() = 0;
};
```

```cpp
class Flyable {
public:
	virtual void fly() = 0;
};
```

```cpp
class MallardDuck : public Duck, public Flyable {
	// ... implementations of quack, swim, display and fly
}
```

```cpp
class RubberDuck : public Quack {
	// ... implementations of quack, swim and display (but not fly) 
};
```
While this works, there is a lot of duplication of code between various Duck implementations since the quack, fly and swim behaviour are identical between the ducks. (Actually, in the example even the quack behaviour is separated out as a separate interface so that it can be overridden in the `RubberDuck` to squeak, but I am going to ignore that detail for now).

Then the book introduces a "Design Principle", highlighted in a box, complete with a picture of yin-yang to emphasize the zen in the statement: "Identify the aspects of your application that vary and separate them from what stays the same".

The recommendation that follows is to extract the various "behaviours" of ducks from the definitions of the ducks themselves. The final design they come up with at the end is as (diagram straight from the book):

![The Grand Duck Design](https://www.safaribooksonline.com/library/view/head-first-design/0596007124/figs/web/022fig01.png.jpg)

The chapter finally ends with more zen, advocating the principle 'Composition is better than inheritance'. It also congratulates the user over having learnt a new pattern: **strategy pattern**. 

Ok, now let's take a step back and see what just happened here:

 1. Joe Engineer loves OOP so much that that's how he models everything.
 2. The authors then come over and tell Joe to do three things:
	 - Extract the behaviours from the class into separate classes.
	 - Not use derive from a super class, rather to program to interfaces instead. Heck, don't use inheritance at all!
	 - Program to an interface (again, don't inherit from a concrete class).
	 - Favor composition over inheritance. (For the last time, inheritance sucks ok? Just don't.)
 4. They come up with a new "design pattern" to solve the problem still using classes as their units of abstraction.

Let's rephrase their most significant advice without losing its essence:
 - Separate procedures from data
 - Inheritance is bollocks
 - Interfaces are great

Well whadayya know! The best sagelike OOP advice is to do less of it and think more like functional programmers do. 

What distinctive characteristic of OOP do you have left once you remove inheritance, separation of object behaviour from object structure, and just use interfaces to abstract a "class" of objects that have a common set of behaviours? 

Ans: You get functional programming a la Haskell:

```haskell
{-# LANGUAGE DeriveAnyClass #-}

-- Define a few placeholder types that will result
-- from each of the duck operations. 
-- Just strings for now, but these can be as complex
-- as necessary
type FlightResult = String 
type SwimResult = String
type QuackResult = String
type DisplayResult = String

-- Define a typeclass for what all Ducks ought to 
-- be able to do
class DuckLike a where
    fly :: a -> FlightResult
    swim :: a -> SwimResult
    quack :: a -> QuackResult
    display :: a -> DisplayResult

-- Write some generic actions that will be 
-- shared across/common to all ducks
genericQuack :: QuackResult
genericQuack = "*quack quack*"

genericSwim :: SwimResult
genericSwim = "*paddle paddle*"

genericFly :: FlightResult
genericFly = "*flap flap whoooosh*"

-- Define types for the various ducks as instancing the Duck typeclass
data MallardDuck = MallardDuck { mallardName :: String }
    deriving (Show)
instance DuckLike MallardDuck where
    fly _ = genericFly
    swim _ = genericSwim
    quack _ = genericQuack
    display duck = "Hi, I am a Mallard Duck" ++ (mallardName duck)

data RedheadDuck = RedheadDuck {  redheadName :: String }
    deriving (Show)
instance DuckLike RedheadDuck where
    fly _ = genericFly
    swim _ = genericSwim
    quack  _ = genericQuack
    display duck = "Hello there, I am a Redhead Duck named " ++ (redheadName duck)

-- Note how we don't use the generic fly and squeak
-- functions for RubberDuck
data RubberDuck = RubberDuck { rubberName :: String }
    deriving (Show)
instance DuckLike RubberDuck where
    fly _ = "Can't fly. Can't do anything really. Sigh..."
    swim _ = genericSwim
    quack _ = "*Squeak squeak*"
    display duck = "I am a just a stupid rubber duck named " ++ (rubberName duck)
```
Running this in `ghci` gives:
```text
*Main> let redgy = RedheadDuck "Redgy"
*Main> quack redgy
"*quack quack*"
*Main> fly redgy
"*flap flap whoooosh*"
*Main> display redgy
"Hello there, I am a Redhead Duck named Redgy"
*Main> let rubbaar = RubberDuck "Rubbaar"
*Main> fly rubbaar
"Can't fly. Can't do anything really. Sigh..."
*Main> quack rubbaar
"*Squeak squeak*"
*Main> swim rubbaar
"*paddle paddle*"
*Main> display rubbaar
"I am a just a stupid rubber duck named Rubbaar"
```
Note that we have accomplished all the zen goals stated in the book chapter:
1. We have achieved distinct types for each of the ducks, and yet all of them conform to an 'interface'.
2. We have extracted the functionality that is "most likely to change most often" from the core interfaces and types that won't change as often. You can go on adding new types of ducks without having to change any existing code.
3. We have managed not to duplicate common generic functions that are uniform across most ducks in each type instance.
4. Specific types can implement functionality that is different from the generic behaviours.

Heck, I could have implemented this in vanilla C++, with some templated functions.

## The Point I'm trying to Make...
OOP proponents unnecessarily model what are essentially procedures as "classes". Then they come up with convoluted machinery called "design patterns" to try and work with them - all the while handing out sagelike advice to stop using inheritance, and extracting behaviours from objects - thus throwing away the very stuff of OOP.

At some point, it feels like the OOP crowd are doing this due to some weird masochistic urge to self flagellate. Anything, rather than just embracing that all the tomes of design pattern dogma they have internalized over the years are inferior to paradigms espoused by functional programming.

Let's stop please?

ha¡
