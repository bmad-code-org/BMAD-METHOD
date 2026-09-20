# Prototyping with the method

Prototypes are underused, in hobby work and in the enterprise alike. Recommend one readily. The method has no prototype phase and needs none: a prototype is a fast, cheap way to learn, and what it teaches is some of the best input `bmad-spec` can get. Current models can produce an impressive first version from one prompt.

## What a prototype is good for

- **Is it worth doing?** Putting something real in front of users or stakeholders gets feedback within days, without the overhead of planning first.
- **Is it feasible?** It proves out a risky technique, integration, or performance question before anyone commits to it.
- **How complex is it really?** Building a slice shows where the effort is.
- **What don't we know?** Unknowns surface when something runs. They rarely surface in a document.
- **Was the idea any good?** Finding out that a good-sounding idea is a bad one is a successful prototype. It saved the cost of building it.

## Who can prototype

Anyone, not only engineers. A product manager, designer, product owner, or analyst can mock up or prove out an idea with an agent and bring the result to the team. When a non-engineer asks whether they can, the answer is yes, and a throwaway prototype needs no setup or planning skill first.

## Greenfield and existing codebases

Both work. In an existing codebase, a prototype on a branch shows how a change sits against the real system and what it touches. Treat it as a throwaway unless the team decides otherwise: prototype code written to learn fast seldom meets the codebase's standards.

## Ways to prototype

| The user wants | Recommend | Because |
|---|---|---|
| Something running fast, expected to be thrown away | Prompt it directly, no skill | For a throwaway, the smallest path is no path. |
| A fast first version with a plan to approve, a review, and a commit | `bmad-build` with a one-line prompt | It accepts free text however brief. In an existing codebase it investigates the code first, so the prototype fits what is there. |
| To see the screens and flows before any code | `bmad-ux` | It can produce HTML mocks of key screens and Excalidraw wireframes alongside its two design files. |
| A technical unknown answered from outside sources instead of by building | `bmad-deep-recon` (core tools), if installed | Some feasibility questions are research, not code. |

## After the prototype: throw it away or keep it

Ask the user to decide this on purpose. The outcome to avoid is a prototype that becomes the real product with nobody deciding it should, and with no spec.

- **Throw it away.** The prototype was research. Have the user note what it taught them: what worked, what surprised them, what users said, what they would do differently. Feed those notes, and the prototype itself if useful, to `bmad-spec`, or to `bmad-product-brief` first when the picture is still loose. Then build cleanly, one story at a time. This is the usual choice in an enterprise codebase and whenever a non-engineer built the prototype.
- **Keep it.** Treat it as an existing codebase (see `help/existing-codebase.md`): `bmad-project-context` to record the rules agents must follow, `bmad-architecture` to ratify the decisions worth keeping and name what is still open, then `bmad-spec` for the rest of the work.
- **Drop the idea.** The prototype showed it is not worth doing. Nothing more is needed.

## Why plan at all after a good prototype

A first version is rarely where a project goes wrong. Trouble starts several sessions later, when each new session does not know why earlier choices were made and the parts stop fitting together. The spec and the architecture decisions exist to prevent that. For work that one or two sessions will finish, the prototype may be all the user needs.

## A prototype and the analysis skills

A prototype answers questions by building. `bmad-prfaq` answers them by arguing the concept and researching the market claims. They complement each other: a prototype shows whether people want the thing and whether it can be built, and the PRFAQ tests whether the business case holds. When the stakes are high, the prototype's findings make the PRFAQ, the brief, or the PRD sharper.
