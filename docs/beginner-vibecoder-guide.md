# BMad Method: The Complete Beginner & Vibecoder Guide 🚀

**Build Your Dream App Without Being a "Real" Developer**

*Reading Time: ~20 minutes | No coding experience required*

---

## 🎯 What is BMad Method?

Imagine having a **team of expert AI assistants** who actually understand how to build software properly—a project manager, architect, designer, and developer all working together to help YOU create real apps.

**That's BMad Method.**

Instead of just asking AI to "make me an app" and hoping for the best, BMad gives you a **structured process** with specialized AI agents who guide you step-by-step. It's like having a professional development team in your pocket.

### The Name
**B**uild **M**ore, **A**rchitect **D**reams = **BMAD** 

---

## 🌈 Is This For Me?

**YES, if you:**
- ✅ Have ideas for apps but don't know how to build them
- ✅ Use AI tools like ChatGPT or Claude to help with coding
- ✅ Call yourself a "vibecoder" or "prompt engineer"  
- ✅ Get frustrated when AI-generated code doesn't work
- ✅ Want to build real projects, not just toy examples
- ✅ Have no formal programming training

**BMad Method turns your vague ideas into working software through guided conversations with AI.**

---

## 🤖 Meet Your AI Team

BMad Method gives you access to **specialized AI agents**, each with their own personality and expertise. Think of them as different hats you can put on your AI:

### The Main Players

| Agent | Name | What They Do | When to Use Them |
|-------|------|--------------|------------------|
| 📊 **Analyst** | Mary | Helps brainstorm and research | "I have an idea but need to think it through" |
| 📋 **PM** | John | Creates the plan/blueprint | "I need to write down what I want to build" |
| 🎨 **UX Designer** | - | Designs how it looks/feels | "I want to plan the user interface" |
| 🏗️ **Architect** | Winston | Designs the technical structure | "How should the pieces fit together?" |
| 👨‍💻 **Developer (DEV)** | - | Actually writes the code | "Let's build this thing!" |
| 🏃 **Scrum Master (SM)** | - | Manages sprints and stories | "What should I work on next?" |
| 🧪 **Test Architect (TEA)** | - | Makes sure it works | "Does this actually function correctly?" |
| ✍️ **Tech Writer** | - | Creates documentation | "Help me document this" |

### Why Different Agents?

When you ask generic ChatGPT "build me an app," it tries to do everything at once and often fails. BMad agents **specialize**, which means:

- Better answers in their domain
- Less confusion and hallucination
- They know what questions to ask YOU
- They follow proven processes

---

## 🛣️ The Three Tracks (Pick Your Speed)

BMad automatically adapts to what you're building:

### ⚡ Quick Flow (Hours)
**For:** Bug fixes, small features, simple additions

"Fix my login button" or "Add a dark mode toggle"

**What you'll do:** Quick tech spec → Build immediately

---

### 📋 BMad Method (1-2 Days) ⭐ RECOMMENDED FOR BEGINNERS
**For:** Real apps, products, features with multiple parts

"Build a habit tracker app" or "Create a portfolio website with blog"

**What you'll do:** 
1. Brainstorm (optional)
2. Create requirements document (PRD)
3. Design architecture
4. Build step by step

---

### 🏢 Enterprise Method (2-3 Days)
**For:** Complex systems with security/compliance needs

"Build a multi-user accounting platform"

**What you'll do:** Everything above + security, testing, and compliance planning

---

## 🎬 Your First Project: Step by Step

Let's walk through building something real. We'll assume you're using the recommended **BMad Method track**.

### Step 0: Install BMad Method 📦

Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
npx bmad-method@alpha install
```

**The installer will ask you several questions. Here's what they mean:**

#### Installation Directory
```
? Installation directory: C:\Users\YourName
```
This is where BMad will live. You can:
- **Press Enter** to use the current folder (recommended if you're in your project folder)
- **Type a path** to install elsewhere

#### Root Folder Name
```
? What is the root folder for BMAD installation? (Recommended: .bmad)
```
Just press **Enter** to accept `.bmad` — this creates a hidden folder to keep things tidy.

#### Your Name
```
? What shall the agents call you?
```
Type your name or nickname. The AI agents will use this when talking to you!

#### Language Settings
```
? Preferred Chat Language/Style? (English, Mandarin, English Pirate, etc...)
? Preferred Document Output Language?
```
Pick your language. Yes, "English Pirate" is a real option if you want fun responses! 🏴‍☠️

#### Docs Folder
```
? Where should AI Generated Artifacts be saved across all modules?
```
Press **Enter** for `docs` — this is where your PRDs, architecture docs, etc. will be saved.

#### Install Documentation
```
? Install user documentation and optimized agent intelligence to each selected modules docs folder?
```
Say **Yes** — this gives you helpful guides right in your project.

#### Project Title
```
? What is the title of your project you will be working on?
```
Name your project! This helps agents understand what you're building.

#### Experience Level ⭐ IMPORTANT
```
? What is your technical experience level?
```
**Choose "Beginner"** if you're new! This changes how agents explain things to you (more details, clearer explanations). The documents they create stay the same — this just affects how they talk to you.

#### Sprint Artifacts Location
```
? Where should Sprint Artifacts be stored?
```
Press **Enter** for the default. This is where your work-in-progress stuff goes.

#### Playwright Testing (Optional)
```
? Enable Test Architect Playwright MCP capabilities?
```
Say **Yes** if you want automated browser testing later, or **No** if you're unsure.

#### IDE Selection
```
? Select tools to configure:
```
**Pick your code editor!** Common choices:
- **Cursor** - Great for beginners, AI-first
- **VS Code + GitHub Copilot** - Most popular
- **Claude Code** - Best AI quality (needs Claude subscription)
- **Windsurf** - Another AI-focused option

Use **spacebar** to select, **Enter** to confirm.

#### 🎉 Installation Complete!

You'll see something like:
```
╭────────────────────────────────────────────────╮
│   📁 Installation Path: C:\Users\You\.bmad     │
│   📦 Modules Installed: bmm                    │
│   🔧 Tools Configured: cursor                  │
╰────────────────────────────────────────────────╯
```

**What just happened?**
- Created a `.bmad` folder with all your agents
- Set up your chosen IDE to work with BMad
- Created a `docs` folder for your project documents
- Configured everything based on your answers

---

### Step 1: Initialize Your Workflow 🎯

Now open your project folder in your code editor (Cursor, VS Code, etc.).

**How to load an agent depends on your IDE:**

#### For Cursor Users:
In the chat, type `@.bmad/bmm/agents/analyst` to load the Analyst agent.

#### For VS Code + GitHub Copilot Users:
Reference the agent file: `@.bmad/bmm/agents/analyst.md`

#### For Claude Code Users:
Use the slash command that was created during install (like `/analyst`).

#### For Windsurf Users:
Reference via `@.bmad/bmm/agents/analyst`

Once the agent is loaded, say:

```
Run workflow-init
```

or type `*workflow-init`

The Analyst will ask you questions like:
- What are you trying to build?
- Is this a new project or existing code?
- How complex do you think it is?

**Just answer naturally!** You might say:

> "I want to build a personal recipe manager app. Users can save recipes, organize them by category, and generate shopping lists. It should have a nice web interface."

The agent will suggest a track (probably BMad Method for this) and create your workflow tracking file (`bmm-workflow-status.yaml`).

---

### Step 2: Check Your Status (Anytime!) 📍

**Lost? Not sure what to do next?** Load any agent and ask:

```
*workflow-status
```

The agent will tell you:
- What phase you're in
- What's been completed  
- What you should do next
- Which agent to use

This is your "where am I?" command. Use it often!

---

### Step 3: Brainstorm Your Idea 💡 (Optional but Fun!)

**Load the Analyst agent** in a **new chat** and say:

```
*brainstorm-project
```

Mary will help you:
- Explore different approaches
- Think about who your users are  
- Consider features you might not have thought of
- Spot potential problems early

**Pro tip:** This is where vibecoders shine! Your creativity + AI structure = magic.

---

### Step 4: Create Your PRD (Product Requirements Document) 📄

**Load the PM agent** in a **new chat** and say:

```
*prd
```

or `*create-prd` — both work!

John will guide you through creating a blueprint that covers:
- **What** you're building (features list)
- **Why** it matters (goals)
- **Who** it's for (users)
- **How** to measure success

This document becomes the "source of truth" that all other agents will reference.

> **Vibecoder Translation:** The PRD is like telling a contractor exactly what house you want before they start building. No more "that's not what I meant!"

---

### Step 5: Design Your UX (If You Have a UI) 🎨

**Load the UX Designer agent** in a **new chat** and say:

```
*ux-design
```

They'll help you plan:
- Screen layouts
- How users navigate
- What buttons go where
- Colors and visual style

---

### Step 6: Create the Architecture 🏗️

**Load the Architect agent** in a **new chat** and say:

```
*create-architecture
```

Winston will design:
- What technologies to use
- How data flows through your app
- Database structure
- How pieces connect

**Don't worry if you don't understand everything**—the architecture document helps the Developer agent write better code.

---

### Step 7: Break It Down into Stories 📝

**Load the PM agent** in a **new chat** and say:

```
*create-epics-and-stories
```

This breaks your big project into small, buildable pieces called "stories":

- ✅ "User can create an account"
- ✅ "User can add a new recipe"
- ✅ "User can search recipes by ingredient"

Each story is something you can build in one coding session.

---

### Step 8: Sprint Planning 🏃

**Load the Scrum Master (SM) agent** in a **new chat** and say:

```
*sprint-planning
```

The SM helps you:
- Decide which stories to tackle first
- Organize work into "sprints" (focused work periods)
- Keep track of what's done vs. in progress

---

### Step 9: Build! 🔨

**Load the Developer (DEV) agent** in a **new chat** and work through stories one at a time.

The dev agent will:
- Reference your PRD for requirements
- Follow the architecture
- Write actual, working code
- Explain what it's doing

**Important:** Build ONE story at a time. Complete it. Test it. Then move to the next.

---

## 💡 Key Concepts Explained Simply

### "Fresh Chat for Each Workflow"

AI has a memory limit. If you do everything in one conversation, it starts forgetting and making stuff up. 

**Rule:** Start a new chat whenever you switch workflows or agents.

### "Agents Have Menus"

When you load an agent, it shows you a menu of things it can do. You can:
- Type `*help` to see the menu
- Type `*workflow-name` to run something (like `*prd` or `*create-architecture`)
- Just describe what you want naturally — the agents are smart!

### "Stories" and "Epics"

- **Story:** One small thing to build ("Add login button")
- **Epic:** Group of related stories ("User Authentication")

### "PRD vs Tech Spec"

- **PRD (Product Requirements Document):** The full plan for bigger projects
- **Tech Spec:** Quick planning doc for simple stuff (Quick Flow track)

### "Sprint Artifacts"

The `docs/sprint-artifacts` folder (created during install) holds:
- Your current sprint status
- Individual story files
- Context that helps agents understand your progress

### The `.bmad` Folder

This hidden folder contains:
- All your agent files (`.md` files)
- Configuration settings  
- Workflow definitions
- Manifests that track everything

**Don't delete it!** But you also don't need to edit it directly.

---

## 🌐 No IDE? Use Web Bundles!

Don't want to install anything? Use BMad agents directly in ChatGPT or Google's Gemini:

1. **Go to:** [BMad Web Bundles](https://bmad-code-org.github.io/bmad-bundles/)
2. **Download** the agent you need (like `pm.xml`)
3. **Create** a Custom GPT or Gemini Gem
4. **Upload** the XML file
5. **Start chatting!**

**Best for:**
- Planning phases (brainstorming, PRD, architecture)
- When you don't have a local development setup
- Trying BMad before committing

> **Pro tip:** Gemini Gems work better than Custom GPTs for BMad workflows.

---

## 🎨 Bonus: Creative Intelligence Suite (CIS)

Need help with **creative thinking**? BMad includes 5 creative coach agents:

| Agent | What They Help With |
|-------|-------------------|
| 🎨 **Carson** | Brainstorming and ideation |
| 🎭 **Maya** | Design thinking process |
| 🔍 **Dr. Quinn** | Problem solving |
| 💡 **Victor** | Innovation strategy |
| 📖 **Sophia** | Storytelling and narrative |

These are perfect for:
- Coming up with app ideas
- Solving tricky design problems
- Creating compelling product pitches
- Thinking outside the box

---

## 🛠️ Recommended Tools for Vibecoders

### Code Editors (IDEs) That Work with BMad

| Tool | Cost | Best For |
|------|------|----------|
| **Cursor** | Free tier available | AI-first coding, beginners |
| **VS Code** + GitHub Copilot | Free | Most popular, tons of extensions |
| **Windsurf** | Free tier | AI-assisted development |
| **Claude Code** | Requires Claude subscription | Best AI quality |

### My Recommendation for Beginners

**Start with Cursor.** It's designed for AI-assisted coding and works great with BMad agents.

---

## ✅ Quick Reference: The Flow

```
📊 Analyst    → *workflow-init          → Sets up your project
📊 Any Agent  → *workflow-status        → Check what's next (use often!)
📊 Analyst    → *brainstorm-project     → Explores your idea (optional)
📋 PM         → *prd                    → Creates the master plan
🎨 UX         → *ux-design              → Plans the interface (if needed)
🏗️ Architect  → *create-architecture    → Designs the system
📋 PM         → *create-epics-and-stories → Breaks it into tasks
🏃 SM         → *sprint-planning        → Organizes your work
👨‍💻 DEV        → (work on stories)       → Actually builds it!
```

**Remember:** Start a **fresh chat** for each workflow!

---

## 🗂️ What Files Get Created?

As you work through the process, BMad creates these files in your `docs/` folder:

| File | Created By | What It Is |
|------|------------|------------|
| `bmm-workflow-status.yaml` | Analyst | Tracks your progress through phases |
| `PRD.md` | PM | Your product requirements document |
| `architecture.md` | Architect | Technical design document |
| `ux-design.md` | UX Designer | Interface and user experience plan |
| `epics/*.md` | PM | Your epic and story breakdowns |
| `sprint-artifacts/` | SM/DEV | Current sprint work files |

---

## ❓ FAQ for Beginners

### "Do I need to know how to code?"

Not to start! BMad guides you through planning, and the Dev agent writes code. BUT you'll learn as you go, and some debugging knowledge helps.

### "What if the AI writes broken code?"

That happens! BMad's structured approach reduces this by:
- Breaking work into small pieces
- Having clear requirements
- Using specialized agents

When code breaks, describe the error to the Dev agent and work through it together.

### "How is this different from just using ChatGPT?"

ChatGPT is a general assistant. BMad agents are **specialized experts** with:
- Defined processes
- Connected workflows  
- Consistent personalities
- Documented best practices

It's the difference between asking a random person for help vs. hiring a professional team.

### "Can I customize the agents?"

Yes! Advanced users can modify agent personalities, add new tools, and even create entirely new agents with BMad Builder.

### "Is this free?"

BMad Method itself is **free and open source**. You'll need:
- An AI provider (OpenAI, Anthropic, Google, etc.)
- A code editor
- That's it!

---

## 🔧 Troubleshooting Common Issues

### "I installed BMad but don't see anything in my editor"

**Check these things:**
1. Did you select an IDE during installation? (The `? Select tools to configure:` step)
2. Is your editor open in the **same folder** where you installed BMad?
3. Look for the `.bmad` folder — it's hidden by default

**To see hidden folders:**
- **Windows:** In File Explorer, View → Show → Hidden items
- **Mac:** In Finder, press `Cmd + Shift + .`
- **VS Code:** The `.bmad` folder should show in the sidebar

### "The agent doesn't respond or shows an error"

1. **Make sure you're referencing the right path:** `.bmad/bmm/agents/analyst.md`
2. **Check your AI is connected:** Your IDE needs API access to work
3. **Try a simpler prompt first:** Just say "hello" to test the connection

### "I'm confused about what to do next"

Load ANY agent and type:
```
*workflow-status
```

This tells you exactly where you are and what to do next.

### "The agent isn't following the workflow"

- **Start a fresh chat** — long conversations confuse AI
- **Be explicit:** Say `*workflow-init` not "can you help me start?"
- **Load the right agent** — check the Quick Reference section

### "I picked the wrong track (Quick Flow vs BMad Method)"

No worries! Run `*workflow-init` again with a new chat and pick differently. Your old files won't be deleted, but you can start fresh.

### "Where did my documents go?"

Check the `docs/` folder in your project. That's where:
- PRD.md
- architecture.md
- Sprint artifacts
- All generated documents live

---

## 🔄 Managing Your Installation

### Check What's Installed

Run this command to see your current BMad setup:

```bash
npx bmad-method status
```

This shows:
- Installation location
- Installed version
- Which modules are installed
- Which IDEs are configured

### Add or Change IDE Configuration

Want to add Cursor support after initially choosing VS Code? Or add another IDE?

**Just run the installer again:**

```bash
npx bmad-method@alpha install
```

When BMad detects an existing installation, you'll see this menu:

```
? What would you like to do?
❯ Quick Update (Settings Preserved)
  Modify BMAD Installation (Confirm or change each setting)
  Remove BMad Folder and Reinstall (Full clean install)
  Compile Agents (Quick rebuild of all agent .md files)
  Cancel
```

**Choose "Modify BMAD Installation"** to:
- Add new IDEs (your previously configured ones show with ✅)
- Change settings
- Add modules you didn't select initially

Your customizations and documents are preserved!

### Quick Update

Choose **"Quick Update"** when:
- A new version of BMad is released
- You want to get the latest agents/workflows
- You don't want to change any settings

This updates everything while keeping your configuration.

### Full Reinstall

Choose **"Remove BMad Folder and Reinstall"** when:
- Something is broken
- You want a completely fresh start
- You made customizations you want to undo

⚠️ **Warning:** This deletes your `.bmad` folder and any agent customizations. Your documents in `docs/` are NOT deleted.

### Uninstall Completely

To remove BMad entirely:

```bash
npx bmad-method uninstall
```

This removes the `.bmad` folder but leaves your documents intact.

---

## 🚀 Ready to Start?

1. **Install:** `npx bmad-method@alpha install`
2. **Initialize:** Load Analyst → `*workflow-init`
3. **Check status:** `*workflow-status` (use this often!)
4. **Plan:** Follow the guided process
5. **Build:** One story at a time
6. **Celebrate:** You just built something real!

---

## 📚 Where to Learn More

- **[Quick Start Guide](../src/modules/bmm/docs/quick-start.md)** - More detailed getting started
- **[YouTube Channel](https://www.youtube.com/@BMadCode)** - Video tutorials
- **[Discord Community](https://discord.gg/gk8jAdXWmj)** - Get help from humans
- **[Main Documentation](./index.md)** - Everything else

---

## 💭 Final Thoughts

**You don't need permission to build things.**

BMad Method exists because building software should be accessible to everyone with an idea. You don't need a CS degree. You don't need years of experience. You need:

- ✨ An idea
- 🤖 The right AI tools
- 📋 A good process

BMad gives you the process. Your AI gives you the capability. **You bring the creativity.**

Now go build something amazing! 🎉

---

*Made with ❤️ for vibecoders everywhere*

*"Build More, Architect Dreams"*
