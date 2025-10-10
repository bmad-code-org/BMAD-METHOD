# PRD: AI Journaling → LinkedIn Posts (Mobile-first MVP)

Version: 2025-10-07
Author: Business Analyst (Mary)

## Purpose
Provide a clear product requirements document for an AI-driven mobile-first journaling app that helps professionals capture text and voice entries, transcribe audio, and convert entries into LinkedIn-ready posts using OpenAI. The product is privacy-first (local-first default), integrates with Whisper for transcription and LinkedIn for publishing, and is designed to be built by a single operator with $5k for API/infra costs over a 3-month MVP timeline.

## Scope
MVP includes:
- Local-first journaling (text), tags, search, offline support
- Audio recording and Whisper transcription (basic pipeline)
- OpenAI-driven post generation with 3 tone presets (professional, thought‑leadership, casual)
- Draft editor with redaction/anonymize toggle
- LinkedIn OAuth + publish endpoint; fallback share flow for demos
- Basic analytics: entries, conversions, publish counts
- Privacy & retention settings (default: 90 days) and consent logs

Out of scope (MVP):
- Full cloud sync by default (opt-in only)
- Advanced analytics/engagement metrics
- Scheduled posting, multi-language support

## Success metrics (for MVP validation)
- Product usage: 100 active users generating 1–3 posts/week within 1 month of launch
- Cost control: Average generation + transcription cost ≤ $0.50 per active user per week
- Retention: At least 25% of users use the app weekly after 30 days
- Time to post: From entry capture to publish ≤ 5 minutes (happy path)
- Privacy: No raw audio retained server-side beyond TTL; users can export and delete data

## Personas
Primary
- Senior Product Manager at a mid-size SaaS company. Busy, wants to turn daily learnings into LinkedIn posts to build credibility.

Secondary
- Individual contributors (engineers/designers) who want to document wins and publicize insights.
- Consultants/freelancers who want to showcase work and build networks.

## User Journeys
1. Quick Text Capture
- User opens app → taps + → writes a short entry → tags → saves locally.
- User taps Convert → selects tone → app generates variants → user edits → Publish (LinkedIn or fallback).

2. Voice Capture → Transcribe → Convert
- User records audio (20–60s) → uploads via signed URL → Whisper transcribes → client displays transcript → user edits/anonymizes → Convert → Publish.

3. Search & Reuse
- User searches by tag/date → selects past entry → converts/adapts → publish or schedule.

4. Privacy Flow
- Default: everything stored locally. For cloud features, user explicitly opts-in and gives consent. Processing to OpenAI/Whisper occurs only after user confirms.

## Functional Requirements
- FR1: Create/Edit/Delete journal entries locally (offline-first). (MUST)
- FR2: Tagging and full-text search across entries. (MUST)
- FR3: Audio recording with playback & file persist. (MUST)
- FR4: Signed upload flow for audio and serverless transcription job (Whisper). (MUST)
- FR5: OpenAI proxy endpoint to generate 1–3 post variants with hashtags and CTA. (MUST)
- FR6: Draft editor with inline edit and redaction, anonymize toggle. (MUST)
- FR7: LinkedIn OAuth + UGC publish endpoint + fallback share flow. (MUST)
- FR8: Settings for retention (default=90 days), anonymize behavior, telemetry opt-in. (MUST)
- FR9: Processing logs (transcribe/generate/publish) and consent records. (MUST)

## Non-functional Requirements
- NFR1: End-to-end TLS for all network traffic. (MUST)
- NFR2: Raw audio deleted from server storage within TTL ≤ 1 hour. (MUST)
- NFR3: At-rest encryption for optional cloud sync. (MUST if cloud sync enabled)
- NFR4: Scalable serverless functions with rate-limiting and quota enforcement. (MUST)
- NFR5: Token and cost monitoring with alerts (monthly & per-day). (MUST)
- NFR6: Client works offline; queue jobs for transcription when online. (MUST)

## Data model (simplified)
- Entry
  - id, user_id, text, tags[], created_at, updated_at, status (draft/published), audio_ref (optional), transcription_id
- Transcript
  - id, entry_id, text, language, confidence, created_at
- Variant
  - id, entry_id, text, hashtags[], tone, created_at
- PublishEvent
  - id, entry_id, variant_id, provider, provider_id, status, timestamp
- ConsentLog
  - id, user_id, action (transcribe/generate/publish), timestamp, consent_given

## API summary (serverless)
Refer to `SERVERLESS-API-SPEC.md` for endpoints. Key endpoints:
- /api/signed-upload (POST)
- /api/transcribe/start (POST)
- /api/transcribe/callback (internal)
- /api/generate-post (POST)
- /api/publish-linkedin (POST)
- /api/usage (GET)

## Privacy & Legal
- Store minimal personal data and only with explicit consent for cloud sync or publish actions.
- Provide export (JSON/MD) and account delete routes. Ensure backups respect retention rules.
- Provide clear privacy policy in app and during onboarding.

## Constraints & Assumptions
- Single operator builds/operates app; $5k budget for APIs & hosting. Use low-cost models and limit variants to control spending.
- LinkedIn API access may require app review; implement fallback share flow for MVP.

## Timeline & Milestones
- M0: Prepare dev accounts, serverless skeleton (1 week)
- M1: Core journaling + audio + signed upload (weeks 1–4)
- M2: Transcription + generation + LinkedIn integration (weeks 5–8)
- M3: Privacy, retention, testing & store prep (weeks 9–12)

## Acceptance Criteria (overall)
- All P0 FRs implemented and demoable in staging with sample LinkedIn publish (or fallback).  
- Processing logs and retention settings work as specified.  
- Cost per active user remains within estimated budget after 30 days of sample usage.

## Open questions
- Monetization specifics for paid tiers and pricing (deferred until validation).  
- Full cloud sync encryption approach for production-grade privacy (need architect input).


---

Document created for handoff and PRD review. Update owners and timelines as needed.