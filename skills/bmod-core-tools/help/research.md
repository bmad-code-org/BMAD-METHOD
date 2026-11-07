# Research with deep recon

Open this when the user asks how to get the most from `bmad-deep-recon` or which of its services to use.

## Start from the decision

Every run serves a decision: enter a market, pick a library, scope a product. Have the user state it first. When the idea itself is still loose, recommend `bmad-forge-idea` before any research.

## Which service

| Service | Recommend when |
|---|---|
| Draft: writes a prompt for the user's own deep-research tool | The user subscribes to ChatGPT, Gemini, Perplexity, or similar. It is the cheap option and often covers more public sources. |
| Process: turns a finished report into a short cited summary | The user has any report, from a tool or an analyst. Draft then Process is the usual pairing. |
| Run: researches here with parallel web searches | The user wants results in one sitting, or the research needs sources only this session can reach. It costs tokens and minutes and needs web access. |

## What to tell the user

- It can go quick or deep: a quick pass for a narrow question, a deep pass with stronger verification when the decision is costly to reverse. The user just says so.
- "Help me choose between A and B" works with any research type. It agrees the requirements first and ends with a pick, a runner-up, and the strongest argument against the pick.
- Research types cover market, domain, technical, competitive, user voice, and academic literature. A team adds its own through `bmad-customize`.
- Conclusions come only from sources retrieved during the run, with citations. The model's memory and the project's files only shape the questions. Thin evidence is reported as thin.
- A report ages. An existing run can be refreshed, which re-checks only the claims likely to be stale, or deepened in one area. When a run on the topic exists, recommend resuming it.
- The result is `research-<topic>.md`, a cited summary other skills take as input without reprocessing.

## Research on the project's own code

Recommend `bmad-deep-recon` when the user asks how something works in their code, why it is built that way, or wants the code researched before a ticket. The user just asks: the skill sees that the subject is the repository, the current one or a path they name, so there is no decision to state and no service to choose. It needs git, not web access. It is not for a quick question one file answers, and an ask as broad as "document the whole project" gets a list of narrower asks instead.

- The ask, whether a question, a ticket or a goal, becomes a short set of factual questions the user approves or edits before any research starts.
- The evidence is the code at one commit and its git history. Researchers see only the approved questions, never the goal or the ticket, so they report what the code does rather than what it should do.
- The result is one document, `research-<subject>.md` in the initiative folder, every claim cited to a line or a commit and no recommendation in it: what to change is the reader's choice.
- Decisions found in the history are offered as ADRs when they are hard to reverse, surprising without context, and the result of a real trade-off. One is written only when the user approves it, and the user commits it.
- `bmad-build` reads the document as evidence when it plans the ticket it was run for.
- Refresh and deepen do not apply: the document describes one commit, and a later ask is a new run that can follow up on it.
