# Quality Check & Verification Checklist

**Complete checklist for verifying trigger map documentation quality**

---

## 1. File Structure Check

- [ ] `00-trigger-map.md` exists
- [ ] `01-Business-Goals.md` exists
- [ ] `02-[Primary Persona].md` exists
- [ ] `03-[Secondary Persona].md` exists
- [ ] `04-[Tertiary Persona].md` exists (if applicable)
- [ ] `05-Key-Insights.md` exists
- [ ] `06-Feature-Impact.md` exists (if Feature Impact workshop was completed)
- [ ] All files use consistent naming pattern

---

## 2. Mermaid Diagram Quality

**In `00-trigger-map.md`:**

- [ ] Diagram renders without errors
- [ ] BG0 (PRIMARY GOAL) has gold highlighting (`primaryGoal` class)
- [ ] All nodes have proper padding (`<br/>` at start and end)
- [ ] Emojis present: ✅ for wants, ❌ for fears
- [ ] Exactly 3 drivers per persona
- [ ] Connections flow correctly: BG→PLATFORM→TG→DF
- [ ] Styling section includes all 5 classes (primaryGoal, businessGoal, platform, targetGroup, drivingForces)
- [ ] Font family set to Inter or system-ui

---

## 3. Content Consistency

**Across ALL documents:**

- [ ] PRIMARY GOAL consistently labeled as "THE ENGINE"
- [ ] Transformation journey clearly described
- [ ] Timeline numbers match across documents
- [ ] Target numbers (50 champions, 5000 users, etc.) are consistent
- [ ] Persona names spelled consistently
- [ ] Product name consistent throughout

---

## 4. Language Check

**Verify empowering language:**

- [ ] "Create awesome [users]" NOT "convert users"
- [ ] "Naturally become [champions]" NOT "make them champions"
- [ ] "Community Opportunities" emphasize benefits FOR members
- [ ] No pushy or transactional language
- [ ] Transformation language is positive and organic

---

## 5. Cross-Reference Verification

**Check links in each document:**

**00-trigger-map.md:**
- [ ] Links to 01-Business-Goals.md
- [ ] Links to all persona docs (02, 03, 04...)
- [ ] Links to 05-Key-Insights.md
- [ ] All links use correct file names

**01-Business-Goals.md:**
- [ ] Links back to 00-trigger-map.md
- [ ] Links to all persona docs
- [ ] Links to 05-Key-Insights.md

**Persona documents (02, 03, 04...):**
- [ ] Each links back to 00-trigger-map.md
- [ ] Each links to OTHER persona docs
- [ ] Each links to 05-Key-Insights.md

**05-Key-Insights.md:**
- [ ] Links back to 00-trigger-map.md
- [ ] Links to 01-Business-Goals.md
- [ ] Links to all persona docs

**06-Feature-Impact.md (if exists):**
- [ ] Links back to 00-trigger-map.md
- [ ] Links to 01-Business-Goals.md
- [ ] Links to all persona docs
- [ ] Links to 05-Key-Insights.md

---

## 6. Persona Document Completeness

**For EACH persona document, verify:**

- [ ] Has all 13 sections (header through related docs)
- [ ] Profile summary is compelling (1-2 paragraphs)
- [ ] Background section tells their story
- [ ] Current situation shows challenges
- [ ] Psychological profile reveals motivations
- [ ] **6 driving forces** (3 wants + 3 fears) each with Product Promise/Answer
- [ ] Transformation journey (especially PRIMARY)
- [ ] Strategic triangle diagram present
- [ ] Role clearly explained
- [ ] Impact on business goals shown
- [ ] Related documents footer complete

---

## 7. Hub Document (00) On-Page Content

**Verify hub has on-page summaries for:**

- [ ] Transformation clearly stated
- [ ] Flywheel explained (3 tiers)
- [ ] Business Strategy section with key points
- [ ] Each persona with profile + drivers visible
- [ ] Strategic Implications with key focus areas
- [ ] "How to Read" explanation present
- [ ] Total length ~220-250 lines

---

## 8. Business Goals Document (01) Completeness

- [ ] Vision statement present
- [ ] PRIMARY GOAL clearly marked as THE ENGINE
- [ ] SECONDARY goals grouped and explained
- [ ] TERTIARY goals emphasize member benefits
- [ ] Each objective has: Statement, Metric, Target, Timeline, Impact/Benefit
- [ ] Flywheel section explains priorities
- [ ] Success metrics show persona connections
- [ ] Total length ~150-160 lines

---

## 9. Key Insights Document (05) Completeness

- [ ] Flywheel priorities explained
- [ ] Primary Development Focus lists 5 areas
- [ ] Critical Success Factors (3-5 items)
- [ ] Design Implications by section (5+ sections)
- [ ] Emotional Transformation Goals in first person
- [ ] Design Focus Statement present
- [ ] Development Phases outlined
- [ ] Total length ~145-155 lines

---

## 10. Feature Impact Document (06) Completeness (If Exists)

- [ ] Scoring system clearly explained
- [ ] Primary persona weighted higher (5/3/1 vs 3/1/0)
- [ ] Feature table with scores for all personas
- [ ] Must Have / Consider / Defer categories
- [ ] Strategic rationale explains prioritization
- [ ] Connection to business goals shown
- [ ] Development phases aligned with flywheel
- [ ] Each feature ties to specific persona drivers

---

## 11. Priority Tier Consistency

**Verify throughout all documents:**

- [ ] ⭐ PRIMARY GOAL always uses star emoji + gold in diagram
- [ ] 🚀 SECONDARY uses rocket emoji
- [ ] 🌟 TERTIARY uses sparkle emoji
- [ ] PRIMARY always described as "THE ENGINE"
- [ ] SECONDARY always "driven by" PRIMARY
- [ ] TERTIARY always "benefits FOR members"

---

## 12. Driving Forces Quality

**For each persona's 6 driving forces:**

- [ ] Each want has **[Product] Promise:**
- [ ] Each fear has **[Product] Answer:**
- [ ] Promises/Answers are specific (not generic)
- [ ] They show HOW product addresses the driver
- [ ] Language is empowering and actionable

---

## 13. Formatting Check

- [ ] Markdown renders correctly
- [ ] Headers use proper hierarchy (# ## ###)
- [ ] Code blocks use correct syntax
- [ ] Emojis display properly
- [ ] Lists are formatted consistently
- [ ] Links are properly formatted `[text](file.md)`
- [ ] Horizontal rules (`---`) used appropriately

---

## Error Correction Process

If any checklist item fails:

1. **Identify which document(s) need fixing**
2. **Re-read the specific step instructions**
3. **Make corrections**
4. **Re-verify the corrected sections**

---

_Complete quality checklist for Step 05: Quality Check & Verification_
