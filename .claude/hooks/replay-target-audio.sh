#!/bin/bash
#
# File: .claude/hooks/replay-target-audio.sh
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
# @fileoverview Replay Last Target Language Audio
# @context Replays the most recent target language TTS for language learning
# @architecture Simple audio replay with lock mechanism for sequential playback
# @dependencies ffprobe, paplay/aplay/mpg123/mpv, .claude/last-target-audio.txt
# @entrypoints Called by /agent-vibes:replay-target slash command
# @patterns Sequential audio playback with lock file, duration-based lock release
# @related play-tts-piper.sh, play-tts-elevenlabs.sh, learn-manager.sh
#

# Fix locale warnings
export LC_ALL=C

TARGET_AUDIO_FILE="${CLAUDE_PROJECT_DIR:-.}/.claude/last-target-audio.txt"

# Check if target audio tracking file exists
if [ ! -f "$TARGET_AUDIO_FILE" ]; then
  echo "❌ No target language audio found."
  echo "   Language learning mode may not be active."
  echo "   Activate with: /agent-vibes:learn"
  exit 1
fi

# Read last target audio file path
LAST_AUDIO=$(cat "$TARGET_AUDIO_FILE")

# Verify audio file exists
if [ ! -f "$LAST_AUDIO" ]; then
  echo "❌ Audio file not found: $LAST_AUDIO"
  echo "   The file may have been deleted or moved."
  exit 1
fi

echo "🔁 Replaying target language audio..."

# Use lock file for sequential playback
LOCK_FILE="/tmp/agentvibes-audio.lock"

# Wait for any current audio to finish (max 30 seconds)
for i in {1..60}; do
  if [ ! -f "$LOCK_FILE" ]; then
    break
  fi
  sleep 0.5
done

# Create lock
touch "$LOCK_FILE"

# Get audio duration for proper lock timing
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$LAST_AUDIO" 2>/dev/null)
DURATION=${DURATION%.*}  # Round to integer
DURATION=${DURATION:-1}   # Default to 1 second if detection fails

# Play audio
(paplay "$LAST_AUDIO" || aplay "$LAST_AUDIO" || mpg123 "$LAST_AUDIO" || mpv "$LAST_AUDIO") >/dev/null 2>&1 &
PLAYER_PID=$!

# Wait for audio to finish, then release lock
(sleep $DURATION; rm -f "$LOCK_FILE") &
disown

echo "✅ Replay complete: $(basename "$LAST_AUDIO")"
