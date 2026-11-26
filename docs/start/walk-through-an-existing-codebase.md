---
title: 'Walk Through an Existing Codebase'
description: 'Tutorial: inherit a working room booker with no planning documents, give agents a project context, make a small change, then add two features by the route each needs.'
---

You inherit the room booker that [Walk Through Three Routes](./walk-through-three-routes.md)
started: a working app with rooms, booking, and a calendar, but no planning
documents and nobody left to ask. Four parts change it, each by the route the
work needs.

| Part | The work | Route | Time |
| --- | --- | --- | --- |
| [0. Get oriented](#part-0-get-oriented) | Run the app and give agents a project context | `bmad-project-context` | About 10 minutes |
| [1. Make a small change](#part-1-make-a-small-change) | Book a meeting again from the booking | Straight to `bmad-build` | About 15 minutes |
| [2. Calendar export](#part-2-calendar-export) | Bookings in people's own calendar apps | Sofia, the Product Owner, then build | About 45 minutes |
| [3. Check in or lose the room](#part-3-check-in-or-lose-the-room) | A door tablet for check-in, and rooms freed when nobody turns up | Deep recon, Sofia, UX, architecture, stories, one story built | About 1.5 hours |

Do the parts in order. Each one builds on the code the last one left.

:::note[Before You Start]
You need what [Install BMad](./install-bmad.md) lists. Get the app at the
point where you inherit it:

```bash
git clone --depth 1 --branch brownfield-start https://github.com/ilya-baimetov/bmad-room-booking-app.git
cd bmad-room-booking-app
git switch -c my-changes
```

The `brownfield-start` branch is the finished app with every BMad file
removed, and `--depth 1` leaves out the history of how it was built. Then
install BMad and run `bmad setup` in the folder.
:::

The steps work as in [Walk Through Three Routes](./walk-through-three-routes.md#how-the-steps-work):
paste the text blocks, follow the notes, and take the agent's recommended
option for any question the notes don't cover.

## Part 0: Get Oriented

### 1. Run the App

The README says how. From the repository root:

```bash
uv sync
uv run alembic upgrade head
uv run python -m roombooker.seed seeds/build-people.csv --demo-bookings
uv run uvicorn roombooker.app:app
```

Open `http://127.0.0.1:8000/` and pick a name. The seed loads 30 made-up
people across three offices and two weeks of bookings. Code comments cite
decisions such as `AD-4` whose documents are gone.

### 2. Give Agents a Project Context

A project context is a short, verified block in `AGENTS.md` that every later
session reads: how to run the tests, where things live, and what not to
change. It may also add, or offer to add, a one-line `CLAUDE.md` that points
Claude Code at it. In a new session:

```text wrap
/bmad-project-context
```

It finds no instruction file, reads the repository, and checks each claim
against the code.

- When it asks what rules you bring, say "Nothing beyond the repository."
- When it asks what agents get wrong here, say "I don't know yet. I just
  inherited it."
- When it asks anything else an inheritor can't know, such as team branch
  rules or where the real list of people comes from, say "I don't know." If it
  asks about the decisions the code comments cite, such as `AD-4`, say "Those
  documents are gone."
- When it shows the block, say "Write it."
- If it offers a `CLAUDE.md` that points Claude Code at `AGENTS.md`, say
  "Yes." Claude Code reads `CLAUDE.md`, not `AGENTS.md`.

It never commits. Commit what it wrote yourself; `git status` lists it.
Usually that's `AGENTS.md` and `CLAUDE.md`; leave out any file `git status`
doesn't list:

```bash
git add AGENTS.md CLAUDE.md && git commit -m "docs: add agent instructions"
```

## Part 1: Make a Small Change

One small change first shows how the build handles code it didn't write. In a
new session:

```text wrap
/bmad-build On a booking's details page, add "Book again": it opens the booking form with the same room, start time, length, title and attendees, one week later. If that slot is taken, the form says so and lets you pick another time.
```

- If it says there are uncommitted changes, such as the BMad setup files, say
  "Commit them first."
- If it asks whether the work belongs to an initiative, say "Loose."
- If it shows a plan, say "Approved."

It reads the code first, follows the patterns it finds, adds tests, and
commits, on a new branch if it makes one, otherwise on `my-changes`. Stay on
the branch it committed to: the later parts build on top of it. Restart the
app (stop it, then run `uv run uvicorn roombooker.app:app` again), open a
booking you made from My bookings, and press Book again. The form opens one
week later; if the room is taken then, it says so.

## Part 2: Calendar Export

People want their room bookings in the calendar app they already use. That's
a few stories with one clear idea, so Sofia writes the requirements and the
stories, and you build them.

### 1. Write the Requirements and Stories

```text wrap
/bmad Create an initiative called calendar-export. People want their room bookings in their own calendar app.
```

In the same session, ask `/bmad What's next?`. BMad suggests Sofia; say "Yes."
When she asks what you want to build, or starts asking her own questions about
it, paste:

```text wrap
People want their room bookings in the calendar app they already use: Outlook, Google Calendar or Apple Calendar.

Each booking gets an "Add to calendar" download, a standard .ics file.

Each person also gets a private calendar feed address that their calendar app subscribes to. It shows the bookings they made or were invited to, and changes when a booking changes or is cancelled.

The feed address is secret. A person can reset it, and the old address stops working.

No sign-in to Microsoft or Google, and nothing comes back from those calendars: the room booker stays the only place to book.
```

- When she lists the guesses she made, say "All fine."
- If she asks whether Google Calendar or Outlook can reach the app from the
  internet, say "I don't know yet. Record it as an open question."
- When she asks how to split the work, say "Straight into stories, no epics.
  As few as you can, each one build session."
- When she shows the stories and asks to save them, say "Yes."

### 2. Build Each Story

Once per story. In a new session, ask `/bmad What's next?`. BMad suggests
`bmad-build` for the next story; say "Yes."

- If it says there are uncommitted changes, say "Commit them first."
- If it asks which branch to build on, take its suggestion.
- If it shows its plan, say "Approved."

Check the story yourself: ask "How do I run the app?" If you kept the database
from Part 0, run `uv run alembic upgrade head` again first, because a story
that changes the database fails without it. Then check what the story added:
for the download, open a booking and press Add to calendar; for the feed, go
to Calendar feed on My bookings (press its button to create an address if none
is shown yet), copy the address, and open it in a private browser window,
which downloads a `.ics` file of your bookings. Then, in a new session, ask
`/bmad What's next?` and say "Mark it done with Sofia." She notes that you
haven't checked it in a calendar app, and the initiative stays in progress
until it's live, which is expected here.

## Part 3: Check In or Lose the Room

Booked rooms often sit empty because nobody turns up. This feature adds a
tablet at each room's door where people check in, and frees a room nobody
checks into within 15 minutes of its start. It changes how bookings end, adds
a screen, and needs a rule about where the no-show timer runs, so it gets UX
and architecture before its stories. It is the "Check in or lose the room"
feature the [examples in these docs](./how-bmad-works.md#the-example-app)
follow.

### 1. Learn How Bookings End Today

Nobody remembers how a booking ends when nobody shows up. Ask for a cited
account of the code before planning anything. In a new session:

```text wrap
/bmad-deep-recon before we add check-in, how do bookings end today, and what depends on that?
```

When it shows its plan of questions, say "Go ahead." If it asks where to
file the account, say "Loose. It isn't part of calendar export." It writes an
account with file and line citations and no recommendation. If it asks to
fetch more Git history or to write a decision record, say "No." The history
was left out of your clone on purpose.

### 2. Write the Requirements

In a new session:

```text wrap
/bmad Start a new initiative called check-in. People check in at a tablet by the room's door, and rooms nobody checks into are freed.
```

In the same session, ask `/bmad What's next?`. BMad suggests Sofia; say "Yes."
If it starts writing a PRD with John instead, say "I'd like to write the
requirements with Sofia first, not a PRD." When she asks what you want to
build, or starts asking her own questions about it, paste:

```text wrap
This is a new feature for our existing room booking app. Read the deep-recon account of how bookings end today.

Booked rooms often sit empty because nobody turns up.

Each room gets a tablet by its door, showing the room's bookings for today. People check in on the tablet, from 5 minutes before the start until 15 minutes after.

If nobody checks in within 15 minutes of the start, the room is freed: anyone can book the rest of that slot, and the booking shows as freed in its owner's calendar.

Office managers see how many bookings were freed in their office this week.

No QR codes, sensors, badges or notifications in this release. The tablets are ordinary tablets showing a web page, and an office manager sets each one up once.
```

- When she lists the guesses she made, say "All fine."
- When she shows the requirements, say "Looks good, save it."
- If she offers to start the next step, say "Not now."

### 3. Design the Door Screen

In a new session, ask `/bmad What's next?`. BMad may suggest Sally (`bmad-agent-ux-designer`), or
Sofia to split the work first. Say "I'd like to design the door screen with UX
first. Start it here." When it asks what to design, or asks its own questions
about the screen, paste:

```text wrap
Let's go fast. Design the door tablet's check-in screen, and the check-in and freed states in My bookings.

The tablet is read from a few steps away: the room name, free or booked, and the current booking big enough to see from the door.

Checking in is one tap.

Keep the app's existing look.
```

- When it walks through its decisions, take its suggestions.
- When it offers a review and mock-ups, say "No."

### 4. Settle the Architecture

In a new session, ask `/bmad What's next?`. BMad may suggest Sofia first, to
add the door-screen design to the initiative. Say "I'd like to settle the
architecture now. Start it here." If it offers to commit files first, say
"Commit them first." Paste:

```text wrap
Let's go fast. I only need the architecture document, nothing else.

There is no architecture document yet. Read the code for the decisions it already makes, and settle what check-in adds.

This is a walkthrough, so please skip the reviewer gate.
```

- If it asks where the no-show timer runs, take its recommendation. In fast
  mode it may settle this itself.
- When it shows the draft and asks you to confirm its guesses, say "Fine." If
  it asks to commit the document, say "Yes."

### 5. Plan the Stories and Build the First

In a new session, ask `/bmad What's next?`. BMad suggests Sofia, to add the
design and architecture to the initiative, split it into an epic, refine it,
and plan its stories; say "Yes."

- When she lists where the design and architecture differ from the
  requirements, say "Side with the architecture and UX."
- When she proposes epics, say "One epic for now: check in or lose the room."
- If she asks whether to run an epic PRD with John first or lists open epic
  questions, say "Skip the epic PRD and fill the epic in from the initiative,
  UX, and architecture — use the simplest defaults for this walkthrough."
- When she proposes the stories, say "As few as you can, each one build
  session. All on my computer, with the tablet as a browser window."
- When she shows the stories, say "Yes."
- If she goes on to plan the first story's build, say "Approve and stop." You
  build it in a new session.

Build the first story as in Part 2, step 2. To check the door screen, open a
private browser window sized like a tablet, pick an office manager (the
run-the-app answer names them), and on Manage rooms press Set up door tablet
for a room. That window becomes the door screen. In your main window, book
that room at the next quarter hour that is at least 5 minutes away. From 5
minutes before the start, reload the door screen and press Check in; it shows
that you checked in. When you mark the story done, say "I checked it on the
door screen. Mark it done with Sofia." The rest of the epic follows the same
way: keep asking `/bmad What's next?`.

## What You Did

You took over code you didn't write, gave every later session a verified
project context, and changed the code three ways: a small change straight
through the build, a feature from Sofia's requirements, and a feature that
needed a cited account of the code, UX, and architecture before its stories.
Each build read the code first and followed what it found.

:::tip[Key Takeaways]
On existing code, start with the project context, then make one small change
to see how the build handles the codebase before planning anything larger.
When nobody knows how a part works, ask `bmad-deep-recon` for a cited account
before you plan the change.
:::
