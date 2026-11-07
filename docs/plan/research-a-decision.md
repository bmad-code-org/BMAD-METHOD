---
title: 'Research a Decision'
description: 'Decision-grade research with Deep Recon: draft a prompt for your own deep-research tool, process a finished report, run the research in place, or research your own codebase.'
sidebar:
  order: 4
---

Use `bmad-deep-recon` when a planning decision should rest on evidence rather
than assumption. This page explains its three modes, how to pick between
them, and how it researches your own codebase.

## What Deep Recon Is

Run `bmad-deep-recon` when you have a decision: enter a market or skip it,
pick a stack, choose a vendor, commit to a domain. The decision shapes which
questions get asked, which sources count, and what the final report
recommends. It is not only for software. Any decision that should rest on
evidence is in scope.

Completed research, whether Deep Recon ran it or processed a report from
elsewhere, ends as a cited `research-<topic>.md` that a PRD or product brief can read
without reprocessing the original. Draft mode produces only a research prompt
for you to run in another tool; the report comes when you bring the result
back through Process. See
[Define Requirements and a Specification](./define-requirements-and-a-specification.md)
for where it goes next.

## Research Types

A type is a set of questions, source rules, and freshness windows that makes
the research sharper than an unaided prompt. Deep Recon infers the type from
your ask, or you name it.

| Type           | Reach for it when                                                            |
| -------------- | ---------------------------------------------------------------------------- |
| `market`       | Sizing an opportunity, segments, pricing, go-to-market                       |
| `domain`       | Learning an industry or field: structure, players, rules, vocabulary         |
| `technical`    | Evaluating a technology area, integration approaches, implementation reality |
| `competitive`  | Tearing down named competitors: offers, pricing, trajectory, sentiment       |
| `user-voice`   | What users actually experience and want: reviews, communities                |
| `academic-lit` | Literature review, state of the art, grounding an approach in papers         |

**Explore** (the default) builds understanding. **Select** runs a structured
choose-between when you are picking among candidates. You can add your own
types through [bmad-customize](../customize/customize-bmad.md).

## The Three Modes

| Mode        | What happens                                                                                    | You provide                                         |
| ----------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Draft**   | Deep Recon writes a research prompt for the type; you run it in your own tool                   | One paste into ChatGPT, Gemini, Grok, or Perplexity |
| **Process** | A finished report is filed, its claims checked against the type, and a standard summary written | The report, from any source                         |
| **Run**     | Deep Recon does the research here: search, verification, cited synthesis                        | Approval at one plan gate                           |

**Draft** exists because most people already pay for a deep-research tool, and
those products crawl widely. The prompt carries the type's questions, recency
rules, and a citation demand, tuned to the tool you name.

**Process** closes the loop. Point it at any finished report (the one your tool
just produced, an analyst PDF, a colleague's document). It leaves the original
untouched, pulls out every claim that bears on your decision, flags what the
material never covered, and writes the same summary a native run would. Draft
then Process is the usual pairing.

**Run** stays in your session. There is no round-trip, the framing is
project-aware, and you control how much effort it spends: `quick`, `standard`
(the default), or `deep` sets how many assistants, sources, and rounds it
uses, and `normal`, `high`, or `max` verification sets how many claims it
cross-checks. Anything you say in the request overrides the preset.

## Which Mode to Use

| Situation                                                                  | Use                                             |
| -------------------------------------------------------------------------- | ----------------------------------------------- |
| You subscribe to a deep-research tool and don't mind one manual round-trip | Draft, then Process                             |
| You already have a report, whatever produced it                            | Process                                         |
| You want results now, in one sitting, no app switching                     | Run                                             |
| The research needs internal sources or tools only your session can reach   | Run                                             |
| Broad public sweep first, targeted follow-up after                         | Draft + Process, then a focused Run on the gaps |

Draft uses a subscription you already pay for and usually covers more public
sources. Run costs time and tokens in this session, but it can use every tool
your project has. When you ask for research with no verb, Deep Recon states
this trade once and remembers your preference for the session.

A Run asks you to approve a plan (the decision, the questions, the effort, and
a time estimate) and then proceeds. Claims in the report come from sources
retrieved during this engagement, not from the model's memory. Your project
files shape what gets asked, not what gets found. Every claim carries its
publisher, publication date, and an inline citation, and a figure past its
freshness window is reported as history, not fact.

## Keep Research Current

Each run gets a `research-<topic>/` folder in the active initiative's folder, or in the output folder when no initiative is active:
the original imports, the extracted notes, and `research-<topic>.md`. The report names which claims age
fastest. **Refresh** re-checks only those claims and records what changed.
**Deepen** drills into one area without re-running the rest.

## Research the Codebase

Deep Recon also researches the repository you work in, from its code and git
history. Use it on an existing codebase before a build that depends on code
you do not know well, or when you need to know why something is built the way
it is. Ask a question, name a ticket, or state a goal. It needs no decision
and skips the mode choice.

Your ask first becomes a short set of factual questions that state no intent:
"how does a job run end?", not "where would cancellation go?". Deep Recon
shows them with the commit it will read, and nothing runs until you approve
them; you can edit them first. The researchers see only those questions, never
your goal or the ticket, so they report what the code does rather than what it
should do. An ask too broad for one short document, such as documenting the
whole project, gets a list of narrower asks to run instead.

The result is one short document. Each question gets an answer with every
claim cited to a file and line at that commit, or to a commit in the history,
and a note of what was looked for and not found. The claims the answers rest
on are re-checked against the code before the document closes. It holds no
summary, recommendation, or proposed change: those choices are yours.

For a question that asks why, it also reads the git history: the commits and
pull requests that brought the code in, and the reasons given there. When the
history shows a decision that is hard to reverse, surprising without context,
and the result of a real trade-off, and no existing decision record covers it,
Deep Recon proposes a new decision record (ADR) and asks you about it. An
approved one is written beside the code it governs, and you commit it.

The document lands in the active initiative's folder like any other research,
and research started from a ticket file adds it to that ticket's References.
`bmad-build` reads it as evidence. Before a claim goes into its plan, the
build re-checks it against the current code when the plan rests on it or its
file changed since the research commit. The document describes that one
commit; for a later state of the code, ask again.

## Starting It

| Goal                         | Type this                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| Research something           | `/bmad-deep-recon` then describe the decision, or just "research the self-hosted analytics market" |
| Force a type                 | "competitive research on Linear and Height"                                                        |
| Draft a prompt for your tool | "draft a deep research prompt about X for Gemini"                                                  |
| Process a report             | "there's a research report at ~/Downloads/report.pdf, process it"                                  |
| Choose between options       | "help me choose between Postgres and MySQL for this"                                               |
| Refresh an existing report   | "refresh the market research"                                                                      |
| Ask how your code works      | "research how session persistence works in this repo"                                                 |
| Research code for a ticket   | "research the codebase for ticket 2.3"                                                             |
| Ask why code is this way     | "why is eviction one-way here"                                                                     |
| Customize defaults           | `/bmad-customize bmad-deep-recon`                                                                  |

The v6 `bmad-market-research`, `bmad-domain-research`, and
`bmad-technical-research` skills merged into Deep Recon as the `market`,
`domain`, and `technical` types; the old names still forward here.
