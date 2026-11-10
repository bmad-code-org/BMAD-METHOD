# Founder knowledge

This document covers the `founder` module: when to recommend it and where to send the user.

## How the module works

Founder is for the business side of starting and running something, from a person with only an idea to a funded team, and small businesses that will never raise. It belongs in the folder where the business is planned, such as a notes vault, not a code repository.

Everything runs through one agent, **Nadia the Founder Advisor** (`bmad-founder-agent-advisor`), reached by name: "Nadia", "the founder advisor", "the startup advisor", "the advisor". She coaches the module's templates in `bmad-facilitate`, runs the money math with a bundled script rather than estimating it, and keeps everything she learns in a business record folder in the project (`help/business-record.md`). For any founder question, recommend her; she picks the piece from what the user says.

## More detail

Read a topic file only when the question is about that subject, using the path the knowledge script lists for it.

| Topic file | Read when the user asks about |
|---|---|
| `help/idea-and-customers.md` | Whether an idea is any good, customers, interviews, testing demand, positioning. |
| `help/money.md` | Runway, quitting a job, pricing, unit economics, market size, dilution, a financial model. |
| `help/raising.md` | Investors, grants, bids, accelerators, the deck, outreach, term sheets, practicing a pitch. |
| `help/running-the-company.md` | Investor updates, boards, hiring, co-founders, quarterly plans, launches, hard calls. |
| `help/business-record.md` | Where Nadia keeps what she knows, vaults, privacy. |

## Match the situation

| The user says or has | Recommend |
|---|---|
| "I have an idea", "is this any good" | Nadia with `startup-diagnostic`; `bmad-forge-idea` when they want several personas to pick at it. |
| "Should I quit my job", "raise or bootstrap", "should we pivot" | Nadia, Decide. |
| "How long is my runway", "what does this round do to my ownership" | Nadia, Numbers. |
| "Practice my pitch", "like Shark Tank" | Nadia's pitch room. |
| "I got a term sheet" | Nadia, Terms; she is not a lawyer and says so. |
