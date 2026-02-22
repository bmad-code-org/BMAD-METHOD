# Step 0A: Confirm Platform Strategy for Scenario

**Inherit from Product Brief, confirm for this scenario**

---

## Purpose

Before starting scenario design, confirm that the platform strategy from the Product Brief applies to this scenario, or identify if this scenario requires different platform considerations.

## Context for Agent

The Product Brief defines the overall platform strategy for the product. However, some scenarios might have different platform requirements. For example:
- Onboarding might be web-only while daily use is mobile app
- Admin features might be desktop-only while customer features are mobile
- Some scenarios might span multiple platforms (start on web, continue on mobile)

## Instructions

### 1. Load Platform Strategy from Product Brief

<action>
Read the Product Brief and extract the Platform & Device Strategy section:

- primary_platform
- supported_devices
- device_priority
- interaction_models
- offline_requirements
- native_features_needed
</action>

### 2. Present Platform Strategy

<output>
**Platform Strategy from Product Brief:**

**Primary Platform:** {primary_platform}
**Supported Devices:** {supported_devices}
**Device Priority:** {device_priority}
**Interaction Models:** {interaction_models}

---

**For this scenario: {scenario_name}**

Does this platform strategy apply to this entire scenario, or does this scenario have specific platform requirements?
</output>

### 3. Ask Scenario-Specific Platform Questions

<ask>
**Scenario Platform Questions:**

1. **Does this scenario use the same platform as the Product Brief?**
   - Yes, same platform strategy applies
   - No, this scenario has different platform requirements
   - Partially, this scenario spans multiple platforms

2. **If different or spanning platforms:**
   - Which platforms are involved in this scenario?
   - How does the user move between platforms?
   - What is the primary platform for this scenario?

3. **Are there scenario-specific device considerations?**
   - Does this scenario prioritize different devices?
   - Are there device-specific features in this scenario?
   - Any device limitations for this scenario?

4. **Page type expectations for this scenario:**
   - Full pages (standard navigation flow)
   - Modal dialogs (overlays, popups)
   - Embedded components (widgets, iframes)
   - System notifications (email, SMS, push)
   - Mixed (specify which pages are which type)

Your answers:
</ask>

### 4. Document Scenario Platform Strategy

<action>
Create or update scenario overview document with platform information:

```markdown
# Scenario {number}: {scenario_name}

## Scenario Platform Strategy

**Inherits From:** Product Brief Platform Strategy
**Platform Alignment:** {same/different/spanning}

### Platform Details for This Scenario

**Primary Platform:** {platform for this scenario}
**Devices Used:** {devices in this scenario}
**Device Priority:** {device priority for this scenario}

**Cross-Platform Flow (if applicable):**
{describe how user moves between platforms in this scenario}

**Page Types in This Scenario:**
- {Page 1}: Full page (responsive web)
- {Page 2}: Modal dialog (overlay)
- {Page 3}: Email template
- etc.

**Scenario-Specific Considerations:**
{any unique platform requirements or constraints for this scenario}

---
```
</action>

### 5. Confirm Understanding

<output>
**Scenario Platform Summary:**

This scenario will be designed for:
- **Platform:** {platform}
- **Primary Device:** {device}
- **Page Types:** {types}

All pages in this scenario will inherit this platform context, ensuring consistent design decisions.

Ready to proceed with scenario initialization?
</output>

<ask>
**Confirm scenario platform strategy:**
- [C] Continue - platform strategy is clear
- [R] Revise - need to adjust platform for this scenario
- [D] Discuss - have questions about platform implications
</ask>

## Next Step

After confirming platform strategy, proceed to 01-feature-selection.md

## State Update

Store scenario platform information for reference during page specification:

```yaml
scenario_platform:
  inherits_from: 'product_brief'
  alignment: '{same/different/spanning}'
  primary_platform: '{platform}'
  devices_used: '{devices}'
  device_priority: '{priority}'
  page_types: '{types}'
  cross_platform_flow: '{flow if applicable}'
```

---

**Why This Matters:**

Platform context affects every design decision:
- **Layout:** Mobile-first vs desktop-first
- **Navigation:** Touch gestures vs mouse clicks
- **Interactions:** Native patterns vs web patterns
- **Content:** Concise for mobile vs detailed for desktop
- **Features:** What's possible on each platform

Confirming this upfront ensures all scenario pages are designed consistently for the right platform.
