> NOTE: This post, every bit of it, was entirely written by a human. Please feel free to blame the author rather than an LLM for any bits you suspect is poorly written / inane :)
> 

This post is not to pontificate in favour of agentic LLMs. Instead, in this post I'll be focusing on how to avoid an all too common occurrence: your vibe-coded/LLM agent coded project from turning into unreadable mush. Because, as much as I am an LLM/coding agent optimist, this is something that just cannot be denied.

Here are a few observations I found using agentic AI for coding:

1. It copy pastes code a lot. (I mean, a lot!)
2. It does not remove old unused code.
3. It does not follow any kind of code modularization leading to terrible spaghetti code.
4. It writes really long and complex functions sometimes. I mean 500 line for loops with nested ifs and further nested loops within them.
5. Files grow really really long. Left to themselves, LLMs generate projects with 90% of files of size less than 200 lines, and some 4-5 monstrous files containing over 2000 lines each.

These issues are less pronounced in the 'first pass' where you just gave it a prompt and got a decent working v1. However, as you keep making changes and iterating, the above problems start compounding fast.

With some trial and error what I’ve found is that having a series of linters as guardrails dramatically improves the code quality. And while this is anecdotal, it appears that improving code quality as mentioned below also makes the success rate of bug fixing and new feature addition through prompting an agent higher.

Furthermore, I find that the code generated with the guardrails mentioned below is easier to read and debug when you need to get down and fix some hairy nuanced issue that the LLM agent is unable to fix by itself.

While talking to some of my colleagues and friends in other firms, I realized that many of them were not fully aware of some of the newer static code analyzers. I certainly wasn’t until recently. So, hopefully this post brings your attention to the fact that some advanced deterministic linters/static code analyzers already exist for your language ecosystem. Tools like `clippy` for rust and `golangci-lint` for Go have most of these tools already built-in or available as plugins. So it’s just a matter of setting up config files appropriately.

These days, I mostly make prototypes in Typescript. So some of the suggestions below are influenced by that experience. However, I believe most of the suggestions below translate to other language ecosystems as well.  

1. **Type-safe compiler**
    
    I think this is an absolute must. Agentic code generation most certainly needs type safety. It eliminates a whole class of bugs. I’m not going to belabor this point in this post. If you are doing agentic development, you likely do need static type checking.
    
2. **Enforce Basic Linting**
    
    Most mature language ecosystems have at least one great linting tool you can find. Enforce as many of the strict rules as possible. Whether it's `eslint`, `golangci-lint`, `clippy`... there are a wealth of options here which you likely already know about and likely probably use already.
    
3. **Keep files small**
    
    LLM generated code, especially those that are vibe coded without careful review, end up having some really small files with a couple of types or functions defined in them, and 2-3 mega files each spanning several thousands of lines.
    
    Enforce linter rules that mandate that files cannot go over a certain threshold in length, maybe between 500 and 750 lines at most. `eslint` for example lets you enforce this using the `max-lines` rule. While doing this, note that you might need to carve out exceptions for some files which might contain code, but are essentially configuration or data.
    
4. **Enable cyclomatic complexity checks**
    
    This is the first of the non-obvious options that I stumbled on recently which I have found useful. Basically, cyclomatic complexity while not perfect does a decent job of clamping down on code where there's a lot of branching code. When applied to a function, it measures the number of linearly independent paths in it. The [eslint docs](https://eslint.org/docs/latest/rules/complexity) do a good job of explaining it.
    
    This along with `eslint`'s [max depth](https://eslint.org/docs/latest/rules/max-depth) rules make the functions generated easy to read.
    
5. **Unused code removal**
    
    When you do a series of refactors or deep-rooted feature changes in a vibe-coded project, agentic LLMs leave a lot of legacy unused code in the code base. Another related issue is the fact that agentic LLMs will not, unless expressly prompted, remove third party dependencies from the project.
    
    For the Typescript/JS ecosystem, tools like [knip](https://knip.dev/) help eliminate this by removing unused exports, files and dependencies.
    
6. **Prevent Code Duplication**
    
    Code refactors by agentic LLMs always results in a lot of copied code. I found that [jscpd](https://github.com/kucherenko/jscpd) is really good at flagging these duplications. Unlike many of the other linters mentioned in this post, `jscpd` is language agnostic. So it can probably help find code duplicates in your code base already.
    
7. **Enforcing modularization / folder dependency rules**
    
    This was for me the biggest revelation regarding the state of static code checkers available. I suspect this is less a problem in some ecosystems like Rust where you need to break up large code bases into multiple cargo packages. But if you, like me are working in a big monolith where the only code modularization primitive is a folder in the file-system, then a tool like [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) is a god-send.
    
    Dependency cruiser lets you define fine grained directory-level modularisation rules as shown below:
    
    ```jsx
    module.exports = {
      forbidden: [
        // ============================================
        // SECTION 1: Feature-Based Architecture Rules
        // ============================================
        {
          name: 'no-feature-to-feature-imports',
          severity: 'error',
          comment:
            'Features should not import from other features directly. Use shared/ for cross-feature code. ' +
            'This maintains feature independence and prevents tight coupling.',
          from: {
            path: '^src/(builder|home|community|coverPage|performanceResults)/',
          },
          to: {
            path: '^src/(builder|home|community|coverPage|performanceResults)/',
            pathNot: [
              // Allow imports within same feature
              '^src/$1/',
            ],
          },
        },
        {
          name: 'no-shared-import-features',
          severity: 'error',
          comment:
            'Shared code should not import from feature folders. Shared code should be truly generic ' +
            'and not depend on any specific feature implementation.',
          from: {
            path: '^src/shared/',
          },
          to: {
            path: '^src/(builder|home|community|coverPage|performanceResults)/',
          },
        },
    
        // ============================================
        // SECTION 2: Layer Architecture Rules (Within Features)
        // ============================================
        {
          name: 'no-store-import-components',
          severity: 'error',
          comment:
            'Store modules should not import from components. The store is the data layer and ' +
            'should be independent of UI concerns.',
          from: {
            path: '^src/(builder|shared)/store/',
          },
          to: {
            path: '^src/(builder|home|community|coverPage|performanceResults|shared)/components/',
          },
        },
        {
          name: 'no-store-import-hooks',
          severity: 'error',
          comment:
            'Store modules should not import from hooks. The store provides data that hooks can use, ' +
            'but store should not depend on hooks.',
          from: {
            path: '^src/(builder|shared)/store/',
          },
          to: {
            path: '^src/(builder|home|community|coverPage|performanceResults|shared)/hooks/',
          },
        },
        {
          name: 'no-types-import-runtime',
          severity: 'error',
          comment:
            'Type definition files should only contain types. They should not import runtime code ' +
            'from components, hooks, store, or data.',
          from: {
            path: '^src/(builder|home|community|coverPage|performanceResults|shared)/types/',
          },
          to: {
            path: '^src/(builder|home|community|coverPage|performanceResults|shared)/(components|hooks|store|data)/',
          },
        },
     ],
    };
    
    ```
    
    As an example, note how the configuration forces the file hierarchy to not import between features directly. When flagging the error, it also asks to `use shared` directory for such cases. The LLM agent now has the hint it needs to do the right thing in this case which is to put code that is used across multiple features into the shared directory.
    
    One note of caution here. One pitfall that the above `shared` directory rule can get you into is the `shared` directory itself growing too large and collecting all kinds of unrelated cruft.
    
    In my case, I was able to use dependency-cruiser as a library in a custom script to ensure that a shared file must at least be used in 2 features (hence enforcing its ‘shared’ status). Just something to watch out for.
    
8. **Security Checks**
    
    There are a quite a few static checkers that analyze code for security vulnerabilities. I use `semgrep` but there are quite a few options to choose from in this space (some of them with paid tiers like semgrep itself).
    

## Putting it all together

Once you figure out/assemble the list of linter configuration rules you’d like, it’s time to enforce it. All the agentic tools have some kind of `rules` directory where you can mandate it to run a check once it finishes a task. In my case, I chain all the checks together in my `package.json` like so:

```jsx
{
  "name": "my-prototype",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "(fuser -k 5173/tcp || true) && vite",
    "build": "vite build",
    "lint": "eslint . --max-warnings=0",
    "check:code-duplication": "jscpd src --min-lines 10 --threshold 0",
    "check:unused-code": "knip",
    "check:dependency-rules": "depcruise src --config .dependency-cruiser.cjs",
    "check:shared-usage": "node scripts/check-shared-usage-depcruise.mjs",
    "check:security": "semgrep --config 'p/react' --config 'p/typescript' --include='*.tsx' --error",
    "check": "tsc --noEmit && pnpm lint && pnpm check:unused-code && pnpm check:code-duplication && pnpm check:dependency-rules && pnpm check:shared-usage && pnpm check:security",
  }
}
```

And in my agent rules, I mandate that the agent always runs `pnpm check` before task completion.

Furthermore, I use `pnpm check` as a pre-commit hook so that even if the agent misses running the checks, at commit time, they are run and any violations get flagged.

## Conclusion

As with most posts related to agentic coding, most of this is anecdotal. However, the primary takeaway would be that the linting and static analysis tools available today are pretty great. And that even adding a few of these as guardrails for your agentic LLM assistants will go a long way to improving the resulting code quality. 

Hope you have as much luck (if not more) with this as I did with the agentic LLM slot machines :)
