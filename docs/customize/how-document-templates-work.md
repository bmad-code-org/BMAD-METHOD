---
title: 'How Document Templates Work'
description: Where the documents BMad agents and bmad-facilitate write come from, and the three ways a team changes one.
sidebar:
  order: 5
---

Every structured document across BMad Method ([Mary](../agents/mary-analyst.md), [John](../agents/john-pm.md), [Sally](../agents/sally-ux-designer.md), [Winston](../agents/winston-architect.md)), [Founder](../founder/founder.md) (Nadia), and [Creative](../creative/creative.md) (Clio) runs through one shared skill, `bmad-facilitate`, and one markdown template per document type. The template defines the entire document: its sections, what the coach asks for each section, when it pushes back, and what the review checks. To change a document, you change or extend its template rather than editing any skill.

:::note[Which Template Guide Should You Read?]
This page explains how templates fit together. For a hands-on walkthrough changing John's PRD for a team, follow [Customize a Document for Your Team](./customize-a-document-for-your-team.md). When you are ready to author or hand-edit a template file, see [Write a Document Template](./write-a-document-template.md). To browse every shipped template, see [Document Templates](../reference/document-templates.md).
:::

## A Template Is Facilitation Instructions

A template's headings define the document's sections, and its HTML comments instruct the coach on how to guide the conversation:

| Comment | What it controls |
| --- | --- |
| `purpose`, `stance` | What the document is for and how the coach behaves (for example, "a challenge, not a write-up") |
| `inputs` | Facts only the user knows, so the coach always asks rather than guessing |
| `writing`, `done when` | Writing rules for the document and the test that ends questioning |
| Section comments | Where the section goes, what to ask, when to push back, and whether it is required |

Readers never see the template comments. They have a conversation, and the comments shape every question and review check.

## Where Templates Come From

`bmad-facilitate` searches these locations in order, and for each template id the first match wins:

1. Your project's `_bmad/custom/facilitate-templates/` folder, committed so the whole team inherits it.
2. Your personal `~/.bmad/facilitate-templates/` folder, applied across every project you work in.
3. Any extra library your team adds to `template_libraries`, such as a shared folder or GitHub repository.
4. Any library passed by the agent you invoked.
5. Each installed module's `doc-templates/` folder, where the shipped templates live.

## Three Ways to Change a Document

| What you want | Approach | Do updates to the original still arrive? |
| --- | --- | --- |
| Keep the shipped document and add your rules (extra sections, required questions, HTML by default) | **Extension:** a file with `extends: prd` containing only your additions or changes | Yes |
| Rebuild the same document structure for everyone in the project | **Replacement:** a copy keeping the same id (`template: prd`) | No |
| Offer a separate document beside the original (for example, a billing PRD) | **New template:** a copy or new file with its own id (`template: prd-billing`) | No |

Start with an extension. Switch to a copy only when your changes outgrow an extension, because a copy no longer receives improvements to the original template. If you want most of the original, extend it; if one team needs a different shape altogether, create a new template and leave the original untouched for everyone else.

## What a Run Reads

When a run starts, `bmad-facilitate` merges the base template with every matching extension into one file, placing extensions first so their rules win, and works from that merged file alongside any referenced guidance or method catalogs. To inspect exactly what the coach reads, ask `bmad-customize` to show the merged template.

Settings that apply across every document (editorial standards, reviewers, output folder pattern, default mode, visuals, HTML view defaults, and an optional personal voice guide) are configured through `bmad-customize` on `bmad-facilitate` instead of inside individual templates. A project's shared brand or design system for HTML outputs is configured during `bmad setup`.

You do not need to memorize this layout to make a change. Tell `bmad-customize` what you want (for example, "every PRD needs a support readiness section"), and it chooses between an extension, a replacement, or a workflow setting, writes the file, and shows you the merged result.
