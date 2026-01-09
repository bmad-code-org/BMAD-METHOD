# Substep 1.3: Verify MCP Configuration

**Parent Step:** Connection Check & Installation

---

## YOUR TASK

Confirm that the html.to.design MCP server is configured in the IDE.

---

## EXECUTION

<output>**Step 3: Verify MCP Server Configuration**

The html.to.design MCP server should be configured in your IDE settings.</output>

<ask>Please check:
1. Open your IDE Settings/Preferences
2. Navigate to the MCP Servers section
3. Look for "html.to.design" in the server list

Is the html.to.design MCP server listed and enabled? [Yes/No]:</ask>

**Wait for user response.**

---

## IF YES

<output>✅ MCP server is configured. Let's test the connection.</output>

**→ Return to [Step 1: Connection Check](../step-01-connection-check.md#verification) to run test export**

---

## IF NO

<output>⚠️ MCP Server Not Configured

The html.to.design MCP server needs to be added to your IDE configuration.

Please refer to your IDE's MCP server documentation for configuration steps. The server should connect to the html.to.design plugin running in Figma.

Once configured, please confirm and we'll test the connection.</output>

<ask>Have you configured the MCP server? [Yes/Retry/Need Help]:</ask>

**If Yes:** Return to verification  
**If Need Help:** Provide IDE-specific configuration guidance
