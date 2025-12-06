# BMad Method PR #3: /kiss Command (Keep It Simple & Short)

**Feature Type**: User experience enhancement / Workflow optimization
**Status**: Draft for community review
**Origin**: tellingCube project (masemIT e.U.)
**Author**: Mario Semper (@sempre)
**Date**: 2025-11-23

---

## Summary

**`/kiss` command** provides users a quick way to signal agents to keep responses concise and focused, preventing chat overload with unnecessary information.

**KISS = Keep It Simple & Short**

---

## Problem Statement

### Real-World User Frustration

**Scenario**: User needs quick answer or wants to stay focused on execution, but agents provide verbose explanations, alternatives, and context that clutter the chat.

**Current BMad Behavior:**
```yaml
User: "Create the login form component"

Agent:
  - Explains why login forms are important
  - Lists 5 different authentication approaches
  - Discusses security considerations
  - Asks 3 clarifying questions
  - Suggests 2 alternative implementations
  - THEN creates the component

❌ Result: 30 lines of chat before action, user overwhelmed
```

**What user wanted:**
```yaml
User: "Create the login form component /kiss"

Agent:
  - Creates the component
  - Brief confirmation message

✅ Result: 3 lines, stays focused, keeps momentum
```

---

## Proposed Solution: /kiss Command

### Command Syntax

```bash
/kiss
```

**Can appear anywhere in user message:**
- At the end: `"Fix the bug in auth.ts /kiss"`
- At the start: `"/kiss Show me the error logs"`
- Standalone: `"/kiss"` (applies to next agent response)

---

## Behavior Specification

### When `/kiss` is Used

**Agent MUST:**
1. ✅ **Skip explanations** - No "why" or "how it works" unless critical
2. ✅ **Skip alternatives** - Don't offer other approaches unless asked
3. ✅ **Skip exploratory questions** - Make reasonable assumptions
4. ✅ **Execute directly** - Jump to action, not discussion
5. ✅ **Confirm briefly** - 1-2 sentences max

**Agent SHOULD:**
- Present results concisely (code, output, answer)
- Use bullet points over paragraphs
- Omit context user already knows
- Save details for follow-up if user asks

**Agent MUST NOT:**
- Skip critical safety checks (destructive operations still need confirmation)
- Hide errors or important warnings
- Omit information that would cause user to make wrong decision

---

## Use Cases

### 1. Quick Fixes
```
User: "Add error handling to the login function /kiss"

Agent (WITHOUT /kiss):
"I'll add error handling to the login function. There are several
approaches we could take:
1. Try-catch blocks
2. Promise rejection handling
3. Validation middleware
Which approach would you prefer? Also, should we log errors to
Sentry or just console? Let me know and I'll implement..."

Agent (WITH /kiss):
"Added try-catch with Sentry logging:
[code block]
Done ✅"
```

### 2. Information Retrieval
```
User: "What's the current Stripe pricing tier configuration /kiss"

Agent (WITHOUT /kiss):
"Great question! The Stripe pricing configuration is stored in
components/landing/PricingSection.tsx. Let me explain the structure:

The pricing tiers follow a founding member model with lifetime access.
This is interesting because... [3 more paragraphs]"

Agent (WITH /kiss):
"5 tiers: €29, €99, €299, €599, €999 (lifetime, one-time)
Source: components/landing/PricingSection.tsx"
```

### 3. Status Checks
```
User: "Are all tests passing? /kiss"

Agent (WITHOUT /kiss):
"Let me run the test suite for you. Our testing strategy includes
unit tests using Jest, integration tests, and E2E tests with Playwright.
I'll now execute the test command... [runs tests]...
The results show..."

Agent (WITH /kiss):
"✅ All tests passing (23/23)
Runtime: 4.2s"
```

### 4. Execution Mode
```
User: "We discussed the approach earlier. Just implement it. /kiss"

Agent (WITHOUT /kiss):
"Before I implement, let me confirm the approach we discussed:
1. Use event-sourcing architecture
2. Store events in NeonDB
3. Generate views via SQL
Is this correct? Also, should I..."

Agent (WITH /kiss):
[Implements directly, shows result]
"Implemented. Ready for review."
```

---

## Implementation Options

### Option A: Command Flag (Simplest)

**In agent system prompt:**
```markdown
If user includes `/kiss` in their message:
- Keep response under 5 lines
- No explanations unless critical
- Execute directly, confirm briefly
- Skip alternatives and exploratory questions
```

**Pros:**
- Simple to implement (prompt addition)
- Works immediately across all agents
- No code changes needed

**Cons:**
- Agents must remember to check for `/kiss`
- May be forgotten in complex agent definitions

---

### Option B: Global Flag (Most Robust)

**In BMad core:**
```typescript
interface UserMessage {
  content: string
  flags: {
    kiss: boolean  // Detected from /kiss in message
  }
}

function parseMessage(raw: string): UserMessage {
  const kiss = raw.includes('/kiss')
  const content = raw.replace('/kiss', '').trim()
  return { content, flags: { kiss } }
}
```

**Agent access:**
```markdown
Context available to all agents:
- message.flags.kiss: boolean

If true:
- Response must be concise (< 5 lines preferred)
- Action-first, explanation-optional
```

**Pros:**
- Guaranteed all agents respect flag
- Easier for agents (don't need to parse)
- Can extend with other flags (/verbose, /explain, etc.)

**Cons:**
- Requires BMad core changes
- Slightly more implementation work

---

### Option C: Mode Switch (Advanced)

**User can toggle mode:**
```bash
*mode kiss    # All responses now concise until toggled off
*mode normal  # Back to default verbosity
```

**Pros:**
- Don't need to type `/kiss` every time
- Good for execution-heavy sessions

**Cons:**
- More complex to implement
- User might forget they're in KISS mode
- Harder to mix verbosity levels

---

## Recommended: Option A (Start Simple)

**Rationale:**
- Fastest to implement (just prompt update)
- Test user adoption before building complex infrastructure
- Can evolve to Option B or C if popular

**Implementation Steps:**
1. Add `/kiss` detection to all agent prompts
2. Define behavior rules (5 lines, action-first)
3. Update BMad user guide with `/kiss` documentation
4. Gather feedback from community
5. Iterate based on usage patterns

---

## Behavior Examples (Detailed)

### Example 1: Code Creation
```
User: "Create a validation utility for email addresses /kiss"

❌ WITHOUT /kiss (Verbose):
"I'll create a validation utility for email addresses. Email validation
is tricky because there are many valid formats according to RFC 5322.
I recommend using a regex pattern that covers most common cases while
avoiding false positives. Here's my approach:

1. Use standard email regex
2. Add domain verification (optional)
3. Sanitize input first
4. Return boolean + error message

[Creates utility]

The utility handles:
- Format validation
- Common typo detection
- Disposable email blocking (optional)

Would you like me to add any of these additional features?"

✅ WITH /kiss (Concise):
"Created email validator:
[code block]
Returns {valid: boolean, error?: string}"
```

---

### Example 2: Error Investigation
```
User: "Why is the build failing? /kiss"

❌ WITHOUT /kiss (Verbose):
"Let me investigate the build failure. I'll check several potential
causes:
1. TypeScript errors
2. Missing dependencies
3. Configuration issues
4. Environment variables

[Runs build, analyzes logs]

The build is failing due to a TypeScript error in auth.ts. This is
happening because the `User` type doesn't match the return type of
the database query. TypeScript's type system is trying to enforce
type safety here, which is good because..."

✅ WITH /kiss (Concise):
"Build error: Type mismatch in auth.ts:42
Expected: User | null
Got: User | undefined

Fix: Change `getUser()` return type to `User | null`"
```

---

### Example 3: Project Status
```
User: "What's the current sprint status? /kiss"

❌ WITHOUT /kiss (Verbose):
"Let me give you a comprehensive sprint status update. Our current
sprint (Sprint 14) started on Monday and runs through next Friday.
We're using 2-week sprints as defined in our agile process. Let me
break down the status by epic:

Epic 1: User Authentication
- Story 1.1: Login form ✅ (Completed)
- Story 1.2: Signup flow ✅ (Completed)
- Story 1.3: Password reset 🟡 (In Progress)
  - This one is taking longer because we discovered...

Epic 2: Dashboard
..."

✅ WITH /kiss (Concise):
"Sprint 14 (Day 8/14):
✅ 12 stories done
🟡 3 in progress
⏳ 2 remaining
On track for Friday delivery"
```

---

## When NOT to Use /kiss (Safety Considerations)

### Destructive Operations (Always Confirm)
```
User: "Delete the production database /kiss"

Agent (Correct Behavior):
"⚠️ This is a DESTRUCTIVE operation affecting production.

Are you sure you want to delete the production database?
Type 'YES DELETE PRODUCTION DATABASE' to confirm.

(Note: /kiss does not skip safety checks for destructive operations)"
```

**Rationale:** User safety > brevity

---

### Critical Errors (Don't Hide Details)
```
User: "Deploy to production /kiss"

Agent (Correct Behavior):
"❌ Deploy blocked - 3 critical errors:
1. Tests failing (auth.test.ts:45)
2. TypeScript errors in 2 files
3. Missing required env var: STRIPE_SECRET_KEY

/kiss mode active, but showing errors because deployment would fail.
Fix these first?"
```

**Rationale:** User needs to know WHY deployment failed

---

### Ambiguous Requests (Ask, Don't Assume)
```
User: "Update the pricing /kiss"

Agent (Correct Behavior):
"Which pricing?
- Stripe product prices
- Landing page display
- Documentation

(Need clarification even in /kiss mode)"
```

**Rationale:** Guessing wrong wastes more time than asking

---

## Benefits

✅ **Reduces chat clutter** - Keeps conversation focused
✅ **Maintains momentum** - Less reading, more doing
✅ **Respects user expertise** - Assumes user knows context
✅ **Faster execution** - Skip discussion, jump to action
✅ **Optional, not forced** - User controls verbosity per-message

---

## Tradeoffs & Considerations

### Pro: User Control
- User decides when to use /kiss
- Can mix verbose and concise in same session
- No permanent mode change

### Con: May Skip Helpful Context
- New users might miss learning opportunities
- Complex decisions might need more discussion
- User must know to ask for details if needed

**Mitigation:** Agents can offer "Want details?" at end of concise response

---

### Pro: Reduces Token Usage
- Shorter agent responses = fewer tokens
- Saves costs in high-volume sessions
- Faster response time (less generation)

### Con: May Require Follow-Up
- User asks "Why?" after concise answer
- Could use more tokens in total if clarification needed

**Mitigation:** Agents should be smart about what's "brief enough"

---

## Rollout Strategy

### Phase 1: Soft Launch (Week 1-2)
- Add `/kiss` to core agent prompts
- Update BMad user guide
- Announce in community Discord/forum
- Gather initial feedback

### Phase 2: Refinement (Week 3-4)
- Analyze usage patterns (how often used?)
- Identify edge cases (when does /kiss fail?)
- Refine behavior rules based on feedback
- A/B test different verbosity thresholds

### Phase 3: Expansion (Month 2+)
- Consider `/explain` (opposite of /kiss)
- Consider `/verbose` (maximum detail mode)
- Consider mode switching (`*mode kiss`)
- Community voting on preferred approach

---

## Real-World Validation

**Origin Project:** tellingCube (masemIT e.U.)

**User Pain Point (Mario Semper):**
> "Sometimes I just need the answer, not a lecture. When I'm in flow state, reading 20 lines of explanation breaks my focus. /kiss would let me signal: I know what I'm doing, just execute."

**Example from tellingCube:**
```
Mario: "Show me the current pricing tiers /kiss"

River (after implementing /kiss):
"€29, €99, €299, €599, €999 (lifetime)
components/landing/PricingSection.tsx"

Mario: "Perfect, thanks."
```

**Before /kiss:**
River would explain the Kickstarter model, founding member strategy, tier reasoning, future pricing changes, etc. (12 lines)

**After /kiss:**
2 lines, instant answer, Mario stays in flow.

---

## Comparison to Similar Patterns

| Pattern | Use Case | When to Use |
|---------|----------|-------------|
| **`/kiss`** | Quick execution, minimal chat | User knows what they want, wants brevity |
| `/explain` | Detailed explanations | User learning, needs context |
| `/verbose` | Maximum detail | Debugging, auditing, teaching |
| ROF sessions | Multi-agent collaboration | Complex analysis needing multiple perspectives |
| Pre-flight | Safety checks | High-risk public outputs |

**KISS is complementary** to other patterns - can use `/kiss` within ROF sessions, etc.

---

## Open Questions for Community

1. **Verbosity Threshold**: What's "brief enough"? 3 lines? 5 lines? 10 lines?
2. **Default Behavior**: Should agents auto-detect when to be brief, or only via `/kiss`?
3. **Mode vs. Flag**: Per-message `/kiss` or mode switching (`*mode kiss`)?
4. **Opposite Command**: Should we also have `/explain` or `/verbose`?
5. **Safety Override**: What operations ALWAYS require verbose confirmation despite `/kiss`?

---

## Next Steps

1. **Community feedback** on approach and verbosity rules
2. **Pilot implementation** in BMad core or as agent prompt addition
3. **User testing** with tellingCube and other projects
4. **Iteration** based on usage patterns
5. **Documentation** in BMad user guide

---

## Proposed Documentation

### User Guide Entry

````markdown
## /kiss - Keep It Simple & Short

**When to use:** You want quick, concise responses without explanations.

**Syntax:**
```
/kiss
```

**Example:**
```
User: "Run the tests /kiss"
Agent: "✅ 23/23 passing (4.2s)"
```

**What changes:**
- Responses under 5 lines (typically)
- No explanations unless critical
- Direct execution, brief confirmation
- No alternatives offered

**Safety:** Destructive operations still require confirmation.

**Not working?** Some agents may not support /kiss yet.
````

---

## References

- **Source Project**: tellingCube (https://github.com/masemIT/telling-cube) [if public]
- **User Feedback**: Mario Semper (@sempre)
- **Related PRs**:
  - PR #964 Ring of Fire (multi-agent collaboration)
  - PR #965 Pre-Flight Protocol (safety framework)

---

**Contribution ready for review.** Let's make BMad more responsive to user workflow preferences! 🎯

---

**Memes Welcome:**
- "KISS: Keeping Agents Concise Since 2025"
- "More doing, less explaining"
- "TL;DR mode for agents"
