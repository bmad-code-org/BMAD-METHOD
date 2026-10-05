# Outside references

Read this when the user asks where the official skill specification is, how a particular harness loads skills, or wants to read the sources BMad's conventions build on. Give the link and one line on what it covers; do not fetch pages to answer questions these help files already answer.

| Resource | What it covers |
|---|---|
| Agent Skills specification: <https://agentskills.io/specification> | The open `SKILL.md` format BMad skills follow: `name` and `description` rules, optional keys, the `scripts/`, `references/` and `assets/` folders, progressive disclosure, the 500-line guidance. BMad uses `name` and `description` only and treats `allowed-tools` as the host's concern. |
| Agent Skills overview: <https://agentskills.io/> | What skills are and which agents support the format. |
| Anthropic, Agent Skills: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview> | The three-level loading model (metadata, instructions, resources on demand) and where skills work across Anthropic products. |
| Anthropic, skill authoring best practices: <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices> | Concise writing, degrees of freedom, third-person descriptions, one-level-deep references, building evaluations first. Several of BMad's canon rules are rewrites of these in BMad's terms. |
| Anthropic skills repository: <https://github.com/anthropics/skills> | Example skills and the skill-creator skill whose eval loop the skill-creator approach follows. |
| Claude Code skills: <https://code.claude.com/docs/en/skills> | Where Claude Code loads skills from, its frontmatter extensions such as `disable-model-invocation`, slash invocation, and dynamic context. |
| Codex and ChatGPT skills: <https://learn.chatgpt.com/docs/build-skills> | How Codex loads skills from `.agents/skills`, explicit versus implicit invocation, and its description budget. |
| Cursor rules: <https://cursor.com/docs/context/rules> | The `.mdc` rule format Smithy converts from: `alwaysApply`, `description` and `globs`. |
| The `skills` CLI: <https://github.com/vercel-labs/skills> | `npx skills add`, the installer BMad uses, with its agent paths and options. |
| Skills directory: <https://skills.sh/> | A directory of installable skills, useful for seeing what exists before building. |
| Superpowers: <https://github.com/obra/superpowers> | A skills-based methodology whose writing-skills guidance informed some of BMad's rules. |

BMad's own conventions are in these help files and in Smithy's canon; they do not require any page above to be read.
