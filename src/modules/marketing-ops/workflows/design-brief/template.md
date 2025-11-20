# Design Brief: {{project_name}}

**Project Type**: {{project_type}}
**Date**: {{date}}
**Prepared by**: {{author}}
**Version**: 1.0

---

## 1. Project Overview

### 1.1 Project Summary

**Project Name**: {{project_name}}
**Project Type**: {{project_type}}
**Campaign**: {{campaign_name}}

**Background**
{{project_background}}

**Business Objectives**
{{#each business_objectives}}
- {{objective}}
{{/each}}

**Success Criteria**
{{#each success_criteria}}
- {{criterion}}
{{/each}}

### 1.2 Timeline & Budget

| Item | Details |
|------|---------|
| **Kickoff Date** | {{kickoff_date}} |
| **Launch Date** | {{launch_date}} |
| **Project Duration** | {{duration}} |
| **Creative Budget** | {{budget}} |
| **Production Resources** | {{resources}} |

---

## 2. Target Audience

### 2.1 Primary Audience

**Demographics**
- Age: {{primary_age}}
- Gender: {{primary_gender}}
- Location: {{primary_location}}
- Income: {{primary_income}}
- Education: {{primary_education}}

**Psychographics**
- Values: {{primary_values}}
- Interests: {{primary_interests}}
- Lifestyle: {{primary_lifestyle}}
- Motivations: {{primary_motivations}}

**Behaviors**
- Online Habits: {{primary_online_habits}}
- Purchase Behavior: {{primary_purchase_behavior}}
- Device Usage: {{primary_device_usage}}
- Content Preferences: {{primary_content_preferences}}

**Pain Points & Needs**
{{#each primary_pain_points}}
- {{pain_point}}
{{/each}}

### 2.2 Secondary Audience(s)

{{#each secondary_audiences}}
#### {{audience_name}}

**Key Characteristics**
{{characteristics}}

**Unique Considerations**
{{considerations}}

---
{{/each}}

### 2.3 Audience Insights

**What Resonates with This Audience**
{{what_resonates}}

**What to Avoid**
{{what_to_avoid}}

**Platform Preferences**
{{platform_preferences}}

---

## 3. Brand Guidelines & Requirements

### 3.1 Visual Identity

**Logo Usage**
{{logo_usage}}

**Color Palette**
| Color | Hex | Usage |
|-------|-----|-------|
{{#each brand_colors}}
| {{color_name}} | {{hex_code}} | {{usage}} |
{{/each}}

**Typography**
- **Headings**: {{heading_font}}
- **Body Text**: {{body_font}}
- **Accents**: {{accent_font}}

**Typography Hierarchy**
{{typography_hierarchy}}

**Imagery Style**
{{imagery_style}}

**Design Principles**
{{#each design_principles}}
- {{principle}}
{{/each}}

### 3.2 Voice & Tone

**Brand Voice**
{{brand_voice}}

**Tone for This Project**
{{project_tone}}

**Messaging Do's and Don'ts**
| Do | Don't |
|----|-------|
{{#each messaging_guidelines}}
| {{do}} | {{dont}} |
{{/each}}

### 3.3 Legal & Regulatory Requirements

{{#each legal_requirements}}
- {{requirement}}
{{/each}}

---

## 4. Creative Objectives & Strategy

### 4.1 Creative Objectives

**Primary Creative Goal**
{{primary_creative_goal}}

**Secondary Goals**
{{#each secondary_creative_goals}}
- {{goal}}
{{/each}}

### 4.2 Messaging Framework

**Primary Message**
{{primary_message}}

**Supporting Messages**
{{#each supporting_messages}}
{{number}}. {{message}}
{{/each}}

**Proof Points**
{{#each proof_points}}
- {{proof_point}}
{{/each}}

**Call-to-Action**
- Primary CTA: {{primary_cta}}
- Secondary CTA: {{secondary_cta}}

### 4.3 Desired Emotional Response

**How Should the Audience Feel?**
{{desired_emotion}}

**What Action Should They Take?**
{{desired_action}}

**Why Should They Care?**
{{value_proposition}}

---

## 5. Deliverables & Technical Specifications

### 5.1 Required Deliverables

{{#each deliverables}}
#### {{deliverable_category}}

| Asset | Dimensions | Format | Color | Resolution | Quantity | Notes |
|-------|------------|--------|-------|------------|----------|-------|
{{#each assets}}
| {{asset_name}} | {{dimensions}} | {{format}} | {{color_mode}} | {{resolution}} | {{quantity}} | {{notes}} |
{{/each}}

---
{{/each}}

### 5.2 Platform-Specific Requirements

{{#each platforms}}
#### {{platform_name}}

**Technical Specs**
{{technical_specs}}

**Platform Limitations**
{{limitations}}

**Best Practices**
{{best_practices}}

**Character/Size Limits**
{{limits}}

---
{{/each}}

### 5.3 File Delivery Requirements

**File Naming Convention**
{{file_naming_convention}}

**Delivery Method**
{{delivery_method}}

**File Organization**
{{file_organization}}

**Source Files**
{{source_file_requirements}}

---

## 6. Creative Direction

### 6.1 Visual Style

**Overall Aesthetic**
{{visual_aesthetic}}

**Mood & Tone**
{{visual_mood}}

**Color Approach**
{{color_approach}}

**Typography Treatment**
{{typography_treatment}}

**Layout Style**
{{layout_style}}

### 6.2 Imagery Direction

**Photography Style**
{{photography_style}}

**Illustration Approach**
{{illustration_approach}}

**Icon Style**
{{icon_style}}

**Image Treatment**
{{image_treatment}}

### 6.3 Design References & Inspiration

**Aspirational Examples**
{{#each aspirational_examples}}
- **{{example_title}}**: {{example_url}}
  - Why: {{why_this_works}}
{{/each}}

**Competitive Examples**
{{#each competitive_examples}}
- **{{competitor_name}}**: {{example_url}}
  - Analysis: {{analysis}}
{{/each}}

**Brand's Successful Work**
{{#each internal_examples}}
- **{{example_title}}**: {{example_url}}
  - Why it worked: {{why_it_worked}}
{{/each}}

### 6.4 What to Avoid

{{#each avoid_list}}
- {{avoid_item}}
{{/each}}

### 6.5 Mandatory Elements

{{#each mandatory_elements}}
- {{element}}: {{requirement}}
{{/each}}

---

## 7. User Experience & Journey

### 7.1 User Journey Context

**Where in the Journey?**
{{journey_stage}}

**Previous Touchpoint**
{{previous_touchpoint}}

**Next Step**
{{next_step}}

**Context of Use**
{{context}}

### 7.2 UX Requirements

**Interaction Requirements**
{{interaction_requirements}}

**Navigation Flow**
{{navigation_flow}}

**Accessibility Requirements**
{{accessibility_requirements}}

**Mobile Considerations**
{{mobile_considerations}}

**Page Load Performance**
- Target Load Time: {{target_load_time}}
- Maximum File Size: {{max_file_size}}
- Optimization Requirements: {{optimization_requirements}}

---

## 8. Project Timeline & Review Process

### 8.1 Project Timeline

| Milestone | Date | Deliverable | Owner |
|-----------|------|-------------|-------|
{{#each timeline_milestones}}
| {{milestone}} | {{date}} | {{deliverable}} | {{owner}} |
{{/each}}

### 8.2 Review & Approval Process

**Review Rounds Included**
{{review_rounds}}

**Stakeholders & Approvers**
{{#each stakeholders}}
- **{{name}}** ({{role}}): {{approval_authority}}
{{/each}}

**Feedback Process**
{{feedback_process}}

**Approval Criteria**
{{approval_criteria}}

**Out-of-Scope Change Process**
{{change_process}}

### 8.3 Communication Plan

**Status Updates**
{{status_update_plan}}

**Meeting Cadence**
{{meeting_cadence}}

**Point of Contact**
- Design Lead: {{design_lead}}
- Project Manager: {{project_manager}}
- Stakeholder: {{stakeholder_contact}}

---

## 9. Testing & Optimization

### 9.1 A/B Testing Plan

**Test Objective**
{{test_objective}}

**Test Variables**
{{#each test_variables}}
- **{{variable}}**: {{variations}}
{{/each}}

**Success Metrics**
{{#each test_metrics}}
- {{metric}}: Target {{target}}
{{/each}}

**Test Setup**
- Sample Size: {{sample_size}}
- Test Duration: {{test_duration}}
- Statistical Significance: {{significance_threshold}}

### 9.2 Quality Assurance Checklist

**Technical QA**
- [ ] Mobile responsiveness across devices
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Page load performance meets targets
- [ ] All links and interactions functional
- [ ] Form validation working correctly

**Brand QA**
- [ ] Brand guidelines followed
- [ ] Messaging approved and accurate
- [ ] Legal disclaimers included where required
- [ ] Trademark usage correct

**Accessibility QA**
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Alt text for all images

**Performance QA**
- [ ] Conversion tracking implemented
- [ ] Analytics tags in place
- [ ] UTM parameters correct
- [ ] A/B test setup validated

### 9.3 Success Metrics

**Primary Success Metrics**
{{#each primary_metrics}}
- **{{metric}}**: Baseline {{baseline}}, Target {{target}}
{{/each}}

**Secondary Success Metrics**
{{#each secondary_metrics}}
- **{{metric}}**: Baseline {{baseline}}, Target {{target}}
{{/each}}

**Measurement Plan**
{{measurement_plan}}

---

## 10. Assets & Resources

### 10.1 Provided Assets

{{#each provided_assets}}
- **{{asset_type}}**: {{asset_location}}
{{/each}}

### 10.2 Brand Resources

- Brand Guidelines: {{brand_guidelines_url}}
- Logo Files: {{logo_files_location}}
- Image Library: {{image_library_url}}
- Font Files: {{font_files_location}}

### 10.3 Reference Materials

{{#each reference_materials}}
- **{{material_type}}**: {{material_location}}
{{/each}}

---

## 11. Budget & Resources

### 11.1 Budget Breakdown

| Item | Cost | Notes |
|------|------|-------|
{{#each budget_items}}
| {{item}} | {{cost}} | {{notes}} |
{{/each}}
| **Total** | **{{total_budget}}** | |

### 11.2 Resource Allocation

**Internal Team**
{{#each internal_team}}
- {{role}}: {{name}} ({{allocation}})
{{/each}}

**External Partners**
{{#each external_partners}}
- {{partner}}: {{scope}}
{{/each}}

---

## Appendices

### A. Detailed User Personas
{{user_personas}}

### B. Competitive Analysis
{{competitive_analysis}}

### C. Performance Benchmarks
{{performance_benchmarks}}

### D. Additional References
{{additional_references}}

---

**Brief Status**: {{brief_status}}
**Approval Date**: {{approval_date}}
**Approved By**: {{approved_by}}

**Questions or Clarifications**: {{contact_for_questions}}
