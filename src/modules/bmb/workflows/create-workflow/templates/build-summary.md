## Build Summary

### Files Generated

{{#generatedFiles}}

- **{{type}}**: {{path}}
  {{/generatedFiles}}

### Customizations Made

{{#customizations}}

- {{.}}
  {{/customizations}}

### Manual Steps Required

{{#manualSteps}}

- {{.}}
  {{/manualSteps}}

### Build Validation Results

- **Syntax Check**: {{syntaxCheckResult}}
- **Path Validation**: {{pathValidationResult}}
- **Variable Consistency**: {{variableConsistencyResult}}
- **Template Compliance**: {{templateComplianceResult}}

### Next Steps for Testing

1. Run `workflow {{targetModule}}/workflows/{{workflowName}}` to test
2. Verify all steps execute properly
3. Check output generation
4. Validate user interaction points
