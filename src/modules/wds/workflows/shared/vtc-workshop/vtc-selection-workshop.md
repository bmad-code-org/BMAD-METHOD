# Value Trigger Chain Selection Workshop

**Purpose:** Extract a VTC from existing Trigger Map

**Duration:** 10-15 minutes

**When to use:** Trigger Map exists, want to leverage existing strategic research

---

## Workshop Overview

We'll select VTC elements from your Trigger Map:

1. **Load Trigger Map** - Access existing strategic work (1 min)
2. **Select Business Goal** - Which goal for this VTC? (2 mins)
3. **Select User** - Which target group? (2 mins)
4. **Select Driving Forces** - Which 2-5 forces matter here? (5 mins)
5. **Define Solution** - What are we building? (2 mins)
6. **Position Customer Awareness** - Where do they start/end? (3 mins)
7. **Refine (Optional)** - Add/adjust anything? (5 mins)

**Advantage:** Leveraging research already done, maintaining consistency

---

## Step 1: Load Trigger Map (1 minute)

**Ask:**
> "What's the path to your Trigger Map document?"

**Expected locations:**
- `docs/B-Trigger-Map/trigger-map.md`
- `docs/B-Trigger-Map/trigger-map.yaml`

**Load and confirm:**
```
Found Trigger Map with:
- [X] business goals
- [X] target groups/users
- [X] driving forces per user

Ready to extract your VTC!
```

---

## Step 2: Select Business Goal (2 minutes)

**Show available goals from Trigger Map:**

> "Your Trigger Map has these business goals:
> 
> 1. [Goal 1 with priority/score]
> 2. [Goal 2 with priority/score]
> 3. [Goal 3 with priority/score]
> 
> Which goal does this [solution/scenario] primarily serve?"

**User selects:** One primary goal

**Can mention secondary:**
> "Does this also support another goal?"

If yes, capture but keep one primary.

**Capture:**
```yaml
business_goal:
  primary: "[Selected goal]"
  secondary: "[Optional secondary goal]"  # If applicable
```

**Validation:**
- Is this the RIGHT goal for this solution/scenario?
- Does focusing on this goal make sense?

---

## Step 3: Select User/Target Group (2 minutes)

**Show available users from Trigger Map:**

> "For [selected goal], your Trigger Map has these target groups:
> 
> 1. [User 1 - brief description]
>    Priority: [score]
>    Key driving forces: [top 2-3]
> 
> 2. [User 2 - brief description]
>    Priority: [score]
>    Key driving forces: [top 2-3]
> 
> Which user is primary for this [solution/scenario]?"

**User selects:** One primary user

**Capture:**
```yaml
user:
  name: "[Selected user name]"
  description: "[From Trigger Map]"
  context: "[Usage context from Trigger Map]"
  priority: "[Priority score from map]"
```

**If user wants multiple:**
> "We can create additional VTCs for other users. For THIS VTC, let's focus on one primary user to keep it powerful."

---

## Step 4: Select Driving Forces (5 minutes)

**This is the key step.** The Trigger Map likely has many driving forces. We need to select the most relevant ones for THIS specific solution/scenario.

### 4A: Show Available Driving Forces

**Display driving forces for selected user:**

> "For [selected user], your Trigger Map shows:
> 
> **Positive Driving Forces (Wishes):**
> 1. [Force 1] - Priority: [score]
> 2. [Force 2] - Priority: [score]
> 3. [Force 3] - Priority: [score]
> 
> **Negative Driving Forces (Fears/Avoid):**
> 1. [Force 1] - Priority: [score]
> 2. [Force 2] - Priority: [score]
> 3. [Force 3] - Priority: [score]"

### 4B: Select Relevant Forces

**Ask:**
> "Which of these driving forces does [this solution/scenario] directly address?
> 
> Pick 2-5 total (mix of positive and negative) that are most relevant here."

**Guidelines for selection:**
- Don't include ALL forces (lose focus)
- Pick ones THIS solution actually addresses
- Balance positive and negative (both matter)
- Higher priority forces are good candidates

**Example reasoning:**
```
Scenario: Newsletter signup landing page
Selected Forces:
✅ "Wish to be local beauty authority" (landing page promises this)
✅ "Fear of missing industry trends" (landing page prevents this)
❌ "Wish to save time on bookkeeping" (not relevant to newsletter)
```

**Capture:**
```yaml
driving_forces:
  positive:
    - "[Selected wish 1]"
    - "[Selected wish 2]"
  negative:
    - "[Selected fear 1]"
    - "[Selected fear 2]"
```

### 4C: Validate Selection

**Ask:**
- Does this selection focus on what THIS solution actually delivers?
- Too many? (Lose focus)
- Too few? (Not enough to inform design)
- Missing something critical?

---

## Step 5: Define Solution (2 minutes)

**This is NOT in the Trigger Map** (we specifically keep solutions out of the map).

**Ask:**
> "What solution are you building to serve this VTC?"

**Examples:**
- "Landing page with newsletter signup"
- "Onboarding flow for new users"
- "User profile settings page"
- "Checkout flow optimization"

**Capture:**
```yaml
solution: "[Specific solution being built]"
```

**This is the bridge:** Business goal → Solution → User + Driving Forces

---

## Step 6: Position Customer Awareness (3 minutes)

**Customer Awareness is typically NOT in Trigger Map** (you can add it, but often it's defined per scenario).

### 6A: Explain Context

> "Customer Awareness shows where the user starts and where we want to move them:
> 
> - Unaware → Problem Aware → Solution Aware → Product Aware → Most Aware
> 
> For [selected user] encountering [solution], where are they NOW?"

### 6B: Identify Starting Point

**Help them choose based on context:**

**For landing page visitors:**
- Usually: Problem Aware or Solution Aware
- They know problem, maybe know solutions exist

**For existing users (new feature):**
- Usually: Product Aware (know your product)
- Unaware of THIS specific feature

**For onboarding:**
- Usually: Product Aware → Most Aware
- Just signed up, need to activate

**Capture:**
```yaml
customer_awareness:
  start: "[Current stage]"
```

### 6C: Define Target End Point

**Ask:**
> "Where do you want this [solution] to move them?"

**Guidelines:**
- Usually move 1-2 stages
- Consider what's realistic
- Must support business goal

**Capture:**
```yaml
customer_awareness:
  start: "[Start stage]"
  end: "[Target stage]"
```

**Example:**
```yaml
customer_awareness:
  start: "Solution Aware"  # Know design tools exist
  end: "Product Aware"     # Know WDS specifically exists
```

---

## Step 7: Review Complete VTC

**Read back the extracted VTC:**

```yaml
vtc:
  business_goal:
    primary: "[From Trigger Map]"
  solution: "[Newly defined]"
  user:
    name: "[From Trigger Map]"
    description: "[From Trigger Map]"
    context: "[From Trigger Map]"
  driving_forces:
    positive: "[Selected from Trigger Map]"
    negative: "[Selected from Trigger Map]"
  customer_awareness:
    start: "[Newly defined]"
    end: "[Newly defined]"
  
  source:
    trigger_map: "[Path to Trigger Map]"
    extracted: "[Date]"
```

**Validation:**

1. **Consistency:** Does this align with Trigger Map priorities?
2. **Focus:** Is this focused enough to guide design?
3. **Completeness:** Does it have all five elements?
4. **Actionable:** Can designers make decisions from this?

---

## Step 8: Optional Refinement (5 minutes)

**Ask:**
> "Looking at this VTC, do we need to refine anything from the Trigger Map?
> 
> - Add a driving force not currently in the map?
> - Reword something for clarity?
> - Adjust priorities based on new insights?"

### Options:

**A) VTC is perfect as-is**
→ Save and proceed

**B) Minor wording adjustments**
→ Make changes to VTC (not Trigger Map)
→ Note: "VTC variation of Trigger Map"

**C) Discovered something important**
→ Note it: "Consider adding to Trigger Map: [insight]"
→ Can update Trigger Map later
→ Use refined version in VTC

**D) Major gaps in Trigger Map**
→ Might need Trigger Map workshop to add:
  - New user type
  - New driving forces
  - Missing business goal

**Capture refinements:**
```yaml
refinements:
  - type: "[added/modified/clarified]"
    element: "[what was changed]"
    reason: "[why]"
    
notes: |
  Extracted from Trigger Map: [date]
  Refinements made: [summary]
  Consider updating Trigger Map with: [insights]
```

---

## Step 9: Document and Save

**Create VTC file:**

File location depends on use case:
- **Product Pitch:** `docs/A-Product-Brief/vtc-primary.yaml`
- **Scenario:** `docs/D-UX-Design/[scenario-name]/vtc.yaml`

**Use template:** [vtc-template.yaml](./vtc-template.yaml)

**Important metadata:**
```yaml
metadata:
  source: "trigger_map"
  trigger_map_path: "[path to map]"
  extracted_date: "[date]"
  business_goal_priority: "[from map]"
  user_priority: "[from map]"
  
notes: |
  Extracted from Trigger Map for [purpose]
  
  Selection rationale:
  - Chose [goal] because [reason]
  - Chose [user] because [reason]
  - Selected these driving forces because [reason]
  
  Refinements from original map:
  - [Any adjustments made]
```

---

## Step 10: Maintain Consistency

**Explain relationship to Trigger Map:**

> "This VTC is extracted from your Trigger Map, which means:
> 
> ✅ **Consistency:** This VTC aligns with your strategic research
> ✅ **Traceability:** We know why these elements were chosen
> ✅ **Evolution:** If Trigger Map updates, we can update this VTC
> 
> The Trigger Map is your strategic foundation. This VTC is a focused slice for [specific purpose]."

**Best practices:**
- Keep VTC linked to source Trigger Map (metadata)
- If Trigger Map evolves significantly, review VTCs
- If VTC reveals gaps, update Trigger Map
- Multiple scenarios = multiple VTCs from same map

---

## Common Scenarios

### Scenario 1: Product Pitch (Simple)

**Context:** Need one primary VTC for pitch deck

**Selection:**
- Primary business goal (highest priority)
- Most important user (highest priority)
- Top 2-3 driving forces for that user
- Simple solution statement

**Duration:** 10 minutes

**Result:** Clear, focused VTC for stakeholder communication

---

### Scenario 2: Multiple Scenarios (Complex)

**Context:** Designing 5 different scenarios, each needs VTC

**Approach:**
- Run selection workshop for each scenario
- VTCs may share business goal but have:
  - Different users
  - Different driving force selections
  - Different solutions
  - Different awareness progressions

**Example:**
```
VTC-01: Login Flow
- Goal: User activation
- User: Sarah (new user)
- Forces: Want ease, fear complexity
- Awareness: Product Aware → Most Aware

VTC-02: Dashboard
- Goal: User activation  
- User: Sarah (returning user)
- Forces: Want insights, fear wasting time
- Awareness: Most Aware (maintain)

VTC-03: Settings
- Goal: User retention
- User: Sarah (power user)
- Forces: Want control, fear losing data
- Awareness: Most Aware (maintain)
```

---

### Scenario 3: Discovered Gap in Trigger Map

**Problem:** While selecting, realize Trigger Map is missing something important

**Solutions:**

**Option A - Quick Add:**
If minor:
1. Add to VTC
2. Note: "Added to VTC, consider for Trigger Map"
3. Update Trigger Map later

**Option B - Pause and Update Map:**
If significant:
1. Pause VTC workshop
2. Run mini Trigger Map update
3. Return to VTC selection with updated map

**Option C - Work Around:**
If edge case:
1. Note gap in VTC notes
2. Proceed with available information
3. Flag for future Trigger Map revision

---

## Agent Tips

### Selecting vs. Creating

**Key difference from Creation Workshop:**
- Don't imagine - SELECT from map
- Maintain consistency with priorities
- Don't include everything (focus!)

### Help User Focus

If user wants to include too many driving forces:
> "The Trigger Map captures everything. This VTC needs to focus on what [THIS solution] specifically addresses. If we include everything, we lose strategic focus."

### Validate Against Map

Check selected elements against map priorities:
- Selected low-priority items? Ask why
- Skipped high-priority items? Understand reasoning
- Document selection rationale

### When to Update Map vs. VTC

**Update VTC only:**
- Minor wording adjustments
- Solution-specific refinements
- Awareness positioning

**Consider updating Trigger Map:**
- New driving force discovered
- Priority shifts observed
- New user insight emerged
- Missing business goal identified

---

## Troubleshooting

**Problem:** User wants all driving forces in VTC

**Solution:**
> "The Trigger Map has them all. This VTC focuses on the subset THIS solution addresses. We can create additional VTCs for other aspects."

**Problem:** Selected forces don't match solution

**Solution:**
> "Let's check: Does [solution] actually help user [driving force]? If not, that force shouldn't be in this VTC."

**Problem:** Trigger Map has no priorities

**Solution:**
- Use the workshop to assess priorities
- Note: "Priorities defined during VTC selection"
- Consider running full priority workshop for Trigger Map

**Problem:** Multiple business goals equally important

**Solution:**
- Choose one primary for this VTC
- Note secondary goals
- Can create additional VTCs if needed

---

## Benefits of Selection Workshop

**vs. Creation Workshop:**

✅ **Faster:** 10-15 mins vs 30 mins  
✅ **Consistent:** Aligned with strategic research  
✅ **Prioritized:** Leverages existing priority scores  
✅ **Traceable:** Clear connection to source map  
✅ **Scalable:** Easy to create multiple VTCs

**Trade-off:**
- Requires Trigger Map to exist first
- Bounded by what's in the map
- Can't explore beyond map scope

---

## Related Resources

- [Value Trigger Chain Guide](../../../docs/method/value-trigger-chain-guide.md) - Full VTC methodology
- [Trigger Mapping Guide](../../../docs/method/phase-2-trigger-mapping-guide.md) - Creating the source map
- [VTC Creation Workshop](./vtc-creation-workshop.md) - Alternative when no map exists

---

*VTC Selection Workshop - Strategic focus from strategic foundation*

