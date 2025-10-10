# Handoff: Professional Journaling → LinkedIn Posts (AI-driven MVP)

Purpose

This package bundles the recommended decisions, sprint checklist, API contract, prompt templates, and demo steps to hand off to the Product Manager and engineering lead for execution.

Primary goals

- Deliver a mobile-first (iOS/Android) app that captures text + voice and converts journal entries into LinkedIn-ready posts using Whisper (transcription) and OpenAI (generation).
- Privacy-first: local-first default, opt-in cloud sync, anonymize/redaction before external processing.
- Direct LinkedIn publish supported; fallback share flows available for demos or pending review.

Files included in this handoff (this folder)

- `SPRINT-TICKETS.md` — GitHub-style checklist of sprint tickets (Month 1–3) with acceptance criteria and rough hours. (Action: import as issues)
- `SERVERLESS-API-SPEC.md` — Developer-ready serverless endpoints and sample payloads for Signed Upload, Transcribe, Generate, Publish, Usage.
- `PROMPT-TEMPLATES.md` — System + user prompts, model parameters, anonymize guidance, and sample payloads used in the demos.
- `DEMO-INSTRUCTIONS.md` — Step-by-step demo script (capture → transcribe → convert → publish) and fallback flows, plus sample entries & outputs.
- `PM-DECISIONS.md` — Key decisions requested from PM and recommended defaults.

How to use

1. Share this folder with the PM and engineering lead before the review meeting.  
2. Import `SPRINT-TICKETS.md` into your issue tracker as checkable tasks for sprints.  
3. Give the engineering lead access to server env vars for OpenAI, Whisper, LinkedIn before implementing serverless endpoints.  
4. Use `DEMO-INSTRUCTIONS.md` to run a live demo with a test LinkedIn account and show fallback flow during review.

Quick contacts / owners

- Product owner: <PM name — to be filled by you>  
- Technical owner / implementer: Babz (operator)  

Immediate next actions for PM (recommendations)

1. Confirm retention default (30 / 90 / 365 / indefinite).  
2. Confirm LinkedIn publish policy (opt-in vs default).  
3. Approve the sprint tickets and assign priorities/owners.  
4. Provide or approve the OpenAI/Whisper/LinkedIn accounts to be used for development and demo (or approve me to use test accounts).  

Attach this folder to your meeting invite and request the PM to review `PM-DECISIONS.md` before the call.

---

Created for handoff by the Business Analyst session.