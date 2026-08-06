# Evidence

Where guide content comes from, how it is verified, and how the run is recorded. True and useful are different properties: verification establishes truth; only a section's editorial job establishes usefulness. A verified fact with no section that needs it is rejected, with the reason in the ledger.

## Channels

In increasing order of irreplaceability — later channels hold what earlier ones cannot:

1. **Active steering files** — root and nested `AGENTS.md`, `CLAUDE.md`, editor rule files. What agents are told today: the baseline, plus conflicts and staleness to fix.
2. **Executable configuration and CI** — manifests, lockfiles, workflow files, hooks, Makefiles, linter configs. The commands, gates, and enforcement points. The highest-yield scan there is; most of Commands, Verification, and Policy comes from here and gets verified by execution.
3. **Tracked source** — for boundaries (vendored, generated, frozen areas), conventions that differ from defaults, and entry points. This channel answers questions the section plan already asked; it is never mined for "interesting facts", because a fact's novelty says nothing about whether any agent needs it.
4. **Git history** — targeted, never wholesale: a surprising constraint found in the current state → `git blame` its introduction → `git show` the change → `git log -S`/`-G` for prior attempts and reversions → verify the reason still holds against the present tree. Commit messages are evidence of past intent, not current truth.
5. **Agent session logs and review corrections** — when available or pointed at: the only source that can establish *observed* agent mistakes. Extract structure, never transcripts: task, mistake, correction, consequence, whether an instruction could have prevented it, occurrence count, source sessions. One occurrence is a candidate; recurrence makes a pitfall line. Filter incidental noise (tool outages, typos), and route mechanically-preventable mistakes to hooks/lint/CI proposals instead of prose.
6. **The human** — org requirements, domain concepts, frozen areas, intent, priorities, and mistakes they've watched agents make. The only source for these; no scan substitutes.

External sources the user names (org handbooks, wikis, prior architecture docs, MCP knowledgebases) join at rank 3: mined for candidates, untrusted until verified against the repo or confirmed by the user.

## Corpus rules — binding on every scanner

The corpus is tracked files (`git ls-files`); dependency, vendored, generated, build-output, and cache directories are out unless a specific claim requires looking inside one, and then the scanner states why. Scanners return candidates with evidence; they never decide what gets written.

## The ledger

`{output_folder}/project-context-ledger.md` — one plain markdown file, the skill's memory across runs. One block per candidate:

```markdown
## <short claim>
- sources: <paths / URLs / session refs>
- section: <target section, or none>
- changes: <what an agent does wrong without it>
- verification: executed | path-checked | user-confirmed | unverified
- disposition: guide | scoped:<path> | rejected — <reason> | pending
```

Interview answers, rejections (with reasons), conflicts found in other steering files, and auto-mode assumptions all land here the moment they happen — never batched for session end. Refresh and audit read it first and never re-litigate a recorded disposition unless its evidence changed. The ledger is working memory, not context: agents never load it, and nothing in it counts against the guide's budget.

## Interview rules

- **Never ask what a scan could answer.** A claim verified by execution or path-check proceeds as verified; asking the user to confirm it is a defect.
- Chunked rounds, eight questions maximum, fewest possible. Open questions over confirmations: "what do agents keep getting wrong here?", "what would a new engineer be told on day one that's written nowhere?", "what must never be touched?".
- An unverifiable claim from docs or an external source is surfaced as "the docs say X — still true?", never stated as fact.
- Before writing, one closing ask: name in a line what will be captured and ask what's missing — a frozen area, an org rule, a recurring mistake. This class of material is unrecoverable by any later scan.
- A round that yields nothing new is the signal to write, not to invent another round. Out-of-scope material the user volunteers is captured in the ledger, never deflected.
