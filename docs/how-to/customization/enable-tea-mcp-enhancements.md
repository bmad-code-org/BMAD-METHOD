---
title: "Enable TEA MCP Enhancements"
description: Configure Playwright MCP servers for live browser verification during TEA workflows
---

# Enable TEA MCP Enhancements

Configure Model Context Protocol (MCP) servers to enable live browser verification, exploratory mode, and recording mode in TEA workflows.

## What are MCP Enhancements?

MCP (Model Context Protocol) servers enable AI agents to interact with live browsers during test generation. This allows TEA to:

- **Explore UIs interactively** - Discover actual functionality through browser automation
- **Verify selectors** - Generate accurate locators from real DOM
- **Validate behavior** - Confirm test scenarios against live applications
- **Debug visually** - Use trace viewer and screenshots during generation

## When to Use This

**For UI Testing:**
- Want exploratory mode in `*test-design` (browser-based UI discovery)
- Want recording mode in `*atdd` or `*automate` (verify selectors with live browser)
- Want healing mode in `*automate` (fix tests with visual debugging)
- Need accurate selectors from actual DOM
- Debugging complex UI interactions

**For API Testing:**
- Want healing mode in `*automate` (analyze failures with trace data)
- Need to debug test failures (network responses, request/response data, timing)
- Want to inspect trace files (network traffic, errors, race conditions)

**For Both:**
- Visual debugging (trace viewer shows network + UI)
- Test failure analysis (MCP can run tests and extract errors)
- Understanding complex test failures (network + DOM together)

**Don't use if:**
- You don't have MCP servers configured

## Prerequisites

- BMad Method installed
- TEA agent available
- IDE with MCP support (Cursor, VS Code with Claude extension)
- Node.js v18 or later
- Playwright installed

## Available MCP Servers

**Two Playwright MCP servers** (actively maintained, continuously updated):

### 1. Playwright MCP - Browser Automation

**Command:** `npx @playwright/mcp@latest`

**Capabilities:**
- Navigate to URLs
- Click elements
- Fill forms
- Take screenshots
- Extract DOM information

**Best for:** Exploratory mode, recording mode

### 2. Playwright Test MCP - Test Runner

**Command:** `npx playwright run-test-mcp-server`

**Capabilities:**
- Run test files
- Analyze failures
- Extract error messages
- Show trace files

**Best for:** Healing mode, debugging

### Recommended: Configure Both

Both servers work together to provide full TEA MCP capabilities.

## Setup

### 1. Configure MCP Servers

Add to your IDE's MCP configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "playwright-test": {
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    }
  }
}
```

See [TEA Overview](/docs/explanation/features/tea-overview.md#playwright-mcp-enhancements) for IDE-specific config locations.

### 2. Enable in BMAD

Answer "Yes" when prompted during installation, or set in config:

```yaml
# _bmad/bmm/config.yaml
tea_use_mcp_enhancements: true
```

### 3. Verify MCPs Running

Ensure your MCP servers are running in your IDE.

## How MCP Enhances TEA Workflows

### *test-design: Exploratory Mode

**Without MCP:**
- TEA infers UI functionality from documentation
- Relies on your description of features
- May miss actual UI behavior

**With MCP:**
TEA can open live browser to:
```
"Let me explore the profile page to understand the UI"

[TEA navigates to /profile]
[Takes screenshot]
[Extracts accessible elements]

"I see the profile has:
- Name field (editable)
- Email field (editable)
- Avatar upload button
- Save button
- Cancel button

I'll design tests for these interactions."
```

**Benefits:**
- Accurate test design based on actual UI
- Discovers functionality you might not describe
- Validates test scenarios are possible

### *atdd: Recording Mode

**Without MCP:**
- TEA generates selectors from best practices
- TEA infers API patterns from documentation

**With MCP (Recording Mode):**

**For UI Tests:**
```
[TEA navigates to /login with live browser]
[Inspects actual form fields]

"I see:
- Email input has label 'Email Address' (not 'Email')
- Password input has label 'Your Password'
- Submit button has text 'Sign In' (not 'Login')

I'll use these exact selectors."
```

**For API Tests:**
```
[TEA analyzes trace files from test runs]
[Inspects network requests/responses]

"I see the API returns:
- POST /api/login → 200 with { token, userId }
- Response time: 150ms
- Required headers: Content-Type, Authorization

I'll validate these in tests."
```

**Benefits:**
- UI: Accurate selectors from real DOM
- API: Validated request/response patterns from trace
- Both: Tests work on first run

### *automate: Healing + Recording Modes

**Without MCP:**
- TEA analyzes test code only
- Suggests fixes based on static analysis
- Generates tests from documentation/code

**With MCP:**

**Healing Mode (UI + API):**
```
[TEA opens trace file]
[Analyzes screenshots + network tab]

UI failures: "Button selector changed from 'Save' to 'Save Changes'"
API failures: "Response structure changed, expected {id} got {userId}"

[TEA makes fixes]
[Verifies with trace analysis]
```

**Recording Mode (UI + API):**
```
UI: [Inspects actual DOM, generates verified selectors]
API: [Analyzes network traffic, validates request/response patterns]

[Generates tests with verified patterns]
[Tests work on first run]
```

**Benefits:**
- Visual debugging + trace analysis (not just UI)
- Verified selectors (UI) + network patterns (API)
- Tests verified against actual application behavior

## Usage Examples

### Exploratory Mode Example

```
User: Run *test-design

TEA: What feature are you designing tests for?

User: The checkout flow at https://shop.example.com

TEA: [With MCP] Let me explore the checkout flow
[Opens browser]
[Navigates to checkout]
[Takes screenshots]
[Identifies all interactive elements]

TEA: I've explored the checkout flow. I found:
- 4-step wizard (Cart → Shipping → Payment → Confirm)
- Shipping options (Standard, Express, Overnight)
- Payment methods (Credit Card, PayPal)
- Promo code field
- Order summary with real-time totals

Test design will cover all these scenarios.
```

### Recording Mode Example

```
User: Run *atdd for user registration feature

TEA: [With MCP] Let me verify the registration form selectors
[Opens browser at /register]
[Inspects form]

TEA: I see the actual form has:
- "Full Name" label (not "Name")
- "Email Address" label (not "Email")
- "Create Password" label (not "Password")
- "I agree to Terms" checkbox
- "Create Account" button (not "Register")

Generating tests with verified selectors...
```

### Healing Mode Example

```
User: Run *automate with healing mode

TEA: [With MCP] Running tests and checking for failures
[Runs test suite]
[Test fails: selector not found]

TEA: Test failed on selector '.submit-btn'
[Opens trace viewer]
[Sees button class changed to '.submit-button']

Fixing selector and verifying...
[Updates test]
[Re-runs with MCP]
[Test passes]

Updated test with corrected selector.
```

## Troubleshooting

### MCP Servers Not Running

**Problem:** TEA says MCP enhancements aren't available.

**Causes:**
1. MCP servers not configured in IDE
2. Config syntax error in JSON
3. IDE not restarted after config

**Solution:**
```bash
# Verify MCP config file exists
ls ~/.cursor/config.json

# Validate JSON syntax
cat ~/.cursor/config.json | python -m json.tool

# Restart IDE
# Cmd+Q (quit) then reopen
```

### Browser Doesn't Open

**Problem:** MCP enabled but browser never opens.

**Causes:**
1. Playwright browsers not installed
2. Headless mode enabled
3. MCP server crashed

**Solution:**
```bash
# Install browsers
npx playwright install

# Check MCP server logs (in IDE)
# Look for error messages

# Try manual MCP server
npx @playwright/mcp@latest
# Should start without errors
```

### TEA Doesn't Use MCP

**Problem:** `tea_use_mcp_enhancements: true` but TEA doesn't use browser.

**Causes:**
1. Config not saved
2. Workflow run before config update
3. MCP servers not running

**Solution:**
```bash
# Verify config
grep tea_use_mcp_enhancements _bmad/bmm/config.yaml
# Should show: tea_use_mcp_enhancements: true

# Restart IDE (reload MCP servers)

# Start fresh chat (TEA loads config at start)
```

### Selector Verification Fails

**Problem:** MCP can't find elements TEA is looking for.

**Causes:**
1. Page not fully loaded
2. Element behind modal/overlay
3. Element requires authentication

**Solution:**
TEA will handle this automatically:
- Wait for page load
- Dismiss modals if present
- Handle auth if needed

If persistent, provide TEA more context:
```
"The element is behind a modal - dismiss the modal first"
"The page requires login - use credentials X"
```

### MCP Slows Down Workflows

**Problem:** Workflows take much longer with MCP enabled.

**Cause:** Browser automation adds overhead.

**Solution:**
Use MCP selectively:
- **Enable for:** Complex UIs, new projects, debugging
- **Disable for:** Simple features, well-known patterns, API-only testing

Toggle quickly:
```yaml
# For this feature (complex UI)
tea_use_mcp_enhancements: true

# For next feature (simple API)
tea_use_mcp_enhancements: false
```

## Related Guides

**Getting Started:**
- [TEA Lite Quickstart Tutorial](/docs/tutorials/getting-started/tea-lite-quickstart.md) - Learn TEA basics first

**Workflow Guides (MCP-Enhanced):**
- [How to Run Test Design](/docs/how-to/workflows/run-test-design.md) - Exploratory mode with browser
- [How to Run ATDD](/docs/how-to/workflows/run-atdd.md) - Recording mode for accurate selectors
- [How to Run Automate](/docs/how-to/workflows/run-automate.md) - Healing mode for debugging

**Other Customization:**
- [Integrate Playwright Utils](/docs/how-to/customization/integrate-playwright-utils.md) - Production-ready utilities

## Understanding the Concepts

- [TEA Overview](/docs/explanation/features/tea-overview.md) - MCP enhancements in lifecycle
- [Engagement Models](/docs/explanation/tea/engagement-models.md) - When to use MCP enhancements

## Reference

- [TEA Configuration](/docs/reference/tea/configuration.md) - tea_use_mcp_enhancements option
- [TEA Command Reference](/docs/reference/tea/commands.md) - MCP-enhanced workflows
- [Glossary](/docs/reference/glossary/index.md#test-architect-tea-concepts) - MCP Enhancements term

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
