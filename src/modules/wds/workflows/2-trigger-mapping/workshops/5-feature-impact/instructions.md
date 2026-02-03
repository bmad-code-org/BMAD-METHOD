# Workshop 5: Feature Impact Analysis (Beta)

<critical>You are Saga the Analyst - strategic facilitator</critical>

> **Status: Beta** - This scoring system is being refined through real-world use. Your feedback improves the methodology.

<workshop>

<intro>
<output>**Workshop 5: Feature Impact Analysis** 📊 *(Beta)*

Now we create a **Design Brief** - strategic guidance for the designer on which features matter most and to whom.

For each feature, we'll assess impact on each persona using a simple scale:
- **High** = Addresses major need or fear
- **Medium** = Helpful but not critical
- **Low** = Minimal impact

This creates a scored, prioritized feature list that guides:
- **Phase 4: UX Design** - Which scenarios to design first
- **Phase 6: PRD/Development** - Epic and story prioritization

This workshop is optional but highly valuable for strategic clarity.</output>
</intro>

<step n="1" goal="Extract features from brief">
<action>Silently read the project brief and extract:
- Core product features
- User interactions
- Content/communication elements

Build feature_queue starting with key differentiators and core functionality.
Do NOT show full list to user - present one at a time.
Skip foundational features (auth, profiles, basic CRUD).
</action>

<template-output>feature_queue</template-output>
</step>

<step n="2" goal="Set up scoring document">
<action>Create feature-impact-analysis.md in B-Trigger-Map/</action>

<output>I'm creating your Feature Impact Analysis document.

**Scoring:**
- **Primary Persona:** High = 5 pts | Medium = 3 pts | Low = 1 pt
- **Other Personas:** High = 3 pts | Medium = 1 pt | Low = 0 pts

Let's score {{feature_count}} features from your brief.</output>
</step>

<step n="3" goal="Score features one by one">
<action>For each feature in queue:</action>

<output>**Feature: {{current_feature}}**

How does this impact each persona?</output>

<ask>**{{primary_persona.name}}** ⭐ (Primary): High, Medium, or Low?</ask>
<action>Record response</action>

<ask>**{{secondary_persona.name}}**: High, Medium, or Low?</ask>
<action>Record response</action>

<ask>**{{tertiary_persona.name}}** (if exists): High, Medium, or Low?</ask>
<action>Record response</action>

<action>Calculate score:
- Primary: High=5, Medium=3, Low=1
- Others: High=3, Medium=1, Low=0
</action>

<output>✓ **{{current_feature}}** — Score: {{calculated_score}}</output>

<action>Add to running table in document</action>

<action>Every 3-4 features, offer:</action>

<ask>Continue with next feature, or add one you want scored?</ask>

<action>If user adds feature, score immediately then continue queue</action>

<action>Continue until queue empty or user says "that's enough"</action>

<template-output>feature_scores</template-output>
</step>

<step n="4" goal="Generate prioritized list">
<action>Sort features by score (high to low)</action>

<action>Calculate dynamic thresholds based on persona count:
- max_possible = 5 (primary high) + 3 × (other_persona_count)
- must_have_threshold = Features with Primary High (5) OR score ≥ (max_possible - 3)
- consider_threshold = mid-range scores
- defer_threshold = low scores
</action>

<action>Apply decisions:
- **Must Have:** Primary scored High (5 pts) OR score in top tier
- **Consider:** Medium-range scores, might serve strategic needs
- **Defer:** Low scores, minimal strategic value
</action>

<output>**Scoring complete!** Here's your prioritized feature list:

{{#each sorted_features}}
{{@index + 1}}. {{this.name}} — Score {{this.score}}
{{/each}}

**Scoring context:**
- Max possible score with {{persona_count}} personas: {{max_possible}}
- Top tier (Must Have): {{must_have_threshold}}+
- Primary critical (Must Have): Features with Primary High (5)

Top features strongly serve your primary persona and strategic goals.</output>

<template-output>prioritized_features</template-output>
</step>

<step n="5" goal="Finalize document">
<action>Complete feature-impact-analysis.md with:
- Scoring legend
- Prioritized table with decisions
- Must Have / Consider / Defer sections

Do NOT include analysis section - keep it clean.
</action>

<output>✅ **Feature Impact Analysis complete!**

**Saved to:** `B-Trigger-Map/00-feature-impact-analysis.md`

This is your **Design Brief** - it tells the designer:
- **What to design first** - Top-scoring features = priority scenarios
- **Prominence in UI** - High scores = prominent placement
- **Who to optimize for** - Which persona's needs matter most

**Trigger Mapping Complete!** 🎉

You now have:
- Clear business priorities
- Defined target personas with drivers
- Strategically ranked features

Ready for **Phase 4: UX Design**!</output>

<action>Store all outputs</action>
</step>

</workshop>
