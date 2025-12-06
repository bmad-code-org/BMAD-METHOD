## Validation Results

### Overall Status

**Result**: {{validationResult}}
**Date**: {{date}}
**Validator**: {{validator}}

### Validation Categories

#### File Structure

- **Status**: {{fileStructureStatus}}
- **Details**: {{fileStructureDetails}}

#### Configuration

- **Status**: {{configurationStatus}}
- **Details**: {{configurationDetails}}

#### Step Compliance

- **Status**: {{stepComplianceStatus}}
- **Details**: {{stepComplianceDetails}}

#### Cross-File Consistency

- **Status**: {{consistencyStatus}}
- **Details**: {{consistencyDetails}}

#### Best Practices

- **Status**: {{bestPracticesStatus}}
- **Details**: {{bestPracticesDetails}}

### Issues Found

{{#validationIssues}}

- **{{severity}}**: {{description}}
  - **Impact**: {{impact}}
  - **Recommendation**: {{recommendation}}
    {{/validationIssues}}

### Validation Summary

{{validationSummary}}

---

_Validation completed on {{date}}_
