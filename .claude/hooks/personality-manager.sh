#!/bin/bash
#
# File: .claude/hooks/personality-manager.sh
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
# @fileoverview Personality Manager - Adds character and emotional style to TTS voices
# @context Enables voices to have distinct personalities (flirty, sarcastic, pirate, etc.) with provider-aware voice assignment
# @architecture Markdown-based personality templates with provider-specific voice mappings (ElevenLabs vs Piper)
# @dependencies .claude/personalities/*.md files, voice-manager.sh, play-tts.sh, provider-manager.sh
# @entrypoints Called by /agent-vibes:personality slash commands
# @patterns Template-based configuration, provider abstraction, random personality support
# @related .claude/personalities/*.md, voice-manager.sh, .claude/tts-personality.txt

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PERSONALITIES_DIR="$SCRIPT_DIR/../personalities"

# Determine target .claude directory based on context
# Priority:
# 1. CLAUDE_PROJECT_DIR env var (set by MCP for project-specific settings)
# 2. Script location (for direct slash command usage)
# 3. Global ~/.claude (fallback)

if [[ -n "$CLAUDE_PROJECT_DIR" ]] && [[ -d "$CLAUDE_PROJECT_DIR/.claude" ]]; then
  # MCP context: Use the project directory where MCP was invoked
  CLAUDE_DIR="$CLAUDE_PROJECT_DIR/.claude"
else
  # Direct usage context: Use script location
  # Script is at .claude/hooks/personality-manager.sh, so .claude is ..
  CLAUDE_DIR="$(cd "$SCRIPT_DIR/.." 2>/dev/null && pwd)"

  # If script is in global ~/.claude, use that
  if [[ "$CLAUDE_DIR" == "$HOME/.claude" ]]; then
    CLAUDE_DIR="$HOME/.claude"
  elif [[ ! -d "$CLAUDE_DIR" ]]; then
    # Fallback to global if directory doesn't exist
    CLAUDE_DIR="$HOME/.claude"
  fi
fi

PERSONALITY_FILE="$CLAUDE_DIR/tts-personality.txt"

# Function to get personality data from markdown file
get_personality_data() {
  local personality="$1"
  local field="$2"
  local file="$PERSONALITIES_DIR/${personality}.md"

  if [[ ! -f "$file" ]]; then
    return 1
  fi

  case "$field" in
    prefix)
      sed -n '/^## Prefix/,/^##/p' "$file" | sed '1d;$d' | tr -d '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
      ;;
    suffix)
      sed -n '/^## Suffix/,/^##/p' "$file" | sed '1d;$d' | tr -d '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
      ;;
    description)
      grep "^description:" "$file" | cut -d: -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
      ;;
    voice)
      grep "^elevenlabs_voice:" "$file" | cut -d: -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
      ;;
    piper_voice)
      grep "^piper_voice:" "$file" | cut -d: -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
      ;;
    instructions)
      sed -n '/^## AI Instructions/,/^##/p' "$file" | sed '1d;$d'
      ;;
  esac
}

# Function to list all available personalities
list_personalities() {
  local personalities=()

  # Find all .md files in personalities directory
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
    echo "🎭 Available Personalities:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Get current personality
    CURRENT="normal"
    if [ -f "$PERSONALITY_FILE" ]; then
      CURRENT=$(cat "$PERSONALITY_FILE")
    fi

    # List personalities from markdown files
    echo "Built-in personalities:"
    for personality in $(list_personalities | sort); do
      desc=$(get_personality_data "$personality" "description")
      if [[ "$personality" == "$CURRENT" ]]; then
        echo "  ✓ $personality - $desc (current)"
      else
        echo "  - $personality - $desc"
      fi
    done

    # Add random option
    if [[ "$CURRENT" == "random" ]]; then
      echo "  ✓ random - Picks randomly each time (current)"
    else
      echo "  - random - Picks randomly each time"
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Usage: /agent-vibes:personality <name>"
    echo "       /agent-vibes:personality add <name>"
    echo "       /agent-vibes:personality edit <name>"
    ;;

  set|switch)
    PERSONALITY="$2"

    if [[ -z "$PERSONALITY" ]]; then
      echo "❌ Please specify a personality name"
      echo "Usage: $0 set <personality>"
      exit 1
    fi

    # Check if personality file exists (unless it's random)
    if [[ "$PERSONALITY" != "random" ]]; then
      if [[ ! -f "$PERSONALITIES_DIR/${PERSONALITY}.md" ]]; then
        echo "❌ Personality not found: $PERSONALITY"
        echo ""
        echo "Available personalities:"
        for p in $(list_personalities | sort); do
          echo "  • $p"
        done
        exit 1
      fi
    fi

    # Save the personality
    echo "$PERSONALITY" > "$PERSONALITY_FILE"
    echo "🎭 Personality set to: $PERSONALITY"

    # Check if personality has an assigned voice
    # Detect active TTS provider
    PROVIDER_FILE=""
    if [[ -f "$CLAUDE_DIR/tts-provider.txt" ]]; then
      PROVIDER_FILE="$CLAUDE_DIR/tts-provider.txt"
    elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
      PROVIDER_FILE="$HOME/.claude/tts-provider.txt"
    fi

    ACTIVE_PROVIDER="elevenlabs"  # default
    if [[ -n "$PROVIDER_FILE" ]]; then
      ACTIVE_PROVIDER=$(cat "$PROVIDER_FILE")
    fi

    # Get the appropriate voice based on provider
    ASSIGNED_VOICE=""
    if [[ "$ACTIVE_PROVIDER" == "piper" ]]; then
      # Try to get Piper-specific voice first
      ASSIGNED_VOICE=$(get_personality_data "$PERSONALITY" "piper_voice")
      if [[ -z "$ASSIGNED_VOICE" ]]; then
        # Fallback to default Piper voice
        ASSIGNED_VOICE="en_US-lessac-medium"
      fi
    else
      # Use ElevenLabs voice (reads from elevenlabs_voice: field)
      ASSIGNED_VOICE=$(get_personality_data "$PERSONALITY" "voice")
    fi

    if [[ -n "$ASSIGNED_VOICE" ]]; then
      # Switch to the assigned voice (silently - personality will do the talking)
      VOICE_MANAGER="$SCRIPT_DIR/voice-manager.sh"
      if [[ -x "$VOICE_MANAGER" ]]; then
        echo "🎤 Switching to assigned voice: $ASSIGNED_VOICE"
        "$VOICE_MANAGER" switch "$ASSIGNED_VOICE" --silent >/dev/null 2>&1
      fi
    fi

    # Make a personality-appropriate remark with TTS
    if [[ "$PERSONALITY" != "random" ]]; then
      echo ""

      # Get TTS script path
      TTS_SCRIPT="$SCRIPT_DIR/play-tts.sh"

      # Try to get acknowledgment from personality file
      PERSONALITY_FILE_PATH="$PERSONALITIES_DIR/${PERSONALITY}.md"
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
        REMARK="Personality set to ${PERSONALITY}!"
      fi

      echo "💬 $REMARK"
      "$TTS_SCRIPT" "$REMARK"

      echo ""
      echo "Note: AI will generate unique ${PERSONALITY} responses - no fixed templates!"
      echo ""
      echo "💡 Tip: To hear automatic TTS narration, enable the Agent Vibes output style:"
      echo "   /output-style Agent Vibes"
    fi
    ;;

  get)
    if [ -f "$PERSONALITY_FILE" ]; then
      CURRENT=$(cat "$PERSONALITY_FILE")
      echo "Current personality: $CURRENT"

      if [[ "$CURRENT" != "random" ]]; then
        desc=$(get_personality_data "$CURRENT" "description")
        [[ -n "$desc" ]] && echo "Description: $desc"
      fi
    else
      echo "Current personality: normal (default)"
    fi
    ;;

  add)
    NAME="$2"
    if [[ -z "$NAME" ]]; then
      echo "❌ Please specify a personality name"
      echo "Usage: $0 add <name>"
      exit 1
    fi

    FILE="$PERSONALITIES_DIR/${NAME}.md"
    if [[ -f "$FILE" ]]; then
      echo "❌ Personality '$NAME' already exists"
      echo "Use 'edit' to modify it"
      exit 1
    fi

    # Create new personality file
    cat > "$FILE" << 'EOF'
---
name: NAME
description: Custom personality
---

# NAME Personality

## Prefix


## Suffix


## AI Instructions
Describe how the AI should generate messages for this personality.

## Example Responses
- "Example response 1"
- "Example response 2"
EOF

    # Replace NAME with actual name
    sed -i "s/NAME/$NAME/g" "$FILE"

    echo "✅ Created new personality: $NAME"
    echo "📝 Edit the file: $FILE"
    echo ""
    echo "You can now customize:"
    echo "  • Prefix: Text before messages"
    echo "  • Suffix: Text after messages"
    echo "  • AI Instructions: How AI should speak"
    echo "  • Example Responses: Sample messages"
    ;;

  edit)
    NAME="$2"
    if [[ -z "$NAME" ]]; then
      echo "❌ Please specify a personality name"
      echo "Usage: $0 edit <name>"
      exit 1
    fi

    FILE="$PERSONALITIES_DIR/${NAME}.md"
    if [[ ! -f "$FILE" ]]; then
      echo "❌ Personality '$NAME' not found"
      echo "Use 'add' to create it first"
      exit 1
    fi

    echo "📝 Edit this file to customize the personality:"
    echo "$FILE"
    ;;

  reset)
    echo "normal" > "$PERSONALITY_FILE"
    echo "🎭 Personality reset to: normal"
    ;;

  set-favorite-voice)
    PERSONALITY="$2"
    NEW_VOICE="$3"

    if [[ -z "$PERSONALITY" ]] || [[ -z "$NEW_VOICE" ]]; then
      echo "❌ Please specify both personality name and voice name"
      echo "Usage: $0 set-favorite-voice <personality> <voice>"
      exit 1
    fi

    FILE="$PERSONALITIES_DIR/${PERSONALITY}.md"
    if [[ ! -f "$FILE" ]]; then
      echo "❌ Personality '$PERSONALITY' not found"
      exit 1
    fi

    # Detect active TTS provider
    PROVIDER_FILE=""
    if [[ -f "$CLAUDE_DIR/tts-provider.txt" ]]; then
      PROVIDER_FILE="$CLAUDE_DIR/tts-provider.txt"
    elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
      PROVIDER_FILE="$HOME/.claude/tts-provider.txt"
    fi

    ACTIVE_PROVIDER="elevenlabs"  # default
    if [[ -n "$PROVIDER_FILE" ]]; then
      ACTIVE_PROVIDER=$(cat "$PROVIDER_FILE")
    fi

    # Determine which field to update based on provider
    if [[ "$ACTIVE_PROVIDER" == "piper" ]]; then
      VOICE_FIELD="piper_voice"
      CURRENT_VOICE=$(get_personality_data "$PERSONALITY" "piper_voice")
    else
      VOICE_FIELD="elevenlabs_voice"
      CURRENT_VOICE=$(get_personality_data "$PERSONALITY" "voice")
    fi

    # Check if personality already has a favorite voice assigned
    if [[ -n "$CURRENT_VOICE" ]] && [[ "$CURRENT_VOICE" != "$NEW_VOICE" ]]; then
      echo "⚠️  WARNING: Personality '$PERSONALITY' already has a favorite voice assigned!"
      echo ""
      echo "   Current favorite ($ACTIVE_PROVIDER): $CURRENT_VOICE"
      echo "   New voice: $NEW_VOICE"
      echo ""
      echo "Do you want to replace the favorite voice?"
      echo ""
      read -p "Enter your choice (yes/no): " CHOICE

      case "$CHOICE" in
        yes|y|YES|Y)
          echo "✅ Replacing favorite voice..."
          ;;
        no|n|NO|N)
          echo "❌ Keeping current favorite voice: $CURRENT_VOICE"
          exit 0
          ;;
        *)
          echo "❌ Invalid choice. Keeping current favorite voice: $CURRENT_VOICE"
          exit 1
          ;;
      esac
    fi

    # Update the voice in the personality file
    if grep -q "^${VOICE_FIELD}:" "$FILE"; then
      # Field exists, replace it
      sed -i "s/^${VOICE_FIELD}:.*/${VOICE_FIELD}: ${NEW_VOICE}/" "$FILE"
    else
      # Field doesn't exist, add it after the frontmatter
      sed -i "/^---$/,/^---$/ { /^---$/a\\
${VOICE_FIELD}: ${NEW_VOICE}
}" "$FILE"
    fi

    echo "✅ Favorite voice for '$PERSONALITY' personality set to: $NEW_VOICE ($ACTIVE_PROVIDER)"
    echo "📝 Updated file: $FILE"
    ;;

  *)
    # If a single argument is provided and it's not a command, treat it as "set <personality>"
    if [[ -n "$1" ]] && [[ -f "$PERSONALITIES_DIR/${1}.md" || "$1" == "random" ]]; then
      # Call set with the personality name
      exec "$0" set "$1"
    else
      echo "AgentVibes Personality Manager"
      echo ""
      echo "Commands:"
      echo "  list                              - List all personalities"
      echo "  set/switch <name>                 - Set personality"
      echo "  add <name>                        - Create new personality"
      echo "  edit <name>                       - Show path to edit personality"
      echo "  get                               - Show current personality"
      echo "  set-favorite-voice <name> <voice> - Set favorite voice for a personality"
      echo "  reset                             - Reset to normal"
      echo ""
      echo "Examples:"
      echo "  /agent-vibes:personality flirty"
      echo "  /agent-vibes:personality add cowboy"
      echo "  /agent-vibes:personality set-favorite-voice flirty \"Aria\""
    fi
    ;;
esac