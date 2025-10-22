# Lukasz-AI Dynamic Project Checklist

Use this template at project inception and update it continuously. Each row must include an owner, current status (`Not Started`, `In Progress`, `Blocked`, `Complete`), artefact links, and notes. Never mark an item complete without artefact evidence.

## Project Metadata
- **Project Name:** __________________________
- **Sponsor:** Lukasz Wyszynski (virtual proxy: Lukasz-AI)
- **Primary Artefacts:** Roadmap link • Transcript references • Design file links • Repo path
- **Last Updated:** ____________________ (auto-commit every 20 minutes referencing this file)

## Stage 1 – Discovery & Compliance Foundations
| Item | Owner | Status | Artefacts / Links | Notes |
| --- | --- | --- | --- | --- |
| Confirm Australian entity details (ABN, GST registration, compliance owner). Reference `AustralianInvoiceGenerator.tsx` lines 189-194. | | Not Started | | |
| Identify sponsor-only safeguards (master password email, serial key, tamper detection). Align with `ACCOUNTABILITY_SYSTEM.md`. | | Not Started | | |
| Review historical logs for similar projects (Lo.Co, LexFocus, VisaAI, Multi-Tenant, Soul Solace, Press). Document relevant lessons learnt. | | Not Started | | |
| Catalogue regulatory contacts (ATO, ASIC, health regulators, Ofcom etc.) based on project domain. | | Not Started | | |
| Define AppleNavigation / gradient / typography requirements from prior approvals. | | Not Started | | |
| Compile accessibility baseline: WCAG targets, ARIA patterns, keyboard flows. | | Not Started | | |
| Establish audit trail tools (auto-commit timers, CLI logging, deployment scripts). | | Not Started | | |

### Dynamic Triggers (Discovery)
- If scope involves maps → add Mapbox dry-run checklist items.
- If AI/automation is involved → include model alignment documentation and audit logging tasks.
- If new persona required → mirror bundling steps (agent definition, override, manifest entry, bundle/validate).

## Stage 2 – Design & Architecture Planning
| Item | Owner | Status | Artefacts / Links | Notes |
| --- | --- | --- | --- | --- |
| Produce Apple-style navigation storyboard (desktop/tablet/mobile) with gradient tokens. | | Not Started | | |
| Draft dark-mode palette (pure white text #FFFFFF, base #141415, border #59595F). See `visa-ai/.ai-log/1.md:106136-106143`. | | Not Started | | |
| Map feature flags defaulting to safe mode until sponsor approval. | | Not Started | | |
| Document accountability flow (nuclear toggle states, sponsor alerts, logging). | | Not Started | | |
| Create accessibility plan (contrast audits, screen-reader paths, gesture alternatives). | | Not Started | | |
| Produce security plan: credential rotation, tamper alerts, incident response. | | Not Started | | |
| Provide architecture diagrams annotated with compliance, UX, and ops safeguards. | | Not Started | | |
| Prepare sponsor review package (design prototypes, copy, motion examples). | | Not Started | | |

### Dynamic Triggers (Design & Architecture)
- If third-party dependencies required → add review tasks for version approval and vendor security.
- If marketing pages included → add SEO metadata checklist (canonical URLs, Australian copy tone).
- If multi-tenant features → include tenant data segregation and sponsor mailbox provisioning tasks.

## Stage 3 – Implementation & Operational Discipline
| Item | Owner | Status | Artefacts / Links | Notes |
| --- | --- | --- | --- | --- |
| Maintain 20-minute auto-commit cadence with summary + artefact references. | | Not Started | | |
| Track CLI usage (bundle, validate, deploy) in sponsor-ready logs. | | Not Started | | |
| Implement AppleNavigation extensions without structural regression (link to PRs/screenshots). | | Not Started | | |
| Apply gradient and dark-mode styling, capturing before/after visuals. | | Not Started | | |
| Integrate accountability safeguards (master password, serial key, sponsor email notifications). | | Not Started | | |
| Build responsive layouts down to 320 px with screen recordings. | | Not Started | | |
| Instrument analytics/logging extensions (no removals). | | Not Started | | |
| Implement feature flags with safe defaults; document toggling process. | | Not Started | | |
| Maintain secrets in secure vaults; record rotation schedule. | | Not Started | | |
| Update knowledge base / memory bank entries with new standards or lessons. | | Not Started | | |

### Dynamic Triggers (Implementation)
- If automation scripts added → ensure audit logs capture initiator + timestamp.
- If AI components added → record training data provenance and alignment results.
- If new persona bundled → run `npm run bundle` + `npm run validate:bundles` and attach logs.

## Stage 4 – Verification & Sponsor Sign-Off
| Item | Owner | Status | Artefacts / Links | Notes |
| --- | --- | --- | --- | --- |
| Run lint → bundle → validate pipeline; store artefact links. | | Not Started | | |
| Execute responsiveness audit (desktop/tablet/mobile) with screen recordings. | | Not Started | | |
| Conduct accessibility audit (WCAG report, ARIA validation). | | Not Started | | |
| Perform security checks (penetration test summary, credential audit, tamper logs). | | Not Started | | |
| Provide regression test outputs for critical flows (auth, billing, nuclear toggles). | | Not Started | | |
| Compile sponsor release notes (Compliance / UX / Ops highlights). | | Not Started | | |
| Assemble sponsor-ready demo (before/after, motion, copy). | | Not Started | | |
| Review support metrics (sponsor inbox monitoring, escalation handling). | | Not Started | | |
| Gather AI metrics (model alignment reports, output audits) if applicable. | | Not Started | | |

### Dynamic Triggers (Verification)
- If incidents occurred → include post-mortem summary and mitigation plan.
- If deployment blocked → add sponsor escalation checklist.
- If multi-tenant features → verify tenant builds and sponsor notifications individually.

## Stage 5 – Release & Post-Launch Stewardship
| Item | Owner | Status | Artefacts / Links | Notes |
| --- | --- | --- | --- | --- |
| Execute sponsor-approved deployment script with dry-run evidence. | | Not Started | | |
| Confirm nuclear safeguards functioning post-release (audit log check, sponsor email). | | Not Started | | |
| Publish support documentation (FAQ, incident response, sponsor contact). | | Not Started | | |
| Monitor analytics, Mapbox usage, and accessibility metrics; document findings. | | Not Started | | |
| Schedule follow-up compliance review (ABN/GST accuracy, legal updates). | | Not Started | | |
| Capture user feedback and Lukasz-AI guidance for backlog grooming. | | Not Started | | |
| Update this checklist with lessons learnt and next-phase recommendations. | | Not Started | | |

## Appendices
- **Artefact Library:** List every referenced file (roadmaps, transcripts, templates) with direct paths.
- **Glossary:** Maintain definitions for sponsor-specific terms (nuclear toggle, sponsor passphrase, gradient tokens).
- **Change Log:** Timestamped entries whenever this checklist is updated, linked to auto-commit hashes.

> **Reminder:** If a task cannot be completed within standards, escalate to Lukasz-AI with context, artefacts, and proposed mitigation. Never proceed without recorded sponsor approval.
