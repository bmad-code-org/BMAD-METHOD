#!/bin/bash
#
# File: .claude/hooks/bmad-tts-injector.sh
#
# AgentVibes - Finally, your AI Agents can Talk Back! Text-to-Speech WITH personality for AI Assistants!
# Website: https://agentvibes.org
# Repository: https://github.com/paulpreibisch/AgentVibes
#
# Co-created by Paul Preibisch with Claude AI
# Copyright (c) 2025 Paul Preibisch
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# DISCLAIMER: This software is provided "AS IS", WITHOUT WARRANTY OF ANY KIND,
# express or implied. Use at your own risk. See the Apache License for details.
#
# ---
#
# @fileoverview BMAD TTS Injection Manager - Patches BMAD agents for TTS integration
# @context Automatically modifies BMAD agent YAML files to include AgentVibes TTS capabilities
# @architecture Injects TTS hooks into activation-instructions and core_principles sections
# @dependencies bmad-core/agents/*.md files, play-tts.sh, bmad-voice-manager.sh
# @entrypoints Called via bmad-tts-injector.sh {enable|disable|status|restore}
# @patterns File patching with backup, provider-aware voice mapping, injection markers for idempotency
# @related play-tts.sh, bmad-voice-manager.sh, .bmad-core/agents/*.md
#

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Detect BMAD installation
detect_bmad() {
  local bmad_core_dir=""

  # Check current directory first
  if [[ -d ".bmad-core" ]]; then
    bmad_core_dir=".bmad-core"
  # Check parent directory
  elif [[ -d "../.bmad-core" ]]; then
    bmad_core_dir="../.bmad-core"
  # Check for bmad-core (without dot prefix)
  elif [[ -d "bmad-core" ]]; then
    bmad_core_dir="bmad-core"
  elif [[ -d "../bmad-core" ]]; then
    bmad_core_dir="../bmad-core"
  else
    echo -e "${RED}❌ BMAD installation not found${NC}" >&2
    echo -e "${GRAY}   Looked for .bmad-core or bmad-core directory${NC}" >&2
    return 1
  fi

  echo "$bmad_core_dir"
}

# Find all BMAD agents
find_agents() {
  local bmad_core="$1"
  local agents_dir="$bmad_core/agents"

  if [[ ! -d "$agents_dir" ]]; then
    echo -e "${RED}❌ Agents directory not found: $agents_dir${NC}"
    return 1
  fi

  find "$agents_dir" -name "*.md" -type f
}

# Check if agent has TTS injection
has_tts_injection() {
  local agent_file="$1"

  if grep -q "# AGENTVIBES-TTS-INJECTION" "$agent_file" 2>/dev/null; then
    return 0
  fi
  return 1
}

# Extract agent ID from file
get_agent_id() {
  local agent_file="$1"

  # Look for "id: <agent-id>" in YAML block
  local agent_id=$(grep -E "^  id:" "$agent_file" | head -1 | awk '{print $2}' | tr -d '"' | tr -d "'")

  if [[ -z "$agent_id" ]]; then
    # Fallback: use filename without extension
    agent_id=$(basename "$agent_file" .md)
  fi

  echo "$agent_id"
}

# Get voice for agent from BMAD voice mapping
get_agent_voice() {
  local agent_id="$1"

  # Use bmad-voice-manager.sh to get voice
  if [[ -f "$SCRIPT_DIR/bmad-voice-manager.sh" ]]; then
    local voice=$("$SCRIPT_DIR/bmad-voice-manager.sh" get-voice "$agent_id" 2>/dev/null || echo "")
    echo "$voice"
  fi
}

# Map ElevenLabs voice to Piper equivalent
map_voice_to_provider() {
  local elevenlabs_voice="$1"
  local provider="$2"

  # If provider is elevenlabs or empty, return as-is
  if [[ "$provider" != "piper" ]]; then
    echo "$elevenlabs_voice"
    return
  fi

  # Map ElevenLabs voices to Piper equivalents
  case "$elevenlabs_voice" in
    "Jessica Anne Bogart"|"Aria")
      echo "en_US-lessac-medium"
      ;;
    "Matthew Schmitz"|"Archer"|"Michael")
      echo "en_US-danny-low"
      ;;
    "Burt Reynolds"|"Cowboy Bob")
      echo "en_US-joe-medium"
      ;;
    "Tiffany"|"Ms. Walker")
      echo "en_US-amy-medium"
      ;;
    "Ralf Eisend"|"Tom")
      echo "en_US-libritts-high"
      ;;
    *)
      # Default to amy for unknown voices
      echo "en_US-amy-medium"
      ;;
  esac
}

# Get current TTS provider
get_current_provider() {
  # Check project-local first, then global
  if [[ -f ".claude/tts-provider.txt" ]]; then
    cat ".claude/tts-provider.txt" 2>/dev/null || echo "elevenlabs"
  elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
    cat "$HOME/.claude/tts-provider.txt" 2>/dev/null || echo "elevenlabs"
  else
    echo "elevenlabs"
  fi
}

# Inject TTS hook into agent activation instructions
inject_tts() {
  local agent_file="$1"
  local agent_id=$(get_agent_id "$agent_file")
  local elevenlabs_voice=$(get_agent_voice "$agent_id")
  local current_provider=$(get_current_provider)
  local agent_voice=$(map_voice_to_provider "$elevenlabs_voice" "$current_provider")

  # Check if already injected
  if has_tts_injection "$agent_file"; then
    echo -e "${YELLOW}⚠️  TTS already injected in: $(basename "$agent_file")${NC}"
    return 0
  fi

  # Create backup
  cp "$agent_file" "$agent_file.backup-pre-tts"

  # Find the activation-instructions section
  if ! grep -q "activation-instructions:" "$agent_file"; then
    echo -e "${RED}❌ No activation-instructions found in: $(basename "$agent_file")${NC}"
    return 1
  fi

  # Create TTS injection script for activation
  local activation_injection=""
  local persona_injection=""

  if [[ -n "$agent_voice" ]]; then
    activation_injection="  - # AGENTVIBES-TTS-INJECTION: STEP 3.5 - Announce activation with TTS and set context
  - STEP 3.5a: Use Bash tool to create context file: echo \"${agent_id}\" > .bmad-agent-context
  - STEP 3.5b: Use Bash tool to speak: .claude/hooks/play-tts.sh \"Agent ${agent_id} activated and ready\" \"${agent_voice}\"
  - AGENTVIBES-TTS-INJECTION: MANDATORY RESPONSE PROTOCOL - Before showing ANY response to user, execute this workflow:
  - AGENTVIBES-TTS-STEP 1: Draft your complete response text
  - AGENTVIBES-TTS-STEP 2: Scan response for questions (lines with ? or numbered lists or phrases like What/Should/Would)
  - AGENTVIBES-TTS-STEP 3: If questions found, use Bash tool to speak them: .claude/hooks/play-tts.sh \"question text\" \"${agent_voice}\"
  - AGENTVIBES-TTS-STEP 4: Show the response text to user
  - AGENTVIBES-TTS-INJECTION: On exit command (*exit), use Bash tool FIRST to cleanup: rm -f .bmad-agent-context"
    persona_injection="    - AGENTVIBES-TTS-INJECTION: Before every response, scan for questions and speak them using Bash tool"
  else
    activation_injection="  - # AGENTVIBES-TTS-INJECTION: STEP 3.5 - Announce activation with TTS and set context
  - STEP 3.5a: Use Bash tool to create context file: echo \"${agent_id}\" > .bmad-agent-context
  - STEP 3.5b: Use Bash tool to speak: .claude/hooks/play-tts.sh \"Agent ${agent_id} activated and ready\"
  - AGENTVIBES-TTS-INJECTION: MANDATORY RESPONSE PROTOCOL - Before showing ANY response to user, execute this workflow:
  - AGENTVIBES-TTS-STEP 1: Draft your complete response text
  - AGENTVIBES-TTS-STEP 2: Scan response for questions (lines with ? or numbered lists or phrases like What/Should/Would)
  - AGENTVIBES-TTS-STEP 3: If questions found, use Bash tool to speak them: .claude/hooks/play-tts.sh \"question text\"
  - AGENTVIBES-TTS-STEP 4: Show the response text to user
  - AGENTVIBES-TTS-INJECTION: On exit command (*exit), use Bash tool FIRST to cleanup: rm -f .bmad-agent-context"
    persona_injection="    - AGENTVIBES-TTS-INJECTION: Before every response, scan for questions and speak them using Bash tool"
  fi

  # Insert activation TTS call after "STEP 4: Greet user" line
  # Insert persona TTS instruction in core_principles section
  awk -v activation="$activation_injection" -v persona="$persona_injection" '
    /STEP 4:.*[Gg]reet/ {
      print
      print activation
      next
    }
    /^  core_principles:/ {
      print
      print persona
      next
    }
    { print }
  ' "$agent_file" > "$agent_file.tmp"

  mv "$agent_file.tmp" "$agent_file"

  if [[ "$current_provider" == "piper" ]] && [[ -n "$elevenlabs_voice" ]]; then
    echo -e "${GREEN}✅ Injected TTS into: $(basename "$agent_file") → Voice: ${agent_voice:-default} (${current_provider}: ${elevenlabs_voice} → ${agent_voice})${NC}"
  else
    echo -e "${GREEN}✅ Injected TTS into: $(basename "$agent_file") → Voice: ${agent_voice:-default}${NC}"
  fi
}

# Remove TTS injection from agent
remove_tts() {
  local agent_file="$1"

  # Check if has injection
  if ! has_tts_injection "$agent_file"; then
    echo -e "${GRAY}   No TTS in: $(basename "$agent_file")${NC}"
    return 0
  fi

  # Create backup
  cp "$agent_file" "$agent_file.backup-tts-removal"

  # Remove TTS injection lines
  sed -i.bak '/# AGENTVIBES-TTS-INJECTION/,+1d' "$agent_file"
  rm -f "$agent_file.bak"

  echo -e "${GREEN}✅ Removed TTS from: $(basename "$agent_file")${NC}"
}

# Show status of TTS injections
show_status() {
  local bmad_core=$(detect_bmad)
  if [[ -z "$bmad_core" ]]; then
    return 1
  fi

  echo -e "${CYAN}📊 BMAD TTS Injection Status:${NC}"
  echo ""

  local agents=$(find_agents "$bmad_core")
  local enabled_count=0
  local disabled_count=0

  while IFS= read -r agent_file; do
    local agent_id=$(get_agent_id "$agent_file")
    local agent_name=$(basename "$agent_file" .md)

    if has_tts_injection "$agent_file"; then
      local voice=$(get_agent_voice "$agent_id")
      echo -e "   ${GREEN}✅${NC} $agent_name (${agent_id}) → Voice: ${voice:-default}"
      ((enabled_count++))
    else
      echo -e "   ${GRAY}❌ $agent_name (${agent_id})${NC}"
      ((disabled_count++))
    fi
  done <<< "$agents"

  echo ""
  echo -e "${CYAN}Summary:${NC} $enabled_count enabled, $disabled_count disabled"
}

# Enable TTS for all agents
enable_all() {
  local bmad_core=$(detect_bmad)
  if [[ -z "$bmad_core" ]]; then
    return 1
  fi

  echo -e "${CYAN}🎤 Enabling TTS for all BMAD agents...${NC}"
  echo ""

  local agents=$(find_agents "$bmad_core")
  local success_count=0
  local skip_count=0

  while IFS= read -r agent_file; do
    if has_tts_injection "$agent_file"; then
      ((skip_count++))
      continue
    fi

    if inject_tts "$agent_file"; then
      ((success_count++))
    fi
  done <<< "$agents"

  echo ""
  echo -e "${GREEN}🎉 TTS enabled for $success_count agents${NC}"
  [[ $skip_count -gt 0 ]] && echo -e "${YELLOW}   Skipped $skip_count agents (already enabled)${NC}"
  echo ""
  echo -e "${CYAN}💡 BMAD agents will now speak when activated!${NC}"
}

# Disable TTS for all agents
disable_all() {
  local bmad_core=$(detect_bmad)
  if [[ -z "$bmad_core" ]]; then
    return 1
  fi

  echo -e "${CYAN}🔇 Disabling TTS for all BMAD agents...${NC}"
  echo ""

  local agents=$(find_agents "$bmad_core")
  local success_count=0

  while IFS= read -r agent_file; do
    if remove_tts "$agent_file"; then
      ((success_count++))
    fi
  done <<< "$agents"

  echo ""
  echo -e "${GREEN}✅ TTS disabled for $success_count agents${NC}"
}

# Restore from backup
restore_backup() {
  local bmad_core=$(detect_bmad)
  if [[ -z "$bmad_core" ]]; then
    return 1
  fi

  echo -e "${CYAN}🔄 Restoring agents from backup...${NC}"
  echo ""

  local agents_dir="$bmad_core/agents"
  local backup_count=0

  for backup_file in "$agents_dir"/*.backup-pre-tts; do
    if [[ -f "$backup_file" ]]; then
      local original_file="${backup_file%.backup-pre-tts}"
      cp "$backup_file" "$original_file"
      echo -e "${GREEN}✅ Restored: $(basename "$original_file")${NC}"
      ((backup_count++))
    fi
  done

  if [[ $backup_count -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  No backups found${NC}"
  else
    echo ""
    echo -e "${GREEN}✅ Restored $backup_count agents from backup${NC}"
  fi
}

# Main command dispatcher
case "${1:-help}" in
  enable)
    enable_all
    ;;
  disable)
    disable_all
    ;;
  status)
    show_status
    ;;
  restore)
    restore_backup
    ;;
  help|*)
    echo -e "${CYAN}AgentVibes BMAD TTS Injection Manager${NC}"
    echo ""
    echo "Usage: bmad-tts-injector.sh {enable|disable|status|restore}"
    echo ""
    echo "Commands:"
    echo "  enable     Inject TTS hooks into all BMAD agents"
    echo "  disable    Remove TTS hooks from all BMAD agents"
    echo "  status     Show TTS injection status for all agents"
    echo "  restore    Restore agents from backup (undo changes)"
    echo ""
    echo "What it does:"
    echo "  • Automatically patches BMAD agent activation instructions"
    echo "  • Adds TTS calls when agents greet users"
    echo "  • Uses voice mapping from AgentVibes BMAD plugin"
    echo "  • Creates backups before modifying files"
    ;;
esac
