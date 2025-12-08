# Technical Research Step 1: Technical Research Scope Confirmation

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user confirmation

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ FOCUS EXCLUSIVELY on confirming technical research scope and approach
- 📋 YOU ARE A TECHNICAL RESEARCH PLANNER, not content generator
- 💬 ACKNOWLEDGE and CONFIRM understanding of technical research goals
- 🔍 This is SCOPE CONFIRMATION ONLY - no web research yet

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present [C] continue option after scope confirmation
- 💾 ONLY proceed when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Research type = "technical" is already set
- **Research topic = "{{research_topic}}"** - discovered from initial discussion
- **Research goals = "{{research_goals}}"** - captured from initial discussion
- Focus on technical architecture and implementation research
- Web search is required to verify and supplement your knowledge with current facts
- **DeepWiki MCP** may be available for authoritative repository documentation (optional enhancement)

## YOUR TASK:

Confirm technical research scope and approach for **{{research_topic}}** with the user's goals in mind.

## TECHNICAL SCOPE CONFIRMATION:

### 1. Begin Scope Confirmation

Start with technical scope understanding:
"I understand you want to conduct **technical research** for **{{research_topic}}** with these goals: {{research_goals}}

**Technical Research Scope:**

- **Architecture Analysis**: System design patterns, frameworks, and architectural decisions
- **Implementation Approaches**: Development methodologies, coding patterns, and best practices
- **Technology Stack**: Languages, frameworks, tools, and platforms relevant to {{research_topic}}
- **Integration Patterns**: APIs, communication protocols, and system interoperability
- **Performance Considerations**: Scalability, optimization, and performance patterns

**Research Approach:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence levels for uncertain technical information
- Comprehensive technical coverage with architecture-specific insights

### 2. Scope Confirmation

Present clear scope confirmation:
"**Technical Research Scope Confirmation:**

For **{{research_topic}}**, I will research:

✅ **Architecture Analysis** - design patterns, frameworks, system architecture
✅ **Implementation Approaches** - development methodologies, coding patterns
✅ **Technology Stack** - languages, frameworks, tools, platforms
✅ **Integration Patterns** - APIs, protocols, interoperability
✅ **Performance Considerations** - scalability, optimization, patterns

**All claims verified against current public sources.**

**Does this technical research scope and approach align with your goals?**

### 2.5 Framework Integration Mode (Optional DeepWiki Enhancement)

After confirming scope, ask:

"**Does this research involve integrating multiple frameworks or libraries?**

If you're researching how frameworks work together (e.g., Tauri + Next.js, or React + a backend framework), I can query authoritative repository documentation via DeepWiki for verified API signatures and integration patterns.

[Y] Yes - Enable DeepWiki mode for authoritative framework documentation
[N] No - Standard web research is sufficient for this topic"

#### If Y (Enable DeepWiki):

"**Which GitHub repositories should I query?** (Maximum 3 for optimal results)

Format: `owner/repo` (e.g., `tauri-apps/tauri`, `vercel/next.js`)

Enter repositories (comma-separated):"

#### Repository Type Classification (MANDATORY if enabled):

For each provided repository, classify its type based on name patterns:

| Pattern Match                            | Type           | Query Focus                            |
| ---------------------------------------- | -------------- | -------------------------------------- |
| `shadcn/*`, `shadcn-ui/*`, `radix-ui/*`  | `ui-primitive` | Primitives, composition, accessibility |
| `chakra-ui/*`, `mui/*`, `ant-design/*`   | `ui-library`   | Components, theming, variants          |
| `*-ui/*`, `*ui/*` (general)              | `ui-library`   | Components, props, customization       |
| `tauri-apps/*`, `vercel/*`, `electron/*` | `framework`    | APIs, protocols, extensions            |
| `*auth*`, `*-auth/*`                     | `auth-library` | Sessions, providers, security          |
| Other                                    | `general`      | Standard technical queries             |

Display classification to user:
"**Repository Classification:**
| Repository | Type | Query Focus |
|------------|------|-------------|
| {repo_1} | {type} | {focus_description} |
| {repo_2} | {type} | {focus_description} |

**Note:** UI libraries will receive additional component-focused queries for UX Designer downstream use."

#### DeepWiki Validation (MANDATORY if enabled):

For each provided repository:

1. Call `read_wiki_structure(repo)` to verify indexing
2. If successful: Store repo with `indexed: true`, extract version if available, store `type` classification
3. If fails: Warn user - "⚠️ {repo} is not indexed in DeepWiki. Continue without it? [Y/N]"

Display validation results:
"**DeepWiki Repository Status:**
| Repository | Indexed | Version |
|------------|---------|---------|
| {repo_1} | ✅/❌ | {version} |
| {repo_2} | ✅/❌ | {version} |

**Query Budget:** This session will use approximately {estimated} queries. Maximum recommended: 15 queries."

#### DeepWiki Frontmatter Variables:

When DeepWiki is enabled, set:

```yaml
deepwiki_enabled: true
deepwiki_repos:
  - repo: 'owner/repo'
    indexed: true
    version: 'detected or unknown'
    type: 'framework|ui-library|ui-primitive|auth-library|general'
deepwiki_query_budget: 15
deepwiki_queries_used: 0
deepwiki_has_ui_repos: true|false # Set true if any repo type is ui-library or ui-primitive
```

#### If N (Standard Research):

Proceed with web-only research:

```yaml
deepwiki_enabled: false
```

### 2.6 Final Scope Confirmation

Present final confirmation with DeepWiki status:

"**Technical Research Configuration:**

✅ Research Topic: {{research_topic}}
✅ Research Goals: {{research_goals}}
✅ Data Sources: Web Search + DeepWiki (if enabled)
✅ DeepWiki Repos: {list or 'None - web only'}

[C] Continue - Begin technical research with this configuration"

### 3. Handle Continue Selection

#### If 'C' (Continue):

- Document scope confirmation in research file
- Update frontmatter: `stepsCompleted: [1]`
- Load: `./step-02-technical-overview.md`

## APPEND TO DOCUMENT:

When user selects 'C', append scope confirmation:

```markdown
## Technical Research Scope Confirmation

**Research Topic:** {{research_topic}}
**Research Goals:** {{research_goals}}

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**DeepWiki Configuration:**

- Enabled: {{deepwiki_enabled}}
- Repositories: {{deepwiki_repos or 'None - web research only'}}
- Query Budget: {{deepwiki_query_budget or 'N/A'}}

**Scope Confirmed:** {{date}}
```

## SUCCESS METRICS:

✅ Technical research scope clearly confirmed with user
✅ All technical analysis areas identified and explained
✅ Research methodology emphasized
✅ [C] continue option presented and handled correctly
✅ Scope confirmation documented when user proceeds
✅ Proper routing to next technical research step
✅ DeepWiki mode offered for framework integration research
✅ DeepWiki repos validated via read_wiki_structure() before proceeding
✅ Query budget communicated to user
✅ DeepWiki configuration saved to frontmatter

## FAILURE MODES:

❌ Not clearly confirming technical research scope with user
❌ Missing critical technical analysis areas
❌ Not explaining that web search is required for current facts
❌ Not presenting [C] continue option
❌ Proceeding without user scope confirmation
❌ Not routing to next technical research step
❌ Enabling DeepWiki without validating repos are indexed
❌ Exceeding 3 repo limit without warning
❌ Not communicating query budget to user
❌ Not saving DeepWiki configuration to frontmatter

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C', load `./step-02-technical-overview.md` to begin technology stack analysis.

Remember: This is SCOPE CONFIRMATION ONLY - no actual technical research yet, just confirming the research approach and scope!
