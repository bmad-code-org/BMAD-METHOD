# {Capability}

The outcome is {the artifact or change that exists when this is done}. {Who or what acts on it} does so without this conversation in the room, so it must {the bar: what has to be true of it for them to act}.

{{ workflow.{capability}_before }}

## What you cannot infer

- {An owner or domain specific the persona does not already carry.}
- {Wiring: a path under `{{ initiative_folder }}`, a format, a tool, a template reached as `{{ rendered("assets/<name>-template.md") }}`.}
- {A rule with a real consequence behind it, and the consequence.}

{Branch on a selector only where the branches differ:}

{% if workflow.{capability}_{selector} == "{value}" %}
{instructions for this value}
{% else %}
{instructions for the other values}
{% endif %}

{An instruction a team may replace whole is a customization value, inserted where it runs:}

{{ workflow.{capability}_{block} }}

{An agent-facing double-brace placeholder is kept out of the renderer:}

{% raw %}{{placeholder}}{% endraw %}

## Hand back

{What the user sees when it is done: where the output is, the one decision left to them, what to try next.}

{{ workflow.{capability}_after }}
