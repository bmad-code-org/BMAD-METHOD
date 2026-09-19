# BMad agent persona knowledge

This document is carried by the `method` module's agent persona skills. It describes only those skills. The module's own document covers how to choose a path and how the groups relate.

## The agent personas

`bmad-agent-analyst`, `bmad-agent-architect`, `bmad-agent-dev`, `bmad-agent-pm`, and `bmad-agent-ux-designer` are conversations with a single named perspective.

No path through the `method` module needs them. The planning and delivery skills already do this work, and a persona is not a stage in any flow. Offer one only when the user asks to talk to a specific role, or wants one perspective's take without running a full skill.

Every `method` skill names `bmad-meta/method-roster.toml` under `roster` in its manifest. It gives `bmad-party-mode` these personas and the `product-team` room. A persona joins the default room only while its skill is installed.

A project environment may hold only a subset of these personas. Never present one as a required step or as a substitute for the skill that owns the work.
