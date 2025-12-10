# AI Collaboration with Excalidraw

**How to work with AI using Excalidraw sketches**

---

## Overview

AI can both **generate** Excalidraw files and **analyze** your sketches, creating a powerful collaborative design workflow.

---

## AI Can Generate Excalidraw Files

### **What AI Can Create:**

**Layout Variations:**

```
You: "Create 3 dashboard layout options"
AI:  Generates 3 .excalidraw files
```

**Component Alternatives:**

```
You: "Show me different navigation patterns"
AI:  Generates bottom nav, hamburger, tab bar
```

**User Flows:**

```
You: "Create a user onboarding flow"
AI:  Generates flowchart with decision points
```

**State Variations:**

```
You: "Show this button in all states"
AI:  Generates default, hover, active, disabled, loading
```

**Responsive Designs:**

```
You: "Show this page on mobile, tablet, desktop"
AI:  Generates 3 breakpoint wireframes
```

---

## How to Request Excalidraw Files

### **Be Specific:**

**❌ Vague:**

```
"Make a login page"
```

**✅ Specific:**

```
"Create a mobile login page (375×812) with:
- Logo at top
- Email and password inputs
- Primary sign-in button
- Social login options (Google, Apple)
- 'Forgot password' link
Use 20px grid and WDS spacing"
```

### **Request Multiple Options:**

**Pattern:**

```
"Create [number] variations of [page/component] with:
- Option 1: [description]
- Option 2: [description]
- Option 3: [description]"
```

**Example:**

```
"Create 3 dashboard variations:
1. Card-based layout (large cards, visual focus)
2. List-based layout (compact, more items visible)
3. Calendar-focused (timeline view, date-centric)"
```

### **Specify Constraints:**

**Include:**

- Device size (mobile/tablet/desktop)
- Grid size (20px)
- Key components needed
- Visual hierarchy priorities
- Spacing preferences

**Example:**

```
"Create a mobile task list (375×812):
- Use 20px grid
- Task cards should be 335×80
- 20px spacing between cards
- Show task name, time, assignee, status
- Include 'Add task' button at bottom"
```

---

## AI Can Analyze Your Sketches

### **The Process:**

**Step 1: Export to PNG**

```
1. Open .excalidraw file
2. Export → PNG
3. Save alongside source
```

**Step 2: Upload to AI**

```
Upload PNG to Claude/ChatGPT/Windsurf
```

**Step 3: Ask for Analysis**

```
"Here's my dashboard sketch. What do you think?"
"Analyze this layout and suggest improvements"
"What's working and what's not in this design?"
```

### **What AI Can See:**

**Layout and Structure:**

- Component placement
- Visual hierarchy
- Spacing and alignment
- Section organization

**Design Decisions:**

- Primary vs secondary actions
- Content prioritization
- Navigation patterns
- Information architecture

**Potential Issues:**

- Crowded areas
- Unclear hierarchy
- Inconsistent spacing
- Missing elements
- Usability concerns

---

## Collaboration Patterns

### **Pattern 1: AI Generates, You Refine**

**Workflow:**

```
1. AI generates initial options
2. You review and choose direction
3. You refine in Excalidraw
4. Export and discuss changes
5. AI suggests further improvements
6. Iterate until satisfied
```

**Example:**

```
You: "Create 3 login page variations"
AI:  [Generates 3 files]

You: [Opens each, reviews]
     "I like option 2 best, but the social buttons
      should be more prominent"

You: [Edits option 2 in Excalidraw]
     [Exports to PNG]
     [Uploads]
     "Here's my refined version"

AI:  "Great improvement! The social buttons are now
      more prominent. Consider:
      - Adding visual separation with a divider
      - Making the 'or' text more subtle
      - Ensuring touch targets are 44×44px minimum"

You: [Makes final adjustments]
```

### **Pattern 2: You Sketch, AI Analyzes**

**Workflow:**

```
1. You sketch initial idea
2. Export to PNG
3. Upload to AI
4. AI provides analysis
5. You iterate based on feedback
6. Repeat until refined
```

**Example:**

```
You: [Sketches dashboard]
     [Exports and uploads]
     "What do you think of this layout?"

AI:  "I can see you've prioritized today's tasks at the top.
      Strong points:
      - Clear visual hierarchy
      - Task cards are well-sized
      - Good use of spacing

      Consider:
      - The 'Add task' button might get lost at bottom
      - No indication of overdue tasks
      - Missing empty state design
      - Calendar integration could be more prominent"

You: [Updates sketch based on feedback]
     [Exports and uploads]
     "Better?"

AI:  "Much better! The floating 'Add' button is more
      accessible. Now let's discuss the overdue task
      treatment..."
```

### **Pattern 3: Collaborative Iteration**

**Workflow:**

```
1. You sketch rough idea
2. AI generates refined version
3. You compare and merge best parts
4. AI suggests alternatives
5. You choose direction
6. Repeat until optimal
```

**Example:**

```
You: [Rough sketch of profile page]
     "Here's my rough idea for a profile page"

AI:  "I see your concept. Let me create a refined version
      based on your sketch, plus 2 alternative approaches"
      [Generates 3 files]

You: [Reviews all 3]
     "I like my header from original, your content
      layout from option 2, and the action buttons
      from option 3"

AI:  "Perfect! Let me combine those elements"
      [Generates merged version]

You: [Reviews]
     "This is it! Now let's refine the details..."
```

---

## AI Analysis Examples

### **Example 1: Layout Analysis**

**You upload:**

```
Dashboard sketch with task list
```

**AI responds:**

```
"Analysis of your dashboard layout:

STRENGTHS:
✓ Clear visual hierarchy (header → tasks → actions)
✓ Consistent card sizing (335×80)
✓ Good spacing (20px between elements)
✓ Primary action (Add task) is prominent

OPPORTUNITIES:
• Task cards could show more context (due date, priority)
• No indication of task status (completed vs pending)
• Missing empty state (what if no tasks?)
• Consider grouping by time (morning, afternoon, evening)
• Add quick filters (all, today, overdue)

QUESTIONS:
? How do users mark tasks complete?
? What happens with overdue tasks?
? Can users see other family members' tasks?
? Is there a calendar view option?

RECOMMENDATIONS:
1. Add visual status indicators (checkboxes, colors)
2. Design empty state with helpful message
3. Consider time-based grouping for better scanning
4. Add filter/view options for different contexts"
```

### **Example 2: Component Analysis**

**You upload:**

```
Button component in various states
```

**AI responds:**

```
"Analysis of your button states:

DEFAULT STATE:
✓ Good size (120×40)
✓ Clear label
✓ Appropriate padding
• Consider slightly larger touch target (44px height minimum)

HOVER STATE:
✓ Color change is clear
✓ Maintains size (no layout shift)
• Consider adding subtle shadow for depth

ACTIVE STATE:
✓ Pressed appearance (darker color)
• Could add slight scale down (0.98) for tactile feedback

DISABLED STATE:
✓ Reduced opacity
✓ Clear visual difference
• Ensure sufficient contrast for accessibility (3:1 minimum)

LOADING STATE:
✓ Spinner visible
✓ Button remains same size
• Consider disabling during load (prevent double-click)

OVERALL:
Strong foundation! All states are clearly differentiated.
Consider adding focus state for keyboard navigation."
```

### **Example 3: Flow Analysis**

**You upload:**

```
User onboarding flow diagram
```

**AI responds:**

```
"Analysis of your onboarding flow:

FLOW STRUCTURE:
✓ Clear start and end points
✓ Logical progression (welcome → setup → tutorial → dashboard)
✓ Decision points well-placed

POTENTIAL ISSUES:
• No error recovery paths shown
• Missing "skip" option for optional steps
• Tutorial might be too long (4 steps)
• No way to go back if user makes mistake

EDGE CASES TO CONSIDER:
? What if user closes app mid-onboarding?
? What if user wants to skip tutorial?
? What if setup fails (network error)?
? Can user revisit tutorial later?

RECOMMENDATIONS:
1. Add error states and recovery paths
2. Include "Skip" option with clear consequences
3. Consider condensing tutorial to 2-3 key points
4. Add progress indicator (step 1 of 4)
5. Save progress so user can resume
6. Add "Back" button for all steps"
```

---

## Best Practices

### **DO ✅**

**When requesting AI generation:**

- Be specific about requirements
- Request multiple variations (2-5)
- Specify device size and constraints
- Mention grid and spacing preferences
- Include key components needed

**When uploading for analysis:**

- Export clear PNG (not blurry)
- Include annotations in sketch
- Ask specific questions
- Be open to suggestions
- Iterate based on feedback

**During collaboration:**

- Combine AI suggestions with your expertise
- Don't accept everything blindly
- Use AI to explore alternatives
- Let AI handle tedious variations
- Focus your creativity on key decisions

### **DON'T ❌**

**Don't:**

- Accept first AI suggestion without review
- Skip your own design thinking
- Let AI make all decisions
- Ignore your instincts
- Forget to iterate
- Skip the "why" behind choices

---

## Iteration Workflow

### **Typical Session:**

**Round 1: Exploration**

```
You: "Create 3 dashboard options"
AI:  [Generates options]
You: [Reviews] "Option 2 is closest"
```

**Round 2: Refinement**

```
You: "Refine option 2 with more breathing room"
AI:  [Generates refined version]
You: [Reviews] "Better! Now add calendar integration"
```

**Round 3: Details**

```
You: [Edits in Excalidraw]
     [Uploads] "Here's my version with calendar"
AI:  "Great! Let's discuss the calendar placement..."
```

**Round 4: Edge Cases**

```
AI:  "What about empty state? Overdue tasks?"
You: "Good point. Show me options for those"
AI:  [Generates state variations]
```

**Round 5: Finalization**

```
You: [Combines best elements]
     "This is the final version"
AI:  "Perfect! Ready to create specifications?"
```

---

## Advanced Techniques

### **Technique 1: Parallel Exploration**

**Generate multiple directions simultaneously:**

```
You: "Create 3 completely different approaches:
      1. Minimalist (focus on one task at a time)
      2. Information-dense (show everything)
      3. Visual-first (images and colors prominent)"

AI:  [Generates 3 very different designs]
You: [Explores each direction]
     [Chooses best elements from each]
```

### **Technique 2: Constraint-Based Design**

**Use AI to explore within constraints:**

```
You: "Design a dashboard that works with:
      - One-handed use (thumb zone)
      - Glanceable in 2 seconds
      - Maximum 3 actions visible
      - No scrolling required"

AI:  [Generates constrained design]
You: [Validates against constraints]
```

### **Technique 3: Comparative Analysis**

**Have AI compare your options:**

```
You: [Uploads 3 variations you created]
     "Compare these 3 options. Which is best for:
      - First-time users
      - Power users
      - Accessibility"

AI:  [Provides detailed comparison]
You: [Makes informed decision]
```

---

## Next Steps

**After AI collaboration:**

1. ✅ Finalized sketch
2. ✅ Design decisions documented
3. ✅ Edge cases considered
4. ✅ Ready for specifications

**Continue to:**

- [Export Workflow](export-workflow.md) - Prepare for documentation
- Phase 4C: Create specifications

---

**AI is your design partner - use it to explore, analyze, and refine, but keep your creative judgment at the center!** 🤝✨
