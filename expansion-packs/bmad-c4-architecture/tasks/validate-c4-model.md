# Validate C4 Model

## Purpose

Validate C4 model consistency, completeness, and adherence to best practices.

## Prerequisites

- C4 model elements defined
- Relationships mapped
- DSL generated

## Process

### 1. Syntax Validation

- Check DSL syntax correctness
- Validate element definitions
- Verify relationship syntax
- Check view configurations

### 2. Consistency Checks

- Ensure all referenced elements exist
- Validate relationship directions
- Check for circular dependencies
- Verify naming conventions

### 3. Completeness Review

- All key users represented
- All external systems identified
- All major components included
- All critical relationships mapped

### 4. Best Practices Review

- C4 model hierarchy maintained
- Appropriate abstraction levels
- Clear and descriptive names
- Consistent styling

### 5. Generate Validation Report

- List all issues found
- Provide recommendations
- Suggest improvements
- Rate overall quality

## Validation Checklist

- [ ] DSL syntax is valid
- [ ] All elements have proper descriptions
- [ ] All relationships are bidirectional where appropriate
- [ ] No orphaned elements
- [ ] Consistent naming conventions
- [ ] Appropriate technology labels
- [ ] Clear view layouts
- [ ] Proper abstraction levels maintained

## Output

- Validation report with issues and recommendations
- Corrected DSL if issues found
- Quality score and improvement suggestions

## Elicitation Questions

1. What specific validation criteria should be applied?
2. Are there any custom naming conventions to check?
3. What quality thresholds should be used?
4. Are there any specific anti-patterns to avoid?
5. What level of detail is required in the validation report?
