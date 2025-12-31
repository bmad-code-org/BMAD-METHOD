# Tutorial 06: Platform Architecture

**Let Idunn translate your product vision into technical architecture - you speak design, she speaks code**

---

## Overview

You've designed the experience. Now you need the technical foundation to make it real. But you're a designer, not a developer - how do you define databases, APIs, and system architecture?

**You don't.** Idunn does.

You just describe your product in design language. Idunn translates it into Platform PRD.

**Time:** 30-45 minutes  
**Prerequisites:** Module 05 completed (Trigger Map ready)  
**What you'll create:** Platform PRD & Architecture Document

---

## What You'll Learn

- What a Platform PRD is (and why it matters)
- How to describe your product's technical needs without being technical
- How Idunn helps you think through platform decisions
- What questions she'll ask (so you're not surprised)

---

## What is Platform PRD?

**Platform PRD** = The technical blueprint developers need to build your product.

It includes:
- **System Architecture:** How the pieces fit together
- **Data Models:** What information needs to be stored
- **APIs & Integrations:** How systems talk to each other
- **Technical Requirements:** Performance, security, scalability

**Your superpower:** You don't need to know how to write this. You just need to know **what your product does**.

---

## Step 1: Understand Your Role (2 min)

**Your job as designer:**
- Describe what users need to do
- Explain what data they create/view/edit
- Identify third-party services you want (payments, auth, analytics)
- Share any technical constraints you know about

**Idunn's job:**
- Ask clarifying questions about technical needs
- Translate your product into architecture decisions
- Document data models, APIs, system diagrams
- Flag technical risks and recommend solutions

**You bring product knowledge. She brings technical expertise.**

---

## What to Expect: The Conversation

**Here's how a real session with Idunn looks:**

### Idunn's Opening
```
Hi! I'm Idunn, your technical architect agent.

I see you've completed your Product Brief and Trigger Map. 
Let's translate your product vision into technical architecture.

I'll ask questions about your product in design language. 
You answer naturally - no need for technical terms.

Ready? Let's start with the basics.
```

### Example Questions Idunn Asks

**About Your Product:**
```
Idunn: "What's the core thing users create or manage in your product?"

You: "Users create weekly schedules for family dog care - walks, 
      feeding, vet appointments, etc."

Idunn: "Got it. Do these schedules need to be:
        - Private (only one family)?
        - Shared (multiple families can see each other's)?
        - Collaborative (family members edit together)?"

You: "Collaborative - all family members edit the same schedule."

Idunn: "Perfect. That tells me we need real-time sync and user permissions."
```

**About Users & Authentication:**
```
Idunn: "How do you envision users signing up?"

You: "Email and password should work. Google login would be nice too."

Idunn: "Great! Should users be able to:
        - Invite family members?
        - Have different roles (admin vs. regular member)?"

You: "Yes! The person who creates the schedule is the admin. 
      They can invite family and remove members if needed."

Idunn: "Understood. I'll design a role-based permission system."
```

**About Data & Features:**
```
Idunn: "You mentioned tasks like 'walks' and 'feeding'. 
        What information does each task need?"

You: "Task title, who's assigned, what time/date, and whether 
      it's done or not."

Idunn: "Should tasks repeat? Like 'walk dog every morning'?"

You: "Oh yes! That would be super helpful."

Idunn: "I'll add recurring task patterns. Should we notify 
        the assigned person before the task is due?"

You: "Definitely!"

Idunn: "I'll include a notification system in the architecture."
```

### Built-in Guidance from Idunn

**When you're unsure:**
```
You: "I'm not sure if we need that..."

Idunn: "No problem! Let me explain the trade-offs:

       WITH real-time sync:
       ✅ Family sees changes instantly
       ✅ No confusion about who's doing what
       ❌ Slightly more complex to build
       ❌ Requires internet connection

       WITHOUT real-time sync:
       ✅ Simpler to build
       ✅ Can work offline
       ❌ Family might have outdated info
       ❌ Conflicts if two people edit at once

       For family coordination, real-time is usually worth it.
       What feels right for your users?"
```

**When technical terms come up:**
```
Idunn: "I'll use a REST API for communication between app and server."

You: "What's a REST API?"

Idunn: "Think of it as a waiter in a restaurant:
        - Your app (customer) asks for something
        - The API (waiter) takes the request to the server (kitchen)
        - The server prepares the response (food)
        - The API brings it back to your app

        You don't need to know how it works - just that it's 
        the standard way apps communicate with databases."
```

**When prioritizing features:**
```
Idunn: "Based on your Product Brief, I see you want:
        - Task scheduling (core)
        - Notifications (important)
        - Calendar sync (nice-to-have)
        - Vet appointment reminders (nice-to-have)

        For the Platform PRD, I'll design all of these.
        
        But I'll flag which are 'MVP' (must-have) vs. 
        'Phase 2' (add later) so developers know priorities.
        
        Does that split make sense?"

You: "Yes, but actually calendar sync is really important."

Idunn: "Got it - moving calendar sync to MVP. I'll update the 
        architecture to prioritize that integration."
```

### What Idunn Creates While You Talk

As you answer, Idunn is:
- ✍️ Documenting data models ("Task" entity with fields)
- 🏗️ Sketching system architecture (app, API, database, notifications)
- 🔐 Planning authentication flow (login, permissions, roles)
- 🔗 Identifying integrations (Google Calendar, email notifications)
- ⚠️ Flagging technical risks ("Real-time sync needs WebSocket support")

**You'll see progress updates:**
```
Idunn: "✅ Data model drafted - 3 main entities (User, Family, Task)
        ✅ Authentication flow designed - Social login + email
        🔄 Working on notification system architecture..."
```

---

## Step 2: Activate Idunn (2 min)

```
@idunn

I'm ready to create the Platform PRD for [Your Product Name].

I have:
- Product Brief (done)
- Trigger Map (done)

Please help me define the technical architecture.
```

**Idunn will respond** and start asking questions about your product's technical needs.

---

## Step 3: Answer Idunn's Questions (20-30 min)

Idunn will guide you through understanding your platform needs. She asks questions like:

### About Data
- "What information do users create?"
- "What needs to be saved vs. temporary?"
- "Do users share data with each other?"

**Example answers (you don't need technical terms):**
- "Users create weekly schedules for dog care tasks"
- "Schedules need to be saved permanently and shared with family"
- "Each task has: title, assigned person, date, completion status"

### About Authentication
- "How do users log in?"
- "Do you want social login (Google, Apple)?"
- "Are there different user roles?"

**Example answers:**
- "Email + password, plus Google login"
- "Two roles: Admin (can assign tasks) and Family Member (can complete tasks)"

### About Integrations
- "Do you need notifications?"
- "Payment processing?"
- "Calendar sync?"

**Example answers:**
- "Yes! Send reminders before tasks are due"
- "No payments needed"
- "Would be nice to sync with phone calendar"

### About Performance & Scale
- "How many users do you expect?"
- "Any real-time features?"
- "Mobile app or web?"

**Idunn translates this into:**
- Database schemas
- API specifications
- System architecture diagrams
- Technical requirements docs

---

## Step 4: Review & Refine (10 min)

Idunn will show you the Platform PRD. Don't panic if it looks technical - you don't need to understand every detail.

**What to check:**
- ✅ Does it capture all the features you designed?
- ✅ Are the user roles correct?
- ✅ Did she understand your data needs?
- ✅ Are integrations you wanted included?

**Ask questions like:**
- "Can you explain this part in design terms?"
- "How does this support [specific feature]?"
- "What if we want to add [feature] later?"

**Idunn will clarify** and update the PRD until it's right.

---

## Step 5: Save Your Platform PRD (2 min)

Idunn will save the Platform PRD to your project:

```
/docs/3-platform-prd/
├── 01-platform-architecture.md
├── 02-data-models.md
├── 03-api-specifications.md
└── 04-technical-constraints.md
```

**You now have** everything developers need to understand the technical foundation.

---

## Common Questions

**Q: Do I need to learn technical terms?**  
**A:** No. Speak in design/product language. Idunn translates.

**Q: What if I don't know the answer to her questions?**  
**A:** Say so! Idunn will explain the implications and suggest options.

**Q: Can developers change the architecture later?**  
**A:** Yes. This is a starting point. Developers may refine it.

**Q: Do I need to review APIs and database schemas?**  
**A:** Only if you want to. Focus on whether it supports your design.

---

## What You've Accomplished

🎉 **You just created a Platform PRD** - something that usually requires technical architects!

**You didn't need to:**
- ❌ Learn database design
- ❌ Understand API protocols
- ❌ Draw system architecture diagrams
- ❌ Write technical specifications

**You just:**
- ✅ Described your product in design terms
- ✅ Answered Idunn's questions
- ✅ Reviewed to ensure it supports your design

**That's the WDS superpower:** You focus on design. The agents handle the technical translation.

---

## Next Steps

**Ready to design the UX?**  
→ [Module 08: Initialize Scenario](../module-08-initialize-scenario/tutorial-08.md)

**Want to skip Platform PRD for now?**  
You can come back to this after UX design if you prefer.

---

**Pro Tip:** Even if you're not building the platform yourself, having this PRD helps you communicate with developers and make informed design decisions. You'll know what's technically feasible without becoming a developer yourself.

