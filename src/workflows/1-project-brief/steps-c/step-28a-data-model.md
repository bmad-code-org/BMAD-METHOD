---
name: 'step-28a-data-model'
description: 'Define the complete database schema — every table, column, type, and relationship'

# File References
nextStepFile: './step-28b-state-machines.md'
workflowFile: '../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 28a: Data Model

## STEP GOAL:
Define the complete database schema. Every entity the system manages becomes a table. Every attribute becomes a column with a specific type. Every relationship is explicit. The output must be detailed enough that a coding agent can create the database migrations directly from this document.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Systems Architect translating business concepts into database structure
- The Product Brief is your primary source — every business concept mentioned there must appear in the schema
- Ask the user to validate your interpretation, not to design the schema themselves

### Step-Specific Rules:
- Focus: Tables, columns, types, defaults, constraints, relationships, indexes
- FORBIDDEN: Do not produce vague "data layer" descriptions. Every column must have a name and type.
- FORBIDDEN: Do not skip nullable/default/constraint decisions
- Approach: Extract entities from the Product Brief, propose schema, validate with user

## CONTEXT DEPENDENCIES:
- Product Brief (Steps 1-12): Business concepts, user types, product features
- Technology Stack (Step 28): Database choice constrains types and features

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Extract Entities from Product Brief

Read the Product Brief and identify every noun that the system manages:
- Users, accounts, organizations
- The core business objects (projects, orders, content, products, etc.)
- Supporting objects (settings, notifications, payments, etc.)
- Reference data (categories, statuses, types)

Present the entity list: "Based on your Product Brief, these are the things your system manages: [list]. Missing anything?"

### 2. Define Each Table

For EVERY entity, define:

```
Table: [entity_name]
Description: [what this represents in the business]

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| id | uuid | no | gen_random_uuid() | PK | |
| ... | ... | ... | ... | ... | ... |
| created_at | timestamptz | no | now() | | |
| updated_at | timestamptz | no | now() | | |
```

### 3. Define Relationships

For every relationship between entities:
- Type: one-to-one, one-to-many, many-to-many
- Foreign key column and referenced table
- Cascade behavior (on delete, on update)
- Junction tables for many-to-many

### 4. Define Indexes

Based on expected query patterns:
- Which columns will be searched/filtered frequently?
- Composite indexes for common query combinations
- Unique constraints for business rules (e.g., one active subscription per user)

### 5. Enumerate Data Types

Reference the chosen database and use exact types:
- PostgreSQL: `text`, `integer`, `bigint`, `numeric(10,2)`, `timestamptz`, `uuid`, `jsonb`, `boolean`, `text[]`
- SQLite: `TEXT`, `INTEGER`, `REAL`, `BLOB`
- MySQL: `VARCHAR(255)`, `INT`, `DECIMAL(10,2)`, `DATETIME`, `JSON`

No vague "string" or "number" — exact database types only.

### 6. Release Phase Tagging

If the product has multiple release phases (MVP, v2, v3):
- Tag each table and column with which phase introduces it
- Phase 1 tables must be complete — later phases ADD columns/tables, never restructure
- The schema should be designed so that all phases share the same foundation

Present: "Here's what exists in Phase 1 vs what gets added later. The key insight: we design the full schema now but only populate Phase 1 fields initially."

### 7. Validate with User

Present the complete schema and ask:
- "Does every business concept from your Product Brief have a home in this schema?"
- "Are there any entities I missed?"
- "Do the relationships match how your business actually works?"

### 8. Design Log Update

Update design log with schema decisions.

### N. Present MENU OPTIONS
Display: "**Select an Option:** [C] Continue to State Machines"

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN the user confirms the schema is complete will you proceed.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- Every business entity from the Product Brief has a table
- Every table has complete column definitions (name, type, nullable, default, constraints)
- All relationships defined with foreign keys and cascade behavior
- Indexes defined for expected query patterns
- Release phases tagged
- User confirmed the schema captures their business

### FAILURE:
- Produced a "data layer overview" instead of actual table definitions
- Left columns with vague types ("string", "number")
- Missed entities mentioned in the Product Brief
- Did not define relationships between tables
- Generated schema without user validation

**LITMUS TEST:** Can a coding agent run `CREATE TABLE` statements directly from this output? If not, it's not done.

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
