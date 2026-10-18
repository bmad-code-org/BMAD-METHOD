# Step 3: Walkthrough

Give the block's link into the narrative, its content in that block's
shape.
{% if workflow.on_block_activation %}

{{ workflow.on_block_activation }}
{% endif %}

Suggest 1-3 moves that fit. Then stop. The named moves are not
exhaustive; if something else is more obvious, suggest that instead.
The user may choose something you did not suggest. Do what the user
says. Stay with the current block until the user explicitly says it
is done.

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

- **Thoughts:** In this session, look at the requested area and say
  what you think. Report concrete findings with clickable
  references. Do not use any formal review skills. Suggest it when
  something in the block looks off or the user pauses on a spot.
- **Second opinion:** The same question, in a fresh subagent that
  does not have this review's conversation. Do not use any formal review
  skills. Suggest it when your own read may be anchored by the review
  so far.
- **Formal review:** Use the most appropriate formal review skill
  available. If it's code and `bmad-code-review` skill is installed, prefer
  that unless the user says otherwise. Suggest it for the riskiest
  block of the change.
- **Test:** Help test the part under discussion. Identify useful checks
  and expected behavior, run what you can, and guide the user through
  observations that need them. Record what was actually tested, the
  results, and anything still unverified. Suggest it when behavior is
  easier to check than to reason out, or the tests do not cover it.
- **Drive:** Start the app and tell the user which buttons to push to
  see the target do its thing. Suggest it when the target is
  observable and the user has the app at hand.
- **Demo:** Exercise the change yourself and show the user what
  happened: screenshots or a transcript, in a rendered view the host
  offers; say which. Save them in the walkthrough folder and link
  them from the log. Suggest it when the target is observable and
  the user would rather watch than drive.
- **Draw:** Diagram the block's mechanism, showing only what the
  linked code does, in a rendered view the host offers; say which.
  Save the source in the walkthrough folder and link it from the
  log. Suggest it when the mechanism has several moving parts.
- **Wrap-up:** The review is finished. Guess the follow-through
  this work was for (e.g. merge the PR, write the review, commit
  and push if they edited) and ask the user if that is what they
  want. Do not do it until they say so. Do not end with only a
  summary in chat. Suggest it when every block has been gone
  through. {% if workflow.on_complete %}{{ workflow.on_complete }}{% endif %}
