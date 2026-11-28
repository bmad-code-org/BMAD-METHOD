# PRD — Section 4: Notifications

## 4.1 Purpose

Teams using Tasklane miss changes to the tasks they care about. Today the only signal is the activity feed, which users check about twice a day according to our analytics. This section defines a notification system that tells users about the changes that matter to them, through the channel they prefer, without adding noise.

## 4.2 Users

- **Contributors** own tasks and need to know when someone comments on, reassigns or changes the due date of a task they own.
- **Leads** watch a project and need to know when a task in it becomes blocked or overdue.
- **Admins** manage the workspace and need to know about billing and security events.

## 4.3 Channels

Notifications go out in three channels:

- In-app: the bell icon in the top bar, with an unread count.
- Email: one message per notification, sent from `notifications@tasklane.io`.
- Mobile push: through our iOS and Android apps.

Every user gets all three channels by default.

## 4.4 Functional requirements

**FR-1 Task events.** The system sends a notification to a task's owner when another user comments on the task, reassigns it, or changes its due date.

**FR-2 Project events.** The system sends a notification to every lead watching a project when a task in that project is marked blocked or passes its due date.

**FR-3 Admin events.** The system sends a notification to every admin when a payment fails or a new admin is added.

**FR-4 Timeliness.** Notifications must feel timely to the user.

**FR-5 Grouping.** When several events about the same task happen within a short time, the system groups them into one notification that lists each event.

**FR-6 Quiet hours.** A user can set quiet hours. During quiet hours no push notifications are sent; they are delivered when quiet hours end. Quiet hours are evaluated in the server's time zone (UTC).

**FR-7 Read state.** Reading a notification in any channel marks it read in every channel.

## 4.5 Non-functional requirements

**NFR-1 Latency.** A notification is delivered to every channel within 1 second of the triggering event at p99.

**NFR-2 Volume.** The system handles 2 million notifications per day at launch and 10 million within a year.

**NFR-3 Reliability.** No notification is lost. Delivery is at least once; duplicates are acceptable for in-app but not for email.

## 4.6 Architecture notes

The notification service consumes task events from the existing event bus. To keep email and push costs down, the service batches pending notifications and sends each batch every 5 minutes. In-app notifications are written to the notifications table at the same time as the batch send.

## 4.7 Acceptance criteria

- A contributor who owns a task receives a notification in all three channels when another user comments on it.
- A lead receives a notification when a watched task becomes blocked.
- An admin receives a notification when a payment fails.
- Grouped notifications list every grouped event in order.
- Reading a notification on mobile marks it read on the web within 10 seconds.

## 4.8 Out of scope

- Slack and Microsoft Teams integrations.
- Digest emails (daily or weekly summaries).
- Per-project notification settings.
