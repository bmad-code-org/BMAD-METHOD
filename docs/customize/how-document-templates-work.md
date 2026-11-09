---
title: 'How Document Templates Work'
description: Where the documents John, Mary and bmad-facilitate write come from, and the three ways a team changes one.
sidebar:
  order: 5
---

Every document John (`bmad-agent-pm`) and Mary (`bmad-agent-analyst`) write runs through one skill, `bmad-facilitate`, and one markdown template per document type. The template is the whole definition of the document: its sections, what the coach asks for each one, when it pushes back, and what the review checks. To change a document, you change its template, never the skill.

## A Template Is Facilitation Instructions

A template's headings are the document's sections. Its comments tell the coach how to work:

| Comment | Says |
| --- | --- |
| `purpose`, `stance` | What the document is for and how the coach behaves, such as "a challenge, not a write-up" |
| `inputs` | What only the user knows, so it is always asked and never guessed |
| `writing`, `done when` | Rules for the text, and the test that ends the questioning |
| Under a heading | Where the section goes, what to ask, when to press, and whether it is required |

The user never sees the template. They have a conversation, and the comments shape it.

## Where Templates Come From

The skill searches these places in order, and for each id the first template found wins:

1. Your project's `_bmad/custom/facilitate-templates/` folder, committed so the whole team gets it.
2. Your personal `~/.bmad/facilitate-templates/` folder, for every project you work in.
3. Any other library your team adds to `template_libraries`, such as a folder or GitHub repository your organization keeps.
4. The agent's own templates, such as John's PRD.
5. Each installed module's `doc-templates/` folder.

## Three Ways to Change a Document

| You want | Do this | Updates to the original |
| --- | --- | --- |
| The same document with your rules: a section added, one replaced or removed, a question always asked, HTML by default | An **extension**: a file with `extends: prd` holding only your changes | Still arrive |
| The same document rebuilt for everyone in the project | A **replacement**: a copy with the same id, `template: prd` | Stop |
| A different document beside the original, such as a PRD for one department | A **new template**: a copy with a new id, `template: prd-billing` | Stop |

Start with an extension. Move to a copy only when your changes outgrow it, because a copy no longer receives the fixes and improvements to the template it came from. The test is how much of the original you still want: if most of it, extend; if your team needs a different shape, make a new template and leave the original for everyone else.

## What a Run Reads

When a run starts, the skill merges the template and every extension of it into one file and works from that file alone, the extensions first so their rules win. It saves the file as `.template.md` in the run folder, beside the document, so you can always see exactly what the coach read.

Settings that cover every document, such as doc standards, reviewers, where output goes and whether HTML views are made, live in `_bmad/custom/bmad-facilitate.toml` instead of a template.

You do not need to know any of this to make a change. Tell `bmad-customize` what you want, such as "every PRD needs a support readiness section", and it decides between an extension, a copy and a setting, writes the file and shows you the merged result. [Customize a Document for Your Team](./customize-a-document-for-your-team.md) walks through all three ways with a real example, [Write a Document Template](./write-a-document-template.md) covers the file format in full, and [Document Templates](../reference/document-templates.md) lists the shipped templates.
