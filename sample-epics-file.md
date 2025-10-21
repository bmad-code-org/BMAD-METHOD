# MyPlantFamily - Epic Breakdown

**Author:** BMad
**Date:** 2025-10-18
**Project Level:** 3
**Target Scale:** 29-38 stories across 4 epics

---

## Overview

This document provides the detailed epic breakdown for MyPlantFamily, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: Foundation & Core Plant Management

**Expanded Goal:**

Establish the mobile application foundation and core plant management capabilities that deliver immediate user value. Users can create accounts, securely authenticate, add plants to their collection using either photo identification or manual selection, name their plants for personalization, and view their growing plant family. This epic creates the essential infrastructure and data model that all subsequent features will build upon, while delivering a working MVP that users can start using immediately.

---

### Story 1.1: Project Foundation & Development Environment

As a developer,
I want the project infrastructure and development environment established,
So that the team can build, test, and deploy the mobile application consistently.

**Acceptance Criteria:**

1. Repository initialized with version control (Git)
2. Mobile app project created using React Native (cross-platform iOS/Android)
3. Development environment documented and reproducible
4. Basic CI/CD pipeline configured for automated testing
5. Cloud infrastructure provisioned (database, storage, hosting)
6. Environment variables and secrets management configured
7. Initial deployable build completes successfully on both iOS and Android

**Prerequisites:** None (foundational)

---

### Story 1.2: App Shell & Navigation Framework

As a user,
I want a functional mobile app with core navigation,
So that I can move between different sections of the application.

**Acceptance Criteria:**

1. App launches on both iOS and Android devices
2. Bottom navigation bar implemented with placeholders for: Home, Add Plant, Settings
3. Screen transitions work smoothly between navigation tabs
4. App displays placeholder content for each section
5. App icon and splash screen configured
6. Basic error handling prevents crashes on navigation
7. Offline mode displays "no connection" message gracefully

**Prerequisites:** Story 1.1 complete

---

### Story 1.3: User Authentication & Account Management

As a new user,
I want to create an account and log in securely,
So that my plant data is saved and accessible across devices.

**Acceptance Criteria:**

1. Sign up flow accepts email and password with validation (email format, password strength)
2. Login flow authenticates existing users successfully
3. Social login option available (Google or Apple Sign-In)
4. Password reset/recovery flow functional via email
5. User session persists across app restarts (secure token storage)
6. Logout functionality clears session and returns to login screen
7. Account data stored securely in cloud database
8. Basic profile screen shows user email and account creation date

**Prerequisites:** Story 1.2 complete

---

### Story 1.4: Plant Data Model & Species Database

As a developer,
I want a robust plant data model and curated species database,
So that plant information is structured consistently and species data is accurate.

**Acceptance Criteria:**

1. Plant database schema defined (plant ID, user ID, species, name, created date, photos, care logs)
2. Species reference database populated with 10-15 common houseplants (Monstera, Pothos, Snake Plant, etc.)
3. Each species includes: common name, scientific name, care frequency defaults, personality type assignment
4. Database relationships established (User → Plants 1:many)
5. CRUD operations tested (Create, Read, Update, Delete plants)
6. Data validation prevents invalid entries (e.g., missing species)
7. Database indexes optimized for common queries (user_id, plant_id)

**Prerequisites:** Story 1.3 complete (user accounts exist)

---

### Story 1.5: Add Plant - Manual Species Selection

As a user,
I want to manually select my plant's species from a list,
So that I can add plants even if photo identification fails or isn't available.

**Acceptance Criteria:**

1. "Add Plant" button prominent on home screen
2. Tapping "Add Plant" presents two options: "Take Photo" or "Choose Species Manually"
3. Manual selection shows scrollable list of 10-15 species with photos and common names
4. Search/filter functionality helps users find species quickly
5. Selecting species proceeds to plant naming screen
6. User can cancel and return to home screen at any point
7. Selected species data pre-populates plant profile

**Prerequisites:** Story 1.4 complete (species database exists)

---

### Story 1.6: Plant Photo Identification Integration

As a user,
I want to take a photo of my plant and have the app identify the species,
So that I can quickly add plants without manually searching.

**Acceptance Criteria:**

1. "Take Photo" option opens device camera with proper permissions
2. Photo captured and sent to 3rd party plant identification API (PlantNet, Pl@ntNet, or similar)
3. API response displays top 3 species suggestions with confidence scores
4. User can select correct species from suggestions or choose "None of these - select manually"
5. If API fails or confidence too low, gracefully fallback to manual selection
6. Photo stored temporarily during identification, saved permanently after confirmation
7. Loading indicator displays while API processes photo (with 10-second timeout)
8. Error handling for no internet connection or API unavailable

**Prerequisites:** Story 1.5 complete (manual flow as fallback)

---

### Story 1.7: Plant Naming & Profile Creation

As a user,
I want to give my plant a custom name and complete its profile,
So that I can personalize my plant and make it feel like part of my family.

**Acceptance Criteria:**

1. After species selection, user prompted: "What's your plant's name?"
2. Text input accepts any name (character limit 30, validation for special characters)
3. Option to skip naming shows system-suggested name based on species (e.g., "Monty the Monstera")
4. Initial profile photo can be uploaded or skipped (defaults to species reference photo)
5. Plant profile saved to database with: user ID, species, custom name, creation timestamp, initial photo
6. Success confirmation shown: "Welcome [Plant Name] to your family!"
7. User automatically navigated to plant detail view after creation

**Prerequisites:** Story 1.6 complete (species identified/selected)

---

### Story 1.8: Plant Collection Home Screen

As a user,
I want to see all my plants in one place with key information,
So that I can quickly check on my plant family and select which plant to interact with.

**Acceptance Criteria:**

1. Home screen displays card-based grid of all user's plants
2. Each plant card shows: plant photo, custom name, species name, placeholder health indicator
3. Empty state message displayed when user has no plants: "Add your first plant to get started!"
4. Tapping a plant card navigates to that plant's detail view
5. Plants sorted by most recently added (newest first)
6. Add Plant button (+) prominently displayed on home screen
7. Pull-to-refresh updates plant list
8. Smooth scrolling performance with 10+ plants

**Prerequisites:** Story 1.7 complete (plants can be created)

---

### Story 1.9: Plant Detail View

As a user,
I want to view detailed information about an individual plant,
So that I can see its profile, photos, and access plant-specific actions.

**Acceptance Criteria:**

1. Detail screen displays: large plant photo, custom name, species name, creation date
2. Placeholder sections visible for: Care Schedule, Health Status, Chat (implemented in later epics)
3. Edit button allows user to change plant name or photo
4. Delete plant option with confirmation dialog ("Are you sure you want to remove [Plant Name]?")
5. Back button returns to home screen
6. Swipe gestures navigate between plant details (if user has multiple plants)
7. Screen layout responsive to different device sizes

**Prerequisites:** Story 1.8 complete (navigation from home screen)

---

### Story 1.10: Cloud Photo Storage & Display

As a user,
I want my plant photos stored securely in the cloud and displayed quickly,
So that my growth history is preserved and accessible across devices.

**Acceptance Criteria:**

1. Photos uploaded to cloud storage (S3, Cloud Storage, or similar) upon plant creation
2. Photos compressed before upload (max 1MB per photo, maintain aspect ratio)
3. Thumbnail versions generated automatically for faster loading in list views
4. Photos display within 2 seconds on average mobile connection
5. Failed uploads retry automatically (3 attempts) before showing error
6. Uploaded photos accessible via secure signed URLs (expire after 24 hours, regenerated on access)
7. Photo deletion removes file from cloud storage when plant is deleted
8. User data usage tracked and optimized (photos only upload on WiFi option in settings)

**Prerequisites:** Story 1.9 complete (plant details showing photos)

---

**Epic 1 Summary:**

- **10 stories** delivering foundational plant management
- **Key Deliverable:** Users can create accounts, add plants via photo ID or manual selection, name them, and view their collection
- **Next Epic:** Epic 2 will add AI personalities and conversational engagement on top of this foundation

---

## Epic 2: AI Personality System & Engagement Loop

**Expanded Goal:**

Implement the core product differentiator that transforms plant care from utility into emotional connection. Each plant receives a species-specific AI personality (grumpy cactus, dramatic fern, wise snake plant) that users can converse with through a chat interface. Personality-driven reminders replace generic notifications, and dynamic mood visualization reflects each plant's status. This epic delivers the "magic moment" where users realize their plants have character and care becomes genuinely enjoyable rather than obligatory.

**Pre-Mortem Enhancements Applied:** This epic has been strengthened with learnings from failure analysis including early tone testing, cost controls, API reliability failovers, and adaptive reminder intelligence.

---

### Story 2.1: Personality System Data Model

As a developer,
I want a robust personality system data model with tone guardrails,
So that each plant type has consistent character traits that are encouraging, never guilt-tripping.

**Acceptance Criteria:**

1. Personality database schema defined (personality_id, species, archetype, tone, conversation_style, example_phrases, tone_guardrails)
2. 10-15 species personalities created with distinct archetypes:
   - Monstera: Dramatic diva (theatrical, attention-seeking, fabulous)
   - Snake Plant: Wise mentor (patient, philosophical, low-maintenance pride)
   - Pothos: Cheerful optimist (friendly, easy-going, encouraging)
   - Cactus: Grumpy hermit (sarcastic, independent, tough love)
   - Fern: Anxious worrier (needy, dramatic about humidity, grateful)
   - (Continue for remaining species...)
3. Each personality includes: tone descriptor, conversation prompts, care reminder style, mood expressions
4. **Tone guardrails defined for each personality:**
   - "Never say" rules (e.g., never use: lazy, neglectful, bad parent, failure, dying, shame)
   - Tone boundaries (humor without sarcasm about user's care gaps)
   - Positive reinforcement ratios (minimum 3:1 encouragement to playful drama)
5. Personality assignment logic links species to personality when plant created
6. Personality data accessible via API for chat and reminder systems

**Prerequisites:** Story 1.4 complete (species database exists)

---

### Story 2.2: Personality Prototype Testing

As a product manager,
I want to test personality tones with real users before full LLM implementation,
So that we catch tone issues early and avoid the "personality cringe crisis."

**Acceptance Criteria:**

1. Recruit 50+ beta testers with diverse demographics (age 22-50, varied neurodivergence, anxiety levels)
2. Create rule-based personality prototypes for 3-5 species using guardrails from Story 2.1
3. Beta testers interact with personalities for 7 days minimum
4. Collect feedback via survey: "Did personality ever make you feel bad/guilty/annoyed?" (Yes/No + details)
5. Track metrics: engagement rate, snooze frequency, personality interaction count
6. Mandatory exit interview for all participants
7. Tone adjustments made based on feedback before LLM prompt engineering begins
8. Document "safe" vs. "risky" language patterns for each archetype

**Prerequisites:** Story 2.1 complete (personality definitions exist)

---

### Story 2.3: LLM Integration & API Setup

As a developer,
I want LLM API integration with failover, cost controls, and provider flexibility,
So that conversations are reliable and cost-effective at scale.

**Acceptance Criteria:**

1. **Provider evaluation:** Test both commercial (OpenAI, Anthropic) and open-source (Llama, Mistral) options
2. **Cost analysis:** Project costs at 100, 1K, 10K users with each provider
3. **Primary provider configured:** API credentials, authentication, error handling
4. **Secondary failover provider configured:** Different vendor for redundancy (activates within 2 seconds if primary fails)
5. **Prompt engineering system:** System prompts define personality, tone guardrails enforced, user context injected
6. **Performance targets:** Response time <3 seconds, 99% uptime with failover
7. **Cost controls implemented:**
   - Token budgets per interaction (max 500 tokens response length)
   - Conversation turn limits (max 10 turns per session with graceful ending)
   - Rate limiting (10 conversations/day free tier)
8. **Provider-agnostic wrapper:** Can switch providers without code changes
9. **Cost tracking:** Real-time monitoring of tokens, costs per user, alerts at $0.15/user threshold
10. **Health monitoring:** Provider uptime checks, automatic failover triggers

**Prerequisites:** Story 2.2 complete (tone testing validated)

---

### Story 2.4: Chat Interface UI

As a user,
I want a conversational chat interface for each plant,
So that I can have fun interactions with my plant's personality.

**Acceptance Criteria:**

1. "Chat with [Plant Name]" button prominently displayed on plant detail screen
2. Chat screen with messaging interface (user messages right-aligned, plant left-aligned)
3. Plant's personality avatar/icon displayed with messages
4. Text input field with send button at bottom of screen
5. Conversation history displays most recent 20 messages (scrollable for older)
6. Loading indicator shows while waiting for plant response
7. Empty state displays personality introduction when no messages exist
8. Back button returns to plant detail screen
9. Keyboard handling prevents UI obstruction on message input

**Prerequisites:** Story 1.9 complete (plant detail view exists)

---

### Story 2.5: Conversational AI System

As a user,
I want to send messages to my plant and receive personality-driven responses,
So that I feel like I'm talking to a character with unique traits.

**Acceptance Criteria:**

1. User can type and send messages to their plant
2. System constructs LLM prompt with: personality definition + tone guardrails, species context, conversation history (last 10 turns), user message
3. LLM generates response matching personality tone and archetype
4. Plant response appears in chat within 3 seconds
5. Conversation history saved to database for continuity
6. Personality references plant's name naturally in responses
7. Care tips integrated naturally into personality-appropriate dialogue
8. **Conversation management:**
   - After 8-10 turns, personality suggests gentle wrap-up ("Let's chat more tomorrow!")
   - Max 10 turns per session enforced with graceful ending
9. Rate limit enforcement shows friendly personality-appropriate message ("I need rest, talk tomorrow!")
10. Error handling with personality-appropriate fallback (not generic errors)

**Prerequisites:** Stories 2.3 and 2.4 complete

---

### Story 2.6: Graceful Degradation Library

As a user,
I want my plant's personality to work even when LLM APIs are down,
So that the app feels reliable and my plant doesn't become generic.

**Acceptance Criteria:**

1. Pre-generated response library with 100+ personality-appropriate responses for common patterns:
   - Greetings (10+ variations per personality)
   - Care questions (15+ variations per personality)
   - Compliments (10+ variations)
   - Plant status inquiries (10+ variations)
   - General conversation (20+ variations)
2. Responses maintain personality voice and reference plant name
3. Local response library works offline (no API needed)
4. Fallback activation triggers when:
   - API latency >5 seconds
   - API returns error
   - No internet connection
5. User sees personality-appropriate "degraded mode" message first time:
   - Monstera: "Darling, I'm having trouble finding my words... but you know I adore you!"
   - Cactus: "My brain's a bit slow right now. Try again later."
6. Fallback responses feel natural, not robotic
7. System automatically retries LLM on next conversation attempt

**Prerequisites:** Story 2.5 complete (conversation system exists)

---

### Story 2.7: Response Caching & Cost Optimization

As a system administrator,
I want aggressive LLM response caching and hybrid rule/LLM approach,
So that API costs stay under budget at scale.

**Acceptance Criteria:**

1. **Cache strategy:**
   - Common patterns cached (greetings, basic care questions, compliments)
   - Personality "voice" responses cached separately (reusable across users)
   - Smart template system with variable insertion for common patterns
2. **Cache targets:** 60% hit rate minimum (not 30%)
3. Cache expires after 24 hours to keep responses fresh
4. Cached responses personalized with plant name injection
5. **Hybrid approach:**
   - Simple interactions (greetings, yes/no, short queries) use rule-based templates
   - Complex conversations (care advice, emotional support, storytelling) use LLM
   - System intelligently routes based on query complexity
6. **Cost monitoring:**
   - Cost per active user tracked in real-time
   - Alerts trigger at $0.12/user (buffer before $0.15 threshold)
   - Dashboard shows: cache hit rate, API call volume, cost per user, cost projections
7. Cost projections updated weekly for 30/60/90 day runway

**Prerequisites:** Story 2.6 complete (fallback system provides templates)

---

### Story 2.8: Personality-Driven Care Reminders

As a user,
I want care reminders that match my plant's personality with high variation,
So that reminders feel entertaining and fresh, never repetitive or nagging.

**Acceptance Criteria:**

1. Care reminder system generates notifications in personality-appropriate tone
2. **Each personality has 15+ reminder variations** (not 5) to prevent repetition
3. Reminders include personality-specific phrases:
   - Monstera: "Oh darling, I'm PARCHED! 💧", "Sweetheart, a drink would be DIVINE right now!"
   - Cactus: "Ugh, fine... I could use water. Don't make it a habit.", "Yeah yeah, I'm thirsty. Happy now?"
   - Pothos: "Hey friend! Mind giving me a little drink? 🌿", "Water time! Let's grow together!"
4. **Adaptive frequency:** If user snoozes 3x in a row, reduce reminder frequency automatically
5. Reminder timing based on species care schedule (from Epic 3, placeholder for now)
6. User can tap reminder to go directly to plant detail view
7. Snooze option available (returns in 2 hours with different message variant)
8. Tone remains encouraging, never guilt-tripping or negative
9. **Batch notifications:** Multiple plants needing care combined into one notification when appropriate

**Prerequisites:** Story 2.1 complete (personality definitions), Story 1.9 (plant detail view)

---

### Story 2.9: Push Notification System

As a user,
I want smart, batched push notifications that respect my preferences and patterns,
So that I stay engaged without feeling overwhelmed.

**Acceptance Criteria:**

1. Push notification permissions requested on first launch with clear value explanation
2. Firebase Cloud Messaging (or chosen service) integrated for iOS and Android
3. Notifications display plant name, personality message, and plant photo
4. Tapping notification opens app directly to that plant's detail view
5. **Smart scheduling:**
   - Track user's typical care times (e.g., user always waters Sunday 9am)
   - Adapt reminder timing to match user patterns
   - Default timing options: morning (9am), afternoon (2pm), evening (7pm)
6. **Batching logic:** Maximum 1 notification per day
   - If multiple plants need care, combine: "3 plants need love today! 🌿"
   - Batch shows multiple plant photos/names in notification
7. **Quiet days feature:** Optional user setting to skip weekend reminders
8. Notifications respect device Do Not Disturb settings
9. Users can disable notifications per-plant or globally in settings
10. Badge count shows number of plants needing care

**Prerequisites:** Story 2.8 complete (reminder system exists)

---

### Story 2.10: Reminder Intelligence & Adaptation

As a system,
I want to learn from user behavior and adapt reminder strategies,
So that notifications remain helpful without causing fatigue.

**Acceptance Criteria:**

1. **Behavior tracking:**
   - Record when user typically waters plants (day of week, time of day)
   - Track snooze patterns and frequency
   - Identify consistently responsive vs. forgetful users
2. **Adaptive scheduling:**
   - After 2 weeks, shift reminder timing to match user's observed patterns
   - If user always cares Sunday 9am, reminder sent Saturday 8pm or Sunday 8am
3. **Frequency adaptation:**
   - Consistently responsive users (>80% on-time care): Reduce reminder frequency
   - Forgetful users (<50% on-time): Maintain standard frequency with extra encouragement
4. **Snooze intelligence:**
   - If same plant snoozed 3+ times in a row, reduce that plant's reminder frequency
   - Vary snooze return time (2, 4, or 6 hours) based on user patterns
5. **Tone adaptation:**
   - Responsive users get more celebratory tones ("You're amazing at this!")
   - Struggling users get extra encouragement (no guilt, just support)
6. **Analytics dashboard:** Shows user care patterns, reminder effectiveness, adaptation changes made

**Prerequisites:** Story 2.9 complete (push notifications working)

---

### Story 2.11: Mood System - Visual Indicators

As a user,
I want to see my plant's current mood visually,
So that I can quickly understand if my plant is happy, thirsty, or neglected.

**Acceptance Criteria:**

1. Mood indicator displayed prominently on plant card (home screen) and detail view
2. Five mood states with visual icons and colors:
   - Happy 😊 (green) - Recently cared for, all needs met
   - Content 🙂 (light green) - Doing well
   - Thirsty 😐 (yellow) - Care due soon
   - Dramatic 😰 (orange) - Care overdue
   - Wilting 😢 (red) - Significantly overdue
3. Mood emoji/icon matches personality archetype (dramatic plants more expressive)
4. Mood color coding consistent across UI (health bar uses same color scheme)
5. Mood updates immediately when care action logged
6. Animated mood transition when state changes

**Prerequisites:** Story 1.8 complete (home screen with plant cards)

---

### Story 2.12: Mood Calculation Logic (Time-Based)

As a system,
I want to calculate plant moods based on time since expected care,
So that mood indicators accurately reflect plant status.

**Acceptance Criteria:**

1. Mood calculation runs automatically every hour for all plants
2. Initial version uses time-based rules (hours since watering scheduled):
   - Happy: Watered within schedule window
   - Content: 0-24 hours since due
   - Thirsty: 24-48 hours overdue
   - Dramatic: 48-72 hours overdue
   - Wilting: 72+ hours overdue
3. Species care frequency defaults used for calculations (from Story 1.4)
4. Mood persisted to database to avoid recalculation on every view
5. New plants start in "Happy" mood
6. Mood logic designed to be enhanced in Epic 3 (with actual care logs)

**Prerequisites:** Story 2.11 complete (mood visualization exists)

---

### Story 2.13: Personality Introduction & Onboarding

As a new user,
I want to experience my first plant's personality immediately,
So that I understand the unique value proposition and feel delighted.

**Acceptance Criteria:**

1. After user names their first plant (Story 1.7), personality introduction screen appears
2. Introduction shows personality preview: avatar, archetype name, sample dialogue
3. Personality says hello with character-appropriate greeting
4. User prompted to ask first question or tap "Meet [Plant Name]" to see profile
5. Tutorial tooltip points to chat button: "Talk to your plant anytime!"
6. Onboarding flow feels magical and sets tone for product experience
7. Skip option available for users adding subsequent plants (introduction condensed)

**Prerequisites:** Story 1.7 complete (plant naming flow), Story 2.4 (chat UI exists)

---

### Story 2.14: Personality Tone Testing & Calibration

As a product manager,
I want comprehensive validation that personality tones feel encouraging and not annoying,
So that we achieve the critical success factor of tone calibration at scale.

**Acceptance Criteria:**

1. A/B testing framework implemented to test personality variants
2. Test cohorts exposed to 3 personality tone levels: gentle, moderate, dramatic
3. **Expanded beta test:** Minimum 500 users (not 100), 14-day period (not 7)
4. **Mandatory exit survey:** "Did personality ever make you feel bad/guilty?" (Yes/No + details)
5. User feedback survey triggered after 7 days: "How do you feel about [Plant Name]'s personality?"
6. Analytics track: conversation frequency, reminder snooze rate, plant deletion rate by personality
7. "Annoying" feedback triggers immediate alert for manual review
8. Personality prompts adjustable via remote configuration (no app update required)
9. Tone calibration dashboard shows sentiment metrics per personality archetype
10. **Quality gate:** <5% users report annoying/guilt-tripping before full launch

**Prerequisites:** Story 2.5 complete (conversations working), Story 2.8 (reminders working)

---

### Story 2.15: Emergency Tone Adjustment System

As a product manager,
I want to quickly adjust personality tones without app updates,
So that we can respond to negative feedback immediately if tone issues emerge.

**Acceptance Criteria:**

1. **Remote configuration system:** Personality prompts stored in cloud config (Firebase Remote Config or similar)
2. **Tone dial control:** Admin dashboard with sliders for each personality (gentle ← → dramatic)
3. **Instant updates:** Tone changes propagate to all users within 5 minutes (no app update)
4. **Preset tone profiles:** One-click switch between "gentle", "moderate", "dramatic" for all personalities
5. **Emergency shutdown:** Kill switch to disable personality interactions if critical tone issue detected
6. **A/B testing integration:** Can deploy tone variants to specific user cohorts
7. **Rollback capability:** Revert to previous tone settings with one click
8. **Change logging:** All tone adjustments logged with timestamp, admin, reason
9. **Real-time sentiment monitoring:** Alerts triggered if app rating drops below 4.0 or "annoying" keywords spike

**Prerequisites:** Story 2.14 complete (tone testing framework exists)

---

### Story 2.16: API Reliability Monitoring & Alerts

As a system administrator,
I want comprehensive monitoring of LLM provider health and costs,
So that we can proactively address reliability and budget issues.

**Acceptance Criteria:**

1. **Real-time provider monitoring:**
   - Primary LLM provider uptime tracking
   - Secondary failover provider uptime tracking
   - Response latency monitoring (alert if >3 second average)
2. **Automatic degradation:**
   - If primary latency >5 seconds, switch to secondary provider
   - If both providers down, activate local fallback library (Story 2.6)
3. **User communication:**
   - On first degradation: "Personality responses may be simpler right now"
   - Status page shows current system health
4. **Cost monitoring dashboard:**
   - Real-time cost per user
   - Monthly burn rate projection
   - Budget alerts at 75%, 90%, 100% of monthly allocation
5. **Health check frequency:** Every 60 seconds
6. **Alert channels:** Slack/email notifications for critical issues
7. **Incident response playbook:** Documented steps for common failure scenarios
8. **Weekly cost reports:** Automated reports showing cost trends, cache effectiveness, usage patterns

**Prerequisites:** Story 2.7 complete (caching and cost tracking exists)

---

**Epic 2 Summary:**

- **16 stories** (was 11) delivering AI personality system with robust failsafes
- **Key Deliverable:** Plants have distinct personalities, users chat with them, personality-driven reminders adapt to user behavior, mood system reflects care status
- **Critical Success Factor:** Tone calibration ensures personalities are delightful, not annoying (validated with 500+ user beta)
- **Risk Mitigations Applied:** Early tone testing, LLM cost controls, API failover, adaptive reminders, emergency tone adjustment
- **Next Epic:** Epic 3 will add care scheduling, photo tracking, and enhance mood calculation with real care data

---

## Epic 3: Care Scheduling, Photos & Growth Tracking

**Expanded Goal:**

Complete the daily engagement loop by implementing intelligent care scheduling, visual growth tracking, and comprehensive care logging. Users can track their plant care history with photo timelines, log care actions (watering, fertilizing, repotting), and see health status visualized clearly. The mood system is enhanced to use actual care data rather than time estimates, creating accurate feedback that reinforces positive care habits. This epic transforms MyPlantFamily from a personality companion into a fully functional plant care management system that rewards consistent attention.

---

### Story 3.1: Care Schedule Data Model

As a developer,
I want a robust care scheduling data model and care logging system,
So that plant care history is tracked accurately and schedules can be customized per plant.

**Acceptance Criteria:**

1. Care schedule schema defined (schedule_id, plant_id, care_type, frequency, next_due_date, custom_schedule)
2. Care log schema defined (log_id, plant_id, care_type, timestamp, notes, photo_id)
3. Care types supported: watering, fertilizing, repotting, pruning, pest_treatment
4. Frequency options: daily, every_x_days, weekly, biweekly, monthly, custom
5. Default schedules auto-populated from species data (Story 1.4) when plant created
6. CRUD operations for schedules and logs
7. Database indexes optimized for querying by plant_id and date ranges

**Prerequisites:** Story 1.4 complete (species database with care defaults)

---

### Story 3.2: Auto-Generated Care Schedules

As a user,
I want my plants to automatically have care schedules based on their species,
So that I don't have to research care requirements manually.

**Acceptance Criteria:**

1. When plant created, care schedule auto-generated from species defaults
2. Watering schedule created with species-appropriate frequency (e.g., Monstera: every 7 days, Cactus: every 14 days)
3. Fertilizing schedule created (typically monthly during growing season)
4. Next due dates calculated from plant creation date
5. Schedule displayed on plant detail view showing upcoming care actions
6. Visual calendar view shows all plants' care needs for the week
7. User shown explanation of schedule: "Based on typical Monstera care, watering every 7 days"

**Prerequisites:** Story 3.1 complete (schedule data model exists)

---

### Story 3.3: Manual Care Logging

As a user,
I want to log when I water, fertilize, or care for my plants,
So that I can track my care history and the app knows my plant is healthy.

**Acceptance Criteria:**

1. "Log Care" button prominent on plant detail view
2. Care logging interface shows quick-action buttons: Water, Fertilize, Repot, Other
3. Tapping care type logs action with current timestamp
4. Optional notes field for additional details (e.g., "Added fertilizer", "Leaves looking yellow")
5. Care action immediately updates plant's next due date based on schedule
6. Visual confirmation shown: "Watered [Plant Name]! Next watering in 7 days"
7. Care log saved to database with plant_id, care_type, timestamp, notes
8. Plant's mood updates immediately to reflect care action (Epic 2 mood system)

**Prerequisites:** Story 3.1 complete (care log data model), Story 2.11 complete (mood visualization)

---

### Story 3.4: Care History View

As a user,
I want to see my plant's complete care history,
So that I can understand care patterns and identify issues.

**Acceptance Criteria:**

1. "Care History" tab on plant detail view
2. Timeline view shows all care actions in reverse chronological order
3. Each entry displays: care type icon, timestamp, notes (if any)
4. Grouped by month for easy scanning
5. Filter options: All care types, Watering only, Fertilizing only, etc.
6. Visual indicators show consistency: "Watered on time 8 of last 10 times"
7. Empty state encourages first care log: "Start tracking [Plant Name]'s care today!"
8. Scrollable history loads older entries on demand (pagination)

**Prerequisites:** Story 3.3 complete (care logging exists)

---

### Story 3.5: Customizable Care Schedules

As a user,
I want to adjust my plant's care schedule based on my home environment,
So that reminders match my plant's actual needs, not just species defaults.

**Acceptance Criteria:**

1. "Edit Schedule" button on plant detail view
2. For each care type, user can adjust:
   - Frequency (every X days, weekly, biweekly, monthly, custom)
   - Next due date (if different from calculated)
   - Enable/disable care type
3. Changes save and update next due dates immediately
4. Custom schedules marked with indicator: "Custom schedule (adjusted from species default)"
5. Reset to default option restores species-based schedule
6. Validation prevents invalid schedules (e.g., watering every 0 days)
7. Schedule changes reflected in reminders (Epic 2 reminder system)

**Prerequisites:** Story 3.2 complete (auto-generated schedules exist)

---

### Story 3.6: Photo Timeline Tracking

As a user,
I want to add photos regularly and see my plant's growth over time,
So that I can celebrate progress and share visual milestones.

**Acceptance Criteria:**

1. "Add Photo" button on plant detail view (in addition to care logging)
2. Camera opens to capture new photo with current timestamp
3. Photo added to plant's timeline with date label
4. Timeline view shows photos in chronological grid (3 columns on mobile)
5. Tapping photo opens full-screen view with swipe navigation
6. Photo metadata includes: date, optional caption, photo_id linked to plant
7. Compare view: Side-by-side display of first photo vs. latest photo to show growth
8. Option to add photo when logging care action ("Log watering + add photo")
9. Photo upload uses cloud storage from Story 1.10

**Prerequisites:** Story 1.10 complete (photo storage), Story 3.3 complete (care logging)

---

### Story 3.7: Health Status Visualization

As a user,
I want to see my plant's overall health status at a glance,
So that I can quickly identify plants that need attention.

**Acceptance Criteria:**

1. Health bar displayed prominently on plant card (home screen) and detail view
2. Health calculated from multiple factors:
   - Care consistency (% of care actions completed on time in last 30 days)
   - Time since last watering (overdue decreases health)
   - Photo frequency (regular photos indicate attention)
3. Health levels with color coding:
   - Thriving: 90-100% (vibrant green)
   - Healthy: 70-89% (green)
   - Fair: 50-69% (yellow)
   - Struggling: 30-49% (orange)
   - Critical: 0-29% (red)
4. Health bar fills proportionally (visual percentage indicator)
5. Tapping health bar shows breakdown: "Care consistency: 85%, Last watered: 2 days ago"
6. Health updates immediately when care logged
7. Health trends tracked over time (improving/declining indicator)

**Prerequisites:** Story 3.3 complete (care logging), Story 3.4 (care history for calculation)

---

### Story 3.8: Enhanced Mood Calculation with Care Data

As a system,
I want to calculate plant moods using actual care logs instead of time estimates,
So that mood accurately reflects user's care attention and plant health.

**Acceptance Criteria:**

1. Mood calculation (from Story 2.12) enhanced to use care log data
2. Mood factors include:
   - Time since last watering logged (not just scheduled time)
   - Care consistency pattern (frequent vs. sporadic)
   - Overall health status (from Story 3.7)
3. Mood states recalibrated with actual data:
   - Happy: Recently watered + good care history
   - Content: On schedule, no issues
   - Thirsty: Approaching due date
   - Dramatic: Overdue by species tolerance
   - Wilting: Significantly overdue + poor care history
4. New plants maintain time-based mood for first 2 weeks (until care pattern established)
5. Mood updates immediately when care logged
6. Species tolerance factored (cacti tolerate longer gaps than ferns)
7. Mood calculation runs every hour, considers last 30 days of care data

**Prerequisites:** Story 2.12 complete (mood calculation exists), Story 3.4 complete (care history available)

---

**Epic 3 Summary:**

- **8 stories** delivering care scheduling, photo tracking, and health visualization
- **Key Deliverable:** Automated care schedules, photo timeline tracking, care history logs, health status visualization, enhanced mood calculation using real care data
- **Value Delivered:** Completes the daily engagement loop - users can track care, see growth, and get accurate feedback
- **Next Epic:** Epic 4 will add social sharing and premium monetization to enable viral growth and sustainability

---

## Epic 4: Social Sharing & Premium Monetization

**Expanded Goal:**

Enable viral organic growth through compelling social sharing features and establish sustainable revenue through a well-designed freemium model. Users can share their plants' personality moments, growth progress, and care achievements to Instagram, Twitter, and TikTok with beautifully designed shareable cards. The premium tier unlocks unlimited plants, enhanced personality features, and advanced analytics, with pricing optimized for 5-8% conversion. This epic transforms MyPlantFamily from a personal tool into a shareable experience while ensuring long-term business viability.

---

### Story 4.1: Shareable Content Card Design System

As a designer/developer,
I want a flexible card design system for shareable content,
So that shared posts look professional and on-brand across all social platforms.

**Acceptance Criteria:**

1. Card template system created with multiple layout options:
   - Plant profile card (photo, name, personality quote, app branding)
   - Conversation snippet card (chat bubbles, plant personality highlighted)
   - Growth progress card (before/after photos, time elapsed, growth stats)
   - Care achievement card (streak milestones, care consistency badge)
2. Design follows brand guidelines: warm color palette, organic aesthetic, playful but not childish
3. Templates optimized for each platform:
   - Instagram: Square 1080x1080px and Story 1080x1920px
   - Twitter: 1200x675px
   - TikTok: Vertical 1080x1920px
4. Dynamic text rendering handles long plant names and personality quotes gracefully
5. App branding subtle but visible: "MyPlantFamily" logo, app store link embedded
6. High-quality rendering (300dpi equivalent for crisp social media display)
7. Cards generated server-side or client-side based on performance testing

**Prerequisites:** Story 1.8 complete (plant data available), Story 2.5 complete (personality content exists)

---

### Story 4.2: Share Plant Profile

As a user,
I want to share my plant's profile to social media,
So that I can show off my plant family to friends.

**Acceptance Criteria:**

1. "Share" button on plant detail view
2. Share dialog shows preview of generated card (plant photo, name, personality archetype)
3. User can select platform: Instagram, Twitter, TikTok, or "Copy Link"
4. Platform-specific card generated (correct dimensions from Story 4.1)
5. Native share sheet integration on iOS/Android
6. Card includes personality-appropriate quote: "Monty the Dramatic Monstera says: 'Darling, I'm simply THRIVING!' 🌿"
7. Shared content includes link to app download page
8. Analytics track: shares per plant, platform breakdown, conversion from shares to installs

**Prerequisites:** Story 4.1 complete (card design system), Story 1.9 complete (plant detail view)

---

### Story 4.3: Share Conversation Snippets

As a user,
I want to share funny or interesting conversations with my plant,
So that I can entertain my friends with my plant's personality.

**Acceptance Criteria:**

1. "Share" button in chat interface (Story 2.4)
2. User selects conversation snippet (last 3-5 messages) to share
3. Card displays chat bubbles with user messages and plant responses
4. Plant personality avatar shown with responses
5. Card design emphasizes personality character (e.g., dramatic Monstera gets theatrical styling)
6. User can edit/trim snippet before sharing (remove sensitive messages)
7. Card includes context: "[Plant Name] and I had a chat today! 💬"
8. Share tracking: conversation shares per personality type, viral coefficient analysis

**Prerequisites:** Story 4.1 complete (card design system), Story 2.4 complete (chat system)

---

### Story 4.4: Share Growth Progress

As a user,
I want to share before/after photos showing my plant's growth,
So that I can celebrate milestones and inspire other plant parents.

**Acceptance Criteria:**

1. "Share Growth" button on photo timeline view (Story 3.6)
2. User selects two photos: before (typically first photo) and after (latest or selected)
3. Card shows side-by-side comparison with time elapsed ("3 months of growth!")
4. Growth stats displayed: "Went from 3 leaves to 8 leaves! 🌿"
5. Optional caption field for user's personal message
6. Card emphasizes visual transformation (large photos, minimal text)
7. Personality adds encouragement: "Thanks to [User Name] for being an amazing plant parent!"
8. Share tracking: growth shares, time-to-share from plant creation

**Prerequisites:** Story 4.1 complete (card design), Story 3.6 complete (photo timeline)

---

### Story 4.5: Share Care Achievements

As a user,
I want to share care milestones and achievements,
So that I can celebrate my dedication and encourage others.

**Acceptance Criteria:**

1. Achievement system tracks milestones:
   - Care streaks (7 days, 30 days, 90 days of on-time care)
   - Plant anniversaries (1 month, 6 months, 1 year with plant)
   - Care consistency badges (90%+ on-time care)
   - Plant collection milestones (3 plants, 5 plants, 10 plants)
2. Achievement unlocked notification with "Share" option
3. Card displays achievement badge, milestone description, plant involved
4. Visual design celebratory and rewarding (confetti, badges, vibrant colors)
5. Optional personal message from user
6. Personality congratulates user: "You've kept me alive for 6 months! I'm impressed! 💚"
7. Share tracking: achievement shares, most shared milestone types

**Prerequisites:** Story 4.1 complete (card design), Story 3.4 complete (care history for tracking)

---

### Story 4.6: Freemium Tier Definition & Enforcement

As a product manager,
I want clearly defined free and premium tiers with proper enforcement,
So that users understand value proposition and limits are respected.

**Acceptance Criteria:**

1. **Free Tier Features:**
   - Up to 3 plants maximum
   - Basic personality interactions (10 conversations/day)
   - Standard care reminders
   - Photo timeline (1 photo per plant per day)
   - Social sharing (all features)
   - Basic care history
2. **Premium Tier Features ($6.99/month or $59.99/year):**
   - Unlimited plants
   - Unlimited personality conversations
   - Enhanced personality memory (references past conversations)
   - Priority LLM responses (faster, no rate limiting)
   - Advanced care analytics dashboard
   - Ad-free experience
   - Early access to new features
3. Enforcement logic prevents free users from exceeding 3 plants
4. Upgrade prompts shown at logical moments (attempting to add 4th plant)
5. Premium features clearly marked with "Premium" badge in UI
6. Pricing displayed transparently (no hidden costs)
7. Feature comparison table available in settings

**Prerequisites:** None (defines business model)

---

### Story 4.7: Premium Upgrade Flow & Paywall

As a user,
I want a clear and compelling upgrade experience,
So that I understand premium value and can easily subscribe.

**Acceptance Criteria:**

1. **Paywall trigger points:**
   - Attempting to add 4th plant (hard paywall)
   - After 8 conversation limit in a day (soft prompt with skip option)
   - On premium feature discovery (e.g., tapping analytics dashboard)
   - Periodic gentle prompts for engaged free users (once per week maximum)
2. **Upgrade screen displays:**
   - Premium features list with clear benefits
   - Pricing options: Monthly $6.99, Annual $59.99 (30% savings highlighted)
   - Free trial offer: 7 days free trial for new premium users
   - User testimonials/reviews (if available)
   - "Not now" option (non-intrusive)
3. Social proof: "Join 1,234 premium plant parents!"
4. Clear value proposition: "Grow your plant family without limits"
5. Premium features previewed with screenshots
6. One-tap upgrade with platform payment (App Store/Google Play)
7. Trial terms clearly stated: "Free for 7 days, then $6.99/month. Cancel anytime."

**Prerequisites:** Story 4.6 complete (tier definitions)

---

### Story 4.8: Payment Processing & Subscription Management

As a user,
I want secure payment processing and easy subscription management,
So that I can upgrade confidently and control my subscription.

**Acceptance Criteria:**

1. Platform-native payment integration:
   - iOS: App Store In-App Purchase (StoreKit)
   - Android: Google Play Billing
2. Subscription purchase flow:
   - User selects monthly or annual
   - Platform payment sheet displays
   - Biometric authentication (Face ID/Touch ID)
   - Purchase confirmed, premium unlocked immediately
3. **Subscription management:**
   - Current plan displayed in settings (Free/Premium Monthly/Premium Annual)
   - Renewal date shown for premium users
   - Cancel subscription option (platform-managed)
   - Upgrade from monthly to annual option
4. **Trial management:**
   - 7-day free trial for first-time premium users
   - Trial countdown visible in settings
   - Reminder notification 2 days before trial ends
   - Cancel trial option (no charge if canceled before end)
5. Server-side subscription validation (receipt verification)
6. Grace period handling for failed payments (3 days retention)
7. Cancellation handled gracefully: Premium features remain until period end, then revert to free tier

**Prerequisites:** Story 4.7 complete (upgrade flow exists)

---

### Story 4.9: Premium Analytics Dashboard

As a premium user,
I want advanced analytics about my plant care patterns,
So that I can optimize my care routine and understand my plant family better.

**Acceptance Criteria:**

1. "Analytics" tab in navigation (premium-only, shows upgrade prompt for free users)
2. **Dashboard displays:**
   - Care consistency graph (30-day trend, % on-time)
   - Plant health trends over time (multi-plant comparison)
   - Most/least cared for plants (attention distribution)
   - Optimal care times (when you typically water, based on logged data)
   - Growth metrics (photos added over time, visual progress)
   - Personality interaction stats (conversations per plant, favorite topics)
3. Visual charts/graphs (line charts, bar charts, heat maps)
4. Date range selector (7 days, 30 days, 90 days, all time)
5. Export data option (CSV download for power users)
6. Insights and recommendations: "You water most consistently on Sundays!"
7. Compare plants: Side-by-side health comparison for multiple plants

**Prerequisites:** Story 4.6 complete (premium tier defined), Story 3.4 complete (care data available)

---

### Story 4.10: Trial Conversion Optimization

As a product manager,
I want to maximize free trial conversion to paid subscriptions,
So that we achieve 5-8% premium conversion target.

**Acceptance Criteria:**

1. **Trial onboarding optimization:**
   - Welcome email on trial start highlighting premium benefits
   - In-app tooltip tour of premium features during first 2 days
   - Push notification on day 3: "Loving unlimited plants? Keep it going!"
2. **Mid-trial engagement:**
   - Day 4 email: Case study of power user benefiting from premium
   - Day 5 notification: "2 days left in your trial"
   - In-app badge showing "Premium Trial" status
3. **Pre-expiration reminders:**
   - Day 5: Email reminder with value recap
   - Day 6: Push notification: "Last day of your free trial!"
   - Trial end screen: One-tap continue subscription option
4. **Conversion tracking:**
   - Analytics track trial starts, conversions, cancellations
   - Cohort analysis by acquisition source
   - A/B testing framework for trial messaging
   - Dashboard shows conversion rate by cohort
5. **Fallback offer for cancelers:**
   - Exit survey: "Why are you canceling?" (price, features, didn't use, other)
   - Discount offer for annual plan (if price concern detected)
   - "Pause trial" option to extend by 3 days (one-time use)
6. Target: 30-40% trial-to-paid conversion rate

**Prerequisites:** Story 4.8 complete (trial system working)

---

**Epic 4 Summary:**

- **10 stories** delivering social sharing and premium monetization
- **Key Deliverable:** Social sharing to Instagram/Twitter/TikTok, premium tier with unlimited plants and enhanced features, payment processing, analytics dashboard
- **Business Value:** Enables viral growth (0.3+ shares per user monthly target) and sustainable revenue (5-8% premium conversion target)
- **Total Project Stories:** 10 (Epic 1) + 16 (Epic 2) + 8 (Epic 3) + 10 (Epic 4) = **44 stories**

---

## Overall Epic Summary

**MyPlantFamily - Complete Story Breakdown:**

- **Epic 1:** 10 stories - Foundation & Core Plant Management
- **Epic 2:** 16 stories - AI Personality System & Engagement Loop (enhanced with pre-mortem)
- **Epic 3:** 8 stories - Care Scheduling, Photos & Growth Tracking
- **Epic 4:** 10 stories - Social Sharing & Premium Monetization

**Total: 44 stories** (within Level 3 range, originally estimated 29-38, expanded for robustness)

**Development Sequencing:**

1. Epic 1 delivers working app foundation (users can create accounts, add plants, view collection)
2. Epic 2 delivers core differentiator (AI personalities transform engagement)
3. Epic 3 completes engagement loop (care tracking, growth visualization, accurate feedback)
4. Epic 4 enables growth & sustainability (viral sharing, premium conversion)

**Next Steps:**

- Solution Architecture (required for Level 3 projects)
- Tech Spec per epic (JIT - just in time before implementation)
- Story-level development (Create → Context → Validate → Ready → Develop → Review → Approved)

---
