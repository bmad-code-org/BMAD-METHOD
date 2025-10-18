# BMAD Method - Codex Instructions

## Activating Agents

BMAD agents, tasks and workflows are installed as custom prompts in
`$CODEX_HOME/prompts/bmad-*.md` files. If `CODEX_HOME` is not set, it
defaults to `$HOME/.codex/`.

### Examples

```
/bmad-bmm-agents-dev - Activate development agent
/bmad-bmm-agents-architect - Activate architect agent
/bmad-bmm-workflows-dev-story - Execute dev-story workflow
```

### Notes

Prompts are autocompleted when you type /
Agent remains active for the conversation
Start a new conversation to switch agents
