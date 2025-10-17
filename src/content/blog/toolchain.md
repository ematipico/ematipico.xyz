---
title: Toolchains, the hard parts
description: Let's dive inside the hard parts of building a toolchain
pubDate: 2025-10-10
heroImage: /src/content/assets/blog/chain.jpg
heroAltImage: A chain
slug: toolchains-the-hard-parts
---

## What's a toolchain?

A toolchain is a common term to define software, most of the time a CLI, that provides a set of other tools. 

A toolchain that I know about is [`cargo`](https://doc.rust-lang.org/cargo/). `cargo` is the official package manager of the Rust programming language,
however `cargo` provides other features:
- formatter
- linter
- test runner
- task runner
- compiler
- ...and more!

The other features, **or tools**, are essentially command line tools that are run by `cargo`. I found `cargo` to be very 
powerful, it offers a great developer experience, and it rarely has bugs (that I'm aware of!).

The perception of toolchain may vary among ecosystems/languages. For example, the JavaScript/TypeScript ecosystem doesn't have a
proper toolchain like `cargo`, but there are some libraries or frameworks that offer their version of "unified" toolchain:
- For example [NestJs](https://docs.nestjs.com/cli/usages) offers its "toolchain" for the framework.
- Another example is [Astro](https://docs.astro.build/en/reference/cli-reference/), which offers its "toolchain" to manage a project.
- Even [Next.js](https://nextjs.org/docs/pages/api-reference/cli/next) offers a "toolchain" to manage the project.

<img class="prose" src="https://gifdb.com/images/high/new-is-better-barney-stinson-h2b5mmth08rgleij.gif" alt="New is always better">

However, we can see the rise of other software that offers more powerful toolchains:
- [`Bun`](https://bun.sh/): a runtime that offers a package manager, a bundler, a test runner, a task runner (probably more).
- [`Deno`](https://deno.com/): a runtime that offers a package manager, a bundler, a test runner, documentation generation, formatter, linter, a language server, a task runner (probably more).

And `Node.js` noticed this trend, and it started shipping toolchain capabilities such as test runner - via `node:test` - and a task runner - via `node run`.

I'm generally happy with the trend of the JavaScript/TypeScript ecosystem, and we should keep borrowing ideas from new and modern languages/ecosystems.

## The hard parts 

As maintainer of [Biome](https://biomejs.dev), I've gained experience in how to write toolchains, and if there's
something that isn't easy to get right, it's the developer experience.

Contrary to user experience, the developer experience is more subtle to get right because, as a specialist, you provide a tool to your peers who *should have the same level of knowledge*.

Unfortunately, that's not the case. Many of your peers come from different backgrounds and grades of knowledge. Even seniors will need to learn things from scratch. The DX (Developer Experience) of a toolchain must grow
with the knowledge acquired by your peers. Your users will always be "newbies", and with time they will become proficient with the toolchain.

### Good messages

DX wasn't a thing until ten years ago (more or less), so there wasn't a focus on providing meaningful error messages. Most of the time, it's still like this. 
Let's take, for example, the following JavaScript snippet:

```js
const something;
```

If you run it in your Browser (I tried Firefox), you'll get the following message:

```
Uncaught SyntaxError: missing = in const declaration
```

The message is somewhat understandable. However, I believe that this message is not beginner-friendly. 
Let's see what Biome provides when parsing the same snippet:

```
 at file.js:1:7 parse ━━━━━━━━━━━━━━━━━━━━

  ✖ Const declarations must have an initialized value.
  
  > 1 │ const something;
      │       ^^^^^^^^^
  
  ℹ This variable needs to be initialized.
```

This message explains that these kinds of declarations must be initialized, and it also shows where the error occurs.

Let's move to another example:

```js
var foo = ;
```

Here's what the browser shows:

```
Uncaught SyntaxError: expected expression, got ';'
```

And here's what Biome outputs:

```
 at file.js:1:11 parse ━━━━━━━━━━━━━━━━━━━━

  ✖ Expected an expression, or an assignment but instead found ';'.
  
  > 1 │ var foo = ;
      │           ^
  
  ℹ Expected an expression, or an assignment here.
  
  > 1 │ var foo = ;
      │           ^
  
```

I would admit that both messages provide the same level of value: both tell that they expect an expression. It's not very beginner-friendly because the term "expression" is very technical. However, it's also challenging to come up with a different message in this situation, especially a synonym for "expression".

### Actionable messages

Providing actionable messages isn't something easy to do when parsing broken code, so I will focus on the analysis part of the toolchain.

What's an "actionable message"? It's a message that should explain to the user how to solve an error. Failing to provide an actionable message would risk making your user stuck, hence degrading the DX level of your toolchain.

Let's take, for example, the rule [`ESlint` `require-await`](https://eslint.org/docs/latest/rules/require-await), and let's compare it to the related [`oxlint` rule](https://oxc.rs/docs/guide/usage/linter/rules/eslint/require-await.html), and the [Biome rule](https://biomejs.dev/linter/rules/use-await/)

We will lint the following snippet:

```js
async function foo() {
    doSomething();
}
```

This is the default diagnostic that `ESLint` emits for the rule we're interested in:

```
 1:1   error  Async function 'foo' has no 'await' expression  require-await
```

The message tells the user that something is missing, particularly that the code is missing an `await` expression. Expression? Again??  

It doesn't show where this `foo` function is (maybe another reporter will show that to us), which forces us to check it inside the editor. However, the text `1:1   error` provides a link to the file, which helps.

Unfortunately, the message isn't actionable because it doesn't say how to solve the error. 


`oxlint`, a younger `ESLint`-compatible linter, takes a better approach: 

It does provide a frame of where the error occurred. Its message is actionable because it provides a tip on how the error could be solved.

```
  × eslint(require-await): Async function has no 'await' expression.
   ╭─[file:///Users/ema/www/ematipico.xyz/file.js:1:16]
 1 │ async function foo() {
   ·                ───
 2 │     doSomething();
   ╰────
  help: Consider removing the 'async' keyword.
```


Biome, too, provides a good message: 

```
 at file.js:1:1 lint/suspicious/useAwait ━━━━━━━━━━━

  ⚠ This async function lacks an await expression.
  
  > 1 │ async function foo() {
      │ ^^^^^^^^^^^^^^^^^^^^^^
  > 2 │     doSomething();
  > 3 │ }
      │ ^
  
  ℹ Remove this async modifier, or add an await expression in the function.
  
  > 1 │ async function foo() {
      │ ^^^^^^^^^^^^^^^^^^^^^^
  > 2 │     doSomething();
  > 3 │ }
      │ ^
  
  ℹ Async functions without await expressions may not need to be declared async
```

The rule also tries to explain why this is an error. It says that if you don't use any `await`, maybe the function shouldn't be `async` at all!

Have you noticed the pattern here? If you haven't, I tell you. `ESLint`, an old tool, still struggles to provide meaningful DX, while younger software such as `oxlint` and `Biome` took the feedback from years of ranting, and elevated the DX to a better quality.

## Everything, out-of-the-box?

A toolchain can have different definitions in different ecosystems; however, nowadays, we're reaching a heterogeneous definition: a toolchain should handle the lifecycle of a project.

Based on the ecosystem, users expect different tools, and we can agree the majority of them require the following (order from most important, to least important, from my point of view):
1. compiler/build/interpreter
2. editor support 
3. linter
4. formatter

Let's see how these tools are distributed.

### Fragmentation

With the evolution of coding, developers discovered that they require more tools during their day-to-day work/hobby. In the beginning, formatters weren't even a thing. Now the majority of the projects 
out there have one.

However, providing ALL these tools out of the box is a mastodontic challenge, and it has become the norm! Not just that, *sometimes* these tools are detached from the language. What does it mean? It means that, for example, linter and formatter are implemented by a different org/team of the main language.

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTd0bnFyZHdnbnN0ZXU2ZjVmZXRjNDJ1eXgyemgzbzY5YTlpMmlmYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QMHoU66sBXqqLqYvGO/giphy.gif" alt="This is fine meme">

This fragmentation is very clear in JavaScript world, where the most famous linter, `eslint`, uses its own parser and logic to provide lint rules. Same for `prettier`, which uses its own parser and logic to provide formatting.

In fact, how much time have you spent setting linter, formatter, bundler, compiler, etc. inside a modern web code base?

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3FycTBodWR3Yms4b3kwd2NjdHZ5Z3VzcmRzdDQ4dWc2NnY4Zjc4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BfiL8ZJWqfw7C/giphy.gif" alt="Community fire meme">

A different story is `deno`, which provides a formatter out-of-the-box; however, it's detached from their toolchain. In fact, their formatting is done by `dprint`.

Younger ecosystems such as [Go](https://go.dev/) and [Rust](https://rust-lang.org/) provide an all-in-one experience. Particularly, Go has its formatter baked in the source code of the language. Rust has its [`rustfmt`](https://github.com/rust-lang/rustfmt/) as part of the org, and uses the same parser of the compiler (still, it is detached from the compilation and the linting). 

### Knowledge base

Now, try to guess which tool is the most challenging to implement? You would never believe it. I am sure that some of you answered the compiler. 
Well, the thing is, since the compiler is the most important thing for a language, there's a widespread knowledge of how to implement it. There are a lot of books, blogs, videos out there that can teach us how to craft one.

You see where I am going with this? Yes, **the formatter is the most difficult piece of software to implement**. In this piece of software there are very challenging problems to solve, however, since the "formatter" is a very low-key program, there isn't much knowledge base out there. 

[Bob Nystrom](https://bsky.app/profile/stuffwithstuff.com), writer of [Crafting Interpreters](https://craftinginterpreters.com/) [wrote about it when he wrote the Dart formatter](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/). Prettier creator, Christopher Chedeau, has recently created a blog post about the birth of Prettier, and talked about the [the challenges faced](https://blog.vjeux.com/2025/javascript/birth-of-prettier.html#:~:text=Printing%20Difficulties). 

As co-creator of the Biome formatter, I can confirm that. My personal advice, if you ever want to write a formatter, is to use the Prettier + Biome architecture, which I believe works best for the majority of cases (wait for a blog post!). In fact, [Ruff](https://docs.astral.sh/ruff/) and [oxcfmt](https://oxc.rs/) use a fork of the Biome formatting infrastructure.

## Takeaways 

**Toolchains are difficult**. We have clever people working on them, but don't take them for granted. 

DX across ecosystems is slowly improving, and we are learning from past mistakes. 

It's great to see how the ecosystem is coming to an understanding, and try to meet the needs of the modern coding. **Toolchains are here to stay**.
