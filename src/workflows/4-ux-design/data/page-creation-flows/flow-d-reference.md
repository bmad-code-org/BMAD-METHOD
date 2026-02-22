# Flow D: Reference Page

**Activates when:** User has a similar page to reference

---

## Gather Reference

<ask>**Which page is this similar to?**

Provide:
- Page name or URL
- What file path (if internal project)
- Or description of reference page

Reference:</ask>

<action>Store reference_page</action>

---

## Identify Differences

<ask>**What are the KEY DIFFERENCES from the reference?**

What changes from the reference page?

Differences:</ask>

<action>Store differences</action>

---

## Generate Specification

<output>**Creating page based on reference...**</output>

<action>
If internal reference exists:
  1. Copy reference specification structure
  2. Update with differences
  3. Mark sections that need updates
  4. Preserve navigation pattern

If external reference:
  1. Describe reference structure
  2. Note differences
  3. Create conceptual specification
  4. Recommend creating sketch showing changes

Generate specification document
</action>

---

## Completion

<output>✅ **Reference-based page specification created!**

**Based on:** {{reference_page}}

**Key differences noted:** {{differences}}

**Next steps:**
- Review generated specification
- Create sketch showing unique elements
- Run Page Process Workshop to refine

Ready?</output>
