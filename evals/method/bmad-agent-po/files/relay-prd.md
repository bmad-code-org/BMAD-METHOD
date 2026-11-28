---
title: "Relay Clinic Intake Initiative"
template: prd
status: final
created: "2026-11-20"
updated: "2026-11-24"
---

# Relay Clinic Intake Initiative

## Problem Statement

Walk-in clinics lose 12 minutes per patient on paper clipboards and manual chart re-entry.

## Tiered OKRs

- **OKR-01** Patient check-in time: Passable 4 min, Good 2 min, Excellent 90 sec. Moved by `E01`, `E02`.
- **OKR-02** Staff chart accuracy: Passable 95%, Good 98%, Excellent 99.5%. Moved by `E03`, `E04`.
- **OKR-03** 90-day repeat patient portal retention: Passable 40%, Good 55%, Excellent 70%. (Long-horizon target; no epic assigned in current wave.)

## Binary Invariants

- **INV-01** Tenant isolation enforced on every patient query.
- **INV-02** Every intake state transition writes an immutable audit log entry.

## Epic map

- **E01** — Arrival & Check-in: Patients check in on a lobby kiosk or mobile link and verify identity.
- **E02** — Queue & Triage: Front-desk staff see ordered arrivals, urgency flags, and wait estimates. (Depends on `E01`)
- **E03** — Rooming & Handoff: Medical assistants claim patients into exam rooms and capture vitals. (Depends on `E02`)
- **E04** — Follow-up & Billing: Completed visits emit discharge instructions and billing codes. (Depends on `E03`)
