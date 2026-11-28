# Step 3: Walkthrough

Give the block's link into the narrative, its content in that block's
shape.
{% if workflow.on_block_activation %}

{{ workflow.on_block_activation }}
{% endif %}

On block 1, list the moves in one line so the user knows the
repertoire; past seven, name seven at random and say how many more
there are. On every block, suggest 1-3 moves that fit; when more fit
than you will name, prefer ones not yet suggested in this review.
Then stop. The named moves are not exhaustive; if something else is
more obvious, suggest that instead. The user may choose something you
did not suggest, or just ask a question: answer it in this session
with clickable references, without any formal review skill. Do what
the user says. Stay with the current block until the user explicitly
says it is done.

Do not add status chatter ("still current", "waiting on you") on
later turns unless the reviewer asks where they are.

If they reject a block's shape, rewrite that block in the shape they
describe, in both the session and the narrative, and record the
constraint in the log so it applies to every later block. Do not
present the same block a third time in a different shape without
being asked.

When they say the block is done:
{{ workflow.on_block_complete | default("
- present the next block first so they can keep going.
- then record that the previous block is done: check it
  in the narrative silently, and revise the remaining narrative if it
  needs to change.
- If the tree is dirty, ask the user whether to commit.
  A dirty tree is generally undesirable; the user can still move on.", true) }}

# Moves

A repertoire the user may select from. Do not start a move unless the user
picks it. Record the outcome in the review log and keep their place in
the review narrative.

{% for move in workflow.moves %}
{% if move.description %}
- **{{ move.name }}:** {{ move.description }}
{% endif %}
{% endfor %}
- **Wrap-up:** The review is finished. Guess the follow-through
  this work was for (e.g. merge the PR, write the review, commit
  and push if they edited) and ask the user if that is what they
  want. Do not do it until they say so. Do not end with only a
  summary in chat. Suggest it when every block has been gone
  through. {% if workflow.on_complete %}{{ workflow.on_complete }}{% endif %}
