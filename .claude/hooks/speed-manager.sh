#!/bin/bash
#
# File: .claude/hooks/speed-manager.sh
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
# express or implied, including but not limited to the warranties of
# merchantability, fitness for a particular purpose and noninfringement.
# In no event shall the authors or copyright holders be liable for any claim,
# damages or other liability, whether in an action of contract, tort or
# otherwise, arising from, out of or in connection with the software or the
# use or other dealings in the software.
#
# ---
#
# @fileoverview Speech Speed Manager for Multi-Provider TTS
# @context Manage speech rate for main and target language voices
# @architecture Simple config file manager supporting both Piper (length-scale) and ElevenLabs (speed API parameter)
# @dependencies .claude/config/tts-speech-rate.txt, .claude/config/tts-target-speech-rate.txt
# @entrypoints Called by /agent-vibes:set-speed slash command
# @patterns Provider-agnostic speed config, legacy file migration, random tongue twisters for testing
# @related play-tts.sh, play-tts-piper.sh, play-tts-elevenlabs.sh, learn-manager.sh
#

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Determine config directory (project-local first, then global)
if [[ -n "$CLAUDE_PROJECT_DIR" ]] && [[ -d "$CLAUDE_PROJECT_DIR/.claude" ]]; then
  CONFIG_DIR="$CLAUDE_PROJECT_DIR/.claude/config"
else
  # Try to find .claude in current path
  CURRENT_DIR="$PWD"
  while [[ "$CURRENT_DIR" != "/" ]]; do
    if [[ -d "$CURRENT_DIR/.claude" ]]; then
      CONFIG_DIR="$CURRENT_DIR/.claude/config"
      break
    fi
    CURRENT_DIR=$(dirname "$CURRENT_DIR")
  done
  # Fallback to global
  if [[ -z "$CONFIG_DIR" ]]; then
    CONFIG_DIR="$HOME/.claude/config"
  fi
fi

mkdir -p "$CONFIG_DIR"

MAIN_SPEED_FILE="$CONFIG_DIR/tts-speech-rate.txt"
TARGET_SPEED_FILE="$CONFIG_DIR/tts-target-speech-rate.txt"

# Legacy file paths for backward compatibility (Piper-specific naming)
LEGACY_MAIN_SPEED_FILE="$CONFIG_DIR/piper-speech-rate.txt"
LEGACY_TARGET_SPEED_FILE="$CONFIG_DIR/piper-target-speech-rate.txt"

# @function parse_speed_value
# @intent Convert user-friendly speed notation to normalized speed multiplier
# @param $1 Speed string (e.g., "2x", "0.5x", "normal")
# @returns Numeric speed value (0.5=slower, 1.0=normal, 2.0=faster, 3.0=very fast)
# @note This is the user-facing scale - provider scripts will convert as needed
parse_speed_value() {
  local input="$1"

  # Handle special cases
  case "$input" in
    normal|1x|1.0)
      echo "1.0"
      return
      ;;
    slow|slower|0.5x)
      echo "0.5"
      return
      ;;
    fast|2x|2.0)
      echo "2.0"
      return
      ;;
    faster|3x|3.0)
      echo "3.0"
      return
      ;;
  esac

  # Strip leading '+' or '-' if present
  input="${input#+}"
  input="${input#-}"

  # Strip trailing 'x' if present
  input="${input%x}"

  # Validate it's a number
  if [[ "$input" =~ ^[0-9]+\.?[0-9]*$ ]]; then
    echo "$input"
  else
    echo "ERROR"
  fi
}

# @function set_speed
# @intent Set speech speed for main or target voice
# @param $1 Target ("target" or empty for main)
# @param $2 Speed value
set_speed() {
  local is_target=false
  local speed_input=""

  # Parse arguments
  if [[ "$1" == "target" ]]; then
    is_target=true
    speed_input="$2"
  else
    speed_input="$1"
  fi

  if [[ -z "$speed_input" ]]; then
    echo "❌ Error: Speed value required"
    echo "Usage: /agent-vibes:set-speed [target] <speed>"
    echo "Examples: 2x, 0.5x, normal, +3x"
    return 1
  fi

  # Parse speed value
  local speed_value
  speed_value=$(parse_speed_value "$speed_input")

  if [[ "$speed_value" == "ERROR" ]]; then
    echo "❌ Invalid speed value: $speed_input"
    echo "Valid values: normal, 0.5x, 1x, 2x, 3x, +2x, -2x"
    return 1
  fi

  # Determine which file to write to
  local config_file
  local voice_type
  if [[ "$is_target" == true ]]; then
    config_file="$TARGET_SPEED_FILE"
    voice_type="target language"
  else
    config_file="$MAIN_SPEED_FILE"
    voice_type="main voice"
  fi

  # Write speed value
  echo "$speed_value" > "$config_file"

  # Show confirmation
  echo "✓ Speech speed set for $voice_type"
  echo ""
  echo "Speed: ${speed_value}x"

  case "$speed_value" in
    0.5)
      echo "Effect: Half speed (slower)"
      ;;
    1.0)
      echo "Effect: Normal speed"
      ;;
    2.0)
      echo "Effect: Double speed (faster)"
      ;;
    3.0)
      echo "Effect: Triple speed (very fast)"
      ;;
    *)
      if (( $(echo "$speed_value > 1.0" | bc -l) )); then
        echo "Effect: Faster speech"
      else
        echo "Effect: Slower speech"
      fi
      ;;
  esac

  echo ""
  echo "Note: Speed control works with both Piper and ElevenLabs providers"

  # Array of simple test messages to demonstrate speed
  local test_messages=(
    "Testing speed change"
    "Speed test in progress"
    "Checking audio speed"
    "Speed configuration test"
    "Audio speed test"
  )

  # Pick a random test message
  local random_index=$((RANDOM % ${#test_messages[@]}))
  local test_msg="${test_messages[$random_index]}"

  echo ""
  echo "🔊 Testing new speed with: \"$test_msg\""
  "$SCRIPT_DIR/play-tts.sh" "$test_msg" &
}

# @function migrate_legacy_files
# @intent Migrate from old piper-specific files to provider-agnostic files
# @why Ensure backward compatibility when upgrading from Piper-only to multi-provider
migrate_legacy_files() {
  # Migrate main speed file
  if [[ -f "$LEGACY_MAIN_SPEED_FILE" ]] && [[ ! -f "$MAIN_SPEED_FILE" ]]; then
    cp "$LEGACY_MAIN_SPEED_FILE" "$MAIN_SPEED_FILE"
  fi

  # Migrate target speed file
  if [[ -f "$LEGACY_TARGET_SPEED_FILE" ]] && [[ ! -f "$TARGET_SPEED_FILE" ]]; then
    cp "$LEGACY_TARGET_SPEED_FILE" "$TARGET_SPEED_FILE"
  fi
}

# @function get_speed
# @intent Display current speech speed settings
get_speed() {
  # Migrate legacy files if needed
  migrate_legacy_files

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "   Current Speech Speed Settings"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Main voice speed
  if [[ -f "$MAIN_SPEED_FILE" ]]; then
    local main_speed=$(grep -v '^#' "$MAIN_SPEED_FILE" 2>/dev/null | grep -v '^$' | tail -1)
    echo "Main voice: ${main_speed}x"
  else
    echo "Main voice: 1.0x (default, normal speed)"
  fi

  # Target voice speed
  if [[ -f "$TARGET_SPEED_FILE" ]]; then
    local target_speed=$(cat "$TARGET_SPEED_FILE" 2>/dev/null)
    echo "Target language: ${target_speed}x"
  else
    echo "Target language: 0.5x (default, slower for learning)"
  fi

  echo ""
  echo "Scale: 0.5x=slower, 1.0x=normal, 2.0x=faster, 3.0x=very fast"
  echo "Works with: Piper TTS and ElevenLabs"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main command handler
case "${1:-}" in
  target)
    set_speed "target" "$2"
    ;;
  get|status)
    get_speed
    ;;
  normal|fast|slow|slower|*x|*.*|+*|-*)
    set_speed "$1"
    ;;
  *)
    echo "Speech Speed Manager"
    echo ""
    echo "Usage:"
    echo "  /agent-vibes:set-speed <speed>         Set main voice speed"
    echo "  /agent-vibes:set-speed target <speed>  Set target language speed"
    echo "  /agent-vibes:set-speed get              Show current speeds"
    echo ""
    echo "Speed values:"
    echo "  0.5x or slow/slower = Half speed (slower)"
    echo "  1x or normal        = Normal speed"
    echo "  2x or fast          = Double speed (faster)"
    echo "  3x or faster        = Triple speed (very fast)"
    echo ""
    echo "Examples:"
    echo "  /agent-vibes:set-speed 2x        # Make voice faster"
    echo "  /agent-vibes:set-speed 0.5x      # Make voice slower"
    echo "  /agent-vibes:set-speed target 0.5x  # Slow down target language for learning"
    echo "  /agent-vibes:set-speed normal    # Reset to normal"
    ;;
esac
