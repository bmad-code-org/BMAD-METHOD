# Product Owner Review — Professional Journaling (MVP)

Purpose
-------
This is the concise review package for the Product Owner (PO). It collects the priority decisions, acceptance criteria, demo instructions, and a short checklist the PO can use to approve the handoff and trigger the engineering sprint work.

Pre-read (please open before the meeting)
- `HANDOFF-README.md` — overview and immediate PM actions
- `SERVERLESS-API-SPEC.md` — developer API contract for signed upload / transcribe / generate / publish
- `PROMPT-TEMPLATES.md` — sample prompts and expected outputs
- `DEMO-INSTRUCTIONS.md` — step-by-step demo script
- `ARCHITECT-HANDOFF.md` — technical mapping and infra recommendations

Meeting goals (30–45 minutes)
- Confirm acceptance criteria for P0 stories (Capture, Audio/Transcription, Generation, Publish)
- Approve retention and publish policy decisions (see 'Decisions needed')
- Authorize use of test OpenAI/Whisper/LinkedIn accounts for demo and early development
- Confirm sprint priorities and owners (assign PM & engineering owner)

Decisions needed (PO action items)
1. Retention default: choose one — 30 / 90 / 365 / indefinite (default recommended: 90 days)
2. LinkedIn publish policy: opt-in only (user must enable and confirm each publish) OR opt-out (default publish enabled) — recommended: opt-in
3. Anonymization default: on/off for generation (recommended: on by default with ability to opt-out per-entry)
4. Billing guardrails: daily generation caps & limits per user (suggested: 5 variants/day per user)
5. Approve the demo account usage or provide project credentials for OpenAI/Whisper/LinkedIn

PO acceptance checklist (yes/no)
- P0 feature list is correct and complete
- Acceptance criteria for each P0 story are understood and accepted
- Security & privacy controls (consent, retention, anonymize) meet policy
- Demo steps succeed when run by PM or engineer (dev server and demo page)
- Keys/credentials are provided OR permission granted to use test accounts for demo

How to run the demo (quick)
1. Open a terminal and run:

```bash
cd bmad/bmm/agents/hand-off/serverless-starter
npm install
DEV_MODE=1 npm run dev
```

2. Open this URL in your browser while the dev server runs:
   - http://localhost:3000/demo/oauth-demo.html — quick LinkedIn OAuth & publish demo (dev-mode)
3. Follow `DEMO-INSTRUCTIONS.md` to run the full capture → transcribe → generate → publish flow. The demo uses dev-mode tokens and will not publish to a real LinkedIn account unless you provide credentials.

Acceptance criteria (draft for PO sign-off)
- Capture & Local Storage: CRUD, local search, and local export work as described in `ARCHITECT-HANDOFF.md`.
- Audio & Transcription: audio capture UI exists, signed-upload and transcription callback flow works; transcripts are editable and attached to entries.
- Generation & Drafting: serverless generation returns 2 variants per entry and respects anonymize toggle; variants are editable before publish.
- Publishing: OAuth flow (dev-mode simulated) works; publish requires explicit consent; publish history recorded.

What the PO should sign here (a checked list to attach to the sprint start)
- [ ] Approve retention default: __________________
- [ ] Approve LinkedIn publish policy: __________________
- [ ] Approve anonymization default: __________________
- [ ] Approve sprint priorities & owners
- [ ] Provide or approve credentials for demo/testing

Notes for the meeting
- Keep the meeting to 30–45 minutes. Use the demo to show the critical happy path. Save deeper infra/security discussion for the architect session.
- If the PO prefers, the demo can be run by the engineering lead prior to the meeting and recorded.

Deliverables after sign-off
- Engineering to create PRs and tasks for Sprint 0 and Sprint 1 (tickets already scaffolded in `SPRINT-TICKETS.md`)
- PM to assign owners to the sprint tickets and set milestone dates

Contact / follow-ups
- Technical owner: Babz (see `ARCHITECT-HANDOFF.md`) — can run the demo and walk through infra choices
- Attach any follow-up questions to this folder as comments or open a ticket referencing this PRD
