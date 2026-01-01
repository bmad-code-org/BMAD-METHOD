# {page-number}-{page-name}

**Scenario:** {scenario-name}  
**Page Number:** {page-number}  
**Created:** {date}  
**Method:** Whiteport Design Studio (WDS)

---

## Overview

**Page Purpose:** {What job must this page accomplish?}

**Success Criteria:** {How will we know the page succeeded?}

**VTC Reference:** {Link to or brief description of Value Trigger Chain for this page}

**URL/Route:** {url-path}

**Entry Points:**

- {How users arrive at this page}

**Exit Points:**

- {Where users go after completing their goal}

**Main User Goal:** {Primary objective for users on this page}

---

## Layout Structure

{High-level description of page layout - header, main content areas, footer, etc.}

```
[Optional: ASCII layout diagram]
+------------------+
| Header           |
+------------------+
| Main Content     |
|                  |
+------------------+
| Footer           |
+------------------+
```

---

## Components & Object IDs

### {Component Name 1}

**Object ID:** `{page-section-element}`  
**Component Type:** {button/input/card/etc.}  
{#if design_system_enabled}
**Design System Component:** {component-name}  
**Figma Component:** {figma-component-name}  
**Variant:** {size=large, type=primary, etc.}
{/if}

**Content Purpose:** {What job must this content do? Be specific.}  
**Review Criteria:** {How will we know this content succeeded?}

**States:**

- **Default:** {Description and behavior}
- **Hover:** {Hover state appearance and behavior}
- **Active:** {Active/clicked state}
- **Disabled:** {When and why disabled}
- **Loading:** {Loading state if applicable}
- **Error:** {Error state if applicable}

**Behavior:**
{What happens when user interacts with this component}

**Content:**

- **English:** {Text content in English}
- **{Language2}:** {Text content in second language}
- **{Language3}:** {Text content in third language}

**Content Rationale:** {Why this specific content? How does it achieve its purpose?}

**Validation:** {If applicable - validation rules}

---

{Repeat Component section for each element on the page}

---

## Page States

### Default State

**When:** {When this state is active}  
**Appearance:** {What the user sees}  
**Available Actions:** {What users can do}

### Empty State

**When:** {When this state is active - e.g., no data available}  
**Appearance:** {What the user sees}  
**Message:** {Empty state message in all languages}  
**Available Actions:** {What users can do}

### Loading State

**When:** {When this state is active - e.g., fetching data}  
**Appearance:** {Loading indicators, disabled elements}  
**Message:** {Loading message in all languages}  
**Available Actions:** {What users can do while loading}

### Error State

**When:** {When this state is active}  
**Appearance:** {Error UI elements}  
**Error Messages:** {See Error Messages section}  
**Recovery Actions:** {How user fixes the error}

### Success State

**When:** {When this state is active - after successful action}  
**Appearance:** {Success indicators}  
**Message:** {Success message in all languages}  
**Next Steps:** {Where user goes or what they can do next}

---

## Validation Rules

{If applicable - for forms and inputs}

| Field        | Rule              | Error Code | Error Message   |
| ------------ | ----------------- | ---------- | --------------- |
| {field-name} | {validation-rule} | {ERR_CODE} | {error-message} |

---

## Error Messages

| Error Code | Trigger                  | Message (English) | Message ({Lang2})    | Recovery     |
| ---------- | ------------------------ | ----------------- | -------------------- | ------------ |
| ERR_001    | {When this error occurs} | {English message} | {Translated message} | {How to fix} |

---

## Data Requirements

### Data Sources

| Data Element | Source                   | Type        | Required | Notes   |
| ------------ | ------------------------ | ----------- | -------- | ------- |
| {data-field} | {API endpoint or static} | {data-type} | {yes/no} | {notes} |

### API Endpoints

**{Endpoint Name}**

- **Method:** {GET/POST/PUT/DELETE}
- **Path:** `/api/{path}`
- **Purpose:** {What this endpoint does}
- **Request:** {Request format}
- **Response:** {Response format}
- **Error Codes:** {Possible errors}

---

## Responsive Behavior

### Mobile (< 768px)

{Describe layout changes, hidden elements, mobile-specific interactions}

### Tablet (768px - 1024px)

{Describe layout changes for tablet}

### Desktop (> 1024px)

{Describe full desktop layout}

---

## Interactions & Navigation

### On Page Load

1. {Action sequence when page loads}
2. {Data fetching}
3. {State initialization}

### User Interactions

**{Interaction Name}**

1. User {action}
2. System {response}
3. Page {state change}
4. User sees {result}

---

## Accessibility

- **Keyboard Navigation:** {Tab order, shortcuts}
- **Screen Readers:** {ARIA labels, descriptions}
- **Focus Management:** {Focus behavior}
- **Color Contrast:** {WCAG compliance notes}

---

## Technical Notes

{Any technical constraints, performance requirements, browser compatibility notes, etc.}

---

## Design References

**Sketches:** {Link to sketch files in Sketches/ folder}  
**Prototype:** {Link to HTML prototype in Prototype/ folder}  
**VTC Reference:** {Which VTC(s) does this page serve? Link to VTC documents}  
**Trigger Map Reference:** {Which personas/drivers this page addresses}  
**Content Strategy:** {Link to content creation workshop outputs or content purpose definitions}

---

## Content Purpose Summary

**Key Content Blocks:**

| Object ID | Purpose | Review Criteria |
|-----------|---------|-----------------|
| {object-id-1} | {What this content must do} | {Success measure} |
| {object-id-2} | {What this content must do} | {Success measure} |
| {object-id-3} | {What this content must do} | {Success measure} |

**Overall Content Strategy:**
{Brief explanation of how content on this page works together to achieve page purpose}

---

## Development Checklist

Before implementing:

- [ ] Page purpose is clear and testable
- [ ] VTC reference documented
- [ ] All Object IDs assigned and documented
- [ ] Content purposes defined for key elements
- [ ] Content achieves stated purposes (reviewed)
- [ ] All states defined and specified
- [ ] Validation rules clear
- [ ] Error messages in all languages
- [ ] API endpoints defined
- [ ] Responsive behavior specified
- [ ] Accessibility requirements noted
- [ ] Prototype validated

---

_Created using Whiteport Design Studio (WDS) methodology_
