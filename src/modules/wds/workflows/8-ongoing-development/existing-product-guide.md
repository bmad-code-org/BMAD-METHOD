# Phase 8: Existing Product Development

**Jump into an existing product to make strategic improvements**

---

## 🔑 Key Point: You Still Create a Project Brief!

**Brownfield projects (existing products) still need a Project Brief - just adapted to focus on:**

- ✅ The strategic challenge you're solving
- ✅ The scope of changes
- ✅ Success criteria
- ✅ Constraints

**You're not skipping Phase 1 - you're adapting it to the existing product context.**

---

## Two Entry Points to WDS

### **Entry Point 1: New Product (Phases 1-7) - Greenfield + Kaikaku**

Starting from scratch, designing complete user flows

**Terminology:**

- **Greenfield:** Building from scratch with no existing constraints
- **Kaikaku (改革):** Revolutionary change, complete transformation

### **Entry Point 2: Existing Product (Phase 8) - Brownfield + Kaizen**

Jumping into an existing product to make strategic changes

**Terminology:**

- **Brownfield:** Working within existing system and constraints
- **Kaizen (改善):** Continuous improvement, small incremental changes

**This phase is for:**

- Existing products that need strategic improvements
- Products where you're brought in as a "linchpin designer"
- Situations where you're not designing complete flows from scratch
- Making targeted changes to existing screens and features

---

## Purpose

When joining an existing product, you:

1. Focus on strategic challenges (not complete redesign)
2. Make targeted improvements to existing screens
3. Add new features incrementally
4. Package changes as Design Deliveries (small scope)
5. Work within existing constraints

**This is a different workflow** - you're not designing complete flows, you're making critical updates to an existing system.

---

## Phase 8 Workflow (Existing Product)

```
Existing Product
    ↓
Strategic Challenge Identified
    ↓
┌─────────────────────────────────────┐
│ Phase 8.1: Project Brief (Adapted)  │
│ - What strategic challenge?         │
│ - What are we trying to solve?      │
│ - Why bring in WDS designer?        │
│ - What's the scope?                 │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Phase 8.2: Existing Context         │
│ - Upload business goals             │
│ - Upload target group material      │
│ - Print out trigger map             │
│ - Understand existing product       │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Phase 8.3: Critical Updates         │
│ - Design targeted changes           │
│ - Update existing screens           │
│ - Add strategic features            │
│ - Focus on solving challenge        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Phase 8.4: Design Delivery          │
│ → [Touch Point 2: WDS → BMad]       │
│   Hand off changes (DD-XXX)         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Phase 8.5: Validation               │
│ ← [Touch Point 3: BMad → WDS]       │
│   Designer validates                │
└─────────────────────────────────────┘
    ↓
✅ Deploy Changes
    ↓
(Repeat for next strategic challenge)
```

---

## Project Setup: Choosing Your Entry Point

**During project initialization, you'll be asked:**

```
Which type of project are you working on?

1. New Product
   → Start with Phase 1 (Project Brief)
   → Design complete user flows from scratch
   → Full WDS workflow (Phases 1-7)

2. Existing Product
   → Start with Phase 8 (Existing Product Development)
   → Make strategic improvements to existing product
   → Focused on critical updates, not complete redesign
```

**If you choose "Existing Product" (Brownfield):**

- **Phase 1 (Project Brief):** Adapted - focus on strategic challenge, not full vision
- **Phase 2 (Trigger Map):** Optional - print out focused trigger map if needed
- **Phase 3 (Platform Requirements):** Skip - tech stack already decided
- **Phase 4-5:** Adapted - update existing screens, not complete flows
- **Phase 6-7:** Same - deliveries and validation work the same way

---

## Phase 8.1: Project Brief (Adapted for Brownfield)

**IMPORTANT: You still create a Project Brief - just adapted to the existing product context.**

**Brownfield vs Greenfield:**

- **Greenfield (New Product):** Full Project Brief covering vision, goals, stakeholders, constraints
- **Brownfield (Existing Product):** Focused Project Brief covering the strategic challenge and scope

**You're not skipping the Project Brief - you're adapting it to focus on:**

### **The Strategic Challenge**

```markdown
# Limited Project Brief: Existing Product

## Strategic Challenge

What specific problem are we solving?

Example:
"User onboarding has 60% drop-off rate. Users don't understand
the family concept and abandon during setup."

## Why WDS Designer?

Why bring in a linchpin designer now?

Example:
"We need expert UX design to redesign the onboarding flow and
improve completion rates to 80%+."

## Scope

What are we changing?

Example:
"Redesign onboarding flow (4 screens):

- Welcome screen (update copy and visuals)
- Family setup (simplify and clarify)
- Dog addition (make it optional for MVP)
- Success state (add celebration)"

## Success Criteria

How will we measure success?

Example:
"- Onboarding completion rate > 80%

- Time to complete < 2 minutes
- User satisfaction score > 4.5/5"

## Constraints

What can't we change?

Example:
"- Tech stack: React Native + Supabase (already built)

- Brand: Colors and logo are fixed
- Timeline: 2 weeks to design + implement
- Scope: Only onboarding, don't touch other features"
```

---

## Phase 8.2: Existing Context

**Upload and review existing materials:**

### **Business Goals**

```
Upload: business-goals.pdf
Review: What's the company trying to achieve?
```

### **Target Group Material**

```
Upload: user-personas.pdf
Upload: user-research.pdf
Review: Who are the users? What do they need?
```

### **Print Out Trigger Map**

```
Based on existing materials, create a focused trigger map:
- What triggers bring users to this feature?
- What outcomes are they seeking?
- What's currently failing?
```

**Example (Focused Trigger Map):**

```markdown
# Trigger Map: Onboarding Improvement

## Trigger Moment

User downloads app and opens it for the first time

## Current Experience

1. Welcome screen (confusing value prop)
2. Login/Signup choice (too many options)
3. Family setup (unclear what "family" means)
4. Dog addition (forced, feels like homework)
5. 60% drop off before reaching dashboard

## Desired Outcome

User understands value, completes setup, reaches dashboard

## Barriers

- Unclear value proposition
- "Family" concept is confusing
- Forced dog addition feels like work
- No sense of progress or achievement

## Solution Focus

- Clarify value prop on welcome screen
- Simplify family concept explanation
- Make dog addition optional
- Add progress indicators and celebration
```

### **Understand Existing Product**

```
Review:
- Current app (use it yourself)
- Existing design system (if any)
- Technical constraints
- User feedback and analytics
```

---

## Phase 8.3: Critical Updates (Not Complete Flows)

**Key difference: You're updating existing screens, not designing from scratch**

### **Example: Onboarding Improvement**

**Scenario 01: Welcome Screen (Update)**

```markdown
# Scenario 01: Welcome Screen (UPDATE)

## What's Changing

- Clearer value proposition
- Better visual hierarchy
- Stronger call-to-action

## What's Staying

- Brand colors
- Logo placement
- Screen structure

## Design Updates

- Hero image: Show family using app together
- Headline: "Keep your family's dog care organized"
- Subheadline: "Share tasks, track routines, never miss a walk"
- CTA: "Get Started" (larger, more prominent)

## Components

- Existing: Button (Primary)
- Update: Hero Image component
- Update: Typography (larger headline)
```

**Scenario 02: Family Setup (Redesign)**

```markdown
# Scenario 02: Family Setup (REDESIGN)

## Current Problem

Users don't understand what "family" means in this context

## Solution

- Rename "Family" to "Household"
- Add explanation: "Who helps take care of your dog?"
- Show examples: "You, your partner, your kids, your dog walker"
- Make it visual: Show avatars of household members

## Design Changes

- Screen title: "Set up your household"
- Explanation text (new)
- Visual examples (new)
- Simplified form (fewer fields)

## Components

- Existing: Input (Text)
- New: Explanation Card component
- New: Avatar Grid component
```

**Scenario 03: Dog Addition (Make Optional)**

```markdown
# Scenario 03: Dog Addition (MAKE OPTIONAL)

## Current Problem

Forcing users to add a dog feels like homework, causes drop-off

## Solution

- Make it optional for onboarding
- Show value: "Add your first dog to get started"
- Allow skip: "I'll do this later"
- Celebrate if they add: "Great! Let's meet [dog name]!"

## Design Changes

- Add "Skip for now" button
- Add celebration animation if dog added
- Update copy to be inviting, not demanding

## Components

- Existing: Button (Primary, Secondary)
- New: Celebration Animation component
```

**Notice the difference:**

- ❌ Not designing complete flows from scratch
- ✅ Updating existing screens strategically
- ✅ Focused on solving specific problems
- ✅ Working within existing constraints

---

## What Triggers a Design Delivery?

### **Accumulated Changes**

**Small changes accumulate:**

- Bug fix: Button alignment
- Refinement: Improved error message
- Enhancement: New filter option
- Fix: Loading state missing
- Improvement: Better empty state

**When enough changes accumulate:**

```
10-15 small changes = Design Delivery
OR
3-5 medium features = Design Delivery
OR
1 major feature = Design Delivery
```

### **Business Triggers**

**Scheduled releases:**

- Monthly updates
- Quarterly feature releases
- Annual major versions

**Market triggers:**

- Competitor feature launched
- User demand spike
- Business opportunity

**Technical triggers:**

- Platform update (iOS 18, Android 15)
- Security patch required
- Performance optimization needed

---

## Ongoing Development Workflow

### Step 1: Monitor & Gather Feedback

**Sources:**

- User feedback (support tickets, reviews)
- Analytics (usage patterns, drop-offs)
- Team observations (bugs, issues)
- Stakeholder requests (new features)

**Track in backlog:**

```
Backlog:
- [ ] Bug: Login button misaligned on iPad
- [ ] Enhancement: Add "Remember me" checkbox
- [ ] Feature: Social login (Google, Apple)
- [ ] Refinement: Improve onboarding copy
- [ ] Fix: Loading spinner not showing
```

---

### Step 2: Prioritize Changes

**Criteria:**

- **Impact:** High user value vs low effort
- **Urgency:** Critical bugs vs nice-to-haves
- **Alignment:** Strategic goals vs random requests
- **Feasibility:** Quick wins vs complex changes

**Prioritized list:**

```
High Priority (Next Update):
1. Bug: Login button misaligned (Critical)
2. Fix: Loading spinner not showing (High)
3. Enhancement: Add "Remember me" (Medium)

Medium Priority (Future Update):
4. Feature: Social login (Medium)
5. Refinement: Improve copy (Low)

Low Priority (Backlog):
6. Enhancement: Dark mode (Low)
```

---

### Step 3: Design Changes

**Return to Phase 4-5:**

- Design fixes and refinements
- Create specifications for new features
- Update design system if needed
- Document changes

**Track changes:**

```
Changes for Design Delivery DD-011 (v1.1):
✓ Fixed: Login button alignment on iPad
✓ Added: Loading spinner to all async actions
✓ Enhanced: "Remember me" checkbox on login
✓ Updated: Error messages for clarity
✓ Improved: Empty state when no tasks
```

---

### Step 4: Create Design Delivery

**When enough changes accumulate:**

**File:** `deliveries/DD-XXX-design-delivery-vX.X.yaml`

```yaml
delivery:
  id: 'DD-010'
  name: 'Product Update v1.1'
  type: 'incremental_improvement'
  scope: 'update'
  status: 'ready'
  priority: 'high'
  version: '1.1'

description: |
  Incremental improvements with bug fixes, refinements, and enhancements
  based on user feedback from v1.0 launch.

changes:
  bug_fixes:
    - 'Fixed login button alignment on iPad'
    - 'Added loading spinner to all async actions'
    - 'Fixed family invite code validation'

  enhancements:
    - "Added 'Remember me' checkbox on login"
    - 'Improved error messages (clearer wording)'
    - 'Better empty state for task list'

  design_system_updates:
    - 'Button component: Added loading state'
    - 'Input component: Improved error styling'

affected_scenarios:
  - id: '02-login'
    path: 'C-Scenarios/02-login/'
    changes: "Added 'Remember me' checkbox, fixed alignment"

  - id: '06-task-list'
    path: 'C-Scenarios/06-task-list/'
    changes: 'Improved empty state design'

user_value:
  problem: 'Users experiencing bugs and requesting improvements'
  solution: 'Bug fixes and enhancements based on feedback'
  success_criteria:
    - 'Bug reports decrease by 50%'
    - 'User satisfaction score increases'
    - 'Onboarding completion rate improves'

estimated_complexity:
  size: 'small'
  effort: '1 week'
  risk: 'low'
  dependencies: []
```

---

### Step 5: Hand Off to BMad

**Same process as Phase 6:**

1. Create Design Delivery (DD-XXX.yaml)
2. Create Test Scenario (TS-XXX.yaml)
3. Handoff Dialog with BMad Architect
4. BMad implements changes
5. Designer validates (Phase 7)
6. Sign off and deploy

**BMad receives:**

- Design Delivery (DD-XXX)
- Updated specifications
- Design system changes
- Test scenario

---

### Step 6: Deploy Changes

**After validation:**

```
✅ Design Delivery DD-011 (v1.1) approved
✅ All tests passed
✅ Ready to deploy

Deployment:
- Version: v1.1.0
- Changes: 8 (3 bug fixes, 5 enhancements)
- Release notes: Generated from delivery
- Deploy to: Production
```

**Release notes (auto-generated from delivery):**

```markdown
# Version 1.1 Release

## What's New

### Bug Fixes

- Fixed login button alignment on iPad
- Added loading spinner to all async actions
- Fixed family invite code validation

### Enhancements

- Added "Remember me" checkbox on login
- Improved error messages for clarity
- Better empty state when no tasks

### Design System Updates

- Button component now supports loading state
- Input component has improved error styling
```

---

### Step 7: Monitor & Repeat

**After deployment:**

- Monitor user feedback
- Track analytics
- Identify new issues
- Plan next update

**Continuous cycle:**

```
v1.0 Launch
    ↓
Gather feedback (2 weeks)
    ↓
v1.1 Release (bug fixes + enhancements) - DD-011
    ↓
Gather feedback (4 weeks)
    ↓
v1.2 Release (new features) - DD-012
    ↓
Gather feedback (8 weeks)
    ↓
v2.0 Major Update (significant changes) - DD-020
    ↓
(Repeat)
```

---

## Types of Updates

### **Patch Updates (v1.0.1)**

**Frequency:** As needed (urgent bugs)
**Scope:** Critical bug fixes only
**Timeline:** 1-3 days

**Example:**

- Critical: Login broken on iOS 17.2
- Fix: Update authentication flow
- Deploy: Emergency patch

---

### **Minor Updates (v1.1.0)**

**Frequency:** Monthly or bi-weekly
**Scope:** Bug fixes + small enhancements
**Timeline:** 1-2 weeks

**Example:**

- 3 bug fixes
- 5 small enhancements
- 2 design system updates
- Deploy: Scheduled release

---

### **Major Updates (v2.0.0)**

**Frequency:** Quarterly or annually
**Scope:** New features + significant changes
**Timeline:** 4-8 weeks

**Example:**

- New feature: Calendar view
- New feature: Family chat
- Redesign: Navigation system
- Major: Design system overhaul
- Deploy: Major version release

---

## Ongoing Collaboration

### **Designer & Developer Partnership**

**Designer:**

- Monitors user feedback
- Identifies improvements
- Designs changes
- Creates deliveries
- Validates implementation

**Developer:**

- Implements changes
- Suggests technical improvements
- Provides feasibility feedback
- Requests design clarification
- Notifies when ready for testing

**Together:**

- Regular sync meetings
- Shared backlog
- Collaborative prioritization
- Continuous improvement
- Mutual respect and trust

---

## The Sunset Ride 🌅

**After establishing the ongoing cycle:**

```
Designer: "We've launched v1.0, iterated through v1.1 and v1.2,
           and now v2.0 is live. The product is mature, the
           process is smooth, and users are happy.

           The design-to-development workflow is humming along
           beautifully. We're a well-oiled machine!"

Developer: "Agreed! We've found our rhythm. Design Deliveries
            come in, we implement them, you validate, we ship.
            The 3 touch points work perfectly.

            Users love the product, stakeholders are happy,
            and we're continuously improving."

Designer: "Ready to ride into the sunset?"

Developer: "Let's go! 🌅"

[Designer and Developer ride off into the sunset together]

THE END! 🎬
```

---

## Success Metrics

### **Process Health**

**Velocity:**

- Time from design to deployment
- Number of updates per quarter
- Backlog size and age

**Quality:**

- Bug reports per release
- User satisfaction scores
- Design system compliance

**Collaboration:**

- Handoff smoothness
- Communication clarity
- Issue resolution time

---

### **Product Health**

**Usage:**

- Active users
- Feature adoption
- Retention rates

**Satisfaction:**

- User reviews
- NPS scores
- Support tickets

**Business:**

- Revenue growth
- Market share
- Strategic goals met

---

## Tips for Long-Term Success

### DO ✅

**Maintain momentum:**

- Regular releases (don't go dark)
- Continuous improvement
- Respond to feedback
- Celebrate wins

**Keep quality high:**

- Don't skip validation
- Maintain design system
- Test thoroughly
- Document changes

**Communicate well:**

- Regular designer-developer sync
- Clear priorities
- Transparent roadmap
- Stakeholder updates

**Stay user-focused:**

- Listen to feedback
- Measure impact
- Iterate based on data
- Solve real problems

### DON'T ❌

**Don't let backlog grow:**

- Prioritize ruthlessly
- Say no to low-value requests
- Keep backlog manageable
- Archive old items

**Don't skip process:**

- Always create deliveries
- Always validate
- Always document
- Always follow touch points

**Don't lose sight:**

- Remember user value
- Stay aligned with goals
- Don't chase shiny objects
- Focus on what matters

**Don't burn out:**

- Sustainable pace
- Realistic timelines
- Celebrate progress
- Take breaks

---

## The Long Game

**Year 1:**

- Launch v1.0 (MVP)
- Iterate rapidly (v1.1, v1.2, v1.3)
- Learn from users
- Establish process

**Year 2:**

- Major update v2.0
- Mature product
- Smooth process
- Happy users

**Year 3+:**

- Continuous evolution
- Market leadership
- Sustainable growth
- Designer & Developer harmony

---

## Resources

**Ongoing Development:**

- Return to Phase 4-5 for changes
- Use Phase 6 for Design Deliveries (small scope)
- Use Phase 7 for validation
- Repeat indefinitely

**Templates:**

- Same templates as initial development
- Add "system_update" type to deliveries
- Track version numbers

**Documentation:**

- Maintain changelog
- Update release notes
- Keep design system current
- Document learnings

---

**And they lived happily ever after, shipping great products together!** 🌅✨

**THE END!** 🎬
