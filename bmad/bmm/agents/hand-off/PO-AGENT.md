# PO Agent — Quickload & Conversation Guide

Purpose
-------
This folder contains a ready-to-use Product Owner (PO) agent prompt and a short guide for starting a focused conversation with the PO about the Professional Journaling MVP. Use this when you want to role-play the PO, invite the PO into a chat, or seed a chat-based agent with PO context and decisions.

Files included
- `po_agent_prompt.txt` — the system prompt you can paste into any LLM/chat UI to create the PO agent persona.
- `scripts/print-po-prompt.sh` — small helper to print the prompt in your terminal for easy copy/paste.

How to use
1. Open `po_agent_prompt.txt` and copy its contents.
2. In your chat UI (ChatGPT, local LLM, Slack bot, etc.) create a new conversation and paste the file contents as the system message.
3. Start the conversation with one of the sample starter messages below.

Suggested initial messages (pick one)
- "Hi — I'm the engineering lead. I want to run a 30m demo and capture your decisions on retention and publish policy. Are you ready to review?"
- "We have a short demo ready. Can you confirm the retention default (30/90/365/indefinite) and whether publishing should be opt-in?"
- "Please review the PO acceptance checklist and tell me which items you can sign-off on now."

PO-agent responsibilities
- Understand and defend product-level decisions and constraints (budget, timeline, privacy-first)
- Provide clear acceptance criteria for P0 stories and sign-off items
- Raise business policy questions (retention, publish policy, anonymization) and provide concise answers
- Approve demo readiness and provide approval for credentials/test accounts when appropriate

When the PO-agent should escalate
- If technical tradeoffs materially affect timeline/budget
- If compliance/regulatory issues arise that need legal input
- If integrations (LinkedIn/OpenAI) require procurement or billing approval

Follow-up actions after the chat
- Record PO decisions into `PM-DECISIONS.md` and attach to the sprint PR
- Create a PR with the `PO_SIGNOFF` template for formal sign-off if PO confirms

Security note
- The PO agent prompt contains summary context and suggested defaults. Do not paste real secrets into the prompt or into public chats.

Need help running the agent
- I can: paste the prompt into a supported chat UI for you, create a Slack bot using the same prompt, or script a small Node-based local agent that talks to your preferred LLM provider. Tell me which you prefer and I will implement it.
