#!/bin/bash
#
# File: .claude/hooks/provider-manager.sh
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
# @fileoverview TTS Provider Management Functions
# @context Core provider abstraction layer for multi-provider TTS system
# @architecture Provides functions to get/set/list/validate TTS providers
# @dependencies None - pure bash implementation
# @entrypoints Sourced by play-tts.sh and provider management commands
# @patterns File-based state management with project-local and global fallback
# @related play-tts.sh, play-tts-elevenlabs.sh, play-tts-piper.sh, provider-commands.sh
#

# @function get_provider_config_path
# @intent Determine path to tts-provider.txt file
# @why Supports both project-local (.claude/) and global (~/.claude/) storage
# @returns Echoes path to provider config file
# @exitcode 0=always succeeds
# @sideeffects None
# @edgecases Creates parent directory if missing
get_provider_config_path() {
  local provider_file

  # Check project-local first
  if [[ -n "$CLAUDE_PROJECT_DIR" ]] && [[ -d "$CLAUDE_PROJECT_DIR/.claude" ]]; then
    provider_file="$CLAUDE_PROJECT_DIR/.claude/tts-provider.txt"
  else
    # Search up directory tree for .claude/
    local current_dir="$PWD"
    while [[ "$current_dir" != "/" ]]; do
      if [[ -d "$current_dir/.claude" ]]; then
        provider_file="$current_dir/.claude/tts-provider.txt"
        break
      fi
      current_dir=$(dirname "$current_dir")
    done

    # Fallback to global if no project .claude found
    if [[ -z "$provider_file" ]]; then
      provider_file="$HOME/.claude/tts-provider.txt"
    fi
  fi

  echo "$provider_file"
}

# @function get_active_provider
# @intent Read currently active TTS provider from config file
# @why Central function for determining which provider to use
# @returns Echoes provider name (e.g., "elevenlabs", "piper")
# @exitcode 0=success
# @sideeffects None
# @edgecases Returns "elevenlabs" if file missing or empty (default)
get_active_provider() {
  local provider_file
  provider_file=$(get_provider_config_path)

  # Read provider from file, default to piper if not found
  if [[ -f "$provider_file" ]]; then
    local provider
    provider=$(cat "$provider_file" | tr -d '[:space:]')
    if [[ -n "$provider" ]]; then
      echo "$provider"
      return 0
    fi
  fi

  # Default to piper (free, offline)
  echo "piper"
}

# @function set_active_provider
# @intent Write active provider to config file
# @why Allows runtime provider switching without restart
# @param $1 {string} provider - Provider name (e.g., "elevenlabs", "piper")
# @returns None (outputs success/error message)
# @exitcode 0=success, 1=invalid provider
# @sideeffects Writes to tts-provider.txt file
# @edgecases Creates file and parent directory if missing
set_active_provider() {
  local provider="$1"

  if [[ -z "$provider" ]]; then
    echo "❌ Error: Provider name required"
    echo "Usage: set_active_provider <provider_name>"
    return 1
  fi

  # Validate provider exists
  if ! validate_provider "$provider"; then
    echo "❌ Error: Provider '$provider' not found"
    echo "Available providers:"
    list_providers
    return 1
  fi

  local provider_file
  provider_file=$(get_provider_config_path)

  # Create directory if it doesn't exist
  mkdir -p "$(dirname "$provider_file")"

  # Write provider to file
  echo "$provider" > "$provider_file"

  # Reset voice when switching providers to avoid incompatible voices
  # (e.g., ElevenLabs "Demon Monster" doesn't exist in Piper)
  local voice_file
  if [[ -n "$CLAUDE_PROJECT_DIR" ]] && [[ -d "$CLAUDE_PROJECT_DIR/.claude" ]]; then
    voice_file="$CLAUDE_PROJECT_DIR/.claude/tts-voice.txt"
  else
    voice_file="$HOME/.claude/tts-voice.txt"
  fi

  # Set default voice for the new provider
  local default_voice
  case "$provider" in
    piper)
      # Default Piper voice
      default_voice="en_US-lessac-medium"
      ;;
    elevenlabs)
      # Default ElevenLabs voice (first in alphabetical order from voices-config.sh)
      default_voice="Amy"
      ;;
    *)
      # Unknown provider - remove voice file
      if [[ -f "$voice_file" ]]; then
        rm -f "$voice_file"
      fi
      echo "✓ Active provider set to: $provider (voice reset)"
      return 0
      ;;
  esac

  # Write default voice to file
  echo "$default_voice" > "$voice_file"

  echo "✓ Active provider set to: $provider (voice set to: $default_voice)"
}

# @function list_providers
# @intent List all available TTS providers
# @why Discover which providers are installed
# @returns Echoes provider names (one per line)
# @exitcode 0=success
# @sideeffects None
# @edgecases Returns empty if no play-tts-*.sh files found
list_providers() {
  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  # Find all play-tts-*.sh files
  local providers=()
  shopt -s nullglob  # Handle case where no files match
  for file in "$script_dir"/play-tts-*.sh; do
    if [[ -f "$file" ]] && [[ "$file" != *"play-tts.sh" ]]; then
      # Extract provider name from filename (play-tts-elevenlabs.sh -> elevenlabs)
      local basename
      basename=$(basename "$file")
      local provider
      provider="${basename#play-tts-}"
      provider="${provider%.sh}"
      providers+=("$provider")
    fi
  done
  shopt -u nullglob

  # Output providers
  if [[ ${#providers[@]} -eq 0 ]]; then
    echo "⚠️ No providers found"
    return 0
  fi

  for provider in "${providers[@]}"; do
    echo "$provider"
  done
}

# @function validate_provider
# @intent Check if provider implementation exists
# @why Prevent errors from switching to non-existent provider
# @param $1 {string} provider - Provider name to validate
# @returns None
# @exitcode 0=provider exists, 1=provider not found
# @sideeffects None
# @edgecases Checks for corresponding play-tts-*.sh file
validate_provider() {
  local provider="$1"

  if [[ -z "$provider" ]]; then
    return 1
  fi

  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local provider_script="$script_dir/play-tts-${provider}.sh"

  [[ -f "$provider_script" ]]
}

# @function get_provider_script_path
# @intent Get absolute path to provider implementation script
# @why Used by router to execute provider-specific logic
# @param $1 {string} provider - Provider name
# @returns Echoes absolute path to play-tts-*.sh file
# @exitcode 0=success, 1=provider not found
# @sideeffects None
get_provider_script_path() {
  local provider="$1"

  if [[ -z "$provider" ]]; then
    echo "❌ Error: Provider name required" >&2
    return 1
  fi

  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  local provider_script="$script_dir/play-tts-${provider}.sh"

  if [[ ! -f "$provider_script" ]]; then
    echo "❌ Error: Provider '$provider' not found at $provider_script" >&2
    return 1
  fi

  echo "$provider_script"
}

# AI NOTE: This file provides the core abstraction layer for multi-provider TTS.
# All provider state is managed through simple text files for simplicity and reliability.
# Project-local configuration takes precedence over global to support per-project providers.

# Command-line interface (when script is executed, not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  case "${1:-}" in
    get)
      get_active_provider
      ;;
    switch|set)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: Provider name required"
        echo "Usage: $0 switch <provider>"
        exit 1
      fi
      set_active_provider "$2"
      ;;
    list)
      list_providers
      ;;
    validate)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: Provider name required"
        echo "Usage: $0 validate <provider>"
        exit 1
      fi
      validate_provider "$2"
      ;;
    *)
      echo "Usage: $0 {get|switch|list|validate} [provider]"
      echo ""
      echo "Commands:"
      echo "  get              - Show active provider"
      echo "  switch <name>    - Switch to provider"
      echo "  list             - List available providers"
      echo "  validate <name>  - Check if provider exists"
      exit 1
      ;;
  esac
fi
