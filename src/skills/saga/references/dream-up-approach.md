# Saga's Dream Up Approach Guide

**When to load:** When user requests artifact generation (Trigger Map, Product Brief companions)

**Agent:** Saga the Analyst
**Purpose:** Execute Dream Up modes (Suggest/Dream) for Phase 1-2 artifact generation

---

## Core Architecture: 5 Layers

```
Layer 1: Learn WDS Form (Static - loaded once)
         How to structure, what makes quality
         ↓
Layer 2: Project Context (Cumulative - grows with each step)
         Product Brief → +Business Goals → +Target Groups → +Driving Forces
         ↓
Layer 3: Domain Research (Ongoing - per step as needed)
         Industry insights, competitor analysis, user behavior
         ↓
Layer 4: Generate Next Artifact
         Apply Form + Use All Prior Context + Enhanced by Research
         ↓
Layer 5: Self-Review Against Standards
         Check quality, identify gaps, refine
         ↓
    Add artifact to Layer 2 → Repeat for next step
```

**Key Principle:** Each step builds on all previous artifacts. Layer 2 grows as progress is made.

---

## When to Offer Dream Up Modes

### Offer When:
✅ User requests artifact generation (Trigger Map, Product Brief companions)
✅ Product Brief exists from Phase 1 (provides substance)
✅ Quality rubric exists for the artifact type
✅ Task is structured generation (not pure discovery)

### Don't Offer When:
❌ Pure discovery conversation (no artifact to generate)
❌ No Product Brief exists yet (no substance to work with)
❌ User explicitly wants dialog/workshop approach
❌ No quality rubric available yet

---

## Mode Selection Dialog

**Present this choice at workflow start:**

```
**Which engagement mode would you like?**

**Workshop Mode** (Agent facilitates workshop, 60-90 min)
- I'll facilitate a workshop to draw out your best ideas through strategic questions
- Man-in-the-loop: You're actively involved, I guide the discovery
- Best for: Discovery, strategic decisions, first time, want to go deep

**Suggest Mode** (Driven by agent, 30-45 min)
- I'll generate based on WDS methodology + your Product Brief + domain research
- You review each step and guide refinements
- You'll see my learning, research, and self-review process
- Best for: Product Brief exists, want to see my thinking, learn through observation

**Dream Mode** (Fully autonomous, 15-20 min)
- I'll generate autonomously with visible self-dialog
- You can observe and interrupt anytime, or just review the result
- Best for: Trust the methodology, established patterns, time-efficient

Choose: [W] Workshop | [S] Suggest | [D] Dream
```

**If user unsure, recommend based on:**
- Product Brief quality (rich → Suggest/Dream, sparse → Workshop)
- User skill level (beginner → Workshop, comfortable → Suggest/Dream)
- Time constraints (limited time → Dream)
- Novelty (new domain → Workshop, familiar → Suggest/Dream)

---

## Layer 1: Learn WDS Form (Static)

**Purpose:** Agent becomes WDS methodology expert before generating.

### For Phase 2 (Trigger Mapping)

**Load these WDS learning materials:**
```
docs/method/phase-2-trigger-mapping-guide.md
docs/quick-start/02-trigger-mapping.md
src/skills/saga/references/trigger-mapping.md
docs/models/impact-effect-mapping.md
docs/method/dream-up-rubric-phase-2.md
```

**Learn and internalize:**

#### Structure Requirements
- Business Goals Layer (vision + SMART objectives)
- Product/Solution Hub
- Target Groups (3-4 max, prioritized)
- Detailed Personas (alliterative names, psychological depth)
- Usage Goals (positive + negative drivers, 3-5 each per persona)
- Prioritization (goals → groups → drivers ranked)
- Optional: Feature Impact Analysis, Visual Diagram

#### Quality Criteria (7 standards)
1. **Strategic Depth** - Reveal specific psychology, not surface observations
2. **Usage Context Clarity** - Usage goals, not life goals
3. **Persona Depth** - Psychological, not demographic
4. **Negative Drivers Present** - Equal weight to fears/frustrations
5. **Focused Scope** - 3-4 groups max, not diluted
6. **Actionable Specificity** - Concrete, not vague
7. **Business Goal Connection** - Every user serves a goal

#### Common Mistakes to Avoid
- ❌ Solutions on the map (keep psychology, not features)
- ❌ Generic/obvious forces (be specific to context)
- ❌ Demographic personas (focus on psychology)
- ❌ Inconsistent priority (make hard choices)

#### Best Practices
- ✅ Alliterative persona names (memorable, hints at role)
- ✅ Equal weight to negative drivers (loss aversion is powerful)
- ✅ Context declaration (explicit usage context)
- ✅ Visual connection diagram (shows logic flow)

**Document in design log:**

```markdown
## Layer 1: WDS Form Learned

### Methodology Loaded
- Phase 2 Trigger Mapping Guide
- Quality Rubric with 7 criteria
- Impact/Effect Mapping model

### Structure Internalized
- 4 core layers: Goals → Product → Groups → Drivers
- Prioritization required at each level
- Personas with psychological depth, not demographics

### Quality Standards
- Minimum threshold: 7/9 complete, 5/7 quality, 4/4 mistakes avoided
- Excellence threshold: 9/9 complete, 7/7 quality, 4/4 practices followed

### Ready to apply WDS form to this project's substance.
```

---

### For Phase 3 (Scenarios)

**Learn and internalize the following WDS scenario standards:**

#### Scenario Outline Template

Use this structure when creating scenario outlines from the 8-question dialog:

```markdown
# [NN]: [Persona Name]'s [Purpose]

**Project:** [project_name]
**Created:** [date]
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
[The key transaction — stated as user purpose, not feature name]

---

## Business Goal (Q2)

**Goal:** [Which specific business goal this serves]
**Objective:** [Objective reference from Trigger Map]

---

## User & Situation (Q3)

**Persona:** [Name] ([Priority level: Primary/Secondary/Tertiary])
**Situation:** [Real-life context — who they are, where they are, what's happening]

---

## Driving Forces (Q4)

**Hope:** [What they're hoping to find or achieve — one sentence]

**Worry:** [What they're afraid of or want to avoid — one sentence]

> CONSTRAINT: One sentence per component. Phrases, not paragraphs.

---

## Device & Starting Point (Q5 + Q6)

**Device:** [Mobile / Desktop / Tablet]
**Entry:** [How they actually arrive] — max 2 sentences

---

## Best Outcome (Q7)

**User Success:**
[Tangible, measurable outcome the user achieves]

**Business Success:**
[Specific, measurable result the business gets]

---

## Shortest Path (Q8)

[Linear sunshine path — NO branches, NO "if" statements. Minimum viable steps.]

1. **[Page Name]** — [What user sees/does/achieves at this step]
2. **[Page Name]** — [What user sees/does/achieves at this step]
3. **[Page Name]** — [What user sees/does/achieves at this step] ✓

---

## Trigger Map Connections

**Persona:** [Name] ([Priority level])

**Driving Forces Addressed:**
- ✅ **Want:** [Specific positive driver from Trigger Map]
- ❌ **Fear:** [Specific negative driver from Trigger Map]

**Business Goal:** [Specific goal + objective from Trigger Map]

---

## Scenario Steps

Steps are outlined one at a time after scenario creation. The first step is processed automatically.

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| [NN].1 | `[NN].1-[page-slug]/` | [Step purpose] | [Interaction that leads to next step] |
| [NN].2 | `[NN].2-[page-slug]/` | [Step purpose] | [Interaction that leads to next step] |
| [NN].3 | `[NN].3-[page-slug]/` | [Step purpose] | [Final — scenario success] ✓ |

**First step** ([NN].1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
```

**Quality reminders when filling the template:**
- **Transaction** — Is this a real user journey? Browsing content page-by-page counts. Any meaningful path with intent.
- **Driving Forces** — Can you FEEL the user's state? "Interested" is not enough. "Panicked because family vacation is at risk" is.
- **Best Outcome** — "Get more customers" fails. "Reduce info calls by 40% by giving tourists the info they need online" passes.
- **Shortest Path** — Count the steps. Can you remove any? Each step must justify its existence.
- **Trigger Map** — Don't invent a user. Use the actual persona with their actual driving forces.

---

#### Structure Requirements
- Scenario has 7 required components (Name, Core Feature, Entry Point, Mental State, Success Goals, Shortest Path, Trigger Map Connections)
- Entry points must be realistic (device + context + discovery) — max 2 sentences
- Mental states must be visceral (Trigger/Hope/Worry) — one sentence each
- Paths must be linear (zero branches, minimum viable steps)
- Success goals must be mutual (user + business, both measurable)

#### Quality Criteria
1. **Persona Alignment** — Serves specific Trigger Map persona
2. **Mental State Richness** — Visceral, not generic
3. **Mutual Success Clarity** — Both specific and measurable
4. **Sunshine Path Focus** — Completely linear
5. **Minimum Viable Steps** — Each justifies existence
6. **Entry Point Realism** — Real-world behavior
7. **Business Goal Connection** — Traces to Trigger Map

#### Common Mistakes to Avoid
- Edge cases in sunshine path (zero "if" statements)
- Feature-first naming (use persona + purpose)
- Missing mental state components
- Vague page descriptions
- Generic persona ("user" instead of named persona)
- Missing business value
- Bloated descriptions (max 2 sentences per entry point, 1 sentence per mental state component)

---

## Layer 2: Project Context (Cumulative)

**Purpose:** Extract substance from prior artifacts. Layer 2 GROWS with each step.

### Initial Load: Product Brief (Start of Phase 2)

**Read these files:**
```
{output_folder}/A-Product-Brief/product-brief.md
{output_folder}/A-Product-Brief/content-language.md
{output_folder}/A-Product-Brief/platform-requirements.md
{output_folder}/A-Product-Brief/visual-direction.md
```

**Extract and summarize:**

#### Business Context
- Business name, location, industry, services
- Market position, reputation, years in business
- Current challenges (what problem does product solve)
- Success criteria (what winning looks like)

#### User Archetypes (from Product Brief)
- Each archetype name and description
- Their context (when do they use product)
- Their needs/goals (high-level)
- Their challenges (frustrations)

**Note:** These archetypes will be deepened into personas with driving forces in Phase 2.

#### Constraints
- Technical: Platform, tech stack, integrations
- Business: Budget, timeline, resources, maintenance level
- Scope: What's in/out
- Brand: Tone, personality, visual direction, keywords

#### Strategic Direction
- Business goals mentioned in brief
- Target audience priorities
- SEO keywords (if relevant)
- Future plans

**Document in design log:**

```markdown
## Layer 2: Project Context (Initial Load)

### From Product Brief
**Business:** Källa Fordonservice AB, car mechanic on northern Öland, 20+ years, 4.8/5 rating
**Challenge:** Repetitive phone calls about basic info, no website presence
**Goal:** Reduce admin burden while maintaining findability

### User Archetypes (to deepen)
1. **Tomas the Tourist** - Summer visitor, car trouble, stressed, needs immediate help
2. **Lennart the Local** - Year-round resident, loyal customer, checks hours
3. **Farmer Fredrik** - Agricultural equipment, understands wait times
4. **Motorhome Maria** - RV passing through, specialized expertise needed

### Constraints
- Technical: WordPress + Tailwind, mobile-first, low maintenance
- Business: Björn at capacity, phone-first contact strategy
- Brand: Professional but unpretentious, warm and practical tone

### Strategic Direction
- Primary: Reduce repetitive info calls
- Secondary: Rank for "bilverkstad Öland" keywords
- Future: AI phone assistant integration
```

### Cumulative Growth: Add After Each Step

**After Business Goals created:**
```markdown
### Business Goals (Added to Layer 2)
**Vision:** [Inspirational direction]
**SMART Objectives:**
1. [Measurable target]
2. [Measurable target]
3. [Measurable target]

**Priorities:** [Ranked]
```

**After Target Groups created:**
```markdown
### Target Groups (Added to Layer 2)
**Primary 👥:** [Group name] - [Why they matter to Goal 1]
**Secondary 👤:** [Group name] - [Why they matter]
**Tertiary:** [Group name] - [Why they matter]

[Full persona profiles with psychological depth]
```

**After Driving Forces created:**
```markdown
### Driving Forces (Added to Layer 2)
**Per Persona:**
- Positive Drivers (✅): [List]
- Negative Drivers (❌): [List]

[Specific, contextual, actionable]
```

**After Prioritization created:**
```markdown
### Prioritization (Added to Layer 2)
- Goals ranked: [Order]
- Groups ranked: [Order]
- Drivers ranked per persona: [Top 3 each]

**Strategic Focus:** [Summary of what matters most]
```

**Key Principle:** Each subsequent generation step uses ALL prior artifacts from Layer 2.

### For Phase 3: Cumulative Context Growth

**Initial Load (start of Phase 3):**
- Product Brief (all 4 documents from Phase 1)
- Trigger Map (all documents from Phase 2)
- Strategic context (business goal, persona, driving forces)

**After each scenario outlined:**
```markdown
### Scenario [NN] (Added to Layer 2)
**Persona:** [Name]
**Pages covered:** [List]
**Driving forces addressed:** [Which ones from Trigger Map]
**Remaining unaddressed forces:** [What still needs scenarios]
```

**Key Rule:** Each subsequent scenario should address DIFFERENT driving forces. Check Layer 2 to avoid duplicating coverage.

---

## Layer 3: Domain Research (Ongoing)

**Purpose:** Agent acts as domain expert through research. Enhances Product Brief with industry insights.

### Research Per Step

**For Business Goals:**
- WebSearch: "[Industry] business goals best practices"
- WebSearch: "[Business type] success metrics"
- Look for: Common SMART objectives in this industry

**For Target Groups:**
- WebSearch: "[Business type] customer types"
- WebSearch: "[Location/context] user behavior"
- Look for: Who actually uses these services and why

**Example for Källa (Car Mechanic on Öland):**
```
WebSearch: "car mechanic rural tourist area customer types"
WebSearch: "northern Öland tourism caravan RV statistics"
WebSearch: "seasonal mechanic business challenges Sweden"
```

**For Driving Forces:**
- WebSearch: "[User type] pain points frustrations"
- WebSearch: "[Service] user reviews complaints"
- Look for: Real user voices, forums, review sites

**Example for Tourist persona:**
```
WebSearch: "car breakdown vacation stress what customers want"
WebSearch: "tourist mechanic trust safety concerns"
Forums: Reddit r/travel, car forums about breakdowns while traveling
```

**For Prioritization:**
- WebSearch: "[Business type] what matters most to customers"
- WebSearch: "[Industry] feature prioritization"
- Competitor analysis: What do similar businesses emphasize?

### Research Documentation

```markdown
## Layer 3: Domain Research

### Step: [Current step name]

**Research Conducted:**
1. WebSearch: "[Query]"
   - Finding: [Key insight]
   - Relevance: [How this informs generation]

2. WebSearch: "[Query]"
   - Finding: [Key insight]
   - Relevance: [How this informs generation]

**Key Insights:**
- [Domain-specific pattern discovered]
- [Industry standard identified]
- [User behavior validated]

**Informing Generation:**
[How research will be applied to this step]
```

### For Phase 3 (Scenarios)

**For Entry Points:**
- WebSearch: "[user type] how they find [service type]"
- WebSearch: "[device type] user behavior [context]"
- Look for: Real search terms, realistic discovery paths, device usage statistics

**For Mental States:**
- WebSearch: "[situation] user emotions anxiety"
- WebSearch: "[service] customer reviews pain points"
- Look for: Actual user language from reviews and forums — visceral, specific feelings

**For Shortest Paths:**
- WebSearch: "[similar service] website user flow best practices"
- WebSearch: "[industry] conversion funnel steps"
- Look for: Industry-standard page flows, minimum viable steps for this type of service

---

## Layer 4: Generate Artifact

**Purpose:** Create output by applying WDS Form (Layer 1) + Project Context (Layer 2) + Domain Research (Layer 3).

### Generation Process

**Synthesis Statement (before generating):**

```markdown
## Generation Plan: [Artifact name]

**Applying:**
- WDS Form: [Structure from Layer 1]
- Project Context: [All prior artifacts from Layer 2]
- Domain Research: [Insights from Layer 3]

**Expected Output:**
[What will be created, aligned to which criteria]
```

### Step-by-Step Generation

**For Phase 2 Trigger Mapping:**

#### Step 1: Business Goals

**Input:**
- Form: Vision + SMART objectives structure (Layer 1)
- Substance: Product Brief goals and success criteria (Layer 2)
- Research: Industry best practices for this business type (Layer 3)

**Generate:**
1. Vision statement (inspirational, directional)
2. 3-5 SMART objectives (measurable, time-bound)
3. Connection to product/solution

**Example Output Structure:**
```markdown
## Business Goals

### Vision
[Inspirational statement about where business is going]

### SMART Objectives
1. [Specific - Measurable - Achievable - Relevant - Time-bound]
2. [...]
3. [...]

### Product Connection
[How the product/website serves these goals]
```

#### Step 2: Target Groups

**Input:**
- Form: 3-4 groups max, prioritized, connected to goals (Layer 1)
- Substance: Product Brief archetypes + Business Goals (Layer 2)
- Research: Customer types for this industry + location (Layer 3)

**Generate:**
1. Refine Product Brief archetypes into strategic target groups
2. Connect each to business goals they serve
3. Prioritize: Primary 👥, Secondary 👤, Tertiary
4. Create detailed persona for each

**Persona Template (Psychological Depth):**
```markdown
### [Alliterative Name the Role]

**Context:** [When/why they use product - usage context, not life context]

**Psychological Profile:**
- Role: [Their position relative to product]
- Mindset: [How they think/feel in this context]
- Internal State: [Confidence, anxiety, urgency, etc.]

**What They're Trying to Achieve:**
[High-level goals in this usage context]

**What They Fear/Want to Avoid:**
[High-level fears in this usage context]

**Why They Matter to Business Goals:**
[Connection to specific SMART objectives]
```

#### Step 3: Driving Forces

**Input:**
- Form: Positive + negative drivers, equal weight, contextual (Layer 1)
- Substance: Personas + Business Goals (Layer 2)
- Research: User pain points, reviews, forums, behavior patterns (Layer 3)

**Generate for EACH persona:**

**Positive Drivers (✅ 3-5 per persona):**
- What they want to achieve (usage goals, not life goals)
- Specific to context (not generic "save time")
- Actionable (designer can create feature from this)

**Negative Drivers (❌ 3-5 per persona):**
- What they want to avoid (fears, frustrations)
- Specific and visceral (loss aversion is powerful)
- Equally detailed as positive drivers

**Example Format:**
```markdown
### Tomas the Tourist - Driving Forces

**Positive Drivers (✅):**
1. Get back on road quickly without ruining vacation plans
2. Feel confident that mechanic is certified and trustworthy
3. Understand what's wrong and what it costs before committing
4. Know exact timeline so can adjust other plans accordingly

**Negative Drivers (❌):**
1. Fear being stranded on vacation far from home
2. Fear getting ripped off by unknown mechanic in unfamiliar place
3. Avoid wasting vacation time waiting with no updates
4. Avoid surprise costs that blow vacation budget
```

#### Step 4: Prioritization

**Input:**
- Form: Rank goals, groups, drivers (Layer 1)
- Substance: All of above (Layer 2)
- Research: What matters most in this industry (Layer 3)

**Generate:**
1. Business Goals ranked (which matters most NOW)
2. Target Groups ranked (which impacts top goal most)
3. Driving Forces ranked per persona (top 3 most urgent)

**Output Strategic Focus Statement:**
```markdown
## Strategic Focus

**Priority 1 Goal:** [Top business objective]
**Priority 1 User:** [Primary persona]
**Priority 1 Drivers:** [Top 3 forces for primary persona]

This combination guides all design decisions.
```

---

## Layer 5: Self-Review Against Standards

**Purpose:** Check generated output against WDS rubric, identify gaps, decide if refinement needed.

### Self-Review Process

**Run through rubric systematically:**

#### Completeness Check (5 min)

```markdown
## Self-Review: [Artifact] - Iteration {{N}}

### Completeness: {{X}}/9

**Core Sections:**
- [✅/❌] Business Goals (vision + SMART)
- [✅/❌] Product Hub
- [✅/❌] Target Groups (3-4, prioritized)
- [✅/❌] Detailed Personas (psychological depth)
- [✅/❌] Positive Drivers (3-5 per persona)
- [✅/❌] Negative Drivers (3-5 per persona)
- [✅/❌] Prioritization

**Optional:**
- [✅/❌] Feature Impact Analysis
- [✅/❌] Visual Diagram

**Score:** {{X}}/9 (Target: 7+ core minimum)
```

#### Quality Criteria Check (10 min)

For each of 7 criteria: ✅ (met), ⚠️ (partial), ❌ (gap)

```markdown
### Quality Criteria: {{X}}/7

1. **Strategic Depth:** [✅/⚠️/❌]
   - Evidence: [Quote or example showing depth]
   - Gap (if any): [What needs more depth]

2. **Usage Context:** [✅/⚠️/❌]
   - Evidence: [Are goals contextual?]
   - Gap (if any): [Examples of non-contextual goals]

3. **Persona Depth:** [✅/⚠️/❌]
   - Evidence: [Psychological vs demographic?]
   - Gap (if any): [Which personas need more psychology]

4. **Negative Drivers:** [✅/⚠️/❌]
   - Evidence: [Balance of positive vs negative]
   - Gap (if any): [Missing or weak negative drivers]

5. **Focused Scope:** [✅/⚠️/❌]
   - Evidence: [3-4 groups? Or too many?]
   - Gap (if any): [Need to consolidate?]

6. **Actionable Specificity:** [✅/⚠️/❌]
   - Evidence: [Concrete examples vs vague]
   - Gap (if any): [Which forces too vague]

7. **Business Connection:** [✅/⚠️/❌]
   - Evidence: [Can trace users to goals?]
   - Gap (if any): [Floating users without connection]

**Score:** {{X}}/7 (Target: 5+ minimum, 7 excellent)
```

#### Common Mistakes Check (5 min)

```markdown
### Common Mistakes: {{X}}/4 avoided

- [✅/❌] No solutions on map (drivers about psychology, not features)
- [✅/❌] No generic forces (specific to this context)
- [✅/❌] No demographic personas (focused on psychology)
- [✅/❌] Clear priority (ranking exists and defensible)

**Score:** {{X}}/4 (Target: 4/4 required)
```

#### Best Practices Check (5 min)

```markdown
### Best Practices: {{X}}/4 followed

- [✅/❌] Alliterative persona names
- [✅/❌] Equal weight to negative drivers
- [✅/❌] Context explicitly stated
- [✅/❌] Visual diagram created

**Score:** {{X}}/4 (Target: 2+ minimum, 4 excellent)
```

#### Overall Assessment

```markdown
### Overall Quality Score: {{X}}/10

**Completeness:** {{X}}/9
**Quality:** {{X}}/7
**Mistakes Avoided:** {{X}}/4
**Best Practices:** {{X}}/4

**Threshold Analysis:**
- Minimum (present to user): 7+ complete, 5+ quality, 4 mistakes, 2+ practices
- Excellent: 9+ complete, 7 quality, 4 mistakes, 4 practices

**Current Status:** [Meets minimum / Meets excellent / Needs refinement]

**Key Gaps:**
1. [Specific gap with evidence]
2. [Specific gap with evidence]

**Refinement Decision:** [Continue / Refine / Switch to Workshop]
```

### Refinement Planning (If Needed)

```markdown
## Refinement Plan: Iteration {{N+1}}

### Gap 1: [Description]
**Current:** [What's wrong]
**Target:** [What it should be]
**Action:** [Specific change]
**Reference:** [Rubric criteria or example guiding this]

### Gap 2: [Description]
[Same structure]

### Expected Improvement:
- Completeness: {{current}} → {{target}}
- Quality: {{current}} → {{target}}
- Overall: {{current}}/10 → {{target}}/10
```

**Then generate Iteration N+1 with refinements applied, using full 5-layer process again.**

### Self-Review for Phase 3 (Scenarios)

**Apply the following quality rubric against each generated scenario. The rubric has 4 dimensions:**

#### Dimension 1: Completeness (7 sections)

For each scenario, verify all 7 components exist:

- [ ] **Core Feature** — Clear statement of what scenario covers, aligned to business goal
- [ ] **Entry Point** — Specific starting location with device, context, and discovery method
- [ ] **Mental State** — All three present: Trigger (what happened), Hope (what they want), Worry (what they fear)
- [ ] **Success Goals** — Both present: User success (tangible) + Business success (measurable)
- [ ] **Shortest Path** — Linear steps listed with name + purpose, no branches
- [ ] **Scenario Name** — Persona name in title, ID assigned (01, 02...)
- [ ] **Trigger Map Connections** — Persona named, driving forces listed, business goal referenced

**Minimum:** 6/7 present (Trigger Map Connections can be implicit if obvious from other sections)

#### Dimension 2: Quality Criteria (7 checks)

**2.1 Persona Alignment**
- Scenario serves a specific persona from Trigger Map (not generic "user")
- Mental state matches persona's psychological profile
- Entry point reflects persona's behavior patterns

**2.2 Mental State Richness**
- All three components (Trigger/Hope/Worry) are specific and visceral
- You can FEEL the user's emotional state
- Mental state informs design decisions

*Bad:* "User is interested in the product"
*Good:* "Panicked — motorhome broke down, family vacation at risk, unfamiliar area"

**2.3 Mutual Success Clarity**
- Both successes are specific and measurable
- Business success is not just "revenue" or "engagement"
- User success is tangible (not "satisfied" or "happy")

*Bad:* Business: "Get more customers" / User: "Successfully use the site"
*Good:* Business: "High-intent tourist call captured, info call avoided" / User: "Confirmed capability, got location, feels confident calling"

**2.4 Sunshine Path Focus**
- Path is completely linear (no "if" statements)
- Error states and edge cases deferred
- This is the absolute happiest path

**2.5 Minimum Viable Steps**
- Each step moves meaningfully toward success
- No unnecessary pages or detours
- Can you remove any step without breaking the flow?

**2.6 Entry Point Realism**
- Describes HOW user actually discovered this
- Includes device context
- Reflects real-world behavior

*Bad:* "User opens app"
*Good:* "Tourist googles 'car repair Öland' on mobile at gas station, clicks top result"

**2.7 Business Goal Connection**
- Traces to specific business goal from Trigger Map
- Business value is explicit, not assumed
- User success drives business success (not competes)

**Minimum:** 5/7 fully met

#### Dimension 3: Common Mistakes (7 checks)

All 7 must be avoided — any single mistake requires correction.

**3.1 Edge Cases in Sunshine Path**
Check: Are there any "if" statements, error states, or branches?
Fix: Remove all conditional logic. Document edge cases separately.

**3.2 Feature-First Naming**
Check: Does the scenario name describe a feature or a user goal?
Fix: Rename to persona + purpose format. Bad: "Homepage and Services" / Good: "Hasse's Emergency Search"

**3.3 Missing Mental State**
Check: Is mental state present with all three components?
Fix: Add Trigger/Hope/Worry with specific, visceral descriptions.

**3.4 Vague Page Descriptions**
Check: Do pages have just names, or names + purpose?
Fix: Add what user accomplishes at each step. Bad: "1. Homepage 2. Services" / Good: "1. Homepage — confirms mechanic fixes motorhomes 2. Contact — gets phone + directions"

**3.5 Generic Persona**
Check: Does scenario use a Trigger Map persona with name?
Fix: Replace "user" with specific persona name and driving forces.

**3.6 Missing Business Value**
Check: Is business success explicitly defined and measurable?
Fix: Add specific business outcome connected to Trigger Map goal.

**3.7 Bloated Descriptions**
Check: Does any single component (Entry Point, Mental State, Success Goals) exceed 2 sentences?
Fix: Trim to bullet-point essentials. Entry points: device + context + discovery. Mental state: one phrase per component. Success: one measurable statement each.

**Minimum:** 7/7 avoided (zero tolerance for mistakes)

#### Dimension 4: Best Practices (4 checks)

**4.1 Persona in Scenario Name** — Scenario title includes persona name (e.g., "Hasse's Emergency Search")
**4.2 Highest-Value Persona First** — Scenario 01 serves the Primary persona.
**4.3 One Job Per Scenario** — Each scenario accomplishes ONE clear job-to-be-done. No scope creep.
**4.4 Driving Forces Explicitly Linked** — Scenario states which specific wants/fears from Trigger Map it addresses:
- ✅ Want: [specific force]
- ❌ Fear: [specific force]

**Minimum:** 2/4 followed

#### Scoring Summary Template

```
## Quality Review: [Scenario ID]

**Completeness:** [X]/7
**Quality:** [X]/7
**Mistakes Avoided:** [X]/7
**Best Practices:** [X]/4

**Status:** [Excellent / Good / Needs Work]
**Gaps:** [list or "None"]
```

| Level | Complete | Quality | Mistakes | Practices |
|-------|----------|---------|----------|-----------|
| Minimum | 6/7 | 5/7 | 7/7 | 2/4 |
| Excellent | 7/7 | 7/7 | 7/7 | 4/4 |

#### Validation Standards

**What makes a valid scenario — minimum requirements (must pass):**
1. All 7 components present (name, feature, entry, mental state, success, path, TM connections)
2. Path is truly linear (zero branches)
3. Mental state is specific and visceral
4. Both success goals are measurable
5. Trigger Map connections are explicit

**WDS Navigation Conventions:**
- Use user-facing page names (not technical: "Tjänster", not "services-page")
- Consistent naming across scenarios (same page = same name)
- Entry page must be reachable from the described discovery method
- Each step transitions naturally to the next
- Final step has clear success marker (✓)
- No dead ends, no impossible jumps
- Pages appearing in 2+ scenarios must serve consistent purposes

**SEO Integration:**
- Every page should map to at least one keyword from the Phase 1 keyword map
- Page names should be compatible with planned URL slugs
- No keyword cannibalization (two pages competing for same keyword)

**Validation Severity Levels:**
| Level | Meaning | Action |
|-------|---------|--------|
| ❌ Critical | Blocks Phase 4 progress | Must fix before handover |
| ⚠️ Warning | Quality concern | Should fix, can proceed |
| ✅ Pass | Meets standards | No action needed |

**Refinement triggers for scenarios:**
- Any Dimension 3 failure (Common Mistakes) → immediate fix (zero tolerance)
- Dimension 1 below 6/7 → fix before proceeding
- Dimension 2 below 5/7 → refine mental state and success goals first (most common gap)
- Bloated descriptions (Dimension 3.7) → trim to max lengths before any other refinement

---

## Mode-Specific Presentation

### Suggest Mode: User Checkpoints

**After each iteration, show:**

```markdown
## Suggest Mode: Iteration {{N}}

### What I Created
[Summary of artifact section generated]

Key elements:
- [Bullet point summary]
- [Sample content]

### Learning & Research Applied
**WDS Form:** [What methodology guided structure]
**Project Context:** [What prior artifacts informed this]
**Domain Research:** [What insights enhanced this]

### Self-Review Results
**Quality Score:** {{X}}/10

**Strengths:**
- ✅ [What's working well]
- ✅ [What meets standards]

**Gaps Identified:**
- ❌ [What needs improvement]
- ⚠️ [What's partial]

**Refinement Plan:**
[If needed, what will be improved in next iteration]

---

**👉 User Checkpoint:** What would you like to do?

[C] Continue - Looks good, proceed (or refine if gaps exist)
[A] Adjust - I have feedback to guide refinement
[V] View Full - Show me complete generated content now
[S] Stop - Switch to Workshop Mode for dialog

Type your choice or provide feedback:
```

**Wait for user input. Do NOT continue without approval.**

### Dream Mode: Autonomous Progress

**Show running updates:**

```markdown
## Dream Mode: Trigger Map Generation

### Progress

🔄 **Business Goals**
   Generated → Self-reviewed → Quality: 8/10 → ✅ Threshold met

🔄 **Target Groups**
   Generated → Self-reviewed → Quality: 7/10 → Gaps found → Refining...
   Iteration 2 → Self-reviewed → Quality: 9/10 → ✅ Threshold met

🔄 **Driving Forces**
   Generated → Self-reviewed → Quality: 8/10 → ✅ Threshold met

🔄 **Prioritization**
   Generated → Self-reviewed → Quality: 9/10 → ✅ Threshold met

---

**✅ Generation Complete**

**Final Quality Assessment:** 9/10
- Completeness: 9/9 ✅
- Quality Criteria: 7/7 ✅
- Mistakes Avoided: 4/4 ✅
- Best Practices: 4/4 ✅

📄 **Trigger Map created:** {output_folder}/B-Trigger-Map/trigger-map.md

Would you like to review the full Trigger Map now?

---

💬 **Note:** You could have typed "stop" at any time to interrupt.
```

**No user checkpoints - continue autonomously until complete or interrupted.**

---

## Layer 6: Completeness Gate (Dream Mode Only)

**Purpose:** After all Layer 5 self-reviews pass, verify ALL required output documents exist before presenting results.

### Required Documents Checklist

Run this gate after autonomous generation completes:

**Mandatory files in `{output_folder}/B-Trigger-Map/`:**
- [ ] `00-trigger-map.md` — Hub document with Mermaid diagram
- [ ] `01-Business-Goals.md` — Vision + SMART objectives
- [ ] One persona document per target group (`02-XX.md`, `03-XX.md`, etc.)
- [ ] `05-Key-Insights.md` — Strategic insights summary

**Conditional files:**
- [ ] `06-Feature-Impact.md` — Only if feature impact workshop was completed

### Validation Rules:
- Each file must be non-empty (contains actual content, not just headers)
- Hub document must contain a Mermaid code block
- Persona count must match the number of target groups from workshops
- Business Goals must contain vision + at least 2 SMART objectives

### IF any file missing or empty:
1. Identify which file is missing
2. Re-run Layer 4 generation for that specific artifact
3. Re-run Layer 5 self-review for that artifact
4. Re-check this gate

### IF 3 retries fail for any file:
Switch to Suggest mode for the missing artifact:
> "I generated most of the Trigger Map autonomously, but [missing artifact] needs your input. Let's switch to Suggest mode for this section."

---

## Final Output Presentation

**When all steps complete and threshold met:**

```markdown
## Trigger Map Generation Complete ✅

**Mode:** {{Suggest/Dream}}
**Total Iterations:** {{count across all steps}}
**Final Quality Score:** {{X}}/10

### Generated Artifact
**Location:** {output_folder}/B-Trigger-Map/trigger-map.md

**Contents:**
- Business Goals: {{vision}} + {{N}} SMART objectives
- Target Groups: {{N}} personas ({{names}})
- Driving Forces: {{N}} positive + {{N}} negative per persona
- Prioritization: Complete ranking
- {{If created}} Feature Impact Analysis
- {{If created}} Visual Mermaid Diagram

### Quality Validation
- ✅ WDS Form Applied: All structure requirements met
- ✅ Project Context Used: All Product Brief insights integrated
- ✅ Domain Research: Industry insights enhanced generation
- ✅ Self-Review: All quality criteria met

### Strategic Insights
[2-3 key takeaways from the completed Trigger Map]

### What's Next
This Trigger Map feeds into:
- **Phase 4 (UX Design)** - Personas and drivers guide scenario design
- **Feature Prioritization** - Feature Impact scores guide roadmap
- **Content Strategy** - Driving forces guide messaging

Would you like to:
- [R] Review the full Trigger Map
- [A] Make adjustments
- [N] Continue to next phase
```

---

## Switching to Workshop Mode

**If 5 iterations on ANY step without meeting threshold:**

```markdown
## Quality Threshold Challenge

On step: [Step name]

After 5 iterations, this section hasn't met minimum quality standards. This suggests human insight would be valuable.

**Current State:**
- Quality Score: {{X}}/10
- Persistent gaps: [List issues that won't resolve]

**Recommendation:** Switch to Workshop Mode for this section

I'll facilitate questions specifically about [the gap areas] to capture your expertise and ensure quality.

Would you like to:
[W] Switch to Workshop Mode for this section (recommended)
[C] Continue autonomous generation (may repeat same issues)
[V] View current state and decide
```

---

## Design Log Documentation

**Throughout process, maintain comprehensive agent experience log:**

```markdown
# Agent Experience: Dream Up - Källa Trigger Map

**Created:** {{date time}}
**Mode:** {{Suggest/Dream}}
**Phase:** 2 (Trigger Mapping)
**Project:** Källa Fordonservice

---

## Layer 1: WDS Form Learned
[Full learning documentation]

---

## Layer 2: Project Context (Cumulative)

### Initial: Product Brief
[Extracted substance]

### Added: Business Goals
[After generation]

### Added: Target Groups
[After generation]

### Added: Driving Forces
[After generation]

### Added: Prioritization
[After generation]

---

## Layer 3: Domain Research

### Step: Business Goals
[Research conducted and insights]

### Step: Target Groups
[Research conducted and insights]

### Step: Driving Forces
[Research conducted and insights]

### Step: Prioritization
[Research conducted and insights]

---

## Generation & Self-Review Log

### Business Goals - Iteration 1
[Full self-review]

### Target Groups - Iteration 1
[Full self-review]

### Target Groups - Iteration 2 (refinement)
[Full self-review]

[Continue for all steps and iterations]

---

## Final Output

**Artifact:** {path}
**Quality Score:** {{X}}/10
**User Approved:** {{Yes/Pending}}

**Key Decisions Made:**
[Strategic choices during generation]
```

**Save agent experience at:**
```
{output_folder}/_progress/agent-experiences/{date}-trigger-map-{{mode}}.md
```

---

## Tips for Quality Self-Review

### Be Honest, Not Optimistic
- Mark ⚠️ partial even if "pretty good"
- Mark ❌ gap if rubric shows higher bar
- Don't inflate scores to meet threshold faster

### Use Rubric Examples Directly
- Compare output to good/bad examples in rubric
- If matches "bad example" → ❌
- If between → ⚠️
- If matches "good example" → ✅

### Actionability Test
- Can designer create feature from this driving force?
- Would two designers interpret this persona the same?
- Can I trace this user to a specific business goal?

### Context is King
- "Want to save time" = ❌ Generic
- "Want to find phone within 3 seconds because stressed on vacation" = ✅ Contextual

### Psychology Over Demographics
- "Sarah, 35, consultant" = ❌ Demographic
- "Sophie struggles with imposter syndrome when presenting to executives" = ✅ Psychological

---

*This guide enables Saga to execute Suggest and Dream modes for Phase 2 Trigger Mapping with quality control through systematic 5-layer generation and self-review.*
