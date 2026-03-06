# Step 1: Check Messages

## Purpose
Check the agent's inbox for unread messages and report to the user.

## Procedure

1. Call `check_agent_messages` (or HTTP POST to `agent-messages` with `action: "check"`)
   - Use configured `AGENT_ID`
   - Include broadcast messages (`include_broadcast: true`)
   - Filter by current project if set

2. If messages found:
   - Present each message with: sender, platform, type, content preview, timestamp
   - Group by thread if multiple messages in same thread
   - Highlight urgent messages first
   - Ask user: "Would you like me to respond to any of these?"

3. If no messages:
   - Report: "No unread messages."
   - Show connection status (realtime vs polling)

4. If connection fails:
   - Report the error to the user: "Could not check messages: {error}"
   - Suggest: "Please check the network connection or restart the session."

## Output Format

```
--- INBOX ({count} unread) ---

1. [urgent/question] from Saga (claude-code):
   "What color palette should we use for the dashboard?"
   Thread: abc-123 | 5 min ago

2. [notification] from Dev-Agent (cursor):
   "Homepage build complete. Ready for review."
   Thread: def-456 | 2 hours ago

---
Connection: realtime (live)
```
