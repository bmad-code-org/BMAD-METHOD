# Sprint Tickets (GitHub Checklist)

Import these items as issues or checklist tasks. Hours are focused-work estimates for a single operator.

## Month 1 — Core capture + infra + audio (P0)
- [ ] T1.1 Project bootstrap & repo — 4h
  - Create Expo RN scaffold, CI skeleton, README, .env pattern.
  - Acceptance: `expo start` runs; README shows dev steps.
- [ ] T1.2 Local DB & journaling core — 20h
  - Implement Entry model, CRUD, tags, search. Offline-first confirmed.
  - Acceptance: create/edit/delete/search works offline.
- [ ] T1.3 UI: Home, New Entry, Entry Detail, Tags — 18h
  - Navigation, quick-capture FAB, tag picker.
  - Acceptance: screens wired and functional.
- [ ] T1.4 Settings & API key dev mode — 6h
  - Settings: env entry for API keys, anonymize toggle, retention chooser.
  - Acceptance: keys stored securely; toggles persist.
- [ ] T1.5 Audio capture UI & file storage — 12h
  - Record/pause/stop, preview, Transcribe button.
  - Acceptance: local audio saved and playable.
- [ ] T1.6 Serverless: signed-upload endpoint skeleton — 8h
  - Deploy serverless function to create signed upload URL.
  - Acceptance: client can upload using signed URL.
- [ ] T1.7 Integrate upload + client wiring — 8h
  - Client uploads and notifies server to start transcription.
  - Acceptance: server receives upload metadata and job enqueued.

## Month 2 — Transcription, OpenAI generation, drafts, LinkedIn (P0)
- [ ] T2.1 Whisper transcription worker (serverless) — 12h
  - Server downloads audio, calls Whisper, returns transcript and deletes audio.
  - Acceptance: transcript returned; audio removed.
- [ ] T2.2 Client transcript UI + anonymize editing — 8h
  - Edit transcript, auto-detect PII, anonymize toggle.
  - Acceptance: sanitized text shown and editable.
- [ ] T2.3 Serverless OpenAI generation proxy (/generate-post) — 12h
  - Proxy OpenAI calls, apply system prompt, return variants, log token usage.
  - Acceptance: variants returned; usage logged.
- [ ] T2.4 Client convert UI & draft editor — 10h
  - Show variants, hashtags, CTA; edit and copy/publish.
  - Acceptance: edit & publish flows functional.
- [ ] T2.5 LinkedIn OAuth & publish endpoint — 16h
  - Implement OAuth server flow; publish UGC on behalf of user.
  - Acceptance: successful post returned; tokens stored securely.
- [ ] T2.6 Fallback publish flows (client) — 6h
  - Copy-to-clipboard, native share sheet, share-offsite link.
  - Acceptance: fallback works on iOS & Android.

## Month 3 — Privacy, retention, analytics, polish (P0/P1)
- [ ] T3.1 Retention & soft-delete + purge engine — 10h
  - UI for retention; purge engine respects TTL.
  - Acceptance: soft-delete and purge verified.
- [ ] T3.2 Consent logs & processing events — 6h
  - Record per-entry processing events and consent.
  - Acceptance: logs viewable and exportable.
- [ ] T3.3 Cost controls & quotas — 8h
  - Enforce daily generation caps; show usage in UI.
  - Acceptance: quotas enforced; UI shows remaining usage.
- [ ] T3.4 Build & store prep — 12h
  - Prepare TestFlight / Play Store builds, privacy policy, screenshots.
  - Acceptance: builds uploaded; privacy policy included.
- [ ] T3.5 Buffer & polish — 12h
  - Fix critical bugs, UX polish, monitoring alerts.
  - Acceptance: no critical bugs; monitoring enabled.

## Optional / Later (P2)
- [ ] Cloud sync & encrypted backups
- [ ] Scheduled posting
- [ ] Advanced analytics & engagement estimates
- [ ] Multi-language support

---

Notes: total focused hours ~180–210. Prioritize P0 items for MVP.