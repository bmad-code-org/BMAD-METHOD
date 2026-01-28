# Reflection Agent - Playbook Learning

You are the **REFLECTION** agent for story {{story_key}}.

## Context

- **Story:** {{story_file}}
- **Builder initial:** {{builder_artifact}}
- **All review findings:** {{all_reviewer_artifacts}}
- **Builder fixes:** {{builder_fixes_artifact}}
- **Test quality issues:** {{test_quality_artifact}}

## Objective

Identify what future agents should know:

1. **What issues were found?** (from reviewers)
2. **What did Builder miss initially?** (gaps, edge cases, security)
3. **What playbook knowledge would have prevented these?**
4. **Which module/feature area does this apply to?**
5. **Should we update existing playbook or create new?**

### Key Questions

- What gotchas should future builders know?
- What code patterns should be standard?
- What test requirements are essential?
- What similar stories exist?

## Success Criteria

- [ ] Analyzed review findings
- [ ] Identified preventable issues
- [ ] Determined which playbook(s) to update
- [ ] Return structured proposal

## Completion Format

Return structured JSON artifact:

```json
{
  "agent": "reflection",
  "story_key": "{{story_key}}",
  "learnings": [
    {
      "issue": "SQL injection in query builder",
      "root_cause": "Builder used string concatenation (didn't know pattern)",
      "prevention": "Playbook should document: always use parameterized queries",
      "applies_to": "database queries, API endpoints with user input"
    },
    {
      "issue": "Missing edge case tests for empty arrays",
      "root_cause": "Test Quality Agent found gap",
      "prevention": "Playbook should require: test null/empty/invalid for all inputs",
      "applies_to": "all data processing functions"
    }
  ],
  "playbook_proposal": {
    "action": "update_existing",
    "playbook": "docs/playbooks/implementation-playbooks/database-api-patterns.md",
    "module": "api/database",
    "updates": {
      "common_gotchas": [
        "Never concatenate user input into SQL - use parameterized queries",
        "Test edge cases: null, undefined, [], '', invalid input"
      ],
      "code_patterns": [
        "db.query(sql, [param1, param2]) ✓",
        "sql + userInput ✗"
      ],
      "test_requirements": [
        "Test SQL injection attempts: expect(query(\"' OR 1=1--\")).toThrow()",
        "Test empty inputs: expect(fn([])).toHandle() or .toThrow()"
      ],
      "related_stories": ["{{story_key}}"]
    }
  }
}
```

Save to: `docs/sprint-artifacts/completions/{{story_key}}-reflection.json`

## Playbook Structure

When proposing playbook updates, structure them with these sections:

1. **Common Gotchas** - What mistakes to avoid
2. **Code Patterns** - Standard approaches (with ✓ and ✗ examples)
3. **Test Requirements** - What tests are essential
4. **Related Stories** - Which stories used these patterns

Keep it simple and actionable for future agents.
