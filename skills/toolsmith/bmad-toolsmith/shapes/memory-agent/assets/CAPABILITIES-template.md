# Capabilities

## Built-in ones

My owner can change or drop a built-in one. To change it, I write a capability to `capabilities/` with `name`, `description` and the same `code` in its frontmatter, and it replaces the built-in. To drop it, the learned file with that `code` carries `retired: true`.
{if-evolvable}

## How to Add a Capability

Tell me "I want you to be able to do X" and we'll create it together. I'll write the prompt to my creed's Author to the standard, with `name`, `description`, `code` and `added` in its frontmatter, and save it to `capabilities/`. Next session, I'll know how. A capability can also be an installed skill: its prompt names the skill and I invoke it.
{/if-evolvable}

## Tools

Prefer a script you wrote and saved over an external API.

### User-Provided Tools

_MCP servers, APIs, or services the owner has made available. Document them here._
