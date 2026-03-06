# Tutorial 19: Build Your Design Space

**Hands-on guide to setting up a Design Space, running a site analysis, and capturing your first feedback pair**

---

## Overview

This tutorial walks you through three practical exercises:
1. Setting up a Design Space for your project
2. Running a site analysis to build baseline knowledge
3. Capturing your first feedback pair to start teaching the system taste

**Time:** 30-45 minutes
**Prerequisites:** Supabase project with pgvector, Design Space MCP server configured
**Agents:** Saga (site analysis), Freya (feedback loop)

---

## Exercise 1: Setup (5 min)

### Configure the MCP Server

Add to your Claude Code settings:

```json
{
  "mcpServers": {
    "design-space": {
      "command": "node",
      "args": ["path/to/design-space-mcp/index.js"]
    }
  }
}
```

### Create the Project Guide

In your project repo, create `.claude/design-space-guide.md`:

```markdown
# Design Space Guide — [Project Name]

## Project
- Name: [project-tag]
- Client: [client name]
- Domain: [e.g., "professional services", "e-commerce"]
- Phase: [current WDS phase]

## Active Categories
- successful_pattern
- component_experience
- design_system_evolution
- methodology

## Search Prompts
- "[domain] design patterns"
- "[page type] layout approaches"
- "mobile navigation for [domain]"
```

### Verify

**You say to the agent:**
> "Check the Design Space connection. Run space_stats."

The agent should return entry counts. If it errors, check MCP server configuration.

---

## Exercise 2: Site Analysis (15-20 min)

### Start the Analysis

**You say:**
> "Analyze [website URL] and capture the design DNA into the Design Space."

The agent triggers the Site Analysis workflow (workflow 9).

### What Happens

The agent will:
1. Navigate to the site and map its structure
2. Extract navigation patterns, layout structures, page types
3. Capture color palette, typography, spacing rhythm
4. Screenshot each major section with a detailed description
5. Analyze brand voice, CTAs, content patterns
6. Capture everything with proper tags

### Your Role

- Confirm the URL
- Watch the progress (each section takes ~30 seconds for visual capture)
- Review the summary at the end
- Point out anything the agent missed

### Expected Output

After completion, you should have:
- 5-10 text knowledge entries (structural DNA, content DNA, patterns)
- 5-8 visual entries with dual embeddings (section screenshots)
- All tagged with your project name and "site-analysis" source

### Verify

**You say:**
> "Search the Design Space for [project name] site analysis entries."

```
search_space({
  query: "[project name] design analysis",
  project: "[project]",
  limit: 20,
  threshold: 0.3
})
```

---

## Exercise 3: First Feedback Pair (10 min)

This exercise teaches the system your taste. You'll need an active design to work with — a wireframe, mockup, or component you're building with Freya.

### Step 1: Get a Design Proposal

**You say:**
> "Design a hero section for [project]. Use the site analysis data as reference."

The agent proposes a hero section based on captured patterns.

### Step 2: Suggest an Improvement

Look at the proposal and find something to improve. Common first improvements:
- "Make the heading lighter — less corporate"
- "Add more whitespace between the heading and CTA"
- "Use a warmer accent color"
- "Left-align instead of center"

**You say:**
> "Make the heading weight lighter — 300 instead of 700. The bold feels too corporate for this brand."

### Step 3: Watch the Loop

The agent should:
1. Capture the before state (bold heading)
2. Ask what makes it better (or infer from your instruction)
3. Apply the change (light heading)
4. Capture the after state (light heading)
5. Save the linked pair
6. Confirm: "Learned: light heading weight creates more elegance for this brand."

### Step 4: Verify the Pair

**You say:**
> "Show recent Design Space entries."

```
recent_knowledge({
  limit: 5,
  project: "[project]"
})
```

You should see two linked entries — one rejected (before), one approved (after) — with your reasoning attached.

### Step 5: Test Proactive Improvement

Now propose another design with a bold heading:

**You say:**
> "Design a section heading for the services area. Use bold weight."

If the feedback loop is working, the agent should:
1. Run `search_preference_patterns` before presenting
2. Find the match with your earlier feedback
3. Apply light weight proactively
4. Tell you: "I applied light heading weight — it worked better in the hero section."

---

## What You've Practiced

1. **Setup** — MCP server configuration and project guide
2. **Site Analysis** — Automated capture of design DNA with dual embeddings
3. **Feedback Loop** — Teaching the system taste through improvement pairs
4. **Proactive Improvement** — Seeing the system apply learned improvements

---

## Next Steps

- **Analyze competitor sites** — Build competitive intelligence in the Space
- **Continue designing** — Each feedback pair teaches the system more
- **Run a quality audit** — Use the Knowledge Capture workflow (validate mode) to review entries
- **Search before designing** — Make it a habit to check the Space before starting

---

**[← Back to Lesson 5](lesson-05-proactive-improvement.md)** | **[← Back to Module Overview](module-19-design-space-overview.md)** | **[Back to Course Overview](../00-course-overview/00-course-overview.md)**

---

*Created by Mårten Angner and the Whiteport team*
*Part of Module 19: Design Space*
