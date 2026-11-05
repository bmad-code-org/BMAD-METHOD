---
title: Document Templates
description: The templates that ship with bmad-facilitate, and which one shows each thing a template can do.
sidebar:
  order: 4
---

Use this page to find a shipped template to copy, or to see how a template does something you want. Modules ship them, each in the `doc-templates/` folder of its record in your skills folder: `bmod-method`, `bmod-founder` or `bmod-cis`.

To use one as a starting point, copy it into `_bmad/custom/facilitate-templates/`, keep or change its `template:` id, and edit the copy. [Write a Document Template](../customize/write-a-document-template.md) covers the file format.

## Shipped templates

| Template | Module | Use it for |
| --- | --- | --- |
| `decision-record` | BMad Method | Recording a choice, the alternatives and what it costs |
| `postmortem` | BMad Method | Learning from something that went wrong, without blame |
| `security-review` | BMad Method | Checking a system against the OWASP Top 10 or STRIDE |
| `proposal` | Founder | Asking for money, time or approval |
| `pitch-deck` | Founder | A talk or pitch with slides |
| `character` | Creative Intelligence Suite 0.4.0 and later | A fictional character for a story, game or campaign, on a one-page sheet |

The BMad Method also ships John's planning templates and `brd`; see [Define Requirements and a Specification](../plan/define-requirements-and-a-specification.md).

## What a template can do

| To do this | Look at | How it works |
| --- | --- | --- |
| Press the user on a thin answer | `postmortem`, Contributing factors | The section comment says when to push and what to ask |
| Make the user pick from a list | `decision-record`, Status | The section comment names the allowed values |
| Make the user pick from a source | `security-review`, Scope and system | The section comment points at the method catalog |
| Drive questions from a catalog | `security-review`, `methods-security.csv` | The `methods` frontmatter names a CSV of key questions |
| Change how a path runs | `security-review`, `stance` | The comment says what the fast path does for this document |
| Review against its own rubric | `proposal`, `rubric-proposal.md` | The `rubric` frontmatter names the file |
| Include a section only when it applies | `proposal`, Alternatives | An `include when:` section comment |
| Draw a diagram | `postmortem`, Timeline | A `diagram:` kind in the section comment |
| Add a table of contents | `proposal` | A bare `## Table of Contents` heading after the title |
| Render as slides | `pitch-deck` | `view: slides` in the frontmatter |
| Have a page written for each document | `character`, `character-sheet.html` | `view` names a starter, and a `view` comment gives the brief |
| Propose rather than only ask | `character`, `stance` | The comment invites proposals; one the user accepts is theirs |
| Write several files | `postmortem`, `companions` | The comment says when to write the customer notice and what it holds |

No shipped template adds to another. [Extend a template](../customize/write-a-document-template.md#extend-a-template) shows how.
