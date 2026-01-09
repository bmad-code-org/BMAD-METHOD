# Step 3: Prepare Specifications

**Progress: Step 3 of 5** - Next: Generate & Validate

**Duration:** 5-15 minutes (depending on whether specs exist)

---

## YOUR TASK

Locate existing specifications with OBJECT IDs, or create them if they don't exist.

---

## GOAL

Ensure all components have proper OBJECT IDs from specifications for consistent Figma layer naming.

---

## EXECUTION

### Search for Specification Documents

<action>
Search for specification files that may contain OBJECT IDs:

1. Search in `docs/C-Scenarios/` for scenario specifications
2. Search in `docs/D-Design-System/` for component documentation
3. Use grep_search to find files containing "OBJECT ID"
4. Look for markdown files matching component/page name
</action>

---

### Decision Point: Specifications Found?

**If specifications exist with OBJECT IDs:**

<output>✅ Found specification documents with OBJECT IDs:

{list of files and IDs found}

I'll use these OBJECT IDs for the export.</output>

<action>
Extract OBJECT IDs from specifications:
- Read specification files
- Extract all OBJECT ID field values
- Map to components in code
- Store mapping for HTML generation
</action>

**→ Skip to validation and proceed to Step 4**

---

**If NO specifications exist:**

<output>📝 No specifications found for these components.

To maintain design-code parity and proper naming in Figma, I recommend creating a specification document.

I can:
1. Analyze the code and reverse-engineer specifications
2. Generate OBJECT IDs following project conventions
3. Create a specification document for your review

Would you like me to create specifications for these components?</output>

<ask>Create specifications? [Yes/No]:</ask>

**If Yes:** Execute substeps  
**If No:** Auto-generate temporary IDs (with warning)

---

## SUBSTEPS (Execute if creating specifications)

**→ [Substep 3.1: Analyze Code](./step-03-substeps/substep-01-analyze-code.md)**

After all substeps complete, return here with generated OBJECT IDs.

---

## VALIDATION

<action>
Validate specification coverage:

FOR EACH component in export scope:
  IF component has OBJECT ID:
    ✅ Mark as validated
  ELSE:
    ⚠️ Add to "missing specification" list

Generate coverage report
</action>

<output>📋 Specification Coverage Report:

✅ Components with OBJECT IDs: {count}
  - {list}

⚠️ Components missing OBJECT IDs: {count}
  - {list}

Coverage: {percentage}%</output>

**If 100% coverage:** Proceed to next step  
**If partial coverage:** Offer to create missing specs or auto-generate IDs

---

## NEXT STEP

Once all components have OBJECT IDs:

**→ Proceed to [Step 4: Generate & Validate](./step-04-generate-validate.md)**

---

## OUTPUT AT THIS POINT

You now have:
- ✅ MCP connection verified
- ✅ Export scenario identified
- ✅ OBJECT IDs assigned to all components
- ✅ ID naming pattern established

Still need:
- ⏸️ HTML generated with proper IDs
- ⏸️ Validation completed
- ⏸️ Final export executed

---

*Step 3 complete - Specifications ready*
