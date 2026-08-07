# Evidence

Where guide content comes from, how it is verified, and how the run is recorded. Verification establishes that a claim is true; a claim is useful only if one of the guide's sections needs it. A verified fact no section needs is rejected, with the reason in the memlog.

## Sources

Sources 1–5 are scanner work; source 6 is the interview. Later sources hold what earlier ones cannot.

1. **Existing recorded instructions and lessons** — root and nested `AGENTS.md`, `CLAUDE.md`, editor rule files, and lessons written anywhere nearby (notes files, warnings in READMEs). What agents are told today: the baseline, plus conflicts and stale claims to fix. Recorded lessons are standing maintainer testimony — kept by default, challenged only with evidence that a referent is gone or wrong.
2. **Executable configuration and CI** — manifests, lockfiles, workflow files, hooks, Makefiles, linter configs. Most of Commands, Verification, and Policy comes from here, verified by execution.
3. **Tracked source** — boundaries (vendored, generated, frozen), conventions that differ from defaults, entry points. Scanned to answer the section plan's questions, never for novelty: an interesting fact no agent needs is noise, and a trap-looking fact is at most an interview question, never a pitfall line.
4. **Git history** — targeted, never wholesale: when the current state contains a surprising constraint, find the change that introduced it and any reverted attempts to remove it, then check the reason still holds today. Also the source for commit-message and branch-naming conventions, read off recent history. Commit messages are past intent, not current truth.
5. **Agent session logs and review corrections** — when available or pointed at: the only source of *observed* agent mistakes. Extract structure, never transcripts: task, mistake, correction, consequence, occurrence count, source sessions. One occurrence is a candidate; recurrence makes a pitfall line. Ignore one-off noise (tool outages, typos); route mechanically preventable mistakes to a proposed hook, lint, or CI check instead of prose.
6. **The human** — org requirements, domain concepts, frozen areas, intent, priorities, and mistakes they've watched agents make. No scan substitutes.

Documents the user names from outside the repo (org handbooks, wikis, prior architecture docs, MCP knowledgebases) are treated like source 3: scanned for candidates, untrusted until verified against the repo or confirmed by the user.

## Scan scope — binding on every scanner

Scanners read tracked files (`git ls-files`). Dependency, vendored, generated, build-output, and cache directories are out unless a specific claim requires looking inside one, and then the scanner states why. Scanners return candidates with evidence; they never decide what gets written.

## The memlog

`{output_folder}/project-context/.memlog.md` — this skill's memory across runs, kept with the shared memlog tool: `uv run {project-root}/_bmad/scripts/memlog.py init|append --workspace {output_folder}/project-context ...` (standalone, when the script is absent: create and append the same one-line entries by hand). Append-only — nothing is edited or removed; a change of mind or a late answer is a new entry, and a claim's current state is its latest entry.

One entry per fact, the moment it happens, typed by what it is:

```markdown
- (candidate) single test runs need --gtest_filter; suite names don't match file names — sources: test/CMakeLists.txt; section: Commands; changes: agent trusts a 0-test green run; verification: executed; disposition: guide
- (answer by user) no external docs — one-person shop, the maintainer is the source of truth
- (rejection) directory tree — excluded by contract: repo overviews
- (conflict) AGENTS.md says git-commits, CLAUDE.md says tam-commit — asked
- (disposition) git-commits line → deleted; tam-commit is current, on the maintainer's answer
- (assumption) auto mode: treated master as the trunk, unconfirmed
```

A candidate entry carries its sources, target section, what an agent does wrong without it, verification status (`executed | path-checked | user-confirmed | unverified`), and disposition (`guide | scoped:<path> | rejected — <reason> | pending`); when the disposition is settled later or changes, append a new `(disposition)` entry rather than rewriting. Interview answers, rejections with reasons, conflicts found in other instruction files, and auto-mode assumptions all land as entries when they happen. Refresh and audit read the memlog first and don't revisit a recorded disposition unless its evidence changed. Agents never load the memlog; nothing in it counts against the guide's budget.

## Interview rules

- **Never ask what a scan could answer.** A claim verified by execution or path-check proceeds as verified; asking the user to confirm it is a defect.
- **Ask recall questions, never review lists.** "What do agents keep getting wrong?" works because the maintainer's memory has already selected what mattered. Never hand the human a selection problem a scan created.
- A mistake this session itself made and caught while reading or verifying the repo is an observed agent failure (sample of one) — worth offering as a question.
- Ask in batches of at most eight questions; fewer is better. Prefer open questions ("what do agents keep getting wrong here?") over confirmations.
- An unverifiable claim from docs or an outside document is asked as "the docs say X — still true?", never stated as fact.
- When the repo contradicts the user's own testimony, show the evidence and ask — never write the claim as given, never drop it silently. Either the claim or the reading of the evidence gets corrected, and the outcome is recorded in the memlog.
- Before writing, one closing question: say in a line what the guide will contain and ask what's missing — a frozen area, an org rule, a recurring mistake. This material is unrecoverable by any later scan.
- A batch that yields nothing new means it is time to write, not to ask more. Off-topic information the user offers is recorded in the memlog, never ignored.
