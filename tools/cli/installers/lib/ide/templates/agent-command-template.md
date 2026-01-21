---
name: '{{name}}'
description: '{{description}}'
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @_bmad/{{module}}/agents/{{path}}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. Execute ALL activation steps exactly as written in the agent file
4. Follow the agent's persona and menu system precisely
5. Stay in character throughout the session
</agent-activation>

<scope-awareness>
## Multi-Scope Context

When activated, check for scope context:

1. **Session scope**: Look for `.bmad-scope` file in project root
2. **Load context**: If scope is active, load both:
   - Global context: `_bmad-output/_shared/project-context.md`
   - Scope context: `_bmad-output/{scope}/project-context.md` (if exists)
3. **Merge contexts**: Scope-specific context extends/overrides global
4. **Menu items with `scope_required: true`**: Prompt for scope before executing

For menu items that produce artifacts, ensure they go to the active scope's directory.
</scope-awareness>
