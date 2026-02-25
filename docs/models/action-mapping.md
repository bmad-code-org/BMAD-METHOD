# Action Mapping

**A visual approach to designing training and experiences that focuses on what people DO, not what they KNOW**

**Originated by:** Cathy Moore  
**Source:** Action Mapping website and workshops (2008+)  
**Applied in WDS:** Scenario design, interaction design, UX specifications

---

## What It Is

**Action Mapping** is a visual design process that helps create effective training and user experiences by focusing on observable actions rather than information delivery.

**The Core Structure:**

```
1. Business Goal (What measurable outcome do we want?)
   ↓
2. Actions (What must people DO to achieve it?)
   ↓
3. Practice (How can they practice those actions?)
   ↓
4. Information (What minimum info do they need?) - ONLY IF NECESSARY
```

**Revolutionary Insight:** People don't need more information. They need to practice better actions. Information should support action, not replace it.

---

## Why It Matters

### The Problem Without Action Mapping

Traditional approach to design and training:
- Dumps information on people
- Assumes knowledge = ability
- "Here's everything you might need to know"
- No practice, just reading/watching
- Boring, ineffective, forgettable
- People leave informed but unable

**Example Bad Training:**
"Here are 47 slides about our CRM system. Now go use it!"

### The Solution With Action Mapping

Action-focused approach:
- Identifies what people must DO
- Provides realistic practice
- Information only when needed
- Engaging, effective, memorable
- People leave capable and confident

**Example Good Training:**
"Here's a real customer scenario. Show me how you'd handle it. [Practice] Need help? Here's the relevant info. [Just-in-time] Try again."

**The Core Insight:** Behavior change, not information transfer, achieves business goals.

---

## How It's Valuable in Strategic Design

### 1. **Scenario Design**

Instead of "What should users know about this feature?", ask:
**"What should users be able to DO?"**

**Traditional Feature Design:**
```
New Feature: Advanced Reporting
Content Needed:
- What reports are
- Types of reports available
- How reporting engine works
- Report customization options
```

**Action Mapping Approach:**
```
Business Goal: Managers make data-driven decisions daily

Actions Needed:
- Generate weekly team report (Tuesday mornings)
- Spot performance outliers in <30 seconds
- Share insights with team

Practice Scenarios:
- "It's Tuesday. Get your team report."
- "Sales dropped last week. Find out why."
- "Show Sarah this insight."

Info: Only what's needed to complete these actions
```

**Result:** Users learn by DOING, not reading documentation.

### 2. **Onboarding Flows**

Traditional onboarding = product tour (information dump)  
Action Mapping onboarding = guided practice

**Instead of:**
"Here's where tasks live. Here's how to create them. Here's how to assign them..."

**Do:**
"Let's create your first task. [Do it] Great! Now assign it to yourself. [Do it] Perfect! You've got the basics."

### 3. **Help Documentation**

Traditional docs = reference manual  
Action Mapping docs = action-oriented guides

**Instead of:**
"Reporting Module: The reporting module allows users to generate various types of reports..."

**Do:**
"Generate Your Weekly Report: 1. Click Reports, 2. Select 'Team Performance', 3. Choose date range, 4. Click Generate"

### 4. **Error Messages and Empty States**

Traditional = explain what went wrong  
Action Mapping = guide toward successful action

**Instead of:**
"Error: No data available for selected parameters"

**Do:**
"Let's find your data: Try expanding your date range or selecting a different filter"

### 5. **Component Design**

Traditional = show all options  
Action Mapping = guide user toward most common successful actions

**Example: File Upload**
- Most common action: Drag and drop
- Make that HUGE and obvious
- Other options smaller (browse, paste URL)
- Result: Users DO the happy path naturally

---

## Attribution and History

### Cathy Moore - The Creator

**Cathy Moore** is an instructional designer who developed Action Mapping in response to ineffective traditional training approaches. She noticed that most training focused on delivering information rather than changing behavior.

Her background in journalism and instructional design led her to ask: "What do people need to DO differently?" rather than "What do they need to know?"

### Development and Influence

**Timeline:**
- Late 2000s: Developed Action Mapping methodology
- 2008+: Shared freely on blog.cathy-moore.com
- 2010s: Became widely adopted in e-learning community
- Now: Influences UX design, product onboarding, and user experience beyond training

**Impact:**
- Shifted e-learning from "page-turners" to interactive scenarios
- Influenced UX onboarding design
- Changed how designers think about user education
- Emphasis on practice over information now standard in good UX

### Philosophy

Moore's core belief: **"People come to work to do a job, not to learn."**

Therefore:
- Focus on job performance, not knowledge transfer
- Provide practice, not presentations
- Give information only when needed (just-in-time)
- Measure behavior change, not quiz scores

---

## Source Materials

### Website and Blog

🔗 **[Blog.Cathy-Moore.com](https://blog.cathy-moore.com)**
- Original source for Action Mapping
- Free detailed explanations
- Case studies and examples
- Downloads and templates
- "The best training blog you're not reading"

🔗 **[Action Mapping: The Infographic](https://blog.cathy-moore.com/action-mapping-a-visual-approach-to-training-design/)**
- Visual guide to the process
- Free to download and share

### Books and Resources

📚 **Map It: The Hands-On Guide to Strategic Training Design**  
By Cathy Moore (2017)

- Comprehensive guide to Action Mapping
- Step-by-step worksheets
- Real project examples
- [Available on Amazon](https://www.amazon.com/Map-Hands-Guide-Strategic-Training/dp/1973967812)

### Workshops and Courses

🎓 **Action Mapping Workshops**
- Cathy Moore offers periodic workshops
- Check blog.cathy-moore.com for schedule

🎓 **Online Training on Action Mapping**
- Various platforms offer courses teaching the methodology
- Search for "Action Mapping course" on LinkedIn Learning, Udemy

### Articles

🔗 **"Action Mapping: A Visual Approach to Training Design"**
- Core article explaining the methodology
- Available on Cathy Moore's blog

🔗 **"Saving the World from Boring Training"**
- Philosophy and approach
- [Blog.Cathy-Moore.com](https://blog.cathy-moore.com)

---

## Whiteport Methods That Harness This Model

### [Phase 4: UX Design Guide](../method/phase-4-ux-design-guide.md)

Scenario design uses Action Mapping principles:

**Instead of "What does user need to know about this page?"**

**Ask:**
1. What is the user trying to DO here?
2. What actions lead to success?
3. How can we guide those actions?
4. What info supports (not replaces) action?

**Result:** Scenarios focused on user actions, not information architecture.

### Page Specifications

Component specs describe actions, not features:

**Traditional Spec:**
```
Component: Dashboard Widget
Features: Data display, filters, export button
```

**Action Mapping Spec:**
```
User Action: Check team performance at glance
Success: Spot issues in <10 seconds
Design: Key metrics prominent, issues red, drill-down on click
Info: Only when drilling down, not upfront
```

### Interaction Design

Flows prioritize action paths:

**Traditional Flow:**
```
1. Welcome screen (info)
2. Feature tour (info)
3. Tutorial (info)
4. Dashboard (finally do something!)
```

**Action Mapping Flow:**
```
1. "Let's create your first project" (action)
2. [User does it] (practice)
3. "Great! Now add a task" (next action)
4. [User does it] (more practice)
5. "You're ready! Here's your dashboard" (info only if needed)
```

---

## Imaginary Examples

### Example 1: Project Management Tool Onboarding

**Traditional Information-Focused:**

```
Screen 1: "Welcome to TaskMaster!"
Screen 2: "Here's your dashboard. This is where you'll see all your projects."
Screen 3: "Click here to create projects. Projects contain tasks."
Screen 4: "Tasks can be assigned to team members and have due dates."
Screen 5: "You can view tasks in list or board view."
Screen 6: "Reports help you track progress."
Screen 7: "Now try it yourself!"
```

**Action Mapping Approach:**

```
Screen 1: "Let's create your first project"
User: [Types project name, clicks create] ✅

Screen 2: "Every project needs tasks. Add one:"
User: [Types task, clicks add] ✅

Screen 3: "Who's doing this? Assign it:"
User: [Selects person] ✅

Screen 4: "You're all set! Here's your project."
[Show completed project with task assigned]

Tip available: "Want to add more? Click + to add tasks anytime."
```

**Result:** User has created project, added task, assigned it within 60 seconds. They KNOW how because they DID it.

### Example 2: Design System Documentation

**Traditional (Information Dump):**

```
# Button Component

The button component is used for user actions. It has several variants:

## Variants
- Primary: Main call-to-action
- Secondary: Secondary actions
- Tertiary: Low-priority actions
- Danger: Destructive actions

## Properties
- size: 'sm' | 'md' | 'lg'
- variant: 'primary' | 'secondary' | 'tertiary' | 'danger'
- disabled: boolean
- onClick: function

## Examples
[Code examples]

## Usage Guidelines
[More information]
```

**Action Mapping Approach:**

```
# Button Component

## What Are You Trying to Do?

→ Create a main call-to-action
   Use: <Button variant="primary">
   Example: "Sign Up", "Save", "Continue"

→ Add a secondary action
   Use: <Button variant="secondary">
   Example: "Cancel", "Back", "Learn More"

→ Warn about destructive action
   Use: <Button variant="danger">
   Example: "Delete", "Remove", "Clear All"

## Quick Copy-Paste
[Most common code snippets ready to use]

→ Need all the details? [Expand full documentation]
```

**Result:** Designer finds what they need to DO, gets it done. Deep reference available but not required reading.

### Example 3: Feature Announcement

**Traditional (Broadcast Information):**

```
Subject: "Introducing Advanced Reporting!"

We're excited to announce Advanced Reporting is now available!

What's new:
- Custom report builder
- 15 new visualization types
- Scheduled report delivery
- Export to multiple formats

Advanced Reporting allows you to create sophisticated reports...
[Several more paragraphs explaining features]

Check it out in the Reports menu!
```

**Action Mapping Approach:**

```
Subject: "Generate Your Custom Report in 60 Seconds"

Hi [Name],

Want to see which features drove growth last month?

→ Click here to try the new report builder [Button]

You'll create a custom report in 3 steps:
1. Pick your data (sales, signups, usage)
2. Choose visualization (we'll suggest best one)
3. Save or schedule it

[Video: 45-second demo of doing exactly this]

Questions? Reply to this email.
```

**Result:** User clicks, DOES the thing, experiences value. Learns through action.

---

## Real Applications

### WDS Scenario Specifications

WDS scenario specs focus on actions:

**See:** [WDS Presentation Scenarios](../examples/WDS-Presentation/docs/4-scenarios/)

Each scenario specifies:
- **User Goal:** What user is trying to achieve (action-oriented)
- **Success Criteria:** Observable action completed
- **Key Interactions:** What user DOES at each step
- **Supporting Information:** Only what's needed for action

Not:
- Everything user might want to know
- All possible features explained
- Comprehensive tutorial

**Philosophy:** Users learn by doing, not reading. Guide action.

---

## The Four-Step Action Mapping Process

### Step 1: Define Business Goal (10 minutes)

**Not a learning objective!** What business outcome do we want?

**Good Goals:**
- "Reduce support tickets by 30%"
- "Increase feature adoption from 20% to 50%"
- "Managers make weekly data-driven decisions"

**Bad Goals:**
- "Users understand how reporting works"
- "Increase knowledge of features"
- "Complete training module"

**Why:** You want behavior change, not information transfer.

### Step 2: Identify Necessary Actions (20-30 minutes)

What must people DO (not know) to achieve that goal?

**For "Reduce support tickets by 30%":**

Actions users must take:
- Solve common problems themselves (not contact support)
- Find answers in help docs quickly
- Use self-service troubleshooting tools

**Key Question:** "If I could watch people working, what would I see them DOING that shows we're succeeding?"

**Avoid:**
- "Understand how system works" (not observable)
- "Know where help docs are" (not an action)
- "Be familiar with features" (vague)

**Want:**
- "Search help docs and find answer in <2 minutes"
- "Reset own password without help"
- "Check system status before contacting support"

### Step 3: Design Practice Activities (30-45 minutes)

How can people practice those actions?

**For each action, create realistic scenarios:**

**Action:** "Search help docs and find answer"

**Practice:**
```
Scenario: Your report isn't generating. The screen just says "Processing..."

What do you do? [Simulation where user can try actions]
- Search help docs? ✅ Shows article on report timeouts
- Contact support? ❌ "Could you solve this yourself first?"
- Wait longer? ❌ "It's been 10 minutes..."

[User finds answer, applies solution, report generates]

"Perfect! You saved 2 hours waiting for support."
```

**Characteristics of good practice:**
- Realistic context (not abstract)
- Consequences of choices (not just "right/wrong")
- Challenge appropriate to learner
- Feedback that guides, not lectures

### Step 4: Identify Minimum Information (15-20 minutes)

What information do people need to complete the actions?

**Critical Question:** "Can they DO the action without this information?"

**If YES → Don't include it**  
**If NO → Include it just-in-time**

**Example:**

**Action:** Generate weekly team report

**Info they DON'T need upfront:**
- Complete feature list of reporting module
- History of how reporting was built
- All possible customization options
- Technical architecture of reports

**Info they DO need:**
- Where to click to start ("Reports menu")
- Which report template to use ("Team Performance")
- How to set date range (quick inline guide)

**Provide info:**
- Right when they need it (not before)
- In context of action (not separate tutorial)
- As briefly as possible (then let them do it)

---

## Action Mapping vs. Information Dumping

| **Information Dumping** | **Action Mapping** |
|-------------------------|-------------------|
| "Here's everything about this feature" | "Here's how to accomplish your goal" |
| Starts with information | Starts with business goal |
| Explains how system works | Guides what user does |
| "Know this, then apply it" | "Do this, learn along the way" |
| Passive reading/watching | Active practice |
| Tests knowledge | Observes behavior |
| "Did they remember?" | "Can they do it?" |
| Front-loaded learning curve | Progressive disclosure |
| Boring | Engaging |

---

## Common Questions

### Q: What if people need conceptual understanding before acting?

**A:** Provide JUST enough concept to enable action, not comprehensive explanation. Example:

**Don't:** "Branches in Git are pointers to commits in the commit graph. When you create a branch..."
**Do:** "Think of branches like parallel workspaces. Let's create one: [command]. Try it."

Concept → minimal. Action → immediate.

### Q: What about reference documentation?

**A:** It still exists! Action Mapping is for learning and onboarding. Reference docs are for looking up details later. Users should be able to DO the common actions without reading reference docs.

### Q: Isn't this just good UX design?

**A:** Increasingly, yes! Action Mapping originated in training but its principles apply broadly:
- Onboarding
- Feature adoption
- Help systems
- Product design
- Any context where you want behavior change

### Q: What if the business goal isn't about behavior?

**A:** Usually is, indirectly. "Increase awareness" isn't measurable behavior. But "Attend webinar" or "Sign up for newsletter" are. Find the observable action.

### Q: How much practice is enough?

**A:** Enough that person can perform action independently with confidence. Usually:
- Simple action: 1-2 practice scenarios
- Complex action: 3-5 scenarios with increasing difficulty
- Critical action: Practice until automatic

---

## Using Action Mapping in Your Process

### For Onboarding Design

1. **Define success:** What does activated user DO?
2. **List actions:** What specific actions show activation?
3. **Design practice:** Guide user through those exact actions with real data
4. **Minimize info:** Remove any explanation not essential to action

**Test:** Can user complete key action within first session?

### For Feature Adoption

1. **Goal:** X% of users use feature monthly
2. **Actions:** What must they DO to use it successfully?
3. **Entry point:** Where do they encounter opportunity to practice?
4. **Guide action:** Show, don't tell

**Test:** Do users try feature after seeing it?

### For Documentation

1. **Identify common tasks:** What are people trying to DO?
2. **Action-oriented structure:** Organize by task, not feature
3. **Minimal explanation:** Just enough to complete task
4. **Quick examples:** Copy-paste ready

**Test:** Can users complete task from docs without asking for help?

### For Error Handling

1. **User goal:** What were they trying to DO?
2. **What went wrong:** Why can't they do it?
3. **Corrective action:** What specific action fixes it?
4. **Guide repair:** Show path forward

**Test:** Can users recover without frustration?

---

## Action Mapping Template

```markdown
## Business Goal
[What measurable outcome?]

## Actions Needed
[What must people DO to achieve goal?]
- Action 1: [Observable behavior]
- Action 2: [Observable behavior]
- Action 3: [Observable behavior]

## Practice Scenarios
[How will people practice each action?]

Action 1: [Observable behavior]
- Scenario: [Realistic context]
- User does: [Actual action]
- Feedback: [Result/guidance]

## Minimum Information
[Only what's needed to complete actions]
- Info bit 1: [Just-in-time, just-enough]
- Info bit 2: [Provided in context]

## Success Metric
[How do we measure behavior change?]
```

---

## Next Steps

1. **Read:** Cathy Moore's blog (blog.cathy-moore.com) - start with Action Mapping intro
2. **Try:** Take one feature/onboarding flow and redesign using Action Mapping
3. **Test:** Does new version enable action faster than old info-dump version?
4. **Apply:** Use action-focus in next scenario specification

**Related Resources:**
- [Phase 4: UX Design Guide](../method/phase-4-ux-design-guide.md) - Scenario design using action focus
- [Trigger Mapping Guide](../method/phase-2-trigger-mapping-guide.md) - Connect actions to driving forces
- [Blog.Cathy-Moore.com](https://blog.cathy-moore.com) - Original source and examples

---

*Action Mapping - People don't need to know, they need to DO.*

