---
title: ""
template: document-template
version: 1.1.0
description: "A new document template: the coaching for a document people talk through."
not_for: "Changing a template that exists (`bmad-customize`); one document, written once (run the closest template, or none)."
facilitation_order: [purpose-and-reader, sections, inputs, stance, done-when, writing, identity, rubric, companions, view, next]
rubric: rubric-document-template.md
output: "{project-root}/_bmad/custom/facilitate-templates/template-{slug}.md"
view: never
status: draft
created: ""
updated: ""
---

<!-- purpose: A template this skill runs from then on to coach anyone through one kind of document, such as an appraisal report or a patient intake, as an expert in that document would. -->

<!-- stance:
  - The user knows the document's trade; you know how a template steers a coach. Ask how an expert runs this conversation: what they ask first, which sections people get wrong, where they press and where they ease off, what only the client can say, what the reader needs to act.
  - Draw the sections from one real case the user has done or seen, not from a generic outline; a section the user cannot say a reader needs is cut.
  - The template is read in full on every run, so every line must change what the coach does.
-->

<!-- inputs: The document and who reads it; one real example or an existing form the user wants kept, asked for before drafting sections; who offers it (an agent, a team, everyone); where the file goes when the caller did not say. -->

<!-- writing:
  - The document is the template file itself, laid out as it will ship: frontmatter, the top comments, `# {title}`, then a `##` heading with one comment for each section the documents need. The parts below are what you settle, not headings in the file. Its frontmatter keys and comments are its content: write them in; they do not steer this run.
  - The frontmatter's `title: ""`, `status: draft`, `created: ""` and `updated: ""` belong to the documents it makes and stay as they are; write no `sources`. A part not yet settled holds `<!-- open: <part id> -->` where it goes, so a resumed run finds where it stopped, and the run is final when none is left. Close runs as for any document, scratch deleted included, but leaves `status` as it is.
  - A guess the user has not confirmed is tagged inside the comment it lands in. At polish, standing tags and open questions move into one comment above `purpose`, headed as notes for the template's owner, never into a `##` section.
  - Each comment says what goes in and how to coach it, never how to write well, and holds no example content, which the coach would copy. `{title}` is the only placeholder.
  - Promise nothing but markdown and the HTML view; other outputs do not exist yet.
-->

<!-- companions: When the rubric part calls for one, also write `rubric-{slug}.md` beside the template. Nothing else goes beside it. -->

<!-- done when: The template lists with no `order_problems` (`uv run {project-root}/_bmad/scripts/list_templates.py <its folder> --template <id>`), every heading has a comment saying what goes in, and a coach reading it alone would ask what an expert in the document asks. -->

<!-- next: Offer to try it: a run of the new template on a real case, then a change to the template from what the run showed. When an agent should offer it, name the agent in `agents:` and say the agent's owner wires it in. -->

# {title}

## Identity
<!-- The frontmatter that names the template: `template`, a kebab-case id; `version: 1.0.0`; `description`, one quoted line under about 80 characters saying what it is for, which every help listing shows; `not_for`, a quoted line naming what it is not for and the template to use instead; `agents`, the skills that offer it, when any; `guidance: guidance-planning` for plans, requirements and cases for a decision, which adds stakes levels, stable ids and pushing detail to the level below; `output` only when its documents always land in one place. Draft them from the parts settled before; the user confirms the id and the description. -->

## Purpose and reader
<!-- The `purpose` comment: the job or decision the document serves, and the reader who acts on it without the conversation. Ask who reads it and what they do next; a document with two readers is two templates, or one with a companion for the second. Done when one sentence says what the reader can do with it. -->

## Inputs
<!-- The `inputs` comment: what the coach must ask, records to ask for before anything is reconstructed from memory, and the facts only the user can know. Each one listed is asked in every mode but headless unless the user already gave it, so list only what must be asked. Then the `opening` comment, when the expert's first questions are not what the user is making and who it is for: at most two, the ones whose answers change how the rest is coached, such as which kind of case this is. -->

## Sections
<!-- The document's `##` headings, in the order the reader reads them, each with one comment: a line on what goes in, then how to coach it where the expert would: when to press and on what, when to ease off, what to ask for first. A comment can limit the answer: "The user must pick exactly one of: ..." or a list in a named file. `diagram:` and a Mermaid kind goes on a section a picture carries. A section not every document needs starts its comment `optional.` or `include when: <condition>.` A section assembled from the others, such as a summary or a glossary, starts its comment `built:` and comes after them in the order, because nothing can be asked for it until they settle. Then `facilitation_order`: every heading's id (lowercased, punctuation dropped, spaces as hyphens) in the order the coach takes them up, which may differ from the reader's order (a summary sits first and comes up last). Set `order: fixed` only when an earlier section must be settled before a later one is worked, as in a rehearsal, or appetite before solution; a request for freeform then runs step-by-step. Set `mode: freeform` only when the sections are independent and a brain dump usually fills several at once; without it a run starts step-by-step. A section comment that gives the coach a voice or method for that part is followed while the section is open. A long document gets a bare `## Table of Contents` right after the title. Done when the user agrees each section is one a reader needs and the coaching in it is what an expert would do. -->

## Stance
<!-- The `stance` comment: how the coach behaves across the document, from where the expert says people go wrong. One to three lines. -->

## Done when
<!-- The `done when` comment: the test that ends the questioning for the whole document, written as what a reader who was not there can do. A section whose own end is not obvious gets a `Done when ...` sentence in its comment. -->

## Writing
<!-- The `writing` comment: rules specific to this document, such as its length in words, its voice, the terms it must use, what it never contains. Leave out what any good document does. -->

## Rubric
<!-- optional. The review. The shipped general rubric judges any document on purpose, usability, earned length, honesty and fit; offer a `rubric-{slug}.md` only when this document's quality turns on something it misses, such as a figure that must reconcile or a claim that needs a source. A rubric file holds three to five numbered dimensions, each rated strong, adequate, thin or broken against the document's purpose and stakes, then "Then check the template's `Done when` lines." and a last line saying the reviewer writes `review-rubric.md` with a two-sentence verdict, the three fixes that matter most, and findings by dimension with severity, location and fix. The template names it in `rubric:`. -->

## Companions
<!-- optional. The `companions` comment: another file to write beside each document, for a different reader, when, and what it holds. -->

## View
<!-- optional. How the HTML view looks: `layout: slides` for slides, an HTML file beside the template with slots for a fixed layout, or a `layout` comment that briefs a page written for each document; `view: always` when the view is the deliverable. Most templates set none. -->

## Next
<!-- optional. The `next` comment: what the coach offers or does once a document is done, such as the template or skill that comes after it. -->
