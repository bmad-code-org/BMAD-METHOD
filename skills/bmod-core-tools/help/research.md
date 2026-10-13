# Research with deep recon

Open this when the user asks how to get the most from `bmad-deep-recon` or which of its services to use.

## Start from the decision

Every run serves a decision: enter a market, pick a library, scope a product. Have the user state it first. A vague question gives vague research, so when the idea itself is still loose, recommend `bmad-forge-idea` first.

## Which service

| Service | Recommend when |
|---|---|
| Draft: writes a prompt for the user's own deep-research tool | The user subscribes to ChatGPT, Gemini, Perplexity, or similar. It is the cheap option and often covers more public sources. |
| Process: turns a finished report into a short cited summary | The user has any report, from a tool or an analyst. Draft then Process is the usual pairing. |
| Run: researches here with parallel web searches | The user wants results in one sitting, or the research needs sources only this session can reach. It costs tokens and minutes and needs web access. |

## What to tell the user

- It can go quick or deep. Suggest a quick pass for a narrow question, and a deep pass with stronger verification when the decision is costly to reverse. The user just says so.
- "Help me choose between A and B" is supported for any research type. It agrees the requirements first and ends with a pick, a runner-up, and the strongest argument against the pick.
- Research types cover market, domain, technical, competitive, user voice, and academic literature. A team can add its own through `bmad-customize`.
- Conclusions come only from sources retrieved during the run, with citations. The model's memory and the project's files only shape the questions. Thin evidence is reported as thin.
- A report ages. An existing run can be refreshed, which re-checks only the claims most likely to be stale, or deepened in one area. When a run on the topic already exists, recommend resuming it.
- The result is `research-<topic>.md`, a cited summary other skills can take as input without reprocessing.

## Research on the project's own code

Recommend `bmad-deep-recon` when the user asks how something works in their code, why it is built that way, or wants the code researched before a ticket. The user just asks: it sees that the subject is the repository, so there is no decision to state and no service to choose. It is not for a quick question one file answers, and an ask as broad as "document the whole project" gets a list of narrower asks instead.

- The ask, whether a question, a ticket or a goal, becomes a short set of factual questions. The user approves or edits them before any research starts.
- The code at one commit and its git history are the evidence. Researchers see only the approved questions, never the goal or the ticket, so they report what the code does rather than what it should do.
- The result is one document, `research-<subject>.md` in the initiative folder, with every claim cited to a line or a commit. It makes no recommendation: what to change is the reader's choice.
- Decisions found in the history are offered as ADRs when they are hard to reverse, surprising without context, and the result of a real trade-off. Each is written only when the user approves it, and the user commits it.
- `bmad-build` reads the document as evidence. It re-checks against the current code each claim its plan rests on, and each claim whose file changed since the research. When the ask came from a ticket file, the document is added to that file's References, which the build reads.
- The document describes one commit. A later ask starts a new run, which can follow up on the earlier document.
