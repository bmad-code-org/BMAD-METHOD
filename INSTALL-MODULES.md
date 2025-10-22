# Installing CIS + BMB Modules

## What You're Installing

### CIS (Creative Intelligence Suite)
**5 Specialized Agents for Creative Work:**
- **Carson** - Elite Brainstorming Specialist
- **Maya** - Design Thinking Maestro
- **Dr. Quinn** - Master Problem Solver
- **Victor** - Disruptive Innovation Oracle
- **Sophia** - Master Storyteller

**Workflows:**
- Brainstorming (36 creative techniques)
- Design Thinking (5-phase process)
- Problem Solving (systematic analysis)
- Innovation Strategy (business model innovation)
- Storytelling (25 story frameworks)

### BMB (BMad Builder)
**Build Your Own BMad Components:**
- Create custom agents
- Design custom workflows
- Build agent teams
- Package agents for distribution
- Create custom methodologies

---

## Installation Steps

### 1. Navigate to BMad Directory
```bash
cd /Users/hbl/Documents/BMAD-METHOD
```

### 2. Run the Installer
```bash
npm run install:bmad
```

### 3. Answer the Prompts

#### Destination
```
? Where would you like to install BMAD?
> /Users/hbl/Documents/BMAD-METHOD/bmad
```
**Important:** Use the SAME path as before

#### Module Selection
```
? Select modules to install:
> (*) BMad Method (bmm) [already installed]
  ( ) Creative Intelligence Suite (cis)
  ( ) BMad Builder (bmb)
```

**Select:**
- ✓ BMad Method (bmm) - keep checked
- ✓ Creative Intelligence Suite (cis) - **SELECT THIS**
- ✓ BMad Builder (bmb) - **SELECT THIS**

Use `Space` to select, `Enter` to confirm

#### Your Name
```
? What is your name? (for authoring documents)
> hbl
```

#### Language
```
? What language should agents use?
> en-AU
```

#### IDE Selection
```
? Select your IDE(s):
> (*) Claude Code
  (*) Codex
  (*) Gemini
```

Keep all selected (already configured)

#### Claude Code Subagents (if prompted)
```
? Would you like to install Claude Code subagents?
> All subagents
```

Select "All subagents" for full functionality

---

## After Installation

### 1. Verify Installation
```bash
bash /Users/hbl/Documents/BMAD-METHOD/bmad-doctor.sh
```

Should show:
```
✓ CIS module installed
✓ BMB module installed
```

### 2. Update Slash Commands
The installer should copy new commands automatically. If not:

```bash
cp -r /Users/hbl/Documents/BMAD-METHOD/.claude/commands/bmad ~/.claude/commands/
```

### 3. Reload Shell
```bash
source ~/.zshrc
```

---

## New Commands Available

### CIS Module Commands

```
/bmad:cis:agents:carson          - Brainstorming specialist
/bmad:cis:agents:maya            - Design thinking expert
/bmad:cis:agents:quinn           - Problem solver
/bmad:cis:agents:victor          - Innovation strategist
/bmad:cis:agents:sophia          - Storytelling master

/bmad:cis:workflows:brainstorming      - Creative ideation
/bmad:cis:workflows:design-thinking    - Human-centered design
/bmad:cis:workflows:problem-solving    - Root cause analysis
/bmad:cis:workflows:innovation         - Business innovation
/bmad:cis:workflows:storytelling       - Narrative frameworks
```

### BMB Module Commands

```
/bmad:bmb:workflows:create-agent       - Build custom agent
/bmad:bmb:workflows:create-workflow    - Design workflow
/bmad:bmb:workflows:create-team        - Configure team
/bmad:bmb:workflows:bundle-agent       - Package for sharing
/bmad:bmb:workflows:create-method      - Custom methodology
```

---

## Troubleshooting

### Issue: Installer says "already installed"

This is normal! The installer detects existing installation and only adds new modules.

**Solution:** Continue with installation, it will merge modules

### Issue: Slash commands not showing

**Solution:**
```bash
# 1. Copy commands manually
cp -r /Users/hbl/Documents/BMAD-METHOD/.claude/commands/bmad ~/.claude/commands/

# 2. Restart Claude Code
# Close and reopen Claude Code application
```

### Issue: Can't find new agents

**Solution:**
```bash
# Check installation
cat /Users/hbl/Documents/BMAD-METHOD/bmad/_cfg/manifest.yaml

# Should show:
# modules:
#   - core
#   - bmm
#   - cis
#   - bmb
```

---

## Quick Test

After installation, test the new modules:

### Test CIS Module
```bash
cd /Users/hbl/Documents/pages-health
claude-code .
```

In Claude Code:
```
/bmad:cis:workflows:brainstorming
```

### Test BMB Module
```
/bmad:bmb:workflows:create-agent
```

---

## Expected Result

After successful installation:

```bash
bmad-doctor
```

Output:
```
✓ Central BMad installation
✓ 6 modules installed  # Should be 6+ now (core, bmm, cis, bmb, docs, etc)
✓ 60+ slash commands   # More commands from CIS + BMB
✓ Global aliases configured
✓ Environment variables
✓ 1 project workspace(s)

✅ BMad is healthy!
```

---

## Ready to Install?

Run these commands:

```bash
# 1. Go to BMad directory
cd /Users/hbl/Documents/BMAD-METHOD

# 2. Run installer
npm run install:bmad

# 3. Verify installation
bash bmad-doctor.sh

# 4. View new commands
bmad-help
```

---

**Note:** Installation takes ~2-5 minutes depending on module size.
