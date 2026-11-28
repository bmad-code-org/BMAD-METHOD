---
title: "Patient Check-in Epic PRD"
template: prd-epic
status: final
created: "2026-11-22"
updated: "2026-11-24"
---

# Patient Check-in Epic PRD

## Requirements

- **E01-FR-01**: Patients must sign in with a verified account (phone OTP or portal login) before accessing check-in forms; unauthenticated guest check-in is forbidden.
- **E01-FR-02**: Verified patients confirm demographics and insurance card photo and receive a queue confirmation number.

## Rules, edge cases and failure modes

- Expired OTP locks retry for 60 seconds and offers front-desk fallback.

## Instrumentation

- Emit `checkin_completed` event with `duration_ms` and `verification_method` to prove OKR-01 Passable (4 min) / Good (2 min).

## Changes to the parent

None
