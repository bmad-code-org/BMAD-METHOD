# Sketching Guide for WDS

**How to sketch interfaces effectively with Excalidraw**

---

## When to Sketch

### **During Phase 4: UX Design**

**Step 4B: Sketch Interface**

- After scenario initialization
- Before detailed specifications
- When exploring layout options
- When discussing with AI

**Typical timing:**

```
Scenario Init → Sketch → AI Discussion → Refine → Specify
```

---

## What to Sketch

### **1. Page Layouts (Wireframes)**

**Purpose:** Show overall page structure

**Include:**

- Device frame (mobile/tablet/desktop)
- Major sections (header, content, footer)
- Component placement
- Visual hierarchy
- Spacing and alignment

**Example:**

```
[Mobile Frame 375x812]
┌─────────────────┐
│  [Logo] [Menu]  │ ← Header
├─────────────────┤
│                 │
│  [Task List]    │ ← Main Content
│  ┌───────────┐  │
│  │ Task 1    │  │
│  ├───────────┤  │
│  │ Task 2    │  │
│  └───────────┘  │
│                 │
│  [+ Add Task]   │ ← Action
│                 │
├─────────────────┤
│  [Navigation]   │ ← Footer
└─────────────────┘
```

### **2. Component Variations**

**Purpose:** Explore different design options

**Include:**

- 2-3 layout alternatives
- Different component arrangements
- Hierarchy variations
- Spacing options

**Example:**

```
Option A: Card-based
Option B: List-based
Option C: Calendar-focused
```

### **3. User Flows**

**Purpose:** Show navigation and state transitions

**Include:**

- Start and end points
- Decision points
- Actions and outcomes
- Error paths
- Success paths

**Example:**

```
[Start] → [Login] → [Dashboard]
              ↓
         [Error?] → [Show Error] → [Retry]
```

### **4. State Variations**

**Purpose:** Show component in different states

**Include:**

- Default state
- Hover state
- Active/focused state
- Disabled state
- Error state
- Loading state
- Success state

**Example:**

```
Button States:
[Default] [Hover] [Active] [Disabled] [Loading]
```

### **5. Responsive Layouts**

**Purpose:** Show design across breakpoints

**Include:**

- Mobile (375px)
- Tablet (768px)
- Desktop (1440px)
- Key differences
- Adaptive elements

---

## How to Sketch

### **Step 1: Choose Device Frame (2 min)**

**From library or create:**

```
Mobile:   375 × 812 (iPhone)
Tablet:   768 × 1024 (iPad)
Desktop:  1440 × 900 (Laptop)
```

**Draw rectangle:**

- Use Rectangle tool (R)
- Set dimensions
- Label device type
- Lock in place (optional)

### **Step 2: Add Major Sections (5 min)**

**Divide into regions:**

```
Header:   Top 60-80px
Content:  Middle (flexible)
Footer:   Bottom 60-80px
```

**Use rectangles:**

- Light fill color
- Label each section
- Snap to 20px grid
- Leave spacing between

### **Step 3: Add Components (10 min)**

**From library or draw:**

- Buttons
- Input fields
- Cards
- Navigation
- Images (use rectangles with X)
- Text blocks

**Placement:**

- Follow grid (20px)
- Consistent spacing
- Visual hierarchy
- Alignment

### **Step 4: Add Labels (5 min)**

**Label everything:**

- Component names
- Interactive elements
- Content areas
- Actions

**Use text tool (T):**

- Clear, concise labels
- Inside or beside components
- Consistent font size
- Dark text on light background

### **Step 5: Add Annotations (5 min)**

**Document decisions:**

- Why this layout?
- Key interactions
- Important notes
- Questions/concerns

**Use:**

- Text boxes
- Arrows pointing to elements
- Different color for notes
- Keep brief

### **Step 6: Review and Refine (5 min)**

**Check:**

- ✓ All elements aligned to grid
- ✓ Consistent spacing
- ✓ Clear labels
- ✓ Annotations present
- ✓ Visual hierarchy clear
- ✓ Nothing missing

---

## Sketching Patterns

### **Pattern 1: Top-Down**

**Start with structure, add details:**

```
1. Device frame
2. Major sections
3. Component blocks
4. Labels
5. Details
6. Annotations
```

**Best for:** New pages, complex layouts

### **Pattern 2: Component-First**

**Start with key component, build around:**

```
1. Main component (e.g., task list)
2. Supporting components
3. Navigation
4. Context
5. Frame
```

**Best for:** Component-focused pages

### **Pattern 3: Flow-Based**

**Follow user journey:**

```
1. Entry point
2. First action
3. Next step
4. Decision points
5. Outcomes
```

**Best for:** User flows, multi-step processes

---

## Grid and Spacing

### **20px Grid System**

**Everything snaps to 20px:**

```
Position: 0, 20, 40, 60, 80, 100...
Size:     80, 100, 120, 140, 160...
Spacing:  20, 40, 60, 80...
```

### **Common Spacing**

**Tight:** 20px

- Between related items
- Inside cards
- Form field spacing

**Medium:** 40px

- Between sections
- Card margins
- Component groups

**Loose:** 60-80px

- Major sections
- Page margins
- Visual breaks

### **Component Sizes**

**Buttons:**

- Small: 80 × 32
- Medium: 120 × 40
- Large: 160 × 48

**Input Fields:**

- Width: 280-320 (mobile), 400+ (desktop)
- Height: 40-48

**Cards:**

- Width: 320 (mobile), 400+ (desktop)
- Height: Variable (content-based)

---

## Visual Hierarchy

### **Size**

**Larger = More important:**

```
Heading:  24-32px
Body:     16-18px
Caption:  12-14px
```

### **Weight**

**Bolder = More important:**

```
Primary:   Bold/Semibold
Secondary: Regular
Tertiary:  Light
```

### **Position**

**Top/Left = More important:**

```
Most important:    Top-left
Secondary:         Center
Least important:   Bottom-right
```

### **Color/Contrast**

**Higher contrast = More important:**

```
Primary:   Dark on light (high contrast)
Secondary: Medium gray
Tertiary:  Light gray
```

---

## Common Mistakes

### **❌ DON'T:**

**1. Skip the grid**

```
❌ Random positioning
✅ Snap to 20px grid
```

**2. Inconsistent spacing**

```
❌ 15px, 23px, 18px...
✅ 20px, 40px, 60px...
```

**3. Unlabeled elements**

```
❌ [Rectangle]
✅ [Login Button]
```

**4. Too much detail**

```
❌ Pixel-perfect designs
✅ Rough wireframes
```

**5. No annotations**

```
❌ Just shapes
✅ Shapes + notes about why
```

**6. Forget device context**

```
❌ Generic layout
✅ Mobile/tablet/desktop frame
```

---

## File Organization

### **Naming**

**Pattern:** `[page-name].excalidraw`

**Examples:**

```
dashboard.excalidraw
login-page.excalidraw
task-list.excalidraw
user-flow.excalidraw
button-states.excalidraw
```

### **Location**

**Always in sketches folder:**

```
C-Scenarios/[scenario-name]/sketches/
```

**Example:**

```
C-Scenarios/morning-dog-care/
├── sketches/
│   ├── dashboard.excalidraw
│   ├── dashboard.png
│   ├── task-detail.excalidraw
│   └── task-detail.png
└── Frontend/
    └── specifications.md
```

### **Versions**

**Iterations:**

```
dashboard-v1.excalidraw
dashboard-v2.excalidraw
dashboard-final.excalidraw
```

**Or use git:**

```
dashboard.excalidraw (always latest)
Git history shows versions
```

---

## Working with AI

### **AI Can Generate Sketches**

**Request:**

```
"Create 3 dashboard layout options in Excalidraw"
```

**AI creates:**

```
dashboard-cards.excalidraw
dashboard-list.excalidraw
dashboard-calendar.excalidraw
```

**You:**

- Open each option
- Compare and choose
- Refine the winner

### **AI Can Analyze Your Sketches**

**Process:**

```
1. Export sketch to PNG
2. Upload to AI
3. Discuss design
4. Get suggestions
5. Iterate
```

**Example:**

```
You: [Upload dashboard.png]
     "What do you think?"

AI: "I see you've prioritized today's tasks at top.
     Let's discuss the spacing between cards..."
```

### **AI Can Iterate**

**Feedback loop:**

```
You: "Make the cards bigger with more breathing room"
AI:  [Generates dashboard-v2.excalidraw]
You: [Reviews] "Better! Now add a calendar view option"
AI:  [Generates dashboard-calendar.excalidraw]
```

---

## Tips for Success

### **DO ✅**

**Start rough:**

- Quick shapes
- Basic layout
- Refine later

**Use the grid:**

- Snap everything
- Consistent spacing
- Professional look

**Label clearly:**

- Name all components
- Describe interactions
- Note important details

**Annotate decisions:**

- Why this layout?
- What alternatives considered?
- What questions remain?

**Keep it simple:**

- Wireframes, not mockups
- Structure, not style
- Concepts, not pixels

### **DON'T ❌**

**Don't over-design:**

- Not pixel-perfect
- Not final styling
- Not production-ready

**Don't skip context:**

- Always use device frame
- Show realistic content
- Include navigation

**Don't forget states:**

- Show hover/active
- Show error states
- Show loading states

**Don't work in isolation:**

- Share with AI
- Get feedback
- Iterate together

---

## Examples

### **Example 1: Login Page**

```
[Mobile Frame 375×812]
┌─────────────────┐
│                 │
│   [Logo]        │ ← 60px from top
│                 │
│   Welcome Back  │ ← Heading
│                 │
│   [Email]       │ ← Input (280×40)
│                 │
│   [Password]    │ ← Input (280×40)
│                 │
│   □ Remember me │ ← Checkbox
│                 │
│   [Sign In]     │ ← Button (280×48)
│                 │
│   Forgot pwd?   │ ← Link
│                 │
│   ─── or ───    │ ← Divider
│                 │
│   [Google]      │ ← Social button
│   [Apple]       │ ← Social button
│                 │
└─────────────────┘

Annotations:
- Logo: 120px height, centered
- Inputs: 20px spacing between
- Button: Primary action, full width
- Social: Secondary, outlined style
```

### **Example 2: Dashboard**

```
[Mobile Frame 375×812]
┌─────────────────┐
│ [☰] Dog Week [+]│ ← Header (60px)
├─────────────────┤
│ Today's Tasks   │ ← Section title
│ Monday, Dec 9   │
│                 │
│ ┌─────────────┐ │
│ │ Walk Max    │ │ ← Task card
│ │ 8:00 AM     │ │   (335×80)
│ │ [✓] Sarah   │ │
│ └─────────────┘ │
│                 │ ← 20px spacing
│ ┌─────────────┐ │
│ │ Feed Max    │ │ ← Task card
│ │ 12:00 PM    │ │
│ │ [ ] John    │ │
│ └─────────────┘ │
│                 │
│ [+ Add Task]    │ ← Action button
│                 │
├─────────────────┤
│ [Home][Tasks]   │ ← Navigation (60px)
└─────────────────┘

Annotations:
- Header: Hamburger menu, title, add button
- Tasks: Card-based, show time, assignee, status
- Cards: 20px margin, 20px spacing between
- Navigation: Bottom tabs, 2 main sections
```

---

## Next Steps

**After sketching:**

1. ✅ Export to PNG
2. ✅ Upload to AI for discussion
3. ✅ Iterate based on feedback
4. ✅ Finalize layout
5. ✅ Create specifications

**Learn more:**

- [AI Collaboration](ai-collaboration.md) - Work with AI
- [Export Workflow](export-workflow.md) - Share your work

---

**Sketching is thinking made visible - keep it rough, iterate fast, and let AI help!** 🎨✨
