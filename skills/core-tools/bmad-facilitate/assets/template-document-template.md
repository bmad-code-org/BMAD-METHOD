---
title: ""
template: document-template
version: 1.2.0
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

<!-- opening: What the document is and who reads it, and one real example of it or the form in use today, to read before any section is drafted. -->

<!-- inputs: The document and who reads it; one real example or an existing form the user wants kept, asked for before drafting sections; who offers it (an agent, a team, everyone); where the file goes when the caller did not say. -->

<!-- writing:
  - The document is the template file itself, laid out as it will ship: frontmatter, the top comments, `# {title}`, then a `##` heading with one comment for each section the documents need. The parts below are what you settle, not headings in the file. Its frontmatter keys and comments are its content: write them in; they do not steer this run.
  - The frontmatter's `title: ""`, `status: draft`, `created: ""` and `updated: ""` belong to the documents it makes and stay as they are; write no `sources`. A part not yet settled holds `<!-- open: <part id> -->` where it goes, so a resumed run finds where it stopped, and the run is final when none is left. Close runs as for any document, scratch deleted included, but leaves `status` as it is.
  - A guess the user has not confirmed is tagged inside the comment it lands in. At polish, standing tags and open questions move into one comment above `purpose`, headed as notes for the template's owner, never into a `##` section.
  - Each comment says what goes in and how to coach it, never how to write well, and holds no example content, which the coach would copy. `{title}` is the only placeholder.
  - Promise nothing but markdown and the HTML view; other outputs do not exist yet.
-->

<!-- companions: When the rubric part calls for one, also write `rubric-{slug}.md` beside the template. Nothing else goes beside it. -->

<!-- done when: The template lists with no `order_problems` (`uv run "{project-root}/_bmad/scripts/list_templates.py" "<its folder>" --template <id>`), every heading has a comment saying what goes in, and a coach reading it alone would ask what an expert in the document asks. -->

<!-- next: Offer to try it: a run of the new template on a real case, then a change to the template from what the run showed. When an agent should offer it, name the agent in `agents:` and say the agent's owner wires it in. -->

# {title}

## Identity
<!-- The frontmatter that names the template:
  - `template`: kebab-case id; `version: 1.0.0`.
  - `description`: one quoted line under ~80 characters for help listings.
  - `not_for`: quoted line naming what it is not for and the template to use instead.
  - `agents`: skills that offer it, when any; `output`: only when documents always land in one place.
  - `guidance`: optional relative path to shared family rules; `rubric`: optional relative path or `rubric-general`.
  - `companions`: optional one-line list of extra files beside `{doc}`; `forbid_id_prefixes`: optional list of disallowed id prefixes; `lint`: optional relative script path or command hook.
  Draft these from the parts settled before; the user confirms the id and description. -->

## Purpose and reader
<!-- The `purpose` comment: the job or decision the document serves, and the reader who acts on it without the conversation. Ask who reads it and what they do next; a document with two readers is two templates, or one with a companion for the second. Done when one sentence says what the reader can do with it. -->

## Inputs
<!-- The `inputs` comment: what the coach must ask, records to check before reconstructing from memory, and facts only the user knows. Every listed item is asked in interactive modes unless already supplied, so keep the list minimal.
Then the `opening` comment: how an expert opens the conversation — routing questions that steer the session, records to request first, brain-dump cues, or a cold start. Omit `opening` when a plain invitation to share everything suffices. -->

## Sections
<!-- The document's `##` headings, in reader order, each with one coaching comment:
  - What goes in, when to press or ease off, and any `diagram:` kind or allowed-value list (`The user must pick...` or a source file).
  - Prefix optional or conditional comments with `optional.` or `include when: <condition>.`, and assembled summary/glossary sections with `built:` (placed after the sections they draw from).
  - Set `facilitation_order` in frontmatter using lowercased hyphenated heading ids (punctuation dropped), `order: fixed` when sequence cannot float, and `mode: freeform` only when sections are independent.
  - Give long documents a bare `## Table of Contents` heading after `# {title}`, and keep any section-level stance/method instructions in that section's comment.
  Done when the user agrees each section is needed by the reader and the coaching matches an expert. -->

## Stance
<!-- The `stance` comment: how the coach behaves across the document, from where the expert says people go wrong. One to three lines. -->

## Done when
<!-- The `done when` comment: the test that ends the questioning for the whole document, written as what a reader who was not there can do. A section whose own end is not obvious gets a `Done when ...` sentence in its comment. -->

## Writing
<!-- The `writing` comment: rules specific to this document, such as shape cues, voice, required terms, and what never belongs. Leave out what any good document does. -->

## Rubric
<!-- optional. The shipped `rubric-general` fits most documents; add a `rubric-{slug}.md` beside the template only when quality turns on domain checks it misses.
Write 3 to 5 numbered dimensions rated strong, adequate, thin, or broken against purpose and stakes, followed by "Then check the template's `Done when` lines." and a `review-rubric.md` output instruction (verdict, top 3 fixes, findings by dimension). Name the file in `rubric:`. -->

## Companions
<!-- optional. Frontmatter `companions: [...]` declares expected sibling files tracked at Resume, Progress, and Finalize; add a `companions` comment explaining when each file is written and what it holds. -->

## View
<!-- optional. How the HTML view looks: `layout: slides` for slides, an HTML file beside the template with slots for a fixed layout, or a `layout` comment that briefs a page written for each document; `view: always` when the view is the deliverable. Most templates set none. -->

## Next
<!-- optional. The `next` comment: what the coach offers or does once a document is done, such as the template or skill that comes after it. -->
