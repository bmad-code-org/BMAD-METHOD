#!/bin/bash
#
# File: .claude/hooks/sentiment-manager.sh
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
# @fileoverview Sentiment Manager - Applies personality styles to current voice without changing the voice itself
# @context Allows adding emotional/tonal layers (flirty, sarcastic, etc.) to any voice while preserving voice identity
# @architecture Reuses personality markdown files, stores sentiment separately from personality
# @dependencies .claude/personalities/*.md files, play-tts.sh for acknowledgment
# @entrypoints Called by /agent-vibes:sentiment slash command
# @patterns Personality/sentiment separation, state file management, random example selection
# @related personality-manager.sh, .claude/personalities/*.md, .claude/tts-sentiment.txt

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PERSONALITIES_DIR="$SCRIPT_DIR/../personalities"

# Project-local file first, global fallback
# Use logical path (not physical) to handle symlinked .claude directories
# Script is at .claude/hooks/sentiment-manager.sh, so .claude is ..
CLAUDE_DIR="$(cd "$SCRIPT_DIR/.." 2>/dev/null && pwd)"

# Check if we have a project-local .claude directory
if [[ -d "$CLAUDE_DIR" ]] && [[ "$CLAUDE_DIR" != "$HOME/.claude" ]]; then
  SENTIMENT_FILE="$CLAUDE_DIR/tts-sentiment.txt"
else
  SENTIMENT_FILE="$HOME/.claude/tts-sentiment.txt"
fi

# Function to get personality data from markdown file
get_personality_data() {
  local personality="$1"
  local field="$2"
  local file="$PERSONALITIES_DIR/${personality}.md"

  if [[ ! -f "$file" ]]; then
    return 1
  fi

  case "$field" in
    description)
      grep "^description:" "$file" | cut -d: -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
      ;;
  esac
}

# Function to list all available personalities
list_personalities() {
  if [[ -d "$PERSONALITIES_DIR" ]]; then
    for file in "$PERSONALITIES_DIR"/*.md; do
      if [[ -f "$file" ]]; then
        basename "$file" .md
      fi
    done
  fi
}

case "$1" in
  list)
    echo "🎭 Available Sentiments:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Get current sentiment
    CURRENT="none"
    if [ -f "$SENTIMENT_FILE" ]; then
      CURRENT=$(cat "$SENTIMENT_FILE")
    fi

    # List personalities from markdown files
    echo "Available sentiment styles:"
    for personality in $(list_personalities | sort); do
      desc=$(get_personality_data "$personality" "description")
      if [[ "$personality" == "$CURRENT" ]]; then
        echo "  ✓ $personality - $desc (current)"
      else
        echo "  - $personality - $desc"
      fi
    done

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Usage: /agent-vibes:sentiment <name>"
    echo "       /agent-vibes:sentiment clear"
    ;;

  set)
    SENTIMENT="$2"

    if [[ -z "$SENTIMENT" ]]; then
      echo "❌ Please specify a sentiment name"
      echo "Usage: $0 set <sentiment>"
      exit 1
    fi

    # Check if sentiment file exists
    if [[ ! -f "$PERSONALITIES_DIR/${SENTIMENT}.md" ]]; then
      echo "❌ Sentiment not found: $SENTIMENT"
      echo ""
      echo "Available sentiments:"
      for p in $(list_personalities | sort); do
        echo "  • $p"
      done
      exit 1
    fi

    # Save the sentiment (but don't change personality or voice)
    echo "$SENTIMENT" > "$SENTIMENT_FILE"
    echo "🎭 Sentiment set to: $SENTIMENT"
    echo "🎤 Voice remains unchanged"
    echo ""

    # Make a sentiment-appropriate remark with TTS
    TTS_SCRIPT="$SCRIPT_DIR/play-tts.sh"

    # Try to get acknowledgment from personality file (sentiments use same personality files)
    PERSONALITY_FILE_PATH="$PERSONALITIES_DIR/${SENTIMENT}.md"
    REMARK=""

    if [[ -f "$PERSONALITY_FILE_PATH" ]]; then
      # Extract example responses from personality file (lines starting with "- ")
      mapfile -t EXAMPLES < <(grep '^- "' "$PERSONALITY_FILE_PATH" | sed 's/^- "//; s/"$//')

      if [[ ${#EXAMPLES[@]} -gt 0 ]]; then
        # Pick a random example
        REMARK="${EXAMPLES[$RANDOM % ${#EXAMPLES[@]}]}"
      fi
    fi

    # Fallback if no examples found
    if [[ -z "$REMARK" ]]; then
      REMARK="Sentiment set to ${SENTIMENT} while maintaining current voice"
    fi

    echo "💬 $REMARK"
    "$TTS_SCRIPT" "$REMARK"
    ;;

  get)
    if [ -f "$SENTIMENT_FILE" ]; then
      CURRENT=$(cat "$SENTIMENT_FILE")
      echo "Current sentiment: $CURRENT"

      desc=$(get_personality_data "$CURRENT" "description")
      [[ -n "$desc" ]] && echo "Description: $desc"
    else
      echo "Current sentiment: none (voice personality only)"
    fi
    ;;

  clear)
    rm -f "$SENTIMENT_FILE"
    echo "🎭 Sentiment cleared - using voice personality only"
    ;;

  *)
    # If a single argument is provided and it's not a command, treat it as "set <sentiment>"
    if [[ -n "$1" ]] && [[ -f "$PERSONALITIES_DIR/${1}.md" ]]; then
      exec "$0" set "$1"
    else
      echo "AgentVibes Sentiment Manager"
      echo ""
      echo "Commands:"
      echo "  list                - List all sentiments"
      echo "  set <name>          - Set sentiment for current voice"
      echo "  get                 - Show current sentiment"
      echo "  clear               - Clear sentiment"
      echo ""
      echo "Examples:"
      echo "  /agent-vibes:sentiment flirty     # Add flirty style to current voice"
      echo "  /agent-vibes:sentiment sarcastic  # Add sarcasm to current voice"
      echo "  /agent-vibes:sentiment clear      # Remove sentiment"
    fi
    ;;
esac
