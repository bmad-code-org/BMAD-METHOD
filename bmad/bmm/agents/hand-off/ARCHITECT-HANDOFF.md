ARCHITECT HANDOFF — Professional Journaling App (MVP)

Purpose
-------
This document hands off full-stack planning to the architect for the AI-driven professional journaling MVP. It maps the six epics to system components, integration points, data models, security/privacy controls, infra choices, scalability considerations, and immediate engineering tasks.

Project constraints (reminder)
- Budget: $5,000 for infra/API costs.
- Timeline: 3 months, single developer (mobile-first).
- Required integrations: OpenAI (generation), Whisper (transcription), LinkedIn publish + OAuth.
- Privacy-first: local-first DB, opt-in cloud sync, ephemeral audio uploads, at-rest encryption for synced data.

Epic mapping & tech notes
------------------------
1) Epic: Capture & Local Storage (Issue #707)
- Components: React Native (Expo) app, local SQLite/WatermelonDB, entry model, tag model, attachments storage.
- Responsibilities:
  - Implement local DB schema; CRUD flows for entries.
  - Data export/import (user-facing).
  - Sync toggle and initial lightweight sync via Supabase or optional S3+signed-URL with user-provided token.
- Data model (core):
  - Entry: id, createdAt, updatedAt, title, text, mood, tags[], attachments[], metadata (deviceId, language), anonymized flag
  - Attachment: id, entryId, type (audio/image), uri, uploadedAt (nullable)
- Acceptance: CRUD + local search + basic list/filter by tag.

2) Epic: Audio & Transcription (Issue #708)
- Components: RN audio recorder, file store, serverless signed-upload, Whisper worker (serverless), client transcription UI.
- Responsibilities:
  - Capture short audio (<=3 min), show levels, pause/resume.
  - Securely upload audio to serverless endpoint to request transcription.
  - Transcription callback writes transcription to DB and marks entry ready for generation.
- Security: audio TTL on server (<=1hr), delete after successful transcribe, enforce consent prompt before recording.

3) Epic: Generation & Drafting (Issue #709)
- Components: serverless generation proxy (/generate-post), token controls, client draft editor, tone presets.
- Responsibilities:
  - Serverless proxy to call OpenAI (or cheaper model) with prompt templates.
  - Provide variants (short, long) and allow user edit.
  - Track token usage per user and throttle; store generation metadata only when user opts-in.
- Cost control: use smaller models for variants, limit to N generations/day per user.

4) Epic: Publishing & Integrations (Issue #710)
- Components: LinkedIn OAuth flow, publish endpoint, client fallback (share sheet), publish history model.
- Responsibilities:
  - Implement OAuth on serverless, store token encrypted (or use LinkedIn short-lived tokens; prefer server proxy for publishing).
  - Provide a preview & explicit consent step before publishing.
- Fallback: generate shareable text that opens LinkedIn app/share sheet.

5) Epic: Privacy, Retention & Logging (Issue #711)
- Components: consent logs, retention engine, soft-delete + purge jobs (serverless scheduled function), telemetry opt-in.
- Responsibilities:
  - Implement user-level retention settings (default 90 days per decision doc) and provide per-entry delete.
  - Consent logging: record when user enabled publish, transcription, or cloud-sync.
  - Audit: minimal processing logs (no PII), store only necessary metadata for billing and debugging.

6) Epic: Release & Ops (Issue #712)
- Components: cost meter, quota enforcement, CI deploy for serverless, app store build pipeline (Expo EAS), README + runbooks.
- Responsibilities:
  - Prepare release checklist, E2E QA plan, monitoring (error + usage), and an infra budget alert system.

Integration diagram (high-level)
- Client (RN) ↔ Serverless proxy (auth, signed upload, generation proxy) ↔ External APIs (OpenAI, Whisper, LinkedIn, S3)
- Local DB sync ↔ Optional cloud (Supabase or S3 + metadata store)

Infra recommendations
- Serverless: Vercel or Netlify functions for dev; production host with simple billing (Vercel with limited usage or small Heroku dyno) to keep within $5K cloud spend.
- Storage: S3-compatible (Backblaze B2 or AWS S3). Use signed URLs for upload; TTL and a serverless worker for transcription.
- Database: Local SQLite (better performance on mobile) + optional Supabase Postgres for sync (opt-in). Encrypt fields at rest for cloud sync.
- Secrets: store provider keys only on serverless; client never holds OpenAI/LinkedIn secrets.

Security & compliance
- Record explicit consent for audio recording and LinkedIn publishing before initiating any recording or publish flow.
- Implement local anonymization toggle that strips names/email patterns from text before sending to generation if enabled.
- Retention/purge: implement scheduled job to delete files and rows after retention window; keep processing logs for 30 days.

Immediate engineering tasks (first 2 sprints)
Sprint 0 (bootstrap)
- Create RN Expo repo scaffold, set up local DB schema, implement project README and dev scripts (EAS + local build).
- Wire GitHub CI for tests and release.
- Create serverless-starter templates (signed-upload, transcribe-callback, generate-post, publish-linkedin).

Sprint 1 (core)
- Implement local journaling UI: list, create, edit, tags, search.
- Local DB integration & unit tests.
- Basic settings & dev-mode API key input.

Sprint 2 (audio + transcription)
- RN audio capture UI & client upload.
- Serverless signed-upload + Whisper worker integration (test with small audio).
- Client shows transcripts and allows edit/anonymize.

Operational notes
- Rate-limit transcription/generation to avoid surprise bills.
- Keep logs minimal and rotate frequently.
- Test LinkedIn publish in a sandbox account before enabling to users.

Files & references
- Hand-off docs: `bmad/bmm/agents/hand-off/` includes PRD, USER-STORIES.md, SERVERLESS-API-SPEC.md, PROMPT-TEMPLATES.md, and this file.
- Serverless starter: `serverless-starter/` contains placeholder endpoints to copy into Vercel/Netlify.

Acceptance & sign-off
- Architect to review infra choices, deployments, and cost model and confirm adjustments.
- PM to confirm prioritization of P0 stories and owners.

