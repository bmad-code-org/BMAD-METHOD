# Step 1: Connection Check & Installation

**Progress: Phase 1 of 6** - Next: Identify Export Scenario

**Duration:** 5-10 minutes (if setup needed)

---

## YOUR TASK

Verify html.to.design MCP server connection and guide user through setup if needed.

---

## GOAL

Ensure the export tool is available before proceeding with the workflow.

---

## EXECUTION

### Check MCP Tool Availability

<action>
Check if `mcp2_import-html` tool is accessible in current session.
Tool should be from "html.to.design MCP server"
</action>

**Decision Point:**
- ✅ Tool available → **Skip to Step 2**
- ❌ Tool not available → **Continue with substeps**

---

## IF TOOL NOT AVAILABLE

<output>⚠️ Code to Figma Setup Required

The html.to.design MCP server is not currently connected. To send code to Figma, we need to set up the integration.

This requires:
1. Figma account with project access
2. html.to.design plugin installed in Figma
3. MCP server configured in your IDE

Would you like me to guide you through the setup process?</output>

<ask>Proceed with setup? [Yes/No]:</ask>

**If Yes:** Execute substeps in order  
**If No:** Stop workflow, suggest alternative

---

## SUBSTEPS (Execute if setup needed)

**→ [Substep 1.1: Guide Plugin Installation](./step-01-substeps/substep-01-plugin-installation.md)**

After all substeps complete, return here to verify connection.

---

## VERIFICATION

Once setup complete (or if tool was already available):

<action>
Execute test export:
```javascript
mcp2_import-html({
  name: "Connection Test",
  html: "<div style='padding: 20px; background: #f0f0f0; border-radius: 8px; font-family: sans-serif;'>✅ Connection Test Successful</div>"
})
```
</action>

**Expected Response:**
```json
{
  "node": {
    "id": "X:XXX",
    "name": "Connection Test by html.to.design...",
    "type": "SECTION"
  }
}
```

<ask>Can you see the "Connection Test" layer in your Figma file? [Yes/No]:</ask>

**If Yes:** ✅ Connection verified!  
**If No:** Execute troubleshooting substeps

---

## NEXT STEP

Once connection verified:

**→ Proceed to [Step 2: Identify Export Scenario](./step-02-identify-scenario.md)**

---

## OUTPUT AT THIS POINT

You now have:
- ✅ html.to.design MCP server connected
- ✅ Connection verified with test export

Still need:
- ⏸️ Export scenario identified
- ⏸️ Specifications located/created
- ⏸️ HTML generated and validated
- ⏸️ Final export executed

---

*Step 1 complete - Ready to export*
