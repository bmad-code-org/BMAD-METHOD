# Substep 4C-01: Page Basics

**Goal:** Capture fundamental page information

---

## EXECUTION

<output>**Let's start with the page basics.** 📝</output>

<ask>**Page basics:**

- Page name/title:
- URL/route (if applicable):
- Main user goal (in one sentence):
- Where users come from (entry points):
- Where users go next (exit points):</ask>

<action>Store page_basics:

- page_title
- url_route
- user_goal
- entry_points
- exit_points
  </action>

<output>✅ **Page basics captured!**

**Next:** We'll define the layout sections.</output>

---

## MENU

<ask>[C] Continue to 4C-02 (Layout Sections)</ask>

---

## EXAMPLE OUTPUT

```yaml
page_basics:
  title: 'Sign In'
  route: '/auth/signin'
  user_goal: 'Authenticate to access their account'
  entry_points:
    - "Landing page 'Sign In' button"
    - 'Protected route redirects'
  exit_points:
    - 'Dashboard (success)'
    - 'Password reset (forgot password)'
```

---

## NEXT STEP

Load `substeps/4c-02-layout-sections.md`
