---
name: bmad-install-agentvibes
description: 'Install AgentVibes TTS voice system for BMAD agents. Gives each agent a unique voice, personality, and audio effects. Use when user wants to add voice/TTS to their BMAD setup, or when bmad-party-mode is active and agents are silent.'
---

# Install AgentVibes

AgentVibes is an open-source Text-to-Speech system that gives BMAD agents unique voices, personalities, and audio effects. Once installed, party mode agents speak aloud — each with their own voice.

## What AgentVibes Provides

- **Per-agent voices** — each BMAD agent gets a distinct voice via `bmad-voice-map.json`
- **Cross-platform** — Windows (SAPI + Piper), macOS, Linux, WSL
- **Personalities & effects** — reverb, background music, speed, sentiment
- **Party mode integration** — agents introduce themselves and speak sequentially

## Installation

Run the installer in the terminal:

```bash
npx agentvibes install
```

Or if you prefer a global install first:

```bash
npm install -g agentvibes
agentvibes install
```

**The installer will:**
1. Detect your platform (Windows/Mac/Linux/WSL)
2. Install the appropriate TTS provider (Piper recommended for best quality, SAPI as zero-dependency fallback on Windows)
3. Configure Claude Code hooks so agents speak automatically
4. Set up `bmad-speak.sh` / `bmad-speak.ps1` integration for party mode

## Post-Install: Configure Agent Voices

After installing, configure per-agent voices for party mode:

```
/agent-vibes:bmad
```

This opens the BMAD voice configuration where you can assign each agent a distinct voice, personality, and effects profile.

## Verify Installation

```bash
agentvibes whoami
```

Should display the active voice and provider. If party mode is active, agents will now speak when you run `/bmad-party-mode`.

## Troubleshooting

- **Agents still silent after install**: Run `agentvibes install` again — it is idempotent
- **Windows users**: Ensure PowerShell execution policy allows scripts: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
- **Voice quality**: Install Piper for neural TTS — `agentvibes install` will prompt you

## More Info

- GitHub: https://github.com/paulpreibisch/AgentVibes
- Docs: `agentvibes --help`
