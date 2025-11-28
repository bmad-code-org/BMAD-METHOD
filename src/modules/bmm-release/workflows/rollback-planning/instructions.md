# Rollback Planning Instructions

## Objective
Create a comprehensive rollback plan for a release, ensuring quick recovery if deployment issues occur.

## Prerequisites
- Release candidate or deployed release identified
- Previous stable version available
- Understanding of data migration impacts

---

<step n="1" goal="Identify rollback context">

### Identify Release and Target

<action>Load release history from state</action>

<ask>What is the context for this rollback plan?
[p] Pre-deployment - Planning ahead for new release
[a] Active issue - Need to rollback now
[r] Review - Updating existing rollback plan

Context: </ask>

<action>Store as {{rollback_context}}</action>

<check if="context == 'a'">
**URGENT MODE ACTIVATED**
<action>Load current deployed version</action>
<action>Identify last known good version</action>
<action>Skip optional steps, focus on execution</action>
</check>

</step>

---

<step n="2" goal="Select versions">

### Version Selection

**Current Version:** {{current_version}}

**Available Rollback Targets:**

| Version | Deployed | Status | Age |
|---------|----------|--------|-----|
{{#each available_versions}}
| {{version}} | {{deployed_date}} | {{status}} | {{age}} |
{{/each}}

<ask>Which version should we rollback to?
(Enter version number or select from list): </ask>

<action>Store as {{target_version}}</action>
<action>Validate target version exists and is stable</action>

**Rollback Path:** {{current_version}} → {{target_version}}

</step>

---

<step n="3" goal="Analyze rollback impact">

### Impact Analysis

<action>Load changes between versions</action>
<action>Identify database migrations</action>
<action>Check for breaking changes</action>

**Changes to Revert:**
- Stories: {{stories_between_versions.length}}
- Database migrations: {{migrations.length}}
- API changes: {{api_changes.length}}
- Configuration changes: {{config_changes.length}}

{{#if migrations.length}}
**Database Migrations:**
| Migration | Type | Reversible |
|-----------|------|------------|
{{#each migrations}}
| {{name}} | {{type}} | {{reversible ? 'Yes' : 'NO'}} |
{{/each}}

<check if="any migration not reversible">
**WARNING:** Some migrations are not reversible. Manual intervention required.
</check>
{{/if}}

{{#if breaking_changes}}
**Breaking Changes to Consider:**
{{#each breaking_changes}}
- {{description}}
{{/each}}
{{/if}}

</step>

---

<step n="4" goal="Define rollback steps">

### Rollback Procedure

<action>Generate rollback steps based on deployment type</action>

**Pre-Rollback Checklist:**
- [ ] Notify stakeholders of planned rollback
- [ ] Ensure target version artifacts are available
- [ ] Verify database backup exists
- [ ] Confirm rollback team is available
- [ ] Document current error/issue being resolved

**Rollback Steps:**

1. **Announce Maintenance**
   - Notify users of planned maintenance
   - Enable maintenance mode if available

2. **Stop Traffic**
   - Route traffic away from affected services
   - Drain existing connections

3. **Database Rollback** {{#if migrations.length}}(if needed){{/if}}
{{#each migrations_to_revert}}
   - Revert: {{name}}
     ```sql
     {{down_script}}
     ```
{{/each}}

4. **Deploy Previous Version**
   - Target version: {{target_version}}
   - Deployment command: `{{deploy_command}}`

5. **Verify Deployment**
   - Run health checks
   - Verify critical endpoints
   - Check error rates

6. **Restore Traffic**
   - Re-enable traffic routing
   - Monitor for issues

7. **Post-Rollback**
   - Disable maintenance mode
   - Notify stakeholders
   - Document rollback reason

</step>

---

<step n="5" goal="Define verification steps">

### Verification Checklist

<ask>What are the critical checks after rollback?
(Enter comma-separated or press Enter for defaults): </ask>

**Health Checks:**
- [ ] Service responds to health endpoint
- [ ] Database connectivity verified
- [ ] Cache connectivity verified
- [ ] External service integrations working

**Functional Checks:**
- [ ] User authentication works
- [ ] Core workflows functional
- [ ] Critical API endpoints responding
- [ ] No elevated error rates

**Performance Checks:**
- [ ] Response times within SLA
- [ ] No memory leaks
- [ ] CPU utilization normal

</step>

---

<step n="6" goal="Define escalation path">

### Escalation Procedures

<ask>Define escalation contacts for rollback issues:

Level 1 (On-call):
Level 2 (Engineering Lead):
Level 3 (VP/Director):

Enter contacts: </ask>

**Escalation Matrix:**

| Issue | Contact | Response Time |
|-------|---------|---------------|
| Rollback fails | {{level_1}} | Immediate |
| Data inconsistency | {{level_2}} | 15 minutes |
| Extended outage | {{level_3}} | 30 minutes |

</step>

---

<step n="7" goal="Generate rollback document">

### Generate Rollback Plan

<template-output section="rollback-plan">
# Rollback Plan: {{current_version}} → {{target_version}}

**Created:** {{date}}
**Context:** {{rollback_context}}
**Estimated Duration:** {{estimated_duration}}

## Summary
- Current Version: {{current_version}}
- Target Version: {{target_version}}
- Stories Affected: {{stories_between_versions.length}}
- Database Changes: {{migrations.length}}

## Pre-Rollback Checklist
{{pre_rollback_checklist}}

## Rollback Steps
{{rollback_steps}}

## Verification Checklist
{{verification_checklist}}

## Escalation Contacts
{{escalation_matrix}}

## Rollback Command
```bash
{{rollback_command}}
```

---
*Plan generated by BMAD Release Manager*
</template-output>

</step>

---

<step n="8" goal="Save rollback plan">

### Save Plan

<action>Save rollback plan to output file</action>
<action>Link plan to release candidate</action>
<action>Update state with rollback plan reference</action>

**Plan Saved:** {{output_file_path}}

</step>

---

## Completion

Rollback plan created for **{{current_version}} → {{target_version}}**.

**Summary:**
- Estimated Duration: {{estimated_duration}}
- Database Migrations: {{migrations.length}}
- Manual Steps Required: {{manual_steps_count}}

**Plan Location:** {{output_file_path}}

<check if="context == 'a'">
## EXECUTE ROLLBACK NOW?

<ask>Ready to execute rollback?
[y] Yes - execute rollback procedure
[n] No - save plan for later

Choice: </ask>

<check if="choice == 'y'">
<action>Execute rollback procedure</action>
<publish event="release.rollback.initiated">
  <payload>
    <release_id>{{release_id}}</release_id>
    <from_version>{{current_version}}</from_version>
    <to_version>{{target_version}}</to_version>
    <environment>{{environment}}</environment>
    <initiated_by>{{user_name}}</initiated_by>
    <reason>{{rollback_reason}}</reason>
    <timestamp>{{current_timestamp}}</timestamp>
  </payload>
</publish>
</check>
</check>
