# PR #830 Conversation — bmad-code-org/BMAD-METHOD

URL: https://github.com/bmad-code-org/BMAD-METHOD/pull/830
State: open

## Pull Request Body (by @jheyworth)

fix: add CommonMark-compliant markdown formatting rules

> Problem
>
> BMAD generates markdown that violates CommonMark specification... (full body preserved below)

---

### Full Body

## Problem

BMAD generates markdown that violates CommonMark specification by omitting required blank lines around lists, tables, and code blocks.

Important Discovery: While GitHub's renderer (GFM) handles this gracefully, strict parsers like Mac Markdown.app break completely, rendering lists as plain text and losing document structure.

... (full body as in PR) ...

See PR for full details: https://github.com/bmad-code-org/BMAD-METHOD/pull/830

## Issue Comments

bmadcode commented 4 minutes ago
thanks for this - the TEST.md file seems unnecessary - please remove and then this can merge @jheyworth

## Review Comments

No review comments found.

## Reviews

No reviews found.
