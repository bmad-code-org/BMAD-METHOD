# Prototype Initiation Dialog

**Agent**: Freya WDS Designer Agent  
**Purpose**: Interactive conversation to gather all requirements before creating a prototype  
**Output**: Complete Work File (YAML) ready for section-by-section implementation

---

## 🎯 Conversation Flow

### **Opening**

> "I'll create an interactive prototype for this page. Before we start coding, let's plan it out together through a few quick questions. This ensures we build exactly what you need!"
>
> **Let's start!** 🚀

---

## 📝 **Question 1: Page Context**

> "**Which page are we building?**
>
> Please provide:
> - Page number and name (e.g., "3.1 Dog Calendar Booking")
> - Link to the specification (if available)
> - Scenario name"

**Wait for response**

**Record**:
- `metadata.page_number`
- `metadata.page_name`
- `metadata.scenario`

---

## 📱 **Question 2: Device Compatibility**

> "**Which devices will users primarily use this page on?**
>
> Choose one:
>
> 1. 📱 **Mobile-Only** (375px-428px)
>    - For: Personal apps, on-the-go tools
>    - Testing: iPhone SE, iPhone 14 Pro, iPhone 14 Pro Max
>    - No breakpoints, touch-optimized only
>    - Hover: None
>
> 2. 📱💻 **Mobile + Tablet** (375px-1024px)
>    - For: Content apps, casual use
>    - Testing: Mobile + iPad
>    - Breakpoint at 768px
>    - Hover: Tablet only
>
> 3. 🌐 **Fully Responsive** (375px-1920px+)
>    - For: Business apps, multi-device use
>    - Testing: Mobile + Tablet + Desktop
>    - Multiple breakpoints (768px, 1024px, 1280px)
>    - Hover: Tablet & Desktop
>
> 4. 🖥️ **Desktop-Only** (1280px+)
>    - For: Complex data entry, professional tools
>    - Testing: Desktop only
>    - Breakpoint: None (fixed large)
>    - Hover: Always
>
> **Which option?** (1-4)"

**Wait for response**

**Record**:
- `metadata.device_compatibility.type`
- `metadata.device_compatibility.test_viewports`
- `metadata.device_compatibility.touch_optimized`
- `metadata.device_compatibility.hover_interactions`

**If Mobile-Only**, ask:
> "Perfect! **Which mobile devices should we test on?**
>
> Default is:
> - iPhone SE (375px × 667px) - Smallest common size
> - iPhone 14 Pro (393px × 852px) - Standard size
> - iPhone 14 Pro Max (428px × 926px) - Largest common size
>
> Use these defaults? (Y/N)"

---

## 🎨 **Question 3: Design Fidelity**

> "**What level of design fidelity should we use?**
>
> Choose one:
>
> 1. **Generic Gray Model** (Wireframe)
>    - Grayscale placeholder design
>    - Generic Tailwind defaults (grays, blues)
>    - Focus on functionality first, style later
>    - Fastest to build
>
> 2. **Design System Components**
>    - Uses your documented Design System
>    - Branded colors, typography, spacing
>    - Consistent with your design tokens
>    - Production-ready look and feel
>
> 3. **Full Design / Figma MCP Integration**
>    - Import directly from Figma designs
>    - Pixel-perfect implementation
>    - All visual details, shadows, gradients
>    - Highest fidelity
>
> **Which option?** (1, 2, or 3)"

**Wait for response**

**If option 2 or 3**, ask:
> "Great! Where is your Design System located? (I'll look for it in `docs/D-Design-System/` or you can specify)"

**Record**:
- `metadata.design_fidelity`
- `design_tokens` (colors, typography, spacing from Design System)

---

## 🌍 **Question 4: Languages**

**Check project brief/outline first**:
- If project defines multiple languages → Ask this question
- If project is single language → Skip this question

> "**I see your project supports [Languages from project brief].**
>
> **Should this prototype include language switching?** (Y/N)
>
> If **YES**:
> - Which languages? (e.g., Swedish, English)
> - How to switch? (Toggle button, dropdown, flag icons)
>
> If **NO**:
> - Which language to use? (Default to primary language from project)"

**Wait for response**

**Record**:
- `languages` (array: ["sv", "en"] or single: ["en"])
- `language_switcher` (boolean)
- `primary_language` (default language)

**Implementation Note**:
- Prototypes use **hardcoded translations** directly in HTML/JS
- No separate translation files (easier to read, no secrets)
- Simple language switcher if multi-language

**Example**:
```javascript
const strings = {
  sv: { bookWalk: 'Boka promenad', cancel: 'Avbryt' },
  en: { bookWalk: 'Book walk', cancel: 'Cancel' }
};
```

---

## 📦 **Question 5: Required Components**

> "**Let me identify the components needed based on your specification...**
>
> [Agent reads specification and extracts Component Dependencies section]
>
> **This page requires:**
>
> **Organism Components**:
> - [List with Object IDs from spec]
>
> **Molecular Components**:
> - [List with Object IDs from spec]
>
> **Atomic Components**:
> - [List from Design System]
>
> **Special Features**:
> - [Real-time features, persistence, etc.]
>
> **All components and Object IDs from the specification will be included.**
>
> **Does this match your expectations?** (Y/N)"

**Wait for response**

**If N**, ask:
> "What would you like to add or change?"

**Record**:
- `metadata.dependencies`
- `object_ids` (all Object IDs from spec)
- `design_tokens.components_available`

---

## 🗂️ **Question 6: Demo Data**

> "**What demo data do we need for realistic testing?**
>
> Based on your user context, I'll suggest:
> - Current user (first name, last name, email)
> - [Other entities based on page type]
>
> **Any specific demo data requirements?** (or 'use defaults')"

**Wait for response**

**Record**:
- `demo_data_needed`

---

## 📄 **Initiation Complete - Summary**

> "Perfect! Here's what we have:
>
> **📱 Scenario**: [Scenario Name]  
> **📄 Pages**: [List pages in this scenario]  
> **📱 Devices**: [Device type] ([Viewport range])  
> **🎨 Design**: [Gray Model / Design System / Figma]  
> **👥 Demo Family**: [Family members + dogs]  
>
> **Files Created**:
> - ✅ `data/demo-data.json` (demo family data)
> - ✅ `PROTOTYPE-ROADMAP.md` (scenario overview)
>
> **Next: Build prototypes page by page!**
>
> **Which page should we start with?** ([Page number] or list to see all)"

**Wait for user to select first page**

---

## 🚀 **Per-Page Building Process**

**When user selects a page** (e.g., "3.1"):

> "**Building: 3.1 Dog Calendar Booking**
>
> Let me analyze the specification and break it into sections...
>
> [Agent reads spec, identifies all components and Object IDs]
>
> **Proposed sections**:
> 1. [Section name] (~X min)
> 2. [Section name] (~X min)
> 3. [Section name] (~X min)
> ...
>
> **Total**: [N] sections, ~[X] hours
>
> **Approve this breakdown?** (Y/N)"

**If Y**:
> "✅ Creating Work File: `work/3.1-Dog-Calendar-Work.yaml`
>
> [Creates complete work file with all sections]
>
> ✅ Work File created!
>
> **Ready to start Section 1?** (Y)"

**Then proceed to section-by-section building** (follow FREYA-WORKFLOW-INSTRUCTIONS.md Phase 2)

---

## 📝 **Notes for Freya**

**Scenario Initiation** creates:
- ✅ `[Scenario]-Prototype/` folder with complete structure:
  - `data/` folder with `demo-data.json`
  - `work/` folder (empty, for work files)
  - `stories/` folder (empty, for just-in-time stories)
  - `shared/` folder (empty, for shared JS)
  - `components/` folder (empty, for reusable components)
  - `pages/` folder (empty, for page-specific scripts)
  - `assets/` folder (empty, for images/icons)
- ✅ `PROTOTYPE-ROADMAP.md` (scenario overview)

**Per-Page Building** creates:
- ✅ `work/[Page]-Work.yaml` (page-specific work file)
- ✅ `stories/[Page]-[Section].md` (just-in-time story files)
- ✅ `[Page].html` (actual prototype, built section-by-section)

**Key Principles**:
1. **Scenario init** = High-level setup (device type, demo data)
2. **Per-page** = Detailed section breakdown and building
3. **One page at a time** = Prevents overwhelming scope
4. **Just-in-time stories** = Create story right before building that section

---

## 🎓 **Tips During Conversation**

**For Freya (implementation notes)**:

1. **Be conversational** - Not a survey, a dialogue
2. **Explain options** - Help user understand choices
3. **Suggest defaults** - Based on common patterns
4. **Adapt questions** - Skip irrelevant based on answers
5. **Show examples** - Make abstract concepts concrete
6. **Confirm understanding** - Reflect back what you heard
7. **Stay encouraging** - This is collaborative, not interrogation

---

## 🔄 **After Work File Creation**

**Agent automatically**:
1. Creates `work/[Page]-Work.yaml` with all gathered info
2. Creates `data/demo-data.json` (if doesn't exist)
3. Updates `PROTOTYPE-ROADMAP.md` with this page
4. Presents Section 1 story and asks to proceed

**Then enters**: Section-by-section build mode (separate workflow)

---

## 📋 **Example Complete Exchange**

### **Part 1: Scenario Initiation** (one-time setup)

**Freya**: "Let's set up prototypes for Scenario 3: Booking Dog Walks! Which devices?"
- 1. Mobile-Only
- 2. Mobile + Tablet
- 3. Fully Responsive
- 4. Desktop-Only

**User**: "1"

**Freya**: "Mobile-only! Use default test devices? (320-428px) (Y/N)"

**User**: "Y"

**Freya**: "Design fidelity?"
- 1. Generic Gray Model
- 2. Design System Components
- 3. Full Design / Figma MCP Integration

**User**: "2"

**Freya**: "Perfect! I'll use your Design System. I see your project supports Swedish and English. Should this prototype include language switching? (Y/N)"

**User**: "Y - Swedish primary, English secondary, toggle button"

**Freya**: "Got it! Demo data?"
- Need realistic test family? (Y/N)

**User**: "Y - Familjen Svensson with 4 members and Golden Retriever Rufus, no pre-booked walks"

**Freya**: "✅ Created complete prototype environment!
- ✅ `03-Booking-Dog-Walks-Prototype/` folder
- ✅ `data/demo-data.json` with demo family
- ✅ `PROTOTYPE-ROADMAP.md` with scenario overview
- ✅ All working folders ready

**Which page should we start with?**"

---

### **Part 2: Page Selection**

**Freya**: "Which page should we start with?"

**User**: "3.1 Dog Calendar Booking"

---

### **Part 3: Per-Page Section Breakdown**

**Freya**: "Building: 3.1 Dog Calendar Booking. Let me analyze the spec...

**Proposed sections**:
1. Page Structure & Header (~10 min)
2. Week Overview Component (~20 min)
3. Leaderboard Section (~15 min)
4. Booking Calendar - Day Columns (~15 min)
5. Walk Slot Cards - States & Booking (~30 min)
6. Real-Time Updates (~20 min)
7. Bottom Tab Navigation (~10 min)
8. Dev Mode Integration (~5 min)

**Total**: 8 sections, ~2 hours

**Approve this breakdown?** (Y/N)"

**User**: "Y"

**Freya**: "✅ Creating Work File: `work/3.1-Dog-Calendar-Work.yaml`

✅ Work File created!

**Ready to start Section 1?** (Y)"

**User**: "Y"

**Freya**: "🚀 Starting Section 1: Page Structure & Header..."

---

**Scenario initiation: 3-4 questions, 2-3 minutes**  
**Per-page building: Section approval, then build!** 🎯

