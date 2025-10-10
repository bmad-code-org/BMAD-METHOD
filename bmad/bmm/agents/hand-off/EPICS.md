# Epics (Project Structure)

This file lists epics to organize sprint tickets and guide planning. Create one epic issue per section and link child tickets.

1) Epic: Capture & Local Storage
- Goal: Provide fast, offline-first journaling for text entries with tags and search.
- Child tickets: T1.1, T1.2, T1.3, T1.4
- Acceptance: Users can create/edit/delete entries offline; tags and search function; settings persist.

2) Epic: Audio & Transcription
- Goal: Capture voice, upload securely, and transcribe via Whisper while preserving privacy.
- Child tickets: T1.5, T1.6, T1.7, T2.1
- Acceptance: Audio uploads via signed URL; server transcribes via Whisper; audio deleted after TTL; transcript returned to client.

3) Epic: Generation & Drafting
- Goal: Convert sanitized entries into high-quality LinkedIn post variants using OpenAI and provide a draft editing experience.
- Child tickets: T2.3, T2.4, Prompt tuning
- Acceptance: Variants returned reliably; client shows hashtags/CTA; user can edit and save drafts.

4) Epic: Publishing & Integrations
- Goal: Provide direct LinkedIn publishing with secure OAuth and fallback share flows for demo/edge cases.
- Child tickets: T2.5, T2.6
- Acceptance: OAuth flow implemented; server posts to LinkedIn UGC API; fallback share works across platforms.

5) Epic: Privacy, Retention & Logging
- Goal: Enforce default privacy settings, retention windows, and store consent logs for auditing.
- Child tickets: T3.1, T3.2
- Acceptance: Retention settings respected; soft-delete and purge work; consent logs available and exportable.

6) Epic: Release & Ops
- Goal: Prepare builds for TestFlight/Play Store, set cost monitoring, and handle review contingencies.
- Child tickets: T3.3, T3.4, T3.5
- Acceptance: Test builds prepared; cost alerts configured; monitoring in place.


---

Next: create epic issues in GitHub and link the previously created sprint tickets as children or add labels. I can prepare GH issue bodies for epics if you want.