# Testing AgentVibes Party Mode (PR #934)

This guide helps you test the AgentVibes integration that adds multi-agent party mode with unique voices for each BMAD agent.

## Quick Start

We've created an automated test script that handles everything for you:

```bash
curl -fsSL https://raw.githubusercontent.com/paulpreibisch/BMAD-METHOD/feature/agentvibes-tts-integration/test-bmad-pr.sh -o test-bmad-pr.sh
chmod +x test-bmad-pr.sh
./test-bmad-pr.sh
```

## What the Script Does

The automated script will:

1. Clone the BMAD repository
2. Checkout the PR branch with party mode features
3. Install BMAD CLI tools locally
4. Create a test BMAD project
5. Install AgentVibes TTS system
6. Configure unique voices for each agent
7. Verify the installation

## Prerequisites

- Node.js and npm installed
- Git installed
- ~500MB free disk space
- 10-15 minutes for complete setup

## Manual Testing (Alternative)

If you prefer manual installation:

### 1. Clone and Setup BMAD

```bash
git clone https://github.com/paulpreibisch/BMAD-METHOD.git
cd BMAD-METHOD
git fetch origin pull/934/head:agentvibes-party-mode
git checkout agentvibes-party-mode
cd tools/cli
npm install
npm link
```

### 2. Create Test Project

```bash
mkdir -p ~/bmad-test-project
cd ~/bmad-test-project
bmad install
```

When prompted:

- Enable TTS for agents? → **Yes**
- The installer will automatically prompt you to install AgentVibes

### 3. Test Party Mode

```bash
cd ~/bmad-test-project
claude-code
```

In Claude Code, run:

```
/bmad:core:workflows:party-mode
```

Each BMAD agent should speak with a unique voice!

## Verification

After installation, verify:

✅ Voice map file exists: `.bmad/_cfg/agent-voice-map.csv`
✅ BMAD TTS hooks exist: `.claude/hooks/bmad-speak.sh`
✅ Each agent has a unique voice assigned
✅ Party mode works with distinct voices

## Troubleshooting

**No audio?**

- Check: `.claude/hooks/play-tts.sh` exists
- Test current voice: `/agent-vibes:whoami`

**Same voice for all agents?**

- Check: `.bmad/_cfg/agent-voice-map.csv` has different voices
- List available voices: `/agent-vibes:list`

## Report Issues

Found a bug? Report it on the PR:
https://github.com/bmad-code-org/BMAD-METHOD/pull/934

## Cleanup

To remove the test installation:

```bash
# Remove test directory
rm -rf ~/bmad-test-project  # or your custom test directory

# Unlink BMAD CLI (optional)
cd ~/BMAD-METHOD/tools/cli
npm unlink
```
