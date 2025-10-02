# <!-- Powered by BMAD™ Core -->

# Core Development Principles

Shared philosophy and principles for all JavaScript/TypeScript development agents. These principles guide decision-making across the entire stack.

## Universal Principles

**Type Safety First**: Catch errors at compile time, not runtime. Use TypeScript strict mode, explicit types, and leverage inference.

**Security First**: Every endpoint authenticated, all inputs validated, all outputs sanitized. Never trust client input.

**Developer Experience**: Fast feedback loops, clear error messages, intuitive APIs, comprehensive documentation.

**Performance Matters**: Optimize for perceived performance first. Measure before optimizing. Cache strategically.

**Maintainability**: Clean code organization, consistent patterns, automated testing, comprehensive documentation.

**YAGNI (You Aren't Gonna Need It)**: Don't over-engineer for future needs. Build for 2x scale, not 100x. Prefer boring, proven technology.

**Component-First Thinking**: Every piece is reusable, well-tested, and composable (applies to UI components, services, modules).

**Clean Architecture**: Separation of concerns, dependency injection, testable code. Controllers handle I/O, services handle logic, repositories handle data.

**Observability**: Logging, monitoring, error tracking. You can't improve what you don't measure.

## Context Efficiency Philosophy

All agents optimize token usage through **high-signal communication**:

**Reference, Don't Repeat**: Point to file paths instead of duplicating content
- ✅ "Implementation in `src/services/auth.service.ts`"
- ❌ [Pasting entire file contents]

**Provide Summaries**: After creating artifacts, give 2-3 sentence overview with file reference
- ✅ "Created authentication service with JWT + refresh tokens. See `src/services/auth.service.ts` for implementation."
- ❌ [Explaining every line of code written]

**Progressive Detail**: Start with high-level structure, add details only when implementing
- ✅ Start: "Need authentication with JWT" → Later: "bcrypt rounds, token expiry settings"
- ❌ Upfront: Every security configuration detail before deciding approach

**Archive Verbose Content**: Keep implementations/discussions in files, reference them
- ✅ Long discussions → `docs/decisions/auth-strategy.md` → Reference in checkpoint
- ❌ Repeating entire discussion in every message

**Checkpoint Summaries**: At phase transitions, compress context into max 100-line summaries containing:
- Final decisions and rationale
- Artifact file paths
- Critical constraints and dependencies
- What to do next

## Just-in-Time Context Retrieval

**CRITICAL**: Agents must retrieve context **only when making specific decisions**, not upfront. This prevents token waste and maintains focus.

### Start Minimal (Every Task)

**Load at Task Start**:
- ✅ Your role definition and core principles (this file)
- ✅ The specific task description and requirements
- ✅ Any explicitly referenced artifacts (checkpoint files, requirements docs)
- ❌ NO technology-specific guides yet
- ❌ NO implementation patterns yet
- ❌ NO best practices yet

**Example**: React Developer receives task "Build user profile component"
- Load: Role definition, task description, requirements
- Skip: state-management-guide.md, react-patterns.md, testing-strategy.md (load later when needed)

### Load on Decision Points (Not Before)

**Decision-Triggered Loading**:

1. **Technology Selection** → Load technology-stack-guide.md
   - ONLY when choosing framework/library
   - NOT if stack already decided

2. **Implementation Pattern** → Load pattern-specific guide
   - ONLY when implementing that specific pattern
   - Example: Loading GraphQL patterns ONLY if building GraphQL API

3. **Security Concern** → Load security-guidelines.md
   - ONLY when handling auth, sensitive data, or user input
   - NOT for every task

4. **Performance Issue** → Load performance optimization guides
   - ONLY when performance requirements specified
   - NOT preemptively

5. **Deployment Decision** → Load deployment-strategies.md
   - ONLY when choosing deployment approach
   - NOT during feature development

### Question Before Loading

**Before loading any data file, ask**:
- Is this decision being made RIGHT NOW?
- Can I defer this decision to implementation?
- Is this information in the checkpoint/requirements already?

**Examples**:

❌ **Over-Loading**: "Building auth system" → Loading security-guidelines.md, api-implementation-patterns.md, deployment-strategies.md, database-optimization.md
- WHY BAD: Most won't be needed yet

✅ **JIT Loading**: "Building auth system" → Start with requirements → Load security-guidelines.md when designing auth flow → Load api-implementation-patterns.md when implementing endpoints → Skip deployment/optimization (not needed yet)

❌ **Over-Loading**: "Design architecture" → Loading ALL data files (technology-stack-guide.md, deployment-strategies.md, security-guidelines.md, best-practices.md, etc.)
- WHY BAD: Won't use 80% of it in architecture phase

✅ **JIT Loading**: "Design architecture" → Load technology-stack-guide.md for stack decision → Load deployment-strategies.md for hosting decision → Load security-guidelines.md IF handling sensitive data → Skip implementation patterns (for later)

### Context Loading Decision Tree

```
Task Received
├─ Load: Role + Task + Requirements (ALWAYS)
├─ Checkpoint exists? → Load checkpoint (skip full history)
└─ Then ask: What decision am I making RIGHT NOW?
   │
   ├─ Choosing Stack/Framework?
   │  └─ Load: technology-stack-guide.md
   │
   ├─ Implementing API endpoints?
   │  ├─ What type? REST/GraphQL/tRPC?
   │  └─ Load: api-implementation-patterns.md (specific section only)
   │
   ├─ Handling Authentication/Authorization?
   │  └─ Load: security-guidelines.md
   │
   ├─ Database schema design?
   │  └─ Load: database-design-patterns.md
   │
   ├─ Deployment/Hosting decision?
   │  └─ Load: deployment-strategies.md
   │
   ├─ Performance optimization?
   │  └─ Load: performance-optimization.md
   │
   ├─ Code review/quality check?
   │  └─ Load: development-guidelines.md + relevant checklist
   │
   └─ General implementation?
      └─ Load NOTHING extra - use role knowledge
         (Load specific guides only if encountering decision)
```

### Role-Specific Context Limits

**React Developer**:
- Default load: core-principles.md only
- Load state-management-guide.md ONLY when choosing state solution
- Load component-design-guidelines.md ONLY when building complex component
- SKIP: Backend patterns, API specs (unless integrating), database docs

**Node Backend Developer**:
- Default load: core-principles.md only
- Load framework comparison ONLY when choosing Express/Fastify/NestJS
- Load database patterns ONLY when writing queries
- SKIP: React patterns, frontend state management, CSS guides

**Solution Architect**:
- Default load: core-principles.md + requirements
- Load technology-stack-guide.md for stack decisions
- Load deployment-strategies.md for hosting decisions
- Load security-guidelines.md IF requirements mention sensitive data
- SKIP: Implementation patterns (delegate to implementation agents)

**API Developer**:
- Default load: core-principles.md only
- Load api-implementation-patterns.md for specific API type (REST/GraphQL/tRPC section only)
- SKIP: Frontend patterns, deployment strategies, database optimization

**TypeScript Expert**:
- Default load: core-principles.md only
- Load tsconfig reference ONLY when configuring TypeScript
- Load advanced patterns ONLY when implementing complex types
- SKIP: Framework-specific guides, deployment, testing (unless TS-specific)

### Progressive Context Expansion

**3-Stage Loading Pattern**:

**Stage 1 - Task Start (Minimal)**:
- Role definition
- Task requirements
- Referenced artifacts only

**Stage 2 - Decision Point (Targeted)**:
- Load specific guide for current decision
- Load ONLY relevant section (not entire file)
- Example: Load "REST API" section from api-implementation-patterns.md, skip GraphQL/tRPC sections

**Stage 3 - Implementation (On-Demand)**:
- Load patterns as you encounter need
- Load examples when unclear
- Load checklists when validating

### Anti-Patterns (What NOT to Do)

❌ **"Load Everything Just in Case"**
- Loading all data files at task start
- "Might need it later" is NOT a valid reason

❌ **"Load Full File for One Detail"**
- Load specific section only
- Reference file path for full details

❌ **"Load Before Decision Needed"**
- Don't load deployment guide during feature design
- Don't load implementation patterns during architecture phase

❌ **"Load Other Agents' Context"**
- Backend developer doesn't need React state management
- Frontend developer doesn't need database optimization

### Validation Questions

**Before loading any file, ask yourself**:
1. Am I making THIS specific decision RIGHT NOW?
2. Is this my role's responsibility?
3. Can this wait until implementation?
4. Is this already in checkpoint/requirements?

**If answer to #1 or #2 is NO → Don't load it**

### Token Budget Awareness

**Typical Token Costs**:
- Role definition: ~200-300 tokens
- Task description: ~100-500 tokens
- Data file (full): ~1,000-3,000 tokens
- Data file (section): ~200-500 tokens
- Checkpoint: ~500-1,000 tokens

**Target Budget**:
- Task start: <1,000 tokens total
- Per decision: +200-500 tokens (specific guide section)
- Full workflow: <10,000 tokens cumulative (use checkpoints)

**If approaching budget limit**: Create checkpoint, archive verbose context, start fresh phase.

## Runtime Token Monitoring

**CRITICAL**: Agents must actively monitor token usage during execution and self-regulate to stay within budgets.

### Token Self-Assessment Protocol

**At Task Start**:
```
Task: [task name]
Estimated Budget: [X tokens]

Loaded:
- Role definition: ~250 tokens
- core-principles.md: ~300 tokens
- Task requirements: ~[Y] tokens
- [other files]: ~[Z] tokens
TOTAL LOADED: ~[sum] tokens

Remaining Budget: [budget - sum] tokens
```

**During Execution** (every 2-3 decisions):
```
Token Check:
- Starting context: [X] tokens
- Loaded since last check: [Y] tokens
- Current estimated total: [X+Y] tokens
- Budget: [Z] tokens
- Status: [OK | WARNING | EXCEEDED]
```

**Before Loading Any File**:
```
Pre-Load Check:
- Current context: ~[X] tokens
- File to load: ~[Y] tokens (estimated)
- After load: ~[X+Y] tokens
- Budget: [Z] tokens
- Decision: [PROCEED | SKIP | CHECKPOINT FIRST]
```

### Checkpoint Triggers

**MUST create checkpoint when**:
- ✅ Context exceeds 3,000 tokens
- ✅ Completing a major phase (architecture → implementation)
- ✅ Before loading would exceed budget
- ✅ After 5+ agent interactions in sequence
- ✅ Detailed discussion exceeds 1,000 tokens

**Checkpoint Process**:
1. Estimate current context size
2. Create checkpoint summary (max 100 lines, ~500 tokens)
3. Archive verbose content to `docs/archive/`
4. Start next phase with checkpoint only
5. Token reduction: Expect 80%+ compression

**Example**:
```
Phase complete. Estimating context:
- Architecture discussion: ~2,500 tokens
- Technology decisions: ~1,200 tokens
- Requirements: ~800 tokens
TOTAL: ~4,500 tokens

Action: Creating checkpoint
- Checkpoint summary: ~500 tokens
- Token reduction: 89%
- Archived: Full discussion to docs/archive/architecture-phase/
```

### Budget Warning System

**Token Status Levels**:

🟢 **GREEN (0-50% of budget)**:
- Status: Healthy
- Action: Continue normally
- Example: 800/2000 tokens used

🟡 **YELLOW (50-75% of budget)**:
- Status: Warning
- Action: Be selective with additional loads
- Example: 1,500/2000 tokens used
- Strategy: Load only critical guides, skip nice-to-haves

🟠 **ORANGE (75-90% of budget)**:
- Status: Critical
- Action: Stop loading new context
- Example: 1,700/2000 tokens used
- Strategy: Use existing context only, prepare checkpoint

🔴 **RED (>90% of budget)**:
- Status: Exceeded
- Action: Create checkpoint IMMEDIATELY
- Example: 1,850/2000 tokens used
- Strategy: Checkpoint NOW, start fresh phase

### Self-Monitoring Format

**Maintain Mental Token Accounting**:

Throughout task execution, mentally track:

```
=== TOKEN ACCOUNTING ===

FIXED CONTEXT (loaded at start):
- Role definition: ~250
- Core principles: ~300
- Task requirements: ~500
Subtotal: ~1,050 tokens

DECISION CONTEXT (loaded during execution):
- technology-stack-guide.md: ~1,500
- security-guidelines.md: ~1,000
Subtotal: ~2,500 tokens

CONVERSATION (generated during work):
- Discussion and analysis: ~800
- Code examples: ~400
Subtotal: ~1,200 tokens

TOTAL ESTIMATED: ~4,750 tokens
BUDGET: 5,000 tokens
STATUS: 🟠 ORANGE - Approaching limit
ACTION: No more loads, complete task with current context

=== END ACCOUNTING ===
```

### Estimation Guidelines

**Token Estimation Rules**:

- **1 word ≈ 1.3 tokens** (on average)
- **1 line of code ≈ 15-25 tokens**
- **1 markdown paragraph ≈ 50-100 tokens**
- **Agent role file ≈ 200-400 tokens**
- **Data file (full) ≈ 1,000-3,000 tokens**
- **Data file (section) ≈ 200-500 tokens**
- **Checkpoint summary ≈ 500-800 tokens**
- **Architecture doc ≈ 2,000-4,000 tokens**

**Quick Estimation**:
- Count words in content
- Multiply by 1.3
- Round up for safety

**File Size Indicators**:
- Small file (<100 lines): ~500 tokens
- Medium file (100-300 lines): ~1,000-1,500 tokens
- Large file (300-500 lines): ~2,000-3,000 tokens
- Very large file (>500 lines): ~3,000+ tokens

### Runtime Optimization Tactics

**When Approaching Budget**:

1. **Use Section Loading**: Load only relevant section of large file
   - Instead of: Full api-implementation-patterns.md (~1,500 tokens)
   - Load: REST section only (~300 tokens)
   - Savings: 80%

2. **Reference Don't Load**: Point to file path instead of loading
   - Instead of: Loading best-practices.md
   - Say: "Following patterns in best-practices.md section 3.2"
   - Savings: 100% (no load needed)

3. **Checkpoint Intermediate State**: Don't wait for phase end
   - If discussion getting long, checkpoint NOW
   - Compress verbose analysis into key decisions
   - Continue with lightweight checkpoint

4. **Defer Non-Critical Loads**: Skip nice-to-have context
   - If 🟡 YELLOW or above, load ONLY must-haves
   - Skip optimization guides if not performance-critical
   - Skip best practices if pattern already clear

5. **Use Role Knowledge**: Lean on built-in expertise
   - Instead of: Loading guide for basic patterns
   - Use: Agent's inherent role knowledge
   - When: Standard, well-known patterns

### Multi-Agent Workflow Monitoring

**Workflow-Level Tracking**:

When multiple agents work sequentially:

```
WORKFLOW TOKEN TRACKING

Phase 1: Requirements (Analyst)
- Context: ~800 tokens
- Output: requirements.md
- Checkpoint: ~600 tokens
- Handoff: Pass checkpoint only

Phase 2: Architecture (Solution Architect)
- Receive: checkpoint (~600)
- Load: tech-stack-guide (~1,500)
- Context: ~2,800 tokens
- Output: architecture.md
- Checkpoint: ~800 tokens
- Handoff: Pass checkpoint only

Phase 3: Implementation (Developers)
- Receive: checkpoint (~800)
- Load: role-specific guides (~500-1,000)
- Context: ~1,500-2,000 tokens
- No checkpoint needed (final phase)

TOTAL WORKFLOW: ~5,100 tokens (with checkpoints)
WITHOUT CHECKPOINTS: ~15,000+ tokens (accumulated context)
SAVINGS: 66%
```

### Checkpoint Quality Metrics

**Effective Checkpoint Indicators**:
- ✅ Reduces context by 80%+ (e.g., 4,000 → 800 tokens)
- ✅ Contains all critical decisions
- ✅ Includes all artifact paths
- ✅ Next agent can proceed without loading previous phase
- ✅ Max 100 lines (~500-800 tokens)

**Poor Checkpoint Indicators**:
- ❌ Only 30-50% reduction (too verbose)
- ❌ Missing key decisions or rationale
- ❌ Next agent needs to reload original context
- ❌ Over 150 lines (defeats purpose)

### Self-Regulation Commitment

**Every agent commits to**:

1. **Estimate before loading**: Know token cost before loading any file
2. **Track cumulative usage**: Maintain mental accounting of context size
3. **Respect budget warnings**: React to 🟡🟠🔴 status appropriately
4. **Create checkpoints proactively**: Don't wait for red status
5. **Load sections not files**: When possible, load only relevant sections
6. **Use role knowledge first**: Load guides only when truly needed

### Example: Good Runtime Monitoring

```
Task: Design REST API for user service
Budget: 2,000 tokens

[Start]
Loaded: Role (250) + core-principles (300) + requirements (400) = 950 tokens
Status: 🟢 GREEN (48% of budget)

[Decision: Need REST patterns]
Pre-check: Current 950 + api-patterns REST section (300) = 1,250
Status: 🟢 GREEN (63% of budget) → PROCEED

Loaded: REST section
Context: 1,250 tokens

[Decision: Need auth patterns?]
Pre-check: Current 1,250 + security-guidelines (1,000) = 2,250
Status: 🔴 RED (113% of budget) → DEFER
Decision: Use basic auth pattern from role knowledge, skip loading guide

[Complete]
Final context: ~1,400 tokens (with output)
Status: 🟢 GREEN (70% of budget)
Result: Task complete, stayed within budget
```

### Example: Bad Runtime Monitoring (Don't Do This)

```
Task: Design REST API for user service
Budget: 2,000 tokens

[Start]
Loaded: Role + core-principles + requirements + api-patterns (full) +
        security-guidelines + best-practices + deployment-strategies
Context: ~5,500 tokens
Status: 🔴 RED (275% of budget) - EXCEEDED

Problem: Loaded everything upfront without checking budget
Result: Token waste, exceeded budget, needed checkpoint immediately
```

## Prompt Caching Optimization

**POWERFUL**: Prompt caching can reduce token costs by ~90% for static content and improve response times by caching reusable context.

### How Prompt Caching Works

**Concept**: AI providers cache static portions of prompts across multiple requests, dramatically reducing token costs and latency.

**Benefits**:
- **Token Savings**: ~90% reduction for cached content (5,000 tokens → 500 tokens charged)
- **Speed**: Faster response times (cached content pre-processed)
- **Cost**: Significant cost reduction for repeated context

**Requirements**:
- Content must be **static** (doesn't change between requests)
- Content must be **large enough** (typically >1,000 tokens) to benefit from caching
- Content must be in the **prefix** (beginning of prompt, before dynamic content)

### Cache-Friendly Content Structure

**Optimal Loading Order** (Stable → Dynamic):

```
1. CACHEABLE (Static - Load First)
├─ Agent role definition (changes rarely)
├─ core-principles.md (stable reference)
├─ Data files (technology-stack-guide.md, etc. - stable reference)
├─ Architecture documents (stable after creation)
└─ Checkpoints (stable after creation)

2. SEMI-CACHEABLE (Changes Occasionally)
├─ Task templates (stable structure, variable content)
├─ Workflow definitions (stable structure)
└─ Requirements docs (stable after approval)

3. NON-CACHEABLE (Dynamic - Load Last)
├─ Current task description (unique per task)
├─ User questions/requests (unique per interaction)
├─ Conversation history (constantly changing)
└─ Real-time data (changes frequently)
```

**Golden Rule**: **Static content first, dynamic content last**

### What to Cache vs Not Cache

**✅ CACHE (Static Reference Material)**:
- Agent role definitions
- core-principles.md
- technology-stack-guide.md
- security-guidelines.md
- api-implementation-patterns.md
- deployment-strategies.md
- development-guidelines.md
- architecture-patterns.md
- All data/* files (stable reference)
- Completed architecture documents
- Finalized checkpoints

**⚠️ CACHE WITH CARE (Semi-Static)**:
- Requirements documents (after finalization)
- Architecture documents (after approval)
- API specifications (after freeze)
- Checkpoints (after phase completion)

**❌ DON'T CACHE (Dynamic)**:
- Current task description
- User questions/messages
- Conversation history
- Work-in-progress documents
- Code being reviewed
- Intermediate decisions
- Debug output
- Error messages

### Cache-Optimized Loading Pattern

**Pattern 1: Static Foundation First**

```
LOAD ORDER for cache efficiency:

[CACHEABLE BLOCK - Load First]
1. Agent role definition (~300 tokens) ─┐
2. core-principles.md (~5,000 tokens)   │
3. technology-stack-guide.md (~2,000)   ├─ CACHE THIS (~8,500 tokens)
4. security-guidelines.md (~1,200)      │  Saves ~7,650 tokens on subsequent calls
                                        ─┘
[DYNAMIC BLOCK - Load Last]
5. Current task description (~500 tokens) ─ Don't cache (changes every task)
6. User request (~200 tokens)             ─ Don't cache (unique)
```

**Result**:
- First call: ~8,700 tokens charged
- Subsequent calls: ~850 tokens charged (only dynamic content)
- Savings: ~90% per call after first

**Pattern 2: Task-Specific Caching**

For repetitive tasks (e.g., multiple features in same codebase):

```
[STABLE CACHE - Reuse Across Tasks]
1. Agent role
2. core-principles.md
3. Project architecture (finalized)
4. Tech stack decisions (finalized)
5. API specifications (frozen)

[TASK CACHE - Reuse Within Task]
6. Feature requirements (current feature)
7. Architecture checkpoint (current feature)

[NEVER CACHE]
8. Current subtask
9. User messages
```

### Cache Invalidation Strategy

**When to Refresh Cache**:

🔄 **REFRESH IMMEDIATELY** when:
- core-principles.md updated
- Architecture significantly changed
- Technology decisions revised
- Security guidelines updated
- Major refactoring completed

⏱️ **REFRESH PERIODICALLY**:
- Data files: Every major version update
- Agent roles: When capabilities change
- Best practices: When standards evolve

✅ **KEEP CACHED**:
- Stable reference material
- Finalized architecture
- Approved requirements
- Completed checkpoints

**Cache Lifetime Guidance**:
- **Long-lived** (days/weeks): core-principles, data files, agent roles
- **Medium-lived** (hours/days): architecture docs, requirements
- **Short-lived** (minutes): task context, checkpoints
- **No cache** (per request): user input, conversation

### Workflow-Level Caching

**Greenfield Project Workflow**:

```
Phase 1: Requirements
[CACHE]
- Analyst role
- core-principles.md
[NO CACHE]
- Stakeholder input
- Requirements being drafted

Phase 2: Architecture
[CACHE]
- Solution Architect role
- core-principles.md
- technology-stack-guide.md
- Requirements (now finalized)
[NO CACHE]
- Architecture being designed

Phase 3: Implementation
[CACHE]
- Developer roles
- core-principles.md
- Architecture docs (now finalized)
- Checkpoints (now stable)
[NO CACHE]
- Current feature
- Code being written

CACHE BENEFIT: Each phase reuses stable context from previous phases
```

### Cache Size Optimization

**Optimal Cache Sizes**:
- **Minimum**: 1,000+ tokens (smaller = not worth caching overhead)
- **Sweet Spot**: 5,000-15,000 tokens (balance reuse vs memory)
- **Maximum**: Per provider limits (Claude: up to ~3-4 cache blocks)

**Strategies**:

1. **Bundle Static Files**: Load related static files together in cacheable block
   ```
   GOOD: Load all data/* files together (one cache block)
   BAD: Load data files separately interspersed with dynamic content
   ```

2. **Stable Prefix**: Keep structure consistent across requests
   ```
   GOOD: Always load role → principles → guides in same order
   BAD: Random order each time (breaks cache)
   ```

3. **Cache Boundaries**: Clear separation between static and dynamic
   ```
   GOOD: [Static block] then [Dynamic block]
   BAD: Static → Dynamic → Static → Dynamic (cache thrashing)
   ```

### Cache-Aware JIT Loading

**Modify JIT Pattern for Caching**:

**Standard JIT** (No Caching Consideration):
- Load role + task
- Load guide when needed
- Load another guide when needed
- Load dynamic content

**Cache-Aware JIT**:
- Load ALL static guides upfront (cache block)
- Load dynamic task content
- Reference cached guides as needed
- NO additional loads (all guides pre-cached)

**When to Use Each**:

Use **Standard JIT** when:
- One-off task (no cache benefit)
- Highly dynamic workflow
- Frequently changing context

Use **Cache-Aware Loading** when:
- Repetitive tasks (multiple features)
- Long-running project (many interactions)
- Stable reference material
- Multiple agents using same context

### Cache Hit Indicators

**High Cache Hit Scenarios** (Good):
- ✅ Multiple features in same project
- ✅ Sequential agent interactions
- ✅ Iterative development (multiple sprints)
- ✅ Code review across similar code
- ✅ Consistent use of same data files

**Low Cache Hit Scenarios** (Less Benefit):
- ❌ One-off greenfield projects
- ❌ Constantly changing architecture
- ❌ Different tech stacks per task
- ❌ Unique context each time

### Caching Best Practices

**DO**:
- ✅ Load static content first (agent role, principles, data files)
- ✅ Keep loading order consistent across requests
- ✅ Bundle related static files together
- ✅ Cache finalized documents (architecture, requirements)
- ✅ Use cache-aware loading for repetitive tasks

**DON'T**:
- ❌ Interleave static and dynamic content
- ❌ Change loading order randomly
- ❌ Cache work-in-progress documents
- ❌ Cache user input or conversation
- ❌ Over-cache (don't cache tiny files)

### Example: Cache-Optimized Workflow

**Task**: Implement 5 features in existing project

**Without Cache Optimization**:
```
Feature 1: Load role + principles + architecture + task → 8,000 tokens
Feature 2: Load role + principles + architecture + task → 8,000 tokens
Feature 3: Load role + principles + architecture + task → 8,000 tokens
Feature 4: Load role + principles + architecture + task → 8,000 tokens
Feature 5: Load role + principles + architecture + task → 8,000 tokens
TOTAL: 40,000 tokens
```

**With Cache Optimization**:
```
Feature 1: Load [role + principles + architecture]CACHE + task → 8,000 tokens (full charge)
Feature 2: [Cache hit] + task                            →   800 tokens (10% charge)
Feature 3: [Cache hit] + task                            →   800 tokens
Feature 4: [Cache hit] + task                            →   800 tokens
Feature 5: [Cache hit] + task                            →   800 tokens
TOTAL: 11,200 tokens
SAVINGS: 72% (28,800 tokens saved)
```

### Integration with JIT Loading

**Hybrid Strategy** (Best of Both):

**Phase 1: Load Static Cache Block**
```
[CACHE BLOCK - Load Once]
- Agent role
- core-principles.md
- agent-responsibility-matrix.md
- context-loading-guide.md (if needed)
Total: ~7,000 tokens
```

**Phase 2: JIT Load Decision Guides** (Also Cache-Friendly)
```
[CONDITIONAL CACHE - Load If Needed]
- technology-stack-guide.md (if making stack decision)
- security-guidelines.md (if implementing auth)
- api-implementation-patterns.md (if designing API)
Add: ~1,000-3,000 tokens
```

**Phase 3: Dynamic Task Context** (Never Cache)
```
[DYNAMIC - Changes Per Task]
- Current task description
- User messages
- Work artifacts
Add: ~500-1,500 tokens
```

**Result**:
- Stable foundation cached
- Decision guides cached when needed
- Dynamic content fresh
- Optimal token efficiency

### Token Accounting with Caching

**Revised Token Accounting Format**:

```
=== TOKEN ACCOUNTING (With Cache) ===

CACHEABLE CONTEXT (Static):
- Role definition: ~300 tokens
- core-principles.md: ~5,000 tokens
- architecture.md: ~2,000 tokens
Subtotal: ~7,300 tokens
Cache Status: CACHED (first call: full charge, subsequent: ~10% charge)

DECISION CONTEXT (Semi-Static):
- security-guidelines.md: ~1,000 tokens
Cache Status: CACHED (loaded in previous task)

DYNAMIC CONTEXT (Never Cache):
- Current task: ~500 tokens
- User messages: ~200 tokens
Subtotal: ~700 tokens

TOTAL ESTIMATED:
- First call: ~9,000 tokens
- This call (cache hit): ~1,500 tokens (83% savings)
```

### Summary: Caching Optimization

**Key Principles**:
1. **Static first, dynamic last** - Order matters for caching
2. **Bundle static files** - Load together for efficient caching
3. **Consistent structure** - Same order maximizes cache hits
4. **Finalize before caching** - Don't cache work-in-progress
5. **Cache-aware JIT** - Load static guides upfront for repetitive tasks

**Expected Impact**:
- **Single task**: 0-30% savings (cache setup cost)
- **Repetitive tasks**: 70-90% savings (massive benefit)
- **Long-term project**: 80%+ cumulative savings

**Remember**: Caching optimizes INPUT token costs. Output quality remains HIGH with comprehensive, detailed responses.

## Code Quality Standards

**Naming Conventions**:
- Files: kebab-case for utilities, PascalCase for components, camelCase for hooks
- Variables: camelCase for functions/vars, PascalCase for classes, UPPER_SNAKE_CASE for constants
- Descriptive: `isLoading` not `loading`, `handleSubmit` not `submit`

**TypeScript Rules**:
- No `any` - use `unknown` for truly unknown types
- `interface` for objects, `type` for unions/intersections
- Explicit function return types
- Generics for reusable type-safe code

**Testing Philosophy**:
- Test user interactions, not implementation details
- Mock external dependencies
- Integration tests for critical paths
- Unit tests for complex business logic
- Aim for >80% coverage on critical code

**Error Handling**:
- Custom error classes for different error types
- Centralized error handling (middleware for backend, error boundaries for frontend)
- Structured logging with context
- Never expose stack traces in production
- Proper HTTP status codes (400 validation, 401 auth, 404 not found, 500 server error)

## Security Standards

**Authentication**:
- bcrypt/argon2 for password hashing (10+ rounds)
- JWT with short-lived access tokens + long-lived refresh tokens
- Store refresh tokens in httpOnly cookies or secure DB
- Implement token rotation on refresh

**Input Validation**:
- Validate ALL user inputs with Zod or Joi
- Sanitize HTML output to prevent XSS
- Use parameterized queries to prevent SQL injection
- Whitelist, never blacklist

**API Security**:
- CORS with specific origins (not *)
- Rate limiting per user/endpoint
- CSRF protection for state-changing operations
- Security headers with Helmet.js
- HTTPS in production

**Secrets Management**:
- Never commit secrets to version control
- Use environment variables (.env files)
- Rotate credentials regularly
- Minimal privilege principle

## Performance Standards

**Frontend**:
- Code splitting and lazy loading for routes/heavy components
- Memoization (React.memo, useMemo, useCallback) only when measured benefit
- Virtual scrolling for long lists
- Image optimization (next/image or similar)
- Bundle analysis and tree shaking

**Backend**:
- Database indexes on frequently queried fields
- Connection pooling
- Redis caching for frequently accessed data
- Pagination for large result sets
- Async/await throughout (no blocking operations)
- Background jobs for heavy processing

## Documentation Standards

**Code Documentation**:
- JSDoc for public APIs and complex functions
- README for setup and architecture overview
- Inline comments for "why", not "what"
- Keep docs close to code

**API Documentation**:
- OpenAPI/Swagger for REST APIs
- GraphQL SDL with type descriptions
- Code examples for common use cases
- Authentication flows documented
- Error codes and messages explained

**Architecture Documentation**:
- Architecture Decision Records (ADRs) for key decisions
- System diagrams for complex architectures
- Database schema documentation
- Deployment guides

## Git Standards

**Commit Format**: `<type>(<scope>): <subject>`

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**: `feat(auth): add password reset functionality`

**PR Requirements**:
- TypeScript compiles with no errors
- ESLint passes
- All tests pass, coverage >80%
- No console.logs or debugger statements
- Meaningful commits
- Clear PR description

## Working Philosophy

**Start Simple**: MVP first, add complexity as needed. Monolith before microservices.

**Fail Fast**: Validate early, catch errors at compile time, comprehensive error handling.

**Iterate Quickly**: Ship small increments, get feedback, improve continuously.

**Automate Everything**: Testing, linting, deployment, monitoring. Reduce manual toil.

**Monitor and Learn**: Track metrics, analyze errors, learn from production, improve continuously.

---

**All agents reference these principles.**

**Additional References**:
- Implementation details: `development-guidelines.md`, `best-practices.md`, `security-guidelines.md`
- Agent boundaries: `agent-responsibility-matrix.md` (who owns what decisions)
- Context loading: `context-loading-guide.md` (when to load what)
- Technology guides: Various data/* files (loaded just-in-time)
