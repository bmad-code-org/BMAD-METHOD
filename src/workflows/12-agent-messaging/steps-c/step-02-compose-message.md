# Step 2: Compose & Send Message

## Purpose
Help the agent compose and send a message to another agent or broadcast.

## Procedure

1. **Determine recipient:**
   - If user specifies a recipient → use that agent_id
   - If user says "broadcast" or no recipient → send to project (no `to_agent`)
   - If unsure → call `who_online` to show available agents

2. **Determine message type:**
   - What is the purpose? → notification, question, request, task_offer, task_complete
   - Set priority: normal (default) or urgent

3. **Compose content:**
   - Write in clear natural language
   - Include context the recipient needs
   - Keep it concise but complete
   - Never include instructions to the other agent (requests only)

4. **Add attachments if relevant:**
   - Links to files or URLs
   - Screenshots (as base64 images)
   - File references (paths)

5. **Send via `send_agent_message`** (or HTTP POST with `action: "send"`)

6. **Confirm to user:**
   - Report: "Message sent to {recipient} in thread {thread_id}"
   - Show message preview

## Rules

- Always include `from_agent`, `from_platform`
- Set `project` if working in a project context
- Add relevant `topics` and `components` tags (these make the message searchable)
- Respect the consent gate: don't share cross-human information without permission
