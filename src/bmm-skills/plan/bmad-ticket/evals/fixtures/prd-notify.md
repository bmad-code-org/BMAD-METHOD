# PRD — Notify: user-configurable alerts for Acme Dashboard

Acme Dashboard users miss critical account events because the product only surfaces them in-app. Notify adds real-time alerts users configure themselves. Existing system: Rails monolith, Postgres, Sidekiq, React front end, deployed on Heroku with CI already in place.

## Functional requirements

- FR-1: A user can create, edit, and delete alert rules (event type + threshold + channel) from account settings.
- FR-2: A user can choose delivery per rule: email, SMS, or in-app banner.
- FR-3: When a subscribed event fires, the matching rule delivers within 60 seconds.
- FR-4: A user can snooze any rule for 1 hour, 1 day, or 1 week without deleting it.
- FR-5: A user can view a 30-day delivery history per rule (sent, channel, delivered/failed).
- FR-6: Rule evaluation must not run more than once per event (no duplicate alerts).
- FR-7: An admin can set an org-wide cap on SMS sends per month.
- FR-8: All alert-rule changes are recorded in the existing audit log.

## Non-functional notes

- SMS via the existing Twilio account; email via the existing SendGrid integration.
- Delivery history retention: 30 days, then purge.
