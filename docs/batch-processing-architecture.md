# Batch Processing Architecture for Rate Limit Efficiency

> **📣 Request for Feedback**
>
> This is an alpha-stage contribution and we welcome community input. We've tested this pattern with our team but would love feedback on:
> - Does this model tiering approach resonate with your experience?
> - Are there edge cases where Sonnet struggles with implementation tasks?
> - How can we improve the UX for model switching prompts?
> - Would a formal BBP module be valuable to the community?
>
> Please share thoughts in Discord `#suggestions-feedback` or comment on the PR. We're here to collaborate, not prescribe.

---

> **Scope**: This architecture is specifically designed for **Anthropic Claude models** on **Claude Max subscriptions** (or similar tiered access plans). The rate limit characteristics, model capabilities, and tiering strategy are based on Anthropic's current offering structure.

> **Origin**: These constraints were discovered when attempting to scale the BMAD method across a development team. Individual developers hitting Opus rate limits mid-sprint created bottlenecks that rippled through the entire team's velocity. The model tiering pattern emerged as a practical solution to sustain team-wide BMAD adoption.

## Platform Context: Anthropic Claude Max

This pattern assumes access to **Claude Code** with a **Claude Max subscription**, which provides:

| Model | Capability | Rate Limit Behavior |
|-------|------------|---------------------|
| **Claude Opus 4** | Highest reasoning, best for complex decisions | Most restrictive limits |
| **Claude Sonnet 4** | Strong coding, fast execution | More generous limits |
| **Claude Haiku** | Quick tasks, simple operations | Most generous limits |

The rate limit disparity between Opus and Sonnet is significant enough that strategic model selection dramatically impacts sustainable throughput. This architecture exploits that disparity.

**Note**: If using API access with pay-per-token pricing instead of subscription limits, the economics differ but the capability-matching principle still applies (use the right model for the task complexity).

## The Problem: Opus Rate Limits in Extended Development Sessions

Working entirely on Claude Opus for software development quickly becomes impractical:

- **Rate limits hit fast**: Complex stories with multiple files, tests, and iterations consume tokens rapidly
- **Context reloading**: Each new conversation requires re-establishing project context
- **Expensive operations**: Every file read, search, and edit counts against limits
- **Development stalls**: Hitting rate limits mid-story forces context-switching or waiting

## The Solution: Strategic Model Tiering

The Batch-Based Pipeline (BBP) approach distributes work across model tiers based on task complexity:

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPUS (Strategic Layer)                        │
│  • Epic-level story planning (high-stakes decisions)            │
│  • Cross-story pattern detection during review                  │
│  • Architecture-impacting decisions                             │
│  • Final quality gates                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SONNET (Execution Layer)                       │
│  • Story implementation (bulk of token usage)                   │
│  • Test writing and execution                                   │
│  • Targeted rework from review feedback                         │
│  • File operations and searches                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Why This Works: Quality Preservation Through Staging

### The Key Insight: Quality Comes From Context, Not Just Model Size

The common assumption is "bigger model = better code." In practice, **code quality is primarily determined by**:

1. **Clarity of specifications** - What exactly needs to be built
2. **Available context** - Project patterns, architecture decisions, existing code
3. **Scope constraints** - Focused task vs. open-ended exploration

When these three factors are optimized, Sonnet produces implementation-equivalent results to Opus.

### How Staging Preserves Quality

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     OPUS PLANNING PHASE                                  │
│                                                                          │
│  Input:  PRD, Architecture, Epic requirements (ambiguous, high-level)   │
│                                                                          │
│  Opus does the HARD work:                                               │
│  • Interprets ambiguous requirements                                    │
│  • Makes architectural judgment calls                                   │
│  • Resolves conflicting constraints                                     │
│  • Defines precise acceptance criteria                                  │
│  • Sequences tasks in optimal order                                     │
│                                                                          │
│  Output: Crystal-clear story files with:                                │
│  • Unambiguous task definitions                                         │
│  • Specific file paths to modify                                        │
│  • Exact acceptance criteria                                            │
│  • Test scenarios spelled out                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SONNET EXECUTION PHASE                                │
│                                                                          │
│  Input: Crystal-clear story files (all ambiguity resolved)              │
│                                                                          │
│  Sonnet does MECHANICAL work:                                           │
│  • Translates specs to code (no interpretation needed)                  │
│  • Follows established patterns (already defined)                       │
│  • Writes tests against clear criteria                                  │
│  • Makes localized decisions only                                       │
│                                                                          │
│  Why Sonnet excels here:                                                │
│  • Strong coding capabilities (not inferior to Opus for implementation) │
│  • Faster execution                                                     │
│  • More generous rate limits                                            │
│  • Sufficient reasoning for scoped tasks                                │
└─────────────────────────────────────────────────────────────────────────┘
```

### Quality Is Front-Loaded, Not Distributed

Traditional approach (quality spread thin):
```
Story 1: [interpret─────implement─────test─────] → Quality depends on each step
Story 2: [interpret─────implement─────test─────] → Repeated interpretation risk
Story 3: [interpret─────implement─────test─────] → Inconsistency accumulates
```

Batched approach (quality concentrated):
```
PLAN:    [interpret ALL stories with full context] → One-time, high-quality
DEV:     [implement─implement─implement──────────] → Mechanical, consistent
TEST:    [test──────test──────test───────────────] → Pattern-based
REVIEW:  [review ALL with cross-story visibility ] → Catches what batch missed
```

**The quality gates are at phase boundaries, not scattered throughout.**

### Why Sonnet Doesn't Degrade Quality

| Task Type | Why Sonnet Matches Opus | Evidence |
|-----------|------------------------|----------|
| Code generation | Both models trained extensively on code; Sonnet optimized for speed | Benchmarks show near-parity on coding tasks |
| Following specs | No interpretation needed when specs are clear | Deterministic translation |
| Pattern matching | Existing code provides template | Copy-modify-adapt pattern |
| Test writing | Acceptance criteria explicit | Direct mapping to assertions |
| Syntax/formatting | Both models equivalent | Mechanical task |

### Where Opus Is Still Required

| Task Type | Why Opus Needed | Stage |
|-----------|-----------------|-------|
| Requirement interpretation | Ambiguity resolution requires deeper reasoning | Planning |
| Architecture decisions | Trade-off analysis, long-term implications | Planning |
| Cross-story patterns | Seeing connections across multiple changes | Review |
| Novel problem solving | No existing pattern to follow | Planning |
| Quality judgment | "Is this good enough?" requires taste | Review |

### The Batch Review Multiplier

Reviewing stories in batch actually **improves** quality over individual review:

```
Individual Review:
Story 1: [review] → Misses that auth pattern will conflict with Story 3
Story 2: [review] → Doesn't know Story 1 already solved similar problem
Story 3: [review] → Unaware of auth pattern from Story 1

Batch Review:
Stories 1,2,3: [review together]
  → "Story 1 and 3 both touch auth - ensure consistent approach"
  → "Story 2 duplicates utility from Story 1 - extract shared helper"
  → "All three stories need the same error handling pattern"
```

**Cross-story visibility enables pattern detection impossible in isolated review.**

## Token Efficiency: Why Batching Saves Tokens

### Dramatic Rate Limit Savings

Typical story implementation breakdown:
```
File reads/searches:     40% of tokens  → Sonnet
Code generation:         35% of tokens  → Sonnet
Test writing:            15% of tokens  → Sonnet
Planning/decisions:      10% of tokens  → Opus
```

By routing 90% of token-heavy operations to Sonnet, Opus capacity is preserved for high-value strategic work.

### Context Amortization: Batching Amplifies Efficiency

Instead of:
```
Story 1: Plan(Opus) → Implement(Opus) → Test(Opus) → Review(Opus)
Story 2: Plan(Opus) → Implement(Opus) → Test(Opus) → Review(Opus)
Story 3: Plan(Opus) → Implement(Opus) → Test(Opus) → Review(Opus)
```

BBP does:
```
Planning Phase:    Plan stories 1,2,3 together     (Opus, warm context)
Dev Phase:         Implement stories 1,2,3         (Sonnet, parallel-ready)
Test Phase:        Test stories 1,2,3              (Sonnet, shared fixtures)
Review Phase:      Review stories 1,2,3 together   (Opus, pattern detection)
```

Benefits:
- **Context loading amortized** across multiple stories
- **Pattern recognition** improved by seeing related changes together
- **Parallelization potential** for independent stories

## Pipeline Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  OPUS PLAN   │───▶│  SONNET DEV  │───▶│ SONNET TEST  │───▶│ OPUS REVIEW  │
│              │    │              │    │              │    │              │
│ • All stories│    │ • Implement  │    │ • Write tests│    │ • Quality    │
│   planned    │    │   each story │    │ • Run tests  │    │   gate       │
│ • Context    │    │ • Warm       │    │ • Fix fails  │    │ • Pattern    │
│   established│    │   context    │    │              │    │   detection  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                   │
                                                                   ▼
                                                           ┌──────────────┐
                                                           │SONNET REWORK │
                                                           │ (if needed)  │
                                                           │              │
                                                           │ • Targeted   │
                                                           │   fixes from │
                                                           │   review     │
                                                           └──────────────┘
```

## Implementation Notes

### Warm Context Strategy

Each phase loads relevant context before execution:
- **Planning**: PRD, Architecture, Epic definitions
- **Development**: Story file, project-context.md, related code
- **Testing**: Story AC, existing test patterns, fixtures
- **Review**: All changed files, architecture constraints, story requirements

### Checkpoint System

Pipeline state tracked in `_bmad-output/bbp-status.yaml`:
```yaml
epic: 3
phase: dev
stories:
  story-3.1:
    status: completed
    dev: done
    test: done
  story-3.2:
    status: in_progress
    dev: done
    test: pending
  story-3.3:
    status: pending
```

Enables:
- Resume after interruption
- Skip completed work
- Parallel execution tracking

### When to Use Opus vs Sonnet

| Task | Model | Reason |
|------|-------|--------|
| Story planning | Opus | Requirement interpretation, scope decisions |
| Code implementation | Sonnet | Mechanical translation of specs to code |
| Test writing | Sonnet | Pattern-based, well-defined expectations |
| Code review | Opus | Cross-cutting concerns, architectural judgment |
| Targeted fixes | Sonnet | Specific, well-scoped corrections |
| Architecture decisions | Opus | Long-term impact, trade-off analysis |
| File operations | Sonnet | Token-heavy, mechanical operations |

## Results

In practice, this approach enables:
- **3-5x more stories** completed per rate limit window
- **Equivalent quality** on implementation tasks
- **Better review quality** through batch pattern detection
- **Sustainable development pace** without rate limit interruptions

## Current Limitations: Manual Model Switching

**Important**: Model switching in Claude Code is currently a manual operation via the `/model` command.

```bash
/model sonnet    # Switch to Sonnet for implementation
/model opus      # Switch to Opus for planning/review
```

### UX Challenge (Work in Progress)

The pipeline workflows need to clearly signal to users when to switch models:

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️  PHASE COMPLETE: Planning finished                      │
│                                                             │
│  Next phase: Development (Sonnet recommended)               │
│                                                             │
│  To switch models:  /model sonnet                           │
│  To continue:       /bmad:bbp:workflows:sonnet-dev-batch    │
└─────────────────────────────────────────────────────────────┘
```

Current approach:
- Each workflow is named with its intended model (`opus-plan-epic`, `sonnet-dev-batch`)
- Phase completion messages prompt the user to switch
- Status workflow shows current phase and recommended model

**Known improvement needed**: Workflow output messages need optimization to make model switching more intuitive. Current messages may not be prominent enough for users unfamiliar with the tiered approach.

Future improvements being explored:
- Clearer visual cues at phase boundaries (boxed prompts, color hints)
- Model recommendation prominently displayed in status output
- Standardized "SWITCH MODEL" callout format across all phase transitions
- Potential Claude Code hooks for model suggestions

### Why Manual Switching is Acceptable

Despite the manual step, this approach works because:
1. **Phase boundaries are natural pause points** - good time to review progress anyway
2. **Explicit control** - users know exactly which model is doing what
3. **No surprise costs** - transparent about when Opus vs Sonnet is used
4. **Workflow names are self-documenting** - `sonnet-*` vs `opus-*` prefixes

## Future Considerations

- **Haiku tier**: For even lighter operations (file searches, simple edits)
- **Adaptive routing**: Dynamic model selection based on task complexity signals
- **Parallel batches**: Multiple Sonnet sessions for independent stories
- **Automated model hints**: Claude Code integration for model recommendations

---

*This architecture emerged from practical necessity during extended development sessions where Opus rate limits became the primary bottleneck to productivity.*
