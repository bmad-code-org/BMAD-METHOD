# Step 5: Send to Figma

**Progress: Step 5 of 5** - Final Step

**Duration:** 2-5 minutes

---

## YOUR TASK

Send the code to Figma and verify success.

---

## GOAL

Send the validated HTML to Figma and confirm the layers appear with proper OBJECT ID naming.

---

## EXECUTION

### Prepare Export Parameters

<action>
Prepare MCP tool call parameters:

- name: Descriptive title for Figma layer
  Format: "{Component/Page Name} - {Purpose}"
  Example: "CTA Button States - Design System"

- html: Complete validated HTML from Step 4
  
- intoNodeId: (optional) Only if updating existing Figma layer
</action>

---

### Execute Export

<output>Executing export to Figma...</output>

<action>
Call MCP tool:

```javascript
mcp2_import-html({
  name: "{export-name}",
  html: `{validated-html}`
})
```

Wait for response.
</action>

---

### Verify Export Response

**Expected Response:**
```json
{
  "node": {
    "id": "X:XXX",
    "name": "{export-name} by html.to.design...",
    "type": "SECTION"
  }
}
```

**Success Indicators:**
- ✅ Node ID returned
- ✅ No error message
- ✅ Response contains node object

**Failure Indicators:**
- ❌ Error message in response
- ❌ No node ID
- ❌ Timeout or connection error

---

### Verify in Figma

<ask>Please check your Figma file:

1. Look for a new layer named "{export-name} by html.to.design..."
2. Expand the layer to see the component structure
3. Check that layer names match the OBJECT IDs we defined

Can you see the export in Figma with proper layer names? [Yes/No]:</ask>

**Wait for user confirmation.**

---

### Success Report

**If user confirms success:**

<output>✅ Export Successful!

**Export Details:**
- Name: {export-name}
- Node ID: {node-id}
- Components: {count}
- OBJECT IDs used: {list}

**Layer Names in Figma:**
{list of OBJECT IDs that became layer names}

The export is now available in your Figma file. Layer names match the specification OBJECT IDs for easy identification and traceability.

**Next Steps:**
1. Review the export in Figma
2. Make any visual adjustments needed
3. Use Figma Import workflow to sync changes back to code (if needed)
4. Update design system based on refinements

**Documentation:**
- Specification: {spec-file-path}
- Export manifest: {manifest if created}
- OBJECT IDs: {count} total</output>

---

### Troubleshooting

**If user reports export not visible:**

<output>Troubleshooting export visibility...</output>

<action>
Check common issues:

1. **Figma not open**
   - Ensure Figma is running
   - Ensure html.to.design plugin is active
   - Retry export

2. **Wrong file**
   - Check which Figma file is active
   - Ensure plugin is running in correct file
   - Switch to correct file and retry

3. **Layer hidden or collapsed**
   - Look in layers panel (left sidebar)
   - Expand all groups/sections
   - Search for layer name

4. **Export to different page**
   - Check all pages in Figma file
   - Plugin may have exported to active page
   - Look through all pages

5. **Connection issue**
   - Check MCP server connection
   - Restart plugin
   - Retry export
</action>

<ask>After checking these items, can you see the export? [Yes/Still No]:</ask>

**If still no:** Provide detailed error report and suggest manual verification steps.

---

## COMPLETION

<output>🎉 Code to Figma Workshop Complete!

**Summary:**
- ✅ MCP connection established
- ✅ Export scenario identified: {scenario}
- ✅ Specifications prepared with OBJECT IDs
- ✅ HTML generated and validated
- ✅ Export executed successfully
- ✅ Verified in Figma

**Achievements:**
- {count} components exported
- {count} OBJECT IDs defined
- Design-code parity maintained
- Traceability established

**Files Created/Updated:**
{list of specification files created}

**Figma Output:**
- Layer: {export-name}
- Node ID: {node-id}
- Location: {Figma file name}

Thank you for using the Figma Export workflow! 🎨</output>

---

## NEXT ACTIONS

**Recommended next steps:**

1. **Review in Figma**
   - Check visual accuracy
   - Verify all states/variations
   - Note any design improvements needed

2. **Design Refinement** (if needed)
   - Make visual adjustments in Figma
   - Update colors, spacing, typography
   - Refine component states

3. **Sync Back to Code** (if changes made)
   - Use Figma Import workflow
   - Extract updated design specs
   - Update CSS/components

4. **Update Design System**
   - Document new patterns
   - Add components to library
   - Update design tokens

5. **Share with Team**
   - Present to stakeholders
   - Get design approval
   - Coordinate with developers

---

*Workflow complete - Export successful!*
