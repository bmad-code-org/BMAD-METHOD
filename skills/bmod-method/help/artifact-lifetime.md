# How long to keep planning and implementation artifacts

Use this when the user asks whether to keep PRDs, specs, stories, and build records after the work is done, where they should live, or how to stop old plans from confusing agents. There is no hard rule. This is BMad's suggestion, and the user may reasonably choose otherwise.

## The principle

A PRD, a spec, or a user story is a snapshot in time. Once the work ships, the code moves on and the document does not, so it starts to mislead: it describes decisions that were later changed and features that were later reworked. An agent that reads it may trust it over the code. Version control already holds the history.

So: archive finished planning and implementation artifacts, and keep only the small documentation needed to maintain the system going forward (`help/preparing-a-repo-for-agents.md`).

## Stories and the end of an epic

- Keep every completed story file in the folder of the epic being worked on. Later stories and the retrospective read them.
- Before closing the epic, run `bmad-retrospective`, decide what to do about its findings, then close the epic out.
- After that, it is a good idea not to keep the story files in the repository or locally. They are already in git history.

## If the user prefers to keep everything

That is a fair choice, and it matters less when the artifacts live in their own repository apart from the code. It has a cost to manage:

- Add a rule to `AGENTS.md` telling agents not to read completed epics' stories, only the epic in progress.
- Even with the rule, old content can still reach an agent and degrade its work on later epics. The more that is kept, the more likely that is.

## Other planning artifacts

Briefs, PRDs, UX files, architecture documents, and specs for finished work are also generally not worth keeping live once the work is complete. Archive them the same way.

When the output folder holds more than one body of work, organize it by initiative, one folder each. This will be the norm in v7. Then add a rule to `AGENTS.md` telling agents to ignore everything in that folder except what is under the active initiative.

## Where the artifacts live

BMad recommends making the output folder (`_bmad-output` by default) its own git repository, with commits as planning progresses. Planning gets a history of its own, archiving is a commit that removes files, and anything archived can be recovered. In a poly repo workspace that folder already sits outside the project repositories (`help/monorepo-and-polyrepo.md`).
