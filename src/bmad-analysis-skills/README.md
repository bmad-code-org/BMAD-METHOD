# BMad Analysis

A module, at the same level as `core` and `bmm`. It ships no skills of its own — selecting it in the installer pulls in three standalone thinking skills via the `dependencies` list in `module.yaml`, the same way `bmm` declares its own standalone-skill dependencies:

- **bmad-brainstorming** — diverge and generate ideas with facilitated techniques
- **bmad-forge-idea** — pressure-test an idea until it hardens, proves out, or dies cheaply
- **bmad-party-mode** — multi-perspective roundtable discussions between agents or custom personas

The three skills live as hidden single-skill modules under `src/standalone-skills/`. They can also be installed individually; this bundle is the visible picker entry that brings them in as a set.

## Adding skills to the pack

Add the new skill as its own module under `src/standalone-skills/<name>/` (with its own `module.yaml` and `module-help.csv`, marked `hidden: true`), then append its module code to `dependencies` in this module's `module.yaml`. Queued candidates: research, prfaq.
