# Step {NN}: {title}

{purpose: what this step produces and for whom, in one or two lines.}

## {body}

{Instructions as outcomes with their reason. Branch on the selector only where the branches differ:}

{% if workflow.{selector} == "{value}" %}
{instructions for this value}
{% else %}
{instructions for the other values}
{% endif %}

{An instruction a team may replace whole is a customization value, inserted where it runs:}

{{ workflow.{block} }}

{An agent-facing double-brace placeholder is kept out of the renderer:}

{% raw %}{{placeholder}}{% endraw %}

## Next

{Every step but the last ends with:}

Read fully and follow `{{ rendered("{next_step}") }}`.

{The last step ends with:}

{{ workflow.on_complete }}

Workflow complete.
