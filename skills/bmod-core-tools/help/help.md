# BMad Core Tools knowledge

This document covers the skills of the `core-tools` module: what each one is for and when to recommend it.

## How the core tools fit

The core tools belong to no phase and no path. Each stands alone and works with or without any other module. Suggest one whenever it would help: before, during, after, or entirely outside another module's flow. Never present one as a required step. A project may hold only some of these skills: recommend from what is installed.

## Initiatives

An initiative is one body of work of any kind: a product, a feature, a book, a set of art assets. Its folder under `output_folder` holds what every module's skills write for that work. `active_initiative` under `[core]` in `_bmad/custom/config.user.toml` names the folder in use; the file is personal, so each person can work on a different one. With none active, work is written loose to `{output_folder}/`, and some skills first ask whether it belongs to an initiative. The `bmad` skill shows, switches, creates, or clears the active initiative. What goes inside the folder is up to each module: its help says.

## Start here

- No idea yet, or wants more and better ideas on a topic → `bmad-brainstorming`.
- Has an idea and is not sure it holds up → `bmad-forge-idea`.
- Needs facts from outside before deciding (a market, a technology, competitors, what users say), has a research report to make usable, or wants their own code researched (how something works, why it is built that way, the code a ticket depends on) → `bmad-deep-recon`.
- Has a piece of work and wants it better:
  - They have a draft in front of them (theirs or the model's) and want it pushed further, or want a critique method run on it → `bmad-advanced-elicitation`. It starts only by name: tell them to say "advanced elicitation", with the method if they have one in mind.
  - They ask for a review of a diff, a file, or a document → `bmad-review`.
  - They want several points of view arguing it out, a roundtable, or a focus group of their customers → `bmad-party-mode`.
- Has large or raw input:
  - A transcript, a chat or email thread, a voice memo, or a long document they want what matters from (decisions, action items, key points) → `bmad-ingest`.
  - A long document the team will keep and agents will work from (a large PRD, architecture or manual), or one already sharded that they want to change → `bmad-shard-pro`.
  - About to start a PRD, brief, architecture or tickets with large inputs: suggest preparing them first, raw inputs through `bmad-ingest` and long documents through `bmad-shard-pro`, so the planning skill reads short notes and only the parts it needs.
  - A sharded document is the input to another skill: give that skill the folder's main file, named after the folder, which links to every shard.
- BMad itself needs attention:
  - Something was installed or updated, or a skill reports that BMad is not set up or a BMad script was not found → `bmad setup`.
  - "What do I have, and is it current?" → `bmad status`.
  - Which initiative is active, or they want to switch, create, or clear one → `bmad`.
  - They want a skill or an agent to behave differently, or to use the team's template → `bmad-customize`.
  - They ask what a BMad module is or how to make one → `help/modules.md`.

## The skills

| Skill | For | Good to know | Writes |
|---|---|---|---|
| `bmad-brainstorming` | A coached session that pushes well past the obvious ideas. | The user picks who supplies the ideas: themselves, both, or the skill alone. It does not judge ideas until asked to converge. Sessions resume. | `{output_folder}/{active_initiative}/brainstorm-<topic>/`, or under `{output_folder}/` for loose work, with `brainstorm.html` and, on request, `brainstorm-<topic>.md`: the chosen ideas, ready as input to any installed planning skill. |
| `bmad-forge-idea` | Questions one half-formed idea hard until the user can act on it or drop it. | Any idea, not only products, including a change to an existing project. It ends hardened, killed, or clearer, and all three are good outcomes. Not for generating ideas or for outside facts. | `{output_folder}/{active_initiative}/forge-<slug>/`, or under `{output_folder}/` for loose work, with `forge-report.html` and, when the idea hardens, `forge-<slug>.md`: the surviving decisions, ready as input to any installed planning or build skill. |
| `bmad-deep-recon` | Research that serves a decision, with cited sources found now, never from memory. | It can draft a prompt for the user's own research tool, process a finished report, or run the research here. It can also choose between candidates, or answer questions about this repository from its code and git history. | `{output_folder}/{active_initiative}/research-<topic>/`, or under `{output_folder}/` for loose work, with `brief.md` and `research-<topic>.md`, which is input for whatever skill acts on the decision. Codebase research also writes each ADR the user approves, beside the code it governs. |
| `bmad-advanced-elicitation` | Pushes a draft off its first answer and proposes a revision. | It names the draft and where it is weak and starts right away: a best-fit critique method and a wildcard (pre-mortem, steelman, first principles, red team, and more) as independent readers, plus an open push for a single choice or a second method for a document, then one proposed revision with each push's findings. Nothing changes unless the user accepts. It starts only when named, and a method named when invoking it runs straight away. | `{output_folder}/{active_initiative}/elicitation-<topic>/`, or under `{output_folder}/` for loose work, with each push's findings and a report of every round. The work itself changes only where the user accepts. |
| `bmad-review` | Independent review lenses over any diff or document: adversarial, edge cases, verification gaps, structure, prose. | It runs only when the user asks and says "review". Acting on earlier findings is a change, not a review. No severity ranking. | The report in chat, or a file when the project sets a report path. |
| `bmad-party-mode` | A group conversation between agents or personas, with the user in the room. | It works alone or beside any skill. Custom parties, a default party, and memory are all configurable, and a module can ship a cast. It debates and does not verify. | On request, a keepsake `{output_folder}/{active_initiative}/party-<slug>/party-<slug>.html`, or under `{output_folder}/` for loose work. Memory under `{output_folder}/party-mode/memories/`. |
| `bmad-shard-pro` | Makes a long markdown or text document cheap for an agent to navigate: leaves it, adds a contents list, or splits it word for word into shards. | It may recommend not splitting, and never rewrites content. Later changes go through the skill. | In the document's own folder: a main file named after the folder that links to every shard, the shards, and the frozen original in `.source/`. |
| `bmad-ingest` | Turns raw input into a cited note an agent or person acts on instead of the raw: decisions, action items, open questions, key points. | The note's shape comes from a template; teams and modules add their own. Every item points back to the raw, and a review pass checks it. Other skills can call it on their inputs. | The original, unchanged, in `{output_folder}/raw/`; the note in the calling skill's folder, such as a PRD's `sources/`, else `{output_folder}/notes/`. |
| `bmad-customize` | Changes how an installed skill or agent behaves without editing it: persona, standing facts, templates, output paths, steps on completion. | Team overrides are committed and shared; personal ones are not. It offers only what the target skill exposes. Central config is edited by hand. | `{project-root}/_bmad/custom/{skill-name}.toml` for the team, `{skill-name}.user.toml` for one person. |

## `bmad`: setup, status, and help

- `bmad setup` creates and repairs `{project-root}/_bmad`, including the shared scripts other skills call, and asks each installed module's new configuration questions. Recommend it after anything is installed or updated.
- `bmad status` changes nothing. It reports what is installed, what is missing or out of date, and the one command to run next.
- Either takes a module code, such as `bmad setup core-tools`, to cover that module only.
- To add a module that is not installed, such as the Test Architect, run `npx skills add bmad-code-org/bmad-method-test-architecture-enterprise`, then `bmad setup tea`.
- BMad is installed per project. To use it in another repository, run `npx skills add bmad-code-org/BMAD-METHOD` there, then `bmad setup`.

## More detail

This document should be enough to route the user and say what to do next. Each topic file below sits in this folder and goes deeper on one subject. Read one only when the question is about that subject, using the path the knowledge script lists for it. For how one skill behaves in detail, that skill's own files are the last resort.

| Topic file | Read when the user asks about |
|---|---|
| `help/advanced-elicitation.md` | How to start and aim `bmad-advanced-elicitation`, what it runs when no methods are named, what comes back, default and custom methods, when a plain "push harder" is enough. |
| `help/party-mode.md` | What party mode is good for alone or with other skills, custom parties, the default party, memory, parties that come with a module. |
| `help/research.md` | Getting the most from `bmad-deep-recon` and which of its services to use. |
| `help/customization.md` | How overrides work: team or personal file, how they merge, central config, an override that is not applied, resetting. |
| `help/team-adoption.md` | Making a whole team's BMad follow shared rules, tools, templates, and publishing steps. |
| `help/ingest.md` | Processing transcripts, threads, recordings or long reports, ingest's templates and adding them, where the original and the note go, ingest inside a PRD or other work, sensitive recordings. |
| `help/shard-pro.md` | Whether to shard a document, contents list or split, how a sharded document works, `.source/`, changing one, handing one to another skill. |
| `help/modules.md` | What a BMad module is, each file in one, a single-skill module, a module that only ships personas and parties, building one. |

## When this document is not enough

For a `core-tools` question this document, its topic files, and the installed skills cannot answer, fetch the documentation site at `https://docs.bmad-method.org/` and follow the pages relevant to the question. The source repository it links to is the final authority on how anything actually behaves.
