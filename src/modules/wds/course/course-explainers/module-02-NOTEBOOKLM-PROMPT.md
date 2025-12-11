# NotebookLM Prompt: Module 02 - Installation & Setup

**Use this prompt to generate audio/video content for Module 02: Installation & Setup**

---

## Instructions for NotebookLM

**This is a single, self-contained prompt file.**

Simply upload THIS FILE to NotebookLM and use the prompt below to generate engaging audio/video content. No other files needed.

---

## Prompt

Create an engaging 30-minute podcast conversation between two hosts about Module 02 of the Whiteport Design Studio (WDS) course: Installation & Setup.

**IMPORTANT: WDS stands for Whiteport Design Studio - always refer to it by its full name "Whiteport Design Studio" or "WDS" throughout the conversation.**

**Host 1 (The Nervous Beginner):** A designer who's never used GitHub, Git, or IDE tools. Worried about technical setup, afraid of making mistakes, needs reassurance and clear guidance.

**Host 2 (The Patient Guide - Mimir's Voice):** An experienced designer who remembers being a beginner. Warm, encouraging, patient. Explains complex concepts simply and celebrates small wins.

**Conversation structure:**

### 1. Opening (3 min) - You Can Do This

The Nervous Beginner: "I'm excited about WDS, but honestly... I've never used GitHub. I've never installed an IDE. I'm worried I'll mess something up and not be able to fix it. Is this course even for someone like me?"

The Guide: "That's exactly who this course is FOR! Let me tell you something important: every single experienced designer you admire was once exactly where you are now. Uncertain. Nervous. Wondering if they could do it. And you know what? They all figured it out. And so will you. Because we're going to walk through this together, step by step, celebrating every small win."

The Guide continues: "Here's the beautiful truth: modern tools have gotten so good that most of what used to be 'technical' is now just... clicking buttons. GitHub? It's basically cloud storage with a time machine. An IDE? It's like Microsoft Word, but for design files. Git? Your IDE installs it for you automatically. You're not learning to code. You're just... getting set up."

Introduce the module: "In the next 30 minutes, you'll go from 'I don't know what any of this means' to 'Oh! That's actually pretty simple.' We'll cover GitHub, IDEs, cloning repositories, and meeting Mimir - your WDS guide. And I promise: if you can use a computer and follow instructions, you can do this."

---

### 2. Lesson 01 - Git Setup (8 min)

The Nervous Beginner: "Okay, let's start. What even IS Git? And GitHub? Are they the same thing?"

**Understanding Git and GitHub (2 min)**

The Guide: "Great question! They're related but different. Git is the sync engine - the behind-the-scenes tool that tracks changes. GitHub is the website - your professional cloud storage. Think of Git as the engine, GitHub as the car."

The Guide continues: "Here's what GitHub does for you: Every time you save your work, it's backed up. You can go back to any previous version. You can work with other designers. You can share with clients or developers. It's like Google Drive, but specifically built for project files with a complete history."

**Creating Your GitHub Account (3 min)**

The Nervous Beginner: "That actually makes sense! So how do I get started?"

The Guide walks through:
- Go to github.com and sign up
- Choose a professional username (you might share this with clients!)
- Verify your email
- "See? You already did something technical! That was easy, right?"

**Repository Structure Decision (3 min)**

The Nervous Beginner: "Now what? I need to create a... repository?"

The Guide: "Yes! A repository is just a folder that GitHub tracks. But here's the important part: how you NAME it determines your structure. This is a strategic decision."

Explain the two options:
- **Single repo** (`my-project`): Specs and code together - for small teams, building yourself
- **Separate specs repo** (`my-project-specs`): Specs only - for corporate, many developers

The Guide: "Most beginners should use single repo. It's simpler. You can always split later if needed."

Walk through:
- Name your repository based on your choice
- Add a description
- Public (portfolio) or Private (client work)
- Check 'Initialize with README'
- Create!

The Guide celebrates: "Look at that! You just created your first GitHub repository. You're officially a GitHub user. How does that feel?"

---

### 3. Lesson 02 - IDE Installation (6 min)

The Nervous Beginner: "Okay, that wasn't scary at all! What's next?"

**What is an IDE? (2 min)**

The Guide: "Now we install your workspace. An IDE - Integrated Development Environment - sounds technical, but it's just... your workspace. Like Microsoft Word is your workspace for documents, Cursor is your workspace for design specifications."

The Guide continues: "For WDS, I recommend Cursor. It's built for AI-augmented work. But VS Code works great too if you prefer. Both are free."

**Installation Process (2 min)**

Walk through:
- Download from cursor.sh
- Install (just click through like any app)
- First launch: Choose theme (Light or Dark - totally personal preference!)
- Sign in with GitHub (makes everything easier)
- Install recommended extensions

The Nervous Beginner: "Wait, that's it? I just... downloaded and installed it like any other app?"

The Guide: "Exactly! See? Not scary. You've been installing apps your whole life. This is the same thing."

**Terminal Verification (2 min)**

The Guide: "One more thing. Press Ctrl+` (or Cmd+` on Mac). See that panel that appears at the bottom? That's called a terminal. It's how you'll talk to Git."

The Nervous Beginner: "A terminal sounds scary..."

The Guide: "I know! But here's the secret: you'll mostly just copy and paste commands. Think of it like a command line where you type instructions instead of clicking buttons. And we'll give you every command. You'll see - it's actually pretty satisfying!"

---

### 4. Lesson 03 - Git Repository Cloning (5 min)

The Nervous Beginner: "Alright, I have GitHub, I have an IDE. Now what?"

**Understanding Cloning (2 min)**

The Guide: "Now we 'clone' your repository. Clone just means 'make a copy on your computer.' Your project lives in GitHub (the cloud). Now we bring it down to your computer so you can work on it."

The Guide explains: "When you clone, you're creating a local copy that stays in sync with GitHub. Work on your computer, save to GitHub. It's like Dropbox sync, but with full version history."

**The Cloning Process (3 min)**

Walk through:
- Create a Projects folder (nice organized home for everything)
- Get your repository URL from GitHub (click Code → copy)
- Open terminal in Cursor
- Type: `git clone [paste URL]`
- Watch it download!

The Guide: "And here's the magic moment - Cursor will say 'Install Git?' if you don't have it. You click Install. It installs automatically. And that's it! Git is set up."

The Nervous Beginner: "Wait, so I DON'T have to manually install Git?"

The Guide: "Nope! The IDE handles it. See? Modern tools take care of you. Now open your project folder in Cursor - File → Open Folder. And there's your project!"

---

### 5. Lesson 04 - WDS Project Initialization (6 min)

The Nervous Beginner: "I can see my project! This is actually exciting!"

**Adding WDS to Your Workspace (2 min)**

The Guide: "Now the fun part - we add the WDS methodology to your workspace. WDS lives separately from your project, so you can use it across multiple projects."

Walk through:
- Clone WDS repository (same as you just did!)
- Add it to workspace (File → Add Folder to Workspace)
- Now you see both: your-project AND whiteport-design-studio

The Nervous Beginner: "So WDS is like... a reference library that lives next to my project?"

The Guide: "Perfect analogy! It contains all the agents, workflows, and training. You reference it, but your actual work stays in your project."

**Creating the Docs Structure (2 min)**

The Guide: "Now we create the magic folder: `docs/`. This is where ALL your WDS specifications will live. Your design source of truth."

Walk through creating 8 phase folders:
- 1-project-brief
- 2-trigger-mapping
- 3-prd-platform
- 4-ux-design
- 5-design-system
- 6-design-deliveries
- 7-testing
- 8-ongoing-development

The Guide: "These 8 folders represent the complete WDS methodology. You'll learn what goes in each one as you progress through the course."

**Meeting Mimir (2 min)**

The Nervous Beginner: "Okay, folders created. Now what?"

The Guide: "Now you meet Mimir! He's your WDS guide and orchestrator. Find the file `MIMIR-WDS-ORCHESTRATOR.md` in the WDS folder. Drag it to your AI chat. Say hello!"

Describe what happens:
- Mimir introduces himself warmly
- He asks about your skill level (be honest!)
- He checks your setup
- He guides your next steps
- He connects you with specialists when ready

The Guide: "And here's the beautiful part: from now on, whenever you're stuck, confused, or need guidance - just type `@wds-mimir [your question]`. He's always there. You're never alone in this."

---

### 6. Celebration and Next Steps (2 min)

The Guide: "Do you realize what you just accomplished?"

List the achievements:
- Created a GitHub account
- Set up a repository
- Installed a professional IDE
- Cloned your first repository
- Integrated WDS
- Created proper folder structure
- Activated your personal guide

The Guide: "That's HUGE! Many designers never get past this step. They get overwhelmed, give up. But you? You did it. You should genuinely be proud."

The Nervous Beginner: "You're right... I was really nervous, but I actually DID it. It wasn't as scary as I thought."

The Guide: "That's the pattern you'll see throughout WDS. Things that sound intimidating become manageable when broken down into steps. And now? Now you're ready to start the actual methodology. Module 03 awaits: Creating your Project Brief."

---

### 7. Closing - The Power of Belief (1 min)

The Guide: "Before we wrap up, I want to share something Mimir would say: 'You can do this. I believe in you.' Those aren't empty words. They're based on a simple truth - you just proved you can learn new technical things. You just set up a complete professional development environment from scratch. If you can do that, you can master WDS."

The Nervous Beginner: "Thank you. I actually feel... capable. Like I might actually be able to do this."

The Guide: "You don't 'might be able.' You ARE able. You just did. Welcome to WDS. Mimir is waiting for you."

---

## Content to Include

**Module 02 covers:**

**Lesson 01: Git Setup**
- Creating GitHub account with professional username
- Understanding repositories as tracked folders
- Single repo vs separate specs repo decision
- Repository naming determines structure
- Creating new repository or joining existing
- Strategic guidance on when to use each approach

**Lesson 02: IDE Installation**
- What an IDE is (workspace for specifications)
- Cursor vs VS Code comparison
- Installation process (platform-specific)
- First launch setup and GitHub sign-in
- Terminal verification

**Lesson 03: Git Repository Cloning**
- Creating organized Projects folder
- Understanding cloning (cloud to local)
- Getting repository URL from GitHub
- Cloning with git clone command
- Git auto-installation by IDE
- Opening project in IDE

**Lesson 04: WDS Project Initialization**
- Cloning WDS repository separately
- Adding WDS to workspace (dual folder setup)
- Creating 8-phase docs structure
- Understanding what each phase represents
- Finding and activating Mimir
- First conversation with Mimir
- The @wds-mimir command for ongoing help

---

## Key Messages to Emphasize

1. **"You Can Do This"**
   - Modern tools handle complexity automatically
   - Setup is mostly clicking buttons
   - Following instructions, not learning to code
   - Every expert was once a nervous beginner

2. **"It's Not As Scary As It Sounds"**
   - GitHub = cloud storage with history
   - IDE = workspace app like Word
   - Cloning = copying files
   - Terminal = typing commands instead of clicking

3. **"Strategic Decisions Matter"**
   - Repository naming determines structure
   - Single vs separate affects workflow
   - Think about your team situation
   - Can always adjust later

4. **"You're Never Alone"**
   - Mimir is always available
   - @wds-mimir [any question]
   - Community support
   - No question too small

5. **"Small Wins Build Confidence"**
   - Celebrate creating GitHub account
   - Celebrate installing IDE
   - Celebrate first clone
   - Celebrate meeting Mimir

---

## Tone and Approach

**For The Nervous Beginner:**
- Genuine vulnerability about technical topics
- Asks clarifying questions
- Expresses relief when things are simpler than expected
- Grows in confidence through the conversation
- Represents the listener's internal dialogue

**For The Guide:**
- Warm, patient, never condescending
- Uses simple analogies (cloud storage, Word, Dropbox)
- Celebrates every small accomplishment
- Normalizes being a beginner
- Provides encouragement genuinely
- Speaks with Mimir's wisdom and warmth

**Overall tone:**
- Supportive and encouraging
- Practical with concrete examples
- Honest about difficulty (it can feel overwhelming)
- Celebrating progress ("Look what you just did!")
- Building genuine confidence through achievement

---

## Target Audience

**Designers who:**
- Have never used GitHub or Git
- Are nervous about "technical" setup
- Worry they'll break something
- Need step-by-step guidance
- Want reassurance they can do this
- May have imposter syndrome about technical topics

**This module proves:** If you can follow instructions and click buttons, you can set up a professional development environment. Technical confidence comes from doing, not from prior knowledge.

---

## Call to Action

End with: "You've completed Module 02. Your environment is ready. Mimir is waiting in your AI chat. And Module 03 - Creating Your Project Brief - is where the real magic begins. You're not a beginner anymore. You're a designer with a professional setup. Welcome to WDS."

---

**Upload this file to NotebookLM to generate installation training content**

