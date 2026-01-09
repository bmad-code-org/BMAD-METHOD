# Figma MCP

**Category:** Integration Tool  
**Purpose:** MCP server for automated Figma integration with WDS  
**Repository:** WDS Figma MCP Server

---

## What It Is

Figma MCP (Model Context Protocol) is a server that enables automated, bidirectional communication between WDS agents (Freya) and Figma. It allows precise component-level injection from HTML prototypes into Figma and automated reading of refined components back into the design system.

---

## Why WDS Recommends It

**Automation:**
- Freya automatically injects components to Figma
- No manual upload or conversion needed
- Automated design token extraction
- Bidirectional sync (Prototype ↔ Figma ↔ Design System)

**Precision:**
- Component-level injection (not full pages)
- Object ID preservation automatic
- Target specific Figma pages
- Batch component operations

**Integration:**
- Seamless WDS workflow integration
- Page naming matches specification structure
- Automated design system updates
- Version control friendly

---

## Setup Instructions

### 1. Installation

```bash
# Install Figma MCP server
npm install -g @wds/figma-mcp-server
```

### 2. Figma API Access

Get your Figma personal access token:

1. Go to Figma Settings → Account
2. Scroll to "Personal access tokens"
3. Click "Generate new token"
4. Name it "WDS MCP Server"
5. Copy the token

### 3. Configuration

Set up environment variables:

```bash
# Set Figma access token
export FIGMA_ACCESS_TOKEN="your-token-here"

# Or create .env file
echo "FIGMA_ACCESS_TOKEN=your-token-here" > .env
```

Create MCP configuration file:

`.wds/figma-mcp-config.yaml`:
```yaml
figma:
  access_token: ${FIGMA_ACCESS_TOKEN}
  default_file_id: "your-figma-file-id"
  default_page: "WDS Components"
  
extraction:
  preserve_object_ids: true
  extract_design_tokens: true
  convert_to_components: true
  maintain_hierarchy: true
  
injection:
  auto_layout: true
  responsive_constraints: true
  component_naming: "object-id"
  page_naming: "scenario-page"
  
sync:
  bidirectional: true
  auto_update_design_system: false
  conflict_resolution: "manual"

naming_conventions:
  page_format: "{scenario-number}-{scenario-name} / {page-number}-{page-name}"
  example: "01-Customer-Onboarding / 1.2-Sign-In"
  source: "docs/C-Scenarios/"
```

### 4. Initialize MCP Server

```bash
# Initialize for your project
wds figma init

# Test connection
wds figma test-connection
```

### 5. Get Figma File ID

From your Figma file URL:
```
https://figma.com/file/ABC123DEF456/Project-Name
                        ^^^^^^^^^^^^
                        This is your file ID
```

---

## Freya's Automated Workflow

### Phase 1: Injection (Automated by Freya)

```
User: "Prototype needs refinement"
    ↓
Freya analyzes prototype components
    ↓
Freya identifies components needing refinement
    ↓
Freya presents options to user
    ↓
User: "Yes, inject to Figma"
    ↓
Freya automatically:
  - Determines target Figma file from config
  - Creates/navigates to matching page
  - Injects selected components via MCP
  - Preserves Object IDs in layer names
  - Provides Figma link to user
```

### Phase 2: Reading Back (Automated by Freya)

```
User: "Finished refining in Figma"
    ↓
Freya automatically:
  - Connects to Figma via MCP
  - Reads refined components
  - Extracts design tokens
  - Identifies variants and states
  - Presents changes to user
    ↓
User: "Update design system"
    ↓
Freya automatically:
  - Updates design system files
  - Creates/updates component docs
  - Updates design tokens
  - Offers to re-render prototype
```

---

## WDS Best Practices

### DO ✅

**1. Use Freya Automation**
- Let Freya handle injection automatically
- Freya analyzes components and determines what to inject
- Freya reads refined components back
- No manual commands needed

**2. Maintain Object ID Traceability**
- All components have Object IDs in HTML
- MCP preserves Object IDs in Figma layer names
- Enables tracking from spec → prototype → Figma → design system

**3. Follow Page Naming Convention**
- Pages match WDS specification structure
- Format: `[Scenario-Number]-[Scenario-Name] / [Page-Number]-[Page-Name]`
- Example: `01-Customer-Onboarding / 1.2-Sign-In`

**4. Batch Related Components**
- Inject related components together
- Maintains context for designer
- Efficient workflow

### DON'T ❌

**1. Don't Inject Entire Pages**
- Use component-level precision
- Inject only what needs refinement
- Avoid unnecessary extraction

**2. Don't Skip Object IDs**
- Always include Object IDs in HTML
- Required for traceability
- Enables automated mapping

**3. Don't Manually Upload**
- Use MCP server, not manual upload
- Automation is more reliable
- Maintains consistency

---

## Troubleshooting

### Issue: MCP server can't connect to Figma

**Solution:**
```bash
# Verify access token
echo $FIGMA_ACCESS_TOKEN

# Test connection
wds figma test-connection

# Check Figma file permissions
# Ensure token has access to file
```

### Issue: Components not injecting

**Solution:**
- Verify Object IDs exist in HTML
- Check Figma file ID in config
- Ensure page name is correct
- Check MCP server logs

### Issue: Design tokens not extracting

**Solution:**
- Ensure Figma uses variables (not hardcoded values)
- Check extraction settings in config
- Verify component has proper styling
- Review MCP server logs

### Issue: Object IDs not preserved

**Solution:**
- Check `preserve_object_ids: true` in config
- Verify Object IDs in HTML data attributes
- Ensure MCP server version is up to date

---

## Security Best Practices

### DO ✅

**1. Protect Access Token**
```bash
# Use environment variables
export FIGMA_ACCESS_TOKEN="token"

# Or .env file (add to .gitignore)
echo "FIGMA_ACCESS_TOKEN=token" > .env
```

**2. Add to .gitignore**
```gitignore
.env
.wds/figma-mcp-config.yaml  # If contains sensitive data
```

**3. Use Separate Tokens**
- Different tokens for dev/production
- Rotate tokens periodically
- Revoke unused tokens

### DON'T ❌

**1. Don't Commit Tokens**
- Never commit access tokens to git
- Don't hardcode in configuration files
- Don't share tokens in documentation

**2. Don't Use Personal Tokens for Team**
- Create team/project-specific tokens
- Use service accounts when available
- Track token usage

---

## Advantages Over Manual Methods

**vs. html.to.design:**
- ✅ Component-level precision (not full page)
- ✅ Automated Object ID preservation
- ✅ Bidirectional sync
- ✅ Batch operations
- ✅ Freya integration

**vs. Manual Figma Creation:**
- ✅ Faster workflow
- ✅ Maintains code-design sync
- ✅ Automated token extraction
- ✅ Consistent structure
- ✅ Reduced manual work

---

## Windsurf IDE Integration (Official Figma MCP)

### Overview

The official Figma Desktop MCP server provides read-only access to Figma files through Windsurf IDE. This enables AI agents like Freya to directly extract design definitions from Figma without manual copying.

### Prerequisites

- **Figma Account**: Paid account with Dev Mode access
- **Figma Desktop**: Latest version installed
- **Windsurf IDE**: With MCP support enabled

### Configuration

**1. MCP Config File**

Location: `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "Figma Desktop": {
      "serverUrl": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

**Important**: Use `serverUrl` (not `url`) for HTTP-based MCP servers in Windsurf.

**2. Figma Desktop Setup**

1. Open Figma Desktop with your paid account
2. The official Figma MCP server runs automatically on port 3845
3. Open your design file
4. Select the node/frame you want to extract

**3. Windsurf Configuration**

1. Open Windsurf Settings: `Ctrl+,` (or `Cmd+,` on Mac)
2. Navigate to: **Tools → Windsurf Settings → MCP Servers**
3. Click the **refresh button** after modifying `mcp_config.json`
4. Verify "Figma Desktop" appears as **Enabled**

### Available Tools

The Figma Desktop MCP server provides:

- `get_design_context` - Extract full design context including code, styles, and assets
- `get_variable_defs` - Get design variable definitions
- `get_screenshot` - Capture visual screenshot of selected node
- `get_metadata` - Get structural metadata in XML format
- `create_design_system_rules` - Generate design system rules
- `get_figjam` - Extract FigJam board content

### Usage Example

**Extracting Color Definitions:**

1. **In Figma Desktop**: Select the color palette frame
2. **In Windsurf**: Call the MCP tool:

```
mcp1_get_design_context(
  clientLanguages: "markdown",
  clientFrameworks: "unknown",
  nodeId: "",  // Empty for currently selected node
  dirForAssetWrites: "path/to/assets"
)
```

3. **Result**: Receives React/Tailwind code with all color values, which can be parsed and converted to design tokens

**Getting Visual Reference:**

```
mcp1_get_screenshot(
  clientLanguages: "markdown",
  clientFrameworks: "unknown",
  nodeId: ""
)
```

### Real-World Success: Dogweek Design System

**Date**: January 9, 2026

Successfully extracted the Dogweek color system from Figma and integrated into project design system:

- **10 Primary Colors**: Brand colors, semantic colors (success, error, info)
- **7 Gradient Definitions**: For rich visual effects
- **Typography**: Font family specifications (Fredoka, Liberation Sans)

The extracted data was automatically converted from React/Tailwind format to structured markdown documentation in the Dogweek project.

### Troubleshooting

**Issue: "Nothing is selected"**
- **Solution**: Select a node in Figma Desktop before calling MCP tools

**Issue: "Path for asset writes required"**
- **Solution**: Provide `dirForAssetWrites` parameter with absolute path

**Issue: "Failed to initialize server"**
- **Solution**: 
  - Ensure Figma Desktop is running
  - Verify you're logged into a paid account with Dev Mode access
  - Check that port 3845 is not blocked

**Issue: MCP server not appearing in Windsurf**
- **Solution**:
  - Use `serverUrl` instead of `url` in config
  - Click refresh button in MCP settings
  - Restart Windsurf completely

### Benefits for WDS Method

1. **Automated Design Token Extraction**: No manual copying of color codes, spacing values, etc.
2. **Single Source of Truth**: Design definitions come directly from Figma
3. **Version Control**: Changes in Figma can be re-extracted and documented
4. **AI Agent Integration**: Freya can reference actual design system values
5. **Reduced Human Error**: Eliminates transcription mistakes

---

## Resources

**Documentation:**
- MCP Server Integration Guide: `workflows/5-design-system/figma-integration/mcp-server-integration.md`
- Prototype to Figma Workflow: `workflows/5-design-system/figma-integration/prototype-to-figma-workflow.md`

**Configuration:**
- Example config: `.wds/figma-mcp-config.yaml`
- Environment setup: `.env.example`

**Support:**
- Figma API Docs: <https://www.figma.com/developers/api>
- Check MCP server logs for errors
- Contact WDS team for integration issues

---

[← Back to Tools](wds-tools-guide.md)
