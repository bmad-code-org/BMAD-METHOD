# How to: a skill for yourself

Read this when the user wants a skill for their own use and asks what will happen. Walk them through it in these terms.

1. **Say what you want**, in a sentence or a conversation. Smithy mines it first and asks only for what is missing, one or two questions at a time, each with the answer he would guess so you can just confirm. The things he needs: what it gets done and for whom, who consumes the output and what must be true of it, the phrases you would type to reach it and the nearby requests it should ignore, where the know-how lives, whether the output can be checked, how it registers with BMad, and where it will run.
2. **Approve the read-back.** Name (with your own prefix, not `bmad-`), one line on purpose, the description as it will ship, shape, registration, approach, where it will live, and the files. Change any line; nothing is written before you say yes. For a personal skill the usual answers are plain shape, plain registration, and the folder your agent reads skills from, so it is live the moment it is written. Say so if you want it in `~/.claude/skills` or `~/.agents/skills` for every project.
3. **Smithy writes it**, tries it on one real input if you gave one, and runs the quality lenses over every file. He fixes the defects they find and tells you what changed.
4. **Hand-off.** Where it is, that it is live, and one request to try. He offers a trigger eval, worth taking for any skill you expect to fire on its own, and a review.

Afterwards: "change", "fix" or "extend" the skill reaches edit mode. If you later want `bmad` to recommend it or check it for updates, convert mode's in-place path adds a record (`help/registration.md`). A skill written straight into your agent's folder is not tracked by the skills CLI; updates are yours to make.
