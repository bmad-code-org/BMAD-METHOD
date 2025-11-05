#!/bin/bash
#
# File: .claude/hooks/play-tts.sh
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
# @fileoverview TTS Provider Router with Language Learning Support
# @context Routes TTS requests to active provider (ElevenLabs or Piper)
# @architecture Provider abstraction layer - single entry point for all TTS
# @dependencies provider-manager.sh, play-tts-elevenlabs.sh, play-tts-piper.sh, github-star-reminder.sh
# @entrypoints Called by hooks, slash commands, personality-manager.sh, and all TTS features
# @patterns Provider pattern - delegates to provider-specific implementations, auto-detects provider from voice name
# @related provider-manager.sh, play-tts-elevenlabs.sh, play-tts-piper.sh, learn-manager.sh
#

# Fix locale warnings
export LC_ALL=C

TEXT="$1"
VOICE_OVERRIDE="$2"  # Optional: voice name or ID

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source provider manager to get active provider
source "$SCRIPT_DIR/provider-manager.sh"

# Get active provider
ACTIVE_PROVIDER=$(get_active_provider)

# Show GitHub star reminder (once per day)
"$SCRIPT_DIR/github-star-reminder.sh" 2>/dev/null || true

# @function detect_voice_provider
# @intent Auto-detect provider from voice name (for mixed-provider support)
# @why Allow ElevenLabs for main language + Piper for target language
# @param $1 voice name/ID
# @returns Provider name (elevenlabs or piper)
detect_voice_provider() {
  local voice="$1"
  # Piper voice names contain underscore and dash (e.g., es_ES-davefx-medium)
  if [[ "$voice" == *"_"*"-"* ]]; then
    echo "piper"
  else
    echo "$ACTIVE_PROVIDER"
  fi
}

# Override provider if voice indicates different provider (mixed-provider mode)
if [[ -n "$VOICE_OVERRIDE" ]]; then
  DETECTED_PROVIDER=$(detect_voice_provider "$VOICE_OVERRIDE")
  if [[ "$DETECTED_PROVIDER" != "$ACTIVE_PROVIDER" ]]; then
    ACTIVE_PROVIDER="$DETECTED_PROVIDER"
  fi
fi

# Normal single-language mode - route to appropriate provider implementation
# Note: For learning mode, the output style will call this script TWICE:
# 1. First call with main language text and current voice
# 2. Second call with translated text and target voice
case "$ACTIVE_PROVIDER" in
  elevenlabs)
    exec "$SCRIPT_DIR/play-tts-elevenlabs.sh" "$TEXT" "$VOICE_OVERRIDE"
    ;;
  piper)
    exec "$SCRIPT_DIR/play-tts-piper.sh" "$TEXT" "$VOICE_OVERRIDE"
    ;;
  *)
    echo "❌ Unknown provider: $ACTIVE_PROVIDER"
    echo "   Run: /agent-vibes:provider list"
    exit 1
    ;;
esac
