# {{project_name}} - Product Requirements Document

**Author:** {{user_name}}
**Date:** {{date}}
**Version:** 1.0

---

## Executive Summary

{{vision_alignment}}

### What Makes This Special

{{product_differentiator}}

---

## Project Classification

**Technical Type:** {{project_type}}
**Domain:** {{domain_type}}
**Complexity:** {{complexity_level}}

{{project_classification}}

{{#if domain_context_summary}}

### Domain Context

{{domain_context_summary}}
{{/if}}

---

## Success Criteria

{{success_criteria}}

{{#if business_metrics}}

### Business Metrics

{{business_metrics}}
{{/if}}

---

## Product Scope

### MVP - Minimum Viable Product

{{mvp_scope}}

### Growth Features (Post-MVP)

{{growth_features}}

### Vision (Future)

{{vision_features}}

---

{{#if domain_considerations}}

## Domain-Specific Requirements

{{domain_considerations}}

This section shapes all functional and non-functional requirements below.
{{/if}}

---

{{#if innovation_patterns}}

## Innovation & Novel Patterns

{{innovation_patterns}}

### Validation Approach

{{validation_approach}}
{{/if}}

---

{{#if project_type_requirements}}

## {{project_type}} Specific Requirements

{{project_type_requirements}}

{{#if endpoint_specification}}

### API Specification

{{endpoint_specification}}
{{/if}}

{{#if authentication_model}}

### Authentication & Authorization

{{authentication_model}}
{{/if}}

{{#if platform_requirements}}

### Platform Support

{{platform_requirements}}
{{/if}}

{{#if device_features}}

### Device Capabilities

{{device_features}}
{{/if}}

{{#if tenant_model}}

### Multi-Tenancy Architecture

{{tenant_model}}
{{/if}}

{{#if permission_matrix}}

### Permissions & Roles

{{permission_matrix}}
{{/if}}
{{/if}}

---

{{#if ux_principles}}

## User Experience Principles

{{ux_principles}}

### Key Interactions

{{key_interactions}}
{{/if}}

---

## Functional Requirements

{{functional_requirements_complete}}

---

## Non-Functional Requirements

{{#if performance_requirements}}

### Performance

{{performance_requirements}}
{{/if}}

{{#if security_requirements}}

### Security

{{security_requirements}}
{{/if}}

{{#if scalability_requirements}}

### Scalability

{{scalability_requirements}}
{{/if}}

{{#if accessibility_requirements}}

### Accessibility

{{accessibility_requirements}}
{{/if}}

{{#if integration_requirements}}

### Integration

{{integration_requirements}}
{{/if}}

{{#if no_nfrs}}
_No specific non-functional requirements identified for this project type._
{{/if}}

---

_This PRD captures the essence of {{project_name}} - {{product_value_summary}}_

_Created through collaborative discovery between {{user_name}} and AI facilitator._
