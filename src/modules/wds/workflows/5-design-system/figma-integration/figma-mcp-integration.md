# Figma MCP Integration for WDS

**Purpose:** Technical guide for integrating Figma with WDS using Model Context Protocol (MCP).

**Audience:** AI agents, developers, technical designers

---

## Overview

**Figma MCP enables:**

- Reading component specifications from Figma
- Extracting design tokens
- Generating WDS component specifications
- Maintaining Figma ↔ WDS sync

---

## MCP Server Setup

### Prerequisites

- Figma API access token
- MCP server configured
- WDS project initialized
- Design system mode set to "custom"

---

### Configuration

**Add to MCP configuration:**

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_PERSONAL_ACCESS_TOKEN": "your-figma-token"
      }
    }
  }
}
```

**Get Figma API token:**

1. Go to Figma → Settings → Account
2. Scroll to "Personal access tokens"
3. Click "Generate new token"
4. Copy token and add to configuration

---

## MCP Operations

### 1. Read Figma Component

**Purpose:** Extract component data from Figma

**Input:**

- Figma file ID
- Node ID
- Or component name

**Output:**

- Component structure
- Variants
- Properties
- Design tokens used

**Example:**

```
Agent: Read Figma component Button/Primary

MCP Response:
{
  "name": "Button/Primary [btn-001]",
  "type": "COMPONENT_SET",
  "variants": [
    {
      "name": "Type=Primary, Size=Medium, State=Default",
      "properties": {
        "Type": "Primary",
        "Size": "Medium",
        "State": "Default"
      },
      "styles": {
        "background": "primary/600",
        "padding": "16px 12px",
        "borderRadius": "8px"
      }
    },
    // ... more variants
  ],
  "description": "Button Primary [btn-001]...",
  "nodeId": "456:789"
}
```

---

### 2. Extract Design Tokens

**Purpose:** Get design token values from Figma

**Input:**

- Figma file ID
- Token type (colors, typography, spacing)

**Output:**

- Token definitions
- Token values
- Token mappings

**Example:**

```
Agent: Extract color tokens from Figma

MCP Response:
{
  "colors": {
    "primary/50": "#eff6ff",
    "primary/500": "#3b82f6",
    "primary/600": "#2563eb",
    "gray/900": "#111827"
  }
}
```

---

### 3. Get Component Node ID

**Purpose:** Find Figma node ID for component

**Input:**

- Component name or WDS component ID

**Output:**

- Figma node ID
- File ID
- Full Figma URL

**Example:**

```
Agent: Get node ID for Button [btn-001]

MCP Response:
{
  "componentId": "btn-001",
  "fileId": "abc123",
  "nodeId": "456:789",
  "url": "figma://file/abc123/node/456:789"
}
```

---

### 4. List Components

**Purpose:** Get all components in Figma file

**Input:**

- Figma file ID
- Optional: filter by type

**Output:**

- List of components
- Component names
- Node IDs

**Example:**

```
Agent: List all button components

MCP Response:
{
  "components": [
    {
      "name": "Button/Primary [btn-001]",
      "nodeId": "456:789",
      "type": "COMPONENT_SET"
    },
    {
      "name": "Button/Secondary [btn-001]",
      "nodeId": "456:790",
      "type": "COMPONENT_SET"
    }
  ]
}
```

---

## Sync Workflows

### Figma → WDS Sync

**When:** Component created or updated in Figma

**Process:**

**Step 1: Detect Change**

```
Designer updates Button/Primary in Figma
Designer notifies WDS system
Or: Automated webhook triggers sync
```

**Step 2: Read Component**

```
Agent: Read Figma component Button/Primary [btn-001]

MCP reads:
- Component structure
- All variants
- All states
- Properties
- Design tokens
- Description
```

**Step 3: Parse Component Data**

```
Agent extracts:
- Component type: Button
- WDS ID: btn-001
- Variants: primary, secondary, ghost
- States: default, hover, active, disabled, loading
- Sizes: small, medium, large
- Design tokens: primary/600, spacing/4, radius/md
```

**Step 4: Generate WDS Specification**

```
Agent creates/updates:
D-Design-System/components/button.md

Using template: component.template.md
Filling in:
- Component name and ID
- Variants from Figma
- States from Figma
- Styling from design tokens
- Description from Figma
```

**Step 5: Update Mappings**

```
Agent updates:
D-Design-System/figma-mappings.md

Adds/updates:
Button [btn-001] → figma://file/abc123/node/456:789
```

**Step 6: Verify and Confirm**

```
Agent presents generated spec to designer
Designer reviews and confirms
Spec is committed to repository
```

---

### WDS → Figma Notification

**When:** WDS specification updated

**Process:**

**Step 1: Detect Change**

```
WDS specification updated
Git commit triggers notification
```

**Step 2: Identify Figma Component**

```
Agent reads figma-mappings.md
Finds: Button [btn-001] → figma://file/abc123/node/456:789
```

**Step 3: Notify Designer**

```
Agent creates notification:
"Button [btn-001] specification updated in WDS.
Please review and update Figma component if needed.

Changes:
- Added new loading state
- Updated hover animation
- Modified padding values

Figma component: [Link to Figma]"
```

**Step 4: Designer Updates Figma**

```
Designer reviews changes
Updates Figma component
Confirms sync complete
```

**Note:** Full WDS → Figma automation requires Figma API write access (currently read-only for MCP).

---

## Component Specification Generation

### Template-Based Generation

**Agent uses component template:**

**Input:**

```
Figma component data:
{
  "name": "Button/Primary [btn-001]",
  "variants": [...],
  "states": [...],
  "tokens": {...},
  "description": "..."
}
```

**Template:** `templates/component.template.md`

**Output:** `D-Design-System/components/button.md`

**Process:**

1. Load component template
2. Fill in component name and ID
3. Extract and format variants
4. Extract and format states
5. Map design tokens to WDS tokens
6. Add styling specifications
7. Include description and usage
8. Generate accessibility notes
9. Add version history
10. Save to design system folder

---

### Token Mapping

**Figma variables → WDS tokens:**

**Agent maps:**

```
Figma: primary/600 → WDS: color-primary-600
Figma: spacing/4 → WDS: spacing-4
Figma: Text/Body → WDS: text-body
Figma: shadow/sm → WDS: shadow-sm
```

**Mapping rules:**

- Figma collection/variable → WDS category-name-value
- Maintain semantic meaning
- Consistent naming across systems
- Document custom mappings

---

## Error Handling

### Component Not Found

**Error:** Figma component doesn't exist

**Agent response:**

```
⚠️ Component not found in Figma

Component: Button/Primary [btn-001]
File ID: abc123
Node ID: 456:789

Possible causes:
- Component deleted in Figma
- Node ID changed
- File ID incorrect
- Access permissions

Actions:
1. Verify component exists in Figma
2. Update node ID in figma-mappings.md
3. Re-sync component
```

---

### Missing WDS Component ID

**Error:** Figma component has no WDS ID in description

**Agent response:**

```
⚠️ WDS Component ID missing

Component: Button/Primary
Figma node: 456:789

Please add WDS component ID to Figma description:
Format: [component-id]
Example: Button/Primary [btn-001]

After adding ID, re-sync component.
```

---

### Token Mapping Failure

**Error:** Can't map Figma variable to WDS token

**Agent response:**

```
⚠️ Token mapping failed

Figma variable: custom-blue-500
No matching WDS token found

Options:
1. Create new WDS token: color-custom-blue-500
2. Map to existing token: color-primary-500
3. Add custom mapping rule

Your choice:
```

---

### Sync Conflict

**Error:** Figma and WDS have different versions

**Agent response:**

```
⚠️ Sync conflict detected

Component: Button [btn-001]

Figma version:
- Last updated: 2024-12-15
- Changes: Added loading state

WDS version:
- Last updated: 2024-12-14
- Changes: Updated hover animation

Options:
1. Figma wins (overwrite WDS)
2. WDS wins (notify designer)
3. Manual merge (review both)

Your choice:
```

---

## Best Practices

### For AI Agents

**DO ✅**

- Always check for WDS component ID in Figma
- Verify token mappings before generating specs
- Present generated specs for designer review
- Update figma-mappings.md after sync
- Document sync operations in version history

**DON'T ❌**

- Don't overwrite WDS specs without confirmation
- Don't create components without designer approval
- Don't skip token mapping validation
- Don't ignore sync conflicts
- Don't forget to update mappings

---

### For Designers

**DO ✅**

- Add WDS component ID to all Figma components
- Use design tokens (variables) consistently
- Document component changes
- Notify system when updating components
- Review generated specs before committing

**DON'T ❌**

- Don't use hardcoded values
- Don't skip component descriptions
- Don't forget to sync after changes
- Don't detach component instances
- Don't change component IDs

---

## Integration Points

### Phase 4: UX Design

**When component is specified in Phase 4:**

1. Designer creates sketch
2. Agent specifies component
3. Design system router checks for similar components
4. If new component needed:
   - Designer creates in Figma
   - MCP reads from Figma
   - Spec generated automatically

---

### Phase 5: Design System

**When component is added to design system:**

1. Component specification complete
2. Agent checks: Figma component exists?
3. If yes:
   - MCP reads Figma component
   - Extracts styling details
   - Updates WDS spec with Figma data
4. If no:
   - Designer creates in Figma
   - MCP syncs to WDS

---

## Command Reference

### Read Component

```
Agent: Read Figma component [component-name]
MCP: Returns component data
```

### Extract Tokens

```
Agent: Extract [token-type] tokens from Figma
MCP: Returns token definitions
```

### Get Node ID

```
Agent: Get Figma node ID for [component-id]
MCP: Returns node ID and URL
```

### List Components

```
Agent: List Figma components [optional: filter]
MCP: Returns component list
```

### Sync Component

```
Agent: Sync Figma component [component-name] to WDS
MCP: Reads component, generates spec, updates mappings
```

---

## Troubleshooting

### MCP Server Not Responding

**Check:**

- MCP server is running
- Figma API token is valid
- Network connection is active
- File ID and node ID are correct

---

### Invalid API Token

**Error:** 403 Forbidden

**Solution:**

1. Generate new Figma API token
2. Update MCP configuration
3. Restart MCP server
4. Retry operation

---

### Rate Limiting

**Error:** 429 Too Many Requests

**Solution:**

- Wait before retrying
- Batch operations when possible
- Cache component data
- Reduce sync frequency

---

## Future Enhancements

**Planned features:**

- Automated sync on Figma changes (webhooks)
- Bidirectional sync (WDS → Figma write)
- Batch component import
- Design token extraction automation
- Component usage tracking from Figma
- Visual diff for sync conflicts

---

**This MCP integration enables seamless Figma ↔ WDS synchronization while maintaining designer control and design system consistency.**
