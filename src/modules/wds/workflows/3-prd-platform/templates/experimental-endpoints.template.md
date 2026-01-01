# Experimental Endpoints

**Project:** {{project_name}}  
**Date:** {{date}}  
**Phase:** 3 - PRD Platform (Technical Foundation)

---

## Purpose

These are early API specifications for endpoints we know we'll need. Setting them up now enables:

- Early backend development (parallel with UX design)
- Validation that our data model works
- Fail-fast discovery of integration issues

---

## Endpoint Status Key

- **📝 Stub:** Specification only, not implemented
- **🚧 In Progress:** Currently being built
- **✅ Working:** Implemented and tested
- **❌ Blocked:** Waiting on dependency or decision

---

## Authentication Endpoints

{{#each auth_endpoints}}

### {{this.method}} {{this.path}}

**Status:** {{this.status}}  
**Purpose:** {{this.purpose}}

**Request:**

```json
{{this.request_example}}
```

**Response:**

```json
{{this.response_example}}
```

**Notes:** {{this.notes}}

---

{{/each}}

## Core CRUD Operations

{{#each crud_endpoints}}

### {{this.method}} {{this.path}}

**Status:** {{this.status}}  
**Purpose:** {{this.purpose}}  
**Entity:** {{this.entity}}

**Request:**

```json
{{this.request_example}}
```

**Response:**

```json
{{this.response_example}}
```

**Dependencies:** {{this.dependencies}}  
**Notes:** {{this.notes}}

---

{{/each}}

## External Integration Endpoints

{{#each integration_endpoints}}

### {{this.method}} {{this.path}}

**Status:** {{this.status}}  
**Purpose:** {{this.purpose}}  
**External Service:** {{this.external_service}}

**Request:**

```json
{{this.request_example}}
```

**Response:**

```json
{{this.response_example}}
```

**Validates:**

- {{#each this.validates}}
- {{this}}
  {{/each}}

**Cost per Call:** {{this.cost_per_call}}  
**Rate Limits:** {{this.rate_limits}}  
**Notes:** {{this.notes}}

---

{{/each}}

## Business Logic Endpoints

{{#each logic_endpoints}}

### {{this.method}} {{this.path}}

**Status:** {{this.status}}  
**Purpose:** {{this.purpose}}

**Request:**

```json
{{this.request_example}}
```

**Response:**

```json
{{this.response_example}}
```

**Business Rules:**
{{#each this.business_rules}}

- {{this}}
  {{/each}}

**Notes:** {{this.notes}}

---

{{/each}}

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {},
    "timestamp": "ISO8601 timestamp"
  }
}
```

### Common Error Codes

{{#each error_codes}}

- **{{this.code}}** ({{this.http_status}}): {{this.description}}
  {{/each}}

---

## API Conventions

### Base URL

```
{{api_base_url}}
```

### Authentication

{{api_authentication_method}}

### Request Headers

```
{{api_request_headers}}
```

### Response Format

{{api_response_format}}

---

## Development Tasks

These endpoints are also tracked in `E-PRD-Finalization/` as handoff tasks:

{{#each development_tasks}}

- [ ] **{{this.endpoint}}** - {{this.description}} (Priority: {{this.priority}})
      {{/each}}

---

## Next Steps

1. **Backend Team:** Implement stubs for all endpoints
2. **Frontend/Design:** Reference these specs when designing UI
3. **Integration Testing:** Validate external service connections
4. **Update Status:** Mark endpoints as ✅ Working when complete

---

_Phase 3 artifact for {{project_name}}_
