# Making a team's BMad follow shared rules

Open this when a lead wants every teammate's BMad to use the same rules, tools, templates, publishing targets, or paths. `bmad-customize` writes each change; this file is for choosing where a rule goes. How overrides merge is in `help/customization.md`.

## Pick the place by scope

| The rule applies to | Put it in |
|---|---|
| Every workflow one agent runs | That agent skill's team override |
| One workflow | That workflow skill's team override |
| Several workflows | One override per workflow |
| A shared path or a setup answer | Central config, `_bmad/custom/config.toml`, edited by hand |
| Every session, even with no skill active | The repository's `AGENTS.md`, kept short |

Team override files live under `_bmad/custom/` and are committed, so teammates get a change on their next pull. Personal `.user.toml` files stay out of git and win over the team file. Remind the user to commit after `bmad-customize` writes a team file.

## What a team can set

- **Standing facts.** Sentences every run must respect ("Our org is AWS-only"), or a pointer to a standards document the team already maintains, which is better than copying it.
- **Required tools.** Name the exact tool and when to call it. Teammates need that tool connected.
- **Publishing on completion.** Instructions that run once after a skill writes its output, such as posting the document to a wiki or opening a ticket. They should ask before any action teammates will see.
- **Writing standards and knowledge sources**, on the skills that expose them.
- **Templates.** Point a skill at the team's own template, kept in the repository. Start from a copy of the shipped one and keep its headings.
- **Output locations and shared paths**, pinned in central config. Pin only what the whole team must share.

Not every skill exposes every one of these. `bmad-customize` lists what a given skill allows and never invents a field.
