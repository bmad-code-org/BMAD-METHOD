# Navigate to Example Domain
- **Spec ID:** navigation-example
- **Status:** ✅ Passed
- **Expected Status:** passing
- **Route:** Navigation Journeys
- **Role:** QA Automation
- **Duration:** 1382ms
Confirm chrome-devtools-mcp can navigate to a public site and detect expected content.

## Steps
- [x] Navigate to https://example.com
  ↳ Response: # navigate_page response
## Pages
0: https://example.com/ [selected]
- [x] Confirm the Example Domain page title is correct
  ↳ Response: # evaluate_script response
Script ran on page and returned:
```json
"Example Domain"
```
- [x] Wait for the Example Domain heading to appear
  ↳ Response: # wait_for response
Element with text "Example Domain" found.
## Page content
uid=1_0 RootWebArea "Example Domain"
  uid=1_1 heading "Example Domain" level="1"
  uid=1_2 StaticText "This domain is for use in documentation examples without needing permission. Avoid use in operations."
  uid=1_3 link "Learn more"
    uid=1_4 StaticText "Learn more"

- [x] Capture the page snapshot for debugging context
  ↳ Response: # take_snapshot response
## Page content
uid=2_0 RootWebArea "Example Domain"
  uid=2_1 heading "Example Domain" level="1"
  uid=2_2 StaticText "This domain is for use in documentation examples without needing permission. Avoid use in operations."
  uid=2_3 link "Learn more"
    uid=2_4 StaticText "Learn more"
