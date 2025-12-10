# Technical Constraints Document

**Project:** {{project_name}}  
**Date:** {{date}}  
**Audience:** UX Design Team  
**Phase:** 3 → 4 Handoff

---

## Purpose

This document summarizes technical decisions and constraints that inform UX design work. It answers: "What do designers need to know about what's technically possible, expensive, or constrained?"

---

## ✅ What's Possible

### Validated Features

{{#each validated_features}}

#### {{this.feature_name}}

**Status:** {{this.status}}  
**What Works:** {{this.what_works}}  
**Design Implications:** {{this.design_implications}}

{{/each}}

### Platform Capabilities

{{#each platform_capabilities}}

- **{{this.capability}}:** {{this.description}}
  {{/each}}

---

## ⚠️ What Has Limitations

### Technical Limitations

{{#each limitations}}

#### {{this.area}}

**Constraint:** {{this.constraint}}  
**Why It Matters:** {{this.impact}}  
**Design Guidance:** {{this.design_guidance}}

{{/each}}

### External API Constraints

{{#each api_constraints}}

- **{{this.service}}:** {{this.constraint}} - {{this.design_impact}}
  {{/each}}

---

## ⏱️ What Affects Timing

### Performance Characteristics

{{#each performance_characteristics}}

#### {{this.operation}}

- **Expected Time:** {{this.time}}
- **Design Need:** {{this.design_need}}
- **UX Pattern:** {{this.ux_pattern}}

{{/each}}

### Connection Requirements

{{#each connection_requirements}}

- **{{this.feature}}:** {{this.requirement}} - {{this.design_impact}}
  {{/each}}

---

## 💰 What's Expensive

### Cost-Sensitive Features

{{#each expensive_features}}

#### {{this.feature}}

**Cost Driver:** {{this.cost_driver}}  
**Per-Use Cost:** {{this.per_use_cost}}  
**Design Guidance:** {{this.design_guidance}}

{{/each}}

---

## 🌐 Platform Compatibility

### Browser Support

{{browser_support}}

### Device Support

{{device_support}}

### Accessibility

{{accessibility_considerations}}

---

## 🔒 Security Constraints

### Authentication

{{authentication_constraints}}

### Data Handling

{{data_handling_constraints}}

### Compliance

{{compliance_constraints}}

---

## 📱 Offline Behavior

{{#if offline_support}}

### What Works Offline

{{offline_capabilities}}

### What Requires Connection

{{online_requirements}}

### Sync Strategy

{{sync_strategy}}
{{else}}
**Offline Mode:** Not supported - All features require active connection
{{/if}}

---

## 🎯 Design Recommendations

Based on technical validation:

{{#each design_recommendations}}

### {{this.category}}

{{this.recommendation}}

**Rationale:** {{this.rationale}}

{{/each}}

---

## ❓ Questions for Design Team

{{#if open_questions}}
{{#each open_questions}}

- {{this}}
  {{/each}}
  {{else}}
  No open questions at this time.
  {{/if}}

---

## Next Steps

- **For UX Design (Phase 4):** Use this document to inform design decisions
- **For Development:** Technical specs are in other Phase 3 documents
- **Updates:** This document will be updated if new constraints emerge during design

---

_Phase 3 → 4 Handoff Document for {{project_name}}_
