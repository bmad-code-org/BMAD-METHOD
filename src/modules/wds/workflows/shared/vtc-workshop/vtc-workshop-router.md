# Value Trigger Chain Workshop - Router

**Purpose:** Determine which VTC workshop to use based on available strategic context

**Duration:** 1 minute (routing decision)

**Used in:**
- Phase 1: Product Pitch (create simplified VTC for stakeholder communication)
- Phase 4: Scenario Definition (assign VTC to each scenario)

---

## ⚠️ Alpha Status - Feedback Needed

**This workshop is ALPHA** - not yet validated in real projects.

Please document:
- Where you got stuck
- What took longer than estimated  
- What needs clarification
- What's missing

Add feedback to your VTC file notes section.

---

## Step 1: Check Context

**Ask the user:**

> "Do you have a completed Trigger Map for this project?"

**Options:**
- **Yes** → Go to [VTC Selection Workshop](./vtc-selection-workshop.md)
- **No** → Go to [VTC Creation Workshop](./vtc-creation-workshop.md)

---

## Decision Logic

### Route to VTC Selection Workshop IF:
- Trigger Map exists and is completed
- User wants to extract VTC from existing strategic work
- Multiple VTCs might be needed (scenarios)
- Want to ensure consistency with Trigger Map

**Benefits:**
- Leverage existing strategic research
- Maintain consistency across scenarios
- Faster (select vs. imagine)
- Already prioritized

### Route to VTC Creation Workshop IF:
- No Trigger Map yet
- Early stage (Product Pitch)
- Quick project needing lightweight approach
- Standalone scenario/prototype

**Benefits:**
- Get started immediately
- No Trigger Map overhead
- Sufficient for simple projects
- Can evolve to Trigger Map later

---

## Context Information to Provide

When routing to either workshop, provide:

**Project Context:**
- Project name
- Current phase (Pitch or Scenario Definition)
- Purpose of this VTC (what will it be used for?)

**For Selection Workshop (if Trigger Map exists):**
- Path to Trigger Map document
- Number of business goals mapped
- Number of users/personas mapped
- Current scenario being defined (if applicable)

**For Creation Workshop (if no map):**
- Brief project description
- Who is the primary user? (if known)
- What problem are we solving? (if known)

---

## Output

Both workshops produce the same output:

**Completed VTC:**
- Business Goal
- Solution
- User
- Driving Forces (2-5, positive and negative)
- Customer Awareness (start → end)

**Format:** YAML file following [VTC Template](./vtc-template.yaml)

**Destination:**
- Product Pitch: `docs/A-Product-Brief/vtc-primary.yaml`
- Scenario: `docs/D-UX-Design/[scenario-name]/vtc.yaml`

---

## Agent Instructions

**When user requests VTC:**

1. Ask: "Do you have a completed Trigger Map?"
2. Based on answer, route to appropriate workshop
3. Provide context information to that workshop
4. Run the selected workshop
5. Save resulting VTC to appropriate location
6. Confirm completion with user

**Example Dialog:**

```
Agent: "I'll help you create a Value Trigger Chain for [context]. 
        Do you have a completed Trigger Map for this project?"

User: "No, not yet."

Agent: "Perfect! I'll guide you through creating a VTC from scratch. 
        This will take about 30 minutes. Let's start with your 
        business goal..."

[Proceeds to VTC Creation Workshop]
```

---

## Related Resources

- [Value Trigger Chain Guide](../../../docs/method/value-trigger-chain-guide.md) - Full methodology
- [Trigger Mapping Guide](../../../docs/method/phase-2-trigger-mapping-guide.md) - When to create full map
- [Product Pitch Process](../../1-project-brief/project-pitch/) - Using VTC in pitches
- [Scenario Definition](../../4-ux-design/scenario-init/) - Using VTC in scenarios

---

*VTC Workshop Router - Right workshop, right time*

