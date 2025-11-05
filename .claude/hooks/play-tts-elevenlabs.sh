#!/bin/bash
#
# File: .claude/hooks/play-tts-elevenlabs.sh
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
# @fileoverview ElevenLabs TTS Provider Implementation - Premium cloud-based TTS
# @context Provider-specific implementation for ElevenLabs API integration with multilingual support
# @architecture Part of multi-provider TTS system - implements provider interface contract
# @dependencies Requires ELEVENLABS_API_KEY, curl, ffmpeg, paplay/aplay/mpg123, jq
# @entrypoints Called by play-tts.sh router with ($1=text, $2=voice_name) when provider=elevenlabs
# @patterns Follows provider contract: accept text/voice, output audio file path, API error handling, SSH audio optimization
# @related play-tts.sh, provider-manager.sh, voices-config.sh, language-manager.sh, GitHub Issue #25
#

# Fix locale warnings
export LC_ALL=C

TEXT="$1"
VOICE_OVERRIDE="$2"  # Optional: voice name or direct voice ID
API_KEY="${ELEVENLABS_API_KEY}"

# Check for project-local pretext configuration
CONFIG_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/config"
CONFIG_FILE="$CONFIG_DIR/agentvibes.json"

if [[ -f "$CONFIG_FILE" ]] && command -v jq &> /dev/null; then
  PRETEXT=$(jq -r '.pretext // empty' "$CONFIG_FILE" 2>/dev/null)
  if [[ -n "$PRETEXT" ]]; then
    TEXT="$PRETEXT: $TEXT"
  fi
fi

# Limit text length to prevent API issues (max 500 chars for safety)
if [ ${#TEXT} -gt 500 ]; then
  TEXT="${TEXT:0:497}..."
  echo "⚠️ Text truncated to 500 characters for API safety"
fi

# Source the single voice configuration file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/voices-config.sh"
source "$SCRIPT_DIR/language-manager.sh"

# @function determine_voice_and_language
# @intent Resolve voice name/ID and language for multilingual support
# @why Supports both voice names and direct IDs, plus language-specific voices
# @param $VOICE_OVERRIDE {string} Voice name or ID (optional)
# @returns Sets $VOICE_ID and $LANGUAGE_CODE global variables
# @sideeffects None
# @edgecases Handles unknown voices, falls back to default
VOICE_ID=""
LANGUAGE_CODE="en"  # Default to English

# Get current language setting
CURRENT_LANGUAGE=$(get_language_code)

# Get language code for API
# ElevenLabs uses 2-letter ISO codes
case "$CURRENT_LANGUAGE" in
  spanish) LANGUAGE_CODE="es" ;;
  french) LANGUAGE_CODE="fr" ;;
  german) LANGUAGE_CODE="de" ;;
  italian) LANGUAGE_CODE="it" ;;
  portuguese) LANGUAGE_CODE="pt" ;;
  chinese) LANGUAGE_CODE="zh" ;;
  japanese) LANGUAGE_CODE="ja" ;;
  korean) LANGUAGE_CODE="ko" ;;
  russian) LANGUAGE_CODE="ru" ;;
  polish) LANGUAGE_CODE="pl" ;;
  dutch) LANGUAGE_CODE="nl" ;;
  turkish) LANGUAGE_CODE="tr" ;;
  arabic) LANGUAGE_CODE="ar" ;;
  hindi) LANGUAGE_CODE="hi" ;;
  swedish) LANGUAGE_CODE="sv" ;;
  danish) LANGUAGE_CODE="da" ;;
  norwegian) LANGUAGE_CODE="no" ;;
  finnish) LANGUAGE_CODE="fi" ;;
  czech) LANGUAGE_CODE="cs" ;;
  romanian) LANGUAGE_CODE="ro" ;;
  ukrainian) LANGUAGE_CODE="uk" ;;
  greek) LANGUAGE_CODE="el" ;;
  bulgarian) LANGUAGE_CODE="bg" ;;
  croatian) LANGUAGE_CODE="hr" ;;
  slovak) LANGUAGE_CODE="sk" ;;
  english|*) LANGUAGE_CODE="en" ;;
esac

if [[ -n "$VOICE_OVERRIDE" ]]; then
  # Check if override is a voice name (lookup in mapping)
  if [[ -n "${VOICES[$VOICE_OVERRIDE]}" ]]; then
    VOICE_ID="${VOICES[$VOICE_OVERRIDE]}"
    echo "🎤 Using voice: $VOICE_OVERRIDE (session-specific)"
  # Check if override looks like a voice ID (alphanumeric string ~20 chars)
  elif [[ "$VOICE_OVERRIDE" =~ ^[a-zA-Z0-9]{15,30}$ ]]; then
    VOICE_ID="$VOICE_OVERRIDE"
    echo "🎤 Using custom voice ID (session-specific)"
  else
    echo "⚠️ Unknown voice '$VOICE_OVERRIDE', trying language-specific voice"
  fi
fi

# If no override or invalid override, use language-specific voice
if [[ -z "$VOICE_ID" ]]; then
  # Try to get voice for current language
  LANG_VOICE=$(get_voice_for_language "$CURRENT_LANGUAGE" "elevenlabs" 2>/dev/null)

  if [[ -n "$LANG_VOICE" ]] && [[ -n "${VOICES[$LANG_VOICE]}" ]]; then
    VOICE_ID="${VOICES[$LANG_VOICE]}"
    echo "🌍 Using $CURRENT_LANGUAGE voice: $LANG_VOICE"
  else
    # Fall back to voice manager
    VOICE_MANAGER_SCRIPT="$(dirname "$0")/voice-manager.sh"
    if [[ -f "$VOICE_MANAGER_SCRIPT" ]]; then
      VOICE_NAME=$("$VOICE_MANAGER_SCRIPT" get)
      VOICE_ID="${VOICES[$VOICE_NAME]}"
    fi

    # Final fallback to default
    if [[ -z "$VOICE_ID" ]]; then
      echo "⚠️ No voice configured, using default"
      VOICE_ID="${VOICES[Aria]}"
    fi
  fi
fi

# @function validate_inputs
# @intent Check required parameters and API key
# @why Fail fast with clear errors if inputs missing
# @exitcode 1=missing text, 2=missing API key
if [ -z "$TEXT" ]; then
  echo "Usage: $0 \"text to speak\" [voice_name_or_id]"
  exit 1
fi

if [ -z "$API_KEY" ]; then
  echo "Error: ELEVENLABS_API_KEY not set"
  echo "Set your API key: export ELEVENLABS_API_KEY=your_key_here"
  exit 2
fi

# @function determine_audio_directory
# @intent Find appropriate directory for audio file storage
# @why Supports project-local and global storage
# @returns Sets $AUDIO_DIR global variable
# @sideeffects None
# @edgecases Handles missing directories, creates if needed
# AI NOTE: Check project dir first, then search up tree, finally fall back to global
if [[ -n "$CLAUDE_PROJECT_DIR" ]]; then
  AUDIO_DIR="$CLAUDE_PROJECT_DIR/.claude/audio"
else
  # Fallback: try to find .claude directory in current path
  CURRENT_DIR="$PWD"
  while [[ "$CURRENT_DIR" != "/" ]]; do
    if [[ -d "$CURRENT_DIR/.claude" ]]; then
      AUDIO_DIR="$CURRENT_DIR/.claude/audio"
      break
    fi
    CURRENT_DIR=$(dirname "$CURRENT_DIR")
  done
  # Final fallback to global if no project .claude found
  if [[ -z "$AUDIO_DIR" ]]; then
    AUDIO_DIR="$HOME/.claude/audio"
  fi
fi

mkdir -p "$AUDIO_DIR"
TEMP_FILE="$AUDIO_DIR/tts-$(date +%s).mp3"

# @function synthesize_with_elevenlabs
# @intent Call ElevenLabs API to generate speech
# @why Encapsulates API call with error handling
# @param Uses globals: $TEXT, $VOICE_ID, $API_KEY
# @returns Creates audio file at $TEMP_FILE
# @exitcode 0=success, 3=API error
# @sideeffects Creates MP3 file in audio directory
# @edgecases Handles network failures, API errors, rate limiting
# Choose model based on language
if [[ "$LANGUAGE_CODE" == "en" ]]; then
  MODEL_ID="eleven_monolingual_v1"
else
  MODEL_ID="eleven_multilingual_v2"
fi

# @function get_speech_speed
# @intent Read speed config and map to ElevenLabs API range (0.7-1.2)
# @why ElevenLabs only supports 0.7 (slower) to 1.2 (faster), must map user scale
# @returns Speed value for ElevenLabs API (clamped to 0.7-1.2)
get_speech_speed() {
  local config_dir=""

  # Determine config directory
  if [[ -n "$CLAUDE_PROJECT_DIR" ]] && [[ -d "$CLAUDE_PROJECT_DIR/.claude" ]]; then
    config_dir="$CLAUDE_PROJECT_DIR/.claude/config"
  else
    # Try to find .claude in current path
    local current_dir="$PWD"
    while [[ "$current_dir" != "/" ]]; do
      if [[ -d "$current_dir/.claude" ]]; then
        config_dir="$current_dir/.claude/config"
        break
      fi
      current_dir=$(dirname "$current_dir")
    done
    # Fallback to global
    if [[ -z "$config_dir" ]]; then
      config_dir="$HOME/.claude/config"
    fi
  fi

  local main_speed_file="$config_dir/tts-speech-rate.txt"
  local target_speed_file="$config_dir/tts-target-speech-rate.txt"

  # Legacy file paths for backward compatibility
  local legacy_main_speed_file="$config_dir/piper-speech-rate.txt"
  local legacy_target_speed_file="$config_dir/piper-target-speech-rate.txt"

  local user_speed="1.0"

  # If this is a non-English voice and target config exists, use it
  if [[ "$CURRENT_LANGUAGE" != "english" ]]; then
    if [[ -f "$target_speed_file" ]]; then
      user_speed=$(cat "$target_speed_file" 2>/dev/null || echo "1.0")
    elif [[ -f "$legacy_target_speed_file" ]]; then
      user_speed=$(cat "$legacy_target_speed_file" 2>/dev/null || echo "1.0")
    else
      user_speed="0.5"  # Default slower for learning
    fi
  else
    # Otherwise use main config if available
    if [[ -f "$main_speed_file" ]]; then
      user_speed=$(grep -v '^#' "$main_speed_file" 2>/dev/null | grep -v '^$' | tail -1 || echo "1.0")
    elif [[ -f "$legacy_main_speed_file" ]]; then
      user_speed=$(grep -v '^#' "$legacy_main_speed_file" 2>/dev/null | grep -v '^$' | tail -1 || echo "1.0")
    fi
  fi

  # Map user scale (0.5=slower, 1.0=normal, 2.0=faster, 3.0=very fast)
  # to ElevenLabs range (0.7=slower, 1.0=normal, 1.2=faster)
  # Formula: elevenlabs_speed = 0.7 + (user_speed - 0.5) * 0.2
  # This maps: 0.5→0.7, 1.0→0.8, 2.0→1.0, 3.0→1.2
  # Actually, let's use a better mapping:
  # 0.5x → 0.7 (slowest ElevenLabs)
  # 1.0x → 1.0 (normal)
  # 2.0x → 1.15
  # 3.0x → 1.2 (fastest ElevenLabs)

  if command -v bc &> /dev/null; then
    local eleven_speed
    if (( $(echo "$user_speed <= 0.5" | bc -l) )); then
      eleven_speed="0.7"
    elif (( $(echo "$user_speed >= 3.0" | bc -l) )); then
      eleven_speed="1.2"
    elif (( $(echo "$user_speed <= 1.0" | bc -l) )); then
      # Map 0.5-1.0 to 0.7-1.0
      eleven_speed=$(echo "scale=2; 0.7 + ($user_speed - 0.5) * 0.6" | bc -l)
    else
      # Map 1.0-3.0 to 1.0-1.2
      eleven_speed=$(echo "scale=2; 1.0 + ($user_speed - 1.0) * 0.1" | bc -l)
    fi
    echo "$eleven_speed"
  else
    # Fallback without bc: just clamp to safe values
    if (( $(awk 'BEGIN {print ("'$user_speed'" <= 0.5)}') )); then
      echo "0.7"
    elif (( $(awk 'BEGIN {print ("'$user_speed'" >= 2.0)}') )); then
      echo "1.2"
    else
      echo "1.0"
    fi
  fi
}

SPEECH_SPEED=$(get_speech_speed)

# Build JSON payload with jq for proper escaping
PAYLOAD=$(jq -n \
  --arg text "$TEXT" \
  --arg model "$MODEL_ID" \
  --arg lang "$LANGUAGE_CODE" \
  --argjson speed "$SPEECH_SPEED" \
  '{
    text: $text,
    model_id: $model,
    language_code: $lang,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      speed: $speed
    }
  }')

curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
  -H "xi-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -o "${TEMP_FILE}"

# @function add_silence_padding
# @intent Add silence to beginning of audio to prevent WSL static
# @why WSL audio subsystem cuts off first ~200ms, causing static/clipping
# @param Uses global: $TEMP_FILE
# @returns Updates $TEMP_FILE to padded version
# @sideeffects Modifies audio file, removes original
# @edgecases Gracefully falls back to unpadded if ffmpeg unavailable
# Add silence padding to prevent WSL audio static
if [ -f "${TEMP_FILE}" ]; then
  # Check if ffmpeg is available for adding padding
  if command -v ffmpeg &> /dev/null; then
    PADDED_FILE="$AUDIO_DIR/tts-padded-$(date +%s).mp3"
    # Add 200ms of silence at the beginning to prevent static
    # Note: ElevenLabs returns mono audio, so we use mono silence
    ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono:d=0.2 -i "${TEMP_FILE}" \
      -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[out]" \
      -map "[out]" -c:a libmp3lame -b:a 128k -y "${PADDED_FILE}" 2>/dev/null

    if [ -f "${PADDED_FILE}" ]; then
      # Use padded file and clean up original
      rm -f "${TEMP_FILE}"
      TEMP_FILE="${PADDED_FILE}"
    fi
    # If padding failed, just use original file
  fi

  # @function play_audio
  # @intent Play generated audio file using available player with sequential playback
  # @why Support multiple audio players and prevent overlapping audio in learning mode
  # @param Uses global: $TEMP_FILE, $CURRENT_LANGUAGE
  # @sideeffects Plays audio with lock mechanism for sequential playback
  # @edgecases Falls through players until one works
  LOCK_FILE="/tmp/agentvibes-audio.lock"

  # Wait for previous audio to finish (max 30 seconds)
  for i in {1..60}; do
    if [ ! -f "$LOCK_FILE" ]; then
      break
    fi
    sleep 0.5
  done

  # Track last target language audio for replay command
  if [[ "$CURRENT_LANGUAGE" != "english" ]]; then
    TARGET_AUDIO_FILE="${CLAUDE_PROJECT_DIR:-.}/.claude/last-target-audio.txt"
    echo "${TEMP_FILE}" > "$TARGET_AUDIO_FILE"
  fi

  # Create lock and play audio
  touch "$LOCK_FILE"

  # Get audio duration for proper lock timing
  DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${TEMP_FILE}" 2>/dev/null)
  DURATION=${DURATION%.*}  # Round to integer
  DURATION=${DURATION:-1}   # Default to 1 second if detection fails

  # Convert to 48kHz stereo WAV for better SSH tunnel compatibility
  # ElevenLabs returns 44.1kHz mono MP3, which causes static over SSH audio tunnels
  # Converting to 48kHz stereo (Windows/PulseAudio native format) eliminates the static
  if [[ -n "$SSH_CONNECTION" ]] || [[ -n "$SSH_CLIENT" ]] || [[ -n "$VSCODE_IPC_HOOK_CLI" ]]; then
    CONVERTED_FILE="${TEMP_FILE%.mp3}.wav"
    if ffmpeg -i "${TEMP_FILE}" -ar 48000 -ac 2 "${CONVERTED_FILE}" -y 2>/dev/null; then
      TEMP_FILE="${CONVERTED_FILE}"
    fi
  fi

  # Play audio (WSL/Linux) in background to avoid blocking, fully detached (skip if in test mode)
  if [[ "${AGENTVIBES_TEST_MODE:-false}" != "true" ]]; then
    (paplay "${TEMP_FILE}" || aplay "${TEMP_FILE}" || mpg123 "${TEMP_FILE}") >/dev/null 2>&1 &
    PLAYER_PID=$!
  fi

  # Wait for audio to finish, then release lock
  (sleep $DURATION; rm -f "$LOCK_FILE") &
  disown

  # Keep temp files for later review - cleaned up weekly by cron
  echo "🎵 Saved to: ${TEMP_FILE}"
  echo "🎤 Voice used: ${VOICE_NAME} (${VOICE_ID})"
else
  echo "❌ Failed to generate audio - API may be unavailable"
  echo "Check your API key and network connection"
  exit 3
fi
