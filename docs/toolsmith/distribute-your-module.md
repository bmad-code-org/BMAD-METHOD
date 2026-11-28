---
title: 'Distribute Your Module'
description: 'Publish a module from a Git repository so others can install it with the Skills CLI, set it up with bmad, and receive updates.'
sidebar:
  order: 11
---

Use Smithy's package mode and a Git repository to publish a module that anyone can add with `npx skills add`. There is no separate build step or required publishing portal.

## When to Use This

- You have a skill or module ready to share with a team or the public
- You want `bmad` to check the repository for newer releases
- Multiple projects should install the same versioned skills

## When to Skip This

- The skill belongs only to one project; keep it inside that project
- The skill is still changing rapidly; stabilize and test it locally first

:::note[Prerequisites]
- A finished skill or set of skills
- A Git repository
- Toolsmith installed
:::

## Steps

### 1. Package the Skills

Ask Smithy to package your skills if they are not registered as a module yet; see [Package](modes.md#package).

If the module does not yet have an `update_source`, Smithy asks for it. Update checks read that address (typically `github:<owner>/<repo>/<path>`, where `<path>` is the folder holding your skill folders such as `skills`) from your `main` branch. Every member skill's `source` must match its module record's `update_source`.

### 2. Lay Out the Repository

Keep your skill folders under `skills/`. A multi-skill module layout looks like this:

```text
your-repo/
├── skills/
│   ├── bmod-acme/
│   │   ├── SKILL.md
│   │   ├── bmod.toml
│   │   ├── help/
│   │   │   └── help.md
│   │   └── roster.toml
│   ├── acme-release-notes/
│   │   ├── SKILL.md
│   │   └── bmod.toml
│   └── acme-agent-scout/
│       ├── SKILL.md
│       ├── customize.toml
│       └── bmod.toml
├── README.md
└── LICENSE
```

A single-skill module sits as one folder under `skills/` with its `help/` folder inside and no separate `bmod-<code>` folder. One repository can also ship several modules by giving each module its own subfolder (`skills/<code>/`) and pointing its `update_source` there, so users can install a single module with `npx skills add owner/repo/skills/<code> --skill '*'`. When a repository hosts multiple modules, keep every module record on the same release version and give every skill folder its own `bmod.toml` so manifest validation passes cleanly (see [Module Files](../reference/module-files.md)).

### 3. Validate

Ask Smithy to validate the repository. He checks every skill and verifies all module manifests and version alignment across the repo, reporting anything to fix before you publish. See [Validate](modes.md#validate).

### 4. Test a Local Install

Install the module from its local path into a separate test project, then ask `bmad` to run `bmad setup <code>` and `bmad status`. Confirm the module version registers cleanly, its setup questions read clearly, and `bmad` recommends the skills as intended.

```bash
npx skills add ./path/to/your-repo --skill '*'
```

### 5. Publish

Push to your Git host and tag the release. Give users the install command and remind them to run setup afterward:

```bash
npx skills add your-org/your-repo --skill '*'
```

Then users ask `bmad` to run `bmad setup acme`, or pin a specific tag with `your-org/your-repo#v1.2.0`. See [Add Modules](../customize/add-modules.md).

You are not tied to GitHub: `npx skills add` accepts any Git URL. For non-GitHub hosts, set `update_source` to the `https://` URL serving raw files from the folder holding your skills. Public GitHub repositories appear on [skills.sh](https://skills.sh/) once users install them with the Skills CLI. A module distributed inside a plugin sets `update_source = "plugin:<name>"` so updates flow through that plugin's marketplace.

### 6. Ship Updates

- Bump `version` in the record for every release, because `bmad setup` compares installed and remote versions to offer updates.
- When adding skills, add each new skill to `skills` in `bmod.toml`, add an entry to `help/help.md`, and add an entry to `roster.toml` if it is an agent.
- Track renames and removals in `retired.toml` so `bmad setup` offers to delete retired skills and migrates custom overrides to the new name automatically, and never reuse a retired skill name.
- When user files must change on upgrade, place a `migration-<n>.toml` beside `bmod.toml` so `bmad migrate` handles the transition.

## What You Get

- A module anyone with repository access can install via `npx skills add`
- Project setup questions asked once per project with answers persisted locally
- Automatic discovery and recommendations through the `bmad` skill
- Remote version checks against your Git source
- Clean cleanup and override migration for renamed or removed skills

## Tips

- Include a clear `README.md` explaining what the module does, how to install it, and any external CLI prerequisites.
- Add a `LICENSE` file.
- Use `pre_install_message` for breaking notes users should read before updating, and `post_install_message` for short next-step instructions shown after setup.
- Declare cross-repository dependencies in `required_skills` with `source` and an optional minimum `version`.
- Run a [baseline eval](bmad-eval.md) before publishing so you know the skill genuinely beats the bare model on real tasks.
