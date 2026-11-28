---
title: 'Map Your Tracker to the Ticket Tree'
description: What each level of Sofia's ticket tree becomes in Jira, Linear, GitHub Issues, Notion, and Trello, which tracker concepts have no counterpart, and how to customize mappings.
sidebar:
  order: 6
---

Sofia keeps the [ticket tree](./ticket-tree.md) as local files and, once you [connect a tracker](../plan/set-up-the-ticket-tree.md#configure-where-tickets-are-tracked), publishes it to your issue tracker. The files remain the local working copy while the tracker gives your team shared visibility.

## Map by What Each Level Does

External trackers use different names for hierarchy levels (Linear has no Epic object, and SAFe places Epics above Features). Map each level by its role rather than its label:

| What the level does | BMad level |
| --- | --- |
| Groups several bounded initiatives under shared portfolio outcomes | Program |
| One product effort with its own requirements | Initiative |
| One cohesive capability that closes when its `Done when` checks hold | Epic |
| One unit of work sized for a single build session | Story, bug, spike |

## What Each Level Becomes

These are the defaults Sofia's tracker setup starts from:

| BMad | Jira | Linear | GitHub Issues | Notion | Trello |
| --- | --- | --- | --- | --- | --- |
| **Program** | Not published by default (stays local; child initiatives attach to nearest published level) | Not published by default (stays local; children attach to nearest published level) | Not published by default (stays local; children attach to nearest published level) | Not published by default; add `"program"` in `[tickets.types]` and in the Notion `Type` select property to publish it | Not published by default (stays local; children attach to nearest published level) |
| **Initiative** | Not published unless mapped to a level above Epic (Jira Premium or Enterprise) | Not published by default (Linear initiatives allow multiple parents and cannot round-trip cleanly) | Milestone | Row of type `initiative` | Card in the Initiatives list |
| **Epic** | Epic | Parent issue labeled `epic` | Parent issue labeled `epic` | Row of type `epic` | Card in the Epics list |
| **Story, bug, spike** | Story, Bug, or Task labeled `spike` | Sub-issue of the epic labeled with its type | Sub-issue labeled with its type | Row linked to its epic via `Parent` | Card labeled with its type |
| `after` | Blocks link | Blocking relation | Blocked-by relation | `Blocked by` relation | Blocker link in the card description |
| `hitl`, `risk` | Labels | Labels | Labels | Properties | Labels |

Whenever a parent level stays unpublished, its children attach to the nearest published level (for example, Jira's default publishes epics as top-level Epics). The Jira store connects to Jira Cloud through `acli`, Atlassian's command-line tool.

Statuses map by board state:

| BMad state | Jira | Linear | GitHub Issues | Notion | Trello |
| --- | --- | --- | --- | --- | --- |
| `backlog` | To Do | Backlog | `backlog` label | Backlog | Backlog |
| `in-progress` | In Progress | In Progress | `in-progress` label | In Progress | In Progress |
| `review` | In Review | In Review | `review` label | Review | Review |
| `done` | Done | Done | Closed | Done | Done |
| `dropped` | Done (resolution Won't Do) | Canceled | Closed as not planned | Dropped | Archived |

## What Has No Counterpart

| Your tracker has | How the ticket tree handles it |
| --- | --- |
| Sprints or cycles | No time boxes; work moves in dependency build order. Continue running sprints in your tracker while Sofia ignores sprint fields. |
| Fix versions or releases | Not synced; manage releases in your tracker. |
| A backlog of all unstarted work | `backlog/` holds only standalone tickets outside any epic. Unstarted epic stories stay inside their epic as `backlog` and publish as To Do. |
| Epics that stay open indefinitely | Epics receive a retrospective and close once Sofia verifies `Done when`; leftover work moves to another epic so the completed epic can close. |
| Linear projects | Not mapped to a hierarchy level by default (epics are parent issues and initiatives stay local), though the store config can assign issues to a Linear project. |
| GitHub milestones used for releases | BMad maps initiatives to milestones by default; if your team uses milestones for releases, leave initiatives unpublished. |

## How Changes Flow

Nothing syncs automatically in the background; Sofia publishes and mirrors tracker state during the board steps you run with her:

- By default, Sofia offers to publish the entire approved breakdown once validated (`publication = "at_inception"`). If you prefer publishing each ticket only when work starts, ask `bmad-customize` to set `bmad-agent-po` publication to `on_start` (which writes `publication = "on_start"` under `[workflow]` in `_bmad/custom/bmad-agent-po.toml`).
- On sync, Sofia pulls status, assignee, and blocking links back into local leaf files. Stories added directly in the tracker under a published epic are imported as new entries, and conflicting descriptions are shown side by side so you choose which to keep.
- Tracker status never causes `bmad-build` to skip planning, and Sofia does not push local commits to Git.

Sofia publishes trees authored in BMad rather than importing pre-existing tracker epics wholesale.

## Change the Mapping

The easiest way to update your tracker mapping is to ask Sofia in chat:

```text
/bmad-agent-po reconfigure the ticket store
```

Sofia updates `_bmad/custom/ticketing-store-config.toml`, which survives skill updates. If you prefer inspecting or editing that file directly, each key overrides the tracker's default. For example, to map initiatives to a custom Jira hierarchy level:

```toml
[tickets]
store = "jira"
key = "ROOM"
site = "your-company.atlassian.net"

[tickets.types]
initiative = "Initiative"
```

Use the exact issue-type or property name configured on your tracker site. Status overrides follow the same pattern under `[tickets.status]`, where an omitted BMad state inherits the previous state's tracker value.
