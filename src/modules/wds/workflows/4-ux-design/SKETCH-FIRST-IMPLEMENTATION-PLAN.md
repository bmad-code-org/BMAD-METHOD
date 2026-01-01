# Sketch-First Workflow - Implementation Plan

**Feature**: Intelligent sketch-driven project initialization  
**Agents**: Mimer (Detection), Freya (UX), Saga (Brief), Cascade (Trigger Map)  
**When**: User uploads sketch(es) to repository  
**Purpose**: Enable designers to start with sketches, build foundation retroactively  
**Vision**: From "15 wireframes in a folder" → "Complete WDS project with specs & prototypes"

---

## Overview

This plan establishes a **sketch-first initialization flow** where users can:
1. Upload one or multiple sketches
2. Get intelligent analysis and grouping
3. Choose to build full WDS foundation or quick specs
4. End with complete documentation, navigation, and prototypes

**Key Innovation**: Start with what's fun (sketching) → Agent guides to proper process

---

## Phase 1: Manual Trigger (Now - v1.0)

### **Core Principle: Human-in-Loop**

All processing requires manual trigger and human confirmation at every decision point.

### **Detection (Passive Monitoring)**

**What Agent Monitors:**
```
Watch folders:
├── /sketches/
├── /docs/*/sketches/
├── /4-scenarios/*/sketches/
└── Any configured sketch directories

Detects:
├── New files added
├── Files modified (date/size changed)
├── Files renamed
└── Files moved
```

**Agent Behavior:**
```
User: [drops 5 sketches in /sketches/]

Mimer: "👋 Hey! I noticed some changes:
        
        **New Sketches** (5):
        ✨ landing-page.jpg
        ✨ signin.jpg
        ✨ dashboard.jpg
        ✨ profile.jpg
        ✨ settings.jpg
        
        Would you like me to analyze them?
        
        [Yes, analyze now] [Remind me later]"
```

**User must trigger** - No automatic processing

---

### **Single Sketch Analysis**

**Workflow: workshop-a-sketch-to-page.md**

```
User: [uploads landing-page.jpg]

Mimer: "I see a sketch! Activating Freya..."

Freya: "Hi! Let me analyze this sketch...
         
         🔍 Analysis:
         - Landing page concept
         - Hero, features, testimonials, CTA
         - Looks like SaaS product
         
         📋 Is this part of a larger project?
         [A] Yes, let's set up full WDS project
         [B] No, just specify this page
         [C] Let me think about it"

User: "A"

Freya: "Perfect! Since this is a new project, let's
         build the foundation first.
         
         I'll hand you to Saga for Product Brief,
         then we'll come back to spec this sketch
         with full context.
         
         🎯 Activating Saga..."
         
         → Product Brief workflow
         → Trigger Mapping workflow (if needed)
         → Return to Freya for page specification
```

**Human confirms:**
- ✅ Sketch interpretation (sections, objects)
- ✅ Project scope (full WDS vs. quick spec)
- ✅ Page naming and purpose
- ✅ Content and translations
- ✅ Final specification

---

### **Batch Sketch Analysis**

**Workflow: workshop-b-batch-sketch-analysis.md**

```
User: [uploads 15 wireframes]

Mimer: "Whoa! I see 15 sketches! 🎨
        Let me analyze them all...
        
        [Analyzing patterns and relationships...]
        
        📊 **What I Found:**
        
        **Scenario 1: User Onboarding** (6 pages)
        1. landing-page.jpg → Start/Hero
        2. signin.jpg → Authentication
        3. profile-setup.jpg → Profile creation
        4. family-setup.jpg → Family info
        5. dog-profile.jpg → Add dog
        6. dashboard.jpg → Success/overview
        
        **Scenario 2: Daily Features** (7 pages)
        7. calendar-view.jpg → Schedule
        ...
        
        **Standalone** (2 pages)
        14. about.jpg
        15. contact.jpg
        
        🤔 **Questions:**
        1. Did I group these correctly?
        2. Ready to build full WDS project?
        3. Want to adjust grouping first?"

User: "Grouping looks good. Let's build the project!"

Mimer: "Perfect! Here's the plan:
        
        **Phase 1: Foundation** (10 min)
        → Saga: Product Brief (using sketch 1 as context)
        → Cascade: Trigger Map (validating against sketches)
        
        **Phase 2: Structure** (5 min)
        → Create scenario folders
        → Map sketches to pages
        → Establish navigation flow
        
        **Phase 3: Specification** (iterative)
        → Freya analyzes each sketch
        → You review and refine
        
        **Phase 4: Prototypes** (automatic)
        → Generate interactive HTML prototypes
        → Link all pages together
        → Create clickable flows
        
        **Result:**
        ✅ Complete WDS project
        ✅ All 15 pages documented
        ✅ All 15 pages prototyped
        ✅ Navigation mapped
        ✅ Interactive demo
        ✅ Ready for development & testing
        
        Let's start! [Begin] [Adjust plan]"

User: "Begin"

→ Full workflow execution with human confirmation at key points
```

**Human confirms:**
- ✅ Scenario grouping (can adjust)
- ✅ Page naming and sequence
- ✅ Each sketch interpretation
- ✅ Phase completion before proceeding

---

### **Iterative Page Updates**

**Workflow: workshop-c-page-update.md**

```
User: [uploads landing-page-v2.jpg]

Freya: "I see we already have specs for Landing Page.
         Let me compare this to version 1...
         
         🔍 **Changes detected:**
         ✅ Hero section - unchanged
         ✅ Feature Cards - unchanged
         ➕ Feature Card 3 - NOW COMPLETE (was TBD)
         ✏️ Header - NEW: Search bar with filters
         ➕ Footer - NOW COMPLETE (was blank)
         
         Should I:
         [A] Update all changed sections
         [B] Pick specific sections to update
         [C] Show me detailed comparison first"

User: "A"

Freya: "Great! I'll update:
         1. Add search bar specs to Header
         2. Complete Feature Card 3
         3. Generate Footer specifications
         
         Preserving existing:
         ✅ Hero (no changes)
         ✅ Feature Cards 1-2 (no changes)
         
         Ready to proceed? [Yes/Adjust]"

User: "Yes"

→ Updates only changed sections, preserves rest
```

**Human confirms:**
- ✅ Change detection accuracy
- ✅ Which sections to update
- ✅ New specifications
- ✅ Preserved sections remain unchanged

---

### **Configuration (v1.0)**

```yaml
# wds-workflow-status.yaml

sketch_monitoring:
  enabled: true
  watch_folders:
    - "sketches/"
    - "4-scenarios/**/sketches/"
  detection_mode: "passive"      # Detects but doesn't process
  notification_mode: "proactive" # Alerts user immediately
  auto_process: false            # Requires manual trigger
  human_confirmation: "all"      # Every decision needs confirmation
  batch_threshold: 5             # Group if 5+ sketches detected
```

---

## Phase 2: Semi-Auto (Future - v1.5-2.0)

### **Enhanced Detection**

**Smart Categorization:**
```
Agent behavior:
├── 👀 Monitor: Continuous detection
├── 🧠 Analyze: Auto-categorize when idle
├── 📋 Queue: Store results for review
├── 🔔 Notify: "Ready for your review"
└── 🤝 Review: Human approves/adjusts

New sketch detected: payment-flow.jpg
├─ Check: Matching page spec exists?
│  ├─ YES → "Updated sketch for existing page"
│  └─ NO → "New sketch, needs page creation"
│
├─ Check: Name suggests scenario?
│  ├─ "payment-flow" → Could be new scenario
│  └─ "landing-v2" → Update to existing
│
├─ Check: Where was it added?
│  ├─ /4-scenarios/2-checkout/ → Part of existing scenario
│  └─ /sketches/ → Needs placement
│
└─ Confidence Level:
   ├─ High → Can suggest auto-processing
   └─ Low → Requires manual review
```

**Smart Batching:**
```
Agent groups by:
├── Related scenarios
├── Update vs. new
├── Priority (core pages first)
└── Dependencies (flows must be sequential)

Example:
Batch 1: "Core Flow Updates" (3 sketches - HIGH priority)
  → Existing pages, quick updates
  → Estimated: 10 minutes
  → [Auto-process] [Review first] [Skip]

Batch 2: "New Booking Feature" (8 sketches - MEDIUM priority)
  → New scenario, full specification
  → Estimated: 30 minutes
  → [Auto-process] [Review first] [Later]
```

**Auto-Analysis During Idle:**
```
Agent: "While you were away, I analyzed 5 sketches.
        Here's what I found. Please review:
        
        Sketch 1: landing-page.jpg
        ├── Sections: Hero, Features, CTA
        ├── Status: Ready for spec
        ├── Confidence: High ✅
        └── [Approve] [Adjust] [Reject]
        
        Sketch 2: dashboard.jpg
        ├── Sections: Complex layout detected
        ├── Status: Needs clarification
        ├── Confidence: Medium ⚠️
        └── [Manual Review Required]
        
        [Approve All High-Confidence] [Review Each]"
```

**Why Later:**
- ⚠️ Requires mature AI with proven accuracy
- ⚠️ Risk of incorrect auto-interpretation
- ✅ Saves time on obvious cases
- ✅ Human still reviews all decisions

---

### **Configuration (v1.5-2.0)**

```yaml
sketch_monitoring:
  enabled: true
  detection_mode: "active"           # Processes when idle
  notification_mode: "batch_summary" # Summarizes results
  auto_analysis: true                # Analyzes during idle time
  auto_process: false                # Still requires approval
  human_confirmation: "changes"      # Only for modifications
  confidence_threshold: 0.85         # High confidence threshold
```

---

## Phase 3: Full Auto (Far Future - v3.0+)

### **Autonomous Processing**

**Only when:**
- ⚠️ Extremely high AI accuracy (>95%)
- ⚠️ User explicitly opts in
- ⚠️ Well-established patterns in project
- ✅ Full audit trail available
- ✅ Easy rollback mechanism

```
Agent behavior:
├── 👀 Monitor: Continuous
├── 🤖 Process: Fully automatic
├── ✅ Execute: Generate specs & prototypes
├── 📧 Notify: "5 pages completed"
└── 🔄 Review: "Review when ready"

Example:
Agent: "I processed 5 sketches automatically:
        
        ✅ 5 specifications generated
        ✅ 5 prototypes created
        ✅ Navigation updated
        ✅ Tests passed
        
        📋 Review PR #47 when ready.
        
        All changes are in a branch for your review."
```

**Why Far Future:**
- ⚠️ Requires extremely high accuracy
- ⚠️ Less learning for user
- ⚠️ Could miss important context
- ⚠️ Only for mature, well-established projects

---

## Workflows to Create

### **Immediate (v1.0)**

1. **workshop-a-sketch-to-page.md**
   - Single sketch → page specification
   - Context detection (new vs. existing project)
   - Routes to Product Brief if needed
   - Full human-in-loop

2. **workshop-b-batch-sketch-analysis.md**
   - Multiple sketches → scenario grouping
   - Pattern recognition & relationship detection
   - Smart grouping with user confirmation
   - Complete project initialization

3. **workshop-c-page-update.md**
   - Updated sketch → incremental update
   - Change detection & comparison
   - Selective section updates
   - Preserve unchanged specifications

4. **page-init-lightweight.md**
   - Quick page setup: name, purpose, navigation
   - Create folder structure
   - Generate placeholder with navigation
   - Ready for sketch analysis

### **Future (v1.5+)**

5. **smart-batch-processor.md**
   - Auto-categorization during idle
   - Confidence-based suggestions
   - Queue for review

6. **change-detection-engine.md**
   - Advanced visual comparison
   - Semantic diff understanding
   - Smart merge strategies

---

## Success Metrics

### **v1.0 (Manual Trigger)**
- ✅ Detection accuracy: 100% (all sketches found)
- ✅ User triggers: 100% required
- ✅ Confirmation points: All decisions
- ✅ Time saved: 50% vs. manual documentation

### **v1.5 (Semi-Auto)**
- ✅ Analysis accuracy: 85%+
- ✅ Auto-categorization: 80%+
- ✅ Human review: All results
- ✅ Time saved: 70% vs. manual

### **v2.0+ (Full Auto)**
- ✅ Processing accuracy: 95%+
- ✅ Auto-approval: High confidence only
- ✅ Human review: Available
- ✅ Time saved: 90% vs. manual

---

## Benefits

### **For Designers**
- ✅ Start with fun part (sketching)
- ✅ Agent builds foundation retroactively
- ✅ Complete documentation from wireframes
- ✅ Interactive prototypes automatically

### **For Teams**
- ✅ Consistent documentation
- ✅ Navigable specifications
- ✅ Development-ready handoffs
- ✅ Testable prototypes

### **For Process**
- ✅ Lower barrier to entry
- ✅ Encourages proper documentation
- ✅ Validates designs against strategy
- ✅ Creates institutional knowledge

---

## Implementation Priority

### **Now (Week 1-2)**
1. Passive sketch detection (Mimer)
2. Single sketch analysis workflow (Freya)
3. Page init lightweight (navigation setup)
4. Basic change detection

### **Soon (Week 3-4)**
5. Batch sketch analysis
6. Smart scenario grouping
7. Complete project initialization
8. Prototype generation integration

### **Later (Month 2-3)**
9. Auto-analysis during idle
10. Confidence-based suggestions
11. Smart batching
12. Advanced change detection

---

## Technical Requirements

### **Detection System**
- File system watcher
- Pattern matching (new/modified/moved)
- Folder configuration (watch list)
- Event throttling (batch rapid changes)

### **Analysis Engine**
- Image analysis (if AI vision available)
- Pattern recognition (grouping similar pages)
- Relationship detection (flow connections)
- Confidence scoring

### **Human-in-Loop Interface**
- Clear confirmation points
- Visual diffs (old vs. new)
- Batch approval options
- Undo/rollback capability

### **Integration Points**
- Existing sketch analysis workflow (4b-sketch-analysis.md)
- Product Brief workflow (Saga)
- Trigger Map workflow (Cascade)
- Prototype generation

---

## Configuration Example

```yaml
# wds-workflow-status.yaml

# Phase 1: Manual Trigger (v1.0)
sketch_workflow:
  version: "1.0"
  mode: "manual-trigger"
  
  monitoring:
    enabled: true
    watch_folders:
      - "sketches/"
      - "4-scenarios/**/sketches/"
    detect_changes: true
    notify_user: true
  
  processing:
    auto_analyze: false       # Requires manual trigger
    auto_process: false       # Requires approval
    human_confirmation: "all" # Every decision point
  
  batching:
    enabled: true
    threshold: 5              # Group if 5+ sketches
    suggest_grouping: true    # Show suggested groups
    require_approval: true    # User must approve
  
  workflows:
    single_sketch: "workshop-a-sketch-to-page.md"
    batch_sketches: "workshop-b-batch-sketch-analysis.md"
    page_update: "workshop-c-page-update.md"
    page_init: "page-init-lightweight.md"
```

---

## Guardrails

### **Always Required**
- ✅ User triggers all processing
- ✅ Human confirms all interpretations
- ✅ Clear undo/rollback mechanism
- ✅ Audit trail of all changes
- ✅ Preserve user's work

### **Never Allowed**
- ❌ Auto-process without trigger
- ❌ Auto-approve without review
- ❌ Overwrite without confirmation
- ❌ Delete user's specifications
- ❌ Skip confirmation points

---

**Created**: December 28, 2025  
**Feature Owner**: Freya (UX), Mimer (Detection)  
**Status**: Planning Complete → Ready for Implementation  
**Next Step**: Create v1.0 workflows (manual trigger, human-in-loop)

---

## Summary: From Sketches to Specs

```
Before:
├── 15 random wireframes in a folder
├── No documentation
├── No structure
└── "Now what?"

After (v1.0):
├── Complete WDS project
├── All pages documented with specs
├── Proper navigation between pages
├── Interactive prototypes
├── Strategic foundation (Brief + Trigger Map)
└── Ready for development & testing

Time: 1-2 hours vs. 2-3 days manual
Quality: Consistent, complete, navigable
Experience: Start with fun, end with foundation
```

**The Magic**: Agent detects → User triggers → Human confirms → Complete project! 🎨→📋→💻

