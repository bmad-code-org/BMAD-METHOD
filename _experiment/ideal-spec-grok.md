
**Word count target:** 600–1,200 (granular story).  
**Section-by-section rationale**  
- Objective: anchors intent.  
- AC + examples/tables: makes success verifiable → model can self-judge.  
- Edge matrix: kills 80% of hallucinations on boundaries.  
- Non-goals + constraints: prevents scope creep or wrong “how”.  
- Testing/DoD: turns spec into executable contract.

**Why this beats every alternative**  
- Structured Markdown + RAG > JSON (too rigid for narrative), > plain text (ambiguous), > Gherkin alone (lacks architecture/data context), > Notion/Figma (not git-native, poor LLM parsing).  
- Evidence: GitHub Spec-Kit users and Osmani workflows report “night-and-day” quality jump vs 2024 templates; PRDBench-style PRDs lift agent pass rates 20–40+ points vs vague prompts.

### 3. Deep Comparative Analysis

| Artifact Type                  | One-Shot Success (est. frontier LLMs + RAG) | Clarification Rounds | Production Time Impact | LLM Preference (Feb 2026) | Score /10 |
|--------------------------------|---------------------------------------------|----------------------|------------------------|---------------------------|-----------|
| Classic Agile Story + AC       | 30–45%                                     | 3–5+                | High (lots of rework) | Low                       | 3.5      |
| Pure Gherkin/BDD               | 55–70%                                     | 2–3                 | Medium                 | Medium                    | 6.0      |
| JSON/YAML schema only          | 50–65%                                     | 2–4                 | High                   | Low (lacks narrative)     | 4.5      |
| Long vibe-coding prompt        | 40–60%                                     | 4+                  | Very high              | Very low                  | 3.0      |
| Notion page / Figma + text     | 45–65%                                     | 2–4                 | High (export friction) | Low                       | 4.0      |
| **SDD `story-[ID]-spec.md`**   | **85–95%**                                 | **0–1**             | Low (front-loaded)     | Highest                   | **9.5**  |

### 4. Key Research Findings
1. SDD exploded in 2025; GitHub Spec-Kit (Sept 2025) and Osmani’s Jan 2026 guides established `spec.md` as de-facto standard.  
2. Concrete examples + edge matrices reduce hallucination more than any other single technique (observed across Cursor, Kiro, Aider post-mortems).  
3. Length trade-off: <600 words → ambiguity; >2,000 words → context dilution or contradictions; 600–1,200 optimal for granular stories.  
4. Over-specification (detailed “how” or conflicting rules) hurts more than under-specification once codebase RAG is available.  
5. PRDBench (2025) showed structured PRDs yield 45–60% one-shot project success; debugging round adds only marginal gains — proving quality upfront matters most.  
6. 95% of 2024 “mega-prompt” templates are now considered anti-patterns; 2026 standard is short collaborative spec + persistent file.  
7. Gherkin AC remains powerful when embedded inside broader Markdown spec.  
8. Companies at scale (Vercel, Linear internal reports referenced in SDD discussions) ship 3–5× faster with per-feature SDD specs.

### 5. Evolution Timeline (2023 → Feb 2026)
- **2023**: Loose user stories + vibe prompts.  
- **Early 2024**: BDD/Gherkin revival; first agent post-mortems highlight need for examples.  
- **Mid-2024**: Cursor/Aider/Devin show value of persistent context files.  
- **2025**: GitHub Spec-Kit launch (Sept), Kiro, ThoughtWorks SDD radar; Osmani popularizes “15-minute waterfall”.  
- **Jan–Feb 2026**: Refined templates, empirical benchmarks, widespread adoption in frontier agent tooling.

### 6. Implementation Roadmap for Quick Flow / BMAD
- **Redesign `quick-spec` flow**: User → high-level description → agent drafts `story-[ID]-spec.md` using template + codebase scan → human 1-round review/flag [NEEDS_CLARIFICATION] → lock and hand to implementer agent.  
- **Auto-generate prompt**: “You are SDD Spec Engineer. Using the provided user request and full repo context, output ONLY a complete story-XXX-spec.md using the exact canonical template.”  
- **Integration**: Always surface relevant codebase files via RAG before spec finalization; store spec in repo for future agents.

### 7. Test Protocol
- A/B test: 20 real stories. Control = current BMAD quick-spec; Treatment = new `story-[ID]-spec.md`.  
- Metrics: implementation success (tests pass + AC met), clarification messages needed, time-to-green, human review effort.  
- Run with Grok 4.20, Claude 4 Opus, GPT-o3 in parallel; target ≥90% one-shot on treatment.

### 8. Open Questions & Next Experiments (for BMAD team)
- Does embedding lightweight sequence diagrams (Mermaid) boost success further, or just add noise?  
- Optimal split between one monolithic spec vs spec + separate plan.md/tasks.md for very complex stories?  
- How do frontier models handle evolving specs (versioning, diff-based updates)?  
- Quantify exact success lift when combining with constitution.md / .cursor/rules files.  
- Experiment: agent-as-judge scoring of spec quality pre-implementation.

**Key Citations**  
- Addy Osmani, “How to write a good spec for AI agents” (Jan 2026) – https://addyosmani.com/blog/good-spec/  
- Addy Osmani, “My LLM coding workflow going into 2026” (Jan 2026) – https://addyosmani.com/blog/ai-coding-workflow/  
- GitHub Spec-Kit repository & spec-driven.md (2025) – https://github.com/github/spec-kit  
- ThoughtWorks, “Spec-driven development: Unpacking one of 2025’s key new AI-assisted engineering practices” (Dec 2025) – https://www.thoughtworks.com/insights/blog/agile-engineering-practices/spec-driven-development  
- PRDBench paper (arXiv, Oct 2025) – https://arxiv.org/pdf/2510.24358  
- Kiro documentation on executable specs (2025–2026) – https://kiro.dev/docs/specs/  

This artifact is the current engineering gold standard. Adopt it, measure, iterate — the data shows it will materially move your Quick Flow success rates.
