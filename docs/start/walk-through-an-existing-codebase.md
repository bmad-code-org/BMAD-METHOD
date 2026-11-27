---
title: 'Walk Through an Existing Codebase'
description: 'Tutorial: inherit a working room booker with no planning documents, give agents a project context, make a small change, then add two features by the route each needs.'
---

You inherit the room booker that [Walk Through Three Routes](./walk-through-three-routes.md) started: a working app with rooms, booking, and a calendar, but no planning documents and nobody left to ask. Over four parts you orient yourself and change it using the route each task calls for.

| Part | The work | Route | Time |
| --- | --- | --- | --- |
| [0. Get oriented](#part-0-get-oriented) | Run the app and give agents a project context | `bmad-project-context` | About 10 minutes |
| [1. Make a small change](#part-1-make-a-small-change) | Book a meeting again from the booking screen | Straight to `bmad-build` | About 15 minutes |
| [2. Calendar export](#part-2-calendar-export) | Bookings in people's own calendar apps | Sofia, the Product Owner, then build | About 45 minutes |
| [3. Check in or lose the room](#part-3-check-in-or-lose-the-room) | A door tablet for check-in, and rooms freed when nobody turns up | Deep recon, Sofia, UX, shared architecture, stories, one story built | About 1.5 hours |

Work through the parts in order, because each part builds on the code left by the previous one.

:::note[Before You Start]
You need the prerequisites listed in [Install BMad](./install-bmad.md). Clone the sample tutorial repository at the point where you inherit it:

```bash
git clone --depth 1 --branch brownfield-start https://github.com/ilya-baimetov/bmad-room-booking-app.git
cd bmad-room-booking-app
git switch -c my-changes
```

The `brownfield-start` branch holds the finished app with every BMad file removed, and `--depth 1` leaves out the build history. Next, [install BMad and run `/bmad setup`](./install-bmad.md) inside the cloned folder.
:::

The steps work the same way as in [Walk Through Three Routes](./walk-through-three-routes.md#how-the-steps-work): paste the text blocks, follow the notes for choices that shape the walkthrough, and accept the agent's recommended default for everything else.

## Part 0: Get Oriented

### 1. Run the App

The repository README lists the commands to start it locally. From the repository root, run:

```bash
uv sync
uv run alembic upgrade head
uv run python -m roombooker.seed seeds/build-people.csv --demo-bookings
uv run uvicorn roombooker.app:app
```

Open `http://127.0.0.1:8000/` and pick a name. The seed loads 30 sample people across three offices and two weeks of bookings. As you browse the code, you will notice comments referencing old architecture decision IDs whose original design documents are gone.

### 2. Give Agents a Project Context

A project context is a short, verified block in `AGENTS.md` that every later coding session reads: how to run the tests, where files live, and what must not change. The skill may also add or offer a short `CLAUDE.md` pointing Claude Code at `AGENTS.md`. In a new session, run:

```text wrap
/bmad-project-context
```

It detects no existing instruction file, reads the repository, and checks each factual claim against the code.

- When it asks what rules you bring, say "Nothing beyond the repository."
- When it asks what agents get wrong here, say "I don't know yet. I just inherited it."
- When it asks anything else an inheritor cannot know (such as team branching rules or where the real employee directory lives), say "I don't know." If it asks about the missing decision documents cited in code comments, say "Those documents are gone."
- When it shows the drafted block, say "Write it."
- If it offers to create a `CLAUDE.md` pointing to `AGENTS.md`, say "Yes" if you use Claude Code.

`bmad-project-context` never commits automatically. Check `git status` and commit the files it created (typically `AGENTS.md` and `CLAUDE.md`; omit any file not listed):

```bash
git add AGENTS.md CLAUDE.md && git commit -m "docs: add agent instructions"
```

## Part 1: Make a Small Change

Starting with one self-contained change shows how `bmad-build` respects code it did not write. In a new session, run:

```text wrap
/bmad-build On a booking's details page, add "Book again": it opens the booking form with the same room, start time, length, title and attendees, one week later. If that slot is taken, the form says so and lets you pick another time.
```

- If it reports uncommitted changes (such as BMad setup files), say "Commit them first."
- If it asks whether this work belongs to an initiative or has no active initiative, say there is no active initiative for this standalone change.
- If it presents a plan, say "Approved."

It inspects the existing code first, matches the patterns it finds, adds tests, and commits locally (on a new branch if it creates one, or on `my-changes`). Stay on that branch so the remaining parts build on top of it. Restart the server (`uv run uvicorn roombooker.app:app`), open a booking from My bookings, and click Book again to confirm the form opens one week later and warns you when that slot is taken.

## Part 2: Calendar Export

Staff want their room bookings in the calendar apps they already use. Because this is a clear feature spanning a few connected stories, Sofia writes the requirements and stories, and you build them one by one.

### 1. Write the Requirements and Stories

Start the initiative:

```text wrap
/bmad Create an initiative called calendar-export. People want their room bookings in their own calendar app.
```

In the same session, ask `/bmad What's next?`. BMad suggests Sofia; say "Yes." When she asks what you want to build, paste:

```text wrap
People want their room bookings in the calendar app they already use: Outlook, Google Calendar or Apple Calendar.

Each booking gets an "Add to calendar" download, a standard .ics file.

Each person also gets a private calendar feed address that their calendar app subscribes to. It shows the bookings they made or were invited to, and changes when a booking changes or is cancelled.

The feed address is secret. A person can reset it, and the old address stops working.

No sign-in to Microsoft or Google, and nothing comes back from those calendars: the room booker stays the only place to book.
```

- When she lists the assumptions she made, say "All fine."
- If she asks whether Google Calendar or Outlook can reach the app over the internet, say "I don't know yet. Record it as an open question."
- When she asks how to split the work, say "Straight into stories, no epics. Keep it to as few cohesive stories as possible."
- When she shows the stories and asks to save them, say "Yes."

### 2. Build Each Story

Run this step once per story. In a new session, ask `/bmad What's next?`. BMad suggests `bmad-build` for the next ready story; say "Yes."

- If it reports uncommitted changes, say "Commit them first."
- If it asks which branch to build on, accept its recommendation.
- If it shows a build plan, say "Approved."

Verify each story yourself. Ask "How do I run the app?" If you kept your SQLite database from Part 0, run `uv run alembic upgrade head` before restarting the server whenever a story changes the database schema. Check the new feature in your browser: for the download, open a booking and click Add to calendar; for the feed, open Calendar feed on My bookings (generate a link if needed), copy the URL, and open it in a private browser window to confirm a `.ics` file downloads. Then open a new session, ask `/bmad What's next?`, and say "Mark it done with Sofia." She notes that live calendar-app verification is still pending while running locally, which is expected here.

## Part 3: Check In or Lose the Room

Booked rooms often sit empty because nobody turns up. This feature adds a tablet at each room's door where people check in and frees any room nobody checks into within 15 minutes of its start. Because it changes booking lifecycles, adds a new screen, and requires deciding where the no-show timer runs, you research the existing code first and then add UX and shared architecture before slicing stories. This is the "Check in or lose the room" feature referenced in [the example app](./how-bmad-works.md#the-example-app).

### 1. Learn How Bookings End Today

Nobody remembers how bookings currently end when no one shows up. Ask `bmad-deep-recon` for a cited factual account of the code before planning anything. In a new session, run:

```text wrap
/bmad-deep-recon before we add check-in, how do bookings end today, and what depends on that?
```

When it shows its research plan, say "Go ahead." If it asks whether to attach the report to an initiative, tell it there is no active initiative yet because this is separate from calendar export. It writes a factual account with file and line citations and zero recommendations. If it offers to fetch full Git history or write a decision record, say "No," because the shallow clone omits history on purpose.

### 2. Write the Requirements

In a new session, create the initiative:

```text wrap
/bmad Start a new initiative called check-in. People check in at a tablet by the room's door, and rooms nobody checks into are freed.
```

Now open Sofia (`bmad-agent-po`) in the same session to write the requirements directly from your notes and the research report:

```text wrap
/bmad-agent-po Write the initiative requirements for check-in from my description and the deep-recon report on how bookings end today.
```

When she asks for the details, paste:

```text wrap
This is a new feature for our existing room booking app. Read the deep-recon account of how bookings end today.

Booked rooms often sit empty because nobody turns up.

Each room gets a tablet by its door, showing the room's bookings for today. People check in on the tablet, from 5 minutes before the start until 15 minutes after.

If nobody checks in within 15 minutes of the start, the room is freed: anyone can book the rest of that slot, and the booking shows as freed in its owner's calendar.

Office managers see how many bookings were freed in their office this week.

No QR codes, sensors, badges or notifications in this release. The tablets are ordinary tablets showing a web page, and an office manager sets each one up once.
```

- When she lists the assumptions she made, say "All fine."
- When she shows the drafted requirements, say "Looks good, save it."
- If she offers to start slicing immediately, say "Not now." You will design the screen and settle the technical contract next.

### 3. Design the Door Screen

For this walkthrough, you intentionally design the door screen before slicing stories so Sofia and every coding session build from the same layout and states. In a new session, open Sally (`bmad-agent-ux-designer`):

```text wrap
/bmad-agent-ux-designer Let's go fast. Design the door tablet's check-in screen, and the check-in and freed states in My bookings.

The tablet is read from a few steps away: the room name, free or booked, and the current booking big enough to see from the door.

Checking in is one tap.

Keep the app's existing look.
```

- When she walks through her design choices, accept her suggestions.
- When she offers a review pass and interactive mockups, say "No."

### 4. Settle the Shared Architecture

Next, bring in Winston (`bmad-agent-architect`) to inspect the existing codebase and settle where the no-show timer runs and how check-in fits the existing data model. In a new session, open Winston directly:

```text wrap
/bmad-agent-architect Let's go fast. I only need the architecture document, nothing else.

There is no architecture document yet. Read the code for the decisions it already makes, and settle what check-in adds.

This is a walkthrough, so please skip the reviewer gate.
```

- If he asks whether to commit earlier files first, say "Commit them first."
- If he asks where the no-show timer should run, accept his recommendation (in fast mode he may settle it directly).
- When he shows the draft and asks you to confirm his assumptions, say "Fine." If he offers to commit the document, say "Yes."

### 5. Run Epic Inception and Build the First Story

In a new session, ask `/bmad What's next?`. BMad suggests Sofia to adopt Sally's design and Winston's architecture into the initiative and run **epic inception** (the just-in-time pass where an epic outline expands into concrete requirements and refined stories right before building); say "Yes."

- When she lists places where the design or architecture sharpens the earlier requirements, say "Side with the architecture and UX."
- When she proposes epics, say "One epic for now: check in or lose the room."
- If she asks whether to write an epic-level PRD with John first or lists open epic questions, say "Skip the epic PRD and fill the epic in from the initiative, UX, and architecture, using the simplest defaults for this walkthrough."
- When she proposes the stories, say "Keep it to as few cohesive stories as possible, all running on my computer, with the tablet as a browser window."
- When she shows the stories and refined story files, say "Yes."
- If she starts planning the first story's build in the same chat, say "Approve and stop" so you can build it in a fresh session.

Build the first story just as in Part 2, step 2. To verify the door screen, open a private browser window resized like a tablet, pick an office manager (the run-the-app instructions name them), and open Manage rooms to click Set up door tablet for a room. In your main browser window, book that room for the next quarter hour that is at least 5 minutes away. Once you are within 5 minutes of the start time, reload the tablet window and click Check in to confirm it registers. When you mark the story done, say "I checked it on the door screen. Mark it done with Sofia." Continue through the rest of the epic with `/bmad What's next?`.

## What You Did

You inherited an undocumented codebase, gave every future session a verified project context in `AGENTS.md`, and extended the code three different ways: a standalone change straight through `bmad-build`, a multi-story feature planned directly with Sofia, and a complex feature backed by codebase research, UX design, and shared architecture before slicing stories. Each build read the live code first and matched the patterns it found.

:::tip[Key Takeaways]
On an existing codebase, set up `AGENTS.md` with `bmad-project-context` first, then run one small build to see how BMad follows your repo's conventions before planning larger features. When nobody remembers how a critical path works, run `bmad-deep-recon` for a cited factual account before making any design calls.
:::
