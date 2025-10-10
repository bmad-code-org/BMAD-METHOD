# Confirmed Decisions (PM Acceptance)

Date: 2025-10-07

The PM has accepted the analyst recommendations. Below are the recorded defaults, owners, and tentative meeting scheduling for handoff and sprint start.

## Product decisions (confirmed)

1. Retention default: 90 days (recommended)
2. LinkedIn publish default: Opt‑in (user must connect and confirm each publish)
3. Monetization at launch: Free with capped usage (introduce paid tiers after validation)
4. Aggregated telemetry for cost monitoring: Yes (anonymous, aggregated only)
5. Tone presets in MVP: 3 presets (professional, thought‑leadership, casual)

## Operational owners (assumed / assigned)
(If you want different owners, edit this file or tell me and I'll update.)

- A) LinkedIn app registration & OAuth setup — Owner: Babz
- B) Provision OpenAI/Whisper accounts & billing alerts — Owner: Babz
- C) Import sprint tickets into tracker (create GH issues from JSON) — Owner: Babz
- D) Deploy serverless stubs to staging (signed-upload, transcribe, generate, publish) — Owner: Babz

## Demo scheduling (tentative)
- Suggested demo slot (tentative): Option 2 — Tomorrow at 3:00 PM (30m)
  - If this slot doesn't work, please propose two alternatives and I'll update the invite.

## Next immediate actions (after acceptance)
1. Create GitHub issues from `SPRINT-TICKETS-ISSUES.json` and assign tickets to owners.  
2. Deploy serverless starter to staging and verify endpoints are reachable for demo.  
3. Prepare Test LinkedIn account or provide dev tokens for the publish demo.  
4. Send calendar invite to PM and attendees with `PM-SLIDE.md` and `DEMO-INSTRUCTIONS.md` attached.

If any owner assignment is incorrect, reply with changes and I'll update this file and the sprint tickets accordingly.
