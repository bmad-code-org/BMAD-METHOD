# BMad Core Tools knowledge

This document covers the skills of the `core-tools` module: what each one is for and when to recommend it.

## How the core tools fit

The core tools belong to no phase and no path. Each stands alone and works with or without any other module. Suggest one whenever it would help: before, during, after, or entirely outside another module's flow. Never present one as a required step. A project may hold only some of these skills: recommend from what is installed.

## Start here

- No idea yet, or wants more and better ideas on a topic → `bmad-brainstorming`.
- Has an idea and is not sure it holds up → `bmad-forge-idea`.
- Needs facts from outside before deciding (a market, a technology, competitors, what users say), or has a research report to make usable → `bmad-deep-recon`.
- Has a piece of work and wants it better:
  - It was just produced in this conversation and they want it pushed further, or they name a critique method → `bmad-advanced-elicitation`.
  - They ask for a review of a diff, a file, or a document → `bmad-review`.
  - They want several points of view arguing it out, a roundtable, or a focus group of their customers → `bmad-party-mode`.
- BMad itself needs attention:
  - Something was installed or updated, or a skill reports that BMad is not set up or a BMad script was not found → `bmad setup`.
  - "What do I have, and is it current?" → `bmad status`.
  - They want a skill or an agent to behave differently, or to use the team's template → `bmad-customize`.
  - They ask what a BMad module is or how to make one → `help/modules.md`.

## The skills

| Skill | For | Good to know | Writes |
|---|---|---|---|
| `bmad-brainstorming` | A coached session that pushes well past the obvious ideas. | The user picks who supplies the ideas: themselves, both, or the skill alone. It does not judge ideas until asked to converge. Sessions resume. | `{output_folder}/brainstorming/brainstorm-{topic_slug}-{date}/`, with `brainstorm.html` and, on request, `brainstorm-intent.md`: the chosen ideas, ready as input to any installed planning skill. |
| `bmad-forge-idea` | Questions one half-formed idea hard until the user can act on it or drop it. | Any idea, not only products, including a change to an existing project. It ends hardened, killed, or clearer, and all three are good outcomes. Not for generating ideas or for outside facts. | A folder under `{output_folder}/forge/` with `forge-report.html` and, when the idea hardens, `forged-idea.md`: the surviving decisions, ready as input to any installed planning or build skill. |
| `bmad-deep-recon` | Research that serves a decision, with cited sources found now, never from memory. | It can draft a prompt for the user's own research tool, process a finished report, or run the research here. It can also choose between candidates. | `{planning_artifacts}/research/{research_type}-{topic_slug}-{date}/` with `brief.md` and `research.md`, which is input for whatever skill acts on the decision. |
| `bmad-advanced-elicitation` | Pushes the most recent output to be reconsidered and improved. | It offers critique methods such as socratic questioning, first principles, pre-mortem, and red team. Nothing changes unless the user accepts. Other skills call it at their pauses. | Nothing. It improves the work in place. |
| `bmad-review` | Independent review lenses over any diff or document: adversarial, edge cases, verification gaps, structure, prose. | It runs only when the user asks and says "review". Acting on earlier findings is a change, not a review. No severity ranking. | The report in chat, or a file when the project sets a report path. |
| `bmad-party-mode` | A group conversation between agents or personas, with the user in the room. | It works alone or beside any skill. Custom parties, a default party, and memory are all configurable, and a module can ship a cast. It debates and does not verify. | On request, a keepsake `.html` in `{output_folder}/party-mode/`. Memory under `{output_folder}/party-mode/memories/`. |
| `bmad-customize` | Changes how an installed skill or agent behaves without editing it: persona, standing facts, templates, output paths, steps on completion. | Team overrides are committed and shared; personal ones are not. It offers only what the target skill exposes. Central config is edited by hand. | `{project-root}/_bmad/custom/{skill-name}.toml` for the team, `{skill-name}.user.toml` for one person. |

## `bmad`: setup, status, and help

- `bmad setup` creates and repairs `{project-root}/_bmad`, including the shared scripts other skills call, and asks each installed module's new configuration questions. Recommend it after anything is installed or updated.
- `bmad status` changes nothing. It reports what is installed, what is missing or out of date, and the one command to run next.
- Either takes a module code, such as `bmad setup core-tools`, to cover that module only.
- BMad is installed per project. To use it in another repository, run `npx skills add bmad-code-org/BMAD-METHOD` there, then `bmad setup`.

## More detail

This document should be enough to route the user and say what to do next. Each topic file below sits in this folder and goes deeper on one subject. Read one only when the question is about that subject, using the path the knowledge script lists for it. For how one skill behaves in detail, that skill's own files are the last resort.

| Topic file | Read when the user asks about |
|---|---|
| `help/party-mode.md` | What party mode is good for alone or with other skills, custom parties, the default party, memory, parties that come with a module. |
| `help/research.md` | Getting the most from `bmad-deep-recon` and which of its services to use. |
| `help/customization.md` | How overrides work: team or personal file, how they merge, central config, an override that is not applied, resetting. |
| `help/team-adoption.md` | Making a whole team's BMad follow shared rules, tools, templates, and publishing steps. |
| `help/modules.md` | What a BMad module is, each file in one, a single-skill module, a module that only ships personas and parties, building one. |

## When this document is not enough

For a `core-tools` question this document, its topic files, and the installed skills cannot answer, fetch the documentation site at `https://docs.bmad-method.org/` and follow the pages relevant to the question. The source repository it links to is the final authority on how anything actually behaves.
