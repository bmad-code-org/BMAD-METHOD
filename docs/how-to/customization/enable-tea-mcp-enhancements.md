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

- Want exploratory mode in `*test-design` (browser-based UI discovery)
- Want recording mode in `*atdd` (verify selectors with live browser)
- Want healing mode in `*automate` (fix tests with visual debugging)
- Debugging complex UI issues
- Need accurate selectors from actual DOM

**Don't use if:**
- You're new to TEA (adds complexity)
- You don't have MCP servers configured
- Your tests work fine without it
- You're testing APIs only (no UI)

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

## Installation

### Step 1: Configure MCP Servers in IDE

Add this configuration to your IDE's MCP settings. See [TEA Overview](/docs/explanation/features/tea-overview.md#playwright-mcp-enhancements) for IDE-specific configuration locations.

**MCP Configuration:**

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

### Step 2: Install Playwright Browsers

```bash
npx playwright install
```

### Step 3: Enable in TEA Config

Edit `_bmad/bmm/config.yaml`:

```yaml
tea_use_mcp_enhancements: true
```

### Step 4: Restart IDE

Restart your IDE to load MCP server configuration.

### Step 5: Verify MCP Servers

Check MCP servers are running:

**In Cursor:**
- Open command palette (Cmd/Ctrl + Shift + P)
- Search "MCP"
- Should see "Playwright" and "Playwright Test" servers listed

**In VS Code:**
- Check Claude extension settings
- Verify MCP servers are enabled

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
- May use `getByRole()` that doesn't match actual app
- Selectors might need adjustment

**With MCP:**
TEA verifies selectors with live browser:
```
"Let me verify the login form selectors"

[TEA navigates to /login]
[Inspects form fields]

"I see:
- Email input has label 'Email Address' (not 'Email')
- Password input has label 'Your Password'
- Submit button has text 'Sign In' (not 'Login')

I'll use these exact selectors."
```

**Generated test:**
```typescript
await page.getByLabel('Email Address').fill('test@example.com');
await page.getByLabel('Your Password').fill('password');
await page.getByRole('button', { name: 'Sign In' }).click();
// Selectors verified against actual DOM
```

**Benefits:**
- Accurate selectors from real DOM
- Tests work on first run
- No trial-and-error selector debugging

### *automate: Healing Mode

**Without MCP:**
- TEA analyzes test code only
- Suggests fixes based on static analysis
- Can't verify fixes work

**With MCP:**
TEA uses visual debugging:
```
"This test is failing. Let me debug with trace viewer"

[TEA opens trace file]
[Analyzes screenshots]
[Identifies selector changed]

"The button selector changed from 'Save' to 'Save Changes'
I'll update the test and verify it works"

[TEA makes fix]
[Runs test with MCP]
[Confirms test passes]
```

**Benefits:**
- Visual debugging during healing
- Verified fixes (not guesses)
- Faster resolution

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

## Configuration Options

### MCP Server Arguments

**Playwright MCP with custom port:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--port", "3000"]
    }
  }
}
```

**Playwright Test with specific browser:**
```json
{
  "mcpServers": {
    "playwright-test": {
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server", "--browser", "chromium"]
    }
  }
}
```

### Environment Variables

```bash
# .env
PLAYWRIGHT_BROWSER=chromium     # Browser for MCP
PLAYWRIGHT_HEADLESS=false       # Show browser during MCP
PLAYWRIGHT_SLOW_MO=100          # Slow down for visibility
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

## Best Practices

### Use MCP for Complex UIs

**Simple UI (skip MCP):**
```
Standard login form with email/password
TEA can infer selectors without MCP
```

**Complex UI (use MCP):**
```
Multi-step wizard with dynamic fields
Conditional UI elements
Third-party components
Custom form widgets
```

### Start Without MCP, Enable When Needed

**Learning path:**
1. Week 1-2: TEA without MCP (learn basics)
2. Week 3: Enable MCP (explore advanced features)
3. Week 4+: Use MCP selectively (when it adds value)

### Combine with Playwright Utils

**Powerful combination:**
```yaml
tea_use_playwright_utils: true
tea_use_mcp_enhancements: true
```

**Benefits:**
- Playwright Utils provides production-ready utilities
- MCP verifies utilities work with actual app
- Best of both worlds

### Use for Test Healing

**Scenario:** Test suite has 50 failing tests after UI update.

**With MCP:**
```
*automate (healing mode)

TEA:
1. Opens trace viewer for each failure
2. Identifies changed selectors
3. Updates tests with corrected selectors
4. Verifies fixes with browser
5. Provides updated tests

Result: 45/50 tests auto-healed
```

### Use for New Team Members

**Onboarding:**
```
New developer: "I don't know this codebase's UI"

Senior: "Run *test-design with MCP exploratory mode"

TEA explores UI and generates documentation:
- UI structure discovered
- Interactive elements mapped
- Test design created automatically
```

## Security Considerations

### MCP Servers Have Browser Access

**What MCP can do:**
- Navigate to any URL
- Click any element
- Fill any form
- Access browser storage
- Read page content

**Best practices:**
- Only configure MCP in trusted environments
- Don't use MCP on production sites (use staging/dev)
- Review generated tests before running on production
- Keep MCP config in local files (not committed)

### Protect Credentials

**Don't:**
```
"TEA, login with mypassword123"
# Password visible in chat history
```

**Do:**
```
"TEA, login using credentials from .env"
# Password loaded from environment, not in chat
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
