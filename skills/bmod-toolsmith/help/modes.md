# Working on a skill that exists

Read this when the user has a skill, prompt or module already and wants something done to it. A mode starts from an existing skill. Convert and migrate end in a build; edit may change the shape; the rest leave the skill as it is. Every mode that writes files ends in the same ship step as a build.

| Mode | What the user gets | The phrase that reaches it |
|---|---|---|
| Edit | Smithy reads the skill, agrees the change with the user, applies it, and keeps the shape unless the change needs another. | "Change", "fix", "extend", "add a step to", "make it smaller". |
| Convert | A skill, prompt, rule or command from another tool or format, rebuilt as a BMad skill in the right shape, with what did not carry over listed. A skill that already exists can instead be brought to BMad in place, as a single-skill module when the user wants one. | "Convert my Cursor rule", "turn my GPT into a skill", "port this slash command", "make this prompt a skill", "make this skill work with bmad". |
| Review | A list of findings, in chat and as a markdown file in the reports folder: pre-pass measurements, then five lenses (architecture, determinism, leanness, customization, trigger) read by parallel reviewers, each finding with where it is and its fix. Nothing fails; the user decides what to act on. | "Review this skill", "is this any good", "analyze it", "how could it be leaner". |
| Package | One skill or several wrapped as a module: a single-skill module when it is one, a multi-skill module with roster and help when it is several. | "Package these", "make this a module", "ship these together". |
| Validate | The checks that gate a skill: manifests, file references, frontmatter, and a trigger eval when a case suite exists. Pass or fail, with each failure named. An old-format module (`module.yaml`, a setup skill, a help CSV) fails and names migrate as the fix. | "Validate", "check my skill", "is this a valid bmod". |
| Migrate | An old-format module converted in place to a bmod: the record folder, roster from its agents, help from its CSV, a `bmod.toml` per skill, a retired list for the names that went. Smithy shows the conversion plan and waits for approval, lists what it could not convert, removes the old files, then validates and ships. | "I have an old module", `module.yaml`, "my setup skill", "move my module to the new format". |

After a review, offer edit mode for the findings the user accepts. After a migration, offer `bmad setup` for the module, since its configuration questions may have changed.
