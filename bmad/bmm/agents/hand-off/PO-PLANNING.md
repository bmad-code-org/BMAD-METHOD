# PO Planning & Kickoff — Professional Journaling MVP

Purpose
-------
This file helps you 'load' the Product Owner (PO) into the planning process and run the initial planning/kickoff meeting. It contains the agenda, pre-reads, a prioritized decision checklist, and owner assignments so the team can create sprint tasks and begin work immediately after the meeting.

Before the meeting (owner: Tech lead / PM)
- Share this folder with the PO and the engineering lead. Ensure `PO-REVIEW.md`, `PO-INVITE.md`, and `DEMO-INSTRUCTIONS.md` are included.
- Confirm demo environment: one engineer (or Babz) will run the dev server and verify the demo page works locally.
- Optional: run `demo/run-demo.js` while `vercel dev` is running and attach `demo-output.json` to the invite.

Pre-reads for PO (must read before meeting)
- `HANDOFF-README.md` — overview and immediate PM actions
- `PO-REVIEW.md` — what you will be asked to sign off on
- `DEMO-INSTRUCTIONS.md` — demo script for the short live demo
- `ARCHITECT-HANDOFF.md` — infra notes and high-level arc

Meeting length: 45–60 minutes (recommended)

Agenda (45 minutes)
1. 5m — Context & goals recap (PM/Tech lead)
2. 15m — Live demo (happy path): capture → transcribe → generate → publish (Tech lead runs demo)
3. 10m — Review decisions needed (PO walks through `PO-REVIEW.md`) and record choices
4. 10m — Sprint planning: confirm P0 scope, owners, and immediate deliverables
5. 5m — Next steps and sign-off (PO marks acceptance checklist in PR or `PO-REVIEW.md`)

Decisions to capture (PO must pick during meeting)
- Retention default (30 / 90 / 365 / indefinite) — default recommended: 90 days
- LinkedIn publish policy (opt-in recommended)
- Anonymization default (on recommended)
- Billing guardrails (generations/day cap e.g., 5/day)
- Approve demo account usage or provide credentials

Outcome & artifacts after the meeting
- PM to assign owners to sprint tickets (Sprint 0, Sprint 1) and set milestone dates
- Tech lead to open a PR with any minor changes and attach the `PO_SIGNOFF` template for acceptance
- Record the demo output into a ticket or attach `demo-output.json` from the demo-runner

Immediate checklist (for the first sprint)
- [ ] Create RN Expo skeleton repo and link to handoff docs (owner: engineering)
- [ ] Implement local DB schema & CRUD (owner: engineering)
- [ ] Implement signed-upload & dev transcribe worker (owner: engineering)
- [ ] Implement serverless generate-post endpoint and hook into OpenAI keys (owner: engineering)
- [ ] Implement publish endpoint wiring to token store (owner: engineering)

Roles
- Product Owner (PO): decision authority on retention, publish policy, anonymization, acceptance of P0 scope
- Product Manager (PM): run the meeting, make backlog and priority decisions, assign owners
- Technical lead / Babz: run the demo, explain infra decisions, estimate implementation

Follow-ups (post-meeting)
- Add decision outcomes to `PM-DECISIONS.md` and PR the change if required
- Assign and move sprint tickets into the first milestone and label P0/P1
- Add environment/secrets to the secure provider and schedule a credentials handoff

Quick commands (dev-demo)
```bash
cd bmad/bmm/agents/hand-off/serverless-starter
npm install
DEV_MODE=1 npm run dev
# in another terminal, optionally run the demo runner:
node demo/run-demo.js
```

Use this file to brief the PO before the meeting. The meeting should end with the PO's explicit choices captured in `PM-DECISIONS.md` and the PR sign-off template applied to a GitHub PR.
