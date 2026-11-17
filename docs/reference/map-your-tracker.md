---
title: 'Map Your Tracker to the Ticket Tree'
description: What each level of Sofia's ticket tree becomes in Jira, Linear, GitHub Issues, Notion, Shortcut, and Trello, which tracker concepts have no counterpart, and how to map a hierarchy whose names don't match.
sidebar:
  order: 6
---

Sofia keeps the [ticket tree](./ticket-tree.md) as files and, once you
[connect a tracker](../plan/set-up-the-ticket-tree.md#configure-where-tickets-are-tracked),
publishes it there. The files stay the working copy; the tracker is where the
team sees the work. This page lists what each level becomes in each tracker,
what your tracker has that the tree doesn't, and how to map levels whose names
don't line up.

## Map by What Each Level Does

Tracker level names don't match BMad's. Linear has no Epic object, and in SAFe
the Epic sits above the Feature. Match each level of your hierarchy to the BMad level that
does the same job:

| What the level does here                                 | BMad level        |
| -------------------------------------------------------- | ----------------- |
| Groups several product efforts, such as a program        | Parent initiative |
| One outcome with its own requirements                    | Initiative        |
| One increment that closes once its Done when holds       | Epic              |
| One change that fits a single build session              | Story, bug, spike |

## What Each Level Becomes

These are the defaults Sofia's tracker setup starts from.

| BMad             | Jira                                                                                     | Linear                                                                                         | GitHub Issues                         | Notion                  | Shortcut | Trello                         |
| ---------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------- | -------- | ------------------------------ |
| Initiative       | Not published, unless you map it to your site's level above Epic (Premium or Enterprise) | Not published. Mapping it to Linear initiatives needs initiative tools in Linear's MCP server, and can't round-trip: they nest and allow several parents | Milestone                             | Row of type initiative  | Objective | Card in the Initiatives list   |
| Epic             | Epic                                                                                     | Parent issue labelled `epic`                                                                   | Parent issue labelled `epic`          | Row of type epic        | Epic | Card in the Epics list         |
| Story, bug, spike | Story, Bug, or Task labelled `spike`                                                    | Sub-issue of the epic, labelled with its type                                                  | Sub-issue labelled with its type      | Row linked to its epic by Parent | Story of type feature, bug, or chore labelled `spike` | Card labelled with its type    |
| `after`          | A Blocks link                                                                            | A blocking relation                                                                            | A blocked-by relation                 | The Blocked by relation | A blocks link between stories; an epic's `after` stays in the files | The blocker's link in the card's description |
| `hitl`, risk     | Labels                                                                                   | Labels                                                                                         | Labels                                | Properties              | Labels | Labels                         |

A level that isn't published leaves its children attached to the nearest
published level: with the Jira defaults, epics publish as top-level Epics. The
Jira store works with Jira Cloud through `acli`, Atlassian's command line.

Statuses map the same way:

| BMad state  | Jira        | Linear      | GitHub Issues            | Notion      | Shortcut | Trello      |
| ----------- | ----------- | ----------- | ------------------------ | ----------- | -------- | ----------- |
| backlog     | To Do       | Backlog     | `backlog` label          | Backlog     | Backlog | Backlog     |
| in-progress | In Progress | In Progress | `in-progress` label      | In Progress | In Progress | In Progress |
| review      | In Review   | In Review   | `review` label           | Review      | In Review | Review      |
| done        | Done        | Done        | Closed                   | Done        | Done | Done        |
| dropped     | Done, resolution Won't Do | Canceled    | Closed as not planned    | Dropped     | Archived | Archived    |

## What Has No Counterpart

| Your tracker has                                       | The ticket tree                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Sprints or cycles                                      | No time boxes; work flows in build order. Keep running sprints in the tracker; Sofia doesn't read or set them.                            |
| Fix versions or releases                               | No release grouping, and none is synced. Keep releases in the tracker.                                                                    |
| A backlog of all unstarted work                        | `backlog/` holds only work that belongs to no epic. An unstarted story stays in its epic, as `backlog`, and publishes as To Do.          |
| Epics that grow as long as the feature lasts           | An epic gets a retrospective, then closes only after Sofia checks its Done when. Work it doesn't need moves to another epic, so it can close. |
| Linear projects                                        | Not tied to a ticket-tree level by default: epics are parent issues and initiatives stay local. The store can still set an issue's project. |
| GitHub milestones used for releases                    | BMad uses milestones for initiatives. If yours mean releases, leave initiatives unpublished.                                              |

## Which Way Changes Flow

Nothing syncs on its own: Sofia publishes and reads the tracker during the
board steps you run with her.

- By default, she offers to publish the whole agreed breakdown once it's
  validated. To publish each ticket only when it starts, set
  `publication = "on_start"` under `[workflow]` in
  `_bmad/custom/bmad-agent-po.toml`.
- When she next syncs, status, assignee, and blocking links come back into the
  files. A story someone adds in the tracker under a published epic comes back
  as a new entry. When a description differs between the tracker and the
  file, she shows both and asks which to keep.
- Tracker status doesn't make a build skip work, and Sofia doesn't push your
  files to Git.

Sofia publishes the tree she holds. There's no step for adopting an epic that
already exists in the tracker: plan the work with Sofia and let her publish it.

## Change the Mapping

Your choices live in `_bmad/custom/ticketing-store-config.toml`, which Sofia
writes during setup and which survives skill updates. Each key overrides the
tracker's default. For a Jira site with an Initiative level above Epic:

```toml
[tickets]
store = "jira"
key = "ROOM"
site = "your-company.atlassian.net"

[tickets.types]
initiative = "Initiative"
```

Use the name your site gives that level. Statuses go under `[tickets.status]`
the same way; a BMad state with no tracker status takes the previous state's.
To change the mapping, ask:

```text wrap
/bmad-agent-po reconfigure the ticket store
```
