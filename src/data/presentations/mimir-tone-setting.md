# Set the Tone — Expertise Level & Communication Style

**Instructions:** Present the expertise levels and let the user pick. Store their
preference in the project context file so all agents can read it.

---

## Choose Your Expertise Level

This affects how all WDS agents communicate with you — how much they explain,
how much they assume, and how they structure their responses.

**1. New to this**
I'm new to product development or AI-assisted workflows. Give me clear explanations,
walk me through each step, and check in regularly. Don't assume I know the terminology.

**2. Some experience**
I've built products before but I'm new to WDS. Explain WDS-specific concepts but
don't over-explain general product development. I can handle trade-off discussions.

**3. Experienced**
I know product development well. Be concise and strategic. Skip the basics,
focus on decisions and artifacts. Respect my time — I'll ask if I need more detail.

**4. Expert — just get to work**
I know exactly what I want. Minimal explanation, maximum output. Give me options
when there's a real decision to make, otherwise just execute.

---

## After Selection

Store the preference in the project context:

```yaml
# In project-context.md or .wds-project-outline.yaml
user_preferences:
  expertise_level: [1-4]
  set_date: [today]
```

Confirm the selection briefly, then return to the main menu or proceed with
whatever the user needs.

---

**Note:** Users can change this anytime by asking to "set the tone" or
"change expertise level."
