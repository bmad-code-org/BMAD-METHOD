---
title: 'Walk Through Three Routes'
description: 'Tutorial: build three new projects of different sizes, from a quick build to the full planning route, and see how BMad sizes the planning to the work.'
---

This walkthrough builds three new projects of different sizes so you can see how BMad matches the amount of planning to the scope and risk of the work.

| Part | The work | Route | Time |
| --- | --- | --- | --- |
| [1. Quick build](#part-1-quick-build) | A single-page meeting cost timer | Straight to `bmad-build` | About 15 minutes |
| [2. Product Owner route](#part-2-product-owner-route) | A small web app with a few stories | Sofia, the Product Owner, then build | About 45 minutes |
| [3. Full route](#part-3-full-route) | A company tool with several epics | Brief, PRD, UX, epics, shared architecture, stories, one epic built, retrospective | About 2 hours |

Jump to the part that matches your work, or run all three in order.

:::note[Before You Start]
Each part is a separate new project. Give each part its own Git repository with at least one commit, then [install BMad and run `/bmad setup`](./install-bmad.md) inside it. Putting all three in one shared repository would cause later parts to build on top of earlier code. Parts 2 and 3 build Python apps, so make sure Python 3 is installed too.
:::

## Terms You'll See

| Term | Meaning |
| --- | --- |
| Initiative | The top-level folder that holds all the planning documents and tickets for one product or feature set. |
| Epic | One cohesive capability of an app, made up of one or a few stories. |
| Story | One bounded piece of user-facing behavior you verify end to end as one unit, even if building it takes more than one coding session. |
| Built | The code for a story is written, tested, reviewed, and committed, ready for you to check. |
| Done | You checked a built story yourself and told Sofia to mark it done. |
| Step-by-step, freeform, or fast | Step-by-step and freeform work through each section with you; fast drafts everything for you to correct. This walkthrough always picks fast. |

## How the Steps Work

Most steps follow the same pattern:

1. Ask `/bmad What's next?`
2. BMad recommends the next skill. Say "Yes," unless the step gives you a different reply. If it asks whether to start the skill here or in a fresh session, say "Start it here."
3. When the skill asks for details, paste the step's text block if one is shown.
4. Answer its follow-up questions using the notes in that step.

The first step of each part uses its own prompt instead of `What's next?`. Start each part in a new chat session. Within a part, each step notes whether to stay in the current session or open a fresh one. BMad determines what comes next from the files already in your repository.

Because agents phrase questions differently on each run, treat these notes as guidance rather than a literal script. Follow the notes for choices that change the walkthrough outcome, and accept the agent's recommended default for everything else.

Your coding tool asks permission before running commands it has not seen before, such as test suites or browser checks. Approve those commands so verification steps can run.

## Part 1: Quick Build

A single, self-contained change or small app goes straight to `bmad-build`. It plans the work, writes the code, runs its checks, and commits locally with no planning documents and no initiative folder.

The project is a single web page that shows how much a meeting is costing in real time. Start with:

```text wrap
/bmad I want a fun web page that shows how much a meeting is costing while it runs. What's next?
```

BMad recommends `bmad-build` because this is one self-contained build. Say "Yes." If `bmad-build` asks whether the work belongs to an initiative or has no active initiative, tell it there is no initiative for this standalone change. Paste these details with your first reply so it plans from your requirements:

```text wrap
I type how many people are in the meeting and their average hourly pay.

I press Start, and a big number counts up the cost, second by second.

Buttons to pause and reset.

When it passes 100, 500 and 1,000, show a funny message.

One page that opens in my browser. Nothing to install.
```

If it presents a plan, say "Approved." Very small changes (around 100 lines or fewer) go straight to code without waiting for plan approval. At the end you have a working meeting cost timer you can open in your browser.

## Part 2: Product Owner Route

A web app with several connected features needs ordered stories so each build fits cleanly into the last, but one clear hobby idea does not need a PRD, formal UX specs, or a shared architecture document. Sofia, the Product Owner (`bmad-agent-po`), turns your idea straight into numbered requirements and ordered stories, and you build them one at a time.

### 1. Write the Requirements and Stories

Create the initiative in a fresh repository:

```text wrap
/bmad I'm starting a small meeting room booking web app as a hobby project. Create an initiative called meeting-room-booker.
```

In the same session, ask `/bmad What's next?`. BMad suggests Sofia; say "Yes." She turns your idea into a numbered list of requirements and breaks the work into stories. When she asks what you want to build, paste:

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

Then guide her replies:

- When she lists the assumptions she made, say "All fine."
- When she asks how to split the work, say "Straight into stories, no epics. Three or four small ones. Make the first one a thin slice that works end to end." Without this, she would split the work into epics first.
- When she shows the stories and asks to save them, say "Yes."

Your initiative now holds numbered requirements and ordered stories ready to build.

### 2. Build Story 1

In a new session, ask `/bmad What's next?`. BMad suggests `bmad-build` for story 1; say "Yes." Then:

- If it reports uncommitted changes (such as BMad setup files), say "Commit them first."
- If it shows a plan, say "Approved."

You get working code, tested and committed, with story 1 marked `built`. To try it out, ask "How do I run the app?" Start the app with the command it gives you, open the address in your browser, book a free slot, and reload the page to confirm the booking persists.

### 3. Mark Story 1 Done

In a new session, ask `/bmad What's next?`. BMad suggests marking story 1 done with Sofia once you have verified it in your browser, and it may also offer an independent code review. Say "I checked it in my browser. Mark it done with Sofia."

Story 1 is now marked done and story 2 becomes ready. Repeat `/bmad What's next?` to work through the remaining stories.

## Part 3: Full Route

Now build the same concept as a company-wide tool, close to the [room booker](./how-bmad-works.md#the-example-app) used across these guides. Multiple offices, more screens, and two user roles (staff and office managers) mean more can collide, so each planning step catches decisions that later sessions would otherwise guess differently. At the end you build one epic and run its retrospective.

In this walkthrough, UX design runs before Sofia writes the initiative so her requirements draw from the finished screens. [Plan a Feature as a Team](../scenarios/plan-a-feature-as-a-team.md) shows the other order, where Sofia writes and slices the initiative first.

### 1. Start a New Initiative

In a fresh repository set up with BMad, start the initiative:

```text wrap
/bmad Start a new initiative called company-room-booking. It's the meeting room booker grown into a tool for a whole company. I want the full path: brief, PRD, UX, then initiative, epics, architecture, stories and build.
```

Creating the initiative sets it as active, so every planning document and ticket in this repository lands in that folder by default. BMad may move straight on to the brief.

:::tip[Outside This Walkthrough]
In real projects you do not need to name every document up front. Tell John, the Product Manager, what you are trying to achieve, and he proposes the planning document that fits and explains why. Part 3 names the brief and PRD so every reader gets the same run.
:::

### 2. Write the Brief

A brief is a one- or two-page summary of the product, why it matters, and who it serves. Mary, the Business Analyst (`bmad-agent-analyst`), writes it. If she has not started yet, ask `/bmad What's next?` in the same session and say "Yes." When she asks you to describe the product, paste:

```text wrap
I'd like a brief, and let's go fast.

The idea: a meeting room booking tool for our whole company. About 300 staff across three offices.

The problem: people waste time hunting for rooms, rooms get double-booked, and booked rooms often sit empty because nobody turns up.

Who it's for: all staff, plus office managers who look after the rooms.

What success looks like: no double bookings, and anyone can find a free room in seconds.

Not in the first release: checking in at the room to free rooms nobody turns up for.

It's an internal tool.
```

- Answer her follow-up questions with sensible details. If she asks about integrating with a company calendar, say "No, standalone."
- When she reviews her assumptions or reviewer findings, accept her suggestions. If she shows a table of wording edits, say "Apply them all."
- When she presents the draft, say "Make it final."

### 3. Write the PRD

A PRD (product requirements document) spells out what the product must do and what stays out of scope. In the same session, ask `/bmad What's next?`. BMad suggests John, the Product Manager (`bmad-agent-pm`); say "Yes." When he is ready for your inputs, paste this along with the details listed below it:

```text wrap
Build the PRD from the brief, and let's go fast.

No accounts or passwords in the first release. The offices, rooms, and people are already loaded, each person with a home office and some marked as office managers. You use the app by picking your name.

Each person sees their own bookings in a built-in calendar, by day and by week.

Each office has its own rooms. Staff see their own office first.

Office managers can add, edit and close rooms.

Works on a laptop and a phone.

Tech: Python with FastAPI and a SQLite database, running on my computer.
```

Include these specifics when asked (or paste them together with the block above):

- Offices: London, Manchester, and Leeds, with 10 to 15 rooms each.
- A booking has a room, time, length (15 minutes to 4 hours), title, and attendees.
- Overlaps are never allowed.
- Anyone can see a booking's room, time, title, and who booked it.
- Check-in, visitors, catering, desk booking, and external calendar links are not included.

If John points out that 300 staff cannot reach an app running on your laptop, say "My computer is for building and testing. Leave hosting to the architecture." If he flags that anyone can pick anyone else's name, say "That's fine for the first release. Sign-in comes later." When he shows the draft or starts walking through assumptions, say "Make it final." He records any skipped items as open assumptions.

### 4. Design the UX

UX design defines how the app looks and how people move through it. In the same session, ask `/bmad What's next?`. BMad suggests Sally (`bmad-agent-ux-designer`); say "Yes." She reads your brief and PRD first. When she asks how the app should look and behave, paste:

```text wrap
Let's go fast. It's an internal tool.

Main screen: today's rooms in my office, free and booked, like a calendar.

Booking takes three taps or fewer.

On a phone, show the next free rooms as a list, not a calendar.

A My bookings calendar for each person, by day and by week.

An admin screen for office managers to manage rooms.

Use our company colors: navy and white.
```

- If she asks about the front-end stack, say "No preference, keep it simple."
- When she walks through her design decisions, accept her suggestions.
- When she offers a review pass and interactive mockups, say "No."

Sally produces `EXPERIENCE.md` describing how the app behaves, alongside `DESIGN.md` capturing visual tokens and styling rules.

### 5. Write the Requirements and Split Them into Epics

In a new session, ask `/bmad What's next?`. BMad suggests Sofia; say "Yes." She distills the brief, PRD, and UX documents into numbered requirements in the initiative, then splits the work into epics.

- When she lists the assumptions she made, say "All fine."
- If she asks where the list of people comes from, say "A seed file for now." For any other open decision, accept her recommendation.
- When she asks whether to split the work into epics now, say "Yes. Make the first epic offices and rooms, because nothing can be booked until the rooms exist. Put deployment in a later epic of its own." Without that last sentence, epic 1 cannot close until the app is deployed.
- When she proposes the epics (such as offices and rooms, booking, and the calendar), say "Looks good, save it." She commits the plan.
- If she offers to start the shared architecture right away, say "Not now." You will do that in a fresh session.

### 6. Settle the Shared Architecture

Shared architecture records the technical rules every epic must follow so separately built parts fit together cleanly. In a new session, ask `/bmad What's next?`. BMad suggests Winston (`bmad-agent-architect`) to write the shared architecture document, because your epics all share the same people, rooms, booking rules, and calendar data. Say "Yes." When he asks how fast to move and what you need besides the document, paste:

```text wrap
Let's go fast. I only need the architecture document, nothing else.

This is a walkthrough, so please skip the reviewer gate.
```

:::caution[Keep "skip the reviewer gate"]
Without that line, three reviewer agents audit the architecture draft, which can take more than 20 minutes. On a real project you would let them run. If reviewers start anyway, say "Stop. Skip the reviewer gate."
:::

- When he shows the draft and asks you to confirm his assumptions (such as access rules or front-end libraries), say "Fine."
- If he offers slides or extra diagrams, say "No."
- When he offers to hand the document to Sofia, say "Yes." If she flags any conflict between earlier notes and the architecture, say "Side with the architecture." If she starts refining the first epic immediately, say "Commit it. I'll refine the epic in a new session."

The shared architecture is now linked to your epics.

### 7. Plan the First Epic's Stories

In a new session, ask `/bmad What's next?`. BMad suggests Sofia to refine the first epic and plan its stories; say "Yes."

- If she asks whether to write an epic-level PRD with John or epic UX designs with Sally in a fresh chat first, say "Skip the epic PRD and fill the epic in from the initiative and UX, keeping it light for this walkthrough." Answer any remaining open questions directly using the simplest default.
- When she proposes the stories, say "Two stories, both running on my computer, with no deployment yet." Without that last phrase, she may include production deployment in story 2, which is outside this local walkthrough.
- When she shows the stories and asks to save the breakdown and refined story files, say "Yes."

### 8. Build Both Stories

Run this step once per story. In a new session, ask `/bmad What's next?`. BMad suggests `bmad-build` for the next ready story; say "Yes." Then:

- If it reports uncommitted changes (such as BMad setup files), say "Commit them first."
- If it shows its build plan, say "Approved."

:::tip[Want to tailor how builds run?]
If you ever want to adjust how `bmad-build` writes tests, handles review depth, or enforces team conventions, invoke `bmad-customize` and describe what you want changed. See [Customize BMad](../customize/customize-bmad.md) for examples.
:::

To verify the finished story, ask "How do I run the app?" Start the app and walk through the checks the build lists in your browser at both laptop width and phone width (using your browser's responsive device mode). Sofia checks those manual verifications before closing the epic. Then open a new session, ask `/bmad What's next?`, and say "I checked it at laptop and phone width. Mark it done with Sofia." Repeat the step for story 2.

### 9. Run the Retrospective, Then Close the Epic

Once both stories are marked done, run the retrospective to evaluate the finished epic as a whole against what it set out to deliver. In a new session, ask Amelia:

```text wrap
/bmad-agent-dev run the retrospective on the offices and rooms epic
```

She may ask whether you want any specific area examined closely; say "None." She reports her findings, action items, and a verdict, then offers to write decision records or hold a team discussion. Say "Accept the verdict. No decision records." (A plain "Accept" may also write the offered decision records.) The retrospective is saved inside the epic's folder.

Next, in a new session, ask Sofia to validate the epic against its requirements and completion criteria and close it, as described in [Finish an Epic](../learn/finish-an-epic.md):

```text wrap
/bmad-agent-po close the offices and rooms epic
```

She checks each completion criterion first. If she notes that the epic expects a deployed app, say "Close it for running on my computer and move deployment to a new epic." If any check (such as phone width) was not confirmed yet, verify it now and report what you saw, then confirm closure. Continue with `/bmad What's next?` to move on to the next epic.

## What You Built

You built a one-page timer straight through `bmad-build`, a small hobby app built story by story from Sofia's requirements, and the first epic of a company-wide tool planned from a brief through shared architecture, built, reviewed, and closed. The planning scaled with the risk and coupling of the work: none for the timer, requirements and stories for the hobby app, and full multi-role planning for the company tool.

[Walk Through an Existing Codebase](./walk-through-an-existing-codebase.md) picks up the finished company tool as inherited code you need to understand and extend.

:::tip[Key Takeaways]
Ask `/bmad What's next?` whenever you are unsure; BMad reads your project files and recommends the next step. Start each step in a fresh chat when noted so the agent works from your written files rather than stale conversation history.
:::
