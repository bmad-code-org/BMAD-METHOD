# PM Brief — AI Journaling → LinkedIn (1‑page)

Slide purpose

- Quick, shareable one‑page brief for the PM to review before the meeting. Includes the demo script, current status, key decisions, risks, and next steps.

Project one-liner

- Mobile-first journaling app that converts daily text/voice entries into LinkedIn-ready posts using Whisper (transcription) and OpenAI (generation). Local-first by default; direct LinkedIn publish supported.

Current status (what we have)

- Persona & mind map captured: Senior PM at mid-size SaaS.  
- MVP scoped (text + voice capture, transcription, OpenAI-based conversion, draft editor, LinkedIn publish + fallback).  
- Sprint tickets (P0–P2) and serverless API spec prepared.  
- Sample post conversions (3 entries × 2 variants) ready for demo.

Demo script (10–15 minutes)

1. 30s — One‑line context and persona.  
2. 2 min — Capture: Quick text entry + optional voice record (20s). Show local-first saved entry.  
3. 1 min — Transcribe: upload → Whisper → show editable transcript + anonymize toggle.  
4. 2–3 min — Convert: call OpenAI → show 2 variants, hashtags, CTA. Edit variant in-line.  
5. 2 min — Publish: Direct LinkedIn publish (if connected) OR fallback: Copy & Open LinkedIn (native share).  
6. 1 min — Analytics & logs: show counters and processing consent logs.  
7. 30s — Decision checklist and next steps.

Key decisions requested from PM

- Retention default: 30 / 90 / 365 / indefinite?  
- LinkedIn publish default: opt-in (recommended) or auto‑publish?  
- Monetization: free capped usage vs paid tier at launch?  
- Consent for optional telemetry (to monitor API costs)? Yes / No

Budget & timeline (reminder)

- Budget: $5,000 for API, hosting, storage.  
- Timeline: 3 months to MVP (single operator). Prioritize P0 tickets in sprint checklist.

Top risks & mitigations

- API cost overrun — enforce quotas, use cheaper models, limit variants.  
- LinkedIn API delays — use fallback share flow; use test account for demo.  
- PII leakage — anonymize toggle, redact UI, local-first default, ephemeral audio deletion.

Immediate asks for PM meeting

1. Approve retention default and LinkedIn publish policy.  
2. Approve budget allocation and monitoring thresholds.  
3. Nominate owner for LinkedIn app registration (or approve me to register test app).  
4. Confirm preferred demo time and attendees.

Contact & attachments

- Owner: Babz (operator)  
- Attachments: `SPRINT-TICKETS.md`, `SERVERLESS-API-SPEC.md`, `PROMPT-TEMPLATES.md`, `DEMO-INSTRUCTIONS.md` (in `bmad/bmm/agents/hand-off/`)

Next step

- Run the live demo with PM and convert decisions into assigned GitHub issues from `SPRINT-TICKETS.md`.

---

(Prepared for PM review — adjust owner names and meeting time before sending.)