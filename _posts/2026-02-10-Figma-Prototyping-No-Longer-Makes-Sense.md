I head Product and Growth at [Sensibull](https://sensibull.com/) and as part of my job, I routinely make mockups/prototypes in Figma to explore new features or modifications to existing features.

Note that here I am only talking about low-fidelity prototypes. I am not talking about high fidelity mockups that product designers make further down the feature development process. But even at these preliminary stages, product prototyping can get quite detailed. These prototypes are what I and other product managers in the team create so that we can chew on ideas, figure out corner cases and the impact of a new feature on other aspects of our application.

The way we used to do this is using Figma. We import a ‘Whiteboarding’ component library and drag and drop elements to make quick prototypes.

However, of late I was working on a rather big feature, and was constantly struggling with the Figma editor. To be clear, the Figma editor is good, but there is still the whole process of having to set up the components using a drag and drop process. And as much as we’d like to tell ourselves that during the prototyping phase, only the core idea matters, the undeniable fact is that a hideous looking prototype does not do you any favours when trying to sell a new concept to the team. So then you start putting in a bit of effort to make things look acceptable. And that ends up a time sink where you are playing Barbie with your prototype whereas you should be thinking about the idea you are trying to communicate to the team.

Then comes the whole aspect of stitching together a coherent clickable prototype in Figma. You have to ‘stitch’ together various frames carefully and add necessary back buttons and so forth. At the end of it, you end up with a maze of screens with interactions going from one to the next and back. This can get quite hairy quite fast.

After a few hours of frustration, I decided I’d just vibe code it using Kilo code.

The change in my iteration speed was just shocking.

I drew pen and paper mocks of the new feature I was planning to build, took photos of it on my phone camera and gave it to the Agent who made a very pretty looking initial version of the prototype. After that, making changes was just a matter of prompting appropriately.

This process unlocks a whole lot of super-powers which need to be seen/experienced to be believed. Previously, the initial prototype, strive as much as we might to capture all the nuances, would invariably end up missing some glaring corner cases. However, being able to play with a live prototype immediately surfaces these rough edges in flow logic/product abstractions. And this lets you incorporate some really nuanced considerations in your spec.

Communication of the idea with team members now becomes ridiculously simple. The buttons are clickable, the modals come up as necessary.

Furthermore, generating a draft of the written product spec is just one prompt away. The LLM knows your entire codebase and can generate all necessary details from it.

The absolute kicker is how you can use the LLM itself for brainstorming and checking things you may not have considered. I literally ask it things like “What are elements/aspects I may be missing in this screen?” and I typically get one or 2 suggestions that end up catching tiny details that I missed.

This also becomes a much better input for the tech team to evaluate the feasibility of implementing the sometimes fanciful features that the product team dreams up. There’s nothing like having a live prototype that you can interact and play around with that helps bring out all the hairy corner cases that we are about to run into. That’s what Figma prototypes are supposed to do, but the vibe coded “live” prototype is that on steroids.

Now for some caveats: 

1. A lot of my experience above is coloured by my background. I spent the first 16 years of my life writing code. I have been working in Product and Growth only for the last 5 years. And even in the last 5 years, I was always working on one hobby project at least. I code every weekend. A product manager without that background might get mixed results, though the fabulous comprehension that frontier models show seems to make this gap smaller all the time.
2. This is throw-away code. No one's going to use this in production.
3. Finally, as mentioned in my [previous post](/Use-Deterministic-Guardrails-for-your-LLM-Agents/), I have assembled a rather extensive scaffolding that lets me keep my code reasonably sane (small functions, small files, no code duplication, enforced modularisation etc.). In my observation, that also helps increase the probability of my prompt being transformed into a feature change or bug fix as I expect the agent to.

Overall, I suppose this is a great time to be building.
