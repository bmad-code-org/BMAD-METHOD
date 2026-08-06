# Evidence

Where guide content comes from, how it is verified, and how the run is recorded. Verification establishes that a claim is true; a claim is useful only if one of the guide's sections needs it. A verified fact no section needs is rejected, with the reason in the ledger.

## Sources

Sources 1–5 are scanner work; source 6 is the interview. Later sources hold what earlier ones cannot.

1. **Existing recorded instructions and lessons** — root and nested `AGENTS.md`, `CLAUDE.md`, editor rule files, and lessons written anywhere nearby (notes files, warnings in READMEs). What agents are told today: the baseline, plus conflicts and stale claims to fix. Recorded lessons are standing maintainer testimony — kept by default, challenged only with evidence that a referent is gone or wrong.
2. **Executable configuration and CI** — manifests, lockfiles, workflow files, hooks, Makefiles, linter configs. Most of Commands, Verification, and Policy comes from here, verified by execution.
3. **Tracked source** — boundaries (vendored, generated, frozen), conventions that differ from defaults, entry points. Scanned to answer the section plan's questions, never for novelty: an interesting fact no agent needs is noise, and a trap-looking fact is at most an interview question, never a pitfall line.
4. **Git history** — targeted, never wholesale: when the current state contains a surprising constraint, find the change that introduced it and any reverted attempts to remove it, then check the reason still holds today. Commit messages are past intent, not current truth.
5. **Agent session logs and review corrections** — when available or pointed at: the only source of *observed* agent mistakes. Extract structure, never transcripts: task, mistake, correction, consequence, occurrence count, source sessions. One occurrence is a candidate; recurrence makes a pitfall line. Ignore one-off noise (tool outages, typos); route mechanically preventable mistakes to a proposed hook, lint, or CI check instead of prose.
6. **The human** — org requirements, domain concepts, frozen areas, intent, priorities, and mistakes they've watched agents make. No scan substitutes.

Documents the user names from outside the repo (org handbooks, wikis, prior architecture docs, MCP knowledgebases) are treated like source 3: scanned for candidates, untrusted until verified against the repo or confirmed by the user.

## Scan scope — binding on every scanner

Scanners read tracked files (`git ls-files`). Dependency, vendored, generated, build-output, and cache directories are out unless a specific claim requires looking inside one, and then the scanner states why. Scanners return candidates with evidence; they never decide what gets written.

## The ledger

`{output_folder}/project-context-ledger.md` — one plain markdown file, this skill's memory across runs. One block per candidate:

```markdown
## <short claim>
- sources: <paths / URLs / session refs>
- section: <target section, or none>
- changes: <what an agent does wrong without it>
- verification: executed | path-checked | user-confirmed | unverified
- disposition: guide | scoped:<path> | rejected — <reason> | pending
```

Interview answers, rejections with reasons, conflicts found in other instruction files, and auto-mode assumptions are all written here the moment they happen. Refresh and audit read the ledger first and don't revisit a recorded disposition unless its evidence changed. Agents never load the ledger; nothing in it counts against the guide's budget.

## Interview rules

- **Never ask what a scan could answer.** A claim verified by execution or path-check proceeds as verified; asking the user to confirm it is a defect.
- **Ask recall questions, never review lists.** "What do agents keep getting wrong?" works because the maintainer's memory has already selected what mattered. Never hand the human a selection problem a scan created.
- A mistake this session itself made and caught while reading or verifying the repo is an observed agent failure (sample of one) — worth offering as a question.
- Ask in batches of at most eight questions; fewer is better. Prefer open questions ("what do agents keep getting wrong here?") over confirmations.
- An unverifiable claim from docs or an outside document is asked as "the docs say X — still true?", never stated as fact.
- When the repo contradicts the user's own testimony, show the evidence and ask — never write the claim as given, never drop it silently. Either the claim or the reading of the evidence gets corrected, and the outcome is recorded in the ledger.
- Before writing, one closing question: say in a line what the guide will contain and ask what's missing — a frozen area, an org rule, a recurring mistake. This material is unrecoverable by any later scan.
- A batch that yields nothing new means it is time to write, not to ask more. Off-topic information the user offers is recorded in the ledger, never ignored.
