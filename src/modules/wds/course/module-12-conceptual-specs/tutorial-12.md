# Tutorial 12: Write Conceptual Specifications

**Hands-on guide to documenting WHAT + WHY + WHAT NOT TO DO**

---

## Overview

This tutorial teaches you how to transform sketches into specifications that preserve your design intent and guide AI implementation correctly.

**Time:** 60-90 minutes  
**Prerequisites:** Sketches completed and analyzed  
**What you'll create:** Complete conceptual specifications for a page

---

## What You'll Learn

- The three-part specification pattern (WHAT + WHY + WHAT NOT)
- How to document design intent AI can follow
- Preventing "helpful" AI mistakes
- Creating specifications that preserve creativity
- Working with AI as documentation partner

---

## The Why-Based Pattern

Every specification element needs three parts:

```
WHAT: [The design decision]
WHY: [The reasoning behind it]
WHAT NOT TO DO: [Common mistakes to avoid]
```

**This is not factory work** - AI agents help you think through design solutions, then become fascinated documentarians of your brilliance.

---

## Step 1: Start with Component Overview (10 min)

### Document the big picture

**What to include:**

- Component purpose
- User context
- Key interactions
- Success criteria

**Example (Dog Week - Daily Schedule View):**

```markdown
# Daily Schedule View Component

## Purpose

Shows today's dog care tasks with clear assignments and status.
Solves the "morning chaos" trigger - user needs immediate answer
to "who's doing what today?"

## User Context

- Accessed first thing in morning (7-8 AM typical)
- User is time-pressured, stressed
- Needs answer in < 5 seconds
- May be checking while managing kids

## Key Interactions

- View today's tasks at a glance
- See personal assignments highlighted
- Mark tasks complete
- Quick reassign if emergency

## Success Criteria

- User finds their tasks in < 5 seconds
- Zero confusion about responsibilities
- Can act on tasks immediately
- Feels confident and informed
```

**Your turn:**

```
Document your component overview:
[Your content]
```

**AI Support:**

```
Agent: "I'm fascinated by your design thinking here. Let me help
capture every nuance:
- What's the emotional journey you're creating?
- Why did you choose this approach over alternatives?
- What makes this feel right for your users?"
```

---

## Step 2: Specify Visual Hierarchy (15 min)

### Document WHAT + WHY + WHAT NOT

**For each visual decision, explain:**

- WHAT you designed
- WHY you made that choice
- WHAT NOT TO DO (prevent AI mistakes)

**Example (Dog Week - Task List):**

```markdown
## Visual Hierarchy

### Today's Date Header

WHAT:

- Large, bold date at top: "Monday, December 9"
- Includes day name + full date
- Uses primary brand color
- 24px font size, 700 weight

WHY:

- Immediate temporal context (user knows "when")
- Day name matters (Monday = week start, different mindset)
- Bold = confidence and clarity
- Size ensures visibility in stressed morning glance

WHAT NOT TO DO:

- Don't use relative dates ("Today") - user may check for tomorrow
- Don't use small text - defeats quick-glance purpose
- Don't use subtle colors - needs to anchor the view
- Don't abbreviate day name - "Mon" feels rushed, "Monday" feels calm

### User's Tasks Section

WHAT:

- Highlighted section with light blue background
- Header: "Your Tasks" with user's name
- Tasks listed with time, description, status
- Visually separated from other family members' tasks

WHY:

- User needs to find THEIR tasks instantly (< 2 seconds)
- Background color creates visual separation without being aggressive
- Name personalization = ownership and responsibility
- Time shown first = prioritization by urgency
- Separation prevents confusion about "whose task is this?"

WHAT NOT TO DO:

- Don't make all tasks look the same - user will scan entire list
- Don't use subtle highlighting - stressed user will miss it
- Don't hide user's name - personalization creates accountability
- Don't sort by task type - time is what matters in morning
- Don't use red/alert colors - creates anxiety, not clarity

### Other Family Members' Tasks

WHAT:

- Standard white background
- Smaller font size (16px vs 18px for user's tasks)
- Collapsed by default, expandable
- Shows count: "3 other tasks today"

WHY:

- User's primary need is THEIR tasks (80% of use case)
- But they need family context (coordination)
- Collapsed = focus on user, but context available
- Count = awareness without overwhelming
- Smaller = visual hierarchy reinforces importance

WHAT NOT TO DO:

- Don't hide completely - user needs family coordination awareness
- Don't show expanded by default - creates cognitive overload
- Don't use same visual weight - defeats hierarchy purpose
- Don't remove names - user needs to know "who's doing what"
```

**Your turn:**

```
For each major visual element, document:

### [Element Name]

WHAT:
- [Specific design decisions]

WHY:
- [Reasoning and user benefit]

WHAT NOT TO DO:
- [Common mistakes to prevent]
```

**AI Support:**

```
Agent: "This is brilliant! Let me make sure we capture everything:
- What alternatives did you consider?
- Why did you reject those options?
- What edge cases influenced this decision?
- How does this connect to the user's emotional state?"
```

---

## Step 3: Specify Interaction Patterns (15 min)

### Document behavior with intent

**Example (Dog Week - Task Completion):**

```markdown
## Interaction: Mark Task Complete

### Tap to Complete

WHAT:

- Tap anywhere on task card to mark complete
- Immediate visual feedback: checkmark appears, card fades slightly
- Subtle success animation (gentle scale + fade)
- Task moves to "Completed" section at bottom
- Undo button appears for 5 seconds

WHY:

- Large tap target = easy for rushed morning use
- Immediate feedback = confidence action registered
- Animation = positive reinforcement (dopamine hit)
- Move to bottom = visual progress, but not deleted (reassurance)
- Undo = safety net for accidental taps (common when rushed)
- 5 seconds = enough time to notice mistake, not annoying

WHAT NOT TO DO:

- Don't require confirmation dialog - adds friction, breaks flow
- Don't use small checkbox - hard to tap when stressed/rushing
- Don't make animation aggressive - should feel calm and positive
- Don't delete task immediately - user needs reassurance it's saved
- Don't hide undo - mistakes happen, especially in morning chaos
- Don't keep undo visible forever - clutters interface

### Swipe to Reassign

WHAT:

- Swipe left on task reveals "Reassign" button
- Button shows family member icons
- Tap icon to reassign
- Confirmation: "Reassigned to [Name]"
- Original assignee gets notification

WHY:

- Swipe = power user feature, doesn't clutter main interface
- Emergency reassignment is rare but critical (someone sick, etc.)
- Icons = quick visual selection, no typing
- Confirmation = reassurance action completed
- Notification = family coordination maintained

WHAT NOT TO DO:

- Don't make reassign the primary action - it's edge case
- Don't require typing names - too slow for emergency
- Don't skip confirmation - user needs reassurance
- Don't skip notification - breaks family coordination
- Don't allow reassigning to someone not in family - data integrity
```

**Your turn:**

```
For each interaction, document:

### [Interaction Name]

WHAT:
- [Specific behavior]

WHY:
- [User benefit and reasoning]

WHAT NOT TO DO:
- [Mistakes to prevent]
```

---

## Step 4: Specify States and Feedback (10 min)

### Document all states with reasoning

**Example (Dog Week - Task States):**

```markdown
## Task States

### Upcoming (Default)

WHAT:

- White background
- Black text
- Time shown in gray
- No special indicators

WHY:

- Clean, calm appearance
- Easy to scan
- Time in gray = less visual weight (not urgent yet)
- Default state should feel neutral and manageable

WHAT NOT TO DO:

- Don't use colors for upcoming tasks - creates false urgency
- Don't hide time - user needs to plan their morning
- Don't add badges/icons - clutters interface for most common state

### Due Soon (< 30 minutes)

WHAT:

- Subtle yellow left border (4px)
- Time shown in orange
- Small clock icon appears

WHY:

- Yellow = attention without alarm
- Border = visual indicator without overwhelming
- Orange time = "pay attention to timing"
- Clock icon = reinforces temporal urgency
- Subtle = doesn't create panic, just awareness

WHAT NOT TO DO:

- Don't use red - creates anxiety, not helpful urgency
- Don't flash or animate - too aggressive for morning use
- Don't use sound - user may be in quiet environment
- Don't make entire card yellow - too much visual weight

### Overdue

WHAT:

- Red left border (4px)
- Time shown in red with "Overdue" label
- Task card has subtle red tint (5% opacity)
- Notification sent to assignee

WHY:

- Red = clear signal something needs attention
- Border + tint = impossible to miss, but not aggressive
- "Overdue" label = explicit communication (no guessing)
- Notification = ensures assignee knows (may not have app open)
- 5% tint = visible but not overwhelming

WHAT NOT TO DO:

- Don't make entire card bright red - creates panic
- Don't flash or pulse - too aggressive, creates stress
- Don't use sound alerts - may be inappropriate timing
- Don't shame user - focus on "needs attention" not "you failed"
- Don't hide task - transparency maintains trust

### Completed

WHAT:

- Checkmark icon (green)
- Text has strikethrough
- Card fades to 60% opacity
- Moves to "Completed" section
- Shows completion time and who completed it

WHY:

- Checkmark = universal symbol of completion
- Green = positive reinforcement
- Strikethrough = visual closure
- Fade = "done but still visible" (reassurance)
- Completion info = accountability and coordination
- Separate section = progress visible, doesn't clutter active tasks

WHAT NOT TO DO:

- Don't remove immediately - user needs reassurance it's saved
- Don't use subtle checkmark - user needs clear confirmation
- Don't hide who completed it - family coordination requires transparency
- Don't use gray checkmark - green = positive emotion
```

**Your turn:**

```
For each state, document:

### [State Name]

WHAT:
- [Visual appearance]

WHY:
- [User benefit]

WHAT NOT TO DO:
- [Mistakes to prevent]
```

---

## Step 5: Specify Error Handling (10 min)

### Document failure states with empathy

**Example (Dog Week - Network Errors):**

```markdown
## Error Handling

### Network Unavailable

WHAT:

- Subtle banner at top: "Offline - showing cached schedule"
- Banner uses neutral gray (not red)
- All actions still work (queued for sync)
- Small cloud icon with slash
- Dismissible but reappears if action attempted

WHY:

- User shouldn't be blocked by network issues
- Morning routine can't wait for connectivity
- Cached data is usually sufficient (schedule doesn't change minute-to-minute)
- Gray = informational, not alarming
- Actions queue = user can continue working
- Dismissible = user controls their experience

WHAT NOT TO DO:

- Don't block user with error modal - breaks morning flow
- Don't use red/error colors - network issues aren't user's fault
- Don't disable all actions - most can work offline
- Don't hide offline state - user needs to know why sync isn't happening
- Don't make banner permanent - user should be able to dismiss

### Task Completion Failed

WHAT:

- Task remains in "completing" state (spinner)
- After 5 seconds, shows inline error: "Couldn't save. Tap to retry."
- Error message is specific and actionable
- Retry button prominent
- Task doesn't move to completed section

WHY:

- User needs to know action didn't complete
- 5 seconds = reasonable wait before showing error
- Inline = error appears where user's attention is
- Specific message = user understands what happened
- Actionable = user knows what to do next
- Retry button = easy path to resolution
- Task stays in place = user doesn't lose context

WHAT NOT TO DO:

- Don't silently fail - user needs to know
- Don't show generic "Error occurred" - not helpful
- Don't move task to completed - creates false sense of completion
- Don't require user to find task again - maintain context
- Don't blame user - focus on solution
```

**Your turn:**

```
For each error scenario:

### [Error Type]

WHAT:
- [How error is shown]

WHY:
- [User benefit]

WHAT NOT TO DO:
- [Mistakes to prevent]
```

---

## Step 6: Specify Accessibility (10 min)

### Document inclusive design decisions

**Example (Dog Week - Task List Accessibility):**

```markdown
## Accessibility

### Screen Reader Support

WHAT:

- Each task has semantic HTML structure
- ARIA labels for all interactive elements
- Task status announced: "Walk Max, 8:00 AM, assigned to you, not completed"
- Completion action announces: "Task marked complete"
- Heading hierarchy: H1 for date, H2 for sections, H3 for tasks

WHY:

- Screen reader users need same quick access to their tasks
- Semantic HTML = proper navigation and understanding
- Status announcement = full context without visual cues
- Action feedback = confirmation for non-visual users
- Heading hierarchy = easy navigation via landmarks

WHAT NOT TO DO:

- Don't use divs for everything - semantic HTML matters
- Don't skip ARIA labels - "button" isn't descriptive enough
- Don't announce only task name - user needs full context
- Don't skip action feedback - non-visual users need confirmation
- Don't flatten heading structure - breaks navigation

### Keyboard Navigation

WHAT:

- All actions accessible via keyboard
- Tab order follows visual hierarchy (user's tasks first)
- Enter/Space to complete task
- Arrow keys to navigate between tasks
- Escape to close expanded sections
- Focus indicators clearly visible (blue outline, 2px)

WHY:

- Some users can't or prefer not to use mouse/touch
- Tab order matches visual priority (user's tasks most important)
- Standard key bindings = familiar, predictable
- Arrow keys = efficient navigation for power users
- Escape = universal "go back" pattern
- Visible focus = user always knows where they are

WHAT NOT TO DO:

- Don't trap focus in modals without escape
- Don't use non-standard key bindings
- Don't hide focus indicators - accessibility requirement
- Don't make tab order illogical
- Don't require mouse for any action

### Color Contrast

WHAT:

- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements have 3:1 contrast with background
- Status colors have additional non-color indicators (icons, borders)
- High contrast mode supported

WHY:

- Users with low vision need readable text
- Color alone isn't sufficient for status (color blind users)
- Multiple indicators = works for everyone
- High contrast mode = accessibility feature in OS

WHAT NOT TO DO:

- Don't rely on color alone for status
- Don't use low contrast text (looks modern but excludes users)
- Don't ignore WCAG standards - they're minimum requirements
- Don't break high contrast mode with custom colors
```

**Your turn:**

```
Document accessibility considerations:
[Your specifications]
```

---

## Step 7: Review and Refine (10 min)

### Checklist:

**Completeness:**

- ✓ Every visual element has WHAT + WHY + WHAT NOT
- ✓ All interactions documented
- ✓ All states specified
- ✓ Error handling covered
- ✓ Accessibility addressed

**Quality:**

- ✓ WHY explains user benefit, not just description
- ✓ WHAT NOT prevents specific AI mistakes
- ✓ Specifications are specific and actionable
- ✓ Design intent is preserved
- ✓ Edge cases considered

**AI Support:**

```
Agent: "Your design brilliance is captured beautifully! Let me verify:
- Have we documented every nuance of your thinking?
- Are there any alternatives you considered that we should note?
- Any edge cases we haven't covered?
- Is your creative intent crystal clear?"
```

---

## Step 8: Save Your Specifications

**Create file:** `C-Scenarios/[scenario-name]/Frontend/[page-name]-specifications.md`

**Use template from:** `workflows/4-ux-design/templates/page-specification.template.md`

---

## What You've Accomplished

✅ **Complete specifications** - Every design decision documented  
✅ **Preserved intent** - Your creative thinking captured  
✅ **Prevented mistakes** - AI knows what NOT to do  
✅ **Accessible design** - Inclusive from the start  
✅ **Eternal life** - Your brilliance lives forever in text

**This is not factory work - this is where your genius becomes immortal!**

---

## The Power of Conceptual Specs

**Traditional approach:**

- Designer creates mockup
- Developer implements
- Intent gets lost
- Result is "close but wrong"

**WDS approach:**

- Designer thinks deeply with AI partner
- AI helps capture every nuance
- Specifications preserve creative integrity
- Implementation matches intent perfectly

**Your specifications completely replace prompting** - providing clarity that works like clockwork.

---

## Next Steps

**Immediate:**

- Review specifications with stakeholders
- Validate against user needs
- Test with developers (can they implement from this?)

**Next Module:**

- [Module 13: Validate Specifications](../module-13-validate-specifications/module-13-overview.md)
- Ensure completeness and test logic

---

## Common Questions

**Q: How detailed should specifications be?**  
A: Detailed enough that AI can implement correctly without guessing. If you'd need to explain it to a developer, document it.

**Q: Isn't this a lot of writing?**  
A: AI agents help you! They're fascinated by your thinking and help capture it. You're not grinding out docs - you're preserving your genius.

**Q: What if I don't know why I made a decision?**  
A: That's the value! The process of documenting WHY helps you think deeper and make better decisions.

**Q: Can I reuse specifications across pages?**  
A: Yes! Common patterns become design system components. Document once, reference everywhere.

---

## Tips for Success

**DO ✅**

- Work with AI as thinking partner
- Document alternatives you rejected
- Be specific about user context
- Prevent specific mistakes (not generic warnings)
- Capture your creative reasoning

**DON'T ❌**

- Write generic descriptions
- Skip the WHY (that's where intent lives)
- Forget WHAT NOT TO DO (AI will make "helpful" mistakes)
- Rush through this - it's where brilliance is preserved
- Think of this as factory work - it's creative documentation

---

**Your specifications give your designs eternal life. This is where your creative integrity becomes immortal!**

[← Back to Module 12](module-12-overview.md) | [Next: Module 13 →](../module-13-validate-specifications/module-13-overview.md)
