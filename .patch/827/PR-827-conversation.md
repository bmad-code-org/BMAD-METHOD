# PR #827 Conversation

**PR URL:** https://github.com/bmad-code-org/BMAD-METHOD/pull/827  
**Fetched:** 2025-10-28

---

## Conversation Thread

**Status:** No comments or review comments on this PR yet.

**Comment Count:** 0  
**Review Comment Count:** 0

---

## PR Description (by @davedittrich)

### What

This pull request simply changes all references to `v5` to instead be `v6`.

### Why

While testing out the `convert-legacy` workflow on the `v6-alpha` branch, I noticed a bunch of `v5` references in files it produced. There is no `v5`, but there _will be_ a `v6`. :)

### How

I used Claude Code to assist finding/changing all references.

### Testing

While trying to follow the steps in the `contributing guidelines` for testing, it looks like a number of the scripts were renamed or refactored and `npm run` does not find them. E.g., there is no `pre-release` script anymore:

```
$ find . -name 'pre-release*'
$ find . -name 'pre-*'
./node_modules/figlet/.husky/pre-commit
./.husky/pre-commit
$ find . -name '*-release'
./node_modules/@semantic-release
```

I think this PR might need to be manually validated, due to changes to processes that have not yet had documentation updates to accompany them. In time... :)

---

## Notes

- PR opened 2025-10-27 at 21:12:15 UTC
- Last updated 2025-10-27 at 21:15:21 UTC (3 minutes after opening)
- No subsequent activity or discussion
- Contributor is external (@davedittrich, not bmad-code-org)
- Contributor is proactive: testing workflows, identifying issues, submitting fixes
- Contributor raised valid concern about testing documentation being out of date

---

**Status:** No conversation to analyze - PR opened without comments
