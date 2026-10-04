# Naming skills and modules

Read this when the user asks what to call a skill, an agent or a module, or whether to start a name with `bmad-`.

## Use a prefix of your own

Name skills after the org or module they belong to: `acme-release-notes`, `acme-agent-reviewer`, with the module record `bmod-acme`. A prefix of your own does three things. It tells custom from core BMad at a glance, in a skills folder, a `/` autocomplete list, or a session log. It keeps a module's skills sorted together, so adding, removing and updating them is one glance. And it makes observability cheap: a trace or a usage report that groups by prefix separates your skills from the ones BMad ships without any further tagging. Smithy asks for the name during discovery and proposes one with your prefix; the choice is yours.

## What `bmad-` means

`bmad-` marks a skill shipped by the bmad-code-org. Its modules name skills `bmad-<code>-<skill>` and agents `bmad-<code>-agent-<name>`, with the code left off for core (`bmad-prd`, `bmad-agent-dev`). A custom skill named `bmad-` reads as official, collides with a future core skill, and hides in listings among the ones you did not write. Use your own prefix instead.

## Modules

A module's record folder is always `bmod-<code>`; that is how `bmad` finds it, in any repo. Its skills carry the code as prefix, and its agents add `-agent-` after the code. Renaming a skill changes how it is invoked, so when packaging existing skills Smithy offers the rename and the user decides.
