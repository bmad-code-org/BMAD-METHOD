# Release notes

The outcome is the entry for the version being released in `CHANGELOG.md`. A user upgrading reads it without the commit log in front of them, so every line names what changed for them, never the commit, and anything that needs a step from them sits under its own `Upgrade` heading at the top.

## What you cannot infer

- The range is the last `v*` tag to `HEAD` unless the user names one.
- Groups are Added, Changed, Fixed, Removed, in that order; an empty group is left out. Dependency bumps are one line together.
- Commits typed `chore`, `ci` and `test` are left out unless they change what a user sees.
- A commit whose effect you cannot tell from its message is one question to the user, listing the commits, not a guess: a wrong line here reaches every user of the release.

## Hand back

Show the entry, name the commits you left out and why, and offer to tag.
