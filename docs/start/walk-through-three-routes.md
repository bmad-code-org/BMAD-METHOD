---
title: 'Walk Through Three Routes'
description: 'Tutorial: build three new projects of different sizes, from a one-session build to the full planning route, and see how BMad sizes the planning to the work.'
---

This walkthrough builds three new projects of different sizes. Together they
show BMad's core idea: it sizes the planning to the work.

| Part | The work | Route | Time |
| --- | --- | --- | --- |
| [1. Quick build](#part-1-quick-build) | A meeting cost timer, one session | Straight to `bmad-build` | About 15 minutes |
| [2. Product Owner route](#part-2-product-owner-route) | A small web app, a few stories | Sofia, the Product Owner, then build | About 45 minutes |
| [3. Full route](#part-3-full-route) | A company tool, several epics | Brief, PRD, UX, epics, architecture, stories, one epic built, retrospective | About 2 hours |

Jump to the part that matches your work, or do all three in order.

:::note[Before You Start]
Each part is a new project. Give each its own Git repository with at least one
commit, then [install BMad and run `bmad setup`](./install-bmad.md) in it. In
one shared repository, a later part would build on the code an earlier part
left. Parts 2 and 3 build Python apps, so have Python 3 installed too.
:::

## Terms You'll See

| Term | Meaning |
| --- | --- |
| Initiative | The folder that holds all the planning for one app. |
| Epic | One large part of an app, made of stories. |
| Story | One small piece of work you can build in a single session. |
| Built | The code for a story is written, tested, and committed, ready for you to check. |
| Done | You checked a built story and told Sofia, who marks it done. |
| Step-by-step, freeform or fast | Step-by-step and freeform go through each section with you; fast drafts everything for you to correct. This walkthrough always picks fast. |

## How the Steps Work

Most steps follow the same pattern:

1. Ask `/bmad What's next?`
2. BMad suggests the next skill. Say "Yes," unless the step gives you a
   different reply. If it asks whether to start the skill here or in a fresh
   session, say "Start it here."
3. The skill asks for something. If the step has a text block, paste it.
4. Answer its other questions, using the notes in the step.

The first step of each part uses its own prompt instead of `What's next?`.
Start each part in a new session. Within a part, each step says whether to
stay in the session you're in or start a new one. BMad works out what's next
from the files you've already made.

The agents word their questions differently every time, so this is not a
script. Answer what they ask. The notes cover the questions that change the
outcome; for any other question, take the option the agent recommends.

Your coding tool asks before an agent runs a command it hasn't run before,
such as the tests or a browser check. Allow those, or the checks are skipped.

## Part 1: Quick Build

Work that fits in one session but isn't trivial goes straight to
`bmad-build`. It plans the work, writes it, checks it, and commits it, with no
planning documents and no initiative.

The work is a web page that shows how much a meeting is costing, live.
Everyone has sat in a meeting that should have been an email. Ask:

```text wrap
/bmad I want a fun web page that shows how much a meeting is costing while it runs. What's next?
```

BMad suggests `bmad-build`, because one session can do this. Say "Yes." The
build may first ask whether the work belongs to an initiative; say "Loose."
Paste this with your first answer, so the build plans from your details:

```text wrap
I type how many people are in the meeting and their average hourly pay.

I press Start, and a big number counts up the cost, second by second.

Buttons to pause and reset.

When it passes 100, 500 and 1,000, show a funny message.

One page that opens in my browser. Nothing to install.
```

If it shows a plan, say "Approved." A change of about 100 lines or fewer goes
straight to the code without one. You end up with a working meeting cost timer
that opens in your browser.

## Part 2: Product Owner Route

A web app with a few features is too big for one session, but one clear idea
doesn't need a PRD, UX design, or architecture. Sofia, the Product Owner
(`bmad-agent-po`), writes the requirements straight from your idea and splits
them into stories. Then you build them one at a time.

### 1. Write the Requirements and Stories

Create the initiative:

```text wrap
/bmad I'm starting a small meeting room booking web app as a hobby project. Create an initiative called meeting-room-booker.
```

In the same session, ask `/bmad What's next?`. BMad suggests Sofia; say "Yes."
She turns your idea into a numbered list of requirements, then splits the work
into stories. When she asks what you want to build, or starts asking her own
questions about it, paste:

```text wrap
A simple web page where office staff can see which meeting rooms are free today, and book one.

Five rooms: Room 1-5, seating 4, 4, 6, 8 and 12.

To book, you click a free slot and give your name, a meeting title and a length from 30 minutes to 2 hours.

Two bookings in the same room must never overlap. A meeting ending at 11:00 and one starting at 11:00 is fine.

If two people book the same slot at the same moment, one wins and the other sees "This slot has just been booked."

Tech: Python with FastAPI, a SQLite database, running on my own computer.

Not included: login, repeat bookings, editing, cancelling, time zones, mobile.

It's a hobby project.
```

Then answer her:

- When she lists the guesses she made, say "All fine."
- When she asks how to split the work, say "Straight into stories, no epics.
  Three or four small ones. Make the first one a thin slice that works end to
  end." Without this, she would split the work into epics.
- When she shows the stories and asks to save them, say "Yes."

The initiative now holds numbered requirements and the stories in the order to
build them.

### 2. Build Story 1

In a new session, ask `/bmad What's next?`. BMad suggests `bmad-build` for
story 1; say "Yes." Then:

- If it says there are uncommitted changes, such as the BMad setup files, say
  "Commit them first."
- If it shows its plan, say "Approved."

You get working code, tested and committed, and story 1 is marked built. To
see it, ask "How do I run the app?" It gives you the command that starts it
and the address to open in your browser. Start it, book a free slot, and
reload the page to check the booking is still there.

### 3. Mark Story 1 Done

In a new session, ask `/bmad What's next?`. BMad suggests marking story 1
done with Sofia once you've checked it in your browser. It may also offer a
code review, which has more agents check the code; marking it done tells Sofia
it works. Say "I checked it in my browser. Mark it done with Sofia."

Story 1 is done, and story 2 is next. Keep asking `/bmad What's next?` for
story 2 onward.

## Part 3: Full Route

Now the same idea as a real company tool, close to the
[room booker](./how-bmad-works.md#the-example-app) the rest of these docs use.
More people, more screens, and two roles, staff and office managers, mean more
can go wrong, so each planning step catches something the others would miss.
Then you build one
epic and judge it.

Here UX runs before Sofia writes the initiative, so its files feed her
requirements. [Plan a Feature as a Team](../scenarios/plan-a-feature-as-a-team.md)
shows the other order, where Sofia writes and slices first.

### 1. Start a New Initiative

```text wrap
/bmad Start a new initiative called company-room-booking. It's the meeting room booker grown into a tool for a whole company. I want the full path: brief, PRD, UX, then initiative, epics, architecture, stories and build.
```

The new initiative becomes the active one, so BMad works on it by default.
Part 2's initiative stays as it was. BMad may go straight on to the brief.

:::tip[Outside This Walkthrough]
You don't need to list the documents. Tell John, the Product Manager, what
you're trying to achieve, and he proposes the planning document that fits and
says why. Part 3 names the brief and the PRD so every reader gets the same run.
:::

### 2. Write the Brief

A brief is a one- or two-page summary of the product, why it matters, and who
it's for. Mary, the Business Analyst (`bmad-agent-analyst`), writes it. If she
hasn't started already, ask `/bmad What's next?` in the same session; BMad
suggests her; say "Yes." When she asks you to describe the product, paste:

```text wrap
I'd like a brief, and let's go fast.

The idea: a meeting room booking tool for our whole company. About 300 staff across three offices.

The problem: people waste time hunting for rooms, rooms get double-booked, and booked rooms often sit empty because nobody turns up.

Who it's for: all staff, plus office managers who look after the rooms.

What success looks like: no double bookings, and anyone can find a free room in seconds.

Not in the first release: checking in at the room to free rooms nobody turns up for.

It's an internal tool.
```

- Answer her questions as best you can, inventing sensible details if you
  need to. If she asks about linking to the company calendar, say "No,
  standalone."
- When she walks through her guesses or her reviewers' findings, take her
  suggestions. If she shows a table of wording edits, say "Apply them all."
- When she shows the draft, say "Make it final."

### 3. Write the PRD

A PRD (product requirements document) says in detail what the product must
do. In the same session, ask `/bmad What's next?`. BMad suggests John, the
Product Manager (`bmad-agent-pm`); say "Yes." He may ask a few questions
first. Paste this, with the details below it:

```text wrap
Build the PRD from the brief, and let's go fast.

No accounts or passwords in the first release. The offices, rooms, and people are already loaded, each person with a home office and some marked as office managers. You use the app by picking your name.

Each person sees their own bookings in a built-in calendar, by day and by week.

Each office has its own rooms. Staff see their own office first.

Office managers can add, edit and close rooms.

Works on a laptop and a phone.

Tech: Python with FastAPI and a SQLite database, running on my computer.
```

The details:

- Offices: London, Manchester, and Leeds, with 10 to 15 rooms each.
- A booking has a room, time, length (15 minutes to 4 hours), title, and
  attendees.
- Overlaps are never allowed.
- Anyone can see a booking's room, time, title, and who booked it.
- Check-in, visitors, catering, desk booking, and links to outside calendars
  are not included.

If he points out that 300 staff can't reach an app on your computer, say "My
computer is for building and testing. Leave hosting to the architecture." If
he points out that anyone can pick anyone's name, say "That's fine for the
first release. Sign-in comes later." When he shows the draft or starts
walking through his guesses, say "Make it final." He records the guesses you
skip as open assumptions.

### 4. Design the UX

UX design covers how the app looks and how people use it. In the same
session, ask `/bmad What's next?`. BMad suggests Sally (`bmad-agent-ux-designer`),
who coaches UX through `bmad-facilitate`; say "Yes." It works from your brief and PRD.
When it asks how the app should look and work, paste:

```text wrap
Let's go fast. It's an internal tool.

Main screen: today's rooms in my office, free and booked, like a calendar.

Booking takes three taps or fewer.

On a phone, show the next free rooms as a list, not a calendar.

A My bookings calendar for each person, by day and by week.

An admin screen for office managers to manage rooms.

Use our company colors: navy and white.
```

- If it asks about the front end, say "No preference, keep it simple."
- When it walks through its decisions, take its suggestions.
- When it offers a review and mock-ups, say "No."

You get `DESIGN.md` for how the app looks and `EXPERIENCE.md` for how it
works.

### 5. Write the Requirements and Split Them into Epics

In a new session, ask `/bmad What's next?`. BMad suggests Sofia; say "Yes."
She turns the brief, PRD, and UX into numbered requirements in the
initiative, then splits the work into epics.

- When she lists the guesses she made, say "All fine."
- If she asks where the list of people comes from, say "A seed file for now."
  For anything else she asks you to decide first, take her recommendation.
- When she asks whether to split the work into epics now, say "Yes. Make the
  first epic offices and rooms, because nothing can be booked until the rooms
  exist. Put deployment in a later epic of its own." Without the last
  sentence, epic 1 can only close once the app is deployed.
- When she proposes the epics, such as offices and rooms, booking, and the
  calendar, say "Looks good, save it." She commits the plan.
- If she offers to start the architecture, say "Not now." You'll do that in a
  new session.

### 6. Settle the Architecture

Architecture is the set of technical rules every epic follows, so parts built
separately fit together. In a new session, ask `/bmad What's next?`. BMad
suggests Winston (`bmad-agent-architect`), who runs `arch-spine`. Your epics
all share the people and rooms, the booking rules, and the calendar, so they
need agreed rules before anything is built. Say "Yes." When it asks whether to coach and
what you need besides the document, paste:

```text wrap
Let's go fast. I only need the architecture document, nothing else.

This is a walkthrough, so please skip the reviewer gate.
```

:::caution[Keep "skip the reviewer gate"]
Without it, three reviewer agents check the draft, which can take more than 20
minutes. On a real project you would let them run. If reviewers start anyway,
say "Stop. Skip the reviewer gate."
:::

- When it shows the draft and asks you to confirm its guesses, such as who
  can reach the app or the front-end library, say "Fine."
- If it offers slides or diagrams, say "No."
- When it offers to hand the document to Sofia, say "Yes." If she flags
  anything in your plan that conflicts with the architecture, say "Side with
  the architecture." If she goes on to refine the first epic, say "Commit it.
  I'll refine the epic in a new session."

The architecture document is now linked to your epics.

### 7. Plan the First Epic's Stories

In a new session, ask `/bmad What's next?`. BMad suggests Sofia, to refine the
first epic and plan its stories; say "Yes."

- When she lists the epic's open questions, each with the answer she
  recommends, say "Go with your picks."
- When she proposes the stories, say "Two stories only, to keep the
  walkthrough short. Both run on my computer, with no deployment yet."
  Without the last sentence, she may put a production deployment in story 2,
  which you can't build here.
- When she shows the stories and asks to save them, say "Yes."

### 8. Build Both Stories

:::tip[Skip Duplicate Tests]
Builds test thoroughly. To keep one test per distinct behavior, add this team
file before your first build, as `_bmad/custom/bmad-build.toml`:

```toml
[workflow]
persistent_facts = [
  "Test policy: one test per distinct behavior. Merge rows of the I/O and edge-case matrix that would need the same test, and say in the plan's test task that no test may repeat what another test already proves.",
]
```

[Customize BMad](../customize/customize-bmad.md#customize-a-workflow) explains
these files.
:::

Do this once per story. In a new session, ask `/bmad What's next?`. BMad
suggests `bmad-build` for the next story; say "Yes." Then:

- If it says there are uncommitted changes, such as the BMad setup files or
  the team file from the tip, say "Commit them first."
- If it shows its plan, say "Approved."

To see the app, ask "How do I run the app?" Run the commands it gives you and
walk the checks the build lists, in your browser at laptop width and at phone
width (your browser's device mode). Sofia relies on this check when she checks
Done when at the close. Then, in a new session, ask `/bmad What's next?`. BMad
suggests checking the story by hand, sometimes a code review, and marking it
done with Sofia; say "I checked it at laptop and phone width. Mark it done with
Sofia." Repeat the step for story 2.

### 9. Run the Retrospective, Then Close the Epic

Once both stories are done, run the retrospective, which judges the finished
epic as a whole against what it was meant to deliver. In a new session:

```text wrap
/bmad-agent-dev run the retrospective on the offices and rooms epic
```

It may first ask what to look at harder; say "None." It shows its findings,
action items, and a verdict, then offers decision records and a team
discussion. Say "Accept the verdict. No decision records." A plain "Accept"
can also write the decision records it offered. The retrospective is saved in
the epic's folder.

Then, in a new session, have Sofia validate the epic against its Requirements
and Done when, and close it, as in
[Finish an Epic](../learn/finish-an-epic.md):

```text wrap
/bmad-agent-po close the offices and rooms epic
```

She checks each item of Done when first. If she says the epic needs the
deployed app, say "Close it for running on my computer and move deployment to
a new epic." If an item hasn't been checked, such as the phone width, check it
now and tell her what you saw. Then confirm. Keep asking `/bmad What's next?`
for the next epic.

## What You Built

A one-page app built in a single session, a hobby app built story by story
from Sofia's requirements, and the first epic of a company tool, planned from
a brief through architecture, built, judged, and closed. The planning grew with
the work: none for the timer, Sofia's requirements for the hobby app, and
every planning document for the company tool.

[Walk Through an Existing Codebase](./walk-through-an-existing-codebase.md)
picks up the company tool once it is finished, as code you inherit.

:::tip[Key Takeaways]
Ask `/bmad What's next?` whenever you are unsure; BMad reads the files you
have made and suggests the next step. Start each step that says so in a new
session, so the agent works from the files and not from an old conversation.
:::
