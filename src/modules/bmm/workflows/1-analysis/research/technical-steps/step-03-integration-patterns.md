# Technical Research Step 3: Integration Patterns

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without web search verification

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ Search the web to verify and supplement your knowledge with current facts
- 📋 YOU ARE AN INTEGRATION ANALYST, not content generator
- 💬 FOCUS on APIs, protocols, and system interoperability
- 🔍 WEB SEARCH REQUIRED - verify current facts against live sources
- 📝 WRITE CONTENT IMMEDIATELY TO DOCUMENT

## EXECUTION PROTOCOLS:

- 🎯 Show web search analysis before presenting findings
- ⚠️ Present [C] continue option after integration patterns content generation
- 📝 WRITE INTEGRATION PATTERNS ANALYSIS TO DOCUMENT IMMEDIATELY
- 💾 ONLY proceed when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Current document and frontmatter from previous steps are available
- **Research topic = "{{research_topic}}"** - established from initial discussion
- **Research goals = "{{research_goals}}"** - established from initial discussion
- Focus on APIs, protocols, and system interoperability
- Web search capabilities with source verification are enabled
- **DeepWiki MCP** - Check `deepwiki_enabled` from frontmatter for enhanced repository analysis
- **DeepWiki repos** - If enabled, `deepwiki_repos` contains validated repositories to query
- **Query budget** - Track `deepwiki_queries_used` against `deepwiki_query_budget`

## YOUR TASK:

Conduct integration patterns analysis focusing on APIs, communication protocols, and system interoperability. Search the web to verify and supplement current facts.

## INTEGRATION PATTERNS ANALYSIS SEQUENCE:

### 1. Begin Integration Patterns Analysis

**UTILIZE SUBPROCESSES AND SUBAGENTS**: Use research subagents, subprocesses or parallel processing if available to thoroughly analyze different integration areas simultaneously and thoroughly.

Start with integration patterns research approach:
"Now I'll conduct **integration patterns analysis** for **{{research_topic}}** to understand system integration approaches.

**Integration Patterns Focus:**

- API design patterns and protocols
- Communication protocols and data formats
- System interoperability approaches
- Microservices integration patterns
- Event-driven architectures and messaging

**Let me search for current integration patterns insights.**"

### 2. Parallel Integration Patterns Research Execution

**Execute multiple web searches simultaneously:**

Search the web: "{{research_topic}} API design patterns protocols"
Search the web: "{{research_topic}} communication protocols data formats"
Search the web: "{{research_topic}} system interoperability integration"
Search the web: "{{research_topic}} microservices integration patterns"

**Analysis approach:**

- Look for recent API design guides and best practices
- Search for communication protocol documentation and standards
- Research integration platform and middleware solutions
- Analyze microservices architecture patterns and approaches
- Study event-driven systems and messaging patterns

### 3. Analyze and Aggregate Results

**Collect and analyze findings from all parallel searches:**

"After executing comprehensive parallel web searches, let me analyze and aggregate integration patterns findings:

**Research Coverage:**

- API design patterns and protocols analysis
- Communication protocols and data formats evaluation
- System interoperability approaches assessment
- Microservices integration patterns documentation

**Cross-Integration Analysis:**
[Identify patterns connecting API choices, communication protocols, and system design]

**Quality Assessment:**
[Overall confidence levels and research gaps identified]"

### 4. Generate Integration Patterns Content

**WRITE IMMEDIATELY TO DOCUMENT**

Prepare integration patterns analysis with web search citations:

#### Content Structure:

When saving to document, append these Level 2 and Level 3 sections:

```markdown
## Integration Patterns Analysis

### API Design Patterns

[API design patterns analysis with source citations]
_RESTful APIs: [REST principles and best practices for {{research_topic}}]_
_GraphQL APIs: [GraphQL adoption and implementation patterns]_
_RPC and gRPC: [High-performance API communication patterns]_
_Webhook Patterns: [Event-driven API integration approaches]_
_Source: [URL]_

### Communication Protocols

[Communication protocols analysis with source citations]
_HTTP/HTTPS Protocols: [Web-based communication patterns and evolution]_
_WebSocket Protocols: [Real-time communication and persistent connections]_
_Message Queue Protocols: [AMQP, MQTT, and messaging patterns]_
_grpc and Protocol Buffers: [High-performance binary communication protocols]_
_Source: [URL]_

### Data Formats and Standards

[Data formats analysis with source citations]
_JSON and XML: [Structured data exchange formats and their evolution]_
_Protobuf and MessagePack: [Efficient binary serialization formats]_
_CSV and Flat Files: [Legacy data integration and bulk transfer patterns]_
_Custom Data Formats: [Domain-specific data exchange standards]_
_Source: [URL]_

### System Interoperability Approaches

[Interoperability analysis with source citations]
_Point-to-Point Integration: [Direct system-to-system communication patterns]_
_API Gateway Patterns: [Centralized API management and routing]_
_Service Mesh: [Service-to-service communication and observability]_
_Enterprise Service Bus: [Traditional enterprise integration patterns]_
_Source: [URL]_

### Microservices Integration Patterns

[Microservices integration analysis with source citations]
_API Gateway Pattern: [External API management and routing]_
_Service Discovery: [Dynamic service registration and discovery]_
_Circuit Breaker Pattern: [Fault tolerance and resilience patterns]_
_Saga Pattern: [Distributed transaction management]_
_Source: [URL]_

### Event-Driven Integration

[Event-driven analysis with source citations]
_Publish-Subscribe Patterns: [Event broadcasting and subscription models]_
_Event Sourcing: [Event-based state management and persistence]_
_Message Broker Patterns: [RabbitMQ, Kafka, and message routing]_
_CQRS Patterns: [Command Query Responsibility Segregation]_
_Source: [URL]_

### Integration Security Patterns

[Security patterns analysis with source citations]
_OAuth 2.0 and JWT: [API authentication and authorization patterns]_
_API Key Management: [Secure API access and key rotation]_
_Mutual TLS: [Certificate-based service authentication]_
_Data Encryption: [Secure data transmission and storage]_
_Source: [URL]_
```

### 3.5 DeepWiki-Enhanced Cross-Repository Analysis (CONDITIONAL)

**⚠️ ONLY EXECUTE THIS SECTION IF `deepwiki_enabled: true` IN FRONTMATTER**

If DeepWiki is not enabled, skip directly to Section 5.

---

#### DeepWiki Query Protocol

**Confidence Label System:**
| Label | Meaning | Source |
|-------|---------|--------|
| 🟢 `[REPO-VERIFIED]` | Direct from repo docs via DeepWiki | Single repo query |
| 🟡 `[CROSS-REPO-DOCUMENTED]` | Explicit integration docs found | Rare - high value |
| 🟠 `[LLM-SYNTHESIZED]` | Combined from per-repo facts | Requires POC |
| 🔴 `[HYPOTHESIS-ONLY]` | Speculative, no supporting docs | Do not use without validation |

---

#### Phase 1: Cross-Reference Detection

For each pair of repositories (A, B) in `deepwiki_repos`:

```
ask_question(repo_A, "Does {repo_A} document integration patterns with {repo_B} or similar frameworks in its category?")
```

**If cross-reference found:**

- Mark as `[CROSS-REPO-DOCUMENTED]` - this is rare and high value
- Extract the documented integration pattern
- Note the source section in DeepWiki

**If not found:**

- Continue to Phase 2 for this pair
- Mark any synthesis as `[LLM-SYNTHESIZED]`

**Update query count:** `deepwiki_queries_used += 1` per query

---

#### Phase 2: Structured Per-Repository Extraction

For each repository in `deepwiki_repos`, run these queries:

**Q1 - Integration APIs:**

```
ask_question(repo, "What APIs does {repo} expose for external integration? Include function signatures and parameters.")
```

**Q2 - Communication Protocols:**

```
ask_question(repo, "What communication protocols and data formats does {repo} support for inter-process or inter-service communication?")
```

**Q3 - Extension Points:**

```
ask_question(repo, "What are the documented extension points, plugin architecture, or hooks in {repo}?")
```

**Q4 - Third-Party Ecosystem:**

```
ask_question(repo, "What third-party libraries, plugins, or bridges exist for {repo} integration with other frameworks?")
```

**Q5 - Ecosystem Discovery (Enhanced):**

```
ask_question(repo, "What official adapters, integrations, or framework-specific packages does {repo} provide? Include any Next.js, React, Vue, Svelte, or mobile adapters.")
```

**Store results per repository with:**

- API signatures extracted
- Protocol support identified
- Extension mechanisms documented
- Ecosystem libraries discovered
- Official adapters/integrations listed

**Update query count:** `deepwiki_queries_used += 5` per repository

---

#### Phase 3: LLM Cross-Repository Synthesis

**⚠️ CRITICAL: This section produces `[LLM-SYNTHESIZED]` content. Label explicitly.**

Using Phase 1 and Phase 2 data, synthesize cross-repo integration patterns:

**For each repository pair (A, B):**

1. **Compare APIs:** Identify compatible integration points
   - Does A expose an API that B can consume?
   - Does B expose an API that A can consume?

2. **Compare Protocols:** Identify communication compatibility
   - Do they share common protocols (HTTP, WebSocket, IPC)?
   - Are data formats compatible (JSON, Protobuf)?

3. **Identify Bridge Patterns:**
   - Can A's extension points connect to B?
   - Are there ecosystem libraries that bridge A and B?

4. **Hypothesize Integration Architecture:**
   - How would data flow between A and B?
   - What is the recommended communication pattern?

**MANDATORY: Label all synthesis output as `[LLM-SYNTHESIZED]`**

---

#### Phase 3.5: UI Library Component Analysis (CONDITIONAL)

**⚠️ ONLY EXECUTE THIS SECTION IF ANY REPO IN `deepwiki_repos` HAS `type: ui-library` OR `type: ui-primitive`**

For each UI library/primitive repository, run these specialized queries:

**Q1 - Component Inventory:**

```
ask_question(repo, "What UI components does {repo} provide? List all available components with their primary purpose.")
```

**Q2 - Theming & Customization:**

```
ask_question(repo, "How does {repo} handle theming and customization? What are the theming APIs, CSS variables, or design tokens available?")
```

**Q3 - Composition Patterns:**

```
ask_question(repo, "What composition patterns does {repo} support? How do components compose together, and what are the slot/children patterns?")
```

**Q4 - Accessibility Features:**

```
ask_question(repo, "What accessibility features are built into {repo}? List ARIA support, keyboard navigation, and screen reader considerations.")
```

**Q5 - Variant & State System:**

```
ask_question(repo, "How does {repo} handle component variants and states? What props control visual variations (size, color, disabled, etc.)?"
```

**Update query count:** `deepwiki_queries_used += 5` per UI library repo

---

##### UI Component Capability Matrix Output

For each UI library, generate this matrix:

```markdown
### {Repo} Component Capability Matrix [REPO-VERIFIED]

**Library Type:** {ui-library|ui-primitive}
**Source:** DeepWiki query on {repo}

#### Available Components

| Component | Category | Variants             | Accessibility        | Composable |
| --------- | -------- | -------------------- | -------------------- | ---------- |
| Button    | Action   | size, color, variant | ✅ ARIA              | ✅         |
| Input     | Form     | size, state          | ✅ Label association | ✅         |
| ...       | ...      | ...                  | ...                  | ...        |

#### Theming System

| Aspect          | Support | Method        |
| --------------- | ------- | ------------- |
| CSS Variables   | ✅/❌   | {description} |
| Design Tokens   | ✅/❌   | {description} |
| Runtime Theming | ✅/❌   | {description} |
| Dark Mode       | ✅/❌   | {description} |

#### Composition Patterns

- **Slot Pattern:** {supported/not supported} - {description}
- **Compound Components:** {supported/not supported} - {description}
- **Render Props:** {supported/not supported} - {description}
- **Polymorphic `as` Prop:** {supported/not supported} - {description}

#### Accessibility Summary

| Feature             | Coverage              |
| ------------------- | --------------------- |
| ARIA Attributes     | {auto/manual/partial} |
| Keyboard Navigation | {full/partial/none}   |
| Focus Management    | {automatic/manual}    |
| Screen Reader       | {tested/untested}     |
```

---

#### Phase 4: POC Validation Checklist Generation

For each synthesized integration pattern, generate a validation checklist:

```markdown
### POC Validation Checklist: {Repo A} ↔ {Repo B}

**Pattern:** {synthesized pattern description}
**Confidence:** [LLM-SYNTHESIZED]

**Validation Steps:**

- [ ] {Repo A} API successfully called from integration code
- [ ] {Repo B} receives data in expected format
- [ ] Bidirectional communication works (if applicable)
- [ ] Error handling propagates correctly across boundary
- [ ] Performance acceptable for use case
- [ ] No memory leaks or resource issues at boundary

**Unknown/Unverified:**

- [ ] Thread safety across framework boundaries
- [ ] Lifecycle coordination between frameworks
- [ ] Version compatibility for untested combinations
```

---

#### DeepWiki Output Structure

Append to document after web search content:

```markdown
## Cross-Repository Integration Analysis [DEEPWIKI-ENHANCED]

**Data Sources:** DeepWiki MCP queries on {{deepwiki_repos}}
**Queries Used:** {{deepwiki_queries_used}} / {{deepwiki_query_budget}}
**Data Freshness:** DeepWiki indexes updated periodically - verify critical APIs against current release notes

---

### Per-Repository Integration Surfaces

#### {Repo A} Integration Surface [REPO-VERIFIED]

**Source:** DeepWiki query on {repo_A}

**Public APIs:**
{extracted from Q1}

**Communication Protocols:**
{extracted from Q2}

**Extension Points:**
{extracted from Q3}

**Ecosystem Libraries:**
{extracted from Q4}

---

#### {Repo B} Integration Surface [REPO-VERIFIED]

**Source:** DeepWiki query on {repo_B}

{same structure as above}

---

### Cross-Repository Integration Patterns

#### Direct Integration Documentation [CROSS-REPO-DOCUMENTED]

{Only if Phase 1 found actual cross-repo docs - often empty}

_No direct cross-repository documentation found._ (if empty)

---

#### Synthesized Integration Patterns [LLM-SYNTHESIZED]

**⚠️ WARNING: The following patterns are LLM synthesis based on per-repo facts.**
**They require POC validation before use in architecture decisions.**

##### Pattern: {Repo A} ↔ {Repo B} Bridge

**Hypothesis:** {description of how they might integrate}

**Based on:**

- {Repo A}'s {api} [REPO-VERIFIED]
- {Repo B}'s {api} [REPO-VERIFIED]

**Confidence:** 🟠 [LLM-SYNTHESIZED] - No direct documentation found

**Recommended Data Flow:**
```

{Repo A} → {mechanism} → {Repo B}
{Repo B} → {mechanism} → {Repo A} (if bidirectional)

````

**Code Example (Conceptual):**
```{language}
// Integration pattern - REQUIRES VALIDATION
{conceptual code based on extracted APIs}
````

---

### POC Validation Requirements

**⚠️ This research is INCOMPLETE until the following POC validations pass:**

{aggregated checklists from Phase 4}

---

### DeepWiki Query Log

| Query | Repository | Purpose                   | Result          |
| ----- | ---------- | ------------------------- | --------------- |
| 1     | {repo}     | Cross-reference detection | Found/Not found |
| 2     | {repo}     | Integration APIs          | {summary}       |
| ...   | ...        | ...                       | ...             |

**Total Queries:** {{deepwiki_queries_used}} / {{deepwiki_query_budget}}

```

---

### 5. Present Analysis and Continue Option

**Show analysis and present continue option:**

"I've completed **integration patterns analysis** of system integration approaches for {{research_topic}}.

**Key Integration Patterns Findings:**

- API design patterns and protocols thoroughly analyzed
- Communication protocols and data formats evaluated
- System interoperability approaches documented
- Microservices integration patterns mapped
- Event-driven integration strategies identified

**DeepWiki Enhancement (if enabled):**
- Per-repository integration surfaces documented [REPO-VERIFIED]
- Cross-repository patterns synthesized [LLM-SYNTHESIZED]
- POC validation checklists generated
- Query budget: {{deepwiki_queries_used}} / {{deepwiki_query_budget}}

**Ready to proceed to architectural patterns analysis?**
[C] Continue - Save this to document and proceed to architectural patterns

### 6. Handle Continue Selection

#### If 'C' (Continue):

- **CONTENT ALREADY WRITTEN TO DOCUMENT**
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load: `./step-04-architectural-patterns.md`

## APPEND TO DOCUMENT:

Content is already written to document when generated in step 4. No additional append needed.

## SUCCESS METRICS:

✅ API design patterns and protocols thoroughly analyzed
✅ Communication protocols and data formats evaluated
✅ System interoperability approaches documented
✅ Microservices integration patterns mapped
✅ Event-driven integration strategies identified
✅ Content written immediately to document
✅ [C] continue option presented and handled correctly
✅ Proper routing to next step (architectural patterns)
✅ Research goals alignment maintained

### DeepWiki Success Metrics (if enabled):

✅ Phase 1 cross-reference detection executed for all repo pairs
✅ Phase 2 structured extraction completed for all repos (5 queries each)
✅ Phase 3 synthesis clearly labeled as `[LLM-SYNTHESIZED]`
✅ Phase 3.5 UI Component Analysis executed for ui-library/ui-primitive repos (if any)
✅ Phase 4 POC validation checklists generated for all synthesized patterns
✅ Per-repo facts labeled as `[REPO-VERIFIED]`
✅ Query budget tracked and displayed
✅ DeepWiki output structure appended to document
✅ UI Component Capability Matrix generated for each UI library (if applicable)

## FAILURE MODES:

❌ Relying solely on training data without web verification for current facts

❌ Missing critical API design patterns or protocols
❌ Incomplete communication protocols analysis
❌ Not identifying system interoperability approaches
❌ Not writing content immediately to document
❌ Not presenting [C] continue option after content generation
❌ Not routing to architectural patterns step

### DeepWiki Failure Modes (if enabled):

❌ Not checking `deepwiki_enabled` before executing DeepWiki section
❌ Labeling synthesized content as `[REPO-VERIFIED]` (CRITICAL - trust violation)
❌ Not generating POC validation checklists for synthesized patterns
❌ Exceeding query budget without warning
❌ Not tracking `deepwiki_queries_used` in frontmatter
❌ Presenting synthesized patterns without confidence labels
❌ Not executing Phase 3.5 UI queries when ui-library/ui-primitive repos are present
❌ Missing UI Component Capability Matrix for UI library repos

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## INTEGRATION PATTERNS RESEARCH PROTOCOLS:

- Research API design guides and best practices documentation
- Use communication protocol specifications and standards
- Analyze integration platform and middleware solutions
- Study microservices architecture patterns and case studies
- Focus on current integration data
- Present conflicting information when sources disagree
- Apply confidence levels appropriately

## INTEGRATION PATTERNS ANALYSIS STANDARDS:

- Always cite URLs for web search results
- Use authoritative integration research sources
- Note data currency and potential limitations
- Present multiple perspectives when sources conflict
- Apply confidence levels to uncertain data
- Focus on actionable integration insights

## NEXT STEP:

After user selects 'C', load `./step-04-architectural-patterns.md` to analyze architectural patterns, design decisions, and system structures for {{research_topic}}.

Remember: Always write research content to document immediately and emphasize current integration data with rigorous source verification!
```
