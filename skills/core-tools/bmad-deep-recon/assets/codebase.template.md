---
title: 'Codebase research: {subject}'
type: codebase
ask: |-
  {ask}
ticket: '{ticket ref or file; drop this line when the ask came from no ticket}'
follow_up_of: '{prior document; drop this line unless the ask follows one up}'
repository: '{repository}'
commit: '{full commit}'
branch: '{branch}'
status: draft
validation: '{validation}'
claims: {}
created: '{date}'
updated: '{date}'
---

# Codebase research: {subject}

## Questions

{the approved questions, numbered, each with its shape}

{one `## <n>. <question>` section per question, in order: the answer in prose with each claim cited inline, call stacks and file trees as indented lists, each entry a citation, and what was looked for and not found}

{`## Where the answers meet`, only when two answers pass through the same method: each such method, the questions that reach it, and the checks there that reject or throw, each line cited as its question section cites it}

{`## Open questions`, only when research stopped short or an answer opened a question the set does not hold: where, and the next ask that would continue it, as a factual question}

## Prior documents

{research documents and ADRs in reach, by title; when the ask follows one up, which one and why}

{`## Decisions found`, last and only when there is one: for each, the decision, its commit and pull request, the rationale found there, how each of the three tests is met, shown from the history, and the proposed ADR path}
