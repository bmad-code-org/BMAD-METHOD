# Platform Architecture

**Project:** {{project_name}}  
**Date:** {{date}}  
**Phase:** 3 - PRD Platform (Technical Foundation)

---

## Technology Stack

### Backend

- **Framework/Language:** {{backend_framework}}
- **Runtime:** {{backend_runtime}}
- **Rationale:** {{backend_rationale}}

### Frontend

- **Framework:** {{frontend_framework}}
- **UI Library:** {{ui_library}}
- **Rationale:** {{frontend_rationale}}

### Database

- **Primary Database:** {{primary_database}}
- **Type:** {{database_type}}
- **Rationale:** {{database_rationale}}

{{#if secondary_database}}

- **Secondary Database:** {{secondary_database}}
- **Purpose:** {{secondary_purpose}}
  {{/if}}

---

## Architecture Style

**Approach:** {{architecture_style}}

{{#if architecture_style == "Monolith"}}

- Single codebase deployment
- Simplified development and deployment
- {{monolith_rationale}}
  {{/if}}

{{#if architecture_style == "Microservices"}}

- Service boundaries: {{service_boundaries}}
- Communication: {{service_communication}}
- {{microservices_rationale}}
  {{/if}}

{{#if architecture_style == "Serverless"}}

- Functions: {{serverless_functions}}
- Triggers: {{serverless_triggers}}
- {{serverless_rationale}}
  {{/if}}

---

## Infrastructure & Hosting

### Platform

- **Cloud Provider:** {{cloud_provider}}
- **Hosting Type:** {{hosting_type}}
- **Rationale:** {{infrastructure_rationale}}

### Services

{{#each infrastructure_services}}

- **{{this.name}}:** {{this.description}}
  {{/each}}

---

## Data Model

### Core Entities

{{#each core_entities}}

#### {{this.name}}

**Purpose:** {{this.purpose}}

**Key Fields:**
{{#each this.fields}}

- `{{this.name}}` ({{this.type}}) - {{this.description}}
  {{/each}}

**Relationships:**
{{#each this.relationships}}

- {{this.type}} {{this.target}} - {{this.description}}
  {{/each}}

{{/each}}

### Entity Relationship Diagram

```
{{entity_diagram}}
```

---

## Performance Requirements

- **Response Time:** {{response_time_target}}
- **Concurrent Users:** {{concurrent_users_target}}
- **Availability:** {{availability_target}}
- **Data Volume:** {{data_volume_estimate}}

---

## Scalability Strategy

{{scalability_strategy}}

---

## Development Environment

- **Version Control:** {{version_control}}
- **CI/CD:** {{cicd_platform}}
- **Testing Strategy:** {{testing_strategy}}
- **Local Development:** {{local_dev_setup}}

---

## Technical Constraints

{{#each technical_constraints}}

- **{{this.area}}:** {{this.constraint}}
  {{/each}}

---

## Cost Estimates

### Monthly Operating Costs (Estimated)

{{#each cost_estimates}}

- **{{this.service}}:** {{this.cost}} {{this.currency}}
  {{/each}}

**Total Estimated:** {{total_monthly_cost}} {{currency}}/month

---

_Phase 3 artifact for {{project_name}}_
