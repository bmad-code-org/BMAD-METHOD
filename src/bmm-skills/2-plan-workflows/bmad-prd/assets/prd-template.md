# PRD Template — A Menu, Not a Skeleton

This is a menu of sections the facilitator picks from based on what the product, the stakes, the audience, and the existing inputs actually need. Hobby projects use the essential spine and stop. Enterprise initiatives, regulated submissions, and consumer launches add clusters from the adapt-in menu below. **Never include a section just because it appears here.** Drop, reorder, rename, combine — whatever the PRD needs.

---

## Essential Spine *(almost always present)*

```markdown
---
title: {Product Name}
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
---

# PRD: {Product Name}
*Working title — confirm.*

## 0. Document Purpose
[1 paragraph: who this PRD is for (PM, stakeholders, downstream workflow owners), how it's structured (Glossary-anchored vocabulary, features grouped with FRs nested, assumptions tagged inline and indexed). If UX work or other inputs already exist, name them here and reference where they live — this PRD builds on them, it does not duplicate.]

## 1. Vision
[2-3 paragraphs: what this is, what it does for the user, why it matters. Compelling enough to stand alone.]

## 2. Target User

### 2.1 Primary Persona
[Vivid but tight. Who they are, how this product fits their context.]

### 2.2 Jobs To Be Done
[Bulleted. Emotional, social, functional, contextual — whichever apply. Even "this is for me as the builder" is a valid persona for a hobby project.]

### 2.3 Non-Users (v1) *(add when the audience boundary is non-obvious)*
[Who this is explicitly not for in v1.]

### 2.4 Key User Journeys
*Named flows the product enables — one line each, numbered globally as UJ-1 through UJ-N for downstream traceability. Detailed flow design (steps, screens, edge flows) is the job of the UX workflow, not this PRD. Features in §4 may reference journeys by ID inline ("realizes UJ-3").*

- **UJ-1** — [Named flow, one line: who does what, to what end.]
- **UJ-2** — ...

[For hobby/utility projects, 1-3 journeys may be enough. For complex multi-feature products (onboarding, checkout, multi-step approvals), expand. For libraries/CLIs with minimal flow, reduce to a single line or collapse into §2.2 JTBD.]

## 3. Glossary
*Downstream workflows and readers must use these terms exactly.*

- **Term** — Definition. Relationships to other Glossary terms. Cardinality where relevant.
- **Term** — ...

[Every domain noun the rest of the document uses. Defined once. No synonyms anywhere else in the PRD.]

## 4. Features
*Each subsection is a coherent feature: behavioral description first, FRs nested under it, optional feature-specific NFRs and notes. FRs are numbered globally (FR-1 through FR-N) so downstream artifacts have stable references even if features get reorganized. Reference user journeys by ID inline ("realizes UJ-2") where the chain matters.*

### 4.1 {Feature Name}
**Description:** [Behavioral narrative — how this feature works, who uses it, the user experience, edge cases. Use Glossary terms exactly. Embed inline `[ASSUMPTION: ...]` tags where you inferred without confirmation.]

**Functional Requirements:**
- **FR-1** — [Actor] can [capability] [under conditions / with measurement].
- **FR-2** — ...

**Feature-specific NFRs:** *(only if any apply uniquely to this feature)*
- Performance / security / accessibility / etc. specific to this feature.

**Notes:** *(optional — open questions specific to this feature, `[NOTE FOR PM]` callouts)*

### 4.2 {Feature Name}
...

## 5. Non-Goals (Explicit)
[Bulleted. What this product is *not* and what it will *not* do in v1. Does outsized work for downstream readers and workflows — prevents the "let me also add this nearby thing" failure mode at every level (epic, ticket, code). Inline `[NON-GOAL for MVP]` callouts within §4 Features cover deferred items within features; this section captures the broader "we are not building X / we are not becoming Y" statements.]

## 6. MVP Scope

### 6.1 In Scope
[Bulleted, crisp.]

### 6.2 Out of Scope for MVP
[Bulleted. Each item with a one-line reason if the reason matters. Mark items deferred to v2/v3 explicitly. Add `[NOTE FOR PM]` callouts where a deferred item is emotionally load-bearing — flags it for revisit if timeline permits.]

## 7. Success Metrics

**Primary**
- Metric — definition, target.

**Secondary**
- Metric — definition, target.

**Counter-metrics (do not optimize)**
- Metric — why this should *not* be optimized.

[Length scales with stakes. Hobby/utility PRD: a single sentence may be enough ("Success: I use this weekly and don't abandon it after a month"). Public launch / enterprise: full quantitative breakdown with measurement methods. Counter-metrics are as load-bearing as primary metrics — they prevent the architect from optimizing the wrong thing and the dev from gaming the wrong target.]

## 8. Open Questions
[Numbered. Things still unknown — they become future tickets or follow-up research, not silent gaps.]

## 9. Assumptions Index
*Every `[ASSUMPTION]` from the document, surfaced for explicit confirmation:*
- Inline assumption from §X.Y — short description.
- ...
```

---

## Adapt-In Menu *(add the clusters the product calls for)*

### Cross-cutting quality and shape *(most non-trivial PRDs)*
- **Cross-Cutting NFRs** — system-wide non-functional requirements not tied to a single feature (performance, security, reliability, observability). Add when system-wide quality attributes are meaningful.
- **Constraints and Guardrails** — Safety, Privacy, Cost. Subsection per cluster. Add when any of these are real concerns.
- **Why Now** — add when timing is load-bearing (a market shift, a technology enabler, a regulatory deadline). Drop when timing is incidental.

### Consumer / branded products
- **Aesthetic and Tone** — visual references, anti-references, voice/tone for any product-generated text.
- **Information Architecture** — top-level surfaces, navigation, screens.
- **Monetization** — free vs. paid, pricing assumptions, ads policy.
- **Platform** — web, mobile, PWA, native, v1 vs. v2+.

### Enterprise initiatives
- **Stakeholders and Approvals** — who must sign off, at what stage.
- **Risk and Mitigations** — operational, security, business, reputational risk register.
- **ROI / Business Case** — quantified benefit, cost, payback period.
- **Operational Requirements** — SLAs, RTO/RPO, support tier, on-call expectations.
- **Integration and Dependencies** — SSO, existing enterprise systems, data sources, downstream consumers.
- **Rollout and Change Management** — phased rollout plan, training, internal communication.
- **Data Governance** — residency, sovereignty, classification, retention.
- **Audit Trail / Decision Provenance** — formal documentation requirements for regulated environments.

### Regulated domains
- **Compliance and Regulatory** — HIPAA, PCI-DSS, GDPR, SOX, SOC 2, Section 508 / WCAG 2.1 AA, FedRAMP, etc. — whichever apply. If any item needs depth, add a `[NOTE FOR PM]` callout to revisit or move to an addendum.

### Developer products (libraries, APIs, CLIs, SDKs)
- **API Contracts / Public Surface** — endpoint shapes, breaking change policy.
- **Versioning and Deprecation Policy**.
- **Performance Budgets** — latency, throughput, resource use.
- **Language / Runtime Targets and Dependency Policy**.

### Embedded / hardware
- **Hardware Constraints** — memory, power, form factor.
- **Deployment and Update Mechanism** — OTA, manual, image-based.
- **Environmental and Reliability Requirements**.

### Small-scope all-inclusive *(use when scope is 1-2 stories' worth and the user wants a single captured artifact — chosen during the Right-skill check in Discovery)*
- **Stories** — story-level specs listed inline at the end of the doc. Each story: *"As a [persona], I can [action] [under conditions]. Acceptance: [testable criteria]."* Numbered Story-1, Story-2, ... for reference. Pair with very lean §1 Vision, §2 Target User (often just JTBD + one UJ), §3 Glossary (handful of terms), §4 Features (often a single feature), §6 MVP Scope (in/out very tight). The whole doc fits on a page or two and captures intent + implementable stories in one place. If the user doesn't want the captured artifact at all, `bmad-quick-dev` is the better path — this cluster is only for "I want a doc *and* the stories."

---

## Notes for the facilitator

- **The essential spine is the floor, not the ceiling.** A hobby PRD might keep all ten sections short. An enterprise PRD layers many clusters from the adapt-in menu.
- **§3 Glossary before §4 Features.** Mechanics never introduce a new domain noun without adding it to the Glossary in the same pass. Persona, JTBD, and Journeys may use Glossary terms before §3 formally defines them — context is inferable; the Glossary is for downstream anchoring.
- **§2.4 Key User Journeys are brief.** One line each. Numbered globally (UJ-1 through UJ-N) so architecture, epics, stories, and tickets can reference them by stable ID. Detailed flow design happens in the UX workflow — not here.
- **§4 Features pattern at every scale.** Description → FRs nested → optional NFRs → optional notes. Hobby PRD: one short paragraph and three FRs per feature. Enterprise feature: multi-paragraph description, fifteen FRs, several feature-specific NFRs, open questions. Same shape, different depth.
- **`[ASSUMPTION]`, `[NON-GOAL]`, `[v2 — out of MVP]`, `[NOTE FOR PM]` callouts are first-class.** They signal to downstream readers and the next session of work. Every `[ASSUMPTION]` lands in §9 Assumptions Index.
- **When UX is *input* to the PRD** (journeys already designed elsewhere): §2.4 names the journeys by ID and points to the existing UX doc. Reference, do not duplicate.
- **When UX is *output* of the PRD** (no UX work yet — downstream `bmad-create-ux-design` will produce it): §2.4 captures the PM's intent on which journeys exist; UX elaborates them into detailed flows downstream.
- **§7 Success Metrics scales with stakes** but is always present. Counter-metrics matter as much as primary metrics — they shape what NOT to optimize.
- **Small-scope all-inclusive option.** When scope is genuinely 1-2 stories and the user wants a single artifact instead of running a separate `bmad-create-story` workflow, add the adapt-in *Stories* cluster: lean §1-§6 plus inline §Stories at the end. The whole doc fits on a page or two. This is a valid PRD shape for tiny work — don't apologize for it.
- **Adapt the section numbering.** The spine uses 0-9; adapt-in additions slot in wherever they read best (e.g., Aesthetic & Tone before §3 if branding is foundational, Compliance after §5 Non-Goals, Constraints & Guardrails between Features and Non-Goals, Stories at the very end after Assumptions Index).
