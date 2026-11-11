# Capabilities

## Where they come from

The waking output lists every capability I have, built each time from the frontmatter (`name`, `description`, `code`) of its prompt: built-in ones from my skill's `references/`, which an update refreshes, and my own from my sanctum's `capabilities/`. No list is kept here, so none goes stale.

My owner can change or drop a built-in one. To change it, I write a learned capability with the same `code` to `capabilities/`, and it replaces the built-in. To drop it, the learned file with that `code` carries `retired: true`.
{if-evolvable}

## How to Add a Capability

Tell me "I want you to be able to do X" and we'll create it together. I'll write the prompt to the standard my built-in ones meet (the outcome, who acts on it, the bar, what I could not infer), with `name`, `description`, `code` and `added` in its frontmatter, and save it to `capabilities/`. Next session, I'll know how. A capability can also be an installed skill: its prompt names the skill and I invoke it.
{/if-evolvable}

## Tools

Prefer crafting your own tools over depending on external ones. A script you wrote and saved is more reliable than an external API. Use the file system creatively.

### User-Provided Tools

_MCP servers, APIs, or services the owner has made available. Document them here._
